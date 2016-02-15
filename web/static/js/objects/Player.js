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

const FPS = 22;

class Player extends Phaser.Sprite {

  constructor(game, x, y, key) {
    super(game, x, y, key);
    this.spriteType = key;
    this.anchor.setTo(0.5, 0.5);
    this.stats = {
      speed: 400,
      health: 10,
      damage: 10,
      special: 10
    };
    this.is_attacking = false;
    this.is_moving = false;

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.weapon = new Phaser.Sprite(game, this.body.x, this.body.y);
    this.weapon.scale.set(3, 3);
    game.physics.enable(this.weapon, Phaser.Physics.ARCADE);
    game.add.existing(this.weapon);

    this.body.collideWorldBounds = true;
    this.body.mass = 1000;
  }

  setSprite(action, loop) {
    this.loadTexture(`${this.spriteType}${action}`);
    this.animations.add(`${this.spriteType}${action}`);
    this.animations.play(`${this.spriteType}${action}`, FPS, loop);
  }

  setStats(newStats) {
    this.stats = newStats;
  }

  move(cursors) {
    if (!this.alive){
      return
    }
    var speed = 300 + this.stats.speed * 20;

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

    if (!this.is_attacking){
      this.weapon.body.x = this.body.x+16;
      this.weapon.body.y = this.body.y+16;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) && !this.is_attacking)
    {
        this.attack();
    }
  }

  setAction(action){
    if (action === 'attack' && !this.is_attacking){
      this.playAttack()
    }
  }

  getAction(){
    if (this.is_attacking){
      return 'attack';
    }
    return 'move';
  }

  getDirection(){
    var xid = this.body.velocity.x / Math.abs(this.body.velocity.x);
    var yid = this.body.velocity.y / Math.abs(this.body.velocity.y);
    return {'x': xid, 'y': yid}
  }


  update(){
    this.setAngle();
    var direction = this.getDirection()

    if (this.is_attacking){
      return
    }

    // We are walking
    if (direction.x || direction.y) {
      if (!this.is_moving) {
        this.setSprite('walk', true);
        this.is_moving = true;
      }
    } else {
      this.is_moving = false;
      this.setSprite('idle', true);
    }

  }

  setAngle() {
    var direction = this.getDirection();

    if (direction.x || direction.y) {
      var angle = `${direction.x || 0}${direction.y || 0}`;
      this.angle = ANGLES[angle];
    }
  }

  attack() {
    this.weapon.reset(this.body.x+16, this.body.y+16);
    this.weapon.scale.set(3, 3);
    this.weapon.lifespan = 50;
    this.game.physics.arcade.velocityFromAngle(this.angle+90, 1600, this.weapon.body.velocity);
    this.playAttack();

  }

  playAttack() {
    this.is_attacking = true;
    this.setSprite('hit', false);
    this.game.time.events.add(200, function () {
      this.is_attacking = false;

    }.bind(this));
  }

}

export default Player;
