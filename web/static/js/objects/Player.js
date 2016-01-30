const ANGLES = {
  //xy: angle
  '00': 0,
  '01': 0,
  '-11': 45,
  '-10': 90,
  '-1-1': 135,
  '0-1': 180,
  '1-1': 225,
  '10': 270,
  '11': 315
};


class Player extends window.Phaser.Sprite {

  constructor(game, x, y, key) {

    super(game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    this.stats = {
      speed: 400,
      health: 10,
      damage: 10,
      special: 10
    };

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.mass = 1000;
  }

  setStats(newStats) {
    this.stats = stats;
  }

  move(cursors) {
    var speed = this.stats.speed;

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (cursors.up.isDown) {
      this.body.velocity.y = -speed
    }
    else if (cursors.down.isDown) {
      this.body.velocity.y = speed
    }

    if (cursors.left.isDown) {
      this.body.velocity.x = -speed
    }
    else if (cursors.right.isDown) {
      this.body.velocity.x = speed
    }
    this.setAngle();
  }

  setAngle() {
    var xid = this.body.velocity.x / Math.abs(this.body.velocity.x);
    var yid = this.body.velocity.y / Math.abs(this.body.velocity.y);
    if (xid || yid) {
      var angle = `${xid || 0}${yid || 0}`;
      this.angle = ANGLES[angle];

    }
  }

}

export default Player;


