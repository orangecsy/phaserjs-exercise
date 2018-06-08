
class Restart extends Phaser.State {
  // 构造器
  constructor() {
    super("Restart");
  }

  create() {
    // 禁止物理引擎作用
    this.world.setBounds(0, 0, 0, 0);
    // 屏幕缩放
    const screenWidthRatio = gameOptions.width / 480;
    const screenHeightRatio = gameOptions.height / 640;
    // 生成sprite
    // 星星闪烁
    const skybox = this.add.sprite(0, 0, 'skybox');
    skybox.width = gameOptions.width;
    skybox.height = gameOptions.height;
    const twinkle = skybox.animations.add('twinkle');
    skybox.animations.play('twinkle', 3, true);
    // 地球
    const earth = this.add.sprite(gameOptions.width / 2, gameOptions.height / 3 * 2, 'earth');
    earth.scale.set(screenHeightRatio);
    earth.anchor.setTo(0.5, 0.5);
    // 火焰
    const fire = this.add.sprite(0, gameOptions.height / 3 * 2, 'fire');
    fire.width = gameOptions.width;
    this.add.tween(fire).to( 
      {y: gameOptions.height / 5 * 3}, 
      1000, 
      Phaser.Easing.Sinusoidal.InOut, 
      true, 0, -1, true);
    // GameOver
    const gameover = this.add.sprite(gameOptions.width / 2, 0, 'over');
    gameover.width *= screenWidthRatio;
    gameover.height *= 0.8 * screenHeightRatio;
		gameover.anchor.x = 0.5;
		this.add.tween(gameover).to( 
      {y: gameOptions.height / 8}, 
      1000, 
      Phaser.Easing.Bounce.Out, 
      true
    );
    // 得分
    const bestScore = localStorage.getItem('bestScore');
    const scoreText = this.add.text(
      20 * screenWidthRatio, 
      gameOptions.height / 7 * 6 - 10 * screenHeightRatio, 
      'Score: ' + gameOptions.score + '\nBest Score: ' + bestScore, 
      { 
        font: "40px Arial", 
        fill: "#ffffff"
      }
    );
    scoreText.scale.set(screenWidthRatio);
    scoreText.anchor.x = 0;
    scoreText.anchor.y = 0.5;

    const restart = this.add.sprite(
      gameOptions.width - 80 * screenWidthRatio, 
      gameOptions.height / 7 * 6 - 10 * screenHeightRatio - 10, 
      'restart'
    );
		restart.scale.setTo(0.6 * screenWidthRatio);
		restart.anchor.x = 0.5;
		restart.anchor.y = 0.5;
    // restart.alpha = 0;
    this.add.tween(restart).to( 
      {rotation: Math.PI * 2}, 
      1000, 
      Phaser.Easing.Sinusoidal.InOut, 
      true, 1000);

    restart.inputEnabled = true;
    restart.events.onInputDown.add(function () {
      this.restart();
    }, this);
  }

  restart() {
    this.state.start('game');
  }
}