import Player from '../objects/Player';
import Enemy from '../objects/Enemy';

class GameState extends Phaser.State {

  create() {
    this.initMap();

    let center = {x: this.game.world.centerX, y: this.game.world.centerY};

    this.others = {};
    this.last_sync = this.game.time.totalElapsedSeconds();
    this.enemies = this.game.add.physicsGroup();
    this.player = new Player(this.game, center.x, center.y, this.game.playerInfo.sprite);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.sync.chan.on(this.game.sync.UPDATE, this.syncPositions.bind(this))
  }

  initMap() {
    this.game.add.tileSprite(0, 0,
      this.game.world.bounds.width,
      this.game.cache.getImage('background').height,
      'background');

    // this.map = this.game.add.tilemap();
    // this.map.addTilesetImage('tiles', null, 256, 256);

    // this.layer = this.map.create('base', this.game.worldMap.size.x, this.game.worldMap.size.y, 256, 256);
    // //this.layer = this.map.createLayer('Ground');
    // var y = 0;
    // for (var i in this.game.worldMap.data) {
    //   if (i % this.game.worldMap.size.x == 0 && i != 0) {
    //     y += 1
    //   }
    //   var tile = this.game.worldMap.data[i];
    //   var x = i % this.game.worldMap.size.x;
    //   if (tile != 0) {
    //     this.map.putTile(tile - 1, x, y, this.layer);
    //   }
    // }
  }

  update() {

    this.game.sync.syncPlayer(this.player);

    if (this.game.physics.arcade.collide(this.player, this.enemies)) {
      this.player.body.bounce.setTo(2, 2);
      this.player.inactive = true;
      this.game.time.events.add(Phaser.Timer.SECOND / 5, function () {
        this.player.inactive = false
      }, this);
    }

    if (this.player.inactive) {
      return
    }

    this.player.move(this.cursors);

  }

  syncPositions(syncData) {
    var currentPlayers = [];
    syncData.players.map(
      function (playerData) {
        currentPlayers.push(playerData.id);
        if (playerData.id == this.game.userID) {
          return;
        }

        if (typeof this.others[playerData.id] === 'undefined') {
          var other_player = new Enemy(this.game,
            playerData.position.x, playerData.position.y, playerData.sprite);
          this.others[playerData.id] = other_player;
          this.enemies.add(other_player);
        } else {

          if (this.game.time.totalElapsedSeconds() - this.last_sync > Phaser.Timer.SECOND/2){
            this.others[playerData.id].x = playerData.position.x;
            this.others[playerData.id].y = playerData.position.y;

          }

          this.others[playerData.id].body.velocity.x = playerData.velocity.x;
          this.others[playerData.id].body.velocity.y = playerData.velocity.y;
          this.others[playerData.id].setAngle();
        }

      }.bind(this));

    // Kill missing in action
    Object.keys(this.others).map(function (player_id) {
      if (currentPlayers.indexOf(player_id) === -1) {
        this.others[player_id].destroy();
        delete this.others[player_id];
      }
    }.bind(this));

  }

  handleColission() {

  }

  render() {
    //this.game.debug.bodyInfo(this.player, 96, 96);
    //this.game.debug.body(this.player);
    this.game.debug.text(`Active enemies: ${this.enemies.length}`, 100, 380);
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.spriteCoords(this.player, 32, 500);

  }

}

export default GameState;
