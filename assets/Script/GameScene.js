import TopBar from "./TopBar";

cc.Class({
  extends: cc.Component,

  properties: {
    topBar: TopBar,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
    console.log("topbar", this.topBar);
    this.topBar.setUserBalance(100);
  },

  // update (dt) {},
});
