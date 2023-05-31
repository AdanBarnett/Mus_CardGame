export default cc.Class({
  extends: cc.Component,

  properties: {
    buttonRoot: cc.Node,
    musButtonRoot: cc.Node,
    betButtonRoot: cc.Node,
  },

  // onLoad () {},

  start() {
    this.showButtonRoot(false);
  },

  showMusButtons() {
    this.musButtonRoot.active = true;
    this.betButtonRoot.active = false;
    this.showButtonRoot(true);
  },

  showBetButtons() {
    this.musButtonRoot.active = false;
    this.betButtonRoot.active = true;
    this.showButtonRoot(true);
  },

  showButtonRoot(show) {
    this.buttonRoot.active = show;
  },

  onUserMusClick() {
    console.log("onUserMusClick");
  },

  onUserNoMusClick() {
    console.log("onUserNoMusClick");
  },

  onUserBetClick() {
    console.log("onUserBetClick");
  },

  onUserPassClick() {
    console.log("onUserPassClick");
  },

  onUserRaiseClick() {
    console.log("onUserRaiseClick");
  },

  // update (dt) {},
});
