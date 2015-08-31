IdentiHeart <img src="http://i.imgur.com/pY7MORM.png" width="40">
===========

*Identicons* are images typically generated from a user's id or hashed username, to create a default, unique image.
**IdentiHeart** is a vanilla JavaScript library, that generates procedural, canvas-based, fun identicons!
Oh, and it's also pretty fast, as in instant.

[See it in action](http://schlipak.github.io/IdentiHeart/ "Demo")

### Installation
Download or clone the IdentiHeart repository.

```
git clone https://github.com/Schlipak/IdentiHeart.git
```

You will get a folder, called `dist`, in which you can find the minified and unminified JavaScript source.
Create an HTML document, include the script, and create a `canvas` element the size you want.

``` html
<!DOCTYPE html>
<html>
<head>
	<title>Hello IdentiHeart</title>
	<script type="text/javascript" src="path/to/IdentiHeart/dist/identiheart.min.js"></script>
</head>
<body>
	<canvas id="myCanvas" height="500" width="500"></canvas>
</body>
</html>
```

**Note**: For a better render, you should use a 500*500 canvas element, then scale it to the desired size with CSS. Smaller size, typically lower than 300, may render the icon improperly. When using a different base canvas size, be sure to update the margin, scaling and stroke weight accordingly.

### Usage
IdentiHeart gives you access to a class called `IdentiHeart`. The use is pretty simple and straight-forward.

``` javascript
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var username = "Example";

var h = new IdentiHeart(c, ctx);
h.setUsername(username);
h.init();
h.draw();
```

This will generate the following image, inside the `myCanvas` element.<br />
<img src="http://i.imgur.com/PvKrQ6m.png" width="130">

### Methods
##### Constructor

```
IdentiHeart(canvas, [context, margin, scale])
```

###### Parameters
* **canvas** *DOM Element*, The canvas in which to draw.
* **context** *CanvasRenderingContext2D*, the context of the canvas.
* **margin** *number*, margin to put around the drawing. Optional, default 5.
* **scale** *number*, pixel scale factor. Optional, default 20.

###### Return value
* *IdentiHeart* this

> Constructs a new IdentiHeart object attached to the given canvas. Margins and scale factor can be optionally set to tweak the output.

---

##### setUsername

```
setUsername(string)
```

###### Parameters
* **string** *string*, the username or string to use to generate the IdentiHeart.

###### Return value
* *IdentiHeart* this

> Sets the value of the username or string to use while generating the IdentiHeart. The string is hashed automatically.

---

##### setPalette

```
setPalette(palette)
```

###### Parameters
* **palette** *array&lt;string&gt;*, an array of color values

###### Return value
* *IdentiHeart* this, on success
* *boolean* false, on failure

> Replaces the default palette used by the generator to color the IdentiHeart. The array must contain at least two colors. Colors can be represented as hex, rgb or html name.

---

##### setHasStroke

```
setHasStroke(b)
```

###### Parameters
* **b** *boolean*, the hasStroke boolean

###### Return value
* *IdentiHeart* this, on success
* *boolean* false, on failure

> Sets if the icon should be draw with a stroke. Optional, default `true`.

Example: `setHasStroke(false);`<br>
<img src="http://i.imgur.com/00cveLO.png" width="60">

---

##### setStrokeWeight

```
setStrokeWeight(weight)
```

###### Parameters
* **weight** *number*, the weight factor of the stroke

###### Return value
* *IdentiHeart* this, on success
* *boolean* false, on failure

> Sets the weight of the stroke. The value does not represent the final pixel size of the stroke but is merely a multiplication factor. Optional, default `500`.

Example: `setStrokeWeight(200);`<br>
<img src="http://i.imgur.com/KXqU2Fe.png" width="60">

---

##### setStrokeColor

```
setStrokeColor(color)
```

###### Parameters
* **color** *string*, the stroke color

###### Return value
* *IdentiHeart* this, on success
* *boolean* false, on failure

> Sets the color of the stroke. The value can be an HTML color name, or hex/rgb color value. Optional, default `#000000`.

Example: `setStrokeColor('red');`<br>
<img src="http://i.imgur.com/D2ekdN1.png" width="60">

---

##### setCompositeOperation

```
setCompositeOperation(operation)
```

###### Parameters
* **operation** *string*, the composite operation

###### Return value
* *IdentiHeart* this, on success
* *boolean* false, on failure

> Sets the composite operation that will be used by the renderer to draw the icon. Optional, default `multiply`.<br>
> Valid values:
```
'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over',
'destination-in', 'destination-out', 'destination-atop', 'lighter', 'copy',
'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge',
'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue',
'saturation', 'color', 'luminosity'
```

Example: The IdentiHeart for the string `Composite`, rendered with the default composite operation and with `color-burn`.<br>
<img src="http://i.imgur.com/p2rRkyT.png" width="60">
<img src="http://i.imgur.com/3TdFOnt.png" width="60">

**Note**: Strokes are excluded from the composite operations to avoid weird renders.

**Note**: Some of the composite operations are not implemented in all browsers. The default `multiply` operation, for example, does not work as of today in IE/Edge. This will result in IdentiHearts rendering differently depending on the user's browser.

---

##### setCanvas

```
setCanvas(canvas)
```

###### Parameters
* **canvas** *DOM Element*, the new canvas to which the IdentiHeart should attach

###### Return value
* *IdentiHeart* this, on success
* *boolean* false, on failure

> Sets a new canvas on which the IdentiHeart will be drawn. The canvas context will be updated as well. 
> This can be particularly useful when generating a great amount of different IdentiHearts on different 
> target canvases, by allowing you to generate and draw them all using he same object, thus saving resources.

---

##### init

```
init()
```
###### Parameters
*none*

###### Return value
* *IdentiHeart* this

> Initializes the IdentiHeart object and clears the canvas. 

**Note**: Be sure to always call this function before drawing or refreshing the IdentiHeart. Without it, some parts of the icon might overlap the previously generated one.

---

##### draw

```
draw()
```

###### Parameters
*none*

###### Return value
* *IdentiHeart* this

> Renders the computed IdentiHeart onto the attached canvas.
