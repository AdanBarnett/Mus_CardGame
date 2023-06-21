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
        GameScene.addPlayerCards(params.user, params.cards);
        break;

      case MESSAGE_TYPE.SC_DO_MUS_CLAIM:
        GameScene.doMusClaim(params.user);
        break;
    }
  },

  send(messageType, data, room) {
    ServerCommService.onReceiveMessage(messageType, data, room);
  },

  sendMusClaim(user, mus) {
    this.send(MESSAGE_TYPE.CS_CLAIM_MUS, { user, mus }, 1);
  },
};
