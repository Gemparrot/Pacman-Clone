class Restart extends Sprite {
    constructor(game) {
      super();
      this.game = game;
      this.canvas = game.canvas;
      this.ctx = game.ctx;
      this.showRestart = false; 
      this.gameOutcome = null; 
    }
  
    update(sprites) {
      for (let sprite of sprites) {
        if (sprite instanceof Pacman) {
          
          switch (true) {
            // Check if Pacman has lost
            case sprite.hasLost:
              this.showRestart = true;
              this.gameOutcome = "lost";
              break;
          
            // Check if Pacman has won
            case sprite.hasWon:
              this.showRestart = true;
              this.gameOutcome = "won";
              sprite.hasWon = false;
              break;
          
            default:
              break;
          }
          
        }
      }
  
      // check for 'R' key to reset the game
      if (this.showRestart && this.game.keys && this.game.keys["r"]) {
        this.game.restart = true;
        this.showRestart = false; 
        this.gameOutcome = null; 
      }
    }
  
    draw(ctx) {
      if (this.showRestart) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
  
        if (this.gameOutcome === "lost") {
          ctx.fillText(
            "Game Over!",
            this.canvas.width / 2,
            this.canvas.height / 2 - 50
          );
        } else if (this.gameOutcome === "won") {
          ctx.fillText(
            "Congratulations! You Won!",
            this.canvas.width / 2,
            this.canvas.height / 2 - 50
          );
        }
        
        ctx.fillText(
          "Press 'R' to Restart",
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      }
    }
}