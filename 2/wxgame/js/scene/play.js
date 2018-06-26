import Phaser from '../libs/phaser-wx.js';
import gameOptions from '../gameOptions.js';
import Music from '../music.js';

export default class Play extends Phaser.State {
  // 构造器
  constructor() {
    super("Game");
  }

  create() {
    // wxgame修改
    // 载入音乐
    this.music = new Music();
    this.music.playBgm();

    // 物理引擎
    // 上下要对称
    this.world.setBounds(0, -1000000, gameOptions.width, 1000000);
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // 初始化参数
    this.score = gameOptions.scoreInit;
    this.gravity = gameOptions.gravity;
    // 比例系数
    this.screenWidthRatio = gameOptions.width / 375;
    this.screenHeightRatio = gameOptions.height / 812;

    // 生成sprite
    // 星星闪烁
    // const skybox = game.add.sprite(0, 0, 'skybox');
    const skybox = this.add.sprite(0, 0, 'skybox');
    skybox.width = gameOptions.width;
    skybox.height = gameOptions.height;
    const twinkle = skybox.animations.add('twinkle');
    skybox.animations.play('twinkle', 3, true);
    skybox.fixedToCamera = true;
   
    // 生成左右墙体
    this.walls = this.add.group();
		for(let lr of ['left', 'right']) {
      let wall;
			if (lr === 'left') {
        wall = this.add.graphics(- gameOptions.rectWidth + gameOptions.wallWidth, 0);
				wall.type = 'l';
			} else {
        //this.camera.view.width
				wall = this.add.graphics(gameOptions.width - gameOptions.wallWidth, 0);
				wall.type = 'r';
			}
			wall.beginFill(0xEEEEEE);
      wall.drawRect(0, 0, gameOptions.rectWidth, gameOptions.height);
			wall.endFill();
			this.physics.arcade.enable(wall);
			wall.body.immovable = true;
			wall.fixedToCamera = true;
			this.walls.add(wall);
		}

    // 生成地球和小行星
    this.asteroids = this.add.group();
    const earthRadius = gameOptions.earthRadius * this.screenWidthRatio;
    // const earth = this.add.sprite(this.world.width / 2, this.world.height / 3 * 2, 'earth');
    const earth = this.add.sprite(gameOptions.width / 2, -gameOptions.height * 0.22, 'sat2');
    earth.scale.set(this.screenWidthRatio * 0.1);
    earth.anchor.setTo(0.5, 0.5);
    earth.radius = earthRadius;
    earth.width = earthRadius * 2;
    earth.height = earthRadius * 2;

    // 生成火箭
    // const rocket = this.add.sprite(this.world.width / 2, this.world.height / 3 * 2 - earthRadius, 'rocket');
    const rocket = this.add.sprite(gameOptions.width / 2, -gameOptions.height / 3 * 2 - earthRadius, 'rocket');
    rocket.anchor.set(0.5, 0.52);
    // 调节行星生成，避免出界
		rocket.radius = 15;
    rocket.scale.set(0.15 * this.screenWidthRatio);
    this.physics.arcade.enable(rocket);
    // 着陆星球
    rocket.landed = {
      asteroid: earth,
			angle: - Math.PI / 2
    };
    this.rocket = rocket;
    this.camera.follow(this.rocket);
    
    // 生成行星
    this.generateAsteroids();

    // 生成火焰
    const fire = this.add.sprite(0, -gameOptions.height / 10, 'fire');
    fire.width = gameOptions.width;
    fire.height = gameOptions.height / 3 * 2;
    this.physics.arcade.enable(fire);
    fire.body.immovable = true;
    this.fire = fire;

    // 灰尘特效
    const dust = this.add.emitter();
		dust.makeParticles(['particle1', 'particle2']);
		dust.gravity = 200;
		dust.setAlpha(1, 0, 3000, Phaser.Easing.Quintic.Out);
    this.dust = dust;
    
    // 分数，放到后面，越晚加入越在上层
    const scoreText = this.add.text(
      20, 50,
      '分数 ' + this.score, 
      {
        font: this.screenWidthRatio * 30 + 'px Arial', 
        fill: '#ffffff'
      }
    );
    scoreText.anchor.x = 0;
    scoreText.fixedToCamera = true;
    this.scoreText = scoreText;

    // 点击交互
		this.input.onDown.add(this.jump, this);
  }

  jump() {
		if (this.rocket.landed) {
      this.rocket.body.moves = true;
      const speed = gameOptions.speed;
      
      this.rocket.body.velocity.x = speed * Math.cos(
        this.rocket.landed.angle + 
        this.rocket.landed.asteroid.rotation);
      this.rocket.body.velocity.y = speed * Math.sin(
        this.rocket.landed.angle + 
        this.rocket.landed.asteroid.rotation);

      this.rocket.body.gravity.y = this.gravity;
      this.rocket.leftTime = Date.now();
      this.rocket.landed = null;
      // wxgame修改
      this.music.playJump();
    } else if (this.rocket.type) {
      // 触墙
      const speed = gameOptions.speed;
      const gravity = gameOptions.gravity;
      if (this.rocket.type === 'l') {
        this.rocket.body.velocity.x = speed;
        this.rocket.body.velocity.y = -0.2 * speed;
        // this.rocket.body.gravity.y = gravity;
      } else if (this.rocket.type === 'r') {
        this.rocket.body.velocity.x = -speed;
        this.rocket.body.velocity.y = -0.2 * speed;
        // this.rocket.body.gravity.y = gravity;
      }
      this.rocket.leftTime = Date.now();
      this.rocket.type = false;
      // wxgame修改
      this.music.playJump();
    }
	}

  generateAsteroids() {
    // 生成小行星带
    // 生成数据
    const getRatio = (min, max) => {
      return Math.min(this.score / 10000, 1) * (max - min) + min;
    }
    const getValue = () => {
      return {
        distance: this.screenHeightRatio * this.rnd.between(getRatio(50, 150), getRatio(100, 200)),
        angle: this.rnd.realInRange(-Math.PI * 0.15, -Math.PI * 0.85),
        radius: this.screenHeightRatio * this.rnd.between(getRatio(60, 20), getRatio(90, 40)),
        rotationSpeed: this.rnd.sign() * this.rnd.between(getRatio(1, 3), getRatio(3, 6))
      };
    }

    // 生成第一颗小行星
    if(this.asteroids.children.length === 0) {
      const values = getValue();
      this.asteroids.add(this.generateOneAsteroid(
        this.world.width / 2, 
        - gameOptions.height * 0.4 - 2 * values.radius, 
        values.radius, 
        values.rotationSpeed
      ));
    }
    // console.log(this.asteroids.children[0].angle)

    // 生成其他小行星
    const maxDistance = this.camera.view.height;
		while(this.asteroids.children[this.asteroids.children.length - 1].y >= this.rocket.y - maxDistance){
      const previousAsteroid = this.asteroids.children[this.asteroids.children.length - 1];
      let newOne;
      let values;
			do{
        values = getValue();
				newOne = {
					x: previousAsteroid.x + Math.cos(values.angle) * (values.distance + previousAsteroid.radius + values.radius),
					y: previousAsteroid.y + Math.sin(values.angle) * (values.distance + previousAsteroid.radius + values.radius)
        }
      } while(newOne.x - this.rocket.radius * 2 - values.radius < 10
        || newOne.x + this.rocket.radius * 2 + values.radius > this.world.width);
			this.asteroids.add(this.generateOneAsteroid(newOne.x, newOne.y, values.radius, values.rotationSpeed));
    }
  }

  generateOneAsteroid(x, y, radius, rotationSpeed) {
    const rnd = Math.random();
    let oneAsteroid;
    // oneAsteroid = this.add.sprite(x, y, 'moon');
    if (rnd < 1 / 4) {
      oneAsteroid = this.add.sprite(this.screenWidthRatio * x, y, 'sat1');
    } else if (rnd < 1 / 2) {
      oneAsteroid = this.add.sprite(this.screenWidthRatio * x, y, 'sat2');
    } else {
      oneAsteroid = this.add.sprite(this.screenWidthRatio * x, y, 'sat3');
    }
    oneAsteroid.anchor.setTo(0.5, 0.5);
    oneAsteroid.radius = radius;
		oneAsteroid.width = radius * 2;
		oneAsteroid.height = radius * 2;
    this.physics.arcade.enable(oneAsteroid);
    oneAsteroid.body.immovable = true;
		oneAsteroid.body.setCircle(
			radius, 
			-radius + 0.5 * oneAsteroid.width / oneAsteroid.scale.x, 
			-radius + 0.5 * oneAsteroid.height / oneAsteroid.scale.y
			);
		oneAsteroid.rotationSpeed = rotationSpeed;
		return oneAsteroid;
  }
  
  update() {
    // 记录火箭旋转
    this.rocket.rotation = this.rocket.body.angle + Math.PI/2;

    // 小行星旋转
    for (let i = 0; i < this.asteroids.children.length; i++) {
      this.asteroids.children[i].angle += this.asteroids.children[i].rotationSpeed;
    }

    // 火焰
    const fireSpeed = Math.min(this.score / 8000, 1);
    this.fire.body.velocity.set(0, -fireSpeed * 300);

    // 被火焰吞没
    this.physics.arcade.overlap(this.rocket, this.fire, (rocket, fire) => {
			this.gameover();
		});
    
    // 火箭随行星转动
		if (this.rocket.landed) {
			this.rocket.body.moves = false;
			const asteroid = this.rocket.landed.asteroid; 
			this.rocket.body.gravity.y = 0;
      this.rocket.x = asteroid.x + 
        (asteroid.width * 0.5 + this.rocket.radius) * 
        Math.cos(this.rocket.landed.angle + asteroid.rotation);
      this.rocket.y = asteroid.y + 
        (asteroid.width * 0.5 + this.rocket.radius) * 
        Math.sin(this.rocket.landed.angle + asteroid.rotation);
      this.rocket.rotation = this.rocket.landed.angle + asteroid.rotation + Math.PI / 2;
      // 防止相机随着行星转动上下抖动
			this.camera.follow(asteroid, null, 1, 0.2);
		}else{
			this.camera.follow(this.rocket, null, 1, 0.2);
		}

    // 火箭起飞
		if (!this.rocket.landed) {
			this.physics.arcade.overlap(this.rocket, this.asteroids, (rocket, asteroid) => {
        // 防止粘到刚跳出来的行星
        if (!rocket.leftTime || Date.now() - rocket.leftTime > 200) {
          this.rocket.landed = {
            asteroid: asteroid,
            angle: this.physics.arcade.angleBetween(asteroid, rocket) - asteroid.rotation
          };
          // 降落灰尘特效
          // const asteroid = this.hero.grab.wheel; 
					const dust = this.dust;
          dust.x = asteroid.x + 
            (asteroid.width * 0.5 + this.rocket.radius) * 
            Math.cos(this.rocket.landed.angle + asteroid.rotation);
          dust.y = asteroid.y + 
            (asteroid.width * 0.5 + this.rocket.radius) * 
            Math.sin(this.rocket.landed.angle + asteroid.rotation);
          dust.start(true, 2000, 0, 20, true);
          this.score = Math.floor(-rocket.y + gameOptions.scoreInit);
          this.scoreText.setText('分数 ' + this.score);
        }
      });
      
      // 火箭触墙
      this.physics.arcade.overlap(this.rocket, this.walls, (rocket, wall) => {
        if (!rocket.leftTime || Date.now() - rocket.leftTime > 200) {
          // 缓慢下滑
          this.rocket.body.gravity.y = gameOptions.gravity;
          // 左墙
          if (wall.type === 'l') {
            this.rocket.x = wall.x + wall.width + this.rocket.radius - 3;
            this.rocket.rotation = Math.PI / 2;
          } else if (wall.type === 'r'){
            this.rocket.x = wall.x - this.rocket.radius + 3;
            this.rocket.rotation = - Math.PI / 2;
          }
          this.rocket.body.velocity.x = 0;
          this.rocket.type = wall.type;
        }
      });
    }

    // 生成新行星
    this.generateAsteroids();
  }

  gameover() {
    // wxgame修改
    gameOptions.score = this.score;
    const bestScore = localStorage.getItem('bestScore');
    if (!bestScore || bestScore < this.score) {
      localStorage.setItem('bestScore', this.score);
    }
    this.state.start('restart');
  }
}