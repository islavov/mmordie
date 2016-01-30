
class Player extends window.Phaser.Sprite {

	constructor(game, x, y, key, tint) {

		super(game, x, y, key, tint);

		this.tint = tint || Math.random() * 0xffffff;
		game.add.existing(this);
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = true;
		this.body.mass = 1000;
	}

}

export default Player;


