
import 'phaser';

// 游戏对象
let game;

// 全局游戏设置
const gameOptions = {
    // 角速度，每帧多少度
    rotationSpeed: 3,
    // 投掷飞刀的时间，单位毫秒
    throwSpeed: 150,
    // 两刀间最小间隔角度
    minAngle: 15
}

// 载入时初始化
window.onload = function () {
  // 配置信息
  const config = {
    // 渲染类型
    type: Phaser.CANVAS,
    // 界面宽度，单位像素
    width: 750,
    // 界面高度
    height: 1334,
    // 背景色
    backgroundColor: 0x444444,
    // 场景
    scene: [playGame]
  };

  // 声明游戏对象
  game = new Phaser.Game(config);
  // 获取焦点，调节界面大小
  window.focus();
  resize();
  window.addEventListener("resize", resize, false);
}

// 游戏主场景
class playGame extends Phaser.Scene {
  // 构造器
  constructor() {
    super("PlayGame");
  }

  // 游戏载入前加载资源
  preload() {
    // 加载图片
    this.load.image("target", "target.png");
    this.load.image("knife", "knife.png");
  }

  // 场景创建时执行
  create(){
    // 是否可以投掷飞刀
    this.canThrow = true;
    // 已投飞刀数组
    this.knifeGroup = this.add.group();
    // 增加一把刀
    this.knife = this.add.sprite(game.config.width / 2, game.config.height / 5 * 4, "knife");
    // 增加圆木
    this.target = this.add.sprite(game.config.width / 2, 400, "target");
    // 圆木在前，刀在后
    this.target.depth = 1;
    // 等待投掷飞刀
    this.input.on("pointerdown", this.throwKnife, this);
  }

  // 投掷飞刀方法
  throwKnife() {
    // 判断是否可以投掷
    if (this.canThrow) {
      // 投掷后一段时间不可再次投掷
      this.canThrow = false;
      // 飞刀动画
      this.tweens.add({
        // 将到加入targets
        targets: [this.knife],
        // y方向目标
        y: this.target.y + this.target.width / 2,
        // 动画时间
        duration: gameOptions.throwSpeed,
        // 回调范围
        callbackScope: this,
        // 动画完成后的回调函数
        onComplete: function (tween) {
          // 判断飞刀是否可以插入圆木
          let legalHit = true;
          // 获取在圆木上旋转的飞刀数组
          const children = this.knifeGroup.getChildren();
          // 遍历飞刀数组
          for (let i = 0; i < children.length; i++) {
            // 判断刀间夹角是否满足条件
            if(Math.abs(Phaser.Math.Angle.ShortestBetween(
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
            this.knife.y = game.config.height / 5 * 4;
          }
          else{
            // 掉下来的动画
            this.tweens.add({
              // 加到targets数组
              targets: [this.knife],
              // y方向目标
              y: game.config.height + this.knife.height,
              // 旋转度数，弧度制
              rotation: 5,
              // 动画时间
              duration: gameOptions.throwSpeed * 4,
              // 回调范围
              callbackScope: this,
              // 回调函数
              onComplete: function(tween) {
                // 开始新一局
                this.scene.start("PlayGame")
              }
            });
          }
        }
      });
    }
  }
  // 每帧更新
  update() {
    // 旋转圆木
    this.target.angle += gameOptions.rotationSpeed;
    // 获取圆木上的飞刀数组
    const children = this.knifeGroup.getChildren();
    // 遍历飞刀数组
    for (let i = 0; i < children.length; i++){
      // 旋转每个飞刀
      children[i].angle += gameOptions.rotationSpeed;
      // 度转弧度
      const radians = Phaser.Math.DegToRad(children[i].angle + 90);
      // 计算x,y使其围绕中心旋转
      children[i].x = this.target.x + (this.target.width / 2) * Math.cos(radians);
      children[i].y = this.target.y + (this.target.width / 2) * Math.sin(radians);
    }
  }
}

// 调节界面大小
function resize() {
  const canvas = document.querySelector("canvas");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = game.config.width / game.config.height;
  if(windowRatio < gameRatio){
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else{
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}




// function preload ()
// {
//     this.load.setBaseURL('http://labs.phaser.io');

//     this.load.image('sky', 'assets/skies/space3.png');
//     this.load.image('logo', 'assets/sprites/phaser3-logo.png');
//     this.load.image('red', 'assets/particles/red.png');
// }

// function create ()
// {
//     this.add.image(400, 300, 'sky');

//     var particles = this.add.particles('red');

//     var emitter = particles.createEmitter({
//         speed: 100,
//         scale: { start: 1, end: 0 },
//         blendMode: 'ADD'
//     });

//     var logo = this.physics.add.image(400, 100, 'logo');

//     logo.setVelocity(100, 200);
//     logo.setBounce(1, 1);
//     logo.setCollideWorldBounds(true);

//     emitter.startFollow(logo);
// }