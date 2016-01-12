function update() {
  player.body.velocity.x = 0;
  if(ammocrates){
    for(var i = 0; i < ammocrates.length; i++){
      game.physics.arcade.enable(ammocrates[i]);
      game.physics.arcade.overlap(player, ammocrates[i], collectAmmo, null, this);
    }
  }
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(bullets, layer, collided);
  game.physics.arcade.collide(fireball, layer, fireHitWall);
  game.physics.arcade.collide(enemyBullets, layer, collided);
  if(secondLevelLayer != undefined && level === 2){
    game.physics.arcade.collide(player, secondLevelLayer);
    game.physics.arcade.collide(bullets, secondLevelLayer, collided);
    game.physics.arcade.collide(fireball, secondLevelLayer, fireHitWall);
    game.physics.arcade.collide(enemyBullets, secondLevelLayer, collided);
  }
  if(snowBossLayer != undefined && level === 3){
    game.physics.arcade.collide(player, snowBossLayer);
    game.physics.arcade.collide(bullets, snowBossLayer, collided);
    game.physics.arcade.collide(fireball, snowBossLayer, fireHitWall);
    game.physics.arcade.collide(enemyBullets, snowBossLayer, collided);
  }
  weapon.x = player.body.x + 32;
  weapon.y = player.body.y + 32;
  if(weapon.key === "assaultrifle"){
    weapon.y = player.body.y + 36;
  }
  shield.x = player.body.x + 32;
  shield.y = player.body.y + 32;
  if(wasd.q.isUp){
    shield.visible = false;
  }
  if(shield.visible === false){
    shieldEquipped = false;
  }
  if(shield.visible === true){
    shieldEquipped = true;
  }
  if(weapon.key === "gun"){
    fireRate = 100;
  }
  if(weapon.key === "assaultrifle"){
    fireRate = 150;
  }
  weapon.visible = true;
  shield.body.enable = false;
  if(fireball != undefined && fireballHitWall === false){
    fireball.animations.play('fireFlicker', 12);
  }
  if(fireball != undefined && fireballHitWall === true){
    fireball.animations.play('fireExplode', 10);
    fireball.body.velocity.x = 0;
    fireball.body.velocity.y = 0;
    if(fireTimer.seconds > 0.5){
      fireball.kill();
      fireballHitWall = false;
      fireTimer.stop();
    }
  }
  if(weapon.key === "assaultrifle" && game.input.mousePointer.isDown){
    gunFire();
  }
  game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);
  game.physics.arcade.overlap(enemyArrows, player, bulletHitPlayer, null, this);
  if (swordEquipped) {
    weapon.anchor.setTo(0, 1);
    weapon.y = player.body.y + 40;
  }
  if(weapon.key === "assaultrifle"){
    weapon.anchor.setTo(0.25, 0.5);
  }
  weapon.rotation = game.physics.arcade.angleToPointer(weapon);
  if (game.input.mousePointer.x < player.x - game.camera.x) {
    player.scale.x = -1;
    weapon.x = player.body.x + 32;
    if (weapon.key === "gun") {
      weapon.scale.y = -0.5;
    }
    if(weapon.key === "assaultrifle"){
      weapon.scale.y = -0.75;
    }

  } else {
    player.scale.x = 1;
    if (weapon.key === "gun") {
      weapon.scale.y = 0.5;
    }
    if(weapon.key === "assaultrifle"){
      weapon.scale.y = 0.75;
    }
  }
  if(player.health <= 0){
    gameOver();
  }
  loadEnemiesPhysics();
  if(levelTimer.running === false){
    loaded = false;
  }
  if(grubsAlive === 0 && enemiesAlive === 0 && yetiLoaded === false && level === 3){
    loadYeti();
    yetiLoaded = true;
  }
  if(yeti != undefined){
    if(yeti[0].alive === false){
      demoOver.visible = true;
      game.paused = true;;
    }
  }
  if(grubsAlive === 0 && enemiesAlive === 0 && yetiLoaded === false){
    if(levelTimer.running === false){
      levelTimer.start();
      yetiSplash.visible = true;
      nextLevel.visible = true;
      yetiSplash.width = 1280;
      yetiSplash.bringToTop();
      nextLevel.text = "Level: " + (level + 1);
      nextLevel.bringToTop();
      player.x = 0;
      player.y = 0;
      for(var i = 0; i < ammocrates.length; i++){
        ammocrates[i].destroy();
      }
    }
    if(levelTimer.seconds > 5){
      level++;
      player.x = 500;
      player.y = 500;
      yetiSplash.visible = false;
      nextLevel.visible = false;
      if(level === 2 && loaded === false){
        layer.destroy();
        secondLevelLayer = secondMap.createLayer('SnowLevel');
        secondLevelLayer.resizeWorld();
        loadEnemies();
        secondLevelLayer.sendToBack();
        loaded = true;
      }
      if(level === 3 && loaded === false){
        secondLevelLayer.destroy();
        snowBossLayer = bossMap.createLayer('SnowBossLevel');
        snowBossLayer.resizeWorld();
        loadEnemies();
        snowBossLayer.sendToBack();
        loaded = true;
      }
      levelTimer.stop();
    }

  }
  if(wasd.p.isDown) {
    game.paused = true;
    // menu = game.add.sprite(game.camera.x + 400, game.camera.y +300, 'menu');
    //     menu.anchor.setTo(0.5, 0.5);
        // choiseLabel = game.add.text(game.camera.x + 460, game.camera.y + 230, 'Paused', { font: '100px Arial', fill: '#000000' });
    //     choiseLabel.anchor.setTo(0.5, 0.5);
    rollIcon = game.add.sprite(game.camera.x + 200, game.camera.y + 100, 'rollIcon');
  }
  move();
  if(bulletKinesis === true){
    game.physics.arcade.moveToPointer(bullet, 750, game.input.activePointer, 400);
    bullet.rotation = game.physics.arcade.angleToPointer(bullet);
    ammoText.text = 'Ammo: ' + player.ammo;
    if(wasd.z.isUp){
      bulletKinesis = false;
    }
  }
  if (game.input.keyboard.isDown(Phaser.KeyCode.ONE)) {
    weapon.kill();
    addWeapon('gun', 'gun');
  }

  if (game.input.keyboard.isDown(Phaser.KeyCode.TWO)) {
    weapon.kill();
    addWeapon('sword', 'sword');
  }
  if(game.input.keyboard.isDown(Phaser.KeyCode.THREE)) {
    weapon.kill();
    addWeapon('laserSword', 'laserSword');
  }
  if(game.input.keyboard.isDown(Phaser.KeyCode.FOUR)) {
    weapon.kill();
    addWeapon('assaultrifle', 'gun');
  }
  activateShield();

  if (swung === true && swordEquipped) {
    weapon.angle = weapon.angle + 90;
  }
  if (swingTimer.seconds > 0.1) {
    slash.kill();
    swingTimer.stop();
  }
  if(rollDelay.seconds < 0.5 && rollDelay.running === true && player.stamina >= 25 && player.hasRoll){
    roll();
  }
  if(rollDelay.seconds > 0.5 && player.stamina >= 25){
    rollDelay.stop();
    player.stamina -= 25
    player.angle = 0;
  }
  restoreMana();
}
