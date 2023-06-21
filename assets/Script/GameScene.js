import TopBar from "./TopBar";
import PlayerHand from "./PlayerHand";
import PlayerActions from "./PlayerActions";
import GameAvatar from "./GameAvatar";
import { loadCardAtlas } from "./AssetLoader";

export let GameScene;

cc.Class({
  extends: cc.Component,

  properties: {
    topBar: TopBar,
    playerAvatar1: GameAvatar,
    playerAvatar2: GameAvatar,
    playerAvatar3: GameAvatar,
    playerAvatar4: GameAvatar,
    playerHand1: PlayerHand,
    playerHand2: PlayerHand,
    playerHand3: PlayerHand,
    playerHand4: PlayerHand,
    playerActions: PlayerActions,

    _playerHands: [],
    _playerAvatars: [],
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
    this._playerAvatars = [
      this.playerAvatar1,
      this.playerAvatar2,
      this.playerAvatar3,
      this.playerAvatar4,
    ];

    for (let i = 0; i < this._playerAvatars.length; i++) {
      this._playerAvatars[i].setName("Player " + (i + 1));
      this._playerAvatars[i].setPoint(0);
    }

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
    this.setActivePlayer(user);
  },

  setActivePlayer(user) {
    this._playerAvatars.forEach((item) => item.stopCountdown());
    this._playerAvatars[user].startCountdown();
  },

  doDiscard(user) {
    this.setActivePlayer(0);
    this.playerActions.showDiscardButton(user);
  },

  getMySelectedCards() {
    const cards = this.playerHand1.getSelectedCards();
    return cards;
  },

  removeSelectedCards(cards) {
    this.playerHand1.removeCards(cards);
  },

  // update (dt) {},
});
