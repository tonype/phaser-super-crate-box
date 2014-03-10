Player = function(game) {
	this.SHAKE_LENGTH = 2;
	
	this.WIDTH = 32;
	this.HEIGHT = 32;

    this.game = game;
    this.sprite = null;
    this.cursors = null;
	this.shakeTimer = this.SHAKE_LENGTH;
	this.shake = false;
	this.bullets;
	this.fireRate = 50;
	this.nextFire = 0;
};
 
Player.prototype = {
 
    preload: function () {
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 32);
		this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.shoot = this.game.add.audio('shoot');
    },
 
    create: function () {
		// The player and its settings
		this.sprite = game.add.sprite(320, 0, 'dude');

		//  Player physics properties. Give the little guy a slight bounce.
		this.sprite.body.bounce.y = 0.1;
		this.sprite.body.gravity.y = 1000;
		this.sprite.body.collideWorldBounds = false;

		//  Our two animations, walking left and right.
		this.sprite.animations.add('walk', [0, 1, 2, 3], 10, true);
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.sprite.anchor.setTo(.5,.5);
		
		// bullets bs, this'll need to go somewhere else for true OOP but it's js so w/e
		this.bullets = this.game.add.group();
		this.bullets.createMultiple(50, 'bullet');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
    },
	
	collisionHandler: function(bullet, platform) {
		bullet.kill();
	},

    update: function() {
		 //  Reset the players velocity (movement)
		this.sprite.body.velocity.x = 0;
		
		if (this.cursors.up.isDown)
		{
			if (this.sprite.body.onFloor())
			{
				this.sprite.body.velocity.y = -500;
			}
		}

		if (this.cursors.left.isDown)
		{
			//  Move to the left
			this.sprite.body.velocity.x = -300;
			this.sprite.anchor.setTo(.5,.5);
			this.sprite.scale.x = -1;
			this.sprite.animations.play('walk');
		}
		else if (this.cursors.right.isDown)
		{
			//  Move to the right
			this.sprite.body.velocity.x = 300;
			this.sprite.anchor.setTo(.5,.5);
			this.sprite.scale.x = 1;
			this.sprite.animations.play('walk');
		}
		else
		{
			//  Stand still
			//this.animations.stop();
			this.sprite.animations.play('walk');
			//this.frame = 0;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (this.cursors.up.isDown && this.sprite.body.touching.down)
		{
			this.sprite.body.velocity.y = -350;
		}		
		
		// camera shake (move this to an fx.js later or something)
		if(this.shake)
		{
			this.cameraShake();
			this.shakeTimer--;
			if(this.shakeTimer <= 0)
			{
				this.shake = false;
				this.shakeTimer = this.SHAKE_LENGTH;
				this.game.camera.x = 0;
				this.game.camera.y = 0;
			}
		}

		if (this.fireButton.isDown)
		{
			this.fireWeapon();
		}
		
		// if we fall through the bottom, spawn on top
		if (this.sprite.body.y > 480)
		{
			this.sprite.body.x = 320;
			this.sprite.body.y = -this.HEIGHT;
		}
    },
	
	fireWeapon: function ()
	{
		if(game.time.now > this.nextFire && this.bullets.countDead() > 0)
		{
			this.nextFire = this.game.time.now + this.fireRate;
			var bullet = this.bullets.getFirstExists(false);
			if(bullet)
			{
				bullet.reset(this.sprite.x, this.sprite.y);
				bullet.body.velocity.x = -800;
				//this.shake = true;
				this.shoot.play();
			}
		}
	},
	
	cameraShake: function() {
		var min = -20;
		var max = 20;
		this.game.world.setBounds(0, 0, game.width+20, game.height+2);
		this.game.camera.x+= Math.floor(Math.random() * (max - min + 1)) + min;
		this.game.camera.y+= Math.floor(Math.random() * (max - min + 1)) + min;
	}
};