import Player from '../objects/Player';
import Enemy from '../objects/Enemy';

class GameState extends Phaser.State {

  create() {
    var ufo = [
      '....DDDDDDDD....',
      '...DDEEDDDDDD...',
      '..DDDEEDDDDDDD..',
      '..DDDDDDDDDDDD..',
      '..DDDD5555DDDD..',
      '..DDD555555DDD..',
      '..DDD555555DDD..',
      '..DDD555555DDD..',
      '..334244333333..',
      '.33344443333333.',
      '3333444433333333',
      '....5...5..5....',
      '...5....5...5...',
      '.66....66....66.',
      '.66....66....66.'
    ];
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.create.texture('alien', ufo, 4, 4);


    this.initMap();

    let center = {x: this.game.world.centerX, y: this.game.world.centerY};

    this.others = {};
    this.enemies = this.game.add.physicsGroup();
    this.player = new Player(this.game, center.x, center.y, 'alien');
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.sync.chan.on(this.game.sync.UPDATE, this.syncPositions.bind(this))
  }

  initMap() {
    this.map = this.game.add.tilemap();
    this.map.addTilesetImage('tiles', null, 256, 256);

    this.layer = this.map.create('base', this.game.worldMap.x, this.game.worldMap.y, 256, 256);
    //this.layer = this.map.createLayer('Ground');
    var y = 0;
    for (var i in this.game.worldMap.data){
      if (i % this.game.worldMap.x == 0 && i != 0){
        y +=1
      }
      var tile = this.game.worldMap.data[i];
      var x = i % this.game.worldMap.x;
      if (tile != 0 ){
        this.map.putTile(tile-1, x, y, this.layer);
      }
    }
  }

  update() {

    this.game.sync.syncPlayer(this.player);
    var speed = 400;

    if (this.game.physics.arcade.collide(this.player, this.enemies)) {
      this.player.body.bounce.setTo(1, 1);
      this.player.inactive = true;
      this.game.time.events.add(Phaser.Timer.SECOND / 5, function () {
        this.player.inactive = false
      }, this);
    }

    if (this.player.inactive) {
      return
    }

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -speed
    }
    else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = speed
    }

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -speed
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = speed

    }

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
            playerData.position.x, playerData.position.y, 'alien', playerData.options.tint);
          this.others[playerData.id] = other_player;
          this.enemies.add(other_player);
        } else {

          //this.others[playerData.id].x = playerData.position.x;
          //this.others[playerData.id].y = playerData.position.y;
          this.others[playerData.id].body.velocity.x = playerData.velocity.x;
          this.others[playerData.id].body.velocity.y = playerData.velocity.y;
        }

      }.bind(this));

    // Kill missing in action
    Object.keys(this.others).map(function (player_id){
      if (currentPlayers.indexOf(player_id) === -1){
        this.others[player_id].kill();
        delete this.others[player_id];
      }
    });
  }

  handleColission() {

  }

  render() {

    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.spriteCoords(this.player, 32, 500);

  }

}

export default GameState;
