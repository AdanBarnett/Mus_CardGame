export const MESSAGE_TYPE = {
  // Messages from Server to Client
  SC_SET_CARDS: "SC_SET_CARDS",
  SC_ADD_CARDS: "SC_ADD_CARDS",
  SC_DO_MUS_CLAIM: "SC_DO_MUS_CLAIM",
  SC_DO_MUS_DISCARD: "SC_DO_MUS_DISCARD",

  // Messsages from Client to Server
  CS_CLAIM_MUS: "CS_CLAIM_MUS",
  CS_DISCARD_CARDS: "CS_DISCARD_CARDS",
};

export const ROUNDS = {
  MUS_CLAIM: 0,
  MUS_DISCARD: 1,
  BIG: 2,
  SMALL: 3,
  PAIRS: 4,
  GAME: 5,
  POINTS: 6,
};
