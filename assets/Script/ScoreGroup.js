export default cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
        type: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },
    start() { },
    setValues(score, type) {
        this.score.string = score;
        this.type.string = type;
    }
});