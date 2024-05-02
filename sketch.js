// Team : Ken Pao, Yuying Huang, Michael Martin
// Class: ART 259
// Assignment: Project 3
// Title: Sonic Nights 
// Version: 2.5
// Game repo: https://github.com/ART-259/p3-final
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let posX, c, cp, k; // Postion-X, Color, Color-Pressed, Key;
let bg = [], ballImgs = []; // Images
let p = []; // Player catchers
let startBtn; // Start Button
let gameStart; // Game Start state
let score, pc, gc, mc; // Score
let beats = [], b; // Beats to keep track of gameplay
let gameTime, startTime, lTime; //, levelTime; // Timing variables
let endMessage; // End user message
let catchMessage = [], catchImg = []; // Display if beat is catched
let song = [], songIndex, amp, audiocontext; // Music
let pChar, gChar, mChar;

function preload() {

  for (let i = 0; i < 3; i++) {
    catchImg.push(loadImage('image/cm' + i + '.png'));
  }

  for (let i = 0; i < 4; i++) {
    bg.push(loadImage('image/bg' + i + '.png'));
    ballImgs.push(loadImage('image/Ball' + i + '.png'));
    song.push(loadSound('sound/s' + i + '.mp3'));
  }
}

function setup() {

  let cnv = createCanvas(windowWidth * 0.9, windowHeight * 0.9);
  cnv.parent('p3');

  posX = [width * 0.25, width * 0.42, width * 0.59, width * 0.75];
  c = ['green', 'blue', '#ff00ff', 'purple'];
  cp = ['lightgreen', 'aqua', 'pink', '#cbc3e3'];
  k = ['w', 'a', 's', 'd'];

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

    catchMessage.push(new Group());
    catchMessage[i].x = posX[i];
    catchMessage[i].y = height * 0.5;
    catchMessage[i].d = 1;
    catchMessage[i].vel.y = -1;
    catchMessage[i].life = 60;
    catchMessage[i].collider = 'n';
  }

  startBtn = new Sprite(width * 0.5, height * 0.5, 200, 's');
  startBtn.text = 'START';
  startBtn.textSize = 50;
  startBtn.textColor = '#cbc3e3';
  startBtn.color = 'darkblue';

  endMessage = new Sprite(width * 0.5, height * 0.3, 1, 'n');
  endMessage.color = 'purple';
  endMessage.visible = true;
  endMessage.textSize = 28;
  endMessage.textColor = '#cbc3e3';

  pChar = new Sprite(width*0.1, height*0.2, 100, 'n');
  gChar = new Sprite(width*0.1, height*0.45, 100, 'n'); 
  mChar = new Sprite(width*0.1, height*0.75, 100, 'n');
  pChar.addAni('act', 'image/2d-m-vamp-0.png', 1);
  gChar.addAni('act', 'image/2d-f-sam-0.png', 1);
  mChar.addAni('act', 'image/3d-f-vamp-0.png', 1);
  pChar.ani.frameDelay = 15;
  gChar.ani.frameDelay = 15;
  mChar.ani.frameDelay = 15;
  pChar.ani.noLoop();
  gChar.ani.noLoop();
  mChar.ani.noLoop();
  pChar.ani.stop();
  gChar.ani.stop();
  mChar.ani.stop();
  pChar.scale = 0.3;
  gChar.scale = 0.3;
  mChar.scale = 0.3;
  pChar.visible = false;
  gChar.visible = false;
  mChar.visible = false;

  songIndex = 0;
  // levelTime = song[songIndex].duration();
  score = 0;
  pc = 0;
  gc = 0;
  mc = 0;
  gameStart = false;
  audiocontext = getAudioContext();
}

function draw() {
  clear();

  startScreen();

  topBar();

  if (gameStart) {

    // play song
    playSong(songIndex);
    
    // create beats
    createBeats(songIndex);

    // Check keyboard pressing key - MakeyMakey mapped keys pressing
    for (let i = 0; i < 4; i++) {
      p[i].visible = true;
      if (kb.pressing(k[i])) {
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
      console.log('index', index, 'b', b, 'beats[index].length', beats[index].length);
    }

    // check losing condition
    loseBeat();

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

    gameTime = round(song[songIndex].duration() - song[songIndex].currentTime(),0);
  
  

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
      endScreen();
    }
  } else {
    // Show Title of Game and Instructions
    if ((startBtn.visible) && (startBtn.text === 'START')) {
      endMessage.text = "Press Spacebar to play";
      endMessage.visible = true;
      textAlign(LEFT);
      textSize(20);
      text('ART 259\
        \nProject 3\
        \nBy: Ken Pao,\
        \nYuying Huang,\
        \nMichael Martin', width * 0.02, height * 0.15);
    }
  }
}

function createBeats(i) {
  if (gameTime >= 0) {
    if (song[i].isPlaying()) {
      
      amp.toggleNormalize(1);
      let level = amp.getLevel();
      let l = level * 100;
      for (let x = 0; x < l; x++) {
        text('|', x + 20, 35);
      }
      if (level > 0) {
        if (level < 0.2) {
          if (beats[0].length < 1) {
            new beats[0].Sprite();
          } else if (beats[0].length < 2) {
            new beats[0].Sprite();
          } else if (beats[0].length < 3) {
            new beats[0].Sprite();
          }
        } else if (level < 0.4) {
          if (beats[1].length < 1) {
            new beats[1].Sprite();
          } else if (beats[1].length < 2) {
            new beats[1].Sprite();
          } else if (beats[1].length < 3) {
            new beats[1].Sprite();
          }
        } else if (level < 0.6) {
          if (beats[2].length < 1) {
            new beats[2].Sprite();
          } else if (beats[2].length < 2) {
            new beats[2].Sprite();
          } else if (beats[2].length < 3) {
            new beats[2].Sprite();
          }
        } else {
          if (beats[3].length < 1) {
            new beats[3].Sprite();
          } else if (beats[3].length < 2) {
            new beats[3].Sprite();
          } else if (beats[3].length < 3) {
            new beats[3].Sprite();
          }
        }
      } else {
        console.log('level', level);
      }
    }
  }
}

// Check Winning Condition
function catchBeat(i) {
  if (beats[i].length > 0) {
    for (let j = 0; j < beats[i].length; j++) {
      let temp = Math.abs(p[i].y - beats[i][j].y);

      // Perfect
      if (temp <= 25) {
        score += 50;
        pc++;
        let cm = new catchMessage[i].Sprite();
        cm.img = catchImg[0];
        beats[i][j].remove();
        pChar.ani.play(0);
        // Good
      } else if (temp <= 50) {
        score += 10;
        gc++;
        let cm = new catchMessage[i].Sprite();
        cm.img = catchImg[1];
        beats[i][j].remove();
        gChar.ani.play(0);        
      } 
    }
  }
  
}

// Check Losing Condition
function loseBeat() {
  for (let i = 0; i < beats.length; i++) {
    for (let j = 0; j < beats[i].length; j++) {
      // Miss
      if (beats[i][j].y > (height + 50)) {
        score--;
        mc++;
        let cm = new catchMessage[i].Sprite();
        cm.img = catchImg[2];
        beats[i][j].remove();
        mChar.ani.play(0);
      } 
    }
  }
  
}

function playSong(i) {
  // only play song when playing game (i.e game time > 0)
  if (gameTime > 0) {
    // if (i === 8){
    //   rSong[0].play();
    //   rSong[1].stop();
    //   amp = new p5.Amplitude();
    //   amp.setInput(rSong[0]);
    // } else
    // if (i == 9){
    //   rSong[1].play();
    //   rSong[0].stop();
    //   amp = new p5.Amplitude();
    //   amp.setInput(rSong[1]);
    // } else
    if (!song[i].isPlaying()) {
      // if (audiocontext.state !== 'running'){
      //   audiocontext.resume();
      // }
      song[i].play();
      // levelTime = round(song[i].duration(),1);
      // startTime = round(song[i].currentTime(),1);
      amp = new p5.Amplitude();
      amp.setInput(song[i]);
    }
    // else {
    //   for (let x = 0; x < song.length; x++){
    //     if (x !== i){
    //       song[x].stop();
    //     }
    //   }
    // }
  }
}

function startScreen(){
  
  background(bg[songIndex]);
  
  textSize(20);
  textAlign(LEFT);
  text(
    'Rules:\
    \n\nTap W A S D \
    \nto catch a beat\
    \n\nPerfect = +50 pts\
    \nGood   = +10 pts\
    \nMissed  =  -1 pt\
    \n\nGood Luck\
    \nand have fun!', width * 0.85, height * 0.5);

  noStroke();

  if (!gameStart){

    if (kb.presses('arrowDown')){
      songIndex++;
      songIndex = songIndex % song.length;
    }
    
    // let temp = false;
    // if (kb.presses('arrowUp')){
    //   if (temp){
    //     songIndex = 9;
    //     temp = !temp;
    //   } else {
    //     songIndex = 8;
    //     temp = !temp;
    //   }
    // }
    textAlign(CENTER);
    textSize(28);
    text('Current Song #'+songIndex+'\
    \nPress Down Arrow key to change next song.', width*0.5, height*0.7);
    if (keyIsDown(32)) {
      startBtn.visible = false;
      startBtn.collider = 'n';
      pChar.visible = true;
      gChar.visible = true;
      mChar.visible = true;
      startTime = millis();
      // songIndex = Math.floor(random(song.length));
      if (audiocontext.state !== 'running') {
        audiocontext.resume();
      }
    }
  }
}

function endScreen() {
  let m = `Perfect : ${pc}
         \nGood    : ${gc}
         \nMissed  : ${mc}`;
  let s = `Final Score\n\n${score}`;
  text(m, width * 0.3, height * 0.2);
  textSize(50);
  text(s, width * 0.65, height * 0.22);
  textSize(30);
  text('Press spacebar to replay', width * 0.5, height * 0.5);
  startBtn.text = 'Replay';

  for (let i = 0; i < song.length; i++) {
    if (song[i].isPlaying()) {
      song[i].stop();
    }
  }

  for (let i = 0; i < 4; i++) {
    p[i].visible = false;
    beats[i].removeAll();
  }
  startBtn.y = height * 0.65;
  startBtn.visible = true;
  startBtn.collider = 's';
  pChar.visible = false;
  gChar.visible = false;
  mChar.visible = false;
  // if (startBtn.mouse.hovering()) {
  //   startBtn.color = 'green';
  //   cursor(HAND);
  // } else {
  //   startBtn.color = 'purple';
  //   cursor(ARROW);
  // }
  textAlign(CENTER);
  textSize(22);
  text('Current Song #'+songIndex+'\
  \nPress Down Arrow key to change next song.', width*0.5, height*0.8);
  if (keyIsDown(32)) {
    if (gameStart) {
      gameStart = !gameStart;
    }

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
// Gameplay link : https://art-259.github.io/p3-final/
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
//              Version 1.8 - add song and play music only during game play
//              Version 2.0 - add background images
//                            add create beats base on sound amplitude
//                            add Perfect Good Miss feedback
//                            update start / replay key to spacebar
//                            adjust end screen parameters
//              Version 2.1 - fix replay sound issue
//                            fix audioContext for Chrome 7.1+ issue
//                            add temp favicon
//              Version 2.2 - fix spacebar key replay issue
//              Version 2.3 - add song selection to start screen and end screen
//              Version 2.4 - add 3 avatars images for animation
//              Version 2.5 - add animation with sprites and update algorithm
//
// ** Note: **
// All graphics are handcrafted and created by Snack Crew team.
// Temp Favicon: https://www.flaticon.com/free-icons/musical-note
///////////////////////////////////////////////////////////////////////////////

