import Player from '../objects/Player';
import Enemy from '../objects/Enemy';

class GameState extends Phaser.State {

  create() {
    this.initMap();

    this.others = {};
    this.enemies = this.game.add.group();
    this.enemies.classType = Enemy;
    this.player = this.initPlayer(this.game.playerInfo, Player);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.sync.chan.on(this.game.sync.UPDATE, this.syncPositions.bind(this))
  }

  initPlayer(playerInfo, playerClass) {
    var cx = playerInfo.position.x;
    var cy = playerInfo.position.y;
    var player = new playerClass(this.game, cx, cy, playerInfo.sprite);
    player.id = playerInfo.id;
    player.setStats(playerInfo.stats);
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    return player
  }

  initMap() {
    this.game.add.tileSprite(0, 0,
      this.game.world.bounds.width,
      this.game.cache.getImage('background').height,
      'background');

    this.map = this.game.add.tilemap();
    this.map.addTilesetImage('terrain', null, 128, 128, 0, 0);

    this.layer = this.map.create('base', this.game.worldMap.size.x, this.game.worldMap.size.y, 128, 128);
    //this.layer = this.map.createLayer('Ground');
    var y = 0;
    for (var i in this.game.worldMap.data) {
      if (i % this.game.worldMap.size.x == 0 && i != 0) {
        y += 1
      }
      var tile = this.game.worldMap.data[i];
      var x = i % this.game.worldMap.size.x;
      if (tile > 0) {
        this.map.putTile(tile-1, x, y, this.layer);
      }
    }
  }

  update() {

    if (this.player.alive){
      this.game.sync.syncPlayer(this.player);
    }

    if (this.player.is_attacking){
      this.game.physics.arcade.overlap(
        this.player.weapon,
        this.enemies,
        function collisionHandler(sprite1, sprite2){
          sprite2.takeHit(this.player.stats.damage)
        },
        null,
        this
      )
    }

    //  this.player.body.bounce.setTo(2, 2);
    //  this.player.inactive = true;
    //  this.game.time.events.add(Phaser.Timer.SECOND / 5, function () {
    //    this.player.inactive = false
    //  }, this);
    //}

    //if (this.player.inactive) {
    //  return
    //}

    this.player.move(this.cursors);

  }

  syncPositions(syncData) {
    var currentPlayers = [];
    syncData.players.map(
      function (playerData) {
        currentPlayers.push(playerData.id);
        if (playerData.id == this.player.id) {
          playerData.stats = syncData.stats[this.player.id];
          if (!this.player.alive){
            this.player = this.initPlayer(playerData, Player);
          }
          else {
            this.player.setStats(playerData.stats);

          }
          return
        }

        if (typeof this.others[playerData.id] === 'undefined') {
          var other_player = new Enemy(this.game,
            playerData.position.x, playerData.position.y, playerData.sprite);
          other_player.id = playerData.id;
          this.others[playerData.id] = other_player;
          this.enemies.add(other_player);

        } else {
          other_player = this.others[playerData.id];
          this.others[playerData.id].x = playerData.position.x;
          this.others[playerData.id].y = playerData.position.y;

          this.others[playerData.id].body.velocity.x = playerData.velocity.x;
          this.others[playerData.id].body.velocity.y = playerData.velocity.y;
          this.others[playerData.id].setAngle();
        }
        other_player.setStats(syncData.stats[other_player.id]);
        other_player.setAction(playerData.action);

      }.bind(this));

    // Kill missing in action
    Object.keys(this.others).map(function (player_id) {
      if (currentPlayers.indexOf(player_id) === -1) {
        this.others[player_id].destroy();
        delete this.others[player_id];
      }
    }.bind(this));

    if (currentPlayers.indexOf(this.player.id) === -1){
      this.player.kill();
    }

  }

  handleColission() {

  }

  render() {
    //this.game.debug.bodyInfo(this.player.weapon, 96, 96);
    //this.game.debug.body(this.player.weapon);
    //this.game.debug.text(`Active enemies: ${this.enemies.length}`, 100, 380);
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(this.player, 32, 500);

  }

}

export default GameState;
