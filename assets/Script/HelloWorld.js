const GlobalData = window.GlobalData;

cc.Class({
  extends: cc.Component,

  properties: {
    label: {
      default: null,
      type: cc.Label,
    },
    cardPrefab: cc.Prefab,
    // defaults, set visually when attaching this script to the Canvas
    text: "Hello, World!",
  },

  // use this for initialization
  onLoad: function () {
    this.label.string = this.text;
    this.loadCardAtlas().then(() => {
      console.log("window.Global", GlobalData);
      this.initTestCard();
    });
  },

  loadCardAtlas: function () {
    return new Promise((resolve, reject) => {
      cc.loader.loadRes(
        "Card/cards_140x202",
        cc.SpriteAtlas,
        function (err, cardAtlas) {
          if (err) {
            console.log("Error loading card atlas", err);
            reject();
            return;
          }
          console.log("Loaded card atlas successfully!");
          GlobalData.cardAtlas = cardAtlas;
          resolve();
        }
      );
    });
  },

  initTestCard: function () {
    const card = cc.instantiate(this.cardPrefab);
    this.node.addChild(card);
    card.setPosition(cc.v2(0, 0));
    card.getComponent("Card").setCardIndex(1);
    card.getComponent("Card").setSelected(true);
    setTimeout(() => {
      card.getComponent("Card").flipCard();
    }, 1000);
  },

  // called every frame
  update: function (dt) {},
});
