"use strict";

import GameState from './states/GameState';
import Sync from './socket';
import uuid from 'node-uuid';

var w = window.innerWidth * window.devicePixelRatio;
var h = window.innerHeight * window.devicePixelRatio;

class Game extends Phaser.Game {

	constructor() {
		super((h > w) ? h:w, (h > w) ? w:h, Phaser.CANVAS, 'content', null);
		//super(800, 800, Phaser.CANVAS, 'content', null);
		this.userID = uuid.v4();
		this.sync = new Sync(this.userID);
		this.state.add('GameState', GameState, false);
		this.state.start('GameState');
	}

}
new Game();

