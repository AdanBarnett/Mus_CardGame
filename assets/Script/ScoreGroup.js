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
        if (score === 0) {
            this.score.string = '';
        }
        else {
            this.score.string = score;
        }
        this.type.string = type;
    }
});