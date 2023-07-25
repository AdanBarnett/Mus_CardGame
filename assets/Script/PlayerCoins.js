const endPositions = [[-12, -38], [13, -38], [-12, -11], [13, -11], [-12, 16], [13, 16]];

export default cc.Class({
    extends: cc.Component,

    properties: {
        coin1Prefab: cc.Prefab,
        coin5Prefab: cc.Prefab,

        _coins: [],
        _type: 0,
    },

    onLoad() { },

    start() {
        this._coins = [];
    },

    addCoin(worldPosition) {
        let targetPosition = endPositions[this.node.childrenCount];
        let coin = cc.instantiate((this._type === 1) ? this.coin1Prefab : this.coin5Prefab);
        let startPosition = this.node.convertToNodeSpaceAR(worldPosition);
        this._coins.push(coin);
        this.node.addChild(coin);
        coin.setPosition(startPosition);

        coin.stopAllActions();
        cc.tween(coin)
            .to(0.5, { x: targetPosition[0], y: targetPosition[1] })
            .start();
    },
    addCoins(coins, worldPosition, type) {
        this.node.removeAllChildren();
        this._coins = [];
        this._type = type;
        for (let i = 0; i < coins; i++) {
            this.addCoin(worldPosition, type);
        }
    },
});