export default cc.Class({
  extends: cc.Component,

  properties: {
    cardPrefab: cc.Prefab,

    _cardComponents: [],
    _isMine: true,
  },

  // onLoad () {},

  start() {
    this._cardComponents = [];
  },

  setMine(isMine) {
    this._isMine = isMine;
    this._cardComponents.forEach((cardComponent) => {
      cardComponent.setFront(isMine);
    });
  },

  setCards(cards) {
    this.removeAllCards();
    this.addCards(cards);
  },

  addCards(cards) {
    cards.forEach((card) => {
      this.addCard(card);
    });
  },

  addCard(cardNumber) {
    const cardNode = cc.instantiate(this.cardPrefab);
    this.node.addChild(cardNode);
    cardNode.setPosition(cc.v2(0, 0));
    const cardComponent = cardNode.getComponent("Card");
    cardComponent.setCardIndex(cardNumber);
    cardComponent.setFront(this._isMine);
    this._cardComponents.push(cardComponent);
  },

  removeCard(card) {
    const index = this._cardComponents.indexOf(card);
    if (index < 0) {
      return;
    }
    this._cardComponents.splice(index, 1);
    card.node.destroy();
    console.log("Card removed successfully", this._cardComponents);
  },

  removeCards(cards) {
    cards.forEach((card) => {
      this.removeCard(card);
    });
  },

  removeAllCards() {
    this._cardComponents.forEach((cardComponent) => {
      cardComponent.node.destroy();
    });
    this._cardComponents = [];
  },

  getSelectedCards() {
    return this._cardComponents.filter((cardComponent) => {
      return cardComponent.isSelected();
    });
  },

  setInteractable(interactable) {
    this._cardComponents.forEach((cardComponent) => {
      cardComponent.setInteractable(interactable);
    });
  },

  selectAll() {
    this._cardComponents.forEach((cardComponent) => {
      cardComponent.setSelected(true);
    });
  },

  deselectAll() {
    this._cardComponents.forEach((cardComponent) => {
      cardComponent.setSelected(false);
    });
  },

  // update (dt) {},
});
