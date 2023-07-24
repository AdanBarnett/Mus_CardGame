export const loadAvatar = (sprite, path) => {
  //   if (global.DEV_MODE) {
  //     return;
  //   }

  var myUrl = "https://cdn.torofun.com/images/avatar/users/" + path + ".png";
  var img = new Image();
  img.src = myUrl;
  img.crossOrigin = "anonymous";
  var texture = new cc.Texture2D();
  texture.initWithElement(img);
  texture.handleLoadedTexture();
  sprite.spriteFrame = new cc.SpriteFrame(texture);
};

export const loadCenterPotBackground = (sprite, name) => {
  cc.loader.loadRes('Prefab/GameScene/CenterPot/' + name + '.png', cc.SpriteFrame, function (error, spriteFrame) {
    if (error) {
      console.error('Failed to load image:', error);
      return;
    }
    sprite.spriteFrame = spriteFrame;
  });
};
