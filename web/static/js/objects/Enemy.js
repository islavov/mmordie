import Player from './Player'

class Enemy extends Player {

  constructor(game, x, y, key, tint) {

    super(game, x, y, key, tint);
    this.body.imovable = true;
  }

}

export default Enemy;
