import { TIME_LIMIT } from "./Common/Constants";
import { loadAvatar } from "./SpriteHelper";

cc.Class({
  extends: cc.Component,

  properties: {
    avatarSprite: cc.Sprite,
    pointLabel: cc.Label,
    nameLabel: cc.Label,

    bgNode1Active: cc.Node,
    bgNode1Inactive: cc.Node,
    bgNode2Active: cc.Node,
    bgNode2Inactive: cc.Node,

    progressRoot: cc.Node,
    progressSprite: cc.Sprite,
    timerLabel: cc.Label,

    notifyRoot: cc.Node,
    notifyLabel: cc.Label,

    _type: [],
    _timeLimit: [],
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.notifyRoot.active = false;
    this._timeLimit = TIME_LIMIT;
    this.showProgressBar(false);
  },

  start() {},

  showNotify(str) {
    var self = this;
    this.notifyLabel.string = str;
    this.notifyRoot.active = true;
    setTimeout(() => {
      self.notifyRoot.active = false;
    }, 1000);
  },

  setName(str) {
    this.name = str;
    this.nameLabel.string = str.substring(0, 15);
  },

  setType(type) {
    this._type = type;
    if (type == 1) {
      this.notifyRoot.setScale(-1, 1);
      this.notifyLabel.node.setScale(-1, 1);
    } else {
      this.notifyRoot.setScale(1, 1);
      this.notifyLabel.node.setScale(1, 1);
    }

    return;
  },

  setAvatar(path) {
    if (this.path) {
      console.log("Avatar already set", this.path);
      return;
    }

    console.log("Setting avatar", path);
    this.path = path;
    loadAvatar(this.avatarSprite, path);
  },

  setPoint(point) {
    console.log("Setting points", point);
    this.pointLabel.string = point;
  },

  setProgress(num, timeLimit) {
    this.progressSprite.fillRange = num;
    if (timeLimit) {
      this._timeLimit = timeLimit;
    }
    this.showProgressBar(true);
  },

  showProgressBar(visible) {
    this.progressRoot.active = visible;
    if (visible) {
      this.bgNode1Active.active = true;
      this.bgNode1Inactive.active = false;
      this.bgNode2Active.active = true;
      this.bgNode2Inactive.active = false;
      this.nameLabel.node.color = cc.color(234, 220, 202);
      this.pointLabel.node.color = cc.color(234, 220, 202);
    } else {
      this.bgNode1Active.active = false;
      this.bgNode1Inactive.active = true;
      this.bgNode2Active.active = false;
      this.bgNode2Inactive.active = true;
      this.nameLabel.node.color = cc.color(99, 40, 10);
      this.pointLabel.node.color = cc.color(99, 40, 10);
    }
  },

  update(dt) {
    var progress = this.progressSprite.fillRange;
    if (progress > 0) {
      progress -= dt / this._timeLimit;
      if (progress < 0) progress = 0;
      this.progressSprite.fillRange = progress;

      var sec = Math.ceil(progress * this._timeLimit);
      this.timerLabel.string = Math.floor(sec / 60) + ":" + (sec % 60);
    }
  },
});
