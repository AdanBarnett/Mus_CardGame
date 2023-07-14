import { ROUNDS } from "./Common/Messages";

const SELECTED_COLOR = cc.Color.fromHex("#023e44");
const NORMAL_COLOR = cc.Color.fromHex("#61c9ec");
const MUS_COLOR = cc.Color.fromHex("#a9c8bf");

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
