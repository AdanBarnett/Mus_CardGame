import { ROUNDS } from "./Common/Messages";
import { GameScene } from "./GameScene";

const selected = [[-207, -31], [-94, -31], [18, -31], [132, -31]];

export default cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        team1_big: cc.Node,
        team2_big: cc.Node,
        team1_small: cc.Node,
        team2_small: cc.Node,
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
        game_label: cc.Label,
        p1: cc.Label,
        p2: cc.Label,
        p3: cc.Label,
        p4: cc.Label,
        winner1: cc.Label,
        winner2: cc.Label,
        game_scene: cc.Node,
        selected: cc.Node,

        _t1p: [],
        _t2p: [],
        _t1g: [],
        _t2g: [],
        _winCards: [],
        _intervalId: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {
        this.p1.string = "Player 1";
        this.p2.string = "Player 2";
        this.p3.string = "Player 3";
        this.p4.string = "Player 4";
    },

    setValues(coins_history, round_coins, total_coins, endMission, points, winner, win_cards, intervalId, allIn) {
        this._winCards = win_cards;
        this._intervalId = intervalId;

        // debugger;
        console.log("end round", coins_history, round_coins, total_coins);
        this.team1_big.removeAllChildren();
        this.team2_big.removeAllChildren();
        this.team1_small.removeAllChildren();
        this.team2_small.removeAllChildren();
        this.team1_pairs.removeAllChildren();
        this.team2_pairs.removeAllChildren();
        this.team1_game.removeAllChildren();
        this.team2_game.removeAllChildren();

        // set game title
        this.game_label.string = (points) ? "Punto" : "Game";

        // title
        this.title.string = (endMission) ? "End of the game" : "End of the round";

        // all in
        if (allIn !== -1) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(0, "All In");
            if (allIn === ROUNDS.BIG) {
                if (winner === 0) {
                    this.team1_big.addChild(sg);
                } else if (winner === 1){
                    this.team2_big.addChild(sg);
                }
            }
            else if (allIn === ROUNDS.SMALL) {
                if (winner === 0) {
                    this.team1_small.addChild(sg);
                } else if (winner === 1){
                    this.team2_small.addChild(sg);
                }
            }
            else if (allIn === ROUNDS.PAIRS) {
                if (winner === 0) {
                    this.team1_pairs.addChild(sg);
                } else if (winner === 1){
                    this.team2_pairs.addChild(sg);
                }
            }
            else if (allIn === ROUNDS.GAME || allIn === ROUNDS.POINTS) {
                if (winner === 0) {
                    this.team1_game.addChild(sg);
                } else if (winner === 1){
                    this.team2_game.addChild(sg);
                }
            }
        }

        // big
        let t1bp = coins_history[0][0].instant;
        let t2bp = coins_history[0][1].instant;
        let t1ba = coins_history[0][0].end;
        let t2ba = coins_history[0][1].end;
        if (t1bp > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t1bp, "(Pass envido)");
            this.team1_big.addChild(sg);
        }
        if (t2bp > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t2bp, "(Pass envido)");
            this.team2_big.addChild(sg);
        }
        if (t1ba > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t1ba, "(Win envido)");
            this.team1_big.addChild(sg);
        }
        if (t2ba > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t2ba, "(Win envido)");
            this.team2_big.addChild(sg);
        }

        // small
        let t1sp = coins_history[1][0].instant;
        let t2sp = coins_history[1][1].instant;
        let t1sa = coins_history[1][0].end;
        let t2sa = coins_history[1][1].end;
        if (t1sp > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t1sp, "(Pass envido)");
            this.team1_small.addChild(sg);
        }
        if (t2sp > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t2sp, "(Pass envido)");
            this.team2_small.addChild(sg);
        }
        if (t1sa > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t1sa, "(Win envido)");
            this.team1_small.addChild(sg);
        }
        if (t2sa > 0) {
            let sg = cc.instantiate(this.score_group);
            const sgc = sg.getComponent("ScoreGroup");
            sgc.setValues(t2sa, "(Win envido)");
            this.team2_small.addChild(sg);
        }

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
            let t1ge1 = coins_history[4][0].instant + coins_history[4][0].end;
            let t2ge1 = coins_history[4][1].instant + coins_history[4][1].end;
            if (t1ge1 > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(t1ge1, "(envite)");
                this.team1_game.addChild(sg);
            }
            if (t2ge1 > 0) {
                let sg = cc.instantiate(this.score_group);
                const sgc = sg.getComponent("ScoreGroup");
                sgc.setValues(t2ge1, "(envite)");
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

        // display winner
        if (winner === 1) {
            this.winner1.string = "";
            this.winner2.string = "Winner!";
        } else if (winner === 0) {
            this.winner1.string = "Winner!";
            this.winner2.string = "";
        } else {
            this.winner1.string = "";
            this.winner2.string = "";
        }
    },

    onBigClickButton() {
        clearInterval(this._intervalId);
        this.game_scene.getChildren().forEach((child) => {
            let com = child.getComponent('PlayerHand');
            com.deselectAll();
        });
        this.selected.setPosition(selected[0][0], selected[0][1]);
        this.selected.active = true;
        if (this._winCards[0].user === -1)
            return;
        let child = this.game_scene.getChildren()[this._winCards[0].user];
        let com = child.getComponent('PlayerHand');
        setTimeout(() => {
            com.selectAll();
        }, 100);
    },

    onSmallClickButton() {
        clearInterval(this._intervalId);
        this.game_scene.getChildren().forEach((child) => {
            let com = child.getComponent('PlayerHand');
            com.deselectAll();
        });
        this.selected.setPosition(selected[1][0], selected[1][1]);
        this.selected.active = true;
        if (this._winCards[1].user === -1)
            return;
        let child = this.game_scene.getChildren()[this._winCards[1].user];
        let com = child.getComponent('PlayerHand');
        setTimeout(() => {
            com.selectAll();
        }, 100);
    },

    onPairsClickButton() {
        clearInterval(this._intervalId);
        this.game_scene.getChildren().forEach((child) => {
            let com = child.getComponent('PlayerHand');
            com.deselectAll();
        });
        this.selected.setPosition(selected[2][0], selected[2][1]);
        this.selected.active = true;
        if (this._winCards[2].user === -1)
            return;
        let child = this.game_scene.getChildren()[this._winCards[2].user];
        let com = child.getComponent('PlayerHand');
        setTimeout(() => {
            com.selectAll();
        }, 100);
    },

    onGameClickButton() {
        clearInterval(this._intervalId);
        this.game_scene.getChildren().forEach((child) => {
            let com = child.getComponent('PlayerHand');
            com.deselectAll();
        });
        this.selected.setPosition(selected[3][0], selected[3][1]);
        this.selected.active = true;
        if (this._winCards[3].user === -1)
            return;
        let child = this.game_scene.getChildren()[this._winCards[3].user];
        let com = child.getComponent('PlayerHand');
        setTimeout(() => {
            com.selectAll();
        }, 100);
    }
    //   update(dt) {},
});
