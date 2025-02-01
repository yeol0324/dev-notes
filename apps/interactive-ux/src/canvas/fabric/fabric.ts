import { fabric } from "fabric";
import imgBR from "../assets/img/btn/resize.png";
import imgB from "./arrow-b.png";
import imgL from "./arrow-l.png";
import imgR from "./arrow-r.png";
import imgT from "./arrow-t.png";
import { LottiePlayer } from "lottie-web";
let maxScale = 1.5;
console.log(fabric.Object.prototype.toObject());

// fabric.Object.prototype.Lottie = (function)
// fabric.Object.prototype.toObject = (function (toObject) {
//   return function () {
//     return fabric.util.object.extend(toObject.call(this), {
//       objectId: this.objectId, //my custom property

//       _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility

//       typeTable: this.typeTable, //custom property

//       txtType: this.txtType, //custom property

//       customOptions: this.customOptions, //custom property

//       emptySeats: this.emptySeats, //custom property
//     });
//   };
// })(fabric.Object.prototype.toObject);
const Lottie = fabric.util.createClass(fabric.Image, {
  type: "croppableimage",
  initialize: function (
    LottieCanvas: fabric.Canvas,
    options: {
      objectCaching: boolean;
    },
    lottieItem: LottiePlayer
  ) {
    options = options || {};
    this.callSuper("initialize", LottieCanvas, options);
    this.LottieCanvas = LottieCanvas;
    this.lottieItem = lottieItem;
  },
  drawCacheOnCanvas: function (ctx) {
    ctx.drawImage(this.LottieCanvas, -this.width / 2, -this.height / 2);
  },
  _createCacheCanvas: function () {
    this._cacheProperties = {};
    this._cacheCanvas = this.LottieCanvas;
    console.log(this._cacheCanvas);
    this._cacheContext = this._cacheCanvas.getContext("2d");
    this.dirty = true;
  },
  play: function () {
    this.lottieItem.goToAndStop(0, true);
    this.lottieItem.play();
  },
  render: function (ctx) {
    if (this.isNotVisible()) {
      return;
    }
    if (
      this.canvas &&
      this.canvas.skipOffscreen &&
      !this.group &&
      !this.isOnScreen()
    ) {
      return;
    }
    ctx.save();
    this._setupCompositeOperation(ctx);
    this.drawSelectionBackground(ctx);
    this.transform(ctx);
    this._setOpacity(ctx);
    this._setShadow(ctx, this);
    if (this.transformMatrix) {
      // eslint-disable-next-line prefer-spread
      ctx.transform.apply(ctx, this.transformMatrix);
    }
    this.clipTo && fabric.util.clipContext(this, ctx);

    if (this.shouldCache()) {
      if (!this._cacheCanvas) {
        console.log("create cache");
        this._createCacheCanvas();
      }
      this.drawCacheOnCanvas(ctx);
    } else {
      console.log("remove cache and draw : ");
      this._removeCacheCanvas();
      this.dirty = false;
      this.drawObject(ctx);
      if (this.objectCaching && this.statefullCache) {
        this.saveState({ propertySet: "cacheProperties" });
      }
    }
    this.clipTo && ctx.restore();
    ctx.restore();
  },
  _findTargetCorner: function (pointer, forTouch) {
    // objects in group, anykind, are not self modificable,
    // must not return an hovered corner.

    const ex = pointer.x,
      ey = pointer.y,
      keys = Object.keys(this.oCoords);
    let xPoints,
      lines,
      j = keys.length - 1,
      i;
    this.__corner = 0;

    // cycle in reverse order so we pick first the one on top
    for (; j >= 0; j--) {
      i = keys[j];
      if (!this.isControlVisible(i)) {
        continue;
      }

      lines = this._getImageLines(
        forTouch ? this.oCoords[i].touchCorner : this.oCoords[i].corner
      );
      xPoints = this._findCrossPoints({ x: ex, y: ey }, lines);
      if (xPoints !== 0 && xPoints % 2 === 1) {
        this.__corner = i;
        return i;
      }
    }
    return false;
  },
});
// fabric.Object.prototype._findTargetCorner = function (pointer, forTouch) {
//   const ex = pointer.x,
//     ey = pointer.y,
//     keys = Object.keys(this.oCoords);
//   let xPoints,
//     lines,
//     j = keys.length - 1,
//     i;
//   this.__corner = 0;
//   for (; j >= 0; j--) {
//     i = keys[j];
//     if (!this.isControlVisible(i)) {
//       continue;
//     }

//     lines = this._getImageLines(
//       forTouch ? this.oCoords[i].touchCorner : this.oCoords[i].corner
//     );
//     xPoints = this._findCrossPoints({ x: ex, y: ey }, lines);
//     if (xPoints !== 0 && xPoints % 2 === 1) {
//       this.__corner = i;
//       return i;
//     }
//   }
//   return false;
// };
// fabric.Object.prototype.set({
//   borderColor: "#1e678000",
// });
// //////////////////////////
// ////////// icon //////////
// // const rotateIcon = imgfile
// const imgsR = document.createElement("img");
// const imgsT = document.createElement("img");
// const imgsL = document.createElement("img");
// const imgsB = document.createElement("img");
// const imgsBR = document.createElement("img");
// imgsR.src = imgR;
// imgsT.src = imgT;
// imgsL.src = imgL;
// imgsB.src = imgB;
// imgsBR.src = imgBR;
// fabric.Object.prototype.controls.mr = new fabric.Control({
//   x: 0.5,
//   y: 0,
//   render: function renderIconsR(ctx, left, top, styleOverride, fabricObject) {
//     const size = this.cornerSize;
//     ctx.save();
//     ctx.translate(left, top);
//     ctx.drawImage(imgsR, -size / 2, -size / 2, size, size);
//     ctx.restore();
//   },
//   cornerSize: 28,
// });
// fabric.Object.prototype.controls.mt = new fabric.Control({
//   x: 0,
//   y: -0.5,
//   render: function renderIconsT(ctx, left, top, styleOverride, fabricObject) {
//     const size = this.cornerSize;
//     ctx.save();
//     ctx.translate(left, top);
//     ctx.drawImage(imgsT, -size / 2, -size / 2, size, size);
//     ctx.restore();
//   },
//   cornerSize: 28,
// });
// fabric.Object.prototype.controls.ml = new fabric.Control({
//   x: -0.5,
//   y: 0,
//   render: function renderIconsL(ctx, left, top, styleOverride, fabricObject) {
//     const size = this.cornerSize;
//     ctx.save();
//     ctx.translate(left, top);
//     ctx.drawImage(imgsL, -size / 2, -size / 2, size, size);
//     ctx.restore();
//   },
//   cornerSize: 28,
// });
// fabric.Object.prototype.controls.mb = new fabric.Control({
//   x: 0,
//   y: 0.5,
//   render: function renderIconsB(ctx, left, top, styleOverride, fabricObject) {
//     const size = this.cornerSize;
//     ctx.save();
//     ctx.translate(left, top);
//     ctx.drawImage(imgsB, -size / 2, -size / 2, size, size);
//     ctx.restore();
//   },
//   cornerSize: 28,
// });
// fabric.Object.prototype.controls.br = new fabric.Control({
//   x: 0.5,
//   y: 0.5,
//   actionHandler: fabric.controlsUtils.scalingEqually,
//   actionName: "scale",
//   render: function renderIconsBR(ctx, left, top, styleOverride, fabricObject) {
//     const size = this.cornerSize;
//     ctx.save();
//     ctx.translate(left, top);
//     ctx.drawImage(imgsBR, -size / 2, -size / 2, size, size);
//     ctx.restore();
//   },
//   cornerSize: 28,
// });

export default Lottie;
