class SuperPellet extends Sprite {
  constructor(x, y, size) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;
    this.eaten = false;
  }

  /*
    When pacman eats super pellets the ghosts become frightened
  */
  update(sprites) {
    for (let sprite of sprites) {
      if (sprite instanceof Pacman) {
        if (sprite.x === this.x && sprite.y === this.y) {
          this.eaten = true;
          sprite.score.addPoints(50);
          this.setGhostsToFrightened(sprites);
          return true;
        }
      }
    }
    return false;
  }

  setGhostsToFrightened(sprites) {
    for (let sprite of sprites) {
      if (sprite instanceof Ghost) {
        sprite.currentPhase = sprite.phases.FRIGHTENED;
      }
    }
  }

  draw(ctx) {
    if (!this.eaten) {
      ctx.fillStyle = "White";
      ctx.fillRect(
        this.x + this.size,
        this.y + this.size,
        this.size,
        this.size
      );
    }
  }
}

class Pellet extends Sprite {
  constructor(x, y, size, pelletTracker) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;
    this.eaten = false;
    this.pelletTracker = pelletTracker; 
    this.pelletTracker.totalPellets++; 
  }

  /*
    increment the score as pellets are eaten, 
    when all pellets are eaten players wins
  */
  update(sprites) {
    for (let sprite of sprites) {
      if (sprite instanceof Pacman) {
        if (sprite.x === this.x && sprite.y === this.y) {
          if (!this.eaten) {
            this.eaten = true;
            sprite.score.addPoints(10);

            // Decrement the pellet count
            this.pelletTracker.totalPellets--;
            // console.log("Remaining Pellets:", this.pelletTracker.totalPellets);

            // Check if all pellets are eaten
            if (this.pelletTracker.totalPellets === 0) {
              sprite.hasWon = true;
              console.log("Player won!", sprite.hasWon);
            }
          }
          return true;
        }
      }
    }
    return false;
  }

  draw(ctx) {
    if (!this.eaten) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        this.x + this.size,
        this.y + this.size,
        this.size / 2,
        this.size / 2
      );
    }
  }
}

class Score {
  constructor() {
    this.points = 0;
  }

  //increment score
  addPoints(points) {
    this.points += points;
  }

  update() {
    return false;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Atari";
    ctx.fillText("Score: " + this.points, 150, 1150);
  }
}
