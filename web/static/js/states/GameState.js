import Player from '../objects/Player';

class GameState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY };
		this.game.world.setBounds(0, 0, 10000, 10000);
		this.game.physics.startSystem(Phaser.Physics.P2JS);

		this.player = new Player(this.game, center.x, center.y, 'player', 1);
		this.cursors = this.game.input.keyboard.createCursorKeys();
	}

	update() {

    this.player.body.setZeroVelocity();

    if (this.cursors.up.isDown)
    {
        this.player.body.moveUp(300)
    }
    else if (this.cursors.down.isDown)
    {
        this.player.body.moveDown(300);
    }

    if (this.cursors.left.isDown)
    {
        this.player.body.velocity.x = -300;
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.moveRight(300);
    }

}

	render() {

    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.spriteCoords(this.player, 32, 500);

}

}

export default GameState;
