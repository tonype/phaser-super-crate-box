Level = function(game, player) {
    this.game = game;
    this.platforms = null;
	this.map = null;
	this.layer = null;
	this.player = player;
};
 
Level.prototype = {
 
    preload: function() {
		this.game.load.tilemap('scb', 'assets/scb.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('sky', 'assets/sky.png');
		this.game.load.image('ground', 'assets/platform.png');
		this.game.load.image('tile', 'assets/tile.png');
    },
 
    create: function() {
		// add background for this level
		this.game.add.sprite(0, 0, 'sky');

		this.map = game.add.tilemap('scb');
		
		this.map.addTilesetImage('scb_level', 'tile');
		this.map.setCollision(1, true);
		
		this.layer = this.map.createLayer('layer1');
		this.layer.resizeWorld();
    },
 
    update: function() {
		// nothing yet
    }
 
};