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


class Player extends Phaser.Sprite {

  constructor(game, x, y, key) {

    super(game, x, y, `${key}walk`);
    this.anchor.setTo(0.5, 0.5);
    this.stats = {
      speed: 400,
      health: 10,
      damage: 10,
      special: 10
    };

    this.key = key;
    this.animations.add(`${key}walk`);
    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //this.weapon = new Phaser.Sprite(game, this.body.x + 16, this.body.y + 16);
    //this.weapon.scale.set(1, 5);
    //game.physics.enable(this.weapon, Phaser.Physics.ARCADE);
    //game.add.existing(this.weapon);

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

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        this.attack();
    }
  }

  getDiretion(){
    var xid = this.body.velocity.x / Math.abs(this.body.velocity.x);
    var yid = this.body.velocity.y / Math.abs(this.body.velocity.y);
    return {'x': xid, 'y': yid}
  }

  update(){
    var direction = this.getDiretion();

    // We are walking
    if (direction.x || direction.y) {
      this.animations.play(`${this.key}walk`, 24, true);
      this.setAngle(direction.x, direction.y);
    } else {
      this.animations.stop()
    }

  }

  setAngle(xid, yid) {
      var angle = `${xid || 0}${yid || 0}`;
      this.angle = ANGLES[angle];
    }

  attack() {

    //this.weapon.reset(this.body.x - 20, this.body.y - 20);

    //this.game.physics.arcade.velocityFromRotation(this.rotation, 400, this.weapon.body.velocity);

  }

}

export default Player;


