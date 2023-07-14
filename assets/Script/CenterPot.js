import { ROUNDS } from "./Common/Messages";

const SELECTED_COLOR = new cc.Color(2, 62, 68);
const NORMAL_COLOR = new cc.Color(97, 201, 236);
const MUS_COLOR = new cc.Color(169, 200, 191);

export default cc.Class({
  extends: cc.Component,

  properties: {
    bgImage: cc.Sprite,
    musText: cc.Label,
    bigText: cc.Label,
    smallText: cc.Label,
    pairsText: cc.Label,
    gameText: cc.Label,

    _currentRound: -1,
    _normalTexts: [],
  },

  // onLoad () {},

  start() {
    this._normalTexts = [
      this.bigText,
      this.smallText,
      this.pairsText,
      this.gameText,
    ];
  },

  setCurrentRound(round) {
    this._currentRound = round;

    this._normalTexts.forEach((text) => {
      text.node.color = NORMAL_COLOR;
    });
    this.musText.node.color = round === ROUNDS.MUS ? SELECTED_COLOR : MUS_COLOR;

    if (round === ROUNDS.MUS) {
    } else if (round === ROUNDS.BIG) {
      this.bigText.node.color = SELECTED_COLOR;
    } else if (round === ROUNDS.SMALL) {
      this.smallText.node.color = SELECTED_COLOR;
    } else if (round === ROUNDS.PAIRS) {
      this.pairsText.node.color = SELECTED_COLOR;
    } else if (round === ROUNDS.GAME) {
      this.gameText.node.color = SELECTED_COLOR;
    }
  },

  // update (dt) {},
});
