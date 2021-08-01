# photoviewer
A simple photo viewer for websites and web apps

### Usage

1. Include `photoviewer.css` and `photoviewer.js` in the head of the page
2. Include `photoviewer-touch.js` if you need touch support
3. Create your photo viewer on the fly:

```
/* Create photo viewer */
PhotoViewer.init('photo_viewer')
PhotoViewer.setPhotos(['graphics/photo1.jpg', 'graphics/photo2.jpg', 'graphics/photo3.jpg'])

/* Assign click handlers on photo thumbnails */
var thumbs = getElementsByClass('thumb', document.querySelector('#page .grid'), 'div')
for (var i = 0; i < 3; i++) {
   setTimeout(function(obj) { return function() { obj.style.opacity = '1' } }(thumbs[i]), 300)
   thumbs[i].onclick = function(index) {
      return function() {
         PhotoViewer.open(index)
      }
   }(i)
}
```
