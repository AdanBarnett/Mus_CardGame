import { ClientCommService } from "./Common/CommServices";
import { MESSAGE_TYPE, ROUNDS } from "./Common/Messages";
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
    _discard: false,
    _timer: -1,

    // time: [],
  },

  onLoad() {},

  start() {
    this.showButtonRoot(false);
  },

  showMusButtons(user) {
    this._currentUser = user;
    this.musButtonRoot.active = true;
    this.betButtonRoot.active = false;
    this.discardButtonRoot.active = false;
    this.showButtonRoot(true);
  },

  showBetButtons(user, availableActions, state) {
    this._currentUser = user;
    this._amount = 2;
    this.musButtonRoot.active = false;
    this.betButtonRoot.active = true;
    this.discardButtonRoot.active = false;
    // console.log("a: ", this.betButtonRoot);
    for (let i = 0; i < this.betButtonRoot.childrenCount; i++) {
      this.betButtonRoot.children[i].active = false;
    }
    availableActions.forEach((action) => {
      switch (action) {
        case MESSAGE_TYPE.CS_ACTION_ACCEPT:
          this.betButtonRoot.children[0].active = true;
          break;
        case MESSAGE_TYPE.CS_ACTION_PASS:
          this.betButtonRoot.children[1].active = true;
          break;
        case MESSAGE_TYPE.CS_ACTION_ALLIN:
          this.betButtonRoot.children[2].active = true;
          break;
        case MESSAGE_TYPE.CS_ACTION_ENVIDO:
          this.betButtonRoot.children[3].active = true;
          this.betAmountLabel.string = "ENVIDO 2";
          break;
        case MESSAGE_TYPE.CS_ACTION_BET_MORE:
          this.betButtonRoot.children[3].active = true;
          this.betAmountLabel.string = "2 MORE";
          break;
      }
    });
    this.showButtonRoot(true);
  },

  showDiscardButton(user) {
    // this._timer = 
    this._discard = false;
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
    console.log("onUserMusClick : " + this._currentUser);
    ClientCommService.sendMusClaim(this._currentUser, true);
    this.showButtonRoot(false);
  },

  onUserNoMusClick() {
    console.log("onUserNoMusClick");
    ClientCommService.sendMusClaim(this._currentUser, false);
    this.showButtonRoot(false);
  },

  onUserDiscardClick() {
    clearTimeout(this._timer);
    this._discard = true;
    console.log("onUserDiscardClick : " + this._currentUser);
    var selectedCards = GameScene.getMySelectedCards(this._currentUser);
    // if (selectedCards.length === 0) {
    //   return;
    // }
    ClientCommService.sendDiscardCards(
      this._currentUser,
      selectedCards.map((card) => card.getCardIndex())
    );
    console.log(this._currentUser);
    GameScene.removeSelectedCards(this._currentUser, selectedCards);
    // GameScene._removedCards.push({ user: this._currentUser, removedCards: [...selectedCards] });
    this.showButtonRoot(false);
  },

  onUserAcceptClick() {
    console.log("onUserBetClick");
    ClientCommService.sendAccept(this._currentUser);
    this.showButtonRoot(false);
  },

  onUserPassClick() {
    console.log("onUserPassClick");
    ClientCommService.sendPass(this._currentUser);
    this.showButtonRoot(false);
  },

  onUserAllinClick() {
    console.log("onUserRaiseClick");
    ClientCommService.sendAllIn(this._currentUser);
    this.showButtonRoot(false);
  },

  onUserMinusClick() {
    if (this.betAmountLabel.string.startsWith("ENVIDO")) {
      if (this._amount > 2) {
        this._amount--;
        this.updateBetAmountLabel();
      }
    } else {
      if (this._amount > 1) {
        this._amount--;
        this.updateBetAmountLabel();
      }
    }
  },

  onUserPlusClick() {
    if (this._amount < 10) {
      this._amount++;
      this.updateBetAmountLabel();
    }
  },

  updateBetAmountLabel() {
    if (this.betAmountLabel.string.startsWith("ENVIDO")) {
      this.betAmountLabel.string = "ENVIDO " + this._amount.toString();
    } else {
      this.betAmountLabel.string = this._amount.toString() + " MORE";
    }
  },

  onUserBetClick() {
    console.log("onUserBetOkClick", this._amount);
    if (this.betAmountLabel.string.startsWith("ENVIDO")) {
      ClientCommService.sendEnvido(this._currentUser, this._amount);
    } else {
      ClientCommService.sendBetMore(this._currentUser, this._amount);
    }
    this.showButtonRoot(false);
  },

  // update (dt) {},
});
