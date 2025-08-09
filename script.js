let player, dog;
let gameState = 0;
let bedroomImg, bedroomGrayImg, parkImg, parkGrayImg, dogImg;
let startButton;

let interactionMessage = "";
let messageTimer = 0;

let hopeMeter = 0;

let xBook = 320, yBook = 85;
let bookWidth = 40, bookHeight = 40;
let xBookCenter = xBook + bookWidth / 2, yBookCenter = yBook + bookHeight / 2;
let currentPage = 0;
let bookPages = [
  "Page 1: You open the book and a soft glow surrounds the pages.",
  "Page 2: 'Once upon a thread, there lived a girl of fabric and fire.'",
  "Page 3: 'Her world was stitched together by dreams and defiance.'",
  "Page 4: 'She searched for hope in the seams of shattered worlds.'",
  "Page 5: 'And found that courage was the thread that never broke.'",
  "Page 6: End of the chapter. Press R to return."
];

let interactionCooldown = 0;
let particles = [];

let bookMessageShown = false;
let dogPetLimit = 2;

function preload() {
  walkFrontAnim = loadAnimation('assets/playerf1.png','assets/playerf2.png','assets/playerf3.png','assets/playerf4.png','assets/playerf5.png');
  walkRightAnim = loadAnimation('assets/playerr1.png','assets/playerr2.png','assets/playerr3.png','assets/playerr4.png','assets/playerr5.png');
  walkBackAnim  = loadAnimation('assets/playerb1.png','assets/playerb2.png','assets/playerb3.png','assets/playerb4.png','assets/playerb5.png');
  walkLeftAnim  = loadAnimation('assets/playerl1.png','assets/playerl2.png','assets/playerl3.png','assets/playerl4.png','assets/playerl5.png');
  walkFrontAnim.frameDelay = walkRightAnim.frameDelay = walkBackAnim.frameDelay = walkLeftAnim.frameDelay = 8;

  bedroomImg     = loadImage('assets/bedroom.png');
  bedroomGrayImg = loadImage('assets/bedroomGray.png');
  parkImg        = loadImage('assets/park.jpg');
  parkGrayImg    = loadImage('assets/parkGray.jpg');

  dogImg = loadImage('assets/dog.png');
}

function setup() {
  createCanvas(600, 400);

  player = new Sprite(width/2, height/2, 30, 30);
  player.rotationLock = true;
  player.addAnimation('front', walkFrontAnim);
  player.addAnimation('right', walkRightAnim);
  player.addAnimation('back', walkBackAnim);
  player.addAnimation('left', walkLeftAnim);
  player.changeAnimation('front');
  player.scale = 0.5;
  player.visible = false;

  dog = new Sprite(520, height - 80, 40, 40);
  dog.addImage(dogImg);
  dog.scale = 0.17;
  dog.visible = false;

  startButton = new Sprite(width/2, height/2 + 60, 100, 40);
  startButton.text = "Start";
  startButton.color = '#444';
  startButton.textColor = 'white';
  startButton.textSize = 16;
  startButton.visible = true;
}

function draw() {
  background(220);

  if (interactionCooldown > 0) {
    interactionCooldown--;
  }

  switch (gameState) {
    case 0:
      scene0();
      break;
    case 1:
      scene1();
      handlePlayerMovement();
      checkBedroomInteractions();
      break;
    case 2:
      scene2();
      break;
    case 3:
      scene3();
      if (hopeMeter >= 100) {
        gameState = 4;
      }
      break;
    case 4:
      scene4();
      break;
    case 5:
      scene5();
      break;
  }

  drawSprites();
  drawHopeMeter();
}

function scene0() {
  image(bedroomGrayImg, 0, 0, width, height);
  fill(50);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(36);
  text("Threads of Hope", width / 2, height / 2 - 40);

  player.visible = dog.visible = false;
  startButton.visible = true;
  startButton.color = color(68, 68, 68, 180 + 70 * sin(frameCount * 0.1));
}

function scene1() {
  drawSceneWithHope(bedroomGrayImg, bedroomImg);
  player.visible = true;
  dog.visible = false;
  startButton.visible = false;
  drawBedroomHotspots();
}

function scene2() {
  background('plum');
  textAlign(CENTER, CENTER);
  textSize(22);
  fill(255);
  let cx = 200, cy = 200, w = 300, h = 150;
  fill(100, 0, 100, 60);
  noStroke();
  rectMode(CENTER);
  rect(cx, cy, w, h, 20);
  fill(255);
  text(bookPages[currentPage], cx, cy, w - 20, h - 20);
  textSize(16);
  if (currentPage < bookPages.length - 1) {
    text("Press SPACE to turn the page", width / 2, height - 40);
  } else {
    text("Press R to close the book", width / 2, height - 40);
  }
  player.visible = dog.visible = startButton.visible = false;
}

function scene3() {
  drawSceneWithHope(parkGrayImg, parkImg);
  player.visible = dog.visible = true;
  startButton.visible = false;

  if (player.position.x > width - 50) {
    player.position.x = 40;
    player.position.y = height - 70;
  }

  handlePlayerMovement();

  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("You are now in the park.", width / 2, 40);
  textSize(16);
  text("Press B to go back to your bedroom.", width / 2, 70);

  let dDog = dist(player.position.x, player.position.y, dog.position.x, dog.position.y);
  if (dDog < 50) {
    textSize(18);
    text("Press E to pet the dog or N to ignore it", width / 2, height - 80);

    if (kb.pressing('E') && interactionCooldown === 0 && dogPetLimit > 0) {
      increaseHope(25, "The dog wags its tail—your hope soars!");
      interactionCooldown = 30;  // cooldown for half a second approx
      dogPetLimit--;
    }

    if (kb.pressing('N') && interactionCooldown === 0) {
      gameState = 5;
      interactionCooldown = 30;
    }
  }
}

function scene4() {
  if (frameCount % 60 === 0) {
    particles = [];
  }

  background(0, 50, 100);

  if (hopeMeter >= 100) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    textStyle(BOLD);
    text("Threads of Hope", width / 2, height / 2 - 80);
    textSize(22);
    textStyle(NORMAL);
    text("Your hope has blossomed fully!", width / 2, height / 2 - 30);
    textSize(18);
    textStyle(ITALIC);
    text("You must try to find hope in the right places.", width / 2, height / 2 + 10);

    for (let i = 0; i < 5; i++) {
      particles.push({
        x: random(width),
        y: random(height),
        size: random(10, 30),
        alpha: random(100, 200),
        speedX: random(-1, 1),
        speedY: random(-1, 1)
      });
    }

    for (let p of particles) {
      fill(255, 255, 200, p.alpha);
      ellipse(p.x, p.y, p.size);
      p.x += p.speedX;
      p.y += p.speedY;
    }

    textSize(18);
    fill(220);
    text("Press R to restart or Q to quit", width / 2, height / 2 + 100);
  } else {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Hope is not yet full.", width / 2, height / 2);
    textSize(18);
    text("Press B to go back to your bedroom.", width / 2, height / 2 + 40);
  }

  player.visible = false;
  dog.visible = false;
  startButton.visible = false;
}

function scene5() {
  background(30, 20, 70);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(26);
  textStyle(BOLD);
  text("Even when we turn away from joy...", width / 2, height / 2 - 40);
  textSize(20);
  textStyle(NORMAL);
  text("Hope finds its way to us.\nMaybe it's time to seek it again.", width / 2, height / 2 + 10);
  text("Press R to restart your journey.", width / 2, height - 50);

  player.visible = false;
  dog.visible = false;
  startButton.visible = false;
}

function checkBedroomInteractions() {
  let dBook = dist(player.position.x, player.position.y, xBookCenter, yBookCenter);
  if (dBook < 50) {
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("Press E to read the book", width / 2, height - 50);
    if (kb.pressing('E') && interactionCooldown === 0) {
      gameState = 2;
      currentPage = 0;
      interactionCooldown = 30;
    }
  }

  let dx = width - 20, dy1 = height / 2 - 40, dy2 = height / 2 + 40;
  if (
    player.position.x > dx - 20 && player.position.x < dx + 20 &&
    player.position.y > dy1 && player.position.y < dy2
  ) {
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("Press E to go to the park", width / 2, height - 80);
    if (kb.pressing('E') && interactionCooldown === 0) {
      gameState = 3;
      interactionCooldown = 30;
    }
  }
}

function increaseHope(amount, msg) {
  if (hopeMeter < 100) {
    hopeMeter = min(hopeMeter + amount, 100);
    interactionMessage = msg;
    messageTimer = 60;
  }
}

function drawHopeMeter() {
  let x = width - 60, y = 60, size = 50;
  push();
  noStroke();
  let glow = map(hopeMeter, 0, 100, 50, 255);
  fill(200, 150, 255, glow);
  ellipse(x, y, size + 20);
  fill(150, 100, 220);
  ellipse(x, y, size);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Hope", x, y);
  pop();

  if (interactionMessage && messageTimer > 0) {
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text(interactionMessage, width / 2, height - 100);
    messageTimer--;
  }
}

function drawSceneWithHope(grayImg, colorImg) {
  image(grayImg, 0, 0, width, height);
  push();
  let alpha = map(hopeMeter, 0, 100, 0, 255);
  tint(255, alpha);
  image(colorImg, 0, 0, width, height);
  pop();
}

function drawBedroomHotspots() {
  fill('green');
  noStroke();
  rect(width - 20, height / 2 - 40, 20, 80, 5);
  fill('red');
  ellipse(xBookCenter, yBookCenter, 10, 10);
}

function mousePressed() {
  if (
    gameState === 0 &&
    abs(mouseX - startButton.position.x) < startButton.width / 2 &&
    abs(mouseY - startButton.position.y) < startButton.height / 2
  ) {
    gameState = 1;
    hopeMeter = 0;
    dogPetLimit = 2;
    bookMessageShown = false;
  }
}

function restartGame() {
  hopeMeter = 0;
  currentPage = 0;
  gameState = 0;
  dogPetLimit = 2;  
  bookMessageShown = false;

  player.position.x = width / 2;
  player.position.y = height / 2;
}

function keyPressed() {
  if (gameState === 2) {
    if ((key === ' ' || key === 'Space') && currentPage < bookPages.length - 1) {
      currentPage++;
    }
    if (key === 'R' || key === 'r') {
      gameState = 1;
      if (!bookMessageShown) {
        increaseHope(50, "The story warms your heart...");
        bookMessageShown = true;
      }
    }
  }

  if (gameState === 3 && (key === 'B' || key === 'b')) {
    player.position.x = width - 40;
    player.position.y = height / 2;
    gameState = 1;
  }

  if (gameState === 4 || gameState === 5) {
    if (key === 'R' || key === 'r') {
      restartGame();
    }
    if (gameState === 4 && (key === 'Q' || key === 'q')) {
      noLoop();
    }
    if (gameState === 4 && hopeMeter < 100 && (key === 'B' || key === 'b')) {
      gameState = 1;
    }
  }
}

function handlePlayerMovement() {
  if (!player.visible) return;

  let speed = 3, moving = false;

  if (gameState === 3) {
    if (kb.pressing(LEFT_ARROW) || kb.pressing('A')) {
      player.position.x -= speed;
      player.changeAnimation('left');
      moving = true;
    } else if (kb.pressing(RIGHT_ARROW) || kb.pressing('D')) {
      player.position.x += speed;
      player.changeAnimation('right');
      moving = true;
    }
    player.position.y = height - 70; // Fixed Y for park
  } else {
    if (kb.pressing(LEFT_ARROW) || kb.pressing('A')) {
      player.position.x -= speed;
      player.changeAnimation('left');
      moving = true;
    } else if (kb.pressing(RIGHT_ARROW) || kb.pressing('D')) {
      player.position.x += speed;
      player.changeAnimation('right');
      moving = true;
    } else if (kb.pressing(UP_ARROW) || kb.pressing('W')) {
      player.position.y -= speed;
      player.changeAnimation('back');
      moving = true;
    } else if (kb.pressing(DOWN_ARROW) || kb.pressing('S')) {
      player.position.y += speed;
      player.changeAnimation('front');
      moving = true;
    }
  }

  if (!moving) {
    player.animation.stop();
  } else {
    player.animation.play();
  }

  let halfW = (player.width * player.scale) / 2;
  let halfH = (player.height * player.scale) / 2;

  player.position.x = constrain(player.position.x, halfW, width - halfW);
  if (gameState === 3) {
    player.position.y = height - 70;
  } else {
    player.position.y = constrain(player.position.y, halfH, height - halfH);
  }

  player.rotation = 0;
  player.angularVelocity = 0;
}

function increaseHope(amount, msg) {
  if (hopeMeter < 100) {
    hopeMeter = min(hopeMeter + amount, 100);
    interactionMessage = msg;
    messageTimer = 60;
    console.log(`Hope increased to ${hopeMeter}`);
  }
}
