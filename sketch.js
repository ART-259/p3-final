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
let score;
let balls=[];
let gameTime, startTime, ltime, levelTime;
let endMessage;

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
  l1.color = 'lightgreen';
  l2.color = 'lightblue';
  l3.color = 'pink';
  l4.color = '#CBC3E3';
  l1.visible = false;
  l2.visible = false;
  l3.visible = false;
  l4.visible = false;

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

    // Loop the ball back to the top
    if (balls.length < 4){
      balls.push(new l1.Sprite());
      balls.push(new l2.Sprite());
      balls.push(new l3.Sprite());
      balls.push(new l4.Sprite());
    }

    for (let i = 0; i < balls.length; i++){
      if (balls[i].y > height) {
        balls[i].remove();
        score++; // Increment the score
      }
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

function resetGame(){
  score = 0;
  // startBtn.visible = true;
  // startBtn.collider = 's';
}
