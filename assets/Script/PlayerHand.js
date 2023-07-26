export default cc.Class({
  extends: cc.Component,

  properties: {
    cardPrefab: cc.Prefab,
    cardDom: cc.Node,

    _cardComponents: [],
    _isMine: true,
  },

  // onLoad () {},

  start() {
    this._cardComponents = [];
    this.removeAllCards();
    this.node.removeAllChildren();
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

  sortCards() {

    // Create an array to store the children of the parent node
    let childrenArray = [];

    // Iterate through the children of the parent node and add them to the array
    for (let i = 0; i < this.node.childrenCount; i++) {
      let child = this.node.children[i];
      childrenArray.push(child);
    }

    // Define a custom sorting function that compares the number parameter of two children
    function compareChildren(child1, child2) {
      let cardNum1 = child1.getComponent("Card").getCardIndex() % 12;
      let cardNum2 = child2.getComponent("Card").getCardIndex() % 12;
      let number1 = replaceByUser(cardNum1);
      let number2 = replaceByUser(cardNum2);
      return number2 - number1;  // Sort in decreasing order
    }

    function replaceByUser(num) {
      if (num === 2) {
        return 10.5;
      } else if (num === 1) {
        return 0.5;
      } else {
        return num;
      }
    }

    // Sort the array using the custom sorting function
    childrenArray.sort(compareChildren);

    // Remove all the children from the parent node
    this.node.removeAllChildren();

    // Add the sorted children back to the parent node in the desired order
    for (let i = 0; i < childrenArray.length; i++) {
      let child = childrenArray[i];
      this.node.addChild(child);
    }
  },

  addCards(cards) {
    cards.forEach((card) => {
      this.addCard(card);
    });
    this.sortCards();
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
    let card_copy = cc.instantiate(this.cardPrefab);
    let worldPosition = this.node.convertToWorldSpaceAR(card.getPosition());
    card.node.destroy();
    // this.cardDom.addChild(card_copy);
    card_copy.setPosition(worldPosition.x, worldPosition.y);
    this.cardDom.addChild(card_copy);
    const cardComponent = card_copy.getComponent("Card");
    let startPosition = this.cardDom.convertToNodeSpaceAR(worldPosition);
    card_copy.setPosition(startPosition);
    let targetPosition = cc.v2(Math.floor(Math.random() * 80) - 40, Math.floor(Math.random() * 80) - 40);
    cardComponent.flipCard();
    cardComponent.moveToPos(0.5, targetPosition.x, targetPosition.y);
    // console.log(worldPosition, startPosition, targetPosition);
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
