
let game;

// 全局游戏设置
const gameOptions = {
  // 初始分数
  scoreInit: 1000,
  // 本局分数
  score: 0,
  // 屏幕宽高
  width: 750,
  height: 1334,
  // 重力
  gravity: 200,
  // 墙
  rectWidth: 100,
  wallWidth: 5,
  // 地球
  earthRadius: 100,
  // 飞船速度
  speed: 600
}

window.onload = () => {
  // 配置信息
  const config = {
    // 界面宽度，单位像素
    // width: 750,
    width: gameOptions.width,
    // 界面高度
    height: gameOptions.height,
    // 渲染类型
    renderer: Phaser.AUTO,
    parent: 'render'
  };
  // 声明游戏对象
  game = new Phaser.Game(config);
  // 添加状态
  game.state.add('start', Start);
	game.state.add('game', Game);
  game.state.add('restart', Restart);
  // 开始界面
  game.state.start('start');
}

class Start extends Phaser.State {
  // 构造器
  constructor() {
    super("Start");
  }

  // 预加载
  preload() {
    // 图片路径
    const images = {
      'earth': './assets/img/earth.png',
      'sat1': './assets/img/sat1.png',
      'sat2': './assets/img/sat2.png',
      'sat3': './assets/img/sat3.png',
			'rocket': './assets/img/rocket.png',
			'play': './assets/img/play.png',
			'title': './assets/img/title.png',
			'fire': './assets/img/fire.png',
			'over': './assets/img/over.png',
			'restart': './assets/img/restart.png',
			'particle1': './assets/img/particulelune1.png',
      'particle2': './assets/img/particulelune2.png',
      'station': './assets/img/station.png'
    };
    // 载入图片
		for (let name in images) {
			this.load.image(name, images[name]);
    }
    // 载入天空盒
    this.load.spritesheet('skybox', './assets/img/stars.png', 480, 640, 5);
    // 音乐路径
    const audios = {
			'bgMusic':'./assets/audio/music.mp3',
			'jump':'./assets/audio/jump.wav',
			'explosion':'./assets/audio/explosion.mp3'
    }
    // 载入音乐
		for(let name in audios){
			this.load.audio(name, audios[name]);
		}
  }

  create() {
    // 播放背景音乐
    const bgMusic = this.add.audio('bgMusic', 0.3, true);
    bgMusic.play();
    
    // 屏幕比例系数
    const screenWidthRatio = gameOptions.width / 480;
    const screenHeightRatio = gameOptions.height / 640;

    // 星星闪烁
    const skybox = game.add.sprite(0, 0, 'skybox');
    skybox.width = gameOptions.width;
    skybox.height = gameOptions.height;
    const twinkle = skybox.animations.add('twinkle');
    skybox.animations.play('twinkle', 3, true);

    // 标题
    const title = this.add.sprite(gameOptions.width / 2, gameOptions.height / 5, 'title');
    title.width *= screenWidthRatio;
    title.height *= 0.8 * screenHeightRatio;
    title.anchor.set(0.5);
    this.add.tween(title).to( 
      {y: gameOptions.height / 4}, 
      1500, 
      Phaser.Easing.Sinusoidal.InOut, 
      true, 0, -1, true);

    // 开始按钮
    const startButton = this.add.group();
    startButton.x = this.world.width / 2;
    startButton.y = gameOptions.height * 0.65;
    startButton.scale.set(0.7);

    // 开始按钮中加入地球、火箭
    const earthGroup = this.add.group();
    const earth = this.add.sprite(0, 0, 'earth');
    earth.scale.set(screenHeightRatio * 1.7);
    earth.anchor.set(0.5);
    earthGroup.add(earth);
    const rocket = this.add.sprite(0, 0, 'rocket');
    rocket.anchor.set(0.5, 1);
    rocket.scale.set(0.25 * screenHeightRatio);
    rocket.y = -140 * screenHeightRatio;
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
    playButton.scale.set(0.7 * screenHeightRatio);
    playButton.anchor.set(0.5);
    startButton.add(playButton);

    // startButton可点击，只能挂载到earth上
    earth.inputEnabled = true;
    earth.events.onInputDown.add(function () {
      this.play();
    }, this);

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
    this.state.start('game');
	}
}
