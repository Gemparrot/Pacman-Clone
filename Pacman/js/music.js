class Sound extends Sprite {
  constructor(path) {
    super();
    this.soundEffect = new Audio(path);
  }

  /*
    this handles the theme sound for the game
    it starts everytime the game start (during start or restart)
    and it stops when the game has been lost or won
  */
  update(sprites, keys) {
    if (keys["c"] || keys["r"]) {
      this.play();
    }  
    for (let sprite of sprites) {
      if (sprite instanceof Pacman) {
        if (sprite.hasWon || sprite.hasLost) {
          this.stop();
        }
      }
    }
    return false;
  }

  play() {
      this.soundEffect.play();
  }

  stop() {
    this.soundEffect.pause();
    this.soundEffect.currentTime = 0;
  }
}
