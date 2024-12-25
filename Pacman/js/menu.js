class Menu extends Sprite {
  constructor(game) {
    super();
    this.game = game;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.showMenu = true;
  }

  update(sprites) {
    if (this.game.restart) {
      this.showMenu = false;
    }

    if (this.game.paused) {
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }

  draw(ctx) {
    if (this.showMenu) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      //draw solid blue background
      ctx.fillStyle = "Darkblue";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      //Pacman Title
      ctx.fillStyle = "#FFD700"; 
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PACMAN", this.canvas.width / 2, 80);
  
      //story Section
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.textAlign = "left";
      const textStartX = 50;
      let currentY = 180;
      ctx.fillText("Story:", textStartX, currentY);
      currentY += 30;
      ctx.fillText("In a mysterious maze world, Pacman must embark on", textStartX, currentY);
      currentY += 25;
      ctx.fillText("a thrilling adventure to collect all the pellets and claim", textStartX, currentY);
      currentY += 25;
      ctx.fillText("victory. But beware the cunning ghosts are always", textStartX, currentY);
      currentY += 25;
      ctx.fillText("on the hunt! Outsmart them and complete the maze!", textStartX, currentY);
  
      //tutorial Section
      currentY += 50;
      ctx.fillText("How to Play:", textStartX, currentY);
      currentY += 30;
      ctx.fillText("Use Arrow keys to move Pacman through the maze.", textStartX, currentY);
      currentY += 25;
      ctx.fillText("P: Pause the game", textStartX, currentY);
      currentY += 25;
      ctx.fillText("C: Continue playing", textStartX, currentY);
      currentY += 25;
      ctx.fillText("R: Restart", textStartX, currentY);
      currentY += 25;

      ctx.fillText("Eat power pellets to turn ghosts vulnerable.", textStartX, currentY);
  
      //motivational Section
      currentY += 50;
      ctx.fillStyle = "#FFD700";
      ctx.font = "italic 22px Arial";
      ctx.fillText("Do you have what it takes to become the ultimate maze master?", textStartX, currentY);
  
      //play
      currentY += 80;
      ctx.textAlign = "center";
      ctx.font = "28px Arial";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("Ready to play? Press 'C' to start your adventure!", this.canvas.width / 2, currentY);
    }
  }
  
}


