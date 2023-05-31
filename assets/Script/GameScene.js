import TopBar from "./TopBar";
import PlayerHand from "./PlayerHand";
import PlayerActions from "./PlayerActions";
import { loadCardAtlas } from "./AssetLoader";

cc.Class({
  extends: cc.Component,

  properties: {
    topBar: TopBar,
    playerHand1: PlayerHand,
    playerHand2: PlayerHand,
    playerHand3: PlayerHand,
    playerHand4: PlayerHand,
    playerActions: PlayerActions,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    loadCardAtlas();
  },

  start() {
    console.log("topbar", this.topBar);
    this.topBar.setUserBalance(100);

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

  // update (dt) {},
});
