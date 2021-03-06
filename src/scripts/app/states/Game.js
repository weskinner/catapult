/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */


export default class Game extends Phaser.State {
  init() {
    // Defaults
    this.isPlacingUnit = false;
    this.purse = 100;
    this.UNIT = {
      Wall: 3,
      Base: 4,
      Mine: 5,
      Catapult: 6
    };
    this.market = {};
    this.market[this.UNIT.Wall] = 5;
    this.market[this.UNIT.Mine] = 50;
    this.market[this.UNIT.Base] = 75;
    this.market[this.UNIT.Catapult] = 25;
  }

  preload() {
    this.load.tilemap('catapultMap', 'catapult.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('catapultTileset', 'catapult.png');
    this.load.spritesheet('tiles', 'catapult.png', 32, 32, 7);
  }

  create () {
    const { centerX: x, centerY: y } = this.world;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Tilemap
    this.map = this.add.tilemap('catapultMap');
    this.map.addTilesetImage('catapult', 'catapultTileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();

    // Base
    var baseX = this.map.tileWidth * 8;
    var baseY = this.map.tileWidth * 2;
    this.base = this.add.sprite(baseX, baseY, 'tiles', 4);
    this.base.inputEnabled = true;
    this.base.events.onInputDown.add(this.baseClicked, this);

    // unit selector
    this.unitSelector = this.add.group();
    var selectorBg = this.game.make.graphics();
    selectorBg.beginFill(0x000000, 0.8);
    selectorBg.drawRect(0, 0, 64, this.game.height);
    selectorBg.endFill();
    this.unitSelector.add(selectorBg);
    var units = [3,4,5,6];
    for(var i = 0; i < units.length; i++) {
      let padding = 32/2;
      let unit = this.unitSelector.create(padding, (padding * (i+1)) + (i * 32), 'tiles', units[i]);
      unit.inputEnabled = true;
      unit.events.onInputDown.add(this.selectUnit.bind(this, units[i]), this);
    }
    this.unitSelector.visible = this.isUnitSelectorShowing = false;

    // purse text
    this.purseText = this.add.text(400, 5, '', { fill: '#ffffff' });


    // marker
    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0,0,32,32);
    this.marker.visible = false;
    this.game.input.addMoveCallback(this.updateMarker, this);

    // enemy units
    this.enemyGroup = this.add.group();
    this.game.physics.enable(this.enemyGroup);
    this.enemyBase = this.enemyGroup.create(32*8, 32*15, 'tiles', this.UNIT.Base);
    this.game.physics.arcade.enable(this.enemyGroup);
    this.game.physics.arcade.enable(this.enemyBase);

  }

  updateMarker() {
    this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 32;
    this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 32;

    if(this.game.input.mousePointer.isDown) {
      if(this.isPlacingUnit) {
        this.placeUnit(this.marker.x, this.marker.y);
      } else if (this.isMarkingAttack) {
        this.attack(this.marker.x, this.marker.y);
      }
    }
  }

  attack(x, y) {
    var event = this.game.time.events.repeat(1000, Infinity, () => {
      var boulder = this.add.sprite(this.spriteMarkingAttack.x, this.spriteMarkingAttack.y, 'tiles', 0);
//       var tween = this.add.tween(boulder).to({x: x, y: y}, 1000, null, true);
//       var signal = new Phaser.Signal();
//       signal.add(() => { boulder.destroy(); });
//       tween.onComplete = signal;



      this.game.physics.arcade.enable(boulder);
      this.game.physics.arcade.moveToXY(boulder, x, y);
      this.game.physics.arcade.collide(boulder, this.enemyBase);
    });
    this.marker.visible = false;
  }

  boulderHitEnemy(boulder, enemyGroup) {
    console.log(boulder);
  }

  placeUnit(x, y) {
    var unit = this.selectedUnit;
    var cost = this.market[unit];

    this.purse -= cost;
    var sprite = this.add.sprite(x, y, 'tiles', unit);

    switch(unit) {
      case this.UNIT.Mine:
        this.setupMine(sprite);
        break;
      case this.UNIT.Catapult:
        this.setupCatapult(sprite);
        break;
    }

    this.isPlacingUnit = false;
    this.marker.visible = false;
  }

  setupMine(sprite) {
    var event = this.game.time.events.repeat(1000, Infinity, () => {this.purse += 1});
  }

  setupCatapult(sprite) {
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(this.catapultClicked, this);
  }

  catapultClicked(sprite) {
    this.isMarkingAttack = true;
    this.marker.visible = true;
    this.spriteMarkingAttack = sprite;
  }

  selectUnit(unit) {
    if(this.market[unit] <= this.purse) {
      this.selectedUnit = unit;
      this.isPlacingUnit = true;
      this.unitSelector.visible = false;
      this.marker.visible = true;
    }
  }

  baseClicked() {
    if(this.unitSelector.visible) {
      this.unitSelector.visible = false;
    } else {
      this.unitSelector.visible = true;
    }
  }

  update () {
    this.purseText.text = "Gold: " + this.purse;
  }

  render() {
  }

}
