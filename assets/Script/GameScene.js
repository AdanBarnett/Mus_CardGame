import TopBar from "./TopBar";
import PlayerHand from "./PlayerHand";
import PlayerActions from "./PlayerActions";
import CenterPot from "./CenterPot";
import GameAvatar from "./GameAvatar";
import { loadCardAtlas } from "./AssetLoader";
import { MESSAGE_TYPE, ROUNDS } from "./Common/Messages";
import GlobalData from "./Common/GlobalData";
// import PlayerCoins from "./PlayerCoins";

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
    // playerCoin1: PlayerCoins,
    // playerCoin2: PlayerCoins,
    // playerCoin3: PlayerCoins,
    // playerCoin4: PlayerCoins,
    playerActions: PlayerActions,
    centerPot: CenterPot,
    cardDom: cc.Node,
    endRound: cc.Node,

    _playerHands: [],
    _playerAvatars: [],
    _playerCoins: [],
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    GameScene = this;
    loadCardAtlas().then(() => {
      this.start();
    }).catch((error) => {
      console.log("Error loading card atlas:", error);
    });
  },

  start() {
    if (GlobalData.cardAtlas) {
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
      // this._playerCoins = [
      //   this.playerCoin1,
      //   this.playerCoin2,
      //   this.playerCoin3,
      //   this.playerCoin4,
      // ];
      for (let i = 0; i < this._playerAvatars.length; i++) {
        this._playerAvatars[i].setName("Player " + (i + 1));
        this._playerAvatars[i].setPoint(0);
        this._playerAvatars[i].setType((i === 0 || i === 3) ? 0 : 1);
      }
    } else {
      console.log("Card atlas not loaded yet");
    }
  },

  setPlayerCards(user, cards) {
    this._playerHands[user].setCards(cards);
  },
  addPlayerCards(user, cards) {
    this._playerHands[user].addCards(cards);
  },

  doMusClaim(user) {
    this.centerPot.setCurrentRound(ROUNDS.MUS_CLAIM);
    // this.playerActions.showMusButtons();
    this.playerActions.showMusButtons(user);
    this.setActivePlayer(user);
  },

  doMusAlarm(user, mus) {
    console.log("alarm!!!!!!!!!!!!!!!!!!!!!!!!");
    this._playerAvatars[user].showNotify(mus ? "Mus" : "There is no mus.");
  },

  setActivePlayer(user) {
    this._playerAvatars.forEach((item) => item.stopCountdown());
    this._playerHands.forEach((item, i) => {
      if (i !== user) {
        // item.on(cc.Node.EventType.TOUCH_END, (event) => {
        //   event.stopPropagation(); // Prevent event propagation to parent nodes
        //   event.preventDefault(); // Prevent the default behavior of the click event
        // }, item);
        // item._touchListener.setSwallowTouches(false);
        // item._touchListener.setDispatchTouch(false);
      }
    });
    this._playerAvatars[user].startCountdown();
  },

  stopPlayer(user) {
    this._playerAvatars[user].stopCountdown();
  },

  doDiscard(user) {
    this.setActivePlayer(user);
    this.playerActions.showDiscardButton(user);
  },

  doDiscardAlarm(user, cards) {
    this._playerAvatars[user].showNotify(cards.length + " cards");
  },

  getMySelectedCards(user) {
    const cards = this._playerHands[user].getSelectedCards();
    console.log(cards)
    return cards;
  },

  removeSelectedCards(user, cards) {
    this._playerHands[user].removeCards(cards);
  },

  doAlarm(user, content, coin) {
    console.log("alarm!!!!!!!!!!!!!!!!!!!!!!!!");
    this._playerAvatars[user].showNotify(content);
    if (coin !== null && coin > 0) {
      this.centerPot.addCoins(user, coin);
    }
  },

  setPoints(users, coins) {
    this.centerPot.removeCoins();
    for (let i = 0; i < users.length; i++) {
      // this.centerPot.shareCoins(users, coins);
      this._playerAvatars[users[i]].setPoint(coins[users[i]]);
    }
  },

  doBig(user, availableActions, state) {
    this.cardDom.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.BIG);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  doSmall(user, availableActions, state) {
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.SMALL);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  evalPairs(user) {
    this.centerPot.setCurrentRound(ROUNDS.EVAL_PAIRS);
    this.setActivePlayer(user);
  },
  doPairs(user, availableActions, state) {
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.PAIRS);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  evalGame(user) {
    this.centerPot.setCurrentRound(ROUNDS.EVAL_GAME);
    this.setActivePlayer(user);
  },
  doGame(user, availableActions, state) {
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.GAME);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  doPoints(user, availableActions, state) {
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.POINTS);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  doEndRound(user, availableActions, state) {
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.END);
    // this.playerActions.showBetButtons(user, availableActions);
    this.endRound.active = true;
    this.stopPlayer(3);
  },
  // update (dt) {},
});
