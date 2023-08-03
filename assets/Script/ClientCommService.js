import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Common/CommServices";
import { GameScene } from "./GameScene";

export const ClientCommService = {
  onExtensionResponse(event) {
    const messageType = event.cmd;
    const params = event.params;

    console.log("C - onExtensionResponse", event.cmd, event.params);

    switch (messageType) {
      case MESSAGE_TYPE.SC_SET_CARDS:
        GameScene.setPlayerCards(params.user, params.cards);
        break;

      case MESSAGE_TYPE.SC_ADD_CARDS:
        console.log("rherhsherhserhhhhhhhhhhhhhhhhhh");
        GameScene.addPlayerCards(params.user, params.cards, params.discard);
        break;

      case MESSAGE_TYPE.SC_DO_MUS_CLAIM:
        GameScene.doMusClaim(params.user, params.round_count, params.dealer);
        break;

      case MESSAGE_TYPE.SC_DO_MUS_ALARM:
        GameScene.doMusAlarm(params.user, params.mus);
        break;

      case MESSAGE_TYPE.SC_DISPLAY_DISCARD:
        GameScene.doDisplayDiscard();
        break;

      case MESSAGE_TYPE.SC_DO_MUS_DISCARD:
        GameScene.doDiscard(params.user, params.dealer, params.round_count);
        break;

      case MESSAGE_TYPE.SC_DO_DISCARD_ALARM:
        GameScene.doDiscardAlarm(params.user, params.cards);
        break;

      case MESSAGE_TYPE.SC_DO_BIG:
        GameScene.doBig(params.user, params.availableActions, params.state);
        break;

      case MESSAGE_TYPE.SC_DO_SMALL:
        GameScene.doSmall(params.user, params.availableActions, params.state);
        break;

      case MESSAGE_TYPE.SC_EVAL_PAIRS:
        GameScene.evalPairs(params.user);
        break;

      case MESSAGE_TYPE.SC_DO_PAIRS:
        GameScene.doPairs(params.user, params.availableActions, params.state);
        break;

      case MESSAGE_TYPE.SC_EVAL_GAME:
        GameScene.evalGame(params.user);
        break;

      case MESSAGE_TYPE.SC_DO_GAME:
        GameScene.doGame(params.user, params.availableActions, params.state);
        break;

      case MESSAGE_TYPE.SC_DO_POINTS:
        GameScene.doPoints(params.user, params.availableActions, params.state);
        break;

      case MESSAGE_TYPE.SC_SHARE_POINT:
        GameScene.sharePoints(params.user, params.coins_history, params.total_coins, params.points);
        break;

      case MESSAGE_TYPE.SC_DO_END_ROUND:
        GameScene.doEndRound(params.coins_history, params.round_coins, params.total_coins, params.endMission, params.mission_score, params.points, params.winner, params.win_cards);
        break;

      case MESSAGE_TYPE.SC_DO_ALARM:
        GameScene.doAlarm(params.user, params.content, params.coin);
        break;

      case MESSAGE_TYPE.SC_SEND_POINT:
        GameScene.setPoints(params.users, params.coins, params.state);
        break;
    }
  },

  send(messageType, data, room) {
    ServerCommService.onReceiveMessage(messageType, data, room);
  },

  sendMusClaim(user, mus) {
    this.send(MESSAGE_TYPE.CS_CLAIM_MUS, { user, mus }, 1);
  },

  sendDiscardCards(user, cards) {
    this.send(MESSAGE_TYPE.CS_DISCARD_CARDS, { user, cards }, 1);
  },
  sendAccept(user) {
    this.send(MESSAGE_TYPE.CS_ACTION_ACCEPT, { user }, 1);
  },
  sendPass(user) {
    this.send(MESSAGE_TYPE.CS_ACTION_PASS, { user }, 1);
  },
  sendEnvido(user, coin) {
    this.send(MESSAGE_TYPE.CS_ACTION_ENVIDO, { user, coin }, 1);
  },
  sendBetMore(user, coin) {
    this.send(MESSAGE_TYPE.CS_ACTION_BET_MORE, { user, coin }, 1);
  },
  sendAllIn(user) {
    this.send(MESSAGE_TYPE.CS_ACTION_ALLIN, { user }, 1);
  },
  sendRestart(user) {
    this.send(MESSAGE_TYPE.CS_RESTART, { user }, 1);
    GameScene.start();
  }
};
