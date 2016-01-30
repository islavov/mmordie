"use strict";

import GameState from './states/GameState';
import Sync from './socket';
import uuid from 'node-uuid';


function initGame() {
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

  function onPreload() {
    game.load.image('tiles', 'images/grass-att1-big.png');
    game.load.image('player1', 'images/player-01.png');
    game.load.image('player2', 'images/player-02.png');
    game.load.image('player3', 'images/player-03.png');
  }

  function onCreate() {
    game.userID = uuid.v4();
    game.sync = new Sync(game.userID);
    game.sync.chan.on("join", onJoin);
    this.game.world.setBounds(0, 0, 2260, 2600);
  }

  function onJoin(msg) {
    game.worldMap = msg.map;
    game.state.add('GameState', GameState, false);
    game.state.start('GameState');
  }

}

initGame();
