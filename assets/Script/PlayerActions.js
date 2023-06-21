import { ClientCommService } from "./Common/CommServices";
import { GameScene } from "./GameScene";

export default cc.Class({
  extends: cc.Component,

  properties: {
    buttonRoot: cc.Node,
    musButtonRoot: cc.Node,
    betButtonRoot: cc.Node,
    discardButtonRoot: cc.Node,
    betAmountLabel: cc.Label,

    _amount: 2,
    _currentUser: -1,
  },

  // onLoad () {},

  start() {
    // this.showButtonRoot(false);
  },

  showMusButtons(user) {
    this._currentUser = user;
    this.musButtonRoot.active = true;
    this.betButtonRoot.active = false;
    this.discardButtonRoot.active = false;
    this.showButtonRoot(true);
  },

  showBetButtons(user) {
    this._currentUser = user;
    this.musButtonRoot.active = false;
    this.betButtonRoot.active = true;
    this.discardButtonRoot.active = false;
    this.showButtonRoot(true);
  },

  showDiscardButton(user) {
    this._currentUser = user;
    this.musButtonRoot.active = false;
    this.betButtonRoot.active = false;
    this.discardButtonRoot.active = true;
    this.showButtonRoot(true);
  },

  showButtonRoot(show) {
    this.buttonRoot.active = show;
  },

  onUserMusClick() {
    console.log("onUserMusClick");
    ClientCommService.sendMusClaim(this._currentUser, true);
    this.showButtonRoot(false);
  },

  onUserNoMusClick() {
    console.log("onUserNoMusClick");
    ClientCommService.sendMusClaim(this._currentUser, false);
    this.showButtonRoot(false);
  },

  onUserDiscardClick() {
    console.log("onUserDiscardClick");
    var selectedCards = GameScene.getMySelectedCards();
    if (selectedCards.length === 0) {
      return;
    }
    ClientCommService.sendDiscardCards(
      this._currentUser,
      selectedCards.map((card) => card.getCardIndex())
    );
    GameScene.removeSelectedCards(selectedCards);
    this.showButtonRoot(false);
  },

  onUserAcceptClick() {
    console.log("onUserBetClick");
  },

  onUserPassClick() {
    console.log("onUserPassClick");
  },

  onUserAllinClick() {
    console.log("onUserRaiseClick");
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

  updateBetAmountLabel() {
    this.betAmountLabel.string = this._amount.toString();
  },

  onUserBetClick() {
    console.log("onUserBetOkClick", this._amount);
  },

  // update (dt) {},
});
