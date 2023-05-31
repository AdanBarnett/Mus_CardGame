cc.Class({
  extends: cc.Component,

  properties: {
    label: {
      default: null,
      type: cc.Label,
    },
    cardPrefab: cc.Prefab,
    gameAvatarPrefab: cc.Prefab,
    // defaults, set visually when attaching this script to the Canvas
    text: "Hello, World!",
  },

  // use this for initialization
  onLoad: function () {
    this.label.string = this.text;
    // this.loadCardAtlas().then(() => {
    //   console.log("window.Global", GlobalData);
    //   this.initTestCard();
    // });
    this.initGameAvatar();
  },

  initGameAvatar() {
    const gameAvatar = cc.instantiate(this.gameAvatarPrefab);
    this.node.addChild(gameAvatar);
    gameAvatar.setPosition(cc.v2(0, 0));
    gameAvatar.getComponent("GameAvatar").setPoint(3);
    gameAvatar.getComponent("GameAvatar").setName("user");
    gameAvatar.getComponent("GameAvatar").setProgress(1);
    gameAvatar.getComponent("GameAvatar").showNotify("Hello");
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
