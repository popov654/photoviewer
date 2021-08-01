var XScroll = {}

XScroll.private = {}

XScroll.scrollX = function(obj, ratio) {
   var width = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
               obj.firstElementChild.clientWidth : obj.firstElementChild.scrollWidth
   var x = Math.round((obj.firstElementChild.clientWidth - obj.clientWidth) * ratio)
   if (x < 0) x = 0
   if (x > width - obj.clientWidth) {
      x = width - obj.clientWidth
   }
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.left = -x + 'px'
   } else {
      obj.firstElementChild.scrollLeft = x
   }
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollY = function(obj, ratio) {
   var height = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
                obj.firstElementChild.clientHeight : obj.firstElementChild.scrollHeight
   var y = Math.round((height - obj.clientHeight) * ratio)
   if (y < 0) y = 0
   if (y > height - obj.clientHeight) {
      y = height - obj.clientHeight
   }
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.top = -y + 'px'
   } else {
      obj.firstElementChild.scrollTop = y
   }
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollLeft = function(obj) {
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.left = '0px'
   } else {
      obj.firstElementChild.scrollLeft = 0
   }
   this.private.setXThumb(obj, 0)
   XScroll.fireEvent(XScroll.object, 'scroll')
   XScroll.fireEvent(XScroll.object, 'scrollend')
}

XScroll.scrollRight = function(obj) {
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.left = obj.clientWidth - obj.firstElementChild.clientWidth + 'px'
   } else {
      obj.firstElementChild.scrollLeft = obj.firstElementChild.clientWidth - obj.clientWidth
   }
   this.private.setXThumb(obj, 1)
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollTop = function(obj) {
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.top = '0px'
   } else {
      obj.firstElementChild.scrollTop = 0
   }
   this.private.setYThumb(obj, 0)
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollBottom = function(obj) {
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.top = obj.clientHeight - obj.firstElementChild.clientHeight + 'px'
   } else {
      obj.firstElementChild.scrollTop = obj.firstElementChild.clientHeight - obj.clientHeight
   }
   this.private.setYThumb(obj, 1)
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollToX = function(obj, value) {
   var width = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
               obj.firstElementChild.clientWidth : obj.firstElementChild.scrollWidth
   if (value < 0) value = 0
   if (value > width - obj.clientWidth) {
      value = width - obj.clientWidth
   }
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.left = -value + 'px'
   } else {
      obj.firstElementChild.scrollLeft = value
   }
   this.private.setXThumb(obj, value / (width - obj.clientWidth))
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollToY = function(obj, value) {
   var height = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
                obj.firstElementChild.clientHeight : obj.firstElementChild.scrollHeight
   if (value < 0) value = 0
   if (value > height - obj.clientHeight) {
      value = height - obj.clientHeight
   }
   if (obj.firstElementChild.tagName.toLowerCase() != 'textarea') {
      obj.firstElementChild.style.top = -value + 'px'
   } else {
      obj.firstElementChild.scrollTop = value
   }
   this.private.setYThumb(obj, value / (height - obj.clientHeight))
   XScroll.fireEvent(obj, 'scroll')
   XScroll.fireEvent(obj, 'scrollend')
}

XScroll.scrollLeft = function(obj, delta) {
   var x = this.getXPosition(obj)
   if (obj.getAttribute('scroll-delta')) {
      delta = parseInt(obj.getAttribute('scroll-delta'))
   }
   this.scrollToX(obj, x-delta)
}

XScroll.scrollRight = function(obj, delta) {
   var x = this.getXPosition(obj)
   if (obj.getAttribute('scroll-delta')) {
      delta = parseInt(obj.getAttribute('scroll-delta'))
   }
   this.scrollToX(obj, x+delta)
}

XScroll.scrollUp = function(obj, delta) {
   var y = this.getYPosition(obj)
   if (obj.getAttribute('scroll-delta')) {
      delta = parseInt(obj.getAttribute('scroll-delta'))
   }
   this.scrollToY(obj, y-delta)
}

XScroll.scrollDown = function(obj, delta) {
   var y = this.getYPosition(obj)
   if (obj.getAttribute('scroll-delta')) {
      delta = parseInt(obj.getAttribute('scroll-delta'))
   }
   this.scrollToY(obj, y+delta)
}

XScroll.updateThumbPosition = function(obj) {
   if (XScroll.hasXScroll(obj)) {
      this.private.updateThumbXPosition(obj)
   } else {
      this.private.updateThumbYPosition(obj)
   }
}

XScroll.private.updateThumbXPosition = function(obj) {
   var x = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
           - obj.firstElementChild.offsetLeft : obj.firstElementChild.scrollLeft

   var width = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
                obj.firstElementChild.clientWidth - obj.clientWidth : obj.firstElementChild.scrollWidth - obj.clientWidth

   this.setXThumb(obj, x / width)
}

XScroll.private.updateThumbYPosition = function(obj) {
   var y = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
           - obj.firstElementChild.offsetTop : obj.firstElementChild.scrollTop

   var height = obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
                obj.firstElementChild.clientHeight - obj.clientHeight : obj.firstElementChild.scrollHeight - obj.clientHeight

   this.setYThumb(obj, y / height)
}

XScroll.getPosition = function(obj) {
   if (XScroll.hasXScroll(obj)) {
      return this.getXPosition(obj)
   } else {
      return this.getYPosition(obj)
   }
}

XScroll.getXPosition = function(obj) {
   return obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
           - obj.firstElementChild.offsetLeft : obj.firstElementChild.scrollLeft
}

XScroll.getYPosition = function(obj) {
   return obj.firstElementChild.tagName.toLowerCase() != 'textarea' ?
           - obj.firstElementChild.offsetTop : obj.firstElementChild.scrollTop
}

XScroll.private.setXThumb = function(obj, ratio) {
   if (isNaN(ratio)) ratio = 0
   ratio = Math.min(Math.max(ratio, 0), 1)
   var thumb = getElementsByClass('xscroll_thumb_horz', obj, 'div')[0]
   var x = Math.round((thumb.parentNode.clientWidth - thumb.clientWidth) * ratio)
   thumb.style.left = x + 'px'
}

XScroll.private.setYThumb = function(obj, ratio) {
   if (isNaN(ratio)) ratio = 0
   ratio = Math.min(Math.max(ratio, 0), 1)
   var thumb = getElementsByClass('xscroll_thumb_vert', obj, 'div')[0]
   var y = Math.round((thumb.parentNode.clientHeight - thumb.clientHeight) * ratio)
   thumb.style.top = y + 'px'
}

XScroll.private.scrollCont = function(func) {
   if (XScroll.cont) {
      func()
      XScroll.fireEvent(XScroll.object, 'scroll')
      setTimeout(function() { XScroll.private.scrollCont(func) }, 50)
   }
}

XScroll.private.stopScroll = function() {
   if (XScroll.timer) {
      clearTimeout(XScroll.timer)
      XScroll.timer = null
   }
   XScroll.fireEvent(XScroll.object, 'scrollend')
   XScroll.object = null
   XScroll.cont = false
}

XScroll.hasXScroll = function(el) {
   return el.className.match(/(^|\s)scroll_x(\s|$)/)
}

XScroll.hasYScroll = function(el) {
   return el.className.match(/(^|\s)scroll_y(\s|$)/)
}

XScroll.timer = null

XScroll.initAll = function(force) {
   var els = getElementsByClass('scrollable', null, null)
   for (var i = 0; i < els.length; i++) {
      this.init(els[i], force)
   }
}

XScroll.init = function(el, force) {
   var tag = el.tagName.toLowerCase()
   if (tag != 'textarea') tag = 'div'
   var c = document.createElement(tag)
   if (tag != 'textarea') c.innerHTML = el.innerHTML
   else c.value = el.value

   var st = el.currentStyle || getComputedStyle(el, '')

   var size = 10
   if (el.getAttribute('scroll-size')) {
      size = Math.max(parseInt(el.getAttribute('scroll-size')), 2)
   }
   if (XScroll.hasXScroll(el)) {
      c.style.width = 'auto'
   } else {
      c.style.height = 'auto'
   }
   if (el.getAttribute('viewport-height')) {
      if (parseInt(el.style.height) < el.getAttribute('viewport-height') && tag != 'textarea' && !force) return
      el.style.height = parseInt(el.getAttribute('viewport-height')) + 'px'
   } else {
      var h = parseInt(st.height)
      var sizing = (st['boxSizing']) ? st['boxSizing'] : st['box-sizing']
      if (sizing == 'content-box') {
         var pad_t = (st['paddingTop']) ? parseInt(st['paddingTop']) : parseInt(st['padding-top'])
         var pad_b = (st['paddingBottom']) ? parseInt(st['paddingBottom']) : parseInt(st['padding-bottom'])
         h += pad_t + pad_b
      }
      if (sizing == 'content-box' || sizing == 'padding-box') {
         var b_t = (st['borderTop']) ? parseInt(st['borderTop']) : parseInt(st['border-top'])
         var b_b = (st['borderBottom']) ? parseInt(st['borderBottom']) : parseInt(st['border-bottom'])
         h += b_t + b_b
      }
      el.style.height = h + 'px'
   }
   if (el.getAttribute('viewport-width')) {
      if (parseInt(el.style.width) < el.getAttribute('viewport-width') && tag != 'textarea' && !force) return
      el.style.width = parseInt(el.getAttribute('viewport-width')) + 'px'
   } else if (!(st.left.match(/^\d+%$/) && st.right.match(/^\d+%$/)) && !st.width.match(/^\d+%$/)){
      var w = 0
      if (st.width == 'auto') {
         var el2 = el
         w = st.width
         while (el2 != document && w == 'auto') {
            var st2 = el2.currentStyle ? el2.currentStyle : getComputedStyle(el2, '')
            w = st2.width
            if (w == 'auto' && st2.position == 'absolute' && st2.left != 'auto' && st2.right != 'auto') {
               w = el2.clientWidth
            }
            el2 = el2.parentNode
         }
      } else w = parseInt(st.width)
      var sizing = (st['boxSizing']) ? st['boxSizing'] : st['box-sizing']
      if (sizing == 'content-box') {
         var pad_l = (st['paddingLeft']) ? parseInt(st['paddingLeft']) : parseInt(st['padding-left'])
         var pad_r = (st['paddingRight']) ? parseInt(st['paddingRight']) : parseInt(st['padding-right'])
         w += pad_l + pad_r
      }
      if (sizing == 'content-box' || sizing == 'padding-box') {
         var b_l = (st['borderLeft']) ? parseInt(st['borderLeft']) : parseInt(st['border-left'])
         var b_r = (st['borderRight']) ? parseInt(st['borderRight']) : parseInt(st['border-right'])
         w += b_l + b_r
      }
      el.style.width = w + 'px'
   }

   if (st.position == 'static') el.style.position = 'relative'
   el.style.overflow = 'hidden'
   c.style.position = 'absolute'
   c.style.boxSizing = 'border-box'
   c.style.padding = st.padding
   el.style.boxSizing = 'border-box'
   el.style.padding = '0px'

   if (tag == 'textarea') {
      el.parentNode.insertBefore(document.createElement('div'), el)
      var attrs = el.attributes
      var temp = el.previousSibling
      for (var i = 0; i < attrs.length; i++) {
         if (attrs[i].name != 'name' && attrs[i].name != 'id' && attrs[i].name.indexOf('data-') != 0 &&
             attrs[i].name != 'rows' && attrs[i].name != 'cols' && attrs[i].name != 'disabled') {
            temp.setAttribute(attrs[i].name, attrs[i].value)
         } else {
            c.setAttribute(attrs[i].name, attrs[i].value)
         }
      }
      var st = el.currentStyle || getComputedStyle(el, '')
      temp.style.display = (st.display == 'block') ? 'block' : 'inline-block'
      temp.style.background = st.background
      if (!el.currentStyle && temp.style.background == '') {
         temp.style.backgroundColor = st.backgroundColor
         temp.style.backgroundImage = st.backgroundImage
         temp.style.backgroundSize = st.backgroundSize
         temp.style.backgroundPosition = st.backgroundPosition
         temp.style.backgroundRepeat = st.backgroundRepeat
      }

      temp.style.boxShadow = st['boxShadow'] || st['box-shadow']
      c.style.background = 'none'
      c.style.boxShadow = 'none'
      c.style.outline = 'none'
      c.style.border = 'none'
      c.style.color = 'inherit'
      c.style.resize = 'none'
      c.style.overflow = 'hidden'
      c.style.fontFamily = st['fontFamily'] || st['font-family']
      c.style.fontSize = st['fontSize'] || st['font-size']
      c.style.fontWeight = st['fontWeight'] || st['font-weight']
      c.style.fontStyle = st['fontStyle'] || st['font-style']
      c.style.lineHeight = st['lineHeight'] || st['line-height']

      if (st.margin != '') {
         temp.style.margin = st.margin
      } else {
         temp.style.marginTop = st['marginTop'] || st['margin-top']
         temp.style.marginLeft = st['marginLeft'] || st['margin-left']
         temp.style.marginRight = st['marginRight'] || st['margin-right']
         temp.style.marginBottom = st['marginBottom'] || st['margin-bottom']
      }
      c.style.margin = '0px'

      temp.style.borderTop = st['borderTop'] || st['border-top']
      temp.style.borderLeft = st['borderLeft'] || st['border-left']
      temp.style.borderRight = st['borderRight'] || st['border-right']
      temp.style.borderBottom = st['borderBottom'] || st['border-bottom']

      if (navigator.userAgent.indexOf('Firefox') != -1) {
         temp.style.borderTopColor = st['borderTopColor']
         temp.style.borderLeftColor = st['borderLeftColor']
         temp.style.borderRightColor = st['borderRightColor']
         temp.style.borderBottomColor = st['borderBottomColor']

         temp.style.borderTopStyle = st['borderTopStyle']
         temp.style.borderLeftStyle = st['borderLeftStyle']
         temp.style.borderRightStyle = st['borderRightStyle']
         temp.style.borderBottomStyle = st['borderBottomStyle']

         temp.style.borderTopWidth = st['borderTopWidth']
         temp.style.borderLeftWidth = st['borderLeftWidth']
         temp.style.borderRightWidth = st['borderRightWidth']
         temp.style.borderBottomWidth = st['borderBottomWidth']
      }

      c.onclick = el.onclick
      c.onmouseover = el.onmouseover
      c.onmouseout = el.onmouseout
      c.onmouseenter = el.onmouseenter
      c.onmouseleave = el.onmouseleave
      c.onkeyup = el.onkeyup
      c.onkeydown = el.onkeydown
      c.onkeypress = el.onkeypress
      c.oninput = el.oninput
      c.onpaste = el.onpaste
      el.parentNode.removeChild(el)
      el = temp
   }

   el.innerHTML = ''

   el.style.boxSizing = 'content-box'
   el.style.width = parseInt(el.style.width) - parseInt(st['borderLeftWidth']) - parseInt(st['borderRightWidth']) + 'px'
   el.style.height = parseInt(el.style.height) - parseInt(st['borderTopWidth']) - parseInt(st['borderBottomWidth']) + 'px'

   if (XScroll.hasXScroll(el)) {
      c.style.bottom = size + 'px'
   } else {
      c.style.right = size + 'px'
   }
   if (tag == 'textarea') {
      if (XScroll.hasXScroll(el)) {
         c.style.height = parseInt(el.style.height) - size + 'px'
         c.style.width = parseInt(el.style.width) + 'px'
      } else {
         c.style.height = parseInt(el.style.height) + 'px'
         c.style.width = parseInt(el.style.width) - size + 'px'
      }
   }
   c.style.left = '0px'
   c.style.top = '0px'
   el.appendChild(c)
   var button1 = document.createElement('div')
   var track = document.createElement('div')
   var thumb = document.createElement('div')
   var button2 = document.createElement('div')
   var button_size = 10
   if (el.getAttribute('button-size')) {
      button_size = parseInt(el.getAttribute('button-size'))
   }
   var thumb_size = 80
   if (!el.getAttribute('thumb-length')) {
      if (XScroll.hasXScroll(el)) {
         thumb_size = Math.max(Math.round((el.clientWidth - button_size * 2) * (el.clientWidth / c.clientWidth)), thumb_size)
      } else {
         thumb_size = Math.max(Math.round((el.clientHeight - button_size * 2) * (el.clientHeight / c.clientHeight)), thumb_size)
      }
   } else {
      thumb_size = parseInt(el.getAttribute('thumb-length'))
   }
   if (XScroll.hasXScroll(el)) {
      thumb.style.height = size + 'px'
      thumb.style.width = thumb_size + 'px'
   } else {
      thumb.style.width = size + 'px'
      thumb.style.height = thumb_size + 'px'
   }
   if (XScroll.hasXScroll(el)) {
      button1.style.width = button_size + 'px'
      button1.style.height = size + 'px'
      track.style.height = size + 'px'
      //track.style.width = el.clientWidth - button_size * 2 + 'px'
      button2.style.width = button_size + 'px'
      button2.style.height = size + 'px'

      button1.style.position = 'absolute'
      button1.style.left = '0px'
      button1.style.bottom = '0px'
      track.style.position = 'absolute'
      track.style.left = button_size + 'px'
      track.style.right = button_size + 'px'
      track.style.bottom = '0px'
      thumb.style.position = 'absolute'
      thumb.style.left = '0px'
      thumb.style.top = '0px'
      button2.style.position = 'absolute'
      button2.style.right = '0px'
      button2.style.bottom = '0px'

      button1.className = 'xscroll_btn_left'
      button2.className = 'xscroll_btn_right'
      track.className = 'xscroll_track_horz'
      thumb.className = 'xscroll_thumb_horz'
   } else {
      button1.style.height = button_size + 'px'
      button1.style.width = size + 'px'
      track.style.width = size + 'px'
      //track.style.height = el.clientHeight - button_size * 2 + 'px'
      button2.style.height = button_size + 'px'
      button2.style.width = size + 'px'

      button1.style.position = 'absolute'
      button1.style.top = '0px'
      button1.style.right = '0px'
      track.style.position = 'absolute'
      track.style.top = button_size + 'px'
      track.style.bottom = button_size + 'px'
      track.style.right = '0px'
      thumb.style.position = 'absolute'
      thumb.style.left = '0px'
      thumb.style.top = '0px'
      button2.style.position = 'absolute'
      button2.style.bottom = '0px'
      button2.style.right = '0px'

      button1.className = 'xscroll_btn_up'
      button2.className = 'xscroll_btn_down'
      track.className = 'xscroll_track_vert'
      thumb.className = 'xscroll_thumb_vert'
   }
   if (el.getAttribute('thumb-width')) {
      var w = parseInt(el.getAttribute('thumb-width'))
      if (XScroll.hasXScroll(el)) {
         thumb.style.height = w + 'px'
         thumb.style.top = Math.round((size-w)/2) + 'px'
      } else {
         thumb.style.width = w + 'px'
         thumb.style.left = Math.round((size-w)/2) + 'px'
      }
   }
   var x = XScroll.hasXScroll(el)
   var y = XScroll.hasYScroll(el)
   if (tag == 'textarea') {
      if (x && el.firstChild.scrollWidth <= parseInt(el.style.width) ||
          y && el.firstChild.scrollHeight <= parseInt(el.style.height)) {
         button1.style.display = 'none'
         track.style.display = 'none'
         button2.style.display = 'none'
         if (x) {
            el.firstChild.style.bottom = '0px'
            el.firstChild.style.height = parseInt(el.style.height) + 'px'
         }
         if (y) {
            el.firstChild.style.right = '0px'
            el.firstChild.style.width = parseInt(el.style.width) + 'px'
         }
      }
   }
   el.appendChild(button1)
   el.appendChild(track)
   el.appendChild(button2)
   track.appendChild(thumb)
   addEventHandler(thumb, 'mousedown', function(event) {
      var e = event || window.event
      if (XScroll.hasXScroll(this.parentNode.parentNode)) {
         XScroll.delta = e.clientX - window.scrollX - this.getBoundingClientRect().left
      } else {
         XScroll.delta = e.clientY - window.scrollY - this.getBoundingClientRect().top
      }
      XScroll.drag = true
      XScroll.object = this
      cancelEvent(e)
      cancelSelection()
   })
   addEventHandler(document, 'mousemove', function(event) {
      if (!XScroll.drag) return
      var e = event || window.event
      if (XScroll.hasXScroll(XScroll.object.parentNode.parentNode)) {
         var x = e.clientX - window.scrollX - XScroll.delta - XScroll.object.parentNode.getBoundingClientRect().left
         if (x < 0) x = 0
         if (x > XScroll.object.parentNode.clientWidth - XScroll.object.clientWidth) {
            x = XScroll.object.parentNode.clientWidth - XScroll.object.clientWidth
         }
         XScroll.object.style.left = x + 'px'
         XScroll.scrollX(XScroll.object.parentNode.parentNode, x / (XScroll.object.parentNode.clientWidth - XScroll.object.clientWidth))
      } else {
         var y = e.clientY - window.scrollY - XScroll.delta - XScroll.object.parentNode.getBoundingClientRect().top
         if (y < 0) y = 0
         if (y > XScroll.object.parentNode.clientHeight - XScroll.object.clientHeight) {
            y = XScroll.object.parentNode.clientHeight - XScroll.object.clientHeight
         }
         XScroll.object.style.top = y + 'px'
         XScroll.scrollY(XScroll.object.parentNode.parentNode, y / (XScroll.object.parentNode.clientHeight - XScroll.object.clientHeight))
      }
      if (e.preventDefault) e.preventDefault()
   })
   addEventHandler(document, 'mouseup', function(event) {
      if (!XScroll.drag) return
      XScroll.delta = 0
      XScroll.drag = false
      XScroll.object = null
      restoreSelection()
   })

   if (XScroll.hasXScroll(el)) {
      addEventHandler(button1, 'mousedown', function(event) {
         if (XScroll.timer) return
         XScroll.scrollLeft(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollLeft(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
      addEventHandler(button1, 'touchstart', function(event) {
         XScroll.scrollLeft(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollLeft(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
      addEventHandler(button2, 'mousedown', function(event) {
         if (XScroll.timer) return
         XScroll.scrollRight(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollRight(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
      addEventHandler(button2, 'touchstart', function(event) {
         XScroll.scrollRight(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollRight(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
   } else {
      addEventHandler(button1, 'mousedown', function(event) {
         if (XScroll.timer) return
         XScroll.scrollUp(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollUp(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
      addEventHandler(button1, 'touchstart', function(event) {
         XScroll.scrollUp(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollUp(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
      addEventHandler(button2, 'mousedown', function(event) {
         if (XScroll.timer) return
         XScroll.scrollDown(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollDown(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
      addEventHandler(button2, 'touchstart', function(event) {
         XScroll.scrollDown(this.parentNode, 40)
         XScroll.timer = setTimeout((function() {
            XScroll.cont = true
            XScroll.object = this.parentNode
            XScroll.private.scrollCont((function() { XScroll.scrollDown(this.parentNode, 40) }).bind(this))
         }).bind(this), 450)
         cancelEvent(event)
      })
   }

   if (tag == 'textarea') {
      addEventHandler(el.firstChild, 'input', function() {
         var x = XScroll.hasXScroll(this.parentNode)
         var y = XScroll.hasYScroll(this.parentNode)
         if (x && this.scrollWidth <= this.clientWidth ||
             y && this.scrollHeight <= this.clientHeight) {
            for (var i = 1; i < 4; i++) {
               this.parentNode.children[i].style.display = 'none'
            }
            if (x) {
               this.style.bottom = '0px'
               this.style.height = this.parentNode.clientHeight + 'px'
            }
            if (y) {
               this.style.right = '0px'
               this.style.width = this.parentNode.clientWidth + 'px'
            }
         } else {
            for (var i = 1; i < 4; i++) {
               this.parentNode.children[i].style.display = 'block'
            }
            var size = 10
            if (this.parentNode.getAttribute('scroll-size')) {
               size = Math.max(parseInt(this.parentNode.getAttribute('scroll-size')), 2)
            }
            if (x) {
               this.style.bottom = size + 'px'
               this.style.height = this.parentNode.clientHeight - size + 'px'
            }
            if (y) {
               this.style.right = size + 'px'
               this.style.width = this.parentNode.clientWidth - size + 'px'
            }
            XScroll.updateThumbPosition(this.parentNode)
         }
      })
      addEventHandler(el.firstChild, 'scroll', function() { XScroll.updateThumbPosition(this.parentNode) })
      Object.defineProperty(el, 'value', {
         get: function() {
            return this.firstChild && this.firstChild.value;
         },
         set: function(value) {
            if (this.firstChild && this.firstChild.value) {
               this.firstChild.value = value;
               XScroll.updateThumbPosition(this)
               if (this.firstChild.fireEvent) {
                  this.firstChild.fireEvent('oninput');
               } else if (this.firstChild.dispatchEvent) {
                  var event = document.createEvent('HTMLEvents');
                  event.initEvent('input', true, true);
                  this.firstChild.dispatchEvent(event);
               }
            }
         }
      });
   }

   Object.defineProperty(el, 'scrollLeft', {
      get: function() {
         return XScroll.getXPosition(this);
      },
      set: function(value) {
         XScroll.scrollToX(this, value);
      }
   });

   Object.defineProperty(el, 'scrollTop', {
      get: function() {
         return XScroll.getYPosition(this);
      },
      set: function(value) {
         XScroll.scrollToY(this, value);
      }
   });

   addEventHandler(button1, 'mouseup', this.private.stopScroll)
   addEventHandler(button2, 'mouseup', this.private.stopScroll)
   addEventHandler(button1, 'touchend', this.private.stopScroll)
   addEventHandler(button2, 'touchend', this.private.stopScroll)
   addEventHandler(button1, 'mouseout', this.private.stopScroll)
   addEventHandler(button2, 'mouseout', this.private.stopScroll)
   addEventHandler(button1, 'click', cancelEvent)
   addEventHandler(button2, 'click', cancelEvent)

   addEventHandler(track, 'mousedown', function(event) {
      var e = event || window.event
      if (XScroll.hasXScroll(this.parentNode)) {
         var pos = this.firstElementChild.getBoundingClientRect().left
         var x = -parseInt(this.parentNode.firstElementChild.style.left)
         delta = Math.round(this.parentNode.clientWidth * 0.1)
         if (e.clientX - window.scrollX > pos) {
            XScroll.scrollToX(this.parentNode, x+delta)
         } else {
            XScroll.scrollToX(this.parentNode, x-delta)
         }
      } else {
         var pos = this.firstElementChild.getBoundingClientRect().top
         var y = -parseInt(this.parentNode.firstElementChild.style.top)
         delta = this.parentNode.clientHeight
         if (e.clientY - window.scrollY > pos) {
            XScroll.scrollToY(this.parentNode, y+delta)
         } else {
            XScroll.scrollToY(this.parentNode, y-delta)
         }
      }
   })
   addEventHandler(track, 'click', cancelEvent)
   addEventHandler(thumb, 'click', cancelEvent)


   addWheelHandler(el, function(event) {
      var delta;
      event = event || window.event;

      if (event.wheelDelta) {
         delta = -event.wheelDelta / 120;
      }
      else if (event.detail) {
         delta = event.detail / 3;
      } else {
         delta = event.deltaY / 3;
      }

      if (event.preventDefault) event.preventDefault();
      event.returnValue = false;

      if (XScroll.hasXScroll(this)) {
         var x = XScroll.getXPosition(this)
         if (this.getAttribute('scroll-delta')) {
            x += delta * parseInt(this.getAttribute('scroll-delta'))
         } else {
            x += delta * 60
         }
         XScroll.scrollToX(this, x)
      } else {
         var y = XScroll.getYPosition(this)
         if (this.getAttribute('scroll-delta')) {
            y += delta * parseInt(this.getAttribute('scroll-delta'))
         } else {
            y += delta * 60
         }
         XScroll.scrollToY(this, y)
      }
   })
   this.addTouchSupport(el)
}

XScroll.addListener = function(element, type, listener, obj) {
   if (element && !element.listeners) element.listeners = {}
   if (!element) var c = this.listeners
   else var c = element.listeners

   if (!obj) obj = element

   if (c[type] == undefined) c[type] = []
   var key = this.getKey()
   var fn = function() { listener.call(obj, XScroll.getXPosition(element), XScroll.getYPosition(element)) }
   c[type].push({"key": key, "listener": fn})

   return key
}

XScroll.removeListener = function(element, key, type) {
   if (key == null) return false;
   var c
   if (!player) c = this.listeners
   else c = element.listeners

   if (c == undefined) c = {}

   if (type == null) {
      for (var type in c) {
         for (var i = 0; i < c[type].length; i++) {
            if (c[type][i] == null) continue;
            if (c[type][i].key == key) {
               c[type][i] = null;
               return true;
            }
         }
      }
   } else {
      for (var i = 0; i < c[type].length; i++) {
         if (c[type][i] == null) continue;
         if (c[type][i].key == key) {
            c[type][i] = null;
            return true;
         }
      }
   }
   return false;
}

XScroll.fireEvent = function(element, type) {
   var args = Array.prototype.slice.call(arguments, 2)

   var c = element.listeners
   if (c && c[type] != undefined) {
      for (var i = 0; i < c[type].length; i++) {
         if (c[type][i] == null) continue;
         c[type][i].listener()
      }
   }

   var c = this.listeners
   if (c && c[type] != undefined) {
      for (var i = 0; i < c[type].length; i++) {
         if (c[type][i] == null) continue;
         c[type][i].listener.apply(null, args)
      }
   }
}

XScroll.getKey = function() {
   var result = ''
   for (var i = 0; i < 16; i++) {
      var n = Math.floor(Math.random() * 62)
      if (n < 26) {
          result += String.fromCharCode(n + 65)
      }
      if (n >= 26 && n < 52) {
         result += String.fromCharCode(n + 71)
      }
      if (n >= 52) {
         result += String.fromCharCode(n - 4)
      }
   }
   return result
}

XScroll.listeners = {}

XScroll.touch = {
   speed: [0, 0],
   a: 0.3,
   limit: 34,
   timer1: null,
   timer2: null,
   down: false,
   coords: [0, 0],
   delta: [0, 0],
   e: [0, 0],
   prevent: false
}

XScroll.addTouchSupport = function(el) {

   el.children[0].ontouchstart = function(event) {
      if (event.targetTouches && event.targetTouches.length) {
         event.clientX = event.targetTouches[0].clientX
         event.clientY = event.targetTouches[0].clientY
         if (event.preventDefault) {
            XScroll.touch.prevent = true
            if (el.hasAttribute('prevent-default-touch-action') || XScroll.touch.speed[0] != 0 || XScroll.touch.speed[1] != 0) {
               event.preventDefault()
            }
         }
      }
      XScroll.object = this.parentNode
      XScroll.touch.down = true
      XScroll.touch.coords = [XScroll.getXPosition(XScroll.object), XScroll.getYPosition(XScroll.object)]
      XScroll.touch.e = [event.clientX, event.clientY]
      XScroll.touch.delta = [event.clientX + XScroll.getXPosition(XScroll.object), event.clientY + XScroll.getYPosition(XScroll.object)]
      if (!XScroll.touch.timer1) XScroll.touch.timer1 = setInterval(function() {
         if (!XScroll.touch.down) {
            var c = XScroll.object.children[0]
            var w = c.tagName.toLowerCase() != 'textarea' ? c.clientWidth : c.scrollWidth
            var h = c.tagName.toLowerCase() != 'textarea' ? c.clientHeight : c.scrollHeight
            if (XScroll.hasXScroll(XScroll.object)) XScroll.scrollToX(XScroll.object, Math.round(XScroll.getXPosition(XScroll.object) + XScroll.touch.speed[0]))
            if (XScroll.hasYScroll(XScroll.object)) XScroll.scrollToY(XScroll.object, Math.round(XScroll.getYPosition(XScroll.object) + XScroll.touch.speed[1]))
            if (XScroll.getXPosition(XScroll.object) == w) {
               XScroll.touch.speed[0] *= -0.2
               if (!XScroll.object.hasAttribute('touch-bounce')) XScroll.touch.speed[0] = 0
            }
            if (XScroll.getYPosition(XScroll.object) == h) {
               XScroll.touch.speed[1] *= -0.2
               if (!XScroll.object.hasAttribute('touch-bounce')) XScroll.touch.speed[1] = 0
            }
            if (XScroll.getXPosition(XScroll.object) == 0) {
               XScroll.touch.speed[0] *= -0.2
               if (!XScroll.object.hasAttribute('touch-bounce')) XScroll.touch.speed[0] = 0
            }
            if (XScroll.getYPosition(XScroll.object) == 0) {
               XScroll.touch.speed[1] *= -0.2
               if (!XScroll.object.hasAttribute('touch-bounce')) XScroll.touch.speed[1] = 0
            }
            var a = [XScroll.touch.a, XScroll.touch.a]
            if (Math.abs(XScroll.touch.speed[0]) < Math.abs(XScroll.touch.speed[1])) a[0] = a[1] * Math.abs(XScroll.touch.speed[0] / XScroll.touch.speed[1])
            if (Math.abs(XScroll.touch.speed[1]) < Math.abs(XScroll.touch.speed[0])) a[1] = a[0] * Math.abs(XScroll.touch.speed[1] / XScroll.touch.speed[0])
            var s = [XScroll.touch.speed[0], XScroll.touch.speed[1]]
            XScroll.touch.speed[0] = XScroll.touch.speed[0] - sign(XScroll.touch.speed[0]) * a[0]
            if (XScroll.touch.speed[0] * s[0] < 0) XScroll.touch.speed[0] = 0
            XScroll.touch.speed[1] = XScroll.touch.speed[1] - sign(XScroll.touch.speed[1]) * a[1]
            if (XScroll.touch.speed[1] * s[1] < 0) XScroll.touch.speed[1] = 0

            if (XScroll.touch.speed[0] == 0 && XScroll.touch.speed[1] == 0) {
               clearInterval(XScroll.touch.timer1)
               XScroll.fireEvent(XScroll.object, 'scrollend')
               XScroll.object = null
               XScroll.touch.prevent = false
               XScroll.touch.timer1 = null
            }
         }
      }, 30)
      XScroll.touch.timer2 = setInterval(function() {
         if (XScroll.touch.down) {
            var c = XScroll.object.children[0]
            XScroll.touch.speed = [Math.round((XScroll.getXPosition(XScroll.object) - XScroll.touch.coords[0]) / 2.75), Math.round((XScroll.getYPosition(XScroll.object) - XScroll.touch.coords[1]) / 2.75)]
            if (Math.abs(XScroll.touch.speed[0]) > XScroll.touch.limit) XScroll.touch.speed[0] = sign(XScroll.touch.speed[0]) * XScroll.touch.limit
            if (Math.abs(XScroll.touch.speed[1]) > XScroll.touch.limit) XScroll.touch.speed[1] = sign(XScroll.touch.speed[1]) * XScroll.touch.limit
            if (!XScroll.hasXScroll(XScroll.object)) XScroll.touch.speed[0] = 0
            if (!XScroll.hasYScroll(XScroll.object)) XScroll.touch.speed[1] = 0
            XScroll.touch.coords = [XScroll.getXPosition(XScroll.object), XScroll.getYPosition(XScroll.object)]
         }
      }, 80)
   }
   document.ontouchmove = function(event) {
      if (XScroll.touch.down) {
         if (event.targetTouches && event.targetTouches.length) {
            event.clientX = event.targetTouches[0].clientX
            event.clientY = event.targetTouches[0].clientY
         }
         event.preventDefault()
         var x = XScroll.touch.delta[0] - event.clientX
         var y = XScroll.touch.delta[1] - event.clientY
         if (XScroll.hasXScroll(XScroll.object)) XScroll.scrollToX(XScroll.object, x)
         if (XScroll.hasYScroll(XScroll.object)) XScroll.scrollToY(XScroll.object, y)
         //var s = getSelection()
         //s.removeAllRanges()
      }
   }
   document.ontouchend = function(event) {
      XScroll.touch.down = false
      clearInterval(XScroll.touch.timer2)
   }
   el.ontouchend = function(event) {
      if (event.targetTouches && event.targetTouches.length) {
         event.clientX = event.targetTouches[0].clientX
         event.clientY = event.targetTouches[0].clientY
      }
      if (XScroll.touch.down && (Math.abs(event.clientX - XScroll.touch.e[0]) >= 8 || Math.abs(event.clientY - XScroll.touch.e[1]) >= 8)) {
         var q = [2.75, 2.75]
         if (Math.abs(event.clientX - XScroll.touch.e[0]) < 20) q[0] = 0.75
         if (Math.abs(event.clientY - XScroll.touch.e[1]) < 20) q[1] = 0.75
         XScroll.touch.speed = [Math.round((XScroll.getXPosition(XScroll.object) - XScroll.touch.coords[0]) / q[0]), Math.round((XScroll.getYPosition(XScroll.object) - XScroll.touch.coords[1]) / q[1])]
         if (Math.abs(XScroll.touch.speed[0]) > XScroll.touch.limit) XScroll.touch.speed[0] = sign(XScroll.touch.speed[0]) * XScroll.touch.limit
         if (Math.abs(XScroll.touch.speed[1]) > XScroll.touch.limit) XScroll.touch.speed[1] = sign(XScroll.touch.speed[1]) * XScroll.touch.limit
         if (!XScroll.hasXScroll(XScroll.object)) XScroll.touch.speed[0] = 0
         if (!XScroll.hasYScroll(XScroll.object)) XScroll.touch.speed[1] = 0
         XScroll.touch.coords = [XScroll.getXPosition(XScroll.object), XScroll.getYPosition(XScroll.object)]
      }
   }
   function sign(n) {
      if (n > 0) return 1
      else if (n < 0) return -1
      return 0
   }
   XScroll.processChildren(el)
}

XScroll.processChildren = function(el) {
   var ch = getChildrenRecursive(el.children[0]).slice(1)
   for (var i = 0; i < ch.length; i++) {
      addEventHandler(ch[i], 'touchstart', function(event) {
         if (XScroll.touch.prevent || event.target != this) return
         /*try {
            var e = document.createEvent('HTMLEvents')
            e.initEvent('click', true, true)
            this.dispatchEvent(e)
            event.preventDefault()
         } catch(ex) {
            if (this.onclick && this.onclick instanceof Function) this.onclick.call(this, { type: 'click', target: this })
         }*/
      })
   }
}

window.getChildrenRecursive = function(el) {
   var result = [el]
   for (var i = 0; i < el.children.length; i++) {
      result = result.concat(Array.prototype.slice.call(getChildrenRecursive(el.children[i])))
   }
   return result
}

if (!window.getElementsByClass) {
   window.getElementsByClass = function(searchClass, node, tag) {
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
}

if (!window.addWheelHandler) {
   window.addWheelHandler = function(elem, func) {
      if (elem.addEventListener) {
         if ('onwheel' in document) {
            // IE9+, FF17+
            elem.addEventListener ("wheel", func, false);
         } else if ('onmousewheel' in document) {
            // устаревший вариант события
            elem.addEventListener ("mousewheel", func, false);
         } else {
             // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
             elem.addEventListener ("MozMousePixelScroll", func, false);
         }
       } else { // IE<9
          elem.attachEvent ("onmousewheel", func);
       }
   }
}

if (!window.cancelEvent) {
   window.cancelEvent = function(event) {
      var e = event || window.event
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
      if (e.preventDefault) e.preventDefault()
      e.returnValue = false
   }
}

function cancelSelection() {
   XScroll.st = document.createElement('style')
   XScroll.st.innerText = '*::selection { background: rgba(0, 0, 0, 0); }'
   document.body.appendChild(XScroll.st)
}

function restoreSelection() {
   document.body.removeChild(XScroll.st)
   XScroll.st = null
}

function addEventHandler(obj, type, func) {
   if (document.addEventListener) obj.addEventListener(type, func, false)
   else obj.attachEvent('on' + type, func)
}