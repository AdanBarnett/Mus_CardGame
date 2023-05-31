import GlobalData from "./Common/GlobalData";

export const loadCardAtlas = () => {
  return new Promise((resolve, reject) => {
    cc.loader.loadRes(
      "Prefab/Card/cards_130x192",
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
};
