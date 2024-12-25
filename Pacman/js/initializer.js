class GameInitializer {
  constructor(game) {
    this.game = game;
    this.grid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 1, 4, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [2, 5, 5, 5, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 5, 5, 5, 2],
      [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    ];

    this.superpellet = [
      { x: 1, y: 4 },
      { x: 17, y: 4 },
      { x: 1, y: 19 },
      { x: 17, y: 19 },
    ];

    this.game.paused = true;
  }

  initialize() {
 
    const myGrid = new Grid(50, 50, this.grid);
    this.game.addSprite(myGrid);

    const score = new Score();
    this.game.addSprite(score);

    // Add pellets to each walkable grid cell
    const pelletTracker = { totalPellets: 0 }; 
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        if (this.grid[row][col] === 0) {
          const pellet = new Pellet(col * 50, row * 50, 20, pelletTracker);
          this.game.addSprite(pellet);
        }
      }
    }

    for (const { x, y } of this.superpellet) {
      const superPellet = new SuperPellet(x * 50, y * 50, 20);
      this.game.addSprite(superPellet);
    }

    const sound = new Sound("../sounds/pacman.mp3");
    this.game.addSprite(sound);


    const pacman = new Pacman(
      "../images/image.png",
      450,
      800,
      50,
      this.grid,
      score,
      game
    );
    this.game.addSprite(pacman);

    const blinky = new Blinky(450, 400, 50, this.grid);
    const pinky = new Pinky(450, 500, 50, this.grid);
    const inky = new Inky(400, 500, 50, this.grid);
    const clyde = new Clyde(500, 500, 50, this.grid);

    this.game.addSprite(blinky);
    this.game.addSprite(pinky);
    this.game.addSprite(inky);
    this.game.addSprite(clyde);

    const restart = new Restart(this.game, pacman);
    this.game.addSprite(restart);
  }
}

const game = new Game(() => initializer.initialize());

const initializer = new GameInitializer(game);

const menu = new Menu(game);

initializer.initialize();
game.addSprite(menu);

game.animate();
