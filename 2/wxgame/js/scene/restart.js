import Phaser from '../libs/phaser-wx.js';
import gameOptions from '../gameOptions.js';

export default class Restart extends Phaser.State {
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
    // 空间站
    const station = this.add.sprite(gameOptions.width / 2, gameOptions.height / 2, 'station');
    station.scale.set(screenHeightRatio * 0.5);
    station.anchor.setTo(0.5, 0.5);
    this.add.tween(station).to(
      { rotation: Math.PI * 2 },
      5000,
      Phaser.Easing.Linear.Default,
      true, 0, -1);
    // 下方火焰
    const fire = this.add.sprite(0, gameOptions.height * 0.98, 'fire');
    fire.width = gameOptions.width;
    this.add.tween(fire).to(
      { y: gameOptions.height * 0.9 },
      1000,
      Phaser.Easing.Sinusoidal.InOut,
      true, 0, -1, true);
    // GameOver
    const gameover = this.add.sprite(gameOptions.width / 2, 0, 'over');
    gameover.width *= 0.9 * screenWidthRatio;
    gameover.height *= 0.75 * screenHeightRatio;
		gameover.anchor.x = 0.5;
		this.add.tween(gameover).to( 
      {y: gameOptions.height / 8}, 
      1500, 
      Phaser.Easing.Bounce.Out, 
      true
    );
    // 得分
    const bestScore = localStorage.getItem('bestScore');
    const scoreText = this.add.text(
      50 * screenWidthRatio, 
      gameOptions.height / 6 * 5, 
      '本局得分 ' + gameOptions.score + '\n历史最高 ' + bestScore, 
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
      gameOptions.height / 6 * 5, 
      'restart'
    );
		restart.scale.setTo(0.35 * screenWidthRatio);
		restart.anchor.x = 0.5;
		restart.anchor.y = 0.5;
    // restart.alpha = 0;
    this.add.tween(restart).to( 
      {rotation: Math.PI * 2}, 
      1000, 
      Phaser.Easing.Sinusoidal.InOut, 
      true, 1000);
    
    // wxgame修改
    this.input.onDown.add(this.restart, this);
  }

  restart() {
    this.state.start('play');
  }
}