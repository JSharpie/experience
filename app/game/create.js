var player;
var walls;
var cursors;
var wasd;
var weapon;
var shield;
var bullets;
var slashes;
var enemies;
var gunEquipped = true;
var swordEquipped = false;
var swung = false;
var fireRate = 100;
var nextFire = 0;
var swingRate = 100;
var nextSlash = 0;
var slash;
var bullet;
var ranOnce = true;
var swingTimer;
var fireTimer;
var fireball;
var fireballHit = false;
var fireballHitWall = false;
var attackTimer;
var rollTimer;
var rollDelay;
var levelTimer;
var ammo;
var ammoText;
var ammocrates = [];
var health;
var yetiSplash;
var firstMap;
var bossMap;
var secondMap;
var layer;
var snowBossLayer;
var secondLevelLayer;
var level = 1;
var loaded = false;
var yeti;
var yetiLoaded = false;
var stats = JSON.parse(localStorage.getItem('stats'));

////////////////// audio

var themeSong;
var gunshot;
var shotgun;
var enemyGunshot;
var gunClick;
var drawSword;
var drawGun;
var drawShield;
var swordSlash;
var ammoEquip;
var laserSwordOn;
var laserSwordOff;
var fireballSound;
var grubCollide;
var bulletKinesis = false;



function create() {
  wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    e: game.input.keyboard.addKey(Phaser.Keyboard.E),
    p: game.input.keyboard.addKey(Phaser.Keyboard.P),
    q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
    f: game.input.keyboard.addKey(Phaser.Keyboard.F),
    z: game.input.keyboard.addKey(Phaser.Keyboard.Z)
  };
  console.log(stats);
  // game.stage.backgroundColor = '#787878';
  firstMap = game.add.tilemap('snowlevelone');
  secondMap = game.add.tilemap('snowmap');
  bossMap = game.add.tilemap('snowbosslevel');


  secondMap.addTilesetImage('tiles', 'tiles');
  secondMap.setCollisionByExclusion([13, 14, 8]);
  bossMap.addTilesetImage('tiles', 'tiles');
  bossMap.setCollisionByExclusion([13, 14, 8]);
  firstMap.addTilesetImage('tiles', 'tiles');
  firstMap.setCollisionByExclusion([13, 14, 8]);

  layer = firstMap.createLayer('LevelOne');
  layer.resizeWorld();





  //bullet physics

  swingTimer = game.time.create();
  attackTimer = game.time.create();
  rollTimer = game.time.create();
  rollDelay = game.time.create();
  fireTimer = game.time.create();
  levelTimer = game.time.create();
  game.input.onDown.add(attack, this);
  wasd.e.onDown.add(function(){
    rollDelay.start();
  }, this);

  wasd.q.onDown.add(function(){
    drawShield.play();
  }, this);

  wasd.f.onDown.add(shootFireball, this);
  // game.stage.backgroundColor = '#fff000';
  yetiSplash = game.add.sprite(0, 0, 'yetisplash');
  yetiSplash.visible = false;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet', 0, false);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(30, 'bullet', 0, false);
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);
  enemyArrows = game.add.group();
  enemyArrows.enableBody = true;
  enemyArrows.physicsBodyType = Phaser.Physics.ARCADE;
  enemyArrows.createMultiple(30, 'arrow', 0, false);
  enemyArrows.setAll('anchor.x', 0.5);
  enemyArrows.setAll('anchor.y', 0.5);
  enemyArrows.setAll('outOfBoundsKill', true);
  enemyArrows.setAll('checkWorldBounds', true);
  slashes = game.add.group();
  slashes.enableBody = true;
  slashes.physicsBodyType = Phaser.Physics.ARCADE;
  slashes.createMultiple(10, 'slash', 0, false);
  slashes.setAll('anchor.x', 0.5);
  slashes.setAll('anchor.y', 0.5);
  slashes.setAll('outOfBoundsKill', true);
  slashes.setAll('checkWorldBounds', true);
  shield = game.add.group();
  shield.enableBody = true;
  shield.physicsBodyType = Phaser.Physics.ARCADE;
  shield.createMultiple(10, 'slash', 0, false);
  shield.setAll('anchor.x', 0.5);
  shield.setAll('anchor.y', 0.5);
  shield.setAll('outOfBoundsKill', true);
  shield.setAll('checkWorldBounds', true);
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.setAll('checkWorldBounds', true);
  // for (var i = 0; i < 20; i++) {
  //   enemy = enemies.create(game.world.randomX, game.world.randomY, 'enemy');
  //   enemy.body.setSize(64, 64, 0, 0);
  // }
  // enemies.setAll('anchor.x', 0.5);
  // enemies.setAll('anchor.y', 0.5);
  // enemies.callAll('animations.add', 'animations', 'idle', [0,1,2,3], true);
  // enemies.callAll('animations.add', 'animations', 'run', [4,5,6,7,8,9], true);
  player = game.add.sprite(500, game.world.height - 301, 'player');
  player.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(player);
  player.body.setSize(64, 64);
  player.body.collideWorldBounds = true;
  player.ammo = 60;
  player.health = 10 + stats.endurance;
  player.stamina = 100 + Math.floor(stats.endurance/5);
  player.mana = 100 + (stats.wisdom/2);
  player.skillPoints = 3;
  addWeapon('gun');
  addShield();
  game.camera.follow(player);
  loadEnemies();
  game.input.onDown.add(unpause, self);
  ammoText = game.add.text(0, 0, "Ammo: " + player.ammo, {
    font: "15px gamegirl",
    fill: "#ff0044",
    align: "left"
  });
  ammoText.fixedToCamera = true;
  ammoText.cameraOffset.setTo(0, 0);
  health = game.add.text(0, 0, "Health: " + player.health, {
    font: "15px gamegirl",
    fill: "#ff0044",
    align: "left"
  });
  health.fixedToCamera = true;
  health.cameraOffset.setTo(150, 0);
  stamina = game.add.text(0, 0, "Stamina: " + player.stamina, {
    font: "15px gamegirl",
    fill: "#17a82e",
    align: "left"
  });
  stamina.fixedToCamera = true;
  stamina.cameraOffset.setTo(325, 0);
  mana = game.add.text(0, 0, "Mana: " + player.mana, {
    font: "15px gamegirl",
    fill: "#1664bf",
    align: "left"
  });
  mana.fixedToCamera = true;
  mana.cameraOffset.setTo(525, 0);
  nextLevel = game.add.text(0, 0, "Level " + level, {
    font: "75px gamegirl",
    fill: "#ffffff",
    align: "left"
  });
  nextLevel.fixedToCamera = true;
  nextLevel.cameraOffset.setTo(825, 200);
  nextLevel.visible = false;
  nextLevel.wordWrap = true;
  nextLevel.wordWrapWidth = 50;
  demoOver = game.add.text(0, 0, "Demo Completed", {
    font: "75px gamegirl",
    fill: "#333333",
    align: "left"
  });
  demoOver.fixedToCamera = true;
  demoOver.cameraOffset.setTo(85, 230);
  demoOver.visible = false;
  dead = game.add.text(0, 0, "Dead", {
    font: "150px gamegirl",
    fill: "#333333",
    align: "left"
  });
  dead.fixedToCamera = true;
  dead.cameraOffset.setTo(300, 175);
  dead.visible = false;
  dead.bringToTop();
  //movement animations
  var run = player.animations.add('run', [4, 5, 6, 7, 8]);
  var idle = player.animations.add('idle', [0, 1, 2, 3]);
  cursors = game.input.keyboard.createCursorKeys();


  themeSong = game.add.audio('themeSong');
  // themeSong.play();
  gunshot = game.add.audio('gunshot');
  shotgun = game.add.audio('shotgun');
  enemyGunshot = game.add.audio('enemyGunshot');
  gunClick = game.add.audio('gunClick');
  drawSword = game.add.audio('drawSword');
  drawGun = game.add.audio('drawGun');
  swordSlash = game.add.audio('swordSlash');
  ammoEquip = game.add.audio('ammoEquip');
  laserSwordOn = game.add.audio('laserSwordOn');
  laserSwordOff = game.add.audio('laserSwordOff');
  drawShield = game.add.audio('drawShield');
  fireballSound = game.add.audio('fireball');
  grubCollide = game.add.audio('grubCollide');
  game.sound.setDecodedCallback([ gunshot, enemyGunshot, gunClick, drawSword, drawGun, drawShield, swordSlash, ammoEquip, themeSong, laserSwordOn, laserSwordOff, fireballSound], start, this);
}


///////////////////////////////////////////////////////////////////////// audio

// game.audio = {}
// game.audio.gunshot = game.add.audio(‘gunshot’);
