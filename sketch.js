// Team : Ken Pao, Yuying Huang, Michael 
// Class: ART 259
// Assignment: Project 3
// Title: TBD 
// Version: 1.0
// Game link: https://github.com/ART-259/p3-final
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let l1,l2,l3,l4; // Ball's Y-coordinate
let p1,p2,p3,p4; // Player catchers
let startBtn; // Start Button
let gameStart; // Game Start state
let score; // Score
let balls=[]; // Array of Balls to keep track of gameplay
let gameTime, startTime, ltime, levelTime; // Timing variables
let endMessage; // end user message

function setup() {
  let cnv = createCanvas(windowWidth*0.8, windowHeight*0.8);
  cnv.parent('p3');

  l1 = new Group();
  l2 = new Group();
  l3 = new Group();
  l4 = new Group();
  l1.x = width*0.2;
  l2.x = width*0.4;
  l3.x = width*0.6;
  l4.x = width*0.8;
  l1.y = height*0.2;
  l2.y = height*0.2;
  l3.y = height*0.2;
  l4.y = height*0.2;
  l1.d = 100;
  l2.d = 100;
  l3.d = 100;
  l4.d = 100;
  l1.vel.y = 3;
  l2.vel.y = 3;
  l3.vel.y = 3;
  l4.vel.y = 3;
  l1.layer = 1;
  l2.layer = 1;
  l3.layer = 1;
  l4.layer = 1;
  l1.collider = 'd';
  l2.collider = 'd';
  l3.collider = 'd';
  l4.collider = 'd';

  l1.color = 'lightgreen';
  l2.color = 'lightblue';
  l3.color = 'pink';
  l4.color = '#CBC3E3';
  l1.visible = false;
  l2.visible = false;
  l3.visible = false;
  l4.visible = false;

  p1 = new Sprite(l1.x, height*0.9, 100, 's');
  p2 = new Sprite(l2.x, height*0.9, 100, 'd');
  p3 = new Sprite(l3.x, height*0.9, 100, 'n');
  p4 = new Sprite(l4.x, height*0.9, 100, 'k');
  p1.color = 'green';
  p2.color = 'blue';
  p3.color = '#ff00ff';
  p4.color = 'purple';
  p1.layer = 2;
  p2.layer = 2;
  p3.layer = 2;
  p4.layer = 2;
  p1.visible = false;
  p2.visible = false;
  p3.visible = false;
  p4.visible = false;



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

    l1.visible = true;
    l2.visible = true;
    l3.visible = true;
    l4.visible = true;
    p1.visible = true;
    p2.visible = true;
    p3.visible = true;
    p4.visible = true;
  
    // create beats

    if (l1.length < 1){
      let b1 = new l1.Sprite();
      p1.overlaps(b1, checkCatch);
    }
    if (l2.length < 1){
      let b2 = new l2.Sprite();
      p2.overlaps(b2, checkCatch);
    }
    if (l3.length < 1){
      let b3 = new l3.Sprite();
      p3.overlaps(b3, checkCatch);
    }
    if (l4.length < 1){
      let b4 = new l4.Sprite();
      p4.overlaps(b4, checkCatch);
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

function checkCatch(player, ball){
  if (kb.pressing('w')){
    p1.color = "#65FD08";
    if (dist(p1.x, p1.y, ball.x, ball.y) < 100){
      ball.remove();
      score += 10;
    }
  } else if (kb.pressing('a')){
    p2.color = "aqua";
    if (dist(p2.x, p2.y, ball.x, ball.y) < 100){
      ball.remove();
      score += 10;
    }
  } else if (kb.pressing('s')){
    p3.color = "red";
    if (dist(p3.x, p3.y, ball.x, ball.y) < 100){
      ball.remove();
      score += 10;
    }
  } else if (kb.pressing('d')){
    p4.color = "#CCB2D2";
    if (dist(p4.x, p4.y, ball.x, ball.y) < 100){
      ball.remove();
      score += 10;
    }
  } else {
    score--;
  }
}

function resetGame(){
  score = 0;
  balls = [];
  l1.visible = false;
  l2.visible = false;
  l3.visible = false;
  l4.visible = false;
  p1.visible = false;
  p2.visible = false;
  p3.visible = false;
  p4.visible = false;
}

// Window resized function will run when "reload" after a browser window resize
function windowResized(){
  // Canvas is set to 95% width and height - match setup scale
  resizeCanvas(windowWidth*0.8, windowHeight*0.8);
}
