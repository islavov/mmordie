import Player from './Player'

class Enemy extends Player {

  constructor(game, x, y, key, tint) {

    super(game, x, y, key, tint);
    this.body.imovable = true;
    this.body.isHit = false;
  }

  takeHit(damage){

    if (!this.isHit){
      this.game.sync.hitPlayer(this, damage);
      this.game.time.events.add(300, function(){this.isHit = false}.bind(this));
    }


  }

}

export default Enemy;
