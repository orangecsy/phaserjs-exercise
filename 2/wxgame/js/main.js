import Phaser from 'libs/phaser-wx.js'
import Start from 'scene/start.js'
import Play from 'scene/play.js'
import Restart from 'scene/restart.js'

const game = new Phaser.Game({
  // wxgame修改
  // 渲染类型
  renderer: Phaser.CANVAS,
  canvas: canvas,
  // 界面宽度，单位像素
  width: 750,
  // 界面高度
  height: 1334
});

game.state.add('start', new Start(game));
game.state.add('play', new Play(game));
game.state.add('restart', new Restart(game));
game.state.start('start');