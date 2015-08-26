/**
 * @name IdentiHeart
 * @author Schlipak
 * @copyright Apache license 2015 Guillaume de Matos
 */
 (function() {
	/**
	 * @class Crusher
	 * @private
	 * @constructor
	 * @this {Crusher}
	 */
	var Crusher = function() {
		/**
		 * Hashes the given string
		 * @public
		 * @param  {String} s The string to hash
		 * @return {Number} The hash
		 */
		this.hash = function(s) {
			return String(s).split("").reduce(function(a, b) {
				a = ((a << 5) - a) + b.charCodeAt(0);
				return a & a
			}, 0);
		}

		/**
		 * Tests if the given object is a DOM Element
		 * @param  {mixed} o An object or variable
		 * @return {Boolean}
		 */
		this.isDOMElement = function(o) {
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement :
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		}
	}

	/**
	 * @class Heart
	 * @public
	 * @constructor
	 * @this {Heart}
	 * @param {DOM Element} c The canvas onto which the IdentiHeart is drawn
	 * @param {CanvasRenderingContext2D} ctx The 2D context of the canvas
	 * @param {Number} margin The margin to draw around the icon. Optional, default 5
	 * @param {Number} scale The scale factor of the drawing. Optional, default 20
	 */
	Heart = function(c, ctx, margin, scale) {
		/**
		 * The color palette used by the renderer to draw the icon
		 * @private
		 * @type {Array<String>}
		 */
		var PALETTE = [
			'#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
			'#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
			'#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B'
		];

		/**
		 * The canvas DOM Element onto which the IdentiHeart is drawn
		 * @private
		 * @type {DOM Element}
		 */
		this.canvas = c;

		/**
		 * The 2D context of the canvas
		 * @private
		 * @type {CanvasRenderingContext2D}
		 */
		this.context = ctx;

		/**
		 * The primary color
		 * @private
		 * @type {String}
		 */
		this.primary;

		/**
		 * The accent color
		 * @private
		 * @type {String}
		 */
		this.accent;

		/**
		 * The margin to put around the drawing
		 * @private
		 * @type {Number}
		 * @default 5
		 */
		this.margin = margin || 5;

		/**
		 * The scale factor of the drawing
		 * @private
		 * @type {Number}
		 * @default 20
		 */
		this.scale = scale || 20;

		/**
		 * The computed cell size
		 * @private
		 * @type {Number}
		 */
		this.cellSize = (this.canvas.width / 2) - (this.margin * this.scale);
		
		/**
		 * The hashed username / input string
		 * @private
		 * @type {Number}
		 */
		this.hash;

		/**
		 * The generated blocks
		 * @private
		 * @type {Array<Block>}
		 */
		this.blocks;
		
		/**
		 * The generated shape
		 * @private
		 * @type {Shape}
		 */
		this.shape;

		/**
		 * Makes the drawing stroked or not
		 * @private
		 * @type {Boolean}
		 */
		this.hasStroke = true;
		
		/**
		 * The stroke weight
		 * @private
		 * @type {Number}
		 * @default 500
		 */
		this.strokeWeight = 500;

		/**
		 * The composite operation used by the renderer
		 * @private
		 * @type {String}
		 * @default 'multiply'
		 */
		this.compositeOperation = 'multiply';

		/**
		 * Sets the username or string to generate the drawing from
		 * @public
		 * @param {String}
		 */
		this.setUsername = function(string) {
			var crusher = new Crusher();
			this.hash = crusher.hash(string);
		}

		/**
		 * Sets the palette used by the renderer
		 * @public
		 * @param {Array<String>}
		 * @optional
		 * @returns {mixed} false on failure
		 */
		this.setPalette = function(palette) {
			if (typeof palette !== typeof [] || palette.length === undefined) {
				console.warn('The palette must be an array of color values.');
				return false;
			};
			
			if (palette.length < 2) {
				console.warn('The palette must contain at least two values.');
				return false;
			};

			PALETTE = palette;
		}

		/**
		 * Sets if the drawing should be stroked
		 * @public
		 * @param {Boolean} b The state of the stroke
		 * @optional
		 * @default true
		 * @returns {mixed} false on failure
		 */
		this.setHasStroke = function(b) {
			if (typeof b !== 'boolean') {
				console.warn('The parameter for the function Heart.setHasStroke() must be a boolean.');
				return false;
			};

			this.hasStroke = b;
		}

		/**
		 * Sets the stroke weight of the drawing<br>
		 * The value does not correspond to the final pixel size, 
		 * but is merely a multiplicative factor
		 * @public
		 * @param {Number} weight The weight factor of the stroke
		 * @optional
		 * @default 500
		 * @returns {mixed} false on failure
		 */
		this.setStrokeWeight = function(weight) {
			if (typeof weight !== 'number') {
				console.warn('The parameter for the function Heart.setStrokeWeight() must be a number.');
				return false;
			};

			this.strokeWeight = weight;
		}

		/**
		 * Sets the composite operation used by the renderer
		 * @public
		 * @param {String} operation The composite operation
		 * @optional
		 * @default 'multiply'
		 * @returns {mixed} false on failure
		 */
		this.setCompositeOperation = function(operation) {
			var validOperations = [
				'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over',
				'destination-in', 'destination-out', 'destination-atop', 'lighter', 'copy',
				'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge',
				'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue',
				'saturation', 'color', 'luminosity'
			];

			operation = operation.toLowerCase();
			if (validOperations.indexOf(operation) === -1) {
				console.warn('The provided composite operation "'+operation+'" does not exist.');
				return false;
			};

			this.compositeOperation = operation;
		}

		/**
		 * Updates the attached canvas<br>
		 * This can be useful to render a big amount of different icons without 
		 * creating new instances of IdentiHeart, thus saving resources<br>
		 * This function also updates the context of the canvas
		 * @public
		 * @optional
		 * @param {DOM Element} c The canvas to attach to the IdentiHeart
		 */
		this.setCanvas = function(canvas) {
			var crusher = new Crusher();
			if (!crusher.isDOMElement(c)) {
				console.warn('The parameter for the function IdentiHeart.setCanvas() must be a DOM Element.');
				return false;
			};

			if (c.tagName !== 'CANVAS') {
				console.warn('The parameter for the function IdentiHeart.setCanvas() must be a <canvas> element.');
				return false;
			};

			this.canvas = canvas;
			this.context = canvas.getContext('2d');
		}

		/**
		 * The main drawing function<br>
		 * Renders the IdentiHeart onto the canvas<br>
		 * init() must be manually called before each render
		 * @public
		 * @see Heart.init()
		 * @required
		 */
		this.draw = function() {
			this.init();

			// Rotate the canvas -45deg
			this.context.save();
			this.context.translate(c.width/2, c.height/2);
			this.context.rotate(- Math.PI / 4);
			this.context.translate(-c.width/2, -c.height/2);

			this.generateBlocks();
			this.drawBlocks();

			if (this.hasStroke) {
				this.drawOutline();
			};

			this.shape = new Shape(this.canvas, this.context, this.hash, this.primary, this.accent, {
				x: (this.margin * this.scale) + 1.5 * this.cellSize,
				y: (this.margin * this.scale) + 0.5 * this.cellSize
			}, this.scale, this.cellSize);
			this.shape.draw(this.hasStroke, this.strokeWeight);

			// Restore the original matrix
			this.context.restore();
		}

		/**
		 * Initializes the IdentiHeart and clears the canvas<br>
		 * Must be called before draw()
		 * @public
		 * @see Heart.draw()
		 * @required
		 */
		this.init = function() {
			// Purge the block array
			this.blocks = new Array();
			// Purge the shape
			this.shape = null;

			// Generate colors
			this.primary = PALETTE[Math.abs(this.hash % PALETTE.length)];
			var crusher = new Crusher();
			var subHash = crusher.hash(this.hash);
			this.accent = PALETTE[Math.abs(subHash % PALETTE.length)];

			// Clear the canvas
			this.context.globalCompositeOperation = "source-over";
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.globalCompositeOperation = this.compositeOperation;
		}

		/**
		 * Applies an offset to the canvas
		 * @private
		 */
		this.offset = function() {
			this.context.save();
			this.context.translate(0.6 * this.scale, - 0.6 * this.scale);
		}

		/**
		 * Resets the offset
		 * @private
		 */
		this.resetOffset = function() {
			this.context.restore();
		}

		/**
		 * Draws the IdentiHeart outline
		 * @private
		 */
		this.drawOutline = function() {
			this.offset();
			this.context.globalCompositeOperation = "source-over";

			// Outer lines
			this.context.beginPath();
			this.context.moveTo(this.margin * this.scale, this.margin * this.scale);
			this.context.lineTo(this.margin * this.scale, this.canvas.height - (this.margin * this.scale));
			this.context.lineTo(this.canvas.width - (this.margin * this.scale), this.canvas.height - (this.margin * this.scale));
			this.context.lineTo(this.canvas.width - (this.margin * this.scale), this.canvas.height / 2);
			this.context.lineTo(this.canvas.width / 2, this.canvas.height / 2);
			this.context.lineTo(this.canvas.width / 2, this.margin * this.scale);
			this.context.closePath();

			this.context.strokeStyle = 'black';
			this.context.lineWidth = this.scale * (this.strokeWeight / this.canvas.width);
			this.context.lineJoin = "round";
			this.context.lineCap = "round";
			this.context.stroke();

			// Inner lines
			this.context.beginPath();
			this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
			this.context.lineTo(this.margin * this.scale, this.canvas.height / 2);
			this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
			this.context.lineTo(this.canvas.width / 2, this.canvas.height - (this.margin * this.scale));

			this.context.stroke();

			this.resetOffset();
			this.context.globalCompositeOperation = this.compositeOperation;
		}

		/**
		 * Generates the blocks of this Heart
		 * @private
		 */
		this.generateBlocks = function() {
			var b1 = new Block(this.canvas, this.context, BlockType.ONE, this.primary, this.accent);
			b1.setHash(this.hash);
			b1.setPos({
				x: this.margin * this.scale,
				y: this.margin * this.scale
			});
			b1.setSizing(this.cellSize, this.margin, this.scale);
			this.blocks.push(b1);

			var b2 = new Block(this.canvas, this.context, BlockType.TWO, this.primary, this.accent);
			b2.setHash(this.hash);
			b2.setPos({
				x: this.margin * this.scale,
				y: this.canvas.height / 2
			});
			b2.setSizing(this.cellSize, this.margin, this.scale);
			this.blocks.push(b2);

			var b3 = new Block(this.canvas, this.context, BlockType.THREE, this.primary, this.accent);
			b3.setHash(this.hash);
			b3.setPos({
				x: this.canvas.width / 2,
				y: this.canvas.height / 2
			});
			b3.setSizing(this.cellSize, this.margin, this.scale);
			this.blocks.push(b3);
		}

		/**
		 * Draws the generated blocks
		 * @private
		 */
		this.drawBlocks = function() {
			if (this.blocks.length == 0) {
				return false;
			}

			for (var i = 0; i < this.blocks.length; i++) {
				this.blocks[i].draw();
			}
		}
	};

	/**
	 * @class BlockType
	 * @enum {Number}
	 */
	var BlockType = new function() {
		this.ONE = 1;
		this.TWO = 2;
		this.THREE = 3;
	};

	/**
	 * @class Block
	 * @private
	 * @this {Block}
	 * @constructor
	 * @param {DOM Element} c The canvas
	 * @param {CanvasRenderingContext2D} ctx The 2D context of the canvas
	 * @param {BlockType} type The type of block to generate
	 * @param {String} primary The primary color
	 * @param {String} accent The accent color
	 */
	var Block = function(c, ctx, type, primary, accent) {
		/**
		 * The type of block to generate
		 * @private
		 * @type {BlockType}
		 */
		this.type = type;

		/**
		 * The primary color
		 * @private
		 * @type {String}
		 */
		this.primary = primary;
		
		/**
		 * The accent color
		 * @private
		 * @type {String}
		 */
		this.accent = accent;

		/**
		 * The computed cell size
		 * @private
		 * @type {Number}
		 */
		this.cellSize;
		
		/**
		 * The margin to put around the drawing
		 * @private
		 * @type {Number}
		 */
		this.margin;

		/**
		 * The drawing scale factor
		 * @private
		 * @type {Number}
		 */
		this.scale;

		/**
		 * The position of the block
		 * @private
		 * @type {Object}
		 */
		this.pos;

		/**
		 * The hashed username
		 * @private
		 * @type {Number}
		 */
		this.hash;

		/**
		 * Sets the hash to use to generate the block
		 * @public
		 * @required
		 * @param {Number} hash The hash
		 * @returns {mixed} false on failure
		 */
		this.setHash = function(hash) {
			if (typeof hash !== 'number') {
				console.warn('The provided hash must be a number.');
				return false;
			};

			this.hash = hash;
		}

		/**
		 * Sets the position of the block
		 * @public
		 * @required
		 * @param {Object} pos The position object
		 * @returns {mixed} false on failure
		 */
		this.setPos = function(pos) {
			if (typeof pos !== 'object') {
				console.warn('The position must be an object.');
				return false;
			};

			this.pos = pos;
		}

		/**
		 * Sets various sizing factors
		 * @public
		 * @optional
		 * @param {Number} cell The cell size
		 * @param {Number} marg The margin
		 * @param {Number} sc The scale factor
		 * @returns {mixed} false on failure
		 */
		this.setSizing = function(cell, marg, sc) {
			if (typeof cell !== 'number' ||
				typeof marg !== 'number' ||
				typeof sc !== 'number') {
				console.warn('Sizing parameters must be numbers.');
				return false;
			};

			this.cellSize = cell;
			this.margin = marg;
			this.scale = sc;
		}

		/**
		 * Applies an offset to the drawing
		 * @private
		 */
		this.offset = function() {
			ctx.save();
			ctx.translate(0.6 * this.scale, -0.6 * this.scale);
		}

		/**
		 * Resets the offset
		 * @private
		 */
		this.resetOffset = function() {
			ctx.restore();
		}
		
		/**
		 * Generates a path to draw in the block
		 * @private
		 * @param {Number} hash The hash
		 * @param {Number} offset An offset to apply to the procedural generation
		 */
		this.makePath = function(hash, offset) {
			var mod = Math.abs(hash + offset) % 4;
			
			switch(mod) {
				case 0:
					// top
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x + this.cellSize, this.pos.y);
					ctx.lineTo(this.pos.x + this.cellSize, this.pos.y + this.cellSize);
					ctx.closePath();
				break;
				case 1:
					// right
					ctx.beginPath();
					ctx.moveTo(this.pos.x + this.cellSize, this.pos.y);
					ctx.lineTo(this.pos.x + this.cellSize, this.pos.y + this.cellSize);
					ctx.lineTo(this.pos.x, this.pos.y + this.cellSize);
					ctx.closePath();
				break;
				case 2:
					// bottom
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x, this.pos.y + this.cellSize);
					ctx.lineTo(this.pos.x + this.cellSize, this.pos.y + this.cellSize);
					ctx.closePath();
				break;
				case 3:
					// left
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x + this.cellSize, this.pos.y);
					ctx.lineTo(this.pos.x, this.pos.y + this.cellSize);
					ctx.closePath();
				break;
				default:
					// top
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x + this.cellSize, this.pos.y);
					ctx.lineTo(this.pos.x, this.pos.y + this.cellSize);
					ctx.closePath();
			}
		}

		/**
		 * Draws the block
		 * @public
		 */
		this.draw = function() {
			this.offset();

			if (this.type === BlockType.ONE) {
				this.makePath(this.hash, this.hash % 3);
				ctx.fillStyle = this.primary;
				ctx.fill();

				this.makePath(this.hash, this.hash % 5);
				ctx.fillStyle = this.accent;
				ctx.fill();
			} else if (this.type === BlockType.TWO) {
				this.makePath(this.hash, this.hash % 4);
				ctx.fillStyle = this.accent;
				ctx.fill();

				this.makePath(this.hash, this.hash % 3);
				ctx.fillStyle = this.primary;
				ctx.fill();
			} else {
				this.makePath(this.hash, this.hash % 7);
				ctx.fillStyle = this.accent;
				ctx.fill();

				this.makePath(this.hash, this.hash % 8);
				ctx.fillStyle = this.primary;
				ctx.fill();
			}

			this.resetOffset();
		}
	};

	/**
	 * @class Shape
	 * @private
	 * @constructor
	 * @this {Shape}
	 * @param {DOM Element} c The canvas
	 * @param {CanvasRenderingContext2D} ctx The 2D context of the canvas
	 * @param {Number} hash The hash used for the generation
	 * @param {String} primary The primary color
	 * @param {String} accent The accent color
	 * @param {Object} pos The position of the shape
	 * @param {Number} scale The scale factor of the drawing
	 * @param {Number} cellSize The computed cell size
	 */
	var Shape = function(c, ctx, hash, primary, accent, pos, scale, cellSize) {
		/**
		 * The hashed username / string to use to generate the shape
		 * @private
		 * @type {Number}
		 */
		this.hash = hash;
		
		/**
		 * The primary color
		 * @private
		 * @type {String}
		 */
		this.primary = primary;
		
		/**
		 * The accent color
		 * @private
		 * @type {String}
		 */
		this.accent = accent;
		
		/**
		 * The position of the shape
		 * @private
		 * @type {Object}
		 */
		this.pos = pos;
		
		/**
		 * The scale factor of the drawing
		 * @private
		 * @type {Number}
		 */
		this.scale = scale;
		
		/**
		 * The computed cell size
		 * @private
		 * @type {Number}
		 */
		this.cellSize = cellSize;
		
		/**
		 * Returns a color among the primary and accent color, 
		 * based on the hash
		 * @private
		 * @return {String}
		 */
		this.getColor = function() {
			return [this.primary, this.accent][Math.abs(this.hash % 2)];
		}
		
		/**
		 * Generates a path to draw the shape
		 * @private
		 */
		this.makePath = function() {
			var mod = Math.abs(this.hash + 1) % 4;
			
			switch(mod) {
				case 0:
					// square
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x + (this.cellSize / 2), this.pos.y);
					ctx.lineTo(this.pos.x + (this.cellSize / 2), this.pos.y - (this.cellSize / 2));
					ctx.lineTo(this.pos.x, this.pos.y - (this.cellSize / 2));
					ctx.closePath();
				break;
				case 1:
					//circle
					ctx.beginPath();
					ctx.arc(
						this.pos.x + (this.cellSize / Math.PI) - 5,
						this.pos.y - (this.cellSize / Math.PI) + 5,
						this.cellSize / 3,
						0,
						Math.PI * 2,
						true
					);
				break;
				case 2:
					// triangle
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x + (this.cellSize * 0.65), this.pos.y);
					ctx.lineTo(this.pos.x, this.pos.y - (this.cellSize * 0.65));
					ctx.closePath();
				break;
				case 3:
					// oval
					ctx.beginPath();
					ctx.moveTo(this.pos.x - (this.cellSize * 0.2), this.pos.y + (this.cellSize * 0.2));
					ctx.quadraticCurveTo(this.pos.x + (this.cellSize * 0.4), this.pos.y, this.pos.x + (this.cellSize * 0.5), this.pos.y - (this.cellSize * 0.5));
					ctx.moveTo(this.pos.x + (this.cellSize * 0.5), this.pos.y - (this.cellSize * 0.5));
					ctx.quadraticCurveTo(this.pos.x , this.pos.y - (this.cellSize * 0.4), this.pos.x - (this.cellSize * 0.2), this.pos.y + (this.cellSize * 0.2));
				break;
				default:
					//square
					ctx.beginPath();
					ctx.moveTo(this.pos.x, this.pos.y);
					ctx.lineTo(this.pos.x + (this.cellSize / 2), this.pos.y);
					ctx.lineTo(this.pos.x + (this.cellSize / 2), this.pos.y - (this.cellSize / 2));
					ctx.lineTo(this.pos.x, this.pos.y - (this.cellSize / 2));
					ctx.closePath();
				}
			}

		/**
		 * Draws the shape on the canvas
		 * @public
		 * @param  {Boolean} hasStroke The hasStroke boolean
		 * @param  {Number} strokeWeight The weight of the stroke
		 */
		this.draw = function(hasStroke, strokeWeight) {
			var color = this.getColor();
			ctx.globalCompositeOperation = "source-over";
			
			this.makePath();
			ctx.fillStyle = color;
			ctx.strokeStyle = 'black';
			ctx.lineWidth = this.scale * ((4/5 * strokeWeight) / c.width);
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.fill();

			if (hasStroke) {
				ctx.stroke();
			};
		}
	};
}());
