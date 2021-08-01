(function() {

window.PhotoViewer = {
   element: null,
   photos: [],
   aspect: 1.5,
   minHeight: 400,
   setPhotos: function(array) {
      this.photos = Array.prototype.slice.call(array)
   },
   open: function(index) {
      if (this.element.style.display == 'block' || !this.photos.length) return
      if (this.clear_photos) {
         clearTimeout(this.clear_photos)
         this.clear_photos = null
      }

      var frame = getElementsByClass('frame', this.element, 'div')[0]
      var film = getElementsByClass('film', this.element, 'div')[0]
      var indicator = getElementsByClass('indicator', this.element, 'div')[0]

      var h = Math.min(Math.round(window.innerHeight * 0.728), 1000)
      if (h < this.minHeight) h = window.innerHeight
      var w = Math.round(h * 1.5)

      if (window.innerWidth / window.innerHeight < this.aspect) {
         w = window.innerWidth
         h = Math.round(w / 1.5)
      }

      frame.style.width = w + 'px'
      frame.style.marginLeft = -(w / 2) + 'px'
      frame.style.height = h + 'px'
      frame.style.marginTop = -(h / 2 + (h == window.innerHeight ? 0 : 10)) + 'px'

      film.style.height = h + 'px'

      if (!film.children.length) {
         film.innerHTML = ''
         for (var i = 0; i < this.photos.length; i++) {
            var el = document.createElement('div')
            el.style.background = "url('" + this.photos[i] + "') center center no-repeat"
            el.style.backgroundSize = "cover"
            el.style.cursor = 'pointer'
            el.onclick = this.nextPhoto.bind(this)
            film.appendChild(el)
         }
      }

      for (var i = 0; i < this.photos.length; i++) {
         var el = film.children[i]
         el.style.width = w + 'px'
         el.style.height = h + 'px'
         el.style.left = w * i + 'px'
      }

      this.resetIndicator()
      indicator.children[index].addClass('active')
      film.style.left = -w * index + 'px'

      this.element.curPhoto = index

      if (navigator.userAgent.indexOf('Android 2.') != -1) {
         document.getElementById('container').style.display = 'none'
      }
      if (navigator.userAgent.indexOf('Android') != -1) {
         last_pos = window.pageYOffset
         window.scrollTo(0, 1)
      }

      this.fade(0.0, 1.0, 0.2)
   },

   close: function(clean) {
      if (navigator.userAgent.indexOf('Android 2.') != -1) {
         document.getElementById('container').style.display = ''
      }
      if (navigator.userAgent.indexOf('Android') != -1) {
         window.scrollTo(0, last_pos)
      }
      this.fade(1.0, 0.0, -0.2)
      if (clean) this.clear_photos = setTimeout(function() { getElementsByClass('film', PhotoViewer.element, 'div')[0].innerHTML = '' }, 500)
      return false
   },

   clear_photos: null,

   resize: function() {
      var frame = getElementsByClass('frame', this.element, 'div')[0]
      var film = getElementsByClass('film', this.element, 'div')[0]
      var indicator = getElementsByClass('indicator', this.element, 'div')[0]
      this.element.style.bottom = '0px'

      var h = Math.min(Math.round(window.innerHeight * 0.728), 1000)
      var w = Math.round(h * 1.5)

      var h = Math.min(Math.round(window.innerHeight * 0.728), 1000)
      if (h < this.minHeight) h = window.innerHeight
      var w = Math.round(h * 1.5)

      if (window.innerWidth / window.innerHeight < this.aspect) {
         w = window.innerWidth
         h = Math.round(w / 1.5)
      }

      frame.style.width = w + 'px'
      frame.style.marginLeft = -(w / 2) + 'px'
      frame.style.height = h + 'px'
      frame.style.marginTop = -(h / 2 + (h == window.innerHeight ? 0 : 10)) + 'px'

      film.style.height = h + 'px'

      for (var i = 0; i < film.children.length; i++) {
         var el = film.children[i]
         el.style.width = w + 'px'
         el.style.height = h + 'px'
         el.style.left = w * i + 'px'
         if (indicator.children[i].hasClass('active')) {
            film.style.left = -w * i + 'px'
         }
      }
   },

   prevPhoto: function(time) {
      var frame = getElementsByClass('frame', this.element, 'div')[0]
      var film = getElementsByClass('film', this.element, 'div')[0]
      var indicator = getElementsByClass('indicator', this.element, 'div')[0]

      var time = time || 500

      var w = frame.clientWidth
      var n = this.element.curPhoto
      if (n == 0) {
         var num = this.photos.length
         n = num
      }
      this.element.curPhoto = n-1
      setTimeout(function() {
         if (n == num) {
            indicator.children[0].removeClass('active')
            indicator.children[num-1].addClass('active')
            if (getElementsByClass('thumb', document.getElementById('page6'), 'div').length == 6) loadMore()
         } else {
            indicator.children[n].removeClass('active')
            indicator.children[n-1].addClass('active')
         }
      }, 250)
      new Transition(film, [{ name: 'left',
                                     startValue: film.style.left,
                                     endValue: -w * (n - 1) + 'px' }], time, 'std').run()
      return false
   },

   nextPhoto: function(time) {
      var frame = getElementsByClass('frame', this.element, 'div')[0]
      var film = getElementsByClass('film', this.element, 'div')[0]
      var indicator = getElementsByClass('indicator', this.element, 'div')[0]

      var time = time || 500

      var w = frame.clientWidth
      var n = this.element.curPhoto
      var num = this.photos.length
      if (n == num-1) {
         n = -1
      }
      this.element.curPhoto = n+1
      setTimeout(function() {
         if (n == -1) {
            indicator.children[num-1].removeClass('active')
            indicator.children[0].addClass('active')
         } else {
            indicator.children[n].removeClass('active')
            indicator.children[n+1].addClass('active')
            if (getElementsByClass('thumb', document.getElementById('page6'), 'div').length == 6) loadMore()
         }
      }, 250)
      new Transition(film, [{ name: 'left',
                                     startValue: film.style.left,
                                     endValue: -w * (n + 1) + 'px' }], time, 'std').run()
      return false
   },

   toPhoto: function(index) {
      var frame = getElementsByClass('frame', this.element, 'div')[0]
      var film = getElementsByClass('film', this.element, 'div')[0]
      var indicator = getElementsByClass('indicator', this.element, 'div')[0]

      film.style.left = -frame.clientWidth * index + 'px'

      this.element.curPhoto = index

      for (var i = 0; i < indicator.children.length; i++) {
         indicator.children[i].removeClass('active')
      }
      indicator.children[index].addClass('active')

      if (getElementsByClass('thumb', document.getElementById('page6'), 'div').length == 6 && index >= 6) loadMore()
   },

   resetIndicator: function() {
      var frame = this.getElementsByClass('frame', this.element, 'div')[0]
      var film = this.getElementsByClass('film', this.element, 'div')[0]
      var indicator = this.getElementsByClass('indicator', this.element, 'div')[0]
      var n = this.getElementsByClass('film', this.element, 'div')[0].getElementsByTagName('div').length
      var str = ''
      for (var i = 0; i < film.children.length; i++) {
         str += '<div class="circle" onclick="PhotoViewer.toPhoto(' + i + ')"></div>'
      }
      indicator.innerHTML = str
      //if (n == 2) getByID('indicator').style.width = '70px'
      setTimeout(function() { indicator.style.left = Math.round(PhotoViewer.element.clientWidth / 2 - indicator.clientWidth / 2) + 'px' }, 50)
   },

   fade: function(start, stop, step, delay, callback) {
      var obj = this.element
      setTimeout(function() {
         var t = start
         if (start == 0) obj.style.display = 'block'
         var timer = setInterval(function() {
            t += step
            setElementOpacity(obj, t)
            if ((stop < start) && (t <= stop) || (stop > start) && (t >= stop)) {
               setElementOpacity(obj, stop)
               clearInterval(timer)
               if (stop == 0) obj.style.display = 'none'
               if (callback) callback()
            }
         }, 30)
      }, delay)
   },

   getElementsByClass: function(searchClass, node, tag) {
      var result = new Array();
      if ( node == null )
         node = document;
      if ( tag == null )
         tag = '*';
      var els = node.getElementsByTagName(tag);
      var elsLen = els.length;

      var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
      for (i = 0, j = 0; i < elsLen; i++) {
         if ( pattern.test(els[i].className) ) {
            result[j] = els[i];
            j++;
         }
      }
      return result;
   },

   init: function(id) {
      this.element = document.createElement('div')
      this.element.id = id || 'photo_viewer'
      document.body.appendChild(this.element)
      this.element.innerHTML = '<a class="prev" href="" onclick="return PhotoViewer.prevPhoto()"></a><div class="frame"><div class="film"></div></div><a class="next" href="" onclick="return PhotoViewer.nextPhoto()"></a><div class="indicator"></div><a class="close" href="" onclick="return PhotoViewer.close()"><!--[if (lt IE 9)]><img src="/graphics/close_photo.png" height="50" width="50" style="border: none" /><![endif]--></a>'
      if (document.addEventListener) window.addEventListener('resize', this.resize.bind(this), false)
      else window.attachEvent('onresize', this.resize.bind(this))
      document.onkeydown = function(event) {
         var e = event || window.event
         if (PhotoViewer.element.style.display != 'block') return
         if (e.keyCode == 37) PhotoViewer.prevPhoto()
         if (e.keyCode == 39) PhotoViewer.nextPhoto()
         if (e.keyCode == 27) PhotoViewer.close()
      }
      if (this.addTouchSupport) this.addTouchSupport()
   }
}

function Transition(obj, props, duration, type, callback, context) {
   this.object = obj
   this.props = props
   this.duration = duration
   this.delta = this.resolution / this.duration
   this.progress = 0.0
   this.type = type ? type : 'sin2'
   this.callback = callback
   this.context = context
   this.timer = null
}

Transition.prototype.duration = 500
Transition.prototype.resolution = 10
Transition.prototype.props = []
Transition.prototype.setResolution = function(res) {
   this.resolution = res
}
Transition.prototype.process = function() {
   this.progress += this.delta
   if (this.progress > 1.0) this.progress = 1.0
   var p = this.progress
   switch(this.type) {
      case 'std':
         break;
      case 'sin':
         p = Math.sin(p * Math.PI / 2)
         break;
      case 'sin2':
         p = (Math.sin(-Math.PI / 2 + p * Math.PI) + 1) / 2
         break;
      case 'sqrt':
         p = Math.sqrt(p)
         break;
      case 'sqr':
         p *= p
         break;
   }
   for (var i = 0; i < this.props.length; i++) {
      var s = parseFloat(this.props[i].startValue)
      var e = parseFloat(this.props[i].endValue)
      var val = s + (e-s) * p
      if (this.props[i].name.toLowerCase() != 'opacity') {
         if (this.props[i].startValue.match(/%$/)) {
            this.object.style[this.props[i].name] = Number(val).toPrecision(4) + '%'
         }
         if (this.props[i].startValue.match(/px$/)) {
            this.object.style[this.props[i].name] = parseInt(val) + 'px'
         }
      } else {
         setElementOpacity(this.object, Number(val).toPrecision(3))
      }
      this.props[i].curValue = this.object.style[this.props[i].name]
   }
}
Transition.prototype.run = function() {
   this.progress = 0.0
   this.timer = setInterval((function() {
      this.process()
      if (this.progress >= 1.0) {
         clearInterval(this.timer)
         this.timer = null
         if (this.callback && this.callback instanceof Function) {
            this.callback.call(this.context)
         }
      }
   }).bind(this), this.resolution)
}
Transition.prototype.abort = function() {
   this.stop()
   this.duration *= this.progress
   this.delta = this.resolution / this.duration
   for (var i = 0; i < this.props.length; i++) {
      this.props[i].endValue = this.props[i].startValue
      this.props[i].startValue = this.props[i].curValue
   }
   this.run()
}
Transition.prototype.stop = function() {
   clearInterval(this.timer)
   this.timer = null
}

function setElementOpacity(elem, nOpacity) {
   var opacityProp = getOpacityProperty();

   if (!elem || !opacityProp) return;

   if (opacityProp=="filter") {
      nOpacity *= 100;

      // Если уже установлена прозрачность, то меняем её через коллекцию filters, иначе добавляем прозрачность через style.filter
      var oAlpha = elem.filters['DXImageTransform.Microsoft.alpha'] || elem.filters.alpha;
      if (oAlpha) oAlpha.opacity = nOpacity;
      else elem.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+nOpacity+")"; //Для того чтобы не затереть другие фильтры используем "+="
   }
   else // Другие браузеры
      elem.style[opacityProp] = nOpacity;
}

function getOpacityProperty() {
   if (typeof document.body.style.opacity == 'string') // CSS3 compliant (Moz 1.7+, Safari 1.2+, Opera 9)
      return 'opacity';
   else if (typeof document.body.style.MozOpacity == 'string') // Mozilla 1.6 и младше, Firefox 0.8
      return 'MozOpacity';
   else if (typeof document.body.style.KhtmlOpacity == 'string') // Konqueror 3.1, Safari 1.1
      return 'KhtmlOpacity';
   else if (document.body.filters && navigator.appVersion.match(/MSIE ([\d.]+);/)[1]>=5.5) // Internet Exploder 5.5+
      return 'filter';

   return false; //нет прозрачности
}

function getElementsByClass(searchClass, node, tag) {
   var result = new Array();
   if ( node == null )
      node = document;
   if ( tag == null )
      tag = '*';
   var els = node.getElementsByTagName(tag);
   var elsLen = els.length;

   var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
   for (i = 0, j = 0; i < elsLen; i++) {
      if ( pattern.test(els[i].className) ) {
         result[j] = els[i];
         j++;
      }
   }
   return result;
}

function addClass(value) {
    var c = this.getAttribute('class')
    if (c == null) c = ''
    var r = new RegExp("(^|\\s)"+value+"(\\s|$)")
    if (r.test(c)) return
    if (c.length) value = ' ' + value
    this.setAttribute('class', c + value)
}

function removeClass(value) {
    var c = this.getAttribute('class')
    if (c == null) return;
    var a = c.split(' ')
    for (var i = 0; i < a.length; i++) {
        if (a[i] == value) a[i] = ''
    }
    var s = ''
    for (var i = 0; i < a.length; i++) {
        if (!a[i].length) continue
        if (s.length) s += ' '
        s += a[i]
    }
    this.setAttribute('class', s)
}

function hasClass(value) {
    return new RegExp("(^|\\s)"+value+"(\\s|$)").test(this.className)
}

HTMLElement.prototype.addClass = addClass
HTMLElement.prototype.removeClass = removeClass
HTMLElement.prototype.hasClass = hasClass

})()