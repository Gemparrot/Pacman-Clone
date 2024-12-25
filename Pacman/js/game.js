class Sprite {
  constructor() {}

  update() {}

  draw(ctx) {}
}

class Game {
  constructor(callbackFunction = null) {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
    this.keys = {}; // Store active keys
    this.bindKeyboardEvents();
    this.paused = false;
    this.restart = false;
    this.callbackFunction = callbackFunction; // Store the user-provided callback function
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
  }

  update() {
    if (this.restart) {
      this.restart = false;
      this.paused = false;
      this.sprites = [];

      if (typeof this.callbackFunction === "function") {
        this.callbackFunction(); // Call the provided function
      }
    }

    if (this.paused) return; // Skip updating if paused

    let updatedSprites = [];
    for (let i = 0; i < this.sprites.length; i++) {
      let sprite = this.sprites[i];
      if (!sprite.update(this.sprites, this.keys)) {
        updatedSprites.push(sprite);
      }
    }
    this.sprites = updatedSprites;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sprites.forEach((sprite) => sprite.draw(this.ctx));
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  bindKeyboardEvents() {
    // Handle keydown event
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true; // Mark the key as active

      // Handle pause and continue keys
      if (e.key === "p") {
        this.paused = true; // Pause the game
      }
      if (e.key === "c") {
        this.paused = false; // Resume the game
      }
    });

    // Handle keyup event
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false; // Mark the key as inactive
    });
  }
}

class Grid extends Sprite {
  constructor(width, height, grid) {
    super();
    this.width = width;
    this.height = height;
    this.grid = grid;

    this.backgroundImage = new Image();
    this.backgroundImage.src = "../images/background2.png";
  }

  update(sprites, keys) {
    return false;
  }

  draw(ctx) {
    ctx.drawImage(this.backgroundImage, 0, 0, this.width * this.grid[0].length, this.height * this.grid.length);


    const rows = this.grid.length;
    const columns = this.grid[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (this.grid[row][col] === 1) {
          ctx.fillStyle = "transparent";
          ctx.fillRect(
            col * this.width,
            row * this.height,
            this.width,
            this.height
          );
        } else if (this.grid[row][col] === 4) {
          // ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.fillStyle = "transparent";

          ctx.fillRect(
            col * this.width,
            row * this.height,
            this.width,
            this.height
          );
        }
      }
    }
  }
}
