import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../Common/CommServices";
import { TIME_LIMIT, COINS_LIMIT } from "../Common/Constants";

const PLAYER_CNT = 4;
const CARD_CNT = 4;

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
};

let item_history = {
  instant: 0,
  end: 0,
  play: [],
};

function divideArrayItems(array, divisor) {
  let dividedArray = array.map(item => (item % divisor) + 1);
  dividedArray.sort((a, b) => b - a)
  return [...dividedArray];
}

function findCombination(cards) {
  // Replace 12 with 1 and 3 with 12 in the input array
  let numbers = cards.map(num => {
    if (num === 2) return 1;
    if (num === 3) return 12;
    return num;
  });

  // Sort the numbers in ascending order
  numbers.sort((a, b) => b - a);

  // Check if all 4 digits are the same
  if (new Set(numbers).size === 1) {
    return numbers;
  }

  // Check if there are 2 combinations of the same digits
  if (new Set(numbers).size === 2) {
    for (let num of new Set(numbers)) {
      if (numbers.filter(n => n === num).length === 2) {
        return numbers;
      }
    }
  }

  // Check if three digits are the same
  for (let num of new Set(numbers)) {
    if (numbers.filter(n => n === num).length === 3) {
      return [num, num, num];
    }
  }

  // Check if two digits are the same
  for (let num of new Set(numbers)) {
    if (numbers.filter(n => n === num).length === 2) {
      return [num, num];
    }
  }

  // If none of the conditions are satisfied, return an empty array
  return [];
}

function calculateSum(cards) {
  // Define a helper function to handle the digit conversion
  function convertToDigit(num) {
    if (num === 2) {
      return 1;
    } else if (num === 11 || num === 12 || num === 3) {
      return 10;
    } else {
      return num;
    }
  }

  // Convert each number in the array to its corresponding digit
  const digits = cards.map(convertToDigit);

  // Calculate the sum of the digits
  const sum = digits.reduce((acc, curr) => acc + curr, 0);

  return sum;
}

// Define the specific number sequence
const numberSequence = [31, 32, 40, 37, 36, 35, 34];

// Define the order based on the number sequence
const order = new Map();
numberSequence.forEach((num, index) => {
  order.set(num, index);
});

// Custom comparator function
function customComparator(a, b) {
  const orderA = order.get(a.value);
  const orderB = order.get(b.value);

  if (orderA < orderB) {
    return -1;
  } else if (orderA > orderB) {
    return 1;
  } else {
    return 0;
  }
}

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

  setNextTimeout(callback, timeLimit) {
    this.timeoutHandler = setTimeout(() => {
      callback();
      // this.timeoutHandler = null;
    }, (timeLimit) ? (timeLimit * 1000) : (TIME_LIMIT * 1000));
  },

  clearNextTimeout() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  },
};

function sumArray(array) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

const FakeServer = {
  deckCards: [],
  discardedCards: [],
  playerCards: [],
  playerCardsEval: [],
  playerPairCards: [],
  playersCardsSum: [],
  currRound: null,
  dealer: 0,
  repliedUsers: [],
  bet_coins: [0, 0, 0, 0],   // betted coins in category
  total_coins: [0, 0, 0, 0],  // total coins of mission
  round_coins: [0, 0, 0, 0],  // total coins of round
  // the score of round (e: [1, 0] )
  mission_score: [0, 0],
  usersState_inCategory: [],
  endCategory: false,
  endRound: false,
  endMission: false,
  endGame: false,
  stateCategory: "",
  prevAvAction: null,
  coins_history: [
    [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
    [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
    [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
    [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
    [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
  ],
  envidoState: false,
  availableUsers: [],
  availableUsersForGame: [],
  openBet: 0,

  initHandlers() {
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_CLAIM_MUS,
      this.claimMus.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_DISCARD_CARDS,
      this.discardPlayerCard.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_ACTION_ACCEPT,
      this.accept.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_ACTION_PASS,
      this.pass.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_ACTION_ALLIN,
      this.allIn.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_ACTION_ENVIDO,
      this.envido.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_ACTION_BET_MORE,
      this.betMore.bind(this)
    );
    ServerCommService.addRequestHandler(
      MESSAGE_TYPE.CS_RESTART,
      this.startGame.bind(this)
    );
  },

  startGame() {
    this.mission_score = [0, 0];
    this.startMission();
  },

  startMission() {
    this.startRound();
    this.total_coins = [0, 0, 0, 0];
    this.endMission = false;
  },

  startRound() {
    this.dealer = 0;
    this.deckCards = [];
    this.discardedCards = [];
    this.playerCards = [];
    this.repliedUsers = [];
    this.bet_coins = [0, 0, 0, 0];
    this.endRound = false;
    this.round_coins = [0, 0, 0, 0];
    this.coins_history = [
      [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
      [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
      [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
      [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
      [{ ...item_history, play: [...item_history.play] }, { ...item_history, play: [...item_history.play] }],
    ];
    this._generateDeck();
    for (let i = 0; i < PLAYER_CNT; i++) {
      this.playerCards[i] = [];
    }
    this.discardedCards = [];
    this.startMusClaim();
  },

  // use for mus and discard
  setCurrentRound(round) {
    this.currRound = round;
    this.resetRepliedUsers();
  },

  _generateDeck() {
    this.deckCards = [];
    for (let i = 0; i < 48; i++) {
      if (i % 12 === 7 || i % 12 === 8) {
        continue;
      }
      this.deckCards.push(i);
    }
    shuffle(this.deckCards);
  },

  _addCardsToDeck() {
    if (this.deckCards.length < 6) {
      let temp = [];
      for (let i = 0; i < PLAYER_CNT; i++) {
        for (let j = 0; j < CARD_CNT; j++) {
          temp.push(this.playerCards[i][j]);
        }
      }
      this.deckCards = [];
      for (let i = 0; i < 48; i++) {
        if (i % 12 === 7 || i % 12 === 8) {
          continue;
        }
        if (temp.includes(i)) {
          continue;
        }
        this.deckCards.push(i);
      }
      shuffle(this.deckCards);
    }
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
    this._addCardsToDeck();
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

  sendAlarmToAllUsers(messageType, param, room) {
    // for (let i = 0; i < PLAYER_CNT; i++) {
    ServerCommService.send(
      messageType,
      param,
      [0, 1, 2, 3]
    );
    // }
  },

  startMusClaim() {
    this.setCurrentRound(ROUNDS.MUS_CLAIM);
    this._redealCards();
    this.askMusClaim(this.dealer);
  },

  // Ask user to claim Mus
  askMusClaim(user) {
    console.log("ask user to claim mus : " + user);
    ServerCommService.send(MESSAGE_TYPE.SC_DO_MUS_CLAIM, { user }, user);

    TimeoutManager.setNextTimeout(() => {
      this.claimMus({ mus: true, user });
    });
  },

  // Called when user claimed Mus
  claimMus(params, room) {
    console.log("called when user claimed mus : " + params.user + ", mus :" + params.mus);
    TimeoutManager.clearNextTimeout();
    const mus = params.mus;
    const user = params.user;
    if (!this.markUserReplied(user)) {
      return;
    }
    //Alarm to users
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_MUS_ALARM, { mus, user }, 1);
    if (mus) {
      if (this.isAllUsersReplied()) {
        this.setCurrentRound(ROUNDS.MUS_DISCARD);
        this.askMusDiscard((user + 1) % PLAYER_CNT);
      } else {
        console.log("ask:" + (user + 1));
        this.askMusClaim((user + 1) % PLAYER_CNT);
      }
    } else {
      for (let i = 0; i < PLAYER_CNT; i++) {
        this.playerCardsEval[i] = divideArrayItems(this.playerCards[i], 12);
      }
      this.startCategory();
    }
  },


  // Ask user to discard cards
  askMusDiscard(user) {
    console.log("ask user to discard :" + user)
    ServerCommService.send(MESSAGE_TYPE.SC_DO_MUS_DISCARD, { user }, -1);
    // this.finishMusDiscard();
    TimeoutManager.setNextTimeout(() => {
      console.log("time discard:" + user);
      this.discardPlayerCard({ user, cards: [] }, 1);
    });
  },

  // Called when user discarded cards
  discardPlayerCard(params, room) {
    console.log("called when user discarded :" + params.user);

    TimeoutManager.clearNextTimeout();
    const user = params.user;
    const cards = params.cards;
    if (!this.markUserReplied(user)) {
      return;
    }
    //Alarm to users
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_DISCARD_ALARM, { user, cards }, 1);

    this.playerCards[user] = this.playerCards[user].filter(
      (card) => !cards.includes(card)
    );
    this.discardedCards.push(...cards);
    this._redealCards();
    // TODO: Uncomment this code when we move to backend
    if (!this.isAllUsersReplied()) {
      this.askMusDiscard((user + 1) % PLAYER_CNT);
    } else {
      this.startMusClaim();
    }
  },

  // start play round (use for big, small, pairs, game)
  setCurrentCategory() {
    this.usersState_inCategory = [
      {
        messageType: "",
        coin: 0,
      },
      {
        messageType: "",
        coin: 0,
      },
      {
        messageType: "",
        coin: 0,
      },
      {
        messageType: "",
        coin: 0,
      },
    ];
    this.endCategory = false;
    this.stateCategory = "start";
    this.bet_coins = [0, 0, 0, 0];
    this.envidoState = false;
    this.repliedUsers = [];
    this.winnerOfCategory = 0;
    this.openBet = 0;
    // this.availableUsers = [];
    // this.availableUsersForGame = [];
    // this.playerPairCards = [];
    // this.playersCardsSum = [];
  },

  // determine endCategory
  isEndCategory(user) {
    let users = [];
    if (this.currRound === ROUNDS.PAIRS) {
      users = [...this.availableUsers];
    } else if (this.currRound === ROUNDS.GAME) {
      users = [...this.availableUsersForGame];
    } else {
      users = [0, 1, 2, 3];
    }
    if (this.stateCategory === "accept") {
      this.endCategory = true;
      // this.winnerOfCategory = this.getWinnerInCategory(users);
    }
    if (this.stateCategory === "pass") {
      if (([MESSAGE_TYPE.CS_ACTION_ALLIN, MESSAGE_TYPE.CS_ACTION_BET_MORE, MESSAGE_TYPE.CS_ACTION_ENVIDO].includes(this.usersState_inCategory[(user + 1) % 4].messageType)
        || [MESSAGE_TYPE.CS_ACTION_ALLIN, MESSAGE_TYPE.CS_ACTION_BET_MORE, MESSAGE_TYPE.CS_ACTION_ENVIDO].includes(this.usersState_inCategory[(user + 3) % 4].messageType))
        && ((this.usersState_inCategory[(user + 2) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS) || !users.includes((user + 2) % 4))) {
        this.endCategory = true;
      }
      if ((this.usersState_inCategory[(user + 1) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS || !users.includes((user + 1) % 4))
        && (this.usersState_inCategory[(user + 3) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS || !users.includes((user + 3) % 4))) {
        if (users.includes((user + 2) % 4)) {
          if (this.usersState_inCategory[(user + 2) % 4].messageType !== "") {
            this.endCategory = true;
          }
        } else {
          this.endCategory = true;
        }
      }
    }
    return this.endCategory;
  },

  // set next user to action
  setNextUser(user) {
    let users = [];
    if (this.currRound === ROUNDS.PAIRS) {
      users = [...this.availableUsers];
    } else if (this.currRound === ROUNDS.GAME) {
      users = [...this.availableUsersForGame];
    } else {
      users = [0, 1, 2, 3];
    }
    if (["envido", "allIn"].includes(this.stateCategory)) {
      if (users.includes((user + 1) % 4)) {
        return (user + 1) % 4;
      } else if (users.includes((user + 3) % 4)) {
        return (user + 3) % 4;
      }
    }
    else if (this.stateCategory === "betMore") {
      if (users.includes((user + 1) % 4)
        && [MESSAGE_TYPE.CS_ACTION_ENVIDO, MESSAGE_TYPE.CS_ACTION_BET_MORE].includes(this.usersState_inCategory[(user + 1) % 4].messageType)
      ) {
        return (user + 1) % 4;
      } else if (users.includes((user + 3) % 4)) {
        return (user + 3) % 4;
      }
    }
    else if (this.stateCategory === "pass") {
      if (users.includes((user + 1) % 4) && this.usersState_inCategory[(user + 1) % 4].messageType === "" && (this.usersState_inCategory[(user + 3) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS || this.usersState_inCategory[(user + 3) % 4].messageType === "")) {
        return (user + 1) % 4;
      }
      else if (users.includes((user + 3) % 4) && this.usersState_inCategory[(user + 3) % 4].messageType === "" && (this.usersState_inCategory[(user + 1) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS || this.usersState_inCategory[(user + 1) % 4].messageType === "")) {
        return (user + 3) % 4;
      }
      else if (users.includes((user + 2) % 4)) {
        return (user + 2) % 4;
      }
    }
  },

  // start category
  startCategory() {
    this.setCurrentCategory();
    switch (this.currRound) {
      case ROUNDS.MUS_CLAIM:
        this.currRound = ROUNDS.BIG;
        break;
      case ROUNDS.BIG:
        this.currRound = ROUNDS.SMALL;
        break;
      case ROUNDS.SMALL:
        this.availableUsers = this.getUsersForPairs();
        console.log("aaaaaaaaaaaa", this.availableUsers);
        this.currRound = ROUNDS.EVAL_PAIRS;
        break;
      case ROUNDS.EVAL_PAIRS:
        if (this.availableUsers.length < 2) {
          this.calcCoinInCategory();
          this.currRound = ROUNDS.EVAL_GAME;
          this.availableUsersForGame = this.getUsersForGame();
        } else if (this.availableUsers.length === 2) {
          if ((this.availableUsers[0] + this.availableUsers[1]) % 2 === 1) {
            this.currRound = ROUNDS.PAIRS;
          }
          else {
            this.calcCoinInCategory();
            this.currRound = ROUNDS.EVAL_GAME;
            this.availableUsersForGame = this.getUsersForGame();
          }
        } else {
          this.currRound = ROUNDS.PAIRS;
        }
        break;
      case ROUNDS.PAIRS:
        this.availableUsersForGame = this.getUsersForGame();
        console.log("aaaaaaaaaaaa", this.availableUsers);
        this.currRound = ROUNDS.EVAL_GAME;
        break;
      case ROUNDS.EVAL_GAME:
        if (this.availableUsersForGame.length === 0) {
          // this.calcCoinInCategory();
          this.currRound = ROUNDS.POINTS;
        } else if (this.availableUsersForGame.length === 1) {
          this.calcCoinInCategory();
          this.currRound = ROUNDS.SHAREPOINTS;
        } else if (this.availableUsersForGame.length === 2) {
          if ((this.availableUsersForGame[0] + this.availableUsersForGame[1]) % 2 === 1) {
            this.currRound = ROUNDS.GAME;
          }
          else {
            this.calcCoinInCategory();
            this.currRound = ROUNDS.SHAREPOINTS;
          }
        } else {
          this.currRound = ROUNDS.GAME;
        }
        break;
      case ROUNDS.GAME:
        this.currRound = ROUNDS.SHAREPOINTS;
        break;
      case ROUNDS.POINTS:
        this.currRound = ROUNDS.SHAREPOINTS;
        break;
      case ROUNDS.SHAREPOINTS:
        this.currRound = ROUNDS.END;
        this.endRound = true;
        break;
      // case ROUNDS.END:
      //   this.currRound = ROUNDS.END;
      // break;
      default: 0;
    }
    let startUser = this.dealer;
    if (this.currRound === ROUNDS.PAIRS) {
      startUser = Math.min(...this.availableUsers);
    }
    if (this.currRound === ROUNDS.GAME) {
      startUser = Math.min(...this.availableUsersForGame);
    }
    this.askAction(startUser);
  },

  // get available actions
  getAvailableActions() {
    switch (this.stateCategory) {
      case "start":
        this.prevAvAction = [MESSAGE_TYPE.CS_ACTION_PASS, MESSAGE_TYPE.CS_ACTION_ENVIDO, MESSAGE_TYPE.CS_ACTION_ALLIN];
        return this.prevAvAction;
      case "pass":
        // if (this.envidoState) {
        //   this.prevAvAction = [MESSAGE_TYPE.CS_ACTION_PASS, MESSAGE_TYPE.CS_ACTION_BET_MORE, MESSAGE_TYPE.CS_ACTION_ALLIN];
        //   return this.prevAvAction;
        // } else {
        //   this.prevAvAction = [MESSAGE_TYPE.CS_ACTION_PASS, MESSAGE_TYPE.CS_ACTION_ENVIDO, MESSAGE_TYPE.CS_ACTION_ALLIN];
        //   return this.prevAvAction;
        // }
        return this.prevAvAction;
      case "envido":
        this.prevAvAction = [MESSAGE_TYPE.CS_ACTION_PASS, MESSAGE_TYPE.CS_ACTION_ACCEPT, MESSAGE_TYPE.CS_ACTION_BET_MORE, MESSAGE_TYPE.CS_ACTION_ALLIN];
        return this.prevAvAction;
      case "betMore":
        this.prevAvAction = [MESSAGE_TYPE.CS_ACTION_PASS, MESSAGE_TYPE.CS_ACTION_ACCEPT, MESSAGE_TYPE.CS_ACTION_BET_MORE, MESSAGE_TYPE.CS_ACTION_ALLIN];
        return this.prevAvAction;
      case "allIn":
        this.prevAvAction = [MESSAGE_TYPE.CS_ACTION_PASS, MESSAGE_TYPE.CS_ACTION_ACCEPT];
        return this.prevAvAction;
      case "accept":
        this.prevAvAction = [];
        return this.prevAvAction;
      // break;
      default: return this.prevAvAction;
    }
  },

  // get available users of pairs
  getUsersForPairs() {
    let users = [];
    for (let i = 0; i < PLAYER_CNT; i++) {
      this.playerPairCards[i] = findCombination(this.playerCardsEval[i]);
      if (this.playerPairCards[i].length > 0) {
        users.push(i);
      }
    }
    return users;
  },

  // get available users of game
  getUsersForGame() {
    let users = [];
    for (let i = 0; i < PLAYER_CNT; i++) {
      this.playersCardsSum[i] = calculateSum(this.playerCardsEval[i]);
      if (this.playersCardsSum[i] > 30) {
        users.push(i);
      }
    }
    return users;
  },

  // ask user to action
  askAction(user) {
    console.log("ask user to " + this.currRound + " : " + user);
    let availableActions = this.getAvailableActions();
    let params = {
      user,
      availableActions,
      state: this.stateCategory,
    }
    switch (this.currRound) {
      case ROUNDS.BIG:
        ServerCommService.send(MESSAGE_TYPE.SC_DO_BIG, params, user);
        break;
      case ROUNDS.SMALL:
        ServerCommService.send(MESSAGE_TYPE.SC_DO_SMALL, params, user);
        break;
      case ROUNDS.EVAL_PAIRS:
        ServerCommService.send(MESSAGE_TYPE.SC_EVAL_PAIRS, { user }, user);
        break;
      case ROUNDS.PAIRS:
        ServerCommService.send(MESSAGE_TYPE.SC_DO_PAIRS, params, user);
        break;
      case ROUNDS.EVAL_GAME:
        ServerCommService.send(MESSAGE_TYPE.SC_EVAL_GAME, { user }, user);
        break;
      case ROUNDS.GAME:
        ServerCommService.send(MESSAGE_TYPE.SC_DO_GAME, params, user);
        break;
      case ROUNDS.POINTS:
        ServerCommService.send(MESSAGE_TYPE.SC_DO_POINTS, params, user);
        break;
      case ROUNDS.SHAREPOINTS:
        this.coins_history.forEach((row, i) => {
          row.forEach((item, j) => {
            this.round_coins[j] += item.instant;
            this.round_coins[j + 2] += item.instant;
            this.total_coins[j] += item.end;
            this.total_coins[j + 2] += item.end;
            this.round_coins[j] += item.end;
            this.round_coins[j + 2] += item.end;
            item.play.forEach((value, k) => {
              this.total_coins[j] += value.coin;
              this.total_coins[j + 2] += value.coin;
              this.round_coins[j] += value.coin;
              this.round_coins[j + 2] += value.coin;
            })
          })
        })
        params = { user, coins_history: this.coins_history, total_coins: this.total_coins, endMission: this.endMission };
        ServerCommService.send(MESSAGE_TYPE.SC_SHARE_POINT, params, user);
        // this.startCategory();
        break;
      case ROUNDS.END:
        if (this.total_coins[0] > 30) {
          this.endMission = true;
          this.mission_score[0] += 1;
        } else if (this.total_coins[1] > 30) {
          this.mission_score[1] += 1;
        }
        params = { coins_history: this.coins_history, round_coins: this.round_coins, total_coins: this.total_coins, endMission: this.endMission, mission_score: this.mission_score };
        ServerCommService.send(MESSAGE_TYPE.SC_DO_END_ROUND, params, user);
        if (this.mission_score[0] === 2 || this.mission_score[1] === 2) {
          this.endGame = true;
        }
        break;

    }
    if (this.currRound !== ROUNDS.END) {
      if ([ROUNDS.EVAL_GAME, ROUNDS.EVAL_PAIRS].includes(this.currRound)) {
        TimeoutManager.setNextTimeout(() => {
          this.eval({ user }, 1);
        }, 2);
      }
      else if (this.currRound === ROUNDS.SHAREPOINTS) {
        TimeoutManager.setNextTimeout(() => {
          this.endShareMode();
        }, 2);
      }
      else {
        TimeoutManager.setNextTimeout(() => {
          this.pass({ user }, 1);
        });
      }
    } else {
      if (!this.endGame) {
        if (!this.endMission) {
          TimeoutManager.setNextTimeout(() => {
            this.startRound();
          });
        } else {
          TimeoutManager.setNextTimeout(() => {
            this.startMission();
          });
        }
      }
    }
  },

  // evaluate pairs or game
  eval(params, room) {
    console.log("eval pairs or game");
    TimeoutManager.clearNextTimeout();
    let user = params.user;
    // this.stateCategory = "eval";
    // this.usersState_inCategory[user].messageType = MESSAGE_TYPE.CS_ACTION_PASS;
    // this.usersState_inCategory[user].coin = 0;
    if (!this.markUserReplied(user)) {
      return;
    }
    let users = (this.currRound === ROUNDS.EVAL_PAIRS) ? [...this.availableUsers] : [...this.availableUsersForGame];
    if (users.includes(user)) {
      this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: "Yes" }, 1);
    }
    else {
      this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: "No" }, 1);
    }
    if (this.isAllUsersReplied()) {
      this.startCategory();
    } else {
      this.askAction((user + 1) % 4);
    }
  },

  // end share mode and start ending round mode
  endShareMode() {
    console.log("end share mode");
    TimeoutManager.clearNextTimeout();
    this.startCategory();
  },

  // get winning team in category
  getWinnerInCategory(users) {
    let winner = 0;
    let players = [...this.playerCardsEval];
    let playerPairCards = [...this.playerPairCards];
    let playersCardsSum = [...this.playersCardsSum];
    let pass = true;
    let indexedArray;
    if (this.currRound === ROUNDS.EVAL_PAIRS || this.currRound === ROUNDS.EVAL_GAME) {
      return winner;
    }
    for (let i = 0; i < users.length; i++) {
      if (this.usersState_inCategory[users[i]].messageType === MESSAGE_TYPE.CS_ACTION_ACCEPT) {
        if (this.currRound === ROUNDS.BIG) {
          indexedArray = players.map((value, index) => ({ value, index }));
          indexedArray.sort((a, b) => {
            for (let i = 0; i < 4; i++) {
              if (a.value[i] !== b.value[i]) {
                return b.value[i] - a.value[i];
              }
            }
          });
          const sortedIndices = indexedArray.map(obj => obj.index);
          winner = sortedIndices[0];
        }
        else if (this.currRound === ROUNDS.SMALL) {
          players.map((value) => {
            return value.sort((a, b) => (a - b));
          });
          indexedArray = players.map((value, index) => ({ value, index }));
          indexedArray.sort((a, b) => {
            for (let i = 0; i < 4; i++) {
              if (a.value[i] !== b.value[i]) {
                return a.value[i] - b.value[i];
              }
            }
          });
          const sortedIndices = indexedArray.map(obj => obj.index);
          winner = sortedIndices[0];
        }
        else if (this.currRound === ROUNDS.PAIRS) {
          indexedArray = playerPairCards.map((value, index) => ({ value, index }));
          indexedArray.sort((a, b) => b.value.length - a.value.length);
          // playerPairCards.sort((a, b) => {
          //   return a.length - b.length;
          // });
          // Get the original indices after sorting
          const sortedIndices = indexedArray.map(obj => obj.index);
          console.log(sortedIndices);

          winner = sortedIndices[0];
        }
        else if (this.currRound === ROUNDS.GAME) {
          indexedArray = playersCardsSum.map((value, index) => ({ value, index }));
          indexedArray.sort(customComparator);
          const sortedIndices = indexedArray.map(obj => obj.index);
          console.log(sortedIndices);

          winner = sortedIndices[0];
        }
        else if (this.currRound === ROUNDS.POINTS) {
          indexedArray = playersCardsSum.map((value, index) => ({ value, index }));
          indexedArray.sort((a, b) => a.value - b.value);
          const sortedIndices = indexedArray.map(obj => obj.index);
          console.log(sortedIndices);

          winner = sortedIndices[0];
        }
        return winner;
      }
      if (this.usersState_inCategory[i].messageType !== MESSAGE_TYPE.CS_ACTION_PASS) {
        pass = false;
      }
    }
    if (pass) {
      if (this.currRound === ROUNDS.BIG) {
        indexedArray = players.map((value, index) => ({ value, index }));
        indexedArray.sort((a, b) => {
          for (let i = 0; i < 4; i++) {
            if (a.value[i] !== b.value[i]) {
              return b.value[i] - a.value[i];
            }
          }
        });
        const sortedIndices = indexedArray.map(obj => obj.index);
        winner = sortedIndices[0];
        // this.coins_history[this.currRound - 2][winner % 2].end = 1;
      }
      else if (this.currRound === ROUNDS.SMALL) {
        players.map((value) => {
          return value.sort((a, b) => (a - b));
        });
        indexedArray = players.map((value, index) => ({ value, index }));
        indexedArray.sort((a, b) => {
          for (let i = 0; i < 4; i++) {
            if (a.value[i] !== b.value[i]) {
              return a.value[i] - b.value[i];
            }
          }
        });
        const sortedIndices = indexedArray.map(obj => obj.index);
        winner = sortedIndices[0];
        // this.coins_history[this.currRound - 2][winner % 2].end = 1;
      }
      else if (this.currRound === ROUNDS.PAIRS || this.currRound === ROUNDS.EVAL_PAIRS) {
        indexedArray = playerPairCards.map((value, index) => ({ value, index }));
        indexedArray.sort((a, b) => b.value.length - a.value.length);
        // Get the original indices after sorting
        const sortedIndices = indexedArray.map(obj => obj.index);
        console.log(sortedIndices);

        winner = sortedIndices[0];
      }
      else if (this.currRound === ROUNDS.GAME || this.currRound === ROUNDS.EVAL_GAME) {
        indexedArray = playersCardsSum.map((value, index) => ({ value, index }));
        indexedArray.sort(customComparator);
        const sortedIndices = indexedArray.map(obj => obj.index);
        console.log(sortedIndices);

        winner = sortedIndices[0];
      }
      else if (this.currRound === ROUNDS.POINTS) {
        indexedArray = playersCardsSum.map((value, index) => ({ value, index }));
        indexedArray.sort((a, b) => a.value - b.value);
        const sortedIndices = indexedArray.map(obj => obj.index);
        console.log(sortedIndices);

        winner = sortedIndices[0];
      }
      return winner;
    } else {
      for (let i = 0; i < users.length; i++) {
        console.log("ccccccccccccccccccccccccccc: ", i)
        if ([MESSAGE_TYPE.CS_ACTION_ALLIN, MESSAGE_TYPE.CS_ACTION_ENVIDO, MESSAGE_TYPE.CS_ACTION_BET_MORE].includes(this.usersState_inCategory[users[i]].messageType)) {
          winner = users[i];
          return winner;
        }
      }
    }

  },

  // calculate bet_coins in Category
  calcCoinInCategory() {
    let users = [];
    if (this.currRound === ROUNDS.PAIRS) {
      users = [...this.availableUsers];
    } else if (this.currRound === ROUNDS.GAME) {
      users = [...this.availableUsersForGame];
    } else {
      users = [0, 1, 2, 3];
    }
    let winner = this.getWinnerInCategory(users) % 2;
    let sum = sumArray(this.bet_coins)
    if (this.stateCategory === "accept") {
      let allIn = false;
      for (let i = 0; i < users.length; i++) {
        if (this.usersState_inCategory[users[i]].messageType === MESSAGE_TYPE.CS_ACTION_ALLIN) {
          this.mission_score[winner] += 1;
          this.endMission = true;
          allIn = true;
          this.currRound = ROUNDS.POINTS;
          console.log("ALL IN!!!!!!!!!!!!!", this.mission_score);
          // return;
        }
      }
      if (!allIn) {
        this.coins_history[this.currRound - 2][winner].end = sum;
      }
    }
    else if (this.stateCategory === "pass") {
      let pass = true;
      let allIn = false;
      for (let i = 0; i < users.length; i++) {
        if (this.usersState_inCategory[users[i]].messageType !== MESSAGE_TYPE.CS_ACTION_PASS) {
          pass = false;
        }
        if (this.usersState_inCategory[users[i]].messageType === MESSAGE_TYPE.CS_ACTION_ALLIN) {
          allIn = true;
        }
      }
      if (pass) {
        if (this.currRound === ROUNDS.BIG || this.currRound === ROUNDS.SMALL || this.currRound === ROUNDS.POINTS)
          this.coins_history[this.currRound - 2][winner].end = 1;
        // this.total_coins[winner] += 1;
        // this.total_coins[winner + 2] += 1;
      } else {
        this.coins_history[this.currRound - 2][winner].instant = (this.openBet < 2) ? 1 : sum;
        this.total_coins[winner] += (this.openBet < 2) ? 1 : sum;
        this.total_coins[winner + 2] += (this.openBet < 2) ? 1 : sum;
        ServerCommService.send(
          MESSAGE_TYPE.SC_SEND_POINT,
          {
            users: [winner, winner + 2],
            coins: this.total_coins,
            state: this.currRound,
          },
          [0, 1, 2, 3]
        );
      }
    }

    if (this.currRound === ROUNDS.EVAL_PAIRS || this.currRound === ROUNDS.PAIRS) {
      let playerPairCards = [...this.playerPairCards];
      let indexedArray;
      indexedArray = playerPairCards.map((value, index) => ({ value, index }));
      indexedArray.sort((a, b) => b.value.length - a.value.length);
      for (let i = 0; i < 4; i++) {
        let item = {
          coin: 0,
          type: "",
        };
        if (i === winner || (i + 2) === winner) {
          if (indexedArray[i].value.length === 4) {
            item.coin = 3;
            item.type = "(of duples)";
            this.coins_history[2][(indexedArray[i].index) % 2].play.push({ ...item });
          }
          else if (indexedArray[i].value.length === 3) {
            item.coin = 2;
            item.type = "(of medias)";
            this.coins_history[2][(indexedArray[i].index) % 2].play.push({ ...item });
          }
          else if (indexedArray[i].value.length === 2) {
            item.coin = 1;
            item.type = "(of pareja)";
            this.coins_history[2][(indexedArray[i].index) % 2].play.push({ ...item });
          }
        }
      }
    }
    if (this.currRound === ROUNDS.EVAL_GAME || this.currRound === ROUNDS.GAME) {
      let playersCardsSum = [...this.playersCardsSum];
      let indexedArray;
      indexedArray = playersCardsSum.map((value, index) => ({ value, index }));
      indexedArray.sort(customComparator);
      for (let i = 0; i < 4; i++) {
        let item = {
          coin: 0,
          type: "",
        };
        if (i === winner || (i + 2) === winner) {
          if (indexedArray[i].value === 31) {
            item.coin = 3;
            item.type = "(of 31)";
            this.coins_history[3][(indexedArray[i].index) % 2].play.push({ ...item });
          }
          else if (indexedArray[i].value > 31) {
            item.coin = 2;
            item.type = "(of others)";
            this.coins_history[3][(indexedArray[i].index) % 2].play.push({ ...item });
          }
        }
      }
    }

    console.log(this.coins_history);
  },

  /**
   * uesr bet actions
   */
  // Called when user accept
  accept(params, room) {
    console.log("accept: ");
    TimeoutManager.clearNextTimeout();
    const user = params.user;
    this.stateCategory = "accept";
    this.usersState_inCategory[user].messageType = MESSAGE_TYPE.CS_ACTION_ACCEPT;
    this.usersState_inCategory[user].coin = 0;
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: "Accept" }, 1);
    if (this.isEndCategory(user)) {
      this.calcCoinInCategory();
      this.startCategory();
    }
  },

  // Called when user pass
  pass(params, room) {
    console.log("pass: ");
    TimeoutManager.clearNextTimeout();
    const user = params.user;
    this.stateCategory = "pass";
    this.usersState_inCategory[user].messageType = MESSAGE_TYPE.CS_ACTION_PASS;
    this.usersState_inCategory[user].coin = 0;
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: "Pass" }, 1);
    if (this.isEndCategory(user)) {
      this.calcCoinInCategory();
      this.startCategory();
    } else {
      this.askAction(this.setNextUser(user));
    }
  },

  // Called when user envido or envido more
  envido(params, room) {
    console.log("envido: ");
    TimeoutManager.clearNextTimeout();
    const user = params.user;
    const coin = params.coin;
    this.stateCategory = "envido";
    this.envidoState = true;
    this.usersState_inCategory[user].messageType = MESSAGE_TYPE.CS_ACTION_ENVIDO;
    this.usersState_inCategory[user].coin = coin;
    this.bet_coins[user] += coin;
    this.openBet += 1;
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: "Envido " + ((coin > 2) ? coin : ""), coin }, 1);
    if (this.isEndCategory(user)) {
      // doesn't come in here
    } else {
      const nextUser = this.setNextUser(user);
      if (this.usersState_inCategory[(nextUser + 2) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS) {
        this.usersState_inCategory[(nextUser + 2) % 4].messageType = "";
        this.usersState_inCategory[(nextUser + 2) % 4].coin = 0;
      }
      this.askAction(this.setNextUser(user));
    }
  },

  // Called when user bet more
  betMore(params, room) {
    console.log("bet more: ");
    TimeoutManager.clearNextTimeout();
    const user = params.user;
    const coin = params.coin;
    this.stateCategory = "betMore";
    this.usersState_inCategory[user].messageType = MESSAGE_TYPE.CS_ACTION_BET_MORE;
    this.usersState_inCategory[user].coin = coin;
    this.bet_coins[user] += coin;
    this.openBet += 1;
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: ((coin > 1) ? coin : "") + " more", coin }, 1);
    if (this.isEndCategory(user)) {
      // doesn't come in here
    } else {
      const nextUser = this.setNextUser(user);
      if (this.usersState_inCategory[(nextUser + 2) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS) {
        this.usersState_inCategory[(nextUser + 2) % 4].messageType = "";
        this.usersState_inCategory[(nextUser + 2) % 4].coin = 0;
      }
      this.askAction(nextUser);
    }
  },

  // Called when user all in
  allIn(params, room) {
    console.log("all in: ");
    TimeoutManager.clearNextTimeout();
    const user = params.user;
    this.stateCategory = "allIn";
    this.usersState_inCategory[user].messageType = MESSAGE_TYPE.CS_ACTION_ALLIN;
    this.usersState_inCategory[user].coin = 0;
    this.openBet += 1;
    this.sendAlarmToAllUsers(MESSAGE_TYPE.SC_DO_ALARM, { user, content: "All In" }, 1);
    if (this.isEndCategory(user)) {
      // doesn't come in here
    } else {
      const nextUser = this.setNextUser(user);
      if (this.usersState_inCategory[(nextUser + 2) % 4].messageType === MESSAGE_TYPE.CS_ACTION_PASS) {
        this.usersState_inCategory[(nextUser + 2) % 4].messageType = "";
        this.usersState_inCategory[(nextUser + 2) % 4].coin = 0;
      }
      this.askAction(this.setNextUser(user));
    }
  },

  nextMission() {
    let params = { coins_history: this.coins_history, round_coins: this.round_coins, total_coins: this.total_coins, endMission: this.endMission, mission_score: this.mission_score };
    ServerCommService.send(MESSAGE_TYPE.SC_DO_END_ROUND, params, user);
    setTimeout(() => {
      this.startRound();
    }, 15)
  }
};

FakeServer.initHandlers();
setTimeout(() => {
  FakeServer.startGame();
}, 3000);
