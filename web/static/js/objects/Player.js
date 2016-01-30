
class Player extends window.Phaser.Sprite {

	constructor(game, x, y, key, tint) {

		super(game, x, y, key, tint);
		this.anchor.setTo(0.5, 0.5);

		this.speed = 400;
		this.tint = tint || Math.random() * 0xffffff;
		game.add.existing(this);
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = true;
		this.body.mass = 1000;

	}

	move(cursors) {
		var speed = this.speed;

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		if (cursors.up.isDown) {
			this.angle = 180;
			this.body.velocity.y = -speed
		}
		else if (cursors.down.isDown) {
			this.angle = 0;
			this.body.velocity.y = speed
		}

		if (cursors.left.isDown) {
			this.angle = 90;
			this.body.velocity.x = -speed
		}
		else if (cursors.right.isDown) {
			this.angle = -90;
			this.body.velocity.x = speed

		}
	}

}

export default Player;


