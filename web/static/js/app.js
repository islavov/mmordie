"use strict";

import GameState from './states/GameState';
import Sync from './socket';
import uuid from 'node-uuid';


function initGame(){
	var w = window.innerWidth * window.devicePixelRatio;
	var h = window.innerHeight * window.devicePixelRatio;

	var game = new Phaser.Game(
		(h > w) ? h : w,
		(h > w) ? w : h,
		Phaser.CANVAS,
		'content',
		{
			create: onCreate,
			preload: onPreload
		}
	);

	function onPreload(){
	game.load.image('tiles', 'images/tileset.png');
	}

	function onCreate() {
		game.userID = uuid.v4();
		game.sync = new Sync(this.userID);
		this.game.world.setBounds(0, 0, 2260, 2600);

		game.state.add('GameState', GameState, false);
		game.state.start('GameState');
	}

}

initGame();
