import Phaser from '../libs/phaser-wx.js';

// 全局游戏设置
const gameOptions = {
  // 角速度，每帧多少度
  rotationSpeed: 3,
  // 投掷飞刀的时间，单位毫秒
  throwSpeed: 150,
  // 两刀间最小间隔角度
  minAngle: 15
}

export default class PlayGame extends Phaser.State {
  // 构造函数
  constructor(game) {
    super();
    this.game = game;
  }

  // 游戏载入前加载资源
  preload() {
    // 加载图片
    this.load.image("target", "target.png");
    this.load.image("knife", "knife.png");
  }

  // this.game.config.width / 2
  // 场景创建时执行
  create() {
    // 是否可以投掷飞刀
    this.canThrow = true;
    // 已投飞刀数组
    this.knifeGroup = this.add.group();
    // 增加一把刀
    this.knife = this.add.sprite(this.game.config.width / 2 - 20, this.game.config.height / 5 * 4, "knife");

    // 增加圆木
    this.target = this.add.sprite(this.game.config.width / 2, this.game.config.height / 5 * 1.8, "target");
    // 圆木在前，刀在后
    this.target.depth = 1;
    // 等待投掷飞刀
    // this.input.on("pointerdown", this.throwKnife, this);
    // this.input.touch.onTouchStart = this.throwKnife;
    this.input.onDown.add(this.throwKnife, this);
  }

  // 投掷飞刀方法
  throwKnife() {
    // 判断是否可以投掷
    if (this.canThrow) {
      // 投掷后一段时间不可再次投掷
      this.canThrow = false;
      this.game.add.tween(this.knife).to(
        { y: this.target.y + this.target.width / 4 },
        gameOptions.throwSpeed,
        Phaser.Easing.Sinusoidal.InOut,
        true)
        .onComplete.add(this.knifeTween, this);
    }
  }

  knifeTween() {
    // 判断飞刀是否可以插入圆木
    let legalHit = true;
    // 获取在圆木上旋转的飞刀数组
    const children = this.knifeGroup.children;
    // 遍历飞刀数组
    for (let i = 0; i < children.length; i++) {
      // 判断刀间夹角是否满足条件
      if (Math.abs(Phaser.Math.getShortestAngle(
        this.target.angle,
        children[i].impactAngle)) < gameOptions.minAngle) {
        // 不满足条件
        legalHit = false;
        break;
      }
    }
    // 判断是否满足条件
    if (legalHit) {
      // 可以继续投掷
      this.canThrow = true;
      // 飞刀数组中增加本次飞刀
      const knife = this.add.sprite(this.knife.x, this.knife.y, "knife");
      // 存储目标角度
      knife.impactAngle = this.target.angle;
      // 添加到数组
      this.knifeGroup.add(knife);
      // 新生成一把刀
      this.knife.y = this.game.config.height / 5 * 4;
    }
    else {
      // 掉下来的动画
      this.game.add.tween(this.knife).to(
        { 
          y: this.game.config.height + this.knife.height,
          rotation: 4
        },
        gameOptions.throwSpeed * 6,
        Phaser.Easing.Sinusoidal.InOut,
        true)
        .onComplete.add(this.newGame, this);
    }
  }

  newGame() {
    this.state.start('game');
  }

  // 每帧更新
  update() {
    // 修改锚点
    this.target.anchor.setTo(0.5, 0.5);
    // 旋转圆木
    this.target.angle += gameOptions.rotationSpeed;
    // 获取圆木上的飞刀数组
    // 修改获取数组方法->this.knifeGroup.children
    const children = this.knifeGroup.children;
    // 遍历飞刀数组
    for (let i = 0; i < children.length; i++) {
      // 旋转每个飞刀
      children[i].angle += gameOptions.rotationSpeed;
      // 度转弧度
      // phaser2修改为Phaser.Math.degToRad
      const radians = Phaser.Math.degToRad(children[i].angle + 90);
      // 计算x,y使其围绕中心旋转
      children[i].x = this.target.x + (this.target.width / 4) * Math.cos(radians);
      children[i].y = this.target.y + (this.target.width / 4) * Math.sin(radians);
    }
  }
}