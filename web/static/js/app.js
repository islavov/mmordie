"use strict";

import GameState from './states/GameState';
import Sync from './socket';
import uuid from 'node-uuid';


function initGame() {
  var w = window.innerWidth;
  var h = window.innerHeight;

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
    game.load.spritesheet('player1walk', 'images/animations/Player1Walk.png', 128, 128, 24);
    game.load.spritesheet('player2walk', 'images/animations/Player2Walk.png', 128, 128, 24);
    game.load.spritesheet('player3walk', 'images/animations/Player3Walk.png', 128, 128, 24);
    
    game.load.spritesheet('player1hit', 'images/animations/Player1Hit.png', 128, 128, 24);
    game.load.spritesheet('player2hit', 'images/animations/Player2Hit.png', 128, 128, 24);
    game.load.spritesheet('player3hit', 'images/animations/Player3Hit.png', 128, 128, 24);

    game.load.spritesheet('player1idle', 'images/animations/Player1Idle.png', 128, 128, 24);
    game.load.spritesheet('player2idle', 'images/animations/Player2Idle.png', 128, 128, 24);
    game.load.spritesheet('player3idle', 'images/animations/Player3Idle.png', 128, 128, 24);

    game.load.image('player1', 'images/player-01.png');
    game.load.image('player2', 'images/player-02.png');
    game.load.image('player3', 'images/player-03.png');
    game.load.image('background', 'images/bgStars.png');
  }

  function onCreate() {
    game.userID = uuid.v4();
    game.sync = new Sync(game.userID);
    game.sync.chan.on("join", onJoin);
    this.game.world.setBounds(0, 0, 2260, 2600);
  }

  function onJoin(msg) {
    game.worldMap = msg.map;
    game.playerInfo = msg.player;
    game.playerInfo.stats = msg.stats;
    game.state.add('GameState', GameState, false);
    game.state.start('GameState');
  }

}

initGame();
