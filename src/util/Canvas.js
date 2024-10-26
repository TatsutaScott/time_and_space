import IMG from "./IMG";
import Vector from "./Vector";

class Canvas {
  constructor(DOM, width, height) {
    if (DOM.tagName == "CANVAS" || DOM instanceof OffscreenCanvas) {
      this.canvas = DOM;
    } else {
      this.canvas = document.createElement("canvas"); //Creates the canvas DOM element
      DOM.appendChild(this.canvas); //Appends the canvas DOM element to a parent element
    }

    this.canvas.width = this.width = width; //Sets canvas width
    this.canvas.height = this.height = height; //Sets canvas height
    this.getCenter();
    this.ctx = this.canvas.getContext("2d"); //Gets the drawing context from the DOM element
  }
}

/**calculates the position of the center of the canvas*/
Canvas.prototype.getCenter = function () {
  this.center = { x: this.width / 2, y: this.height / 2 };
};

/** sets the dimensions of the canvas
 * @param {number} width - width value in pixels
 * @param {number} height - height value in pixels
 */
Canvas.prototype.setDimensions = function (width, height) {
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;
};

/**Download an image of the canvas
 * @param {String} name - name for the downloaded image file
 * @param {String} [type='png'] - file format. options: png, jpeg, webp
 */
Canvas.prototype.download = function (name, type = "png") {
  console.log(this.display);
  const link = document.createElement("a");
  link.download = name + "." + type;
  link.href = this.canvas.toDataURL(`image/${type}`);
  link.click();
};

/**Sets the background of the canvas
 * @param {String} color - color to set background to
 */
Canvas.prototype.background = function (color) {
  this.ctx.fillStyle = color;
  this.ctx.fillRect(0, 0, this.width, this.height);
};

/**Draws a shape
 * @param {Path2D} path - Path2D object representing a shape
 * @param {String} fill - color to use for fill (if null, no fill)
 * @param {String} stroke - color to use for stroke (if null, no stroke)
 */
Canvas.prototype.shape = function (path, fill, stroke) {
  this.ctx.save();

  if (fill) {
    this.ctx.fillStyle = fill;
    this.ctx.fill(path);
  }
  if (stroke) {
    this.ctx.strokeStyle = stroke;
    this.ctx.stroke(path);
  }

  this.ctx.restore();
};

/**Copy a canvas
 * @param {Canvas} source - Canvas object to copy from
 * @param {Boolean} scale - whether or not to scale the canvas
 */
Canvas.prototype.copy = function (source, scale = true) {
  const src = source instanceof Canvas ? source.canvas : source;
  if (scale) {
    this.ctx.drawImage(src, 0, 0, this.width, this.height);
  } else {
    this.ctx.drawImage(src, 0, 0);
  }
};

/**makes the canvas fullscreen*/
Canvas.prototype.fullScreen = function () {
  this.canvas.style.position = "absolute";
  this.canvas.style.left = 0;
  this.canvas.style.top = 0;
  this.canvas.width = this.width = window.innerWidth;
  this.canvas.height = this.height = window.innerHeight;
  this.getCenter();
};

/**
 * @typedef {Object} Color_stop
 * @property {Number} pos - position of the color in the array (0 - 1)
 * @property {String} color - color of the stop in string form i.e. 'rgba(23, 50, 28, 0.4)'
 */
/**
 * @typedef {Object} Gradient_settings
 * @property {Number} x0 - starting x-value for gradient
 * @property {Number} y0 - starting y-value for gradient
 * @property {Number} x1 - starting x-value for gradient
 * @property {Number} y1 - starting y-value for gradient
 * @property {Vector} start - starting position for gradient
 * @property {Vector} end - ending position for gradient
 * @property {[Color_stop]} colors - array of colors and positions in the gradient
 */
/**function to generate a linear gradient
 * @param {Gradient_settings} settings - Defines the gradient, including information about start, stop, and colors
 * @returns {CanvasGradient} - object representing a gradient
 */
Canvas.prototype.gradient = function (settings) {
  let gradient;
  if (settings.start && settings.end) {
    gradient = this.ctx.createLinearGradient(
      settings.start.x,
      settings.start.y,
      settings.end.x,
      settings.end.y
    );
  } else if (settings.x0 && settings.x1 && settings.y0 && settings.y1) {
    gradient = this.ctx.createLinearGradient(
      settings.x0,
      settings.y0,
      settings.x1,
      settings.y1
    );
  }

  settings.colors.forEach((c) => gradient.addColorStop(c.pos, c.color));

  return gradient;
};

/**Simplified version of CanvasRenderingContext2D: drawImage()
 * Simple version, xy-position no scaling
 * @param {Image} image - image to be copied
 * @param {Number} x - Destination X position
 * @param {Number} y - Destination y position
 * @return {void}
 */
/**
 * @overload
 * xy-position with scaling
 * @param {Image} image - image to be copied
 * @param {Number} x - Destination X position
 * @param {Number} y - Destination y position
 * @param {Number} w - Destination width
 * @param {Number} h - Destination height
 * @return {void}
 */
/**
 * @overload
 * Image source clip with xy-position and scaling
 * @param {Image} image - image to be copied
 * @param {Number} sx - source X position
 * @param {Number} sy - source y position
 * @param {Number} sw - source width
 * @param {Number} sh - source height
 * @param {Number} dx - Destination X position
 * @param {Number} dy - Destination y position
 * @param {Number} dw - Destination width
 * @param {Number} dh - Destination height
 * @return {void}
 */
Canvas.prototype.image = function (image, v1, v2, v3, v4, v5, v6, v7, v8) {
  if (image instanceof IMG) {
    image = image.image;
  }
  if (!(image instanceof Image)) return;
  if (v8) {
    this.ctx.drawImage(image, v1, v2, v3, v4, v5, v6, v7, v8);
  } else if (v4) {
    this.ctx.drawImage(image, v1, v2, v3, v4);
  } else {
    this.ctx.drawImage(image, v1, v2);
  }
};

/**Returns the image data of the canvas
 * @returns {ImageData} - ImageData from the canvas
 */
Canvas.prototype.getImage = function () {
  const img_holder = document.createElement("canvas");
  img_holder.width = this.width;
  img_holder.height = this.height;
  const context = img_holder.getContext("2d");
  context.drawImage(this.canvas, 0, 0);
  return img_holder;
};

/**Saves the state of the canvas transformations and colors */
Canvas.prototype.save = function () {
  this.ctx.save();
};

/**resets the state of the canvas transformations and colors */
Canvas.prototype.restore = function () {
  this.ctx.restore();
};

/**
 * scales the canvas
 * @param {Number} x  - x scale factor
 * @param {Number} y  - y scale factor
 */
Canvas.prototype.scale = function (x, y) {
  this.ctx.scale(x, y);
};
export default Canvas;
