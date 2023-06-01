export default cc.Class({
  extends: cc.Component,

  properties: {
    buttonRoot: cc.Node,
    musButtonRoot: cc.Node,
    betButtonRoot: cc.Node,
    betPopupRoot: cc.Node,
    betAmountLabel: cc.Label,

    _amount: 2,
  },

  // onLoad () {},

  start() {
    this.showButtonRoot(false);
    this.showBetPopup(false);
    this.updateBetAmountLabel();
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
    this.showBetPopup(true);
  },

  // Bet Popup Section
  showBetPopup(show) {
    this.betPopupRoot.active = show;
  },

  updateBetAmountLabel() {
    this.betAmountLabel.string = this._amount;
  },

  onUserMinusClick() {
    if (this._amount > 2) {
      this._amount--;
      this.updateBetAmountLabel();
    }
  },

  onUserPlusClick() {
    if (this._amount < 10) {
      this._amount++;
      this.updateBetAmountLabel();
    }
  },

  onUserBetOkClick() {
    console.log("onUserBetOkClick", this._amount);
    this.showBetPopup(false);
  },

  onUserOrdagoClick() {
    console.log("onUserOrdagoClick");
    this.showBetPopup(false);
  },

  onUserBackAlphaClick() {
    this.showBetPopup(false);
  },

  // update (dt) {},
});
