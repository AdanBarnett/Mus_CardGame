import TopBar from "./TopBar";
import PlayerHand from "./PlayerHand";
import PlayerActions from "./PlayerActions";
import CenterPot from "./CenterPot";
import GameAvatar from "./GameAvatar";
import { loadCardAtlas } from "./AssetLoader";
import { MESSAGE_TYPE, ROUNDS } from "./Common/Messages";
import GlobalData from "./Common/GlobalData";
import PlayerCoins from "./PlayerCoins";
import EndContainer from "./EndContainer";
import { FakeServer } from "./Server/FakeServer"

export let GameScene;

const handPositions = [[256, 124], [851, 225], [697, 634], [153, 532]];

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
    playerCoin1: PlayerCoins,
    playerCoin2: PlayerCoins,
    playerCoin3: PlayerCoins,
    playerCoin4: PlayerCoins,
    playerActions: PlayerActions,
    centerPot: CenterPot,
    cardDom: cc.Node,
    endRound: EndContainer,
    hand: cc.Node,
    mission1: cc.Node,
    mission2: cc.Node,
    mission3: cc.Node,
    mission4: cc.Node,
    round1: cc.Prefab,
    round2: cc.Prefab,
    lose: cc.Node,
    win: cc.Node,
    aaa: cc.Node,

    _playerHands: [],
    _playerAvatars: [],
    _playerCoins: [],
    _missions: [],
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    GameScene = this;
    loadCardAtlas().then(() => {
      this.start();
      FakeServer.initHandlers();
      // setTimeout(() => {
      FakeServer.startGame();
      // }, 3000);

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
      this._playerCoins = [
        this.playerCoin1,
        this.playerCoin2,
        this.playerCoin3,
        this.playerCoin4,
      ];
      this._missions = [
        this.mission1,
        this.mission2,
        this.mission3,
        this.mission4,
      ];
      for (let i = 0; i < this._playerAvatars.length; i++) {
        this._playerAvatars[i].setName("Player " + (i + 1));
        this._playerAvatars[i].setPoint(0);
        this._playerAvatars[i].setType((i === 0 || i === 3) ? 0 : 1);
      }
      for (let i = 0; i < this._missions.length; i++) {
        this._missions[i].removeAllChildren();
      }
      this.hand.setPosition(handPositions[0][0], handPositions[0][1]);
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

  doMusClaim(user, round_count, dealer) {
    this.centerPot.setCurrentRound(ROUNDS.MUS_CLAIM);
    // this.playerActions.showMusButtons();
    this.endRound.node.active = false;
    this.playerActions.showMusButtons(user);
    this.setActivePlayer(user);
    this.hand.setPosition(handPositions[dealer][0], handPositions[dealer][1]);
    if (round_count === 1)
      this.hand.setPosition(handPositions[user][0], handPositions[user][1]);
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

  // add betted coins to board
  doAlarm(user, content, coin) {
    console.log("alarm!!!!!!!!!!!!!!!!!!!!!!!!");
    this._playerAvatars[user].showNotify(content);
    if (coin !== null && coin > 0) {
      this.centerPot.addCoins(user, coin);
    }
  },

  // set total coins to winner when instant
  setPoints(users, coins, state) {
    let worldPosition = this.centerPot.removeCoins();
    let type;
    users.forEach((user) => {
      if (user === 0 || user === 3) {
        type = 0;
      } else {
        type = 1;
      }
      let coin = (type === 0) ? Math.floor(coins[user] / 5) : coins[user] % 5;
      this._playerAvatars[user].setPoint(coins[user]);
      this._playerCoins[user].addCoins(coin, worldPosition, type);
    });
  },

  doBig(user, availableActions, state) {
    this.cardDom.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.BIG);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  doSmall(user, availableActions, state) {
    this.centerPot.setCurrentRound(ROUNDS.SMALL);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  evalPairs(user) {
    this.centerPot.setCurrentRound(ROUNDS.EVAL_PAIRS);
    this.setActivePlayer(user);
  },
  doPairs(user, availableActions, state) {
    this.centerPot.setCurrentRound(ROUNDS.PAIRS);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  evalGame(user) {
    this.centerPot.setCurrentRound(ROUNDS.EVAL_GAME);
    this.setActivePlayer(user);
  },
  doGame(user, availableActions, state) {
    this.centerPot.setCurrentRound(ROUNDS.GAME);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  // set total coins to winner when end
  sharePoints(user, coins_history, total_coins, points) {
    this.centerPot.setCurrentRound(ROUNDS.SHAREPOINTS, points);
    // this.setActivePlayer(user);
    let users = [0, 1, 2, 3];
    // let big = this.centerPot._bigCoins.length;
    // let small = this.centerPot._smallCoins.length;
    // let pairs = this.centerPot._pairsCoins.length;
    // let game = this.centerPot._gameCoins.length;
    let worldPosition = this.node.convertToWorldSpaceAR(this.node.getPosition());;
    this.centerPot.removeCoins(ROUNDS.BIG);
    this.centerPot.removeCoins(ROUNDS.SMALL);
    this.centerPot.removeCoins(ROUNDS.PAIRS);
    this.centerPot.removeCoins(ROUNDS.GAME);
    let type;
    users.forEach((user) => {
      if (user === 0 || user === 3) {
        type = 0;
      } else {
        type = 1;
      }
      let coin = (type === 0) ? Math.floor(total_coins[user] / 5) : total_coins[user] % 5;
      this._playerAvatars[user].setPoint(total_coins[user]);
      this._playerCoins[user].addCoins(coin, worldPosition, type);
    });
    this.stopPlayer(1);
    this.stopPlayer(2);
    this.stopPlayer(3);
    this.stopPlayer(0);
  },
  doPoints(user, availableActions, state) {
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.POINTS);
    this.playerActions.showBetButtons(user, availableActions, state);
    this.setActivePlayer(user);
  },
  doEndRound(coins_history, round_coins, total_coins, endMission, mission_score, points, winner) {
    this.hand.setPosition(handPositions[0][0], handPositions[0][1]);
    // this.cardDom.node.removeAllChildren();
    this.centerPot.setCurrentRound(ROUNDS.END, points);
    for (let i = 0; i < this._playerHands.length; i++) {
      this._playerHands[i].start();
    }
    if (endMission) {
      for (let i = 0; i < this._playerCoins.length; i++) {
        this._playerCoins[i].start();
      }
      for (let i = 0; i < this._playerAvatars.length; i++) {
        this._playerAvatars[i].setPoint(0);
      }
      [0, 1, 2, 3].forEach((i) => {
        this._missions[i].removeAllChildren();
        if (mission_score[i % 2] === 1) {
          let r1 = cc.instantiate(this.round1);
          this._missions[i].addChild(r1);
          r1.setPosition(cc.v2(0, 0));
        } else if (mission_score[i % 2] === 2) {
          let r2 = cc.instantiate(this.round2);
          r2.setPosition(cc.v2(0, 0));
          this._missions[i].addChild(r2);
        }
      });
    }
    this.endRound.setValues(coins_history, round_coins, total_coins, endMission, points, winner);
    // this.playerActions.showBetButtons(user, availableActions);
    this.endRound.node.active = true;
    if (mission_score[0] === 2 || mission_score[1] === 2) {
      if (mission_score[0] === 2) {
        setTimeout(() => {
          this.endRound.node.active = false;
          this.win.active = true;
        }, 5000);
      }
      else {
        setTimeout(() => {
          this.endRound.node.active = false;
          this.lose.active = true;
        }, 5000);
      }
    }
    this.stopPlayer(1);
    this.stopPlayer(2);
    this.stopPlayer(3);
    this.stopPlayer(0);
  },
  // update (dt) {},
});
