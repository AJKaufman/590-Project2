const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2, 
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5, 
  UPRIGHT: 6,
  UP: 7
};

const spriteSizes = {
  WIDTH: 31,
  HEIGHT: 121
};

const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

const redraw = (time) => {
  updatePosition();

  ctx.clearRect(0, 0, 1000, 1000);

  const keys = Object.keys(squares);

  for(let i = 0; i < keys.length; i++) {

    const square = squares[keys[i]];

    //if alpha less than 1, increase it by 0.05
    if(square.alpha < 1) square.alpha += 0.05;

    if(square.hash === hash) {
      ctx.filter = "none"
    }
    else {
      ctx.filter = "hue-rotate(40deg)";
    }

    square.x = lerp(square.prevX, square.destX, square.alpha);
    square.y = lerp(square.prevY, square.destY, square.alpha);

    // if we are mid animation or moving in any direction
    if(square.frame > 0 || (square.moveUp || square.moveDown)) {
      square.frameCount++;

      if(square.frameCount % 8 === 0) {
        if(square.frame < 7) {
          square.frame++;
        } else {
          square.frame = 0;
        }
      }
    }

    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#1238CC';
    
    // draw ball and local paddle
    if(ball) {
      ctx.fillRect(ball.x - 25, square.y - 25, 50, 50);
    }
    ctx.fillRect(square.x, square.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
    
    ctx.strokeRect(square.x, square.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
  }
  

  animationFrame = requestAnimationFrame(redraw);
};