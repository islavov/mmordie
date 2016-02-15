"use strict";

import GameState from './states/GameState';
import Sync from './socket';
import uuid from 'node-uuid';


function initGame() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  var splash;
  var text;

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
    game.load.image('splash', 'images/splash-screen.png');
    game.load.spritesheet('player1walk', 'images/animations/Player1Walk.png', 128, 128, 24);
    game.load.spritesheet('player2walk', 'images/animations/Player2Walk.png', 128, 128, 24);
    game.load.spritesheet('player3walk', 'images/animations/Player3Walk.png', 128, 128, 24);

    game.load.spritesheet('player1hit', 'images/animations/Player1Hit.png', 128, 128, 24);
    game.load.spritesheet('player2hit', 'images/animations/Player2Hit.png', 128, 128, 24);
    game.load.spritesheet('player3hit', 'images/animations/Player3Hit.png', 128, 128, 24);

    game.load.spritesheet('player1idle', 'images/animations/Player1Idle.png', 128, 128, 24);
    game.load.spritesheet('player2idle', 'images/animations/Player2Idle.png', 128, 128, 24);
    game.load.spritesheet('player3idle', 'images/animations/Player3Idle.png', 128, 128, 24);

    game.load.spritesheet('trap1', 'images/animations/trap1.png', 128, 128, 24);
    game.load.spritesheet('trap2', 'images/animations/trap2.png', 128, 128, 24);
    game.load.image('player1', 'images/player-01.png');
    game.load.image('player2', 'images/player-02.png');
    game.load.image('player3', 'images/player-03.png');
    game.load.image('background', 'images/bgStars.jpg');

    game.load.image('terrain', 'images/terrrain.png');
  }

  function onCreate() {
    splash = game.add.sprite(w/2, h/2, 'splash');
    splash.anchor.setTo(0.5);
    splash.scale.setTo(0.7, 0.7);
    splash.fixedToCamera = true;
    game.input.onDown.add(startGame, this);
    game.input.keyboard.onDownCallback = function () {
      startGame();
    };

    text = game.add.text(w/2, h-20, 'Use arrows to move, a to hit. Press any key to start.', { fill: '#ffffff' });
    text.anchor.setTo(0.5);
  }

  function startGame() {
    game.input.onDown.remove(startGame, this);
    game.input.keyboard.onDownCallback = null;
    splash.destroy();
    text.destroy();

    game.userID = uuid.v4();
    game.sync = new Sync(game.userID);
    game.sync.chan.on("join", onJoin);
    game.world.setBounds(0, 0, 18*128, 18*128);
  }

  function onJoin(msg) {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.worldMap = msg.map;
    game.playerInfo = msg.player;
    game.playerInfo.stats = msg.stats;
    game.state.add('GameState', GameState, false);
    game.state.start('GameState');
  }

}

initGame();
