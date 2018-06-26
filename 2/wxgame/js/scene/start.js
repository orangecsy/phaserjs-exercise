import Phaser from '../libs/phaser-wx.js';
import gameOptions from '../gameOptions.js';
import Music from '../music.js'

export default class Start extends Phaser.State {
  // 构造器
  constructor(game) {
    super("Start");
    this.game = game;
  }

  // 预加载
  preload() {
    // wxgame路径前不能加'./'
    // 图像宽度限制2048，裁剪
    // 图片路径
    const images = {
      'earth': 'images/earth.png',
      'sat1': 'images/sat1.png',
      'sat2': 'images/sat2.png',
      'sat3': 'images/sat3.png',
			'rocket': 'images/rocket.png',
			'play': 'images/play.png',
			'title': 'images/title.png',
			'fire': 'images/fire.png',
			'over': 'images/over.png',
			'restart': 'images/restart.png',
			'particle1': 'images/particulelune1.png',
			'particle2': 'images/particulelune2.png',
      'station': 'images/station.png'
    };
    // 载入图片
		for (let name in images) {
			this.load.image(name, images[name]);
    }
    // 载入天空盒
    this.load.spritesheet('skybox', 'images/stars.png', 480, 640, 4);
    // wxgame修改音乐播放
  }

  create() {
    // wxgame修改
    // 播放背景音乐
    this.music = new Music();
    this.music.playBgm();
    
    // 屏幕比例系数
    const screenWidthRatio = gameOptions.width / 480;
    const screenHeightRatio = gameOptions.height / 640;

    // 星星闪烁
    const skybox = this.add.sprite(0, 0, 'skybox');
    skybox.width = gameOptions.width;
    skybox.height = gameOptions.height;
    const twinkle = skybox.animations.add('twinkle');
    skybox.animations.play('twinkle', 3, true);

    // 标题
    const title = this.add.sprite(gameOptions.width / 2, gameOptions.height / 4, 'title');
    title.width *= 0.9 * screenWidthRatio;
    title.height *= 0.7 * screenHeightRatio;
    title.anchor.set(0.5);
    this.add.tween(title).to( 
      {y: gameOptions.height / 3}, 
      2000, 
      Phaser.Easing.Sinusoidal.InOut, 
      true, 0, -1, true);

    // 开始按钮
    const startButton = this.add.group();
    startButton.x = this.world.width / 2;
    startButton.y = gameOptions.height * 0.7;
    startButton.scale.set(0.78);

    // 开始按钮中加入地球、火箭
    const earthGroup = this.add.group();
    const earth = this.add.sprite(0, 0, 'earth');
    earth.scale.set(screenWidthRatio * 2);
    earth.anchor.set(0.5, 0.5);
    earthGroup.add(earth);
    const rocket = this.add.sprite(0, 0, 'rocket');
    rocket.anchor.set(0.5, 1);
    rocket.scale.set(0.3 * screenWidthRatio);
    rocket.y = -165 * screenWidthRatio;
    earthGroup.add(rocket);
    this.add.tween(earthGroup).to(
      {rotation: Math.PI * 2}, 
      5000, 
      Phaser.Easing.Linear.Default, 
      true, 0, -1);
    // 整体加入到开始按钮
    startButton.add(earthGroup);

    // 开始按钮中加入播放键
    const playButton = this.add.sprite(10, 0, 'play');
    playButton.scale.set(screenHeightRatio * 0.6);
    playButton.anchor.set(0.5);
    startButton.add(playButton);

    // wxgame修改，点击事件
    this.input.onDown.add(this.play, this);

    // 下方火焰
    const fire = this.add.sprite(0, gameOptions.height * 0.98, 'fire');
    fire.width = gameOptions.width;
    this.add.tween(fire).to( 
      {y: gameOptions.height * 0.9}, 
      1000, 
      Phaser.Easing.Sinusoidal.InOut, 
      true, 0, -1, true);
  }

  play() {
    this.state.start('play');
	}
}
