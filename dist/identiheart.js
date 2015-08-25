/*
 * === IdentiHeart ===
 * Author: Schlipak
 * 
 * This library generates a canvas-based procedural
 * default profile picture. The generation is based
 * on the user's username, hashed into a unique string
 * to number representation.
 */
 (function() {
	// Hash generator
	var Crusher = function() {
		this.hash = function(s) {
			return String(s).split("").reduce(function(a, b) {
				a = ((a << 5) - a) + b.charCodeAt(0);
				return a & a
			}, 0);
		}
	}

	// ========================================= //
	// Class Heart
	Heart = function(c, ctx, margin, scale) {
		// Color palette
		var PALETTE = [
		'#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
		'#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
		'#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B'
		];

		// Generated colors
		this.primary;
		this.accent;

		// Drawing margin
		this.margin = margin || 5;
		// Drawing scale
		this.scale = scale || 20;
		// Computed cell size
		this.cellSize = c.width - (this.margin * this.scale)  - c.width / 2;
		// Hashed username
		this.hash;
		// Generated blocks
		this.blocks;
		// Generated shape
		this.shape;

		// Hash setter
		this.setUsername = function(string) {
			var crusher = new Crusher();
			this.hash = crusher.hash(string);
		}

		this.setPalette = function(palette) {
			if (typeof palette !== typeof [] || palette.length === undefined) {
				console.warn('The palette must be an array of color values!');
				return false;
			};
			
			if (palette.length < 2) {
				console.warn('The palette must contain at least two values!');
				return false;
			};

			PALETTE = palette;
		}

		// Main draw function
		this.draw = function() {
			this.init();

			// Rotate the canvas -45deg
			ctx.save();
			ctx.translate(c.width/2, c.height/2);
			ctx.rotate(- Math.PI / 4);
			ctx.translate(-c.width/2, -c.height/2);

			this.generateBlocks();
			this.drawBlocks();
			this.drawOutline();

			this.shape = new Shape(c, ctx, this.hash, this.primary, this.accent, {
				x: (this.margin * this.scale) + 1.5 * this.cellSize,
				y: (this.margin * this.scale) + 0.5 * this.cellSize
			}, this.scale, this.cellSize);
			this.shape.draw();

			// Restore the original matrix
			ctx.restore();
		}

		// Initializes a few parameters and clears the canvas
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
			ctx.globalCompositeOperation = "source-over";
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.globalCompositeOperation = "multiply";
		}

		// Applies an offset to the drawing to visually center it
		this.offset = function() {
			ctx.save();
			ctx.translate(0.6 * this.scale, - 0.6 * this.scale);
		}

		// Resets the offset
		this.resetOffset = function() {
			ctx.restore();
		}

		// Draws the heart outline
		this.drawOutline = function() {
			this.offset();

			// Outer lines
			ctx.beginPath();
			ctx.moveTo(this.margin * this.scale, this.margin * this.scale);
			ctx.lineTo(this.margin * this.scale, c.height - (this.margin * this.scale));
			ctx.lineTo(c.width - (this.margin * this.scale), c.height - (this.margin * this.scale));
			ctx.lineTo(c.width - (this.margin * this.scale), c.height / 2);
			ctx.lineTo(c.width / 2, c.height / 2);
			ctx.lineTo(c.width / 2, this.margin * this.scale);
			ctx.closePath();

			ctx.strokeStyle = 'black';
			ctx.lineWidth = this.scale * (500 / c.width);
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.stroke();

			// Inner lines
			ctx.beginPath();
			ctx.moveTo(c.width / 2, c.height / 2);
			ctx.lineTo(this.margin * this.scale, c.height / 2);
			ctx.moveTo(c.width / 2, c.height / 2);
			ctx.lineTo(c.width / 2, c.height - (this.margin * this.scale));

			ctx.stroke();

			this.resetOffset();
		}

		// Generates blocks
		this.generateBlocks = function() {
			var b1 = new Block(c, ctx, BlockType.ONE, this.primary, this.accent);
			b1.setHash(this.hash);
			b1.setPos({
				x: this.margin * this.scale,
				y: this.margin * this.scale
			});
			b1.setSizing(this.cellSize, this.margin, this.scale);
			this.blocks.push(b1);

			var b2 = new Block(c, ctx, BlockType.TWO, this.primary, this.accent);
			b2.setHash(this.hash);
			b2.setPos({
				x: this.margin * this.scale,
				y: c.height / 2
			});
			b2.setSizing(this.cellSize, this.margin, this.scale);
			this.blocks.push(b2);

			var b3 = new Block(c, ctx, BlockType.THREE, this.primary, this.accent);
			b3.setHash(this.hash);
			b3.setPos({
				x: c.width / 2,
				y: c.height / 2
			});
			b3.setSizing(this.cellSize, this.margin, this.scale);
			this.blocks.push(b3);
		}

		// Draws the generated blocks
		this.drawBlocks = function() {
			if (this.blocks.length == 0) {
				return false;
			}

			for (var i = 0; i < this.blocks.length; i++) {
				this.blocks[i].draw();
			}
		}
	};

	// Block type enum
	var BlockType = new function() {
		this.ONE = 1;
		this.TWO = 2;
		this.THREE = 3;
	};

	// Block class
	var Block = function(c, ctx, type, primary, accent) {
		// Type of block
		this.type = type;
		// Primary color
		this.primary = primary;
		// Accent color
		this.accent = accent;

		// Computed cell size
		this.cellSize;
		// Drawing margin
		this.margin;
		// Drawing scale
		this.scale;
		// Block position object
		this.pos;

		// Hashed username
		this.hash;

		// Hash setter
		this.setHash = function(hash) {
			this.hash = hash;
		}

		// Position setter
		this.setPos = function(pos) {
			this.pos = pos;
		}

		// Sizing setter
		this.setSizing = function(cell, marg, sc) {
			this.cellSize = cell;
			this.margin = marg;
			this.scale = sc;
		}

		// Applies an offset to the drawing
		this.offset = function() {
			ctx.save();
			ctx.translate(0.6 * this.scale, -0.6 * this.scale);
		}

		// Resets the offset
		this.resetOffset = function() {
			ctx.restore();
		}
		
		// Generates a path to draw in the block
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

		// Main draw function
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

	// Shape class
	var Shape = function(c, ctx, hash, primary, accent, pos, scale, cellSize) {
		// Hashed username
		this.hash = hash;
		//Primary color
		this.primary = primary;
		// Accent color
		this.accent = accent;
		// Position object
		this.pos = pos;
		// Scale of the drawing
		this.scale = scale;
		// Computed cell size
		this.cellSize = cellSize;
		
		// Get a color from the hash
		this.getColor = function() {
			return [this.primary, this.accent][Math.abs(this.hash % 2)];
		}
		
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

		// Main draw function
		this.draw = function() {
			var color = this.getColor();
			
			this.makePath();
			ctx.fillStyle = color;
			ctx.strokeStyle = 'black';
			ctx.lineWidth = this.scale * (400 / c.width);
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.fill();
			ctx.stroke();
		}
		
	}
}());
