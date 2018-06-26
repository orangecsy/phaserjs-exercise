import Phaser from 'libs/phaser-wx.js'
import gameOptions from 'gameOptions.js';
import Start from 'scene/start.js'
import Play from 'scene/play.js'
import Restart from 'scene/restart.js'

let game;
wx.getSystemInfo({
  success: function (res) {
    gameOptions.width = res.windowWidth;
    gameOptions.heigth = res.windowHeight;
    game = new Phaser.Game({
      // wxgame修改
      // 渲染类型
      renderer: Phaser.CANVAS,
      canvas: canvas,
      // 界面宽度，单位像素
      width: res.windowWidth,
      // 界面高度
      height: res.windowHeight
    });
  }
});

game.state.add('start', new Start(game));
game.state.add('play', new Play(game));
game.state.add('restart', new Restart(game));
game.state.start('start');