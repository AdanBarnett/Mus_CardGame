import { MESSAGE_TYPE } from "../Common/Messages";
import { ClientCommService } from "../Common/CommServices";
import { TIME_LIMIT } from "../Common/Constants";

const ROUNDS = {
  MUS_CLAIM: 0,
  MUS_DISCARD: 1,
  BIG: 2,
  SMALL: 3,
  PAIRS: 4,
  GAME: 5,
  POINTS: 6,
};

const PLAYER_CNT = 4;
const CARD_CNT = 4;

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
};

export const ServerCommService = {
  callbackMap: {},
  init() {
    this.callbackMap = {};
  },
  addRequestHandler(messageType, callback) {
    this.callbackMap[messageType] = callback;
  },
  send(messageType, data, users) {
    // TODO: Make fake code here to send message to client side
    // Added timeout bc there are times that UI are not updated properly if we send next message immediately
    // If we move to backend, we can remove this timeout
    setTimeout(() => {
      ClientCommService.onExtensionResponse({
        cmd: messageType,
        params: data,
        users: users,
      });
    }, 100);
  },
  onReceiveMessage(messageType, data, room) {
    const callback = this.callbackMap[messageType];
    console.log("S - onReceiveMessage", messageType, data, room);
    if (callback) {
      callback(data, room);
    }
  },
};
ServerCommService.init();

const TimeoutManager = {
  timeoutHandler: null,
  nextAction: null,

  setNextTimeout(callback) {
    this.timeoutHandler = setTimeout(() => {
      callback();
      this.timeoutHandler = null;
    }, TIME_LIMIT * 1000);
  },

  clearNextTimeout() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  },
};

const FakeServer = {
  deckCards: [],
  discardedCards: [],
  playerCards: [],
  currRound: null,
  dealer: 0,

  repliedUsers: [],

  initHandlers() {
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_CLAIM_MUS,
      this.claimMus.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_DISCARD_CARDS,
      this.discardPlayerCard.bind(this)
    );
  },

  startGame() {
    this.startRound();
  },

  startRound() {
    this.dealer = 0;
    this._generateDeck();
    for (let i = 0; i < PLAYER_CNT; i++) {
      this.playerCards[i] = [];
    }
    this.discardedCards = [];
    this.startMusClaim();
  },

  setCurrentRound(round) {
    this.currRound = round;
    this.resetRepliedUsers();
  },

  _generateDeck() {
    this.deckCards = [];
    for (let i = 0; i < 48; i++) {
      if (i % 12 === 8 || i % 12 === 9) {
        continue;
      }
      this.deckCards.push(i);
    }
    shuffle(this.deckCards);
  },

  // Deal cards to players so that everyone has CARD_CNT cards
  _redealCards() {
    for (let i = 0; i < PLAYER_CNT; i++) {
      const existingCount = this.playerCards[i].length;
      const playerCards = this.deckCards.splice(0, CARD_CNT - existingCount);
      this.playerCards[i].push(...playerCards);
      ServerCommService.send(
        MESSAGE_TYPE.SC_ADD_CARDS,
        {
          cards: playerCards,
          user: i,
        },
        i
      );
    }
  },

  resetRepliedUsers() {
    this.repliedUsers = [];
  },

  isUserRepliedAlready(user) {
    return this.repliedUsers.indexOf(user) >= 0;
  },

  markUserReplied(user) {
    if (this.isUserRepliedAlready(user)) {
      return false;
    }
    this.repliedUsers.push(user);
    return true;
  },

  isAllUsersReplied() {
    return this.repliedUsers.length === PLAYER_CNT;
  },

  startMusClaim() {
    this.setCurrentRound(ROUNDS.MUS_CLAIM);

    this._redealCards();
    this.askMusClaim(this.dealer);
  },

  // Ask user to claim Mus
  askMusClaim(user) {
    ServerCommService.send(MESSAGE_TYPE.SC_DO_MUS_CLAIM, { user }, user);

    TimeoutManager.setNextTimeout(() => {
      this.claimMus({ mus: true, user });
    });
  },

  // Called when user claimed Mus
  claimMus(params, room) {
    const mus = params.mus;
    const user = params.user;

    if (!this.markUserReplied(user)) {
      return;
    }

    TimeoutManager.clearNextTimeout();
    if (mus) {
      if (this.isAllUsersReplied()) {
        this.startMusDiscard();
      } else {
        this.askMusClaim((user + 1) % PLAYER_CNT);
      }
    } else {
      this.startBig();
    }
  },

  // Ask user to discard cards
  startMusDiscard() {
    this.setCurrentRound(ROUNDS.MUS_DISCARD);

    ServerCommService.send(MESSAGE_TYPE.SC_DO_MUS_DISCARD, {}, -1);

    TimeoutManager.setNextTimeout(() => {
      this.finishMusDiscard();
    });
  },

  finishMusDiscard() {
    TimeoutManager.clearNextTimeout();
    this.startMusClaim();
  },

  // Called when user discarded cards
  discardPlayerCard(params, room) {
    const user = params.user;
    const cards = params.cards;
    if (!this.markUserReplied(user)) {
      return;
    }

    this.playerCards[user] = this.playerCards[user].filter(
      (card) => !cards.includes(card)
    );
    this.discardedCards.push(...cards);

    // TODO: Uncomment this code when we move to backend
    // if (!this.isAllUsersReplied()) {
    //   return;
    // }
    this.finishMusDiscard();
  },

  startBig() {},
};

FakeServer.initHandlers();
setTimeout(() => {
  FakeServer.startGame();
}, 1000);
