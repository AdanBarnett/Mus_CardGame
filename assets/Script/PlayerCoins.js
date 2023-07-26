const endPositions = [[-13, -42], [13, -42], [-13, -14], [13, -14], [-13, 14], [13, 14]];

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
        this.node.removeAllChildren();
        this.removeCoins();
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
            if (i > 5)
                return;
            this.addCoin(worldPosition, type);
        }
    },
    removeCoins() {
        this._coins.forEach((coin) => {
            coin.node.destroy();
        });
        this._coins = [];
    }
});