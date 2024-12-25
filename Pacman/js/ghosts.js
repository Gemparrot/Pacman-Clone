class Movement {
  constructor(grid, size) {
    this.grid = grid;
    this.size = size;
  }

  /*
    find the shortest path between two points using dikastra algorithm
    */
  findPath(start, end, previousDirection) {
    const queue = [start];
    const distances = {};
    const previous = {};

    distances[`${start.x},${start.y}`] = 0;

    while (queue.length > 0) {
      const { x, y } = queue.shift();
      const key = `${x},${y}`;

      if (x === end.x && y === end.y) {
        const path = [];
        let current = key;
        while (current) {
          const [cx, cy] = current.split(",").map(Number);
          path.unshift({ x: cx, y: cy });
          current = previous[current];
        }
        return path;
      }

      const neighbors = [
        { x: x + 1, y, dx: 1, dy: 0 },
        { x: x - 1, y, dx: -1, dy: 0 },
        { x, y: y + 1, dx: 0, dy: 1 },
        { x, y: y - 1, dx: 0, dy: -1 },
      ];

      for (const neighbor of neighbors) {
        const nKey = `${neighbor.x},${neighbor.y}`;

        if (
          previousDirection &&
          neighbor.dx === -previousDirection.x &&
          neighbor.dy === -previousDirection.y
        ) {
          continue;
        }
        if (
          this.canMoveTo(neighbor.x * this.size, neighbor.y * this.size) &&
          !(nKey in distances)
        ) {
          distances[nKey] = distances[key] + 1;
          previous[nKey] = key;
          queue.push(neighbor);
        }
      }
    }

    return [];
  }

  /*
    check if a point is walkable
  
    note: call it from the pacman class
    */
  canMoveTo(x, y) {
    const col = Math.floor(x / this.size);
    const row = Math.floor(y / this.size);

    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[0].length &&
      this.grid[row][col] !== 1 && this.grid[row][col] !== 5
    );
  }
}

class Ghost extends Sprite {
  constructor(x, y, size, grid, imagePath) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;
    this.grid = grid;

    this.spritesheet = new Image();
    this.spritesheet.src = imagePath;

    this.frameCount = 0;
    this.framesPerAnimation = 20; 
    this.currentFrame = 0; 
    this.totalFrames = 8; 

    this.movment = new Movement(grid, size);
    this.direction = { x: 0, y: 0 };
    this.previousDirection = { x: 0, y: 0 };
    this.framesPerMove = 15;

    // ghost phases
    this.phases = {
      CHASE: "CHASE",
      SCATTER: "SCATTER",
      FRIGHTENED: "FRIGHTENED",
      EATEN: "EATEN",
    };
    this.currentPhase = this.phases.SCATTER;

    this.phaseTimer = 0;
    this.phaseChangeTime = 1000;
    this.phaseFrightenedTimer = 0;
    this.phaseFrightenedTime = 25;
  }

  update(sprites) {
    this.frameCount++;
    this.phaseTimer++;

    // get Pacman and Blinky
    let pacman = null;
    let blinky = null;
    for (let sprite of sprites) {
      if (sprite instanceof Pacman) {
        pacman = sprite;
      } else if (sprite instanceof Blinky) {
        blinky = sprite;
      }
    }

    // timer to switch between scatter and chase phases
    if (this.phaseTimer >= this.phaseChangeTime) {
      this.switchPhase();
      this.phaseTimer = 0;
    } else if (this.phaseFrightenedTimer >= this.phaseFrightenedTime) {
      this.currentPhase = this.phases.CHASE;
      this.phaseFrightenedTimer = 0;
    }

    // move the ghost every 15 frames
    if (this.frameCount >= this.framesPerMove) {
      this.frameCount = 0;
      this.phaseCount++;

      switch (this.currentPhase) {
        case this.phases.FRIGHTENED:
          this.frightenedMove();
          this.phaseFrightenedTimer++;
          break;
        case this.phases.EATEN:
          this.returnToStart();
          break;
        case this.phases.CHASE:
          if (pacman) {
            if (this instanceof Inky) {
              this.chaseMove(pacman, blinky);
            } else {
              this.chaseMove(pacman);
            }
          }
          break;
        case this.phases.SCATTER:
          this.scatterMove();
          break;
      }
    }
  }

  /*
    switch between scatter and chase phases every 10 seconds
  
    note: switch phases the same way they are changed in the actual game
  */
  switchPhase() {
    switch (this.currentPhase) {
      case this.phases.SCATTER:
        this.currentPhase = this.phases.CHASE;
        break;
      case this.phases.CHASE:
        this.currentPhase = this.phases.SCATTER;
        break;
    }
  }

  /*
    when the ghosts are eaten return start finds 
    the path of the ghosts current location to the spawn
    using shortest path algorithm.
    Once the ghost reaches spawm it changes its phase to scatter.
  */
  returnToStart() {
    const start = {
      x: Math.floor(this.x / this.size),
      y: Math.floor(this.y / this.size),
    };
    const target = {
      x: Math.floor(450 / this.size),
      y: Math.floor(500 / this.size),
    };

    // find and follow the path
    const path = this.movment.findPath(start, target);

    if (path && path.length > 1) {
      const nextStep = path[1];
      const newDirection = {
        x: nextStep.x - start.x,
        y: nextStep.y - start.y,
      };

      if (
        newDirection.x !== -this.previousDirection.x ||
        newDirection.y !== -this.previousDirection.y
      ) {
        this.direction = newDirection;
        this.previousDirection = newDirection;
      }

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      if (this.movment.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    }

    //switch to scatter phase on destination
    if (this.x === 450 && this.y === 500) {
      this.currentPhase = this.phases.SCATTER;
      this.direction = { x: 0, y: 0 }; 
      this.phaseTimer = 0; 
    }
  }

  /*
    move the ghost randomly when it's in the frightened phase
  */
  frightenedMove() {
    const oppositeDirection = {
      x: -this.direction.x,
      y: -this.direction.y,
    };

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    // prevent moving backwards when frieghtened
    const filteredDirections = directions.filter(
      (direction) =>
        !(
          direction.x === oppositeDirection.x &&
          direction.y === oppositeDirection.y
        )
    );

    // get the directions that are walkable from the filtered directions
    const validDirections = filteredDirections.filter((direction) => {
      const nextX = this.x + direction.x * this.size;
      const nextY = this.y + direction.y * this.size;
      return this.movment.canMoveTo(nextX, nextY);
    });

    // chose a random direction from the valid directions
    if (validDirections.length > 0) {
      const randomDirection =
        validDirections[Math.floor(Math.random() * validDirections.length)];
      this.direction = randomDirection;

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      // move the ghost
      this.x = nextX;
      this.y = nextY;
    }
  }

  /*
    each ghost has its own chase alogrithm
    */
  chaseMove(pacman) {}

  /*
    when the ghost is in scatter phase, move the to the ghost from anywhere 
    on the map using the shortest path algorithm, when the scatter path is reached keep 
    following it till phase is changed.
  */
  scatterMove() {
    // get the target and start point and their path
    const target = this.scatterPath[this.scatterIndex];
    const start = {
      x: Math.floor(this.x / this.size),
      y: Math.floor(this.y / this.size),
    };
    const path = this.movment.findPath(start, target);

    // move the ghost on the path
    if (path && path.length > 1) {
      const nextStep = path[1];
      this.direction = {
        x: nextStep.x - start.x,
        y: nextStep.y - start.y,
      };

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      if (this.movment.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    } else {
      this.scatterIndex = (this.scatterIndex + 1) % this.scatterPath.length;
    }
  }

  draw(ctx) {
    const frameWidth = this.spritesheet.width / this.totalFrames; 
    const frameHeight = this.spritesheet.height; 

    if (this.frameCount % this.framesPerAnimation === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }

    ctx.drawImage(
      this.spritesheet,
      this.currentFrame * frameWidth, 
      0, 
      frameWidth, 
      frameHeight, 
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}

class Blinky extends Ghost {
  constructor(x, y, size, grid) {
    super(x, y, size, grid, "../images/blinky.png");
    // scatter path for blinky
    this.scatterPath = [
      { x: 14, y: 4 },
      { x: 14, y: 1 },
      { x: 17, y: 1 },
      { x: 17, y: 4 },
    ];
    this.scatterIndex = 0;
  }

  /*
    blinky chases pacman directly to its location.
    it gets the ghost and pacman location and find the shortest path to the pacman location.
   
    move randomlly when target is out of bounds
  */
  chaseMove(pacman) {
    const start = {
      x: Math.floor(this.x / this.size),
      y: Math.floor(this.y / this.size),
    };
    const target = {
      x: Math.floor(pacman.x / this.size),
      y: Math.floor(pacman.y / this.size),
    };
    const path = this.movment.findPath(start, target);

    if (path && path.length > 1) {
      const nextStep = path[1];
      const newDirection = {
        x: nextStep.x - start.x,
        y: nextStep.y - start.y,
      };

      if (
        newDirection.x !== -this.previousDirection.x ||
        newDirection.y !== -this.previousDirection.y
      ) {
        this.direction = newDirection;
        this.previousDirection = newDirection;
      }

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      if (this.movment.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    }
    else {
      super.frightenedMove();
    }
  }
}

class Pinky extends Ghost {
  constructor(x, y, size, grid) {
    super(x, y, size, grid, "../images/pinky.png");
    // scatter path for pinky
    this.scatterPath = [
      { x: 4, y: 4 },
      { x: 4, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 4 },
    ];
    this.scatterIndex = 0;
  }

  /*
    pinky chases pacman by moving to a point that is 4 tiles ahead of pacman.
    it gets the ghost and pacman location and find the shortest path to the 
    point that is 4 tiles ahead of pacman in the direction that pacman is moving in.

    move randomly when target is out of bounds
    */
  chaseMove(pacman) {
    const start = {
      x: Math.floor(this.x / this.size),
      y: Math.floor(this.y / this.size),
    };
    const pacmanTile = {
      x: Math.floor(pacman.x / this.size),
      y: Math.floor(pacman.y / this.size),
    };
    const lookahead = 4;
    const target = {
      x: pacmanTile.x + pacman.direction.x * lookahead,
      y: pacmanTile.y + pacman.direction.y * lookahead,
    };
    const path = this.movment.findPath(start, target);

    if (path && path.length > 1) {
      const nextStep = path[1];
      const newDirection = {
        x: nextStep.x - start.x,
        y: nextStep.y - start.y,
      };

      if (
        newDirection.x !== -this.previousDirection.x ||
        newDirection.y !== -this.previousDirection.y
      ) {
        this.direction = newDirection;
        this.previousDirection = newDirection;
      }

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      if (this.movment.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    }
    else {
      super.frightenedMove();
    }
  }
}

class Inky extends Ghost {
  constructor(x, y, size, grid) {
    super(x, y, size, grid, "../images/inky.png");
    // scatter path for inky
    this.scatterPath = [
      { x: 14, y: 16 },
      { x: 17, y: 18 },
      { x: 10, y: 20 },
    ];
    this.scatterIndex = 0;
  }

  /*
    inky chases pacman by getting the location of pacman and blinky, it gets two blocks in front of pacman
    and draws a vector from blinky to that point and doubles the distance from that point to get inkys
    target point. 
  
    note: a lot of times this point is either out of bounds if blinky is too far from pacman or or it points
    to a wall, so inky would stop moving. Figure out what to do with inky in this case.

    move randomly when target is out of bounds
    */
  chaseMove(pacman, blinky) {
    console.log("Blinky in inky", blinky);
    const start = {
      x: Math.floor(this.x / this.size),
      y: Math.floor(this.y / this.size),
    };
    const pacmanTile = {
      x: Math.floor(pacman.x / this.size),
      y: Math.floor(pacman.y / this.size),
    };

    // get the position two tiles in front of Pac-Man
    const lookahead = 2;
    const targetTile = {
      x: pacmanTile.x + pacman.direction.x * lookahead,
      y: pacmanTile.y + pacman.direction.y * lookahead,
    };

    // draw the vector from Blinky's position to the target tile
    const blinkyTile = {
      x: Math.floor(blinky.x / this.size),
      y: Math.floor(blinky.y / this.size),
    };
    const vector = {
      x: targetTile.x - blinkyTile.x,
      y: targetTile.y - blinkyTile.y,
    };

    // double the distance of the vector to find Inky's target tile
    const target = {
      x: blinkyTile.x + vector.x * 2,
      y: blinkyTile.y + vector.y * 2,
    };

    // cgeck if the target is out of bounds
    target.x = Math.max(0, Math.min(this.grid[0].length - 1, target.x));
    target.y = Math.max(0, Math.min(this.grid.length - 1, target.y));

    //gettig the vector to draw it on the canvas for testing
    this.vector = { start: blinkyTile, end: target };

    const path = this.movment.findPath(start, target);

    // follow the path
    if (path && path.length > 1) {
      const nextStep = path[1];
      const newDirection = {
        x: nextStep.x - start.x,
        y: nextStep.y - start.y,
      };

      // dont allow backwards movement
      if (
        newDirection.x !== -this.previousDirection.x ||
        newDirection.y !== -this.previousDirection.y
      ) {
        this.direction = newDirection;
        this.previousDirection = newDirection;
      }

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      if (this.movment.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    }
    else {
      super.frightenedMove();
    }
  }
}

class Clyde extends Ghost {
  constructor(x, y, size, grid) {
    super(x, y, size, grid, "../images/clyde.png");
    // scatter path for clyde
    this.scatterPath = [
      { x: 4, y: 16 },
      { x: 1, y: 18 },
      { x: 8, y: 20 },
    ];
    this.scatterIndex = 0;
  }

  /*
    I gave clyde the same chase as pinky for simplicity
  
    move randomlly when target is out of bounds
  */
  chaseMove(pacman) {
    const start = {
      x: Math.floor(this.x / this.size),
      y: Math.floor(this.y / this.size),
    };
    const pacmanTile = {
      x: Math.floor(pacman.x / this.size),
      y: Math.floor(pacman.y / this.size),
    };
    const lookahead = 4;
    const target = {
      x: pacmanTile.x + pacman.direction.x * lookahead,
      y: pacmanTile.y + pacman.direction.y * lookahead,
    };
    const path = this.movment.findPath(start, target);

    if (path && path.length > 1) {
      const nextStep = path[1];
      const newDirection = {
        x: nextStep.x - start.x,
        y: nextStep.y - start.y,
      };

      if (
        newDirection.x !== -this.previousDirection.x ||
        newDirection.y !== -this.previousDirection.y
      ) {
        this.direction = newDirection;
        this.previousDirection = newDirection;
      }

      const nextX = this.x + this.direction.x * this.size;
      const nextY = this.y + this.direction.y * this.size;

      if (this.movment.canMoveTo(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
      }
    }
    else {
      super.frightenedMove();
    }    
  }
}
