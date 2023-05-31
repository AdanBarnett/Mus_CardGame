import GlobalData from "./Common/GlobalData";

cc.Class({
  extends: cc.Component,

  properties: {
    cogBtn: cc.Sprite,
    manualBtn: cc.Sprite,
    soundBtn: cc.Sprite,
    soundOffBtn: cc.Sprite,
    shopBtn: cc.Sprite,
    backBtn: cc.Sprite,
    tfBtn: cc.Sprite,

    _isOpen: [],
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    var self = this;
    this.openToolbar(false);
    this.setSound(GlobalData.isSoundOn);

    this.cogBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      console.log("cog button clicked");
      self.openToolbar(!self._isOpen);
    });
    this.manualBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      cc.sys.openURL("https://en.wikipedia.org/wiki/Mus_(card_game)");
    });
    this.soundBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      self.setSound(false);
    });
    this.soundOffBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      self.setSound(true);
    });
    this.shopBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      cc.sys.openURL("https://www.torofun.com/coins");
    });
    this.backBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      GlobalData.currentScene?.onBackButtonClicked();
    });
    this.tfBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      cc.sys.openURL("https://www.torofun.com");
    });
  },

  setSound(turnOn) {
    if (!this._isOpen) return;
    if (turnOn) {
      this.soundBtn.node.active = true;
      this.soundOffBtn.node.active = false;
      GlobalData.isSoundOn = true;
    } else {
      this.soundBtn.node.active = false;
      this.soundOffBtn.node.active = true;
      GlobalData.isSoundOn = false;
    }
  },

  openToolbar(open) {
    if (!open) {
      this._isOpen = false;
      this.manualBtn.node.active = false;
      this.shopBtn.node.active = false;
      this.backBtn.node.active = false;
      this.tfBtn.node.active = false;

      this.soundBtn.node.active = false;
      this.soundOffBtn.node.active = false;
    } else {
      this._isOpen = true;
      this.manualBtn.node.active = true;
      this.shopBtn.node.active = true;
      this.backBtn.node.active = true;
      this.tfBtn.node.active = true;

      if (GlobalData.isSoundOn) {
        this.soundBtn.node.active = true;
      } else {
        this.soundOffBtn.node.active = true;
      }
    }
  },

  start() {},

  // update (dt) {},
});
