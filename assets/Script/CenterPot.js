import { ROUNDS } from "./Common/Messages";
import { loadCenterPotBackground } from './Common/SpriteHelper';

const SELECTED_COLOR = new cc.Color(2, 62, 68);
const NORMAL_COLOR = new cc.Color(97, 201, 236);
const MUS_COLOR = new cc.Color(169, 200, 191);

const userPositions = [[300, 150], [800, 250], [650, 550], [150, 400]];

export default cc.Class({
  extends: cc.Component,

  properties: {
    bgImage: cc.Sprite,
    musText: cc.Label,
    bigText: cc.Label,
    smallText: cc.Label,
    pairsText: cc.Label,
    gameText: cc.Label,
    betDom: cc.Node,
    bigDom: cc.Node,
    smallDom: cc.Node,
    pairsDom: cc.Node,
    gameDom: cc.Node,
    coin1Prefab: cc.Prefab,
    coin5Prefab: cc.Prefab,

    _currentRound: -1,
    _normalTexts: [],
    _bigCoins: [],
    _smallCoins: [],
    _pairsCoins: [],
    _gameCoins: [],
    _bigPosition: null,
    _smallPosition: null,
    _pairsPosition: null,
    _gamePosition: null,
  },

  onLoad() { },

  start() {
    this._normalTexts = [
      this.bigText,
      this.smallText,
      this.pairsText,
      this.gameText,
    ];
    this._bigPosition = this.bigDom.convertToWorldSpaceAR(this.bigDom.getPosition());
    this._smallPosition = this.smallDom.convertToWorldSpaceAR(this.smallDom.getPosition());
    this._pairsPosition = this.pairsDom.convertToWorldSpaceAR(this.pairsDom.getPosition());
    this._gamePosition = this.gameDom.convertToWorldSpaceAR(this.gameDom.getPosition());
  },

  setCurrentRound(round, points) {
    this._currentRound = round;

    this._normalTexts.forEach((text) => {
      text.node.color = NORMAL_COLOR;
    });
    this.musText.node.color = round === ROUNDS.MUS_CLAIM ? SELECTED_COLOR : MUS_COLOR;

    if (round === ROUNDS.MUS_CLAIM) {
      this.musText.string = "MUS?"
      loadCenterPotBackground(this.bgImage, "0-mus");
    } else if (round === ROUNDS.BIG) {
      this.musText.string = "MUS"
      loadCenterPotBackground(this.bgImage, "1-big");
      this.bigText.node.color = SELECTED_COLOR;
    } else if (round === ROUNDS.SMALL) {
      loadCenterPotBackground(this.bgImage, "2-small");
      this.smallText.node.color = SELECTED_COLOR;
    } else if (round === ROUNDS.EVAL_PAIRS) {
      loadCenterPotBackground(this.bgImage, "3-pairs");
      this.pairsText.node.color = SELECTED_COLOR;
      this.pairsText.string = "Pares?";
    } else if (round === ROUNDS.PAIRS) {
      loadCenterPotBackground(this.bgImage, "3-pairs");
      this.pairsText.node.color = SELECTED_COLOR;
      this.pairsText.string = "Pares";
    } else if (round === ROUNDS.EVAL_GAME) {
      this.pairsText.string = "Pares";
      loadCenterPotBackground(this.bgImage, "4-game");
      this.gameText.node.color = SELECTED_COLOR;
      this.gameText.string = "Juegdo?";
    } else if (round === ROUNDS.GAME) {
      loadCenterPotBackground(this.bgImage, "4-game");
      this.gameText.node.color = SELECTED_COLOR;
      this.gameText.string = "Juegdo";
    } else if (round === ROUNDS.POINTS) {
      loadCenterPotBackground(this.bgImage, "4-game");
      this.gameText.node.color = SELECTED_COLOR;
      this.gameText.string = "Punto";
    } else if (round === ROUNDS.SHAREPOINTS) {
      loadCenterPotBackground(this.bgImage, "empty");
      this.gameText.node.color = NORMAL_COLOR;
      this.gameText.string = (points) ? "Punto" : "Juegdo";
    } else if (round === ROUNDS.END) {
      loadCenterPotBackground(this.bgImage, "empty");
      this.gameText.node.color = NORMAL_COLOR;
      this.gameText.string = (points) ? "Punto" : "Juegdo";
      this.gameText.string = "Juegdo";
    }
  },

  addCoins(user, coin, state) {
    for (let i = 0; i < coin; i++) {
      this.addCoin(user);
    }
  },

  addCoin(user) {
    console.log("add coin");
    let worldPosition = userPositions[user];
    let startPosition;
    let coin = cc.instantiate(this.coin1Prefab);
    if (this._currentRound === ROUNDS.BIG) {
      this.bigDom.addChild(coin);
      startPosition = this.bigDom.convertToNodeSpaceAR(cc.v2(worldPosition[0], worldPosition[1]));
      this._bigCoins.push(coin);
    }
    else if (this._currentRound === ROUNDS.SMALL) {
      this.smallDom.addChild(coin);
      startPosition = this.smallDom.convertToNodeSpaceAR(cc.v2(worldPosition[0], worldPosition[1]));
      this._smallCoins.push(coin);
    }
    else if (this._currentRound === ROUNDS.PAIRS) {
      this.pairsDom.addChild(coin);
      startPosition = this.pairsDom.convertToNodeSpaceAR(cc.v2(worldPosition[0], worldPosition[1]));
      this._pairsCoins.push(coin);
    }
    else if (this._currentRound === ROUNDS.GAME || this._currentRound === ROUNDS.POINTS) {
      this.gameDom.addChild(coin);
      startPosition = this.gameDom.convertToNodeSpaceAR(cc.v2(worldPosition[0], worldPosition[1]));
      this._gameCoins.push(coin);
    }
    coin.setPosition(startPosition);
    let targetPosition = cc.v2(Math.floor(Math.random() * 10) * 4 - 20, Math.floor(Math.random() * 10) * 4 - 20);
    coin.stopAllActions();
    cc.tween(coin)
      .to(0.5, { x: targetPosition.x, y: targetPosition.y })
      .start();
    // console.log("Card removed successfully", this._cardComponents);
  },

  shareCoin(user) {
    const index = this._cardComponents.indexOf(card);
    if (index < 0) {
      return;
    }
    this._cardComponents.splice(index, 1);
    let card_copy = cc.instantiate(this.cardPrefab);
    let worldPosition = card.node.convertToWorldSpaceAR(card.getPosition());
    card.node.destroy();
    this.cardDom.addChild(card_copy);
    const cardComponent = card_copy.getComponent("Card");
    let startPosition = this.cardDom.convertToNodeSpaceAR(worldPosition);
    card_copy.setPosition(startPosition);
    let targetPosition = cc.v2(Math.floor(Math.random() * 80) - 40, Math.floor(Math.random() * 80) - 40);
    cardComponent.flipCard();
    cardComponent.moveToPos(0.5, targetPosition.x, targetPosition.y)
    console.log("Card removed successfully", this._cardComponents);
  },

  removeCoins(state) {
    let s = state ? state : this._currentRound;
    let worldPosition;
    if (s === ROUNDS.BIG) {
      this.bigDom.removeAllChildren();
      this._bigCoins = [];
      worldPosition = this.bigDom.convertToWorldSpaceAR(this.bigDom.getPosition());
    }
    else if (s === ROUNDS.SMALL) {
      this.smallDom.removeAllChildren();
      this._smallCoins = [];
      worldPosition = this.smallDom.convertToWorldSpaceAR(this.smallDom.getPosition());
    }
    else if (s === ROUNDS.PAIRS) {
      this.pairsDom.removeAllChildren();
      this._pairsCoins = [];
      worldPosition = this.pairsDom.convertToWorldSpaceAR(this.pairsDom.getPosition());
    }
    else if (s === ROUNDS.GAME || s === ROUNDS.POINTS) {
      this.gameDom.removeAllChildren();
      this._gameCoins = [];
      worldPosition = this.gameDom.convertToWorldSpaceAR(this.gameDom.getPosition());
    }
    return worldPosition;
  },

  // update (dt) {},
});
