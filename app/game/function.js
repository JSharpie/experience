var fireRate = 100;
var nextFire = 0;
var swingRate = 100;
var nextSlash = 0;
var slash;
var bullet;
var ranOnce = true;
function gunFire() {
  if (!game.paused && !shieldEquipped) {
    if (game.time.now > nextFire && bullets.countDead() > 0 && player.ammo > 0) {
      gunshot.play();
      nextFire = game.time.now + fireRate;
      bullet = bullets.getFirstExists(false);
      bullet.scale.setTo(0.5, 0.5);
      bullet.rotation = game.physics.arcade.angleToPointer(weapon);
      bullet.reset(player.body.center.x, player.body.center.y);
      bullet.body.setSize(32, 32);
      game.physics.arcade.moveToPointer(bullet, 750, game.input.activePointer);
      player.ammo--;
      ammoText.text = 'Ammo: ' + player.ammo;
      if(wasd.z.isDown){
        player.mana -= 25;
        bulletKinesis = true;
        bullet.anchor.setTo(0.5, 0.5);
      }
    } else {
      gunClick.play();
      return;
    }
  }
}

function swordSwing() {
  if (!game.paused && !shieldEquipped) {
    if (game.time.now > nextFire && slashes.countDead() > 0) {
      nextSlash = game.time.now + swingRate;
      slash = slashes.getFirstExists(false);
      slash.rotation = game.physics.arcade.angleToPointer(weapon) + 0.80;
      slash.reset(player.body.center.x, player.body.center.y);
      game.physics.arcade.moveToPointer(slash, 750, game.input.activePointer);
      swingTimer.start();
    }
    if (swung === true) {
      swung = false;
    } else {
      swung = true;
    }
  }
}

function addWeapon(wpn, type) {
  if (type === 'sword') {
    drawSword.play();
    swordEquipped = true;
    gunEquipped = false;
  }
  if (type === 'laserSword') {
    laserSwordOn.play();
    swordEquipped = true;
    gunEquipped = false;
  }
  if (type === 'gun') {
    drawGun.play();
    gunEquipped = true;
    swordEquipped = false;
  }

  weapon = game.add.sprite(player.body.x, player.body.y, wpn);

  weapon.enableBody = true;
  game.physics.arcade.enable(weapon);
  weapon.scale.setTo(0.5, 0.5);
  if (type === "laserSword") {
    weapon.scale.setTo(0.75, 0.75);
  }
  weapon.anchor.setTo(0.05, 0.45);
  // game.physics.arcade.enable(weapon);
}

function addShield() {
  shield = game.add.sprite(player.body.x, player.body.y, 'shield');
  var shieldFlicker = shield.animations.add('shieldFlicker', [0, 1, 2, 3, 4], 1);
  shield.enableBody = true;
  game.physics.arcade.enable(shield);
  shield.anchor.setTo(0.5, 0.5);
  shield.scale.setTo(1, 1);
}

function dropAmmo(x, y) {
  ammo = game.add.sprite(x, y, 'ammo');
  ammo.scale.setTo(0.6, 0.6);
  ammocrates.push(ammo);
}

function collectAmmo(player, ammo) {
  ammoEquip.play();
  ammo.destroy();
  player.ammo += 25;
  ammoText.text = 'Ammo: ' + player.ammo;
}

function attack() {
  attackTimer.start();
  if (gunEquipped) {
    gunFire();
  }
  if (swordEquipped && attackTimer.seconds > 0.3) {
    swordSlash.play();
    swordSwing();
    attackTimer.stop();
  }
}
function loadEnemies(){
  if(level === 2 || level === 3){
    enemies = [];
    enemiesTotal = 5;
    enemiesAlive = 5;
    for (var i = 0; i < enemiesTotal; i++) {
      enemies.push(new Enemy(i, game, player, bullets));
    }
  }
  grubs = [];
  grubsTotal = 7;
  grubsAlive = 7;
  for(var i = 0; i < grubsTotal; i++){
    grubs.push(new Grub(i, game, player));
  }
}
function loadYeti(){
  yetiAlive = 0;
  console.log('yeti loaded');
  if(snowBossLayer != undefined && level === 3){
    yeti = [];
    yetiTotal = 1;
    yetiAlive = 1;
    for(var i = 0; i < yetiTotal; i++){
      yeti.push(new Yeti(i, game, player, bullets));
    }
  }
}
function loadEnemiesPhysics(){
  enemiesAlive = 0;
  grubsAlive = 0;
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemiesAlive++;
      game.physics.arcade.overlap(bullets, enemies[i].enemy, bulletHitEnemy, null, this);
      game.physics.arcade.overlap(slashes, enemies[i].enemy, bulletHitEnemy, null, this);
      game.physics.arcade.overlap(enemies[i].enemy, fireball, fireHitEnemy, null, this);
      enemies[i].update();
    }
  }
  for(var i = 0; i < grubs.length; i++) {
    if(grubs[i].alive) {
      grubsAlive++;
      game.physics.arcade.overlap(bullets, grubs[i].enemy, bulletHitEnemy, null, this);
      game.physics.arcade.overlap(slashes, grubs[i].enemy, bulletHitEnemy, null, this);
      game.physics.arcade.overlap(grubs[i].enemy, fireball, fireHitEnemy, null, this);
      game.physics.arcade.collide(player, grubs[i].enemy, grubHitPlayer, null, this);
      grubs[i].update();
    }
  }

  if(snowBossLayer != undefined && yeti != undefined){
    // yetiAlive = 0;
    for(var i = 0; i < yeti.length; i++) {
      if(yeti[i].alive) {
        yetiAlive++;
        game.physics.arcade.overlap(bullets, yeti[i].enemy, bulletHitEnemy, null, this);
        game.physics.arcade.overlap(slashes, yeti[i].enemy, bulletHitEnemy, null, this);
        game.physics.arcade.collide(yeti[i].enemy, fireball, fireHitEnemy, null, this);
        yeti[i].update();
      }
    }
  }
}
function collided(bullet) {
  if (gunEquipped) {
    bullet.kill();
  }
}
function grubHitPlayer(player, grub){
  if(grub.hitTimer.running === false){
    grub.hitTimer.start();
  }

  if(grub.hitTimer.seconds > 1 && shieldEquipped === false){
    grubCollide.play();
    player.health = player.health - 2;
    health.text = "Health: " + player.health;
    grub.hitTimer.stop(false);
  }



}



function bulletHitEnemy(enemy, bullet) {
  bullet.kill();
  if(enemy.key === 'enemy'){
    enemies[enemy.name].damage();
  }
  if(enemy.key === 'grub'){
    grubs[enemy.name].damage();
  }
  if(enemy.key === 'spaceyeti'){
    yeti[enemy.name].damage();
  }
}

function bulletBlocked(shield, bullet) {
  bullet.kill();
}

function bulletHitPlayer(player, bullet) {
  bullet.kill();
  console.log(bullet);
  if(bullet.key === "arrow"){
    player.health = player.health - 3;
  }
  player.health = player.health - 1;
  health.text = 'Health: ' + player.health;
}

function processHandler(projectile, enemy) {
  return true;
}

function gameOver() {
  dead.bringToTop();
  dead.visible = true;
  game.paused = true;
}
function fireHitEnemy(enemy, fireball){
  fireballHit = true;
  if(enemy.key === 'enemy'){
    enemies[enemy.name].damage();
  }
  if(enemy.key === 'grub'){
    grubs[enemy.name].damage();
  }
  if(enemy.key === 'spaceyeti'){
    fireHitWall(fireball);
    yeti[enemy.name].damage();
  }
}
function fireHitWall(fireball){
  fireballHitWall = true;
  fireTimer.start();
}
function unpause(event) {
  // Only act if paused
  if (game.paused) {
    // Calculate the corners of the menu
    var x1 = rollIcon.x - game.camera.x,
      x2 = rollIcon.x - game.camera.x + 128,
      y1 = rollIcon.y - game.camera.y,
      y2 = rollIcon.y - game.camera.y + 128;
    // var x1 = choiseLabel.x - game.camera.x,
    //   x2 = choiseLabel.x - game.camera.x + 128,
    //   y1 = choiseLabel.y - game.camera.y,
    //   y2 = choiseLabel.y - game.camera.y + 128;
    if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
      // console.log('roll clicked');
      player.skillPoints -= 1;
    } else {
      rollIcon.destroy();
      // choiseLabel.destroy();
      // Unpause the game
      game.paused = false;
    }
  }
};


function roll() {
  if (wasd.up.isDown) {
    player.body.velocity.y = -600;
    player.animations.play('run', 20, true);
    player.angle += 20;
    game.time.events.add(Phaser.Timer.HALF * 1, slowDownUp, this);
  }

  function slowDownUp() {
    player.body.velocity.y = -150;
    player.animations.play('run', 10, true);
  }
  if (wasd.down.isDown) {
    player.body.velocity.y = 600;
    player.animations.play('run', 20, true);
    player.angle += 20;
    game.time.events.add(Phaser.Timer.HALF * 1, slowDownDown, this);
  }

  function slowDownDown() {
    player.body.velocity.y = 150;
    player.animations.play('run', 10, true);
  }
  if (wasd.left.isDown) {
    player.body.velocity.x = -600;
    player.animations.play('run', 40, true);
    player.angle += 20;
    game.time.events.add(Phaser.Timer.HALF * 1, slowDownLeft, this);
  }

  function slowDownLeft() {
    player.body.velocity.x = -150;
    player.animations.play('run', 10, true);
  }
  if (wasd.right.isDown) {
    player.body.velocity.x = 600;
    player.animations.play('run', 20, true);
    player.angle += 20;
    game.time.events.add(Phaser.Timer.HALF * 1, slowDownRight, this);
  }

  function slowDownRight() {
    player.body.velocity.x = 150;
    player.animations.play('run', 10, true);
  }
}
