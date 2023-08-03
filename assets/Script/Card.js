import GlobalData from "./Common/GlobalData";

cc.Class({
  extends: cc.Component,

  properties: {
    mainButton: cc.Button,
    frontSprite: cc.Sprite,
    backSprite: cc.Sprite,
    groupSprite: cc.Sprite,
    highlightSprite: cc.Sprite,

    _color: [],
    _number: [],
    _index: [],
    _isActionCard: [],
    _isFront: [],
    _group: [],
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.backSprite.spriteFrame =
      GlobalData.cardAtlas.getSpriteFrame("cards-back");
    this.highlightSprite.spriteFrame =
      GlobalData.cardAtlas.getSpriteFrame("0highlight");
    this.groupSprite.spriteFrame =
      GlobalData.cardAtlas.getSpriteFrame("0group");

    this.setSelected(false);
    this.setGroup(-1);
  },

  setInteractable(interactable) {
    this.mainButton.interactable = interactable;
  },

  isSelected() {
    return this.highlightSprite.node.active;
  },

  setSelected(highlight) {
    this.highlightSprite.node.active = highlight;
    const pos = this.getPosition();
    if (this.isSelected() === true) {
      this.moveToPos(0.1, pos.x, 10);
    } else {
      this.moveToPos(0.1, pos.x, 0);
    };
  },

  isFront() {
    return this._isFront;
  },

  setFront(isFront) {
    this._isFront = isFront;
    if (isFront) {
      this.frontSprite.node.setScale(1, 1);
      this.backSprite.node.setScale(0, 1);
    } else {
      this.frontSprite.node.setScale(0, 1);
      this.backSprite.node.setScale(1, 1);
      this.setSelected(false);
    }
  },

  getGroup() {
    return this._group;
  },

  setGroup(group) {
    if (group > 0) {
      this.groupSprite.node.active = true;
    } else {
      this.groupSprite.node.active = false;
    }
    this._group = group;
  },

  getCardIndex() {
    return this._index;
  },

  setCardIndex(index) {
    this._index = index;
    this._color = index / 12;
    this._number = index % 12;
    if (this._number > 7) {
      this._isActionCard = true;
    } else {
      this._isActionCard = false;
    }

    var spriteName = "cards-" + this._index;
    this.frontSprite.getComponent(cc.Sprite).spriteFrame =
      GlobalData.cardAtlas.getSpriteFrame(spriteName);

    this.setFront(true);
  },

  getScale() {
    return this.node.scale;
  },

  setScale(scale) {
    this.node.scale = scale;
  },

  setRotation(rotation) {
    this.node.angle = rotation;
  },

  getPosition() {
    return this.node.position;
  },

  moveToPos(d, x, y) {
    // console.log(this.node);
    this.node.stopAllActions();
    cc.tween(this.node)
      .to(d, { x: x, y: y })
      .start();
  },

  flipCard() {
    this.setSelected(false);
    if (this._isFront) {
      this.frontSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
      this.backSprite.node.runAction(
        cc.sequence(new cc.delayTime(0.2), new cc.scaleTo(0.2, 1, 1))
      );
      this._isFront = false;
    } else {
      this.backSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
      this.frontSprite.node.runAction(
        cc.sequence(new cc.delayTime(0.2), new cc.scaleTo(0.2, 1, 1))
      );
      this._isFront = true;
    }
  },

  isPtInCard(x, y) {
    var width = this.node.width * this.node.scale;
    var height = this.node.height * this.node.scale;
    var left = this.node.position.x - width / 2;
    var right = this.node.position.x + width / 2;
    var top = this.node.position.y - height / 2;
    var bottom = this.node.position.y + height / 2;
    if (x >= left && x <= right && y >= top && y <= bottom) {
      return true;
    }
    return false;
  },

  onUserClick() {
    // console.log(this.getCardIndex());
    this.setSelected(!this.isSelected());
    // const pos = this.getPosition();
    // if (this.isSelected() === true) {
    //   this.moveToPos(0.1, pos.x, pos.y + 10);
    // } else {
    //   this.moveToPos(0.1, pos.x, pos.y - 10);
    // };
  },

  start() { },

  // update (dt) {},
});
