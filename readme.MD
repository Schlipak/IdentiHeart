IdentiHeart <img src="./img/identiheart.png" width="40">
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
	<script type="text/javascript" src="lib/identiheart.min.js"></script>
</head>
<body>
	<canvas id="myCanvas" height="100" width="100"></canvas>
</body>
</html>
```

### Usage
IdentiHeart gives you access to a class called `Heart`. The use is pretty simple and straight-forward.

``` javascript
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var username = "Example";

var h = new Heart(c, ctx);
h.setUsername(username);
h.init();
h.draw();
```

This will generate the following image, inside the `myCanvas` element.<br />
<img src="./img/example.png" width="130">

### Methods
##### Constructor

```
Heart(canvas, context, [margin, scale])
```

* **canvas** *DOM Element*, The canvas in which to draw.<br/>
* **context** *CanvasRenderingContext2D*, the context of the canvas.<br/>
* **margin** *number*, margin to put around the drawing. Optional, default 5.<br/>
* **scale** *number*, pixel scale factor. Optional, default 20.

> Constructs a new Heart object attached to the given canvas. Margins and scale factor can be optionally set to tweak the output.

##### setUsername

```
setUsername(string)
```

* **string** *string*, the username or string to use to generate the IdentiHeart.

> Sets the value of the username or string to use while generating the IdentiHeart. The string is hashed automatically.

##### setPalette

```
setPalette(palette)
```

* **palette** *array&lt;string&gt;*, an array of color values

> Replaces the default palette used by the generator to color the IdentiHeart. The array must contain at least two colors. Colors can be represented as hex, rgb or html name.

##### Init

```
init()
```

> Initializes the Heart object and clears the canvas. Must be always called before drawing or refreshing the IdentiHeart.

##### Draw

```
draw()
```

> Renders the computed IdentiHeart onto the attached canvas.