
class Player extends window.Phaser.Sprite {

	constructor(game, x, y, key, frame) {

		super(game, x, y, key, frame);

		this.tint = Math.random() * 0xffffff;
	  game.physics.p2.enable(this);
		game.add.existing(this);
	 	game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);

	}

}

export default Player;
