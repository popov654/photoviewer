(function() {
   
if (!window.PhotoViewer) return
   
window.PhotoViewer.addTouchSupport = function() {
   var el = this.element
   addEventHandler(el, 'touchstart', function(event) {
      if (fx) return
      var touch = event.targetTouches[0]
      touch_startX = touch.pageX
      touch_startY = touch.pageY
      touch_time = new Date()
      var photos = getElementsByClass('film', el, 'div')[0].children
      for (var i = 0; i < photos.length; i++) {
         photos[i].onclick = null
      }
      for (var i = 0; i < el.children.length; i++) {
         if (el.children[i].className != 'frame') {
            el.children[i].ontouchend = function() {
               if (!el.swipe) this.onclick.call(this)
            }
         }
      }
      var indicator = getElementsByClass('indicator', el, 'div')[0]
      for (var i = 0; i < indicator.children.length; i++) {
         indicator.children[i].ontouchend = indicator.children[i].onclick
      }
   })
   /* addEventHandler(el, 'touchmove', function(event) {
      if (fx) return
      if (!event.targetTouches.length) return
      var touch = event.targetTouches[0]
      if (touch_time == -1) {
         touch_startX = touch.pageX
         touch_startY = touch.pageY
         touch_time = new Date()
      }
      var is_swipe = Math.abs(touch.pageY - touch_startY) < Math.abs(touch.pageX - touch_startX) * 0.2
      var is_swipe2 = Math.abs(touch.pageY - touch_startY) < Math.abs(touch.pageX - touch_startX) * 0.4
      if (Math.abs(touch.pageX - touch_startX) > 15 && is_swipe) event.preventDefault()
      if (touch.pageX - touch_startX > 40 && is_swipe) {
         fx = true
         PhotoViewer.prevPhoto()
         event.preventDefault()
         endTouch()
         setTimeout(function() { fx = false }, 500)
      }
      if (touch.pageX - touch_startX < -40 && is_swipe) {
         fx = true
         PhotoViewer.nextPhoto()
         event.preventDefault()
         endTouch()
         setTimeout(function() { fx = false }, 500)
      }
   }) */
   addEventHandler(document.body, 'touchend', function(event) {
      if (touch_startX == -1) return
      if (timer) {
         clearTimeout(timer)
         timer = null
      }
      endTouch()
   })

   addEventHandler(el, 'touchstart', function(event) {
      if ((new Date()) - last_touch < 250) {
         if (zoom == 1) zoomIn()
         else zoomOut()
      }
      if (fx) return
      pw = el.clientWidth
      var touch = event.targetTouches[0]
      touch_startX = touch.pageX
      touch_startY = touch.pageY
      touch_time = new Date()
      event.stopPropagation()

      last_touch = touch_time

      if (!el.curPhoto) {
         var film = getElementsByClass('film', el, 'div')[0]
         var frame = getElementsByClass('frame', el, 'div')[0]
         document.getElementById('photo_viewer').curPhoto = Math.round(-film.clientLeft / frame.clientWidth)
      }
      if (event.targetTouches.length == 2) {
         touch_startX = [event.targetTouches[0].pageX, event.targetTouches[1].pageX]
         touch_startY = [event.targetTouches[0].pageY, event.targetTouches[1].pageY]
         delta = Math.sqrt((touch_startX[1] - touch_startX[0]) * (touch_startX[1] - touch_startX[0]) + (touch_startY[1] - touch_startY[0]) * (touch_startY[1] - touch_startY[0]))
         if (delta == 0) endTouch()
         event.preventDefault()
         return
      }
      if (zoom == 1) {
         var img = new Image()
         var index = el.curPhoto
         var pic = getElementsByClass('film', el, 'div')[0].children[index]
         img.src = 'graphics/' + pic.style.background.match(/[a-z0-9]+\.jpg/)[0]
         img.onload = function(pic) {
            return function() {
               pic.width = this.width
               pic.height = this.height
            }
         }(getElementsByClass('film', el, 'div')[0].children[index])
      }
      event.preventDefault()
   })
   addEventHandler(el, 'touchmove', function(event) {
      if (fx) return
      event.stopPropagation()
      if (touch_startX == -1) return
      if (!event.targetTouches.length) return
      var touch = event.targetTouches[0]

      if (event.targetTouches.length == 2 && touch_startX instanceof Array && touch_startY instanceof Array) {
         var x = event.targetTouches[0].pageX - event.targetTouches[1].pageX
         var y = event.targetTouches[0].pageY - event.targetTouches[1].pageY
         var r = Math.sqrt(x*x + y*y)
         q = Math.round((r / delta) * 1000) / 1000
         var d = q > 1 ? 0.6 : 1.4
         q = zoom + (q-1) * d
         if (Math.abs(q-1) < 0.2 || q < 1) q = 1

         var pic = getElementsByClass('film', el, 'div')[0].children[el.curPhoto]
         var w = Math.floor(pic.clientWidth * q)
         var h = Math.floor(pic.clientHeight * q)

         if (w > pic.width || h > pic.height) {
            q = pic.width / getElementsByClass('frame', el, 'div')[0].clientWidth
            w = Math.floor(pic.clientWidth * q)
            h = Math.floor(pic.clientHeight * q)
         }

         dx = (q / zoom) * trans_x
         dy = (q / zoom) * trans_y
         if (dx < document.body.clientWidth - w) dx = document.body.clientWidth - w
         if (dx > 0) dx = 0
         if (dy < window.innerHeight - h) dy = window.innerHeight - h
         if (dy > 0) dy = 0

         if (q == 1) {
            dx = 0
            dy = 0
         }

         if (q != 1 && getElementsByClass('close', el, 'a')[0].style.display != 'none' ||
             q == 1 && getElementsByClass('close', el, 'a')[0].style.display == 'none') {
            toggleControls()
            var photos = pic.parentNode.children
            for (var i = 0; i < photos.length; i++) {
               if (photos[i] != pic) {
                  if (q != 1) photos[i].style.display = 'none'
                  else photos[i].style.display = ''
               }
            }
         }

         setScale(getElementsByClass('frame', el, 'div')[0], q)
         setTranslate(getElementsByClass('frame', el, 'div')[0], dx, dy)
         return
      }

      if (zoom != 1) {
         var pic = getElementsByClass('film', el, 'div')[0].children[el.curPhoto]
         var w = Math.floor(pic.clientWidth * zoom)
         var h = Math.floor(pic.clientHeight * zoom)
         dx = trans_x + event.targetTouches[0].pageX - touch_startX
         dy = trans_y + event.targetTouches[0].pageY - touch_startY

         var width = el.clientWidth
         var height = el.clientHeight

         if (pic.width && pic.width <= width && pic.height && pic.height <= height) return

         dx = Math.min((w-width) / 2, Math.max(-(w-width) / 2, dx))
         if (pic.width && pic.height && (pic.width / pic.height < width / height) && (h * (pic.width / pic.height)) <= width) dx = 0
         if (pic.width && pic.height && (pic.width / pic.height < width / height) && (h * (pic.width / pic.height)) > width) dx = Math.min((h * (pic.width / pic.height) - width) / 2, Math.max(-(h * (pic.width / pic.height) - width) / 2, dx))
         dy = Math.min((h - height) / 2, Math.max(-(h - height) / 2, dy))
         if (pic.width && pic.height && (pic.width / pic.height >= width / height) && (w / (pic.width / pic.height)) <= height) dy = 0
         if (pic.width && pic.height && (pic.width / pic.height >= width / height) && (w / (pic.width / pic.height)) > height) dy = Math.min((w / (pic.width / pic.height) - height) / 2, Math.max(-(w / (pic.width / pic.height) - height) / 2, dy))

         setTranslate(getElementsByClass('frame', el, 'div')[0], dx, dy)

         return
      }

      var is_swipe = Math.abs(touch.pageY - touch_startY) < Math.abs(touch.pageX - touch_startX) * 0.2
      if (is_swipe || Math.abs(touch.pageX - touch_startX) > 30) event.preventDefault()

      var film = getElementsByClass('film', el, 'div')[0]

      el.last_coordX = -1
      el.last_coordY = -1
      if (Math.abs(touch.pageX - touch_startX) > 20 && (is_swipe || el.swipe) && !fx) {
         el.last_coordX = touch.pageX
         el.last_coordY = touch.pageY
         el.swipe = true
         if (event.stopPropagation) event.stopPropagation()
         else event.cancelBubble = true
         if (btn_timer) {
            clearTimeout(btn_timer)
            btn_timer = null
         }
         film.style.left = (-film.parentNode.clientWidth * el.curPhoto) + touch.pageX - touch_startX - 20 + 'px'
      }
   })
   addEventHandler(el, 'touchend', function(event) {

      if (touch_startX == -1 || (fx && zoom == 1)) return

      if ((el.last_coordX == -1 || el.last_coordX == undefined ||
          el.last_coordX == touch_startX && el.last_coordY == touch_startY) &&
          event.target.className != 'close' && event.target.className != 'prev' && event.target.className != 'next' &&
          event.target.parentNode.className != 'indicator' && event.target.className != 'indicator' && q == 1 && zoom == 1) {
         toggleControls()
         endTouch()
         return
      }

      var is_swipe = Math.abs(el.last_coordY - touch_startY) < Math.abs(el.last_coordX - touch_startX) * 0.4

      var film = getElementsByClass('film', el, 'div')[0]

      var limit = 170

      if (window.innerWidth >= 900) limit = Math.round(window.innerWidth * 0.26)

      if (el.last_coordX != -1 && (Math.abs(el.last_coordX - touch_startX) > Math.min(film.parentNode.clientWidth * 0.45 + 10, limit)) && (is_swipe || el.swipe) && !fx) { //Switch photo
         event.preventDefault()

         fx = true

         var t = film.parentNode.clientWidth - Math.abs(-parseInt(film.style.left) - (film.parentNode.clientWidth * el.curPhoto)) / film.parentNode.clientWidth

         var time = Math.max(Math.min(Math.round(t * ((new Date()) - touch_time) * 1.4), 380), 160)

         if (el.last_coordX > touch_startX) {
            PhotoViewer.prevPhoto(time)
         } else {
            PhotoViewer.nextPhoto(time)
         }

         setTimeout(function() { window.fx = false }, 500)

      } else if (el.last_coordX > -1 && Math.abs(el.last_coordX - touch_startX) > 20 && (is_swipe || el.swipe)) {  //Rollback

         fx = true

         var t = Math.abs(-parseInt(film.style.left) - (film.parentNode.clientWidth *el.curPhoto)) / film.parentNode.clientWidth

         var time = Math.max(Math.min(Math.round(t * ((new Date()) - touch_time) * 1.4), 380), 160)

         new Transition(film, [{ name: 'left',
                               startValue: film.style.left,
                               endValue: -film.parentNode.clientWidth * (el.curPhoto) + 'px' }], time, 'std').run()

         setTimeout(function() { window.fx = false }, time)

      }
      el.swipe = false
      el.last_coordX = -1
      el.last_coordY = -1
      if (q != zoom) zoom = q
      if (dx != trans_x) trans_x = dx
      if (dy != trans_y) trans_y = dy
      delta = 0
      endTouch()
   })
}

function endTouch() {
   touch_startX = -1
   touch_startY = -1
   touch_time = -1
}

function setScale(obj, scale) {
   obj.style.transform = 'scale(' + scale + ')'
   if (navigator.userAgent.indexOf('Opera') != -1) obj.style.OTransform = 'scale(' + scale + ')'
   if (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Safari') != -1) obj.style.webkitTransform = 'scale(' + scale + ')'
   if (navigator.userAgent.indexOf('MSIE') != -1) obj.style.MSTransform = 'scale(' + scale + ')'

   var frame = getElementsByClass('frame', el, 'div')[0]

   obj.style.transformOrigin = (frame.clientWidth / 2) + 'px ' + (frame.clientHeight / 2) + 'px'
   if (navigator.userAgent.indexOf('Opera') != -1) obj.style.OTransformOrigin = (frame.clientWidth / 2) + 'px ' + (frame.clientHeight / 2) + 'px'
   if (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Safari') != -1) obj.style.webkitTransformOrigin = (frame.clientWidth / 2) + 'px ' + (frame.clientHeight / 2) + 'px'
   if (navigator.userAgent.indexOf('MSIE') != -1) obj.style.MSTransformOrigin = (frame.clientWidth / 2) + 'px ' + (frame.clientHeight / 2) + 'px'
}

function setTranslate(obj, x, y) {
   obj.style.transform = obj.style.transform.split(' ')[0] + ' translate(' + (x / zoom) + 'px,' + (y / zoom) + 'px)'
   if (navigator.userAgent.indexOf('Opera') != -1) obj.style.OTransform = obj.style.OTransform.split(' ')[0] + ' translate(' + (x / zoom) + 'px,' + (y / zoom) + 'px)'
   if (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Safari') != -1) obj.style.webkitTransform = obj.style.webkitTransform.split(' ')[0] + ' translate(' + (x / zoom) + 'px,' + (y / zoom) + 'px)'
   if (navigator.userAgent.indexOf('MSIE') != -1) obj.style.MSTransform = obj.style.MSTransform.split(' ')[0] + ' translate(' + (x / zoom) + 'px,' + (y / zoom) + 'px)'
}

function zoomIn(el) {
   fx = true
   if (zoom < 2) {
      zoom += 0.05
      q = zoom
      setScale(getElementsByClass('frame', el, 'div')[0], zoom)
      setTimeout(arguments.callee, 50)
      return
   }
   fx = false
   if (controls) toggleControls()
}

function zoomOut(el) {
   fx = true
   if (zoom > 1) {
      zoom -= 0.05
      q = zoom
      setScale(getElementsByClass('frame', el, 'div')[0], zoom)
      setTimeout(arguments.callee, 50)
      return
   }
   fx = false
   toggleControls()
}

function toggleControls(el) {
   if (fx) return
   var els = el.children
   fx = true
   if (controls) {
      for (var i = 0; i < els.length; i++) {
         if (els[i].className != 'frame') fade(els[i], 1.0, 0.0, -0.34)
         setTimeout(function() { fx = false }, 800)
      }
   } else {
      for (var i = 0; i < els.length; i++) {
         if (els[i].className != 'frame') fade(els[i], 0.0, 1.0, 0.34)
         setTimeout(function() { fx = false }, 800)
      }
   }
   controls = !controls
}

function addEventHandler(obj, e, h) {
   if (document.all) {
      obj.attachEvent('on' + e, h)
   } else {
      obj.addEventListener(e, h, false)
   }
}

function getByID(id) {
   return document.getElementById(id)
}

var touch_startX = -1
var touch_startY = -1
var delta = 0
var zoom = 1
var q = 1
var trans_x = 0, trans_y = 0
var dx = 0, dy = 0
var touch_time = -1
var active_zone = 60
var threshold = 10
var timer = null
var pw = 0
var fx = false
var controls = true
var btn_timer = null
var last_touch = -1

})()