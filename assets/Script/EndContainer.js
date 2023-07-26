export default cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        team1_big: cc.Label,
        team2_big: cc.Label,
        team1_small: cc.Label,
        team2_small: cc.Label,
        team1_pairs: cc.Node,
        team2_pairs: cc.Node,
        team1_game: cc.Node,
        team2_game: cc.Node,
        team1_round: cc.Label,
        team2_round: cc.Label,
        team1_add: cc.Label,
        team2_add: cc.Label,
        team1_total: cc.Label,
        team2_total: cc.Label,
        score_group: cc.Prefab,

        _t1p: [],
        _t2p: [],
        _t1g: [],
        _t2g: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() { },

    setValues(coins_history, round_coins, total_coins, endMission) {
        // debugger;
        console.log("end round", coins_history, round_coins, total_coins);
        this.team1_pairs.removeAllChildren();
        this.team2_pairs.removeAllChildren();
        this.team1_game.removeAllChildren();
        this.team2_game.removeAllChildren();

        // title
        this.title.string = (endMission) ? "End of the game" : "End of the round";

        // big
        let t1b = coins_history[0][0].instant + coins_history[0][0].end;
        let t2b = coins_history[0][1].instant + coins_history[0][1].end;
        this.team1_big.string = (t1b > 0) ? t1b : "";
        this.team2_big.string = (t2b > 0) ? t2b : "";

        // small
        let t1s = coins_history[1][0].instant + coins_history[1][0].end;
        let t2s = coins_history[1][1].instant + coins_history[1][1].end;
        this.team1_small.string = (t1s > 0) ? t1s : "";
        this.team2_small.string = (t2s > 0) ? t2s : "";

        // pairs
        let t1pe = coins_history[2][0].instant + coins_history[2][0].end;
        let t2pe = coins_history[2][1].instant + coins_history[2][1].end;
        if (t1pe > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t1pe, "(envite)");
            this.team1_pairs.addChild(sg);
        }
        if (t2pe > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t2pe, "(envite)");
            this.team2_pairs.addChild(sg);
        }
        coins_history[2][0].play.forEach((play) => {
            if (play.coin > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(play.coin, play.type);
                this.team1_pairs.addChild(sg);
            }
        })
        coins_history[2][1].play.forEach((play) => {
            if (play.coin > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(play.coin, play.type);
                this.team2_pairs.addChild(sg);
            }
        })

        // game
        let g1 = coins_history[3][0].play.length;
        let g2 = coins_history[3][1].play.length;
        if (g1 > 0 || g2 > 0) {
            let t1ge = coins_history[3][0].instant + coins_history[3][0].end;
            let t2ge = coins_history[3][1].instant + coins_history[3][1].end;
            if (t1ge > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(t1ge, "(envite)");
                this.team1_game.addChild(sg);
            }
            if (t2ge > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(t2ge, "(envite)");
                this.team2_game.addChild(sg);
            }
            coins_history[3][0].play.forEach((play) => {
                if (play.coin > 0) {
                    let sg = cc.instantiate(this.score_group);
                    const sgc = sg.getComponent("ScoreGroup");
                    sgc.setValues(play.coin, play.type);
                    this.team1_game.addChild(sg);
                }
            })
            coins_history[3][1].play.forEach((play) => {
                if (play.coin > 0) {
                    let sg = cc.instantiate(this.score_group);
                    const sgc = sg.getComponent("ScoreGroup");
                    sgc.setValues(play.coin, play.type);
                    this.team2_game.addChild(sg);
                }
            })
        } else {
            let t1ge = coins_history[4][0].instant + coins_history[4][0].end;
            let t2ge = coins_history[4][1].instant + coins_history[4][1].end;
            if (t1ge > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(t1ge, "(envite)");
                this.team1_game.addChild(sg);
            }
            if (t2ge > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(t2ge, "(envite)");
                this.team2_game.addChild(sg);
            }
            coins_history[4][0].play.forEach((play) => {
                if (play.coin > 0) {
                    let sg = cc.instantiate(this.score_group);
                    const sgc = sg.getComponent("ScoreGroup");
                    sgc.setValues(play.coin, play.type);
                    this.team1_game.addChild(sg);
                }
            })
            coins_history[4][1].play.forEach((play) => {
                if (play.coin > 0) {
                    let sg = cc.instantiate(this.score_group);
                    const sgc = sg.getComponent("ScoreGroup");
                    sgc.setValues(play.coin, play.type);
                    this.team2_game.addChild(sg);
                }
            })
        }
        this.team1_round.string = round_coins[0];
        this.team2_round.string = round_coins[1];
        this.team1_add.string = "(+" + round_coins[0] + ")";
        this.team2_add.string = "(+" + round_coins[1] + ")";
        this.team1_total.string = total_coins[0];
        this.team2_total.string = total_coins[1];
    }
    //   update(dt) {},
});
