/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */


export default class Game extends Phaser.State {
  preload() {
    this.load.tilemap('catapultMap', 'catapult.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('catapultTileset', 'catapult.png');
  }

  create () {
    const { centerX: x, centerY: y } = this.world;

    this.map = this.add.tilemap('catapultMap');
    this.map.addTilesetImage('catapult', 'catapultTileset');

    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    //this.layer.fixedToCamera = false;
    //this.layer.scale.x = 0.5;

    this.cursors = this.input.keyboard.createCursorKeys();

    //this.camera.setBoundsToWorld();
//     this.camera.view.width =10;
  }

  update () {
    if(this.cursors.down.isDown) {
      this.camera.y += 10;
    }
    else if(this.cursors.up.isDown) {
      this.camera.y -= 10;
    }

    if(this.cursors.right.isDown) {
      this.camera.x += 10;
    }
    else if(this.cursors.left.isDown) {
      this.camera.x -= 10;
    }
  }

  render() {
    this.game.debug.cameraInfo(this.camera, 10, 32);
  }

}
