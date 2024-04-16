// sketch.js

let bY; // Ball's Y-coordinate
let score = 0;

function setup() {
  createCanvas(400, 400);
  bY = 0; // Start the ball at the top
}

function draw() {
  background(220);

  // Draw the falling ball
  fill(255, 0, 0); // Red color
  ellipse(width / 2, bY, 20, 20); // Position and size of the ellipse

  // Update the ball's position
  bY += 5; // Move the ball downward (adjust speed as needed)

  // Loop the ball back to the top
  if (bY > height) {
    bY = 0;
    score++; // Increment the score
  }

  // Display the score
  fill(0); // Black color
  textSize(24);
  text(`Your Score: ${score}`, 20, 30);
}
