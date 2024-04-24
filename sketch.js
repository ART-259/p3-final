// Team : Ken Pao, Yuying Huang, Michael Martin
// Class: ART 259
// Assignment: Project 3
// Title: TBD 
// Version: 1.7
// Game repo: https://github.com/ART-259/p3-final
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let posX, c, cp, k; // Postion-X, Color, Color-Pressed, Key;
let bg, ballImgs=[]; // Images
let p = []; // Player catchers
let startBtn; // Start Button
let gameStart; // Game Start state
let score, pc, gc, mc; // Score
let beats=[], b; // Beats to keep track of gameplay
let gameTime, startTime, lTime, levelTime; // Timing variables
let endMessage; // end user message

function preload() {
  bg = loadImage('image/bg-new.png');
  for (let i = 1; i < 5; i++){
    ballImgs.push(loadImage('image/Ball'+i+'.png'));
  }
}

function setup() {

  let cnv = createCanvas(windowWidth * 0.9, windowHeight * 0.9);
  cnv.parent('p3');

  posX = [width * 0.25, width * 0.42, width * 0.59, width * 0.75];
  c = ['green', 'blue', '#ff00ff', 'purple'];
  cp = ['lightgreen', 'aqua', 'pink', '#cbc3e3'];
  k = ['w','a','s','d'];

  for (let i = 0; i < 4; i++) {
    p.push(new Sprite(posX[i], height * 0.93, 100, 'n'));
    p[i].color = c[i];
    p[i].visible = false;

    beats.push(new Group());
    beats[i].x = posX[i];
    beats[i].y = height * 0.2;
    beats[i].d = 100;
    beats[i].vel.y = 3;
    beats[i].color = '#cbc3e3';
    ballImgs[i].resize(100, 100);
    beats[i].img = ballImgs[i];
  }

  startBtn = new Sprite(width * 0.5, height * 0.5, 200, 's');
  startBtn.text = 'START';
  startBtn.textSize = 50;
  startBtn.textColor = '#cbc3e3';

  endMessage = new Sprite(width * 0.5, height * 0.3, 1, 'n');
  endMessage.color = 'purple';
  endMessage.visible = true;
  endMessage.textSize = 28;
  endMessage.textColor = '#cbc3e3';

  levelTime = 10;
  score = 0;
  pc = 0;
  gc = 0;
  mc = 0;
  gameStart = false;
}

function draw() {
  clear();

  background(bg);

  noStroke();

  topBar();

  if (startBtn.mouse.hovering()) {
    startBtn.color = 'green';
    cursor(HAND);
  } else {
    startBtn.color = 'purple';
    cursor(ARROW);
  }

  if (startBtn.mouse.presses()) {
    startBtn.visible = false;
    startBtn.collider = 'n';
    startTime = millis();
  }

  if (gameStart) {

    // create beats
    if (gameTime % 2 === 0) {
      for (let i = 0; i < beats.length; i++) {
        if (beats[i].length < 1) {
          b = new beats[i].Sprite();
        }
      }
    }

    // Check keyboard pressing key - MakeyMakey mapped keys pressing
    for (let i = 0; i < 4; i++) {
      p[i].visible = true;
      if (kb.pressing(k[i])){
        p[i].color = cp[i];
        // check winning condition
        catchBeat(i);
      } else {
        p[i].color = c[i];
      }
    }

    // Manually generate beat
    if (kb.presses('b')) {
      let index = Math.floor(random(4));
      b = new beats[index].Sprite();
      console.log('index',index,'b',b,'beats[index].length',beats[index].length);
    }

    // check losing condition
    loseBeat();

  // gameStart = false
  } else {
    resetGame();
  }
}

function topBar() {
  textSize(30);
  fill('#cbc3e3'); // set text color to light purple
  textAlign(CENTER);

  ///// timer function /////
  lTime = 3 - round((millis() - startTime) / 1000);
  gameTime = levelTime + 3 - round((millis() - startTime) / 1000);

  if (lTime > 0) {
    endMessage.visible = true;
    endMessage.text = 'Ready to Start in';
    if (lTime <= 3) {
      textSize(30);
      text(lTime.toString(), width * 0.5, height * 0.45);
    }
  } else if (lTime == 0) {
    gameStart = true;
    endMessage.visible = false;
  }

  ///// Start game time when click Start /////
  if (gameStart) {
    text('Score: ' + score.toString(), width * 0.5, height * 0.05);

    ///// prevent time to run over 0 /////
    if (gameTime > 0) {
      text('Time : ' + gameTime.toString(), width * 0.85, height * 0.05);



    }
    ///// stop game when time reaches 0 /////
    else {
      text('Time : 0', width * 0.85, height * 0.05);
      // gameStart = false;
      endScreen();
      // startBtn.visible = true;
      // startBtn.collider = 's';



    }
  } else {
    // Show Title of Game and Instructions
    if ((startBtn.visible) && (startBtn.text === 'START')) {
      endMessage.text = "Click START to play";
      endMessage.visible = true;
      textAlign(LEFT);
      textSize(22);
      text('ART 259\
        \nProject 3\
        \nBy: Ken Pao,\
        \nYuying Huang,\
        \nMichael Martin', width * 0.02, height * 0.15);
      text(
        'Rules:\
        \n\nTap W A S D \
        \nto catch a beat\
        \n\nPerfect = +50 pts\
        \nGreat   = +10 pts\
        \nMissed  =  -1 pt\
        \n\nGood Luck\
        \nand have fun!', width * 0.02, height * 0.5);
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

// Check Winning Condition
function catchBeat(i) {
  if (beats[i].length > 0){
    for (let j = 0; j < beats[i].length; j++){
      let temp = Math.abs(p[i].y - beats[i][j].y);
      // Perfect
      if (temp <= 25){
        score += 50;
        pc++;
        beats[i][j].remove();
      // Great
      } else if (temp <= 50){
        score += 10;
        gc++;
        beats[i][j].remove();
      }
    }
  }
}

// Check Losing Condition
function loseBeat() {
  for (let i = 0; i < beats.length; i++) {
    for (let j = 0; j < beats[i].length; j++) {
      if (beats[i][j].y > (height + 50)) {
        score--;
        mc++;
        beats[i][j].remove();
      }
    }
  }
}

function endScreen() {
  endMessage.text=`You Win!
  \n\nPerfect : ${pc}
  \nGreat : ${gc}
  \nMissed : ${mc}
  \nTotal Score : ${score}`;
  endMessage.visible = true;
  startBtn.text = 'Replay';
// gameStart = false;

for (let i = 0; i < 4; i++) {
  p[i].visible = false;
  beats[i].removeAll();
}
startBtn.y = height * 0.7;
startBtn.visible = true;
startBtn.collider = 's';
if (startBtn.mouse.hovering()) {
  startBtn.color = 'green';
  cursor(HAND);
} else {
  startBtn.color = 'purple';
  cursor(ARROW);
}

if (startBtn.mouse.presses()) {
gameStart = false;
}
}

// Reset Game
function resetGame() {
  score = 0;
  pc = 0;
  gc = 0;
  mc = 0;
  
}

// Window resized function will run when "reload" after a browser window resize
function windowResized() {
  // Canvas is set to 95% width and height - match setup scale
  resizeCanvas(windowWidth * 0.8, windowHeight * 0.8);
}

///////////////////////////////////////////////////////////////////////////////
// Reference:
// P5play: https://p5play.org/learn/
// Using sprites for interactive gaming experience
//
// P5 JS lib: https://p5js.org/reference/
// Using p5.js library for building gaming infrastructure
//
// Team : Snack Crew
// Members : Ken Pao, Yuying Huang, Michael Martin
// Class: ART 259
// Assignment: Project 3 - Final
// Title: <TBD></TBD>
// Game repo : https://github.com/ART-259/p3-final
//
// Dev comment:
//              Version 1.0 - initial game template setup
//              Version 1.1 - added beats and player block design (ellipse)
//              Version 1.2 - adjust physical attribute for game mechanics - not working
//                            create custom class and play with p5.js and p5play features
//              Version 1.3 - readjust game mechanics - partially working
//              Version 1.4 - is the first working state of this rhythm game.
//              Version 1.5 - add mouse input for fun
//              Version 1.6 - fix beats catching algorithm and reconstruct beats array of arrays
//              Version 1.7 - add end screen
//
///////////////////////////////////////////////////////////////////////////////

