class Pacman extends Sprite {
  constructor(imagePath, x, y, size, grid, score, game) {
    super();
    this.spritesheet = new Image();
    this.spritesheet.src = imagePath;
    this.x = x;
    this.y = y;
    this.size = size;
    this.grid = grid;
    this.score = score;

    this.direction = { x: 0, y: 0 };
    this.pendingDirection = { x: 0, y: 0 };

    this.frameCount = 0;
    this.framesPerMove = 15;

    this.animationFrame = 0;
    this.framesPerAnimation = 10;

    this.teleportPoints = [
      { x: 0, y: 10 },
      { x: 18, y: 10 },
    ];

    this.game = game;

    this.health = 3;
    this.hasLost = false;
    this.hasWon = false;

  }

  update(sprites, keys) {
    // get the direction
    switch (true) {
      case keys["ArrowUp"]:
        this.setPendingDirection(0, -1);
        break;
      case keys["ArrowDown"]:
        this.setPendingDirection(0, 1);
        break;
      case keys["ArrowLeft"]:
        this.setPendingDirection(-1, 0);
        break;
      case keys["ArrowRight"]:
        this.setPendingDirection(1, 0);
        break;
    }    

    this.frameCount++;

    // move pacman every 30 frames
    if (this.frameCount >= this.framesPerMove) {
      this.frameCount = 0;

      // check if pacman can move in the pending direction and apply it
      if (this.canMoveInDirection(this.pendingDirection)) {
        this.direction = { ...this.pendingDirection };
      }

      // calculate the next position to go to
      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      // check if the next position is walkable
      if (this.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    }

    // check for teleport
    this.checkForTeleport();

     // check for collision with any ghost
     for (let sprite of sprites) {
      if (sprite instanceof Ghost) {
        this.checkCollision(sprite);
      }
    }

    // handle animation
    if (this.frameCount % this.framesPerAnimation === 0) {
      this.animationFrame = 1 - this.animationFrame;
    }
  }

  /* 
    set the pending direction without changing the current direction 
    and prevent moving backwards (the opposite direction of his current direction)
    */
  setPendingDirection(dx, dy) {
    // if (dx === -this.direction.x && dy === -this.direction.y) {
    //   return;
    // }

    this.pendingDirection = { x: dx, y: dy };
  }

  /* 
    calucalte tje next position based on the current direction 
    and check if it's walkable
    */
  canMoveInDirection(direction) {
    const nextX = this.x + direction.x * this.size;
    const nextY = this.y + direction.y * this.size;
    return this.canMoveTo(nextX, nextY);
  }

  /* 
    check if the next position is walkable
    */
  canMoveTo(x, y) {
    const col = Math.floor(x / this.size);
    const row = Math.floor(y / this.size);

    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[0].length &&
      (this.grid[row][col] === 0 || this.grid[row][col] === 2 || this.grid[row][col] === 5)
    );
  }

  /* 
    teleport pacman from one point to another when its on a teleport point
    */
  checkForTeleport() {
    const col = Math.floor(this.x / this.size);
    const row = Math.floor(this.y / this.size);

    if (this.grid[row][col] === 2) {
      const currentTeleport = this.teleportPoints.find(
        (point) => point.x === col && point.y === row
      );

      const targetTeleport = this.teleportPoints.find(
        (point) => point !== currentTeleport
      );

      this.x = targetTeleport.x * this.size;
      this.y = targetTeleport.y * this.size;
    }
  }

  /*
    check if pacman collided with a ghost either while frieghtened or not
  */
  checkCollision(ghost) {
    const isColliding =
      this.x < ghost.x + ghost.size &&
      this.x + this.size > ghost.x &&
      this.y < ghost.y + ghost.size &&
      this.y + this.size > ghost.y;

    if (isColliding) {
      if (ghost.currentPhase === ghost.phases.FRIGHTENED || ghost.currentPhase === ghost.phases.EATEN) {
        this.handleFrightenedCollision(ghost);
      } else {
        this.handleNormalCollision(ghost);
      }
    }
  }

  /*
    handle frightened collision
  */
  handleFrightenedCollision(ghost) {
    ghost.currentPhase = ghost.phases.EATEN; 
    console.log(ghost.currentPhase);
    ghost.phaseTimer = 0;
    console.log("Ghost eaten! Score:", this.score);
  }

  /*
    handle nromal collision
  */
  handleNormalCollision(ghost) {
    this.health -= 1;
    console.log("Collision! Health remaining:", this.health);
    
    if (this.health > 0) {
      const ghosts = [];
      for (let sprite of this.game.sprites) {
        if (sprite instanceof Ghost) {
          ghosts.push(sprite);
        }
      }
      this.resetPositionsAfterHealthLoss(ghosts);
    }
    
    if (this.health <= 0) {
      this.hasLost = true;
  }
  }

  /*
    reset position of pacman and ghosts when health is lost
  */
  resetPositionsAfterHealthLoss(ghosts) {
    this.x = 450;
    this.y = 800;
    
    this.direction = { x: 0, y: 0 };
    this.pendingDirection = { x: 0, y: 0 };
    
    //each ghost postion
    const ghostPositions = [
      { x: 450, y: 400 },  
      { x: 450, y: 500 },  
      { x: 400, y: 500 },  
      { x: 500, y: 500 }   
    ];
    
    ghosts.forEach((ghost, index) => {
      ghost.x = ghostPositions[index].x;
      ghost.y = ghostPositions[index].y;
      ghost.currentPhase = ghost.phases.SCATTER;
      ghost.phaseTimer = 0;
    });
  }

  draw(ctx) {
    //draw pacman
    const rows = 4;
    const cols = 3;
    const spriteWidth = this.spritesheet.width / cols;
    const spriteHeight = this.spritesheet.height / rows;
  
    const directions = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];
  
    const directionIndex = directions.findIndex(
      (d) => d.x === this.direction.x && d.y === this.direction.y
    );
  
    const row = directionIndex === -1 ? 0 : directionIndex;
    const col = directionIndex === -1 ? 0 : this.animationFrame + 1;
  
    ctx.drawImage(
      this.spritesheet,
      col * spriteWidth,
      row * spriteHeight,
      spriteWidth,
      spriteHeight,
      this.x,
      this.y,
      this.size,
      this.size
    );
  
    //draw hearts
    const heartImage = new Image();
    heartImage.src = "../images/heart.png"; 
  
    const heartX = 700;
    const heartY = 1125; 
    const heartSpacing = 50;
  
    for (let i = 0; i < this.health; i++) {
      ctx.drawImage(
        heartImage,
        heartX + i * heartSpacing,
        heartY,
        40, 
        40 
      );
    }
  }  
}  
