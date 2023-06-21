import TopBar from "./TopBar";
import PlayerHand from "./PlayerHand";
import PlayerActions from "./PlayerActions";
import { loadCardAtlas } from "./AssetLoader";

export let GameScene;

cc.Class({
  extends: cc.Component,

  properties: {
    topBar: TopBar,
    playerHand1: PlayerHand,
    playerHand2: PlayerHand,
    playerHand3: PlayerHand,
    playerHand4: PlayerHand,
    playerActions: PlayerActions,

    _playerHands: [],
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    GameScene = this;
    loadCardAtlas();
  },

  start() {
    console.log("topbar", this.topBar);
    this.topBar.setUserBalance(100);

    this._playerHands = [
      this.playerHand1,
      this.playerHand2,
      this.playerHand3,
      this.playerHand4,
    ];

    return;
    setTimeout(() => {
      this.playerHand1.setCards([1, 2, 3, 4]);
      this.playerHand2.setCards([1, 2, 3, 4]);
      this.playerHand3.setCards([1, 2, 3, 4]);
      this.playerHand4.setCards([1, 2, 3, 4]);
      this.playerHand2.setMine(false);
      this.playerHand3.setMine(false);
      this.playerHand4.setMine(false);
      setTimeout(() => {
        this.playerActions.showMusButtons();
      }, 1000);
      setTimeout(() => {
        this.playerActions.showBetButtons();
      }, 2000);
      // setTimeout(() => {
      //   const selectedCards = this.playerHand.getSelectedCards();
      //   console.log("selected cards", selectedCards);
      //   this.playerHand.removeCards(selectedCards);
      //   this.playerHand.setInteractable(false);
      //   setTimeout(() => {
      //     this.playerHand.addCards([1, 2, 3, 4]);
      //   }, 1000);
      // }, 1000);
    }, 1000);
  },

  setPlayerCards(user, cards) {
    this._playerHands[user].setCards(cards);
  },
  addPlayerCards(user, cards) {
    this._playerHands[user].addCards(cards);
  },

  doMusClaim(user) {
    this.playerActions.showMusButtons(user);
  },

  // update (dt) {},
});
