// Team : Ken Pao, Yuying Huang, Michael 
// Class: ART 259
// Assignment: Project 3
// Title: TBD 
// Version: 1.0
// Game link: https://github.com/ART-259/p3-final
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let posX, c, cp;
let p=[]; // Player catchers
let startBtn; // Start Button
let gameStart; // Game Start state
let score; // Score
let beats, b; // Beats to keep track of gameplay
let gameTime, startTime, ltime, levelTime; // Timing variables
let endMessage; // end user message

// class Beat {
//   constructor(x, y){
//     this.x = x;
//     this.y = y;
//     this.s = new Sprite(this.x, this.y, 100, 'd');
//     this.on = false;
//     this.s.vel.y = 3;
//     this.s.bounciness = 0;
//     this.s.rotationLock = true;
//   }

//   show(){
//     if (this.on){
//       this.s;
//     } else {
//       console.log('no beat');
//     }
//   }

//   setBeat(){
//     this.on = !this.on;
//   }

//   match(px, py){
//     if (dist(x,y,px,py)<100){
//       return true;
//     } else {
//       return false;
//     }
//   }
// }

function setup() {
  let cnv = createCanvas(windowWidth*0.8, windowHeight*0.8);
  cnv.parent('p3');

  posX = [width*0.2, width*0.4, width*0.6, width*0.8];
  c = ['green', 'blue', '#ff00ff', 'purple'];
  cp = ['lightgreen', 'aqua', 'pink', '#cbc3e3'];
  beats = new Group();
  beats.x = random(posX);
  beats.y = height*0.2;
  beats.d = 100;
  beats.collider = 'd';
  beats.vel.y = 3;
  // beats.visible = false;
  beats.color = '#3e3e3e';
  
  // l1.color = 'lightgreen';
  // l2.color = 'lightblue';
  // l3.color = 'pink';
  // l4.color = '#CBC3E3';

  for (let i = 0; i < 4; i++){
    p.push(new Sprite(posX[i], height*0.9, 100, 'n'));
    p[i].color = c[i];
    p[i].visible = false;
  }

  startBtn = new Sprite(width*0.5, height*0.5, 200, 's');
  startBtn.color = 'lime';
  startBtn.text = 'START';
  startBtn.textSize = 20;
  startBtn.textColor = 'blue';

  endMessage = new Sprite(width*0.5, height*0.3, 1, 'n');
  endMessage.color = 'lightyellow';
  endMessage.visible = true;
  endMessage.textSize = 20;
  endMessage.textColor = 'blue';

  levelTime = 10;
  score = 0;
  gameStart = false;

}

function draw() {
  clear();

  background('lightyellow');

  noStroke();

  topBar();

  if (startBtn.mouse.hovering()){
    startBtn.color = 'yellow';
    cursor(HAND);
  } else {
    startBtn.color = 'lime';
    cursor(ARROW);
  }

  if (startBtn.mouse.presses()){
    startBtn.visible = false;
    startBtn.collider = 'n';
    startTime = millis();
  }
 
  if (gameStart){

    // create beats
    if (beats.length < 5){
      if (gameTime % 2 === 0){
        b = new beats.Sprite();
        b.x = random(posX);
      }
    }

    for (let i = 0; i < 4; i++){
      p[i].visible = true;
    }

    
    if (kb.presses('b')){
      b = new beats.Sprite();
      b.x = random(posX);
    }

    if (kb.pressing('w')){
      p[0].color = cp[0];
      if (b.overlaps(p[0])){
        score += 10;
        b.remove();
      } 
    } else {
      p[0].color = c[0];
    }

    if (kb.pressing('a')){
      p[1].color = cp[1];
      if (b.overlaps(p[1])){
        score += 10;
        b.remove();
      } 
    } else {
      p[1].color = c[1];
    }

    if (kb.pressing('s')){
      p[2].color = cp[2];
      if (b.overlaps(p[2])){
        score += 10;
        b.remove();
      } 
    } else {
      p[2].color = c[2];
    }

    if (kb.pressing('d')){
      p[3].color = cp[3];
      if (b.overlaps(p[3])){
        score += 10;
        b.remove();
      } 
    } else {
      p[3].color = c[3];
    }
  } else {
    resetGame();
  }
}

function topBar(){
  textSize(20);
  fill('blue'); // set text color to blue
  textAlign(CENTER);

  ///// timer function /////
  lTime = 3 - round((millis()-startTime)/1000);
  gameTime = levelTime + 3 - round((millis()-startTime)/1000);

  if (lTime > 0){
    endMessage.visible = true;
    endMessage.text = 'Ready to Start in';
    if (lTime <= 3){
      textSize(20);
      text(lTime.toString(), width*0.5, height*0.45);
    }
  } else if (lTime == 0) {
    gameStart = true;
    endMessage.visible = false;
  }
  
  ///// Start game time when click Start /////
  if (gameStart){
    text('Score: '+score.toString(), width*0.5, height*0.05);

    ///// prevent time to run over 0 /////
    if (gameTime > 0) {
      text('Time : '+gameTime.toString(), width*0.85, height*0.05);

      // check winning condition

    }
    ///// stop game when time reaches 0 /////
    else {
      text('Time : 0', width*0.85, height*0.05);
      gameStart = false;
      startBtn.visible = true;
      startBtn.collider = 's';

      // check losing condition

    }
  } else {
    // Show Title of Game and Instructions
    if ((startBtn.visible) && (startBtn.text === 'START')){
      endMessage.text = "Click START to play";
      endMessage.visible = true;
      fill('blue');
      textAlign(LEFT);
      textSize(20);
      text('ART 259 Project 3\
        \nBy: Ken Pao, Yuying Huang, Michael Martin', width*0.05, height*0.7);
      text(
        'Rules:\
        \nTap W A S D to catch the beat\
        \nEach perfect catch = +10 points\
        \nEach missed beat   = -1 point\
        \nMatch as many beats as you can.',width*0.05,height*0.8);
    }
  }

//   // Mute control
//   if (soundBtn.mouse.presses()) {
//     isMute = !isMute;
//     console.log('isMute',isMute);
//   }

//   if (isMute){
//     if (soundBtn.mouse.hovering()){
//       soundBtn.img = soundHoverOffImg;
//     } else {
//       soundBtn.img = soundOffImg;
//     }
//   } else {
//     if (soundBtn.mouse.hovering()){
//       soundBtn.img = soundHoverOnImg;
//     } else {
//       soundBtn.img = soundOnImg;
//     }
//   }
}

// function checkCatch(player, ball){
//   if (kb.pressing('w')){
//     p1.color = "#65FD08";
//     if (dist(p1.x, p1.y, ball.x, ball.y) < 100){
//       ball.remove();
//       score += 10;
//     }
//   } else if (kb.pressing('a')){
//     p2.color = "aqua";
//     if (dist(p2.x, p2.y, ball.x, ball.y) < 100){
//       ball.remove();
//       score += 10;
//     }
//   } else if (kb.pressing('s')){
//     p3.color = "red";
//     if (dist(p3.x, p3.y, ball.x, ball.y) < 100){
//       ball.remove();
//       score += 10;
//     }
//   } else if (kb.pressing('d')){
//     p4.color = "#CCB2D2";
//     if (dist(p4.x, p4.y, ball.x, ball.y) < 100){
//       ball.remove();
//       score += 10;
//     }
//   } else {
//     score--;
//   }
// }

function resetGame(){
  score = 0;
  // balls = [];
  // l1.visible = false;
  // l2.visible = false;
  // l3.visible = false;
  // l4.visible = false;
  for (let i = 0; i < 4; i++){
    p[i].visible = false;
  }
}

// Window resized function will run when "reload" after a browser window resize
function windowResized(){
  // Canvas is set to 95% width and height - match setup scale
  resizeCanvas(windowWidth*0.8, windowHeight*0.8);
}
