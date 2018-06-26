
export default class Music {
  constructor() {
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.bgmAudio.src = 'audio/music.mp3';

    this.jumpAudio = new Audio();
    this.jumpAudio.src = 'audio/jump.mp3';
  }

  playBgm() {
    this.bgmAudio.play();
  }

  playJump() {
    this.jumpAudio.play();
  }
}