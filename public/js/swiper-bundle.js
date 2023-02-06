/**
 * Swiper 8.1.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: April 15, 2022
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
})(this, (function () { 'use strict';

    /**
     * SSR Window 4.0.2
     * Better handling for window object in SSR environment
     * https://github.com/nolimits4web/ssr-window
     *
     * Copyright 2021, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: December 13, 2021
     */

    /* eslint-disable no-param-reassign */
    function isObject$1(obj) {
      return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
    }

    function extend$1(target, src) {
      if (target === void 0) {
        target = {};
      }

      if (src === void 0) {
        src = {};
      }

      Object.keys(src).forEach(key => {
        if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
          extend$1(target[key], src[key]);
        }
      });
    }

    const ssrDocument = {
      body: {},

      addEventListener() {},

      removeEventListener() {},

      activeElement: {
        blur() {},

        nodeName: ''
      },

      querySelector() {
        return null;
      },

      querySelectorAll() {
        return [];
      },

      getElementById() {
        return null;
      },

      createEvent() {
        return {
          initEvent() {}

        };
      },

      createElement() {
        return {
          children: [],
          childNodes: [],
          style: {},

          setAttribute() {},

          getElementsByTagName() {
            return [];
          }

        };
      },

      createElementNS() {
        return {};
      },

      importNode() {
        return null;
      },

      location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: ''
      }
    };

    function getDocument() {
      const doc = typeof document !== 'undefined' ? document : {};
      extend$1(doc, ssrDocument);
      return doc;
    }

    const ssrWindow = {
      document: ssrDocument,
      navigator: {
        userAgent: ''
      },
      location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: ''
      },
      history: {
        replaceState() {},

        pushState() {},

        go() {},

        back() {}

      },
      CustomEvent: function CustomEvent() {
        return this;
      },

      addEventListener() {},

      removeEventListener() {},

      getComputedStyle() {
        return {
          getPropertyValue() {
            return '';
          }

        };
      },

      Image() {},

      Date() {},

      screen: {},

      setTimeout() {},

      clearTimeout() {},

      matchMedia() {
        return {};
      },

      requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
          callback();
          return null;
        }

        return setTimeout(callback, 0);
      },

      cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
          return;
        }

        clearTimeout(id);
      }

    };

    function getWindow() {
      const win = typeof window !== 'undefined' ? window : {};
      extend$1(win, ssrWindow);
      return win;
    }

    /**
     * Dom7 4.0.4
     * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
     * https://framework7.io/docs/dom7.html
     *
     * Copyright 2022, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: January 11, 2022
     */
    /* eslint-disable no-proto */

    function makeReactive(obj) {
      const proto = obj.__proto__;
      Object.defineProperty(obj, '__proto__', {
        get() {
          return proto;
        },

        set(value) {
          proto.__proto__ = value;
        }

      });
    }

    class Dom7 extends Array {
      constructor(items) {
        if (typeof items === 'number') {
          super(items);
        } else {
          super(...(items || []));
          makeReactive(this);
        }
      }

    }

    function arrayFlat(arr) {
      if (arr === void 0) {
        arr = [];
      }

      const res = [];
      arr.forEach(el => {
        if (Array.isArray(el)) {
          res.push(...arrayFlat(el));
        } else {
          res.push(el);
        }
      });
      return res;
    }

    function arrayFilter(arr, callback) {
      return Array.prototype.filter.call(arr, callback);
    }

    function arrayUnique(arr) {
      const uniqueArray = [];

      for (let i = 0; i < arr.length; i += 1) {
        if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
      }

      return uniqueArray;
    }


    function qsa(selector, context) {
      if (typeof selector !== 'string') {
        return [selector];
      }

      const a = [];
      const res = context.querySelectorAll(selector);

      for (let i = 0; i < res.length; i += 1) {
        a.push(res[i]);
      }

      return a;
    }

    function $(selector, context) {
      const window = getWindow();
      const document = getDocument();
      let arr = [];

      if (!context && selector instanceof Dom7) {
        return selector;
      }

      if (!selector) {
        return new Dom7(arr);
      }

      if (typeof selector === 'string') {
        const html = selector.trim();

        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
          let toCreate = 'div';
          if (html.indexOf('<li') === 0) toCreate = 'ul';
          if (html.indexOf('<tr') === 0) toCreate = 'tbody';
          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
          if (html.indexOf('<tbody') === 0) toCreate = 'table';
          if (html.indexOf('<option') === 0) toCreate = 'select';
          const tempParent = document.createElement(toCreate);
          tempParent.innerHTML = html;

          for (let i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          arr = qsa(selector.trim(), context || document);
        } // arr = qsa(selector, document);

      } else if (selector.nodeType || selector === window || selector === document) {
        arr.push(selector);
      } else if (Array.isArray(selector)) {
        if (selector instanceof Dom7) return selector;
        arr = selector;
      }

      return new Dom7(arrayUnique(arr));
    }

    $.fn = Dom7.prototype; // eslint-disable-next-line

    function addClass() {
      for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
        classes[_key] = arguments[_key];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        el.classList.add(...classNames);
      });
      return this;
    }

    function removeClass() {
      for (var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        classes[_key2] = arguments[_key2];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        el.classList.remove(...classNames);
      });
      return this;
    }

    function toggleClass() {
      for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        classes[_key3] = arguments[_key3];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        classNames.forEach(className => {
          el.classList.toggle(className);
        });
      });
    }

    function hasClass() {
      for (var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        classes[_key4] = arguments[_key4];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      return arrayFilter(this, el => {
        return classNames.filter(className => el.classList.contains(className)).length > 0;
      }).length > 0;
    }

    function attr(attrs, value) {
      if (arguments.length === 1 && typeof attrs === 'string') {
        // Get attr
        if (this[0]) return this[0].getAttribute(attrs);
        return undefined;
      } // Set attrs


      for (let i = 0; i < this.length; i += 1) {
        if (arguments.length === 2) {
          // String
          this[i].setAttribute(attrs, value);
        } else {
          // Object
          for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
          }
        }
      }

      return this;
    }

    function removeAttr(attr) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].removeAttribute(attr);
      }

      return this;
    }

    function transform(transform) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].style.transform = transform;
      }

      return this;
    }

    function transition$1(duration) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
      }

      return this;
    }

    function on() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
        [eventType, listener, capture] = args;
        targetSelector = undefined;
      }

      if (!capture) capture = false;

      function handleLiveEvent(e) {
        const target = e.target;
        if (!target) return;
        const eventData = e.target.dom7EventData || [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
          const parents = $(target).parents(); // eslint-disable-line

          for (let k = 0; k < parents.length; k += 1) {
            if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
          }
        }
      }

      function handleEvent(e) {
        const eventData = e && e.target ? e.target.dom7EventData || [] : [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        listener.apply(this, eventData);
      }

      const events = eventType.split(' ');
      let j;

      for (let i = 0; i < this.length; i += 1) {
        const el = this[i];

        if (!targetSelector) {
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            if (!el.dom7Listeners) el.dom7Listeners = {};
            if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
            el.dom7Listeners[event].push({
              listener,
              proxyListener: handleEvent
            });
            el.addEventListener(event, handleEvent, capture);
          }
        } else {
          // Live events
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
            if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
            el.dom7LiveListeners[event].push({
              listener,
              proxyListener: handleLiveEvent
            });
            el.addEventListener(event, handleLiveEvent, capture);
          }
        }
      }

      return this;
    }

    function off() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
        [eventType, listener, capture] = args;
        targetSelector = undefined;
      }

      if (!capture) capture = false;
      const events = eventType.split(' ');

      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];

        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];
          let handlers;

          if (!targetSelector && el.dom7Listeners) {
            handlers = el.dom7Listeners[event];
          } else if (targetSelector && el.dom7LiveListeners) {
            handlers = el.dom7LiveListeners[event];
          }

          if (handlers && handlers.length) {
            for (let k = handlers.length - 1; k >= 0; k -= 1) {
              const handler = handlers[k];

              if (listener && handler.listener === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (!listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              }
            }
          }
        }
      }

      return this;
    }

    function trigger() {
      const window = getWindow();

      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      const events = args[0].split(' ');
      const eventData = args[1];

      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];

        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];

          if (window.CustomEvent) {
            const evt = new window.CustomEvent(event, {
              detail: eventData,
              bubbles: true,
              cancelable: true
            });
            el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
            el.dispatchEvent(evt);
            el.dom7EventData = [];
            delete el.dom7EventData;
          }
        }
      }

      return this;
    }

    function transitionEnd$1(callback) {
      const dom = this;

      function fireCallBack(e) {
        if (e.target !== this) return;
        callback.call(this, e);
        dom.off('transitionend', fireCallBack);
      }

      if (callback) {
        dom.on('transitionend', fireCallBack);
      }

      return this;
    }

    function outerWidth(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
        }

        return this[0].offsetWidth;
      }

      return null;
    }

    function outerHeight(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
        }

        return this[0].offsetHeight;
      }

      return null;
    }

    function offset() {
      if (this.length > 0) {
        const window = getWindow();
        const document = getDocument();
        const el = this[0];
        const box = el.getBoundingClientRect();
        const body = document.body;
        const clientTop = el.clientTop || body.clientTop || 0;
        const clientLeft = el.clientLeft || body.clientLeft || 0;
        const scrollTop = el === window ? window.scrollY : el.scrollTop;
        const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
        return {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft
        };
      }

      return null;
    }

    function styles() {
      const window = getWindow();
      if (this[0]) return window.getComputedStyle(this[0], null);
      return {};
    }

    function css(props, value) {
      const window = getWindow();
      let i;

      if (arguments.length === 1) {
        if (typeof props === 'string') {
          // .css('width')
          if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
          // .css({ width: '100px' })
          for (i = 0; i < this.length; i += 1) {
            for (const prop in props) {
              this[i].style[prop] = props[prop];
            }
          }

          return this;
        }
      }

      if (arguments.length === 2 && typeof props === 'string') {
        // .css('width', '100px')
        for (i = 0; i < this.length; i += 1) {
          this[i].style[props] = value;
        }

        return this;
      }

      return this;
    }

    function each(callback) {
      if (!callback) return this;
      this.forEach((el, index) => {
        callback.apply(el, [el, index]);
      });
      return this;
    }

    function filter(callback) {
      const result = arrayFilter(this, callback);
      return $(result);
    }

    function html(html) {
      if (typeof html === 'undefined') {
        return this[0] ? this[0].innerHTML : null;
      }

      for (let i = 0; i < this.length; i += 1) {
        this[i].innerHTML = html;
      }

      return this;
    }

    function text(text) {
      if (typeof text === 'undefined') {
        return this[0] ? this[0].textContent.trim() : null;
      }

      for (let i = 0; i < this.length; i += 1) {
        this[i].textContent = text;
      }

      return this;
    }

    function is(selector) {
      const window = getWindow();
      const document = getDocument();
      const el = this[0];
      let compareWith;
      let i;
      if (!el || typeof selector === 'undefined') return false;

      if (typeof selector === 'string') {
        if (el.matches) return el.matches(selector);
        if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
        if (el.msMatchesSelector) return el.msMatchesSelector(selector);
        compareWith = $(selector);

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      if (selector === document) {
        return el === document;
      }

      if (selector === window) {
        return el === window;
      }

      if (selector.nodeType || selector instanceof Dom7) {
        compareWith = selector.nodeType ? [selector] : selector;

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      return false;
    }

    function index() {
      let child = this[0];
      let i;

      if (child) {
        i = 0; // eslint-disable-next-line

        while ((child = child.previousSibling) !== null) {
          if (child.nodeType === 1) i += 1;
        }

        return i;
      }

      return undefined;
    }

    function eq(index) {
      if (typeof index === 'undefined') return this;
      const length = this.length;

      if (index > length - 1) {
        return $([]);
      }

      if (index < 0) {
        const returnIndex = length + index;
        if (returnIndex < 0) return $([]);
        return $([this[returnIndex]]);
      }

      return $([this[index]]);
    }

    function append() {
      let newChild;
      const document = getDocument();

      for (let k = 0; k < arguments.length; k += 1) {
        newChild = k < 0 || arguments.length <= k ? undefined : arguments[k];

        for (let i = 0; i < this.length; i += 1) {
          if (typeof newChild === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;

            while (tempDiv.firstChild) {
              this[i].appendChild(tempDiv.firstChild);
            }
          } else if (newChild instanceof Dom7) {
            for (let j = 0; j < newChild.length; j += 1) {
              this[i].appendChild(newChild[j]);
            }
          } else {
            this[i].appendChild(newChild);
          }
        }
      }

      return this;
    }

    function prepend(newChild) {
      const document = getDocument();
      let i;
      let j;

      for (i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newChild;

          for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
          }
        } else if (newChild instanceof Dom7) {
          for (j = 0; j < newChild.length; j += 1) {
            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
          }
        } else {
          this[i].insertBefore(newChild, this[i].childNodes[0]);
        }
      }

      return this;
    }

    function next(selector) {
      if (this.length > 0) {
        if (selector) {
          if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
            return $([this[0].nextElementSibling]);
          }

          return $([]);
        }

        if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function nextAll(selector) {
      const nextEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.nextElementSibling) {
        const next = el.nextElementSibling; // eslint-disable-line

        if (selector) {
          if ($(next).is(selector)) nextEls.push(next);
        } else nextEls.push(next);

        el = next;
      }

      return $(nextEls);
    }

    function prev(selector) {
      if (this.length > 0) {
        const el = this[0];

        if (selector) {
          if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
            return $([el.previousElementSibling]);
          }

          return $([]);
        }

        if (el.previousElementSibling) return $([el.previousElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function prevAll(selector) {
      const prevEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.previousElementSibling) {
        const prev = el.previousElementSibling; // eslint-disable-line

        if (selector) {
          if ($(prev).is(selector)) prevEls.push(prev);
        } else prevEls.push(prev);

        el = prev;
      }

      return $(prevEls);
    }

    function parent(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        if (this[i].parentNode !== null) {
          if (selector) {
            if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
          } else {
            parents.push(this[i].parentNode);
          }
        }
      }

      return $(parents);
    }

    function parents(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        let parent = this[i].parentNode; // eslint-disable-line

        while (parent) {
          if (selector) {
            if ($(parent).is(selector)) parents.push(parent);
          } else {
            parents.push(parent);
          }

          parent = parent.parentNode;
        }
      }

      return $(parents);
    }

    function closest(selector) {
      let closest = this; // eslint-disable-line

      if (typeof selector === 'undefined') {
        return $([]);
      }

      if (!closest.is(selector)) {
        closest = closest.parents(selector).eq(0);
      }

      return closest;
    }

    function find(selector) {
      const foundElements = [];

      for (let i = 0; i < this.length; i += 1) {
        const found = this[i].querySelectorAll(selector);

        for (let j = 0; j < found.length; j += 1) {
          foundElements.push(found[j]);
        }
      }

      return $(foundElements);
    }

    function children(selector) {
      const children = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        const childNodes = this[i].children;

        for (let j = 0; j < childNodes.length; j += 1) {
          if (!selector || $(childNodes[j]).is(selector)) {
            children.push(childNodes[j]);
          }
        }
      }

      return $(children);
    }

    function remove() {
      for (let i = 0; i < this.length; i += 1) {
        if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
      }

      return this;
    }

    const Methods = {
      addClass,
      removeClass,
      hasClass,
      toggleClass,
      attr,
      removeAttr,
      transform,
      transition: transition$1,
      on,
      off,
      trigger,
      transitionEnd: transitionEnd$1,
      outerWidth,
      outerHeight,
      styles,
      offset,
      css,
      each,
      html,
      text,
      is,
      index,
      eq,
      append,
      prepend,
      next,
      nextAll,
      prev,
      prevAll,
      parent,
      parents,
      closest,
      find,
      children,
      filter,
      remove
    };
    Object.keys(Methods).forEach(methodName => {
      Object.defineProperty($.fn, methodName, {
        value: Methods[methodName],
        writable: true
      });
    });

    function deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach(key => {
        try {
          object[key] = null;
        } catch (e) {// no getter for object
        }

        try {
          delete object[key];
        } catch (e) {// something got wrong
        }
      });
    }

    function nextTick(callback, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      return setTimeout(callback, delay);
    }

    function now() {
      return Date.now();
    }

    function getComputedStyle$1(el) {
      const window = getWindow();
      let style;

      if (window.getComputedStyle) {
        style = window.getComputedStyle(el, null);
      }

      if (!style && el.currentStyle) {
        style = el.currentStyle;
      }

      if (!style) {
        style = el.style;
      }

      return style;
    }

    function getTranslate(el, axis) {
      if (axis === void 0) {
        axis = 'x';
      }

      const window = getWindow();
      let matrix;
      let curTransform;
      let transformMatrix;
      const curStyle = getComputedStyle$1(el);

      if (window.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;

        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
        } // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case


        transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
      }

      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
      }

      return curTransform || 0;
    }

    function isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function isNode(node) {
      // eslint-disable-next-line
      if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
        return node instanceof HTMLElement;
      }

      return node && (node.nodeType === 1 || node.nodeType === 11);
    }

    function extend() {
      const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
      const noExtend = ['__proto__', 'constructor', 'prototype'];

      for (let i = 1; i < arguments.length; i += 1) {
        const nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];

        if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
          const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend(to[nextKey], nextSource[nextKey]);
                }
              } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                to[nextKey] = {};

                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend(to[nextKey], nextSource[nextKey]);
                }
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }

      return to;
    }

    function setCSSProperty(el, varName, varValue) {
      el.style.setProperty(varName, varValue);
    }

    function animateCSSModeScroll(_ref) {
      let {
        swiper,
        targetPosition,
        side
      } = _ref;
      const window = getWindow();
      const startPosition = -swiper.translate;
      let startTime = null;
      let time;
      const duration = swiper.params.speed;
      swiper.wrapperEl.style.scrollSnapType = 'none';
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      const dir = targetPosition > startPosition ? 'next' : 'prev';

      const isOutOfBound = (current, target) => {
        return dir === 'next' && current >= target || dir === 'prev' && current <= target;
      };

      const animate = () => {
        time = new Date().getTime();

        if (startTime === null) {
          startTime = time;
        }

        const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

        if (isOutOfBound(currentPosition, targetPosition)) {
          currentPosition = targetPosition;
        }

        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });

        if (isOutOfBound(currentPosition, targetPosition)) {
          swiper.wrapperEl.style.overflow = 'hidden';
          swiper.wrapperEl.style.scrollSnapType = '';
          setTimeout(() => {
            swiper.wrapperEl.style.overflow = '';
            swiper.wrapperEl.scrollTo({
              [side]: currentPosition
            });
          });
          window.cancelAnimationFrame(swiper.cssModeFrameID);
          return;
        }

        swiper.cssModeFrameID = window.requestAnimationFrame(animate);
      };

      animate();
    }

    let support;

    function calcSupport() {
      const window = getWindow();
      const document = getDocument();
      return {
        smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
        passiveListener: function checkPassiveListener() {
          let supportsPassive = false;

          try {
            const opts = Object.defineProperty({}, 'passive', {
              // eslint-disable-next-line
              get() {
                supportsPassive = true;
              }

            });
            window.addEventListener('testPassiveListener', null, opts);
          } catch (e) {// No support
          }

          return supportsPassive;
        }(),
        gestures: function checkGestures() {
          return 'ongesturestart' in window;
        }()
      };
    }

    function getSupport() {
      if (!support) {
        support = calcSupport();
      }

      return support;
    }

    let deviceCached;

    function calcDevice(_temp) {
      let {
        userAgent
      } = _temp === void 0 ? {} : _temp;
      const support = getSupport();
      const window = getWindow();
      const platform = window.navigator.platform;
      const ua = userAgent || window.navigator.userAgent;
      const device = {
        ios: false,
        android: false
      };
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

      let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      const windows = platform === 'Win32';
      let macos = platform === 'MacIntel'; // iPadOs 13 fix

      const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

      if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
        ipad = ua.match(/(Version)\/([\d.]+)/);
        if (!ipad) ipad = [0, 1, '13_0_0'];
        macos = false;
      } // Android


      if (android && !windows) {
        device.os = 'android';
        device.android = true;
      }

      if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
      } // Export object


      return device;
    }

    function getDevice(overrides) {
      if (overrides === void 0) {
        overrides = {};
      }

      if (!deviceCached) {
        deviceCached = calcDevice(overrides);
      }

      return deviceCached;
    }

    let browser;

    function calcBrowser() {
      const window = getWindow();

      function isSafari() {
        const ua = window.navigator.userAgent.toLowerCase();
        return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
      }

      return {
        isSafari: isSafari(),
        isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
      };
    }

    function getBrowser() {
      if (!browser) {
        browser = calcBrowser();
      }

      return browser;
    }

    function Resize(_ref) {
      let {
        swiper,
        on,
        emit
      } = _ref;
      const window = getWindow();
      let observer = null;
      let animationFrame = null;

      const resizeHandler = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        emit('beforeResize');
        emit('resize');
      };

      const createObserver = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        observer = new ResizeObserver(entries => {
          animationFrame = window.requestAnimationFrame(() => {
            const {
              width,
              height
            } = swiper;
            let newWidth = width;
            let newHeight = height;
            entries.forEach(_ref2 => {
              let {
                contentBoxSize,
                contentRect,
                target
              } = _ref2;
              if (target && target !== swiper.el) return;
              newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
              newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
            });

            if (newWidth !== width || newHeight !== height) {
              resizeHandler();
            }
          });
        });
        observer.observe(swiper.el);
      };

      const removeObserver = () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        if (observer && observer.unobserve && swiper.el) {
          observer.unobserve(swiper.el);
          observer = null;
        }
      };

      const orientationChangeHandler = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        emit('orientationchange');
      };

      on('init', () => {
        if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
          createObserver();
          return;
        }

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('orientationchange', orientationChangeHandler);
      });
      on('destroy', () => {
        removeObserver();
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('orientationchange', orientationChangeHandler);
      });
    }

    function Observer(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const observers = [];
      const window = getWindow();

      const attach = function (target, options) {
        if (options === void 0) {
          options = {};
        }

        const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        const observer = new ObserverFunc(mutations => {
          // The observerUpdate event should only be triggered
          // once despite the number of mutations.  Additional
          // triggers are redundant and are very costly
          if (mutations.length === 1) {
            emit('observerUpdate', mutations[0]);
            return;
          }

          const observerUpdate = function observerUpdate() {
            emit('observerUpdate', mutations[0]);
          };

          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(observerUpdate);
          } else {
            window.setTimeout(observerUpdate, 0);
          }
        });
        observer.observe(target, {
          attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
          childList: typeof options.childList === 'undefined' ? true : options.childList,
          characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
        observers.push(observer);
      };

      const init = () => {
        if (!swiper.params.observer) return;

        if (swiper.params.observeParents) {
          const containerParents = swiper.$el.parents();

          for (let i = 0; i < containerParents.length; i += 1) {
            attach(containerParents[i]);
          }
        } // Observe container


        attach(swiper.$el[0], {
          childList: swiper.params.observeSlideChildren
        }); // Observe wrapper

        attach(swiper.$wrapperEl[0], {
          attributes: false
        });
      };

      const destroy = () => {
        observers.forEach(observer => {
          observer.disconnect();
        });
        observers.splice(0, observers.length);
      };

      extendParams({
        observer: false,
        observeParents: false,
        observeSlideChildren: false
      });
      on('init', init);
      on('destroy', destroy);
    }

    /* eslint-disable no-underscore-dangle */
    var eventsEmitter = {
      on(events, handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';
        events.split(' ').forEach(event => {
          if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
          self.eventsListeners[event][method](handler);
        });
        return self;
      },

      once(events, handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;

        function onceHandler() {
          self.off(events, onceHandler);

          if (onceHandler.__emitterProxy) {
            delete onceHandler.__emitterProxy;
          }

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          handler.apply(self, args);
        }

        onceHandler.__emitterProxy = handler;
        return self.on(events, onceHandler, priority);
      },

      onAny(handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';

        if (self.eventsAnyListeners.indexOf(handler) < 0) {
          self.eventsAnyListeners[method](handler);
        }

        return self;
      },

      offAny(handler) {
        const self = this;
        if (!self.eventsAnyListeners) return self;
        const index = self.eventsAnyListeners.indexOf(handler);

        if (index >= 0) {
          self.eventsAnyListeners.splice(index, 1);
        }

        return self;
      },

      off(events, handler) {
        const self = this;
        if (!self.eventsListeners) return self;
        events.split(' ').forEach(event => {
          if (typeof handler === 'undefined') {
            self.eventsListeners[event] = [];
          } else if (self.eventsListeners[event]) {
            self.eventsListeners[event].forEach((eventHandler, index) => {
              if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                self.eventsListeners[event].splice(index, 1);
              }
            });
          }
        });
        return self;
      },

      emit() {
        const self = this;
        if (!self.eventsListeners) return self;
        let events;
        let data;
        let context;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (typeof args[0] === 'string' || Array.isArray(args[0])) {
          events = args[0];
          data = args.slice(1, args.length);
          context = self;
        } else {
          events = args[0].events;
          data = args[0].data;
          context = args[0].context || self;
        }

        data.unshift(context);
        const eventsArray = Array.isArray(events) ? events : events.split(' ');
        eventsArray.forEach(event => {
          if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
            self.eventsAnyListeners.forEach(eventHandler => {
              eventHandler.apply(context, [event, ...data]);
            });
          }

          if (self.eventsListeners && self.eventsListeners[event]) {
            self.eventsListeners[event].forEach(eventHandler => {
              eventHandler.apply(context, data);
            });
          }
        });
        return self;
      }

    };

    function updateSize() {
      const swiper = this;
      let width;
      let height;
      const $el = swiper.$el;

      if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
        width = swiper.params.width;
      } else {
        width = $el[0].clientWidth;
      }

      if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
        height = swiper.params.height;
      } else {
        height = $el[0].clientHeight;
      }

      if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
        return;
      } // Subtract paddings


      width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
      height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
      if (Number.isNaN(width)) width = 0;
      if (Number.isNaN(height)) height = 0;
      Object.assign(swiper, {
        width,
        height,
        size: swiper.isHorizontal() ? width : height
      });
    }

    function updateSlides() {
      const swiper = this;

      function getDirectionLabel(property) {
        if (swiper.isHorizontal()) {
          return property;
        } // prettier-ignore


        return {
          'width': 'height',
          'margin-top': 'margin-left',
          'margin-bottom ': 'margin-right',
          'margin-left': 'margin-top',
          'margin-right': 'margin-bottom',
          'padding-left': 'padding-top',
          'padding-right': 'padding-bottom',
          'marginRight': 'marginBottom'
        }[property];
      }

      function getDirectionPropertyValue(node, label) {
        return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      }

      const params = swiper.params;
      const {
        $wrapperEl,
        size: swiperSize,
        rtlTranslate: rtl,
        wrongRTL
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
      const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
      const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
      let snapGrid = [];
      const slidesGrid = [];
      const slidesSizesGrid = [];
      let offsetBefore = params.slidesOffsetBefore;

      if (typeof offsetBefore === 'function') {
        offsetBefore = params.slidesOffsetBefore.call(swiper);
      }

      let offsetAfter = params.slidesOffsetAfter;

      if (typeof offsetAfter === 'function') {
        offsetAfter = params.slidesOffsetAfter.call(swiper);
      }

      const previousSnapGridLength = swiper.snapGrid.length;
      const previousSlidesGridLength = swiper.slidesGrid.length;
      let spaceBetween = params.spaceBetween;
      let slidePosition = -offsetBefore;
      let prevSlideSize = 0;
      let index = 0;

      if (typeof swiperSize === 'undefined') {
        return;
      }

      if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
      }

      swiper.virtualSize = -spaceBetween; // reset margins

      if (rtl) slides.css({
        marginLeft: '',
        marginBottom: '',
        marginTop: ''
      });else slides.css({
        marginRight: '',
        marginBottom: '',
        marginTop: ''
      }); // reset cssMode offsets

      if (params.centeredSlides && params.cssMode) {
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
      }

      const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

      if (gridEnabled) {
        swiper.grid.initSlides(slidesLength);
      } // Calc slides


      let slideSize;
      const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
        return typeof params.breakpoints[key].slidesPerView !== 'undefined';
      }).length > 0;

      for (let i = 0; i < slidesLength; i += 1) {
        slideSize = 0;
        const slide = slides.eq(i);

        if (gridEnabled) {
          swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
        }

        if (slide.css('display') === 'none') continue; // eslint-disable-line

        if (params.slidesPerView === 'auto') {
          if (shouldResetSlideSize) {
            slides[i].style[getDirectionLabel('width')] = ``;
          }

          const slideStyles = getComputedStyle(slide[0]);
          const currentTransform = slide[0].style.transform;
          const currentWebKitTransform = slide[0].style.webkitTransform;

          if (currentTransform) {
            slide[0].style.transform = 'none';
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = 'none';
          }

          if (params.roundLengths) {
            slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
          } else {
            // eslint-disable-next-line
            const width = getDirectionPropertyValue(slideStyles, 'width');
            const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
            const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
            const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
            const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
            const boxSizing = slideStyles.getPropertyValue('box-sizing');

            if (boxSizing && boxSizing === 'border-box') {
              slideSize = width + marginLeft + marginRight;
            } else {
              const {
                clientWidth,
                offsetWidth
              } = slide[0];
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
            }
          }

          if (currentTransform) {
            slide[0].style.transform = currentTransform;
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = currentWebKitTransform;
          }

          if (params.roundLengths) slideSize = Math.floor(slideSize);
        } else {
          slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
          if (params.roundLengths) slideSize = Math.floor(slideSize);

          if (slides[i]) {
            slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
          }
        }

        if (slides[i]) {
          slides[i].swiperSlideSize = slideSize;
        }

        slidesSizesGrid.push(slideSize);

        if (params.centeredSlides) {
          slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
          if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
        } else {
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
          slidePosition = slidePosition + slideSize + spaceBetween;
        }

        swiper.virtualSize += slideSize + spaceBetween;
        prevSlideSize = slideSize;
        index += 1;
      }

      swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

      if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
        $wrapperEl.css({
          width: `${swiper.virtualSize + params.spaceBetween}px`
        });
      }

      if (params.setWrapperSize) {
        $wrapperEl.css({
          [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
        });
      }

      if (gridEnabled) {
        swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
      } // Remove last grid elements depending on width


      if (!params.centeredSlides) {
        const newSlidesGrid = [];

        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

          if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
            newSlidesGrid.push(slidesGridItem);
          }
        }

        snapGrid = newSlidesGrid;

        if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
          snapGrid.push(swiper.virtualSize - swiperSize);
        }
      }

      if (snapGrid.length === 0) snapGrid = [0];

      if (params.spaceBetween !== 0) {
        const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
        slides.filter((_, slideIndex) => {
          if (!params.cssMode) return true;

          if (slideIndex === slides.length - 1) {
            return false;
          }

          return true;
        }).css({
          [key]: `${spaceBetween}px`
        });
      }

      if (params.centeredSlides && params.centeredSlidesBounds) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach(slideSizeValue => {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;
        const maxSnap = allSlidesSize - swiperSize;
        snapGrid = snapGrid.map(snap => {
          if (snap < 0) return -offsetBefore;
          if (snap > maxSnap) return maxSnap + offsetAfter;
          return snap;
        });
      }

      if (params.centerInsufficientSlides) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach(slideSizeValue => {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;

        if (allSlidesSize < swiperSize) {
          const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
          snapGrid.forEach((snap, snapIndex) => {
            snapGrid[snapIndex] = snap - allSlidesOffset;
          });
          slidesGrid.forEach((snap, snapIndex) => {
            slidesGrid[snapIndex] = snap + allSlidesOffset;
          });
        }
      }

      Object.assign(swiper, {
        slides,
        snapGrid,
        slidesGrid,
        slidesSizesGrid
      });

      if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
        const addToSnapGrid = -swiper.snapGrid[0];
        const addToSlidesGrid = -swiper.slidesGrid[0];
        swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
        swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
      }

      if (slidesLength !== previousSlidesLength) {
        swiper.emit('slidesLengthChange');
      }

      if (snapGrid.length !== previousSnapGridLength) {
        if (swiper.params.watchOverflow) swiper.checkOverflow();
        swiper.emit('snapGridLengthChange');
      }

      if (slidesGrid.length !== previousSlidesGridLength) {
        swiper.emit('slidesGridLengthChange');
      }

      if (params.watchSlidesProgress) {
        swiper.updateSlidesOffset();
      }

      if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
        const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
        const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);

        if (slidesLength <= params.maxBackfaceHiddenSlides) {
          if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
        } else if (hasClassBackfaceClassAdded) {
          swiper.$el.removeClass(backFaceHiddenClass);
        }
      }
    }

    function updateAutoHeight(speed) {
      const swiper = this;
      const activeSlides = [];
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let newHeight = 0;
      let i;

      if (typeof speed === 'number') {
        swiper.setTransition(speed);
      } else if (speed === true) {
        swiper.setTransition(swiper.params.speed);
      }

      const getSlideByIndex = index => {
        if (isVirtual) {
          return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
        }

        return swiper.slides.eq(index)[0];
      }; // Find slides currently in view


      if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
        if (swiper.params.centeredSlides) {
          swiper.visibleSlides.each(slide => {
            activeSlides.push(slide);
          });
        } else {
          for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
          }
        }
      } else {
        activeSlides.push(getSlideByIndex(swiper.activeIndex));
      } // Find new height from highest slide in view


      for (i = 0; i < activeSlides.length; i += 1) {
        if (typeof activeSlides[i] !== 'undefined') {
          const height = activeSlides[i].offsetHeight;
          newHeight = height > newHeight ? height : newHeight;
        }
      } // Update Height


      if (newHeight || newHeight === 0) swiper.$wrapperEl.css('height', `${newHeight}px`);
    }

    function updateSlidesOffset() {
      const swiper = this;
      const slides = swiper.slides;

      for (let i = 0; i < slides.length; i += 1) {
        slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
      }
    }

    function updateSlidesProgress(translate) {
      if (translate === void 0) {
        translate = this && this.translate || 0;
      }

      const swiper = this;
      const params = swiper.params;
      const {
        slides,
        rtlTranslate: rtl,
        snapGrid
      } = swiper;
      if (slides.length === 0) return;
      if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
      let offsetCenter = -translate;
      if (rtl) offsetCenter = translate; // Visible Slides

      slides.removeClass(params.slideVisibleClass);
      swiper.visibleSlidesIndexes = [];
      swiper.visibleSlides = [];

      for (let i = 0; i < slides.length; i += 1) {
        const slide = slides[i];
        let slideOffset = slide.swiperSlideOffset;

        if (params.cssMode && params.centeredSlides) {
          slideOffset -= slides[0].swiperSlideOffset;
        }

        const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
        const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
        const slideBefore = -(offsetCenter - slideOffset);
        const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
        const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

        if (isVisible) {
          swiper.visibleSlides.push(slide);
          swiper.visibleSlidesIndexes.push(i);
          slides.eq(i).addClass(params.slideVisibleClass);
        }

        slide.progress = rtl ? -slideProgress : slideProgress;
        slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
      }

      swiper.visibleSlides = $(swiper.visibleSlides);
    }

    function updateProgress(translate) {
      const swiper = this;

      if (typeof translate === 'undefined') {
        const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

        translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
      }

      const params = swiper.params;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      let {
        progress,
        isBeginning,
        isEnd
      } = swiper;
      const wasBeginning = isBeginning;
      const wasEnd = isEnd;

      if (translatesDiff === 0) {
        progress = 0;
        isBeginning = true;
        isEnd = true;
      } else {
        progress = (translate - swiper.minTranslate()) / translatesDiff;
        isBeginning = progress <= 0;
        isEnd = progress >= 1;
      }

      Object.assign(swiper, {
        progress,
        isBeginning,
        isEnd
      });
      if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

      if (isBeginning && !wasBeginning) {
        swiper.emit('reachBeginning toEdge');
      }

      if (isEnd && !wasEnd) {
        swiper.emit('reachEnd toEdge');
      }

      if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
        swiper.emit('fromEdge');
      }

      swiper.emit('progress', progress);
    }

    function updateSlidesClasses() {
      const swiper = this;
      const {
        slides,
        params,
        $wrapperEl,
        activeIndex,
        realIndex
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
      let activeSlide;

      if (isVirtual) {
        activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
      } else {
        activeSlide = slides.eq(activeIndex);
      } // Active classes


      activeSlide.addClass(params.slideActiveClass);

      if (params.loop) {
        // Duplicate to all looped slides
        if (activeSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        }
      } // Next Slide


      let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

      if (params.loop && nextSlide.length === 0) {
        nextSlide = slides.eq(0);
        nextSlide.addClass(params.slideNextClass);
      } // Prev Slide


      let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

      if (params.loop && prevSlide.length === 0) {
        prevSlide = slides.eq(-1);
        prevSlide.addClass(params.slidePrevClass);
      }

      if (params.loop) {
        // Duplicate to all looped slides
        if (nextSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
        }

        if (prevSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
        }
      }

      swiper.emitSlidesClasses();
    }

    function updateActiveIndex(newActiveIndex) {
      const swiper = this;
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
      const {
        slidesGrid,
        snapGrid,
        params,
        activeIndex: previousIndex,
        realIndex: previousRealIndex,
        snapIndex: previousSnapIndex
      } = swiper;
      let activeIndex = newActiveIndex;
      let snapIndex;

      if (typeof activeIndex === 'undefined') {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
              activeIndex = i;
            } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
              activeIndex = i + 1;
            }
          } else if (translate >= slidesGrid[i]) {
            activeIndex = i;
          }
        } // Normalize slideIndex


        if (params.normalizeSlideIndex) {
          if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
        }
      }

      if (snapGrid.indexOf(translate) >= 0) {
        snapIndex = snapGrid.indexOf(translate);
      } else {
        const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
        snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }

      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if (activeIndex === previousIndex) {
        if (snapIndex !== previousSnapIndex) {
          swiper.snapIndex = snapIndex;
          swiper.emit('snapIndexChange');
        }

        return;
      } // Get real index


      const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
      Object.assign(swiper, {
        snapIndex,
        realIndex,
        previousIndex,
        activeIndex
      });
      swiper.emit('activeIndexChange');
      swiper.emit('snapIndexChange');

      if (previousRealIndex !== realIndex) {
        swiper.emit('realIndexChange');
      }

      if (swiper.initialized || swiper.params.runCallbacksOnInit) {
        swiper.emit('slideChange');
      }
    }

    function updateClickedSlide(e) {
      const swiper = this;
      const params = swiper.params;
      const slide = $(e).closest(`.${params.slideClass}`)[0];
      let slideFound = false;
      let slideIndex;

      if (slide) {
        for (let i = 0; i < swiper.slides.length; i += 1) {
          if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
          }
        }
      }

      if (slide && slideFound) {
        swiper.clickedSlide = slide;

        if (swiper.virtual && swiper.params.virtual.enabled) {
          swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
        } else {
          swiper.clickedIndex = slideIndex;
        }
      } else {
        swiper.clickedSlide = undefined;
        swiper.clickedIndex = undefined;
        return;
      }

      if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
        swiper.slideToClickedSlide();
      }
    }

    var update = {
      updateSize,
      updateSlides,
      updateAutoHeight,
      updateSlidesOffset,
      updateSlidesProgress,
      updateProgress,
      updateSlidesClasses,
      updateActiveIndex,
      updateClickedSlide
    };

    function getSwiperTranslate(axis) {
      if (axis === void 0) {
        axis = this.isHorizontal() ? 'x' : 'y';
      }

      const swiper = this;
      const {
        params,
        rtlTranslate: rtl,
        translate,
        $wrapperEl
      } = swiper;

      if (params.virtualTranslate) {
        return rtl ? -translate : translate;
      }

      if (params.cssMode) {
        return translate;
      }

      let currentTranslate = getTranslate($wrapperEl[0], axis);
      if (rtl) currentTranslate = -currentTranslate;
      return currentTranslate || 0;
    }

    function setTranslate(translate, byController) {
      const swiper = this;
      const {
        rtlTranslate: rtl,
        params,
        $wrapperEl,
        wrapperEl,
        progress
      } = swiper;
      let x = 0;
      let y = 0;
      const z = 0;

      if (swiper.isHorizontal()) {
        x = rtl ? -translate : translate;
      } else {
        y = translate;
      }

      if (params.roundLengths) {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      if (params.cssMode) {
        wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
      } else if (!params.virtualTranslate) {
        $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
      }

      swiper.previousTranslate = swiper.translate;
      swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== progress) {
        swiper.updateProgress(translate);
      }

      swiper.emit('setTranslate', swiper.translate, byController);
    }

    function minTranslate() {
      return -this.snapGrid[0];
    }

    function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
    }

    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
      if (translate === void 0) {
        translate = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (translateBounds === void 0) {
        translateBounds = true;
      }

      const swiper = this;
      const {
        params,
        wrapperEl
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return false;
      }

      const minTranslate = swiper.minTranslate();
      const maxTranslate = swiper.maxTranslate();
      let newTranslate;
      if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

      swiper.updateProgress(newTranslate);

      if (params.cssMode) {
        const isH = swiper.isHorizontal();

        if (speed === 0) {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
        } else {
          if (!swiper.support.smoothScroll) {
            animateCSSModeScroll({
              swiper,
              targetPosition: -newTranslate,
              side: isH ? 'left' : 'top'
            });
            return true;
          }

          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -newTranslate,
            behavior: 'smooth'
          });
        }

        return true;
      }

      if (speed === 0) {
        swiper.setTransition(0);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionEnd');
        }
      } else {
        swiper.setTransition(speed);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionStart');
        }

        if (!swiper.animating) {
          swiper.animating = true;

          if (!swiper.onTranslateToWrapperTransitionEnd) {
            swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
              if (!swiper || swiper.destroyed) return;
              if (e.target !== this) return;
              swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
              swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
              swiper.onTranslateToWrapperTransitionEnd = null;
              delete swiper.onTranslateToWrapperTransitionEnd;

              if (runCallbacks) {
                swiper.emit('transitionEnd');
              }
            };
          }

          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
        }
      }

      return true;
    }

    var translate = {
      getTranslate: getSwiperTranslate,
      setTranslate,
      minTranslate,
      maxTranslate,
      translateTo
    };

    function setTransition(duration, byController) {
      const swiper = this;

      if (!swiper.params.cssMode) {
        swiper.$wrapperEl.transition(duration);
      }

      swiper.emit('setTransition', duration, byController);
    }

    function transitionEmit(_ref) {
      let {
        swiper,
        runCallbacks,
        direction,
        step
      } = _ref;
      const {
        activeIndex,
        previousIndex
      } = swiper;
      let dir = direction;

      if (!dir) {
        if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
      }

      swiper.emit(`transition${step}`);

      if (runCallbacks && activeIndex !== previousIndex) {
        if (dir === 'reset') {
          swiper.emit(`slideResetTransition${step}`);
          return;
        }

        swiper.emit(`slideChangeTransition${step}`);

        if (dir === 'next') {
          swiper.emit(`slideNextTransition${step}`);
        } else {
          swiper.emit(`slidePrevTransition${step}`);
        }
      }
    }

    function transitionStart(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        params
      } = swiper;
      if (params.cssMode) return;

      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }

      transitionEmit({
        swiper,
        runCallbacks,
        direction,
        step: 'Start'
      });
    }

    function transitionEnd(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        params
      } = swiper;
      swiper.animating = false;
      if (params.cssMode) return;
      swiper.setTransition(0);
      transitionEmit({
        swiper,
        runCallbacks,
        direction,
        step: 'End'
      });
    }

    var transition = {
      setTransition,
      transitionStart,
      transitionEnd
    };

    function slideTo(index, speed, runCallbacks, internal, initial) {
      if (index === void 0) {
        index = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (typeof index !== 'number' && typeof index !== 'string') {
        throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
      }

      if (typeof index === 'string') {
        /**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
        const indexAsNumber = parseInt(index, 10);
        /**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

        const isValidNumber = isFinite(indexAsNumber);

        if (!isValidNumber) {
          throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
        } // Knowing that the converted `index` is a valid number,
        // we can update the original argument's value.


        index = indexAsNumber;
      }

      const swiper = this;
      let slideIndex = index;
      if (slideIndex < 0) slideIndex = 0;
      const {
        params,
        snapGrid,
        slidesGrid,
        previousIndex,
        activeIndex,
        rtlTranslate: rtl,
        wrapperEl,
        enabled
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
        return false;
      }

      const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
      let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
        swiper.emit('beforeSlideChangeStart');
      }

      const translate = -snapGrid[snapIndex]; // Update progress

      swiper.updateProgress(translate); // Normalize slideIndex

      if (params.normalizeSlideIndex) {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          const normalizedTranslate = -Math.floor(translate * 100);
          const normalizedGrid = Math.floor(slidesGrid[i] * 100);
          const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
              slideIndex = i;
            } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
              slideIndex = i + 1;
            }
          } else if (normalizedTranslate >= normalizedGrid) {
            slideIndex = i;
          }
        }
      } // Directions locks


      if (swiper.initialized && slideIndex !== activeIndex) {
        if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
          return false;
        }

        if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
          if ((activeIndex || 0) !== slideIndex) return false;
        }
      }

      let direction;
      if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

      if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
        swiper.updateActiveIndex(slideIndex); // Update Height

        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }

        swiper.updateSlidesClasses();

        if (params.effect !== 'slide') {
          swiper.setTranslate(translate);
        }

        if (direction !== 'reset') {
          swiper.transitionStart(runCallbacks, direction);
          swiper.transitionEnd(runCallbacks, direction);
        }

        return false;
      }

      if (params.cssMode) {
        const isH = swiper.isHorizontal();
        const t = rtl ? translate : -translate;

        if (speed === 0) {
          const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

          if (isVirtual) {
            swiper.wrapperEl.style.scrollSnapType = 'none';
            swiper._immediateVirtual = true;
          }

          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

          if (isVirtual) {
            requestAnimationFrame(() => {
              swiper.wrapperEl.style.scrollSnapType = '';
              swiper._swiperImmediateVirtual = false;
            });
          }
        } else {
          if (!swiper.support.smoothScroll) {
            animateCSSModeScroll({
              swiper,
              targetPosition: t,
              side: isH ? 'left' : 'top'
            });
            return true;
          }

          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: t,
            behavior: 'smooth'
          });
        }

        return true;
      }

      swiper.setTransition(speed);
      swiper.setTranslate(translate);
      swiper.updateActiveIndex(slideIndex);
      swiper.updateSlidesClasses();
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.transitionStart(runCallbacks, direction);

      if (speed === 0) {
        swiper.transitionEnd(runCallbacks, direction);
      } else if (!swiper.animating) {
        swiper.animating = true;

        if (!swiper.onSlideToWrapperTransitionEnd) {
          swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
            swiper.onSlideToWrapperTransitionEnd = null;
            delete swiper.onSlideToWrapperTransitionEnd;
            swiper.transitionEnd(runCallbacks, direction);
          };
        }

        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
      }

      return true;
    }

    function slideToLoop(index, speed, runCallbacks, internal) {
      if (index === void 0) {
        index = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      let newIndex = index;

      if (swiper.params.loop) {
        newIndex += swiper.loopedSlides;
      }

      return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideNext(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        animating,
        enabled,
        params
      } = swiper;
      if (!enabled) return swiper;
      let perGroup = params.slidesPerGroup;

      if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
      }

      const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      if (params.rewind && swiper.isEnd) {
        return swiper.slideTo(0, speed, runCallbacks, internal);
      }

      return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slidePrev(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        params,
        animating,
        snapGrid,
        slidesGrid,
        rtlTranslate,
        enabled
      } = swiper;
      if (!enabled) return swiper;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      const translate = rtlTranslate ? swiper.translate : -swiper.translate;

      function normalize(val) {
        if (val < 0) return -Math.floor(Math.abs(val));
        return Math.floor(val);
      }

      const normalizedTranslate = normalize(translate);
      const normalizedSnapGrid = snapGrid.map(val => normalize(val));
      let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

      if (typeof prevSnap === 'undefined' && params.cssMode) {
        let prevSnapIndex;
        snapGrid.forEach((snap, snapIndex) => {
          if (normalizedTranslate >= snap) {
            // prevSnap = snap;
            prevSnapIndex = snapIndex;
          }
        });

        if (typeof prevSnapIndex !== 'undefined') {
          prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
      }

      let prevIndex = 0;

      if (typeof prevSnap !== 'undefined') {
        prevIndex = slidesGrid.indexOf(prevSnap);
        if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

        if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
          prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
          prevIndex = Math.max(prevIndex, 0);
        }
      }

      if (params.rewind && swiper.isBeginning) {
        const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
        return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
      }

      return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideReset(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideToClosest(speed, runCallbacks, internal, threshold) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (threshold === void 0) {
        threshold = 0.5;
      }

      const swiper = this;
      let index = swiper.activeIndex;
      const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
      const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

      if (translate >= swiper.snapGrid[snapIndex]) {
        // The current translate is on or after the current snap index, so the choice
        // is between the current index and the one after it.
        const currentSnap = swiper.snapGrid[snapIndex];
        const nextSnap = swiper.snapGrid[snapIndex + 1];

        if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
          index += swiper.params.slidesPerGroup;
        }
      } else {
        // The current translate is before the current snap index, so the choice
        // is between the current index and the one before it.
        const prevSnap = swiper.snapGrid[snapIndex - 1];
        const currentSnap = swiper.snapGrid[snapIndex];

        if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
          index -= swiper.params.slidesPerGroup;
        }
      }

      index = Math.max(index, 0);
      index = Math.min(index, swiper.slidesGrid.length - 1);
      return swiper.slideTo(index, speed, runCallbacks, internal);
    }

    function slideToClickedSlide() {
      const swiper = this;
      const {
        params,
        $wrapperEl
      } = swiper;
      const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
      let slideToIndex = swiper.clickedIndex;
      let realIndex;

      if (params.loop) {
        if (swiper.animating) return;
        realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

        if (params.centeredSlides) {
          if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
            swiper.loopFix();
            slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
            nextTick(() => {
              swiper.slideTo(slideToIndex);
            });
          } else {
            swiper.slideTo(slideToIndex);
          }
        } else if (slideToIndex > swiper.slides.length - slidesPerView) {
          swiper.loopFix();
          slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else {
        swiper.slideTo(slideToIndex);
      }
    }

    var slide = {
      slideTo,
      slideToLoop,
      slideNext,
      slidePrev,
      slideReset,
      slideToClosest,
      slideToClickedSlide
    };

    function loopCreate() {
      const swiper = this;
      const document = getDocument();
      const {
        params,
        $wrapperEl
      } = swiper; // Remove duplicated slides

      const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
      $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
      let slides = $selector.children(`.${params.slideClass}`);

      if (params.loopFillGroupWithBlank) {
        const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

        if (blankSlidesNum !== params.slidesPerGroup) {
          for (let i = 0; i < blankSlidesNum; i += 1) {
            const blankNode = $(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
            $selector.append(blankNode);
          }

          slides = $selector.children(`.${params.slideClass}`);
        }
      }

      if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
      swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
      swiper.loopedSlides += params.loopAdditionalSlides;

      if (swiper.loopedSlides > slides.length) {
        swiper.loopedSlides = slides.length;
      }

      const prependSlides = [];
      const appendSlides = [];
      slides.each((el, index) => {
        const slide = $(el);

        if (index < swiper.loopedSlides) {
          appendSlides.push(el);
        }

        if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
          prependSlides.push(el);
        }

        slide.attr('data-swiper-slide-index', index);
      });

      for (let i = 0; i < appendSlides.length; i += 1) {
        $selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }

      for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
        $selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }
    }

    function loopFix() {
      const swiper = this;
      swiper.emit('beforeLoopFix');
      const {
        activeIndex,
        slides,
        loopedSlides,
        allowSlidePrev,
        allowSlideNext,
        snapGrid,
        rtlTranslate: rtl
      } = swiper;
      let newIndex;
      swiper.allowSlidePrev = true;
      swiper.allowSlideNext = true;
      const snapTranslate = -snapGrid[activeIndex];
      const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

      if (activeIndex < loopedSlides) {
        newIndex = slides.length - loopedSlides * 3 + activeIndex;
        newIndex += loopedSlides;
        const slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      } else if (activeIndex >= slides.length - loopedSlides) {
        // Fix For Positive Oversliding
        newIndex = -slides.length + activeIndex + loopedSlides;
        newIndex += loopedSlides;
        const slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      }

      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit('loopFix');
    }

    function loopDestroy() {
      const swiper = this;
      const {
        $wrapperEl,
        params,
        slides
      } = swiper;
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
      slides.removeAttr('data-swiper-slide-index');
    }

    var loop = {
      loopCreate,
      loopFix,
      loopDestroy
    };

    function setGrabCursor(moving) {
      const swiper = this;
      if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
      const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
      el.style.cursor = 'move';
      el.style.cursor = moving ? 'grabbing' : 'grab';
    }

    function unsetGrabCursor() {
      const swiper = this;

      if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
        return;
      }

      swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
    }

    var grabCursor = {
      setGrabCursor,
      unsetGrabCursor
    };

    function closestElement(selector, base) {
      if (base === void 0) {
        base = this;
      }

      function __closestFrom(el) {
        if (!el || el === getDocument() || el === getWindow()) return null;
        if (el.assignedSlot) el = el.assignedSlot;
        const found = el.closest(selector);
        return found || __closestFrom(el.getRootNode().host);
      }

      return __closestFrom(base);
    }

    function onTouchStart(event) {
      const swiper = this;
      const document = getDocument();
      const window = getWindow();
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        enabled
      } = swiper;
      if (!enabled) return;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return;
      }

      if (!swiper.animating && params.cssMode && params.loop) {
        swiper.loopFix();
      }

      let e = event;
      if (e.originalEvent) e = e.originalEvent;
      let $targetEl = $(e.target);

      if (params.touchEventsTarget === 'wrapper') {
        if (!$targetEl.closest(swiper.wrapperEl).length) return;
      }

      data.isTouchEvent = e.type === 'touchstart';
      if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
      if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
      if (data.isTouched && data.isMoved) return; // change target el for shadow root component

      const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

      if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
        $targetEl = $(event.path[0]);
      }

      const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
      const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

      if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
        swiper.allowClick = true;
        return;
      }

      if (params.swipeHandler) {
        if (!$targetEl.closest(params.swipeHandler)[0]) return;
      }

      touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      const startX = touches.currentX;
      const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

      const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
      const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

      if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
        if (edgeSwipeDetection === 'prevent') {
          event.preventDefault();
        } else {
          return;
        }
      }

      Object.assign(data, {
        isTouched: true,
        isMoved: false,
        allowTouchCallbacks: true,
        isScrolling: undefined,
        startMoving: undefined
      });
      touches.startX = startX;
      touches.startY = startY;
      data.touchStartTime = now();
      swiper.allowClick = true;
      swiper.updateSize();
      swiper.swipeDirection = undefined;
      if (params.threshold > 0) data.allowThresholdMove = false;

      if (e.type !== 'touchstart') {
        let preventDefault = true;

        if ($targetEl.is(data.focusableElements)) {
          preventDefault = false;

          if ($targetEl[0].nodeName === 'SELECT') {
            data.isTouched = false;
          }
        }

        if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
          document.activeElement.blur();
        }

        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
          e.preventDefault();
        }
      }

      if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
        swiper.freeMode.onTouchStart();
      }

      swiper.emit('touchStart', e);
    }

    function onTouchMove(event) {
      const document = getDocument();
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (!data.isTouched) {
        if (data.startMoving && data.isScrolling) {
          swiper.emit('touchMoveOpposite', e);
        }

        return;
      }

      if (data.isTouchEvent && e.type !== 'touchmove') return;
      const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
      const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
      const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

      if (e.preventedByNestedSwiper) {
        touches.startX = pageX;
        touches.startY = pageY;
        return;
      }

      if (!swiper.allowTouchMove) {
        if (!$(e.target).is(data.focusableElements)) {
          swiper.allowClick = false;
        }

        if (data.isTouched) {
          Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY
          });
          data.touchStartTime = now();
        }

        return;
      }

      if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
        if (swiper.isVertical()) {
          // Vertical
          if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
            data.isTouched = false;
            data.isMoved = false;
            return;
          }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
          return;
        }
      }

      if (data.isTouchEvent && document.activeElement) {
        if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
          data.isMoved = true;
          swiper.allowClick = false;
          return;
        }
      }

      if (data.allowTouchCallbacks) {
        swiper.emit('touchMove', e);
      }

      if (e.targetTouches && e.targetTouches.length > 1) return;
      touches.currentX = pageX;
      touches.currentY = pageY;
      const diffX = touches.currentX - touches.startX;
      const diffY = touches.currentY - touches.startY;
      if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

      if (typeof data.isScrolling === 'undefined') {
        let touchAngle;

        if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
          data.isScrolling = false;
        } else {
          // eslint-disable-next-line
          if (diffX * diffX + diffY * diffY >= 25) {
            touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
            data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
          }
        }
      }

      if (data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }

      if (typeof data.startMoving === 'undefined') {
        if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
          data.startMoving = true;
        }
      }

      if (data.isScrolling) {
        data.isTouched = false;
        return;
      }

      if (!data.startMoving) {
        return;
      }

      swiper.allowClick = false;

      if (!params.cssMode && e.cancelable) {
        e.preventDefault();
      }

      if (params.touchMoveStopPropagation && !params.nested) {
        e.stopPropagation();
      }

      if (!data.isMoved) {
        if (params.loop && !params.cssMode) {
          swiper.loopFix();
        }

        data.startTranslate = swiper.getTranslate();
        swiper.setTransition(0);

        if (swiper.animating) {
          swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
        }

        data.allowMomentumBounce = false; // Grab Cursor

        if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
          swiper.setGrabCursor(true);
        }

        swiper.emit('sliderFirstMove', e);
      }

      swiper.emit('sliderMove', e);
      data.isMoved = true;
      let diff = swiper.isHorizontal() ? diffX : diffY;
      touches.diff = diff;
      diff *= params.touchRatio;
      if (rtl) diff = -diff;
      swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
      data.currentTranslate = diff + data.startTranslate;
      let disableParentSwiper = true;
      let resistanceRatio = params.resistanceRatio;

      if (params.touchReleaseOnEdges) {
        resistanceRatio = 0;
      }

      if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }

      if (disableParentSwiper) {
        e.preventedByNestedSwiper = true;
      } // Directions locks


      if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
        data.currentTranslate = data.startTranslate;
      } // Threshold


      if (params.threshold > 0) {
        if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
          if (!data.allowThresholdMove) {
            data.allowThresholdMove = true;
            touches.startX = touches.currentX;
            touches.startY = touches.currentY;
            data.currentTranslate = data.startTranslate;
            touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
            return;
          }
        } else {
          data.currentTranslate = data.startTranslate;
          return;
        }
      }

      if (!params.followFinger || params.cssMode) return; // Update active index in free mode

      if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
        swiper.freeMode.onTouchMove();
      } // Update progress


      swiper.updateProgress(data.currentTranslate); // Update translate

      swiper.setTranslate(data.currentTranslate);
    }

    function onTouchEnd(event) {
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        slidesGrid,
        enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (data.allowTouchCallbacks) {
        swiper.emit('touchEnd', e);
      }

      data.allowTouchCallbacks = false;

      if (!data.isTouched) {
        if (data.isMoved && params.grabCursor) {
          swiper.setGrabCursor(false);
        }

        data.isMoved = false;
        data.startMoving = false;
        return;
      } // Return Grab Cursor


      if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(false);
      } // Time diff


      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

      if (swiper.allowClick) {
        const pathTree = e.path || e.composedPath && e.composedPath();
        swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
        swiper.emit('tap click', e);

        if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
          swiper.emit('doubleTap doubleClick', e);
        }
      }

      data.lastClickTime = now();
      nextTick(() => {
        if (!swiper.destroyed) swiper.allowClick = true;
      });

      if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        return;
      }

      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      let currentPos;

      if (params.followFinger) {
        currentPos = rtl ? swiper.translate : -swiper.translate;
      } else {
        currentPos = -data.currentTranslate;
      }

      if (params.cssMode) {
        return;
      }

      if (swiper.params.freeMode && params.freeMode.enabled) {
        swiper.freeMode.onTouchEnd({
          currentPos
        });
        return;
      } // Find current slide


      let stopIndex = 0;
      let groupSize = swiper.slidesSizesGrid[0];

      for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
        const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

        if (typeof slidesGrid[i + increment] !== 'undefined') {
          if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
            stopIndex = i;
            groupSize = slidesGrid[i + increment] - slidesGrid[i];
          }
        } else if (currentPos >= slidesGrid[i]) {
          stopIndex = i;
          groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
        }
      }

      let rewindFirstIndex = null;
      let rewindLastIndex = null;

      if (params.rewind) {
        if (swiper.isBeginning) {
          rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
        } else if (swiper.isEnd) {
          rewindFirstIndex = 0;
        }
      } // Find current slide size


      const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
      const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

      if (timeDiff > params.longSwipesMs) {
        // Long touches
        if (!params.longSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (swiper.swipeDirection === 'next') {
          if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
        }

        if (swiper.swipeDirection === 'prev') {
          if (ratio > 1 - params.longSwipesRatio) {
            swiper.slideTo(stopIndex + increment);
          } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
            swiper.slideTo(rewindLastIndex);
          } else {
            swiper.slideTo(stopIndex);
          }
        }
      } else {
        // Short swipes
        if (!params.shortSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

        if (!isNavButtonTarget) {
          if (swiper.swipeDirection === 'next') {
            swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
          }

          if (swiper.swipeDirection === 'prev') {
            swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
          }
        } else if (e.target === swiper.navigation.nextEl) {
          swiper.slideTo(stopIndex + increment);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    }

    function onResize() {
      const swiper = this;
      const {
        params,
        el
      } = swiper;
      if (el && el.offsetWidth === 0) return; // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      } // Save locks


      const {
        allowSlideNext,
        allowSlidePrev,
        snapGrid
      } = swiper; // Disable locks on resize

      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateSlidesClasses();

      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
        swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.run();
      } // Return locks after resize


      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;

      if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
    }

    function onClick(e) {
      const swiper = this;
      if (!swiper.enabled) return;

      if (!swiper.allowClick) {
        if (swiper.params.preventClicks) e.preventDefault();

        if (swiper.params.preventClicksPropagation && swiper.animating) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    }

    function onScroll() {
      const swiper = this;
      const {
        wrapperEl,
        rtlTranslate,
        enabled
      } = swiper;
      if (!enabled) return;
      swiper.previousTranslate = swiper.translate;

      if (swiper.isHorizontal()) {
        swiper.translate = -wrapperEl.scrollLeft;
      } else {
        swiper.translate = -wrapperEl.scrollTop;
      } // eslint-disable-next-line


      if (swiper.translate === 0) swiper.translate = 0;
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== swiper.progress) {
        swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
      }

      swiper.emit('setTranslate', swiper.translate, false);
    }

    let dummyEventAttached = false;

    function dummyEventListener() {}

    const events = (swiper, method) => {
      const document = getDocument();
      const {
        params,
        touchEvents,
        el,
        wrapperEl,
        device,
        support
      } = swiper;
      const capture = !!params.nested;
      const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
      const swiperMethod = method; // Touch Events

      if (!support.touch) {
        el[domMethod](touchEvents.start, swiper.onTouchStart, false);
        document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
        document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
      } else {
        const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
        el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
          passive: false,
          capture
        } : capture);
        el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

        if (touchEvents.cancel) {
          el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
      } // Prevent Links Clicks


      if (params.preventClicks || params.preventClicksPropagation) {
        el[domMethod]('click', swiper.onClick, true);
      }

      if (params.cssMode) {
        wrapperEl[domMethod]('scroll', swiper.onScroll);
      } // Resize handler


      if (params.updateOnWindowResize) {
        swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
      } else {
        swiper[swiperMethod]('observerUpdate', onResize, true);
      }
    };

    function attachEvents() {
      const swiper = this;
      const document = getDocument();
      const {
        params,
        support
      } = swiper;
      swiper.onTouchStart = onTouchStart.bind(swiper);
      swiper.onTouchMove = onTouchMove.bind(swiper);
      swiper.onTouchEnd = onTouchEnd.bind(swiper);

      if (params.cssMode) {
        swiper.onScroll = onScroll.bind(swiper);
      }

      swiper.onClick = onClick.bind(swiper);

      if (support.touch && !dummyEventAttached) {
        document.addEventListener('touchstart', dummyEventListener);
        dummyEventAttached = true;
      }

      events(swiper, 'on');
    }

    function detachEvents() {
      const swiper = this;
      events(swiper, 'off');
    }

    var events$1 = {
      attachEvents,
      detachEvents
    };

    const isGridEnabled = (swiper, params) => {
      return swiper.grid && params.grid && params.grid.rows > 1;
    };

    function setBreakpoint() {
      const swiper = this;
      const {
        activeIndex,
        initialized,
        loopedSlides = 0,
        params,
        $el
      } = swiper;
      const breakpoints = params.breakpoints;
      if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

      const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
      if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
      const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
      const breakpointParams = breakpointOnlyParams || swiper.originalParams;
      const wasMultiRow = isGridEnabled(swiper, params);
      const isMultiRow = isGridEnabled(swiper, breakpointParams);
      const wasEnabled = params.enabled;

      if (wasMultiRow && !isMultiRow) {
        $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
        swiper.emitContainerClasses();
      } else if (!wasMultiRow && isMultiRow) {
        $el.addClass(`${params.containerModifierClass}grid`);

        if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
          $el.addClass(`${params.containerModifierClass}grid-column`);
        }

        swiper.emitContainerClasses();
      }

      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

      if (directionChanged && initialized) {
        swiper.changeDirection();
      }

      extend(swiper.params, breakpointParams);
      const isEnabled = swiper.params.enabled;
      Object.assign(swiper, {
        allowTouchMove: swiper.params.allowTouchMove,
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev
      });

      if (wasEnabled && !isEnabled) {
        swiper.disable();
      } else if (!wasEnabled && isEnabled) {
        swiper.enable();
      }

      swiper.currentBreakpoint = breakpoint;
      swiper.emit('_beforeBreakpoint', breakpointParams);

      if (needsReLoop && initialized) {
        swiper.loopDestroy();
        swiper.loopCreate();
        swiper.updateSlides();
        swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
      }

      swiper.emit('breakpoint', breakpointParams);
    }

    function getBreakpoint(breakpoints, base, containerEl) {
      if (base === void 0) {
        base = 'window';
      }

      if (!breakpoints || base === 'container' && !containerEl) return undefined;
      let breakpoint = false;
      const window = getWindow();
      const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
      const points = Object.keys(breakpoints).map(point => {
        if (typeof point === 'string' && point.indexOf('@') === 0) {
          const minRatio = parseFloat(point.substr(1));
          const value = currentHeight * minRatio;
          return {
            value,
            point
          };
        }

        return {
          value: point,
          point
        };
      });
      points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

      for (let i = 0; i < points.length; i += 1) {
        const {
          point,
          value
        } = points[i];

        if (base === 'window') {
          if (window.matchMedia(`(min-width: ${value}px)`).matches) {
            breakpoint = point;
          }
        } else if (value <= containerEl.clientWidth) {
          breakpoint = point;
        }
      }

      return breakpoint || 'max';
    }

    var breakpoints = {
      setBreakpoint,
      getBreakpoint
    };

    function prepareClasses(entries, prefix) {
      const resultClasses = [];
      entries.forEach(item => {
        if (typeof item === 'object') {
          Object.keys(item).forEach(classNames => {
            if (item[classNames]) {
              resultClasses.push(prefix + classNames);
            }
          });
        } else if (typeof item === 'string') {
          resultClasses.push(prefix + item);
        }
      });
      return resultClasses;
    }

    function addClasses() {
      const swiper = this;
      const {
        classNames,
        params,
        rtl,
        $el,
        device,
        support
      } = swiper; // prettier-ignore

      const suffixes = prepareClasses(['initialized', params.direction, {
        'pointer-events': !support.touch
      }, {
        'free-mode': swiper.params.freeMode && params.freeMode.enabled
      }, {
        'autoheight': params.autoHeight
      }, {
        'rtl': rtl
      }, {
        'grid': params.grid && params.grid.rows > 1
      }, {
        'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
      }, {
        'android': device.android
      }, {
        'ios': device.ios
      }, {
        'css-mode': params.cssMode
      }, {
        'centered': params.cssMode && params.centeredSlides
      }], params.containerModifierClass);
      classNames.push(...suffixes);
      $el.addClass([...classNames].join(' '));
      swiper.emitContainerClasses();
    }

    function removeClasses() {
      const swiper = this;
      const {
        $el,
        classNames
      } = swiper;
      $el.removeClass(classNames.join(' '));
      swiper.emitContainerClasses();
    }

    var classes = {
      addClasses,
      removeClasses
    };

    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
      const window = getWindow();
      let image;

      function onReady() {
        if (callback) callback();
      }

      const isPicture = $(imageEl).parent('picture')[0];

      if (!isPicture && (!imageEl.complete || !checkForComplete)) {
        if (src) {
          image = new window.Image();
          image.onload = onReady;
          image.onerror = onReady;

          if (sizes) {
            image.sizes = sizes;
          }

          if (srcset) {
            image.srcset = srcset;
          }

          if (src) {
            image.src = src;
          }
        } else {
          onReady();
        }
      } else {
        // image already loaded...
        onReady();
      }
    }

    function preloadImages() {
      const swiper = this;
      swiper.imagesToLoad = swiper.$el.find('img');

      function onReady() {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
        if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

        if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
          if (swiper.params.updateOnImagesReady) swiper.update();
          swiper.emit('imagesReady');
        }
      }

      for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
        const imageEl = swiper.imagesToLoad[i];
        swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
      }
    }

    var images = {
      loadImage,
      preloadImages
    };

    function checkOverflow() {
      const swiper = this;
      const {
        isLocked: wasLocked,
        params
      } = swiper;
      const {
        slidesOffsetBefore
      } = params;

      if (slidesOffsetBefore) {
        const lastSlideIndex = swiper.slides.length - 1;
        const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
        swiper.isLocked = swiper.size > lastSlideRightEdge;
      } else {
        swiper.isLocked = swiper.snapGrid.length === 1;
      }

      if (params.allowSlideNext === true) {
        swiper.allowSlideNext = !swiper.isLocked;
      }

      if (params.allowSlidePrev === true) {
        swiper.allowSlidePrev = !swiper.isLocked;
      }

      if (wasLocked && wasLocked !== swiper.isLocked) {
        swiper.isEnd = false;
      }

      if (wasLocked !== swiper.isLocked) {
        swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
      }
    }

    var checkOverflow$1 = {
      checkOverflow
    };

    var defaults = {
      init: true,
      direction: 'horizontal',
      touchEventsTarget: 'wrapper',
      initialSlide: 0,
      speed: 300,
      cssMode: false,
      updateOnWindowResize: true,
      resizeObserver: true,
      nested: false,
      createElements: false,
      enabled: true,
      focusableElements: 'input, select, option, textarea, button, video, label',
      // Overrides
      width: null,
      height: null,
      //
      preventInteractionOnTransition: false,
      // ssr
      userAgent: null,
      url: null,
      // To support iOS's swipe-to-go-back gesture (when being used in-app).
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      // Autoheight
      autoHeight: false,
      // Set wrapper width
      setWrapperSize: false,
      // Virtual Translate
      virtualTranslate: false,
      // Effects
      effect: 'slide',
      // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
      // Breakpoints
      breakpoints: undefined,
      breakpointsBase: 'window',
      // Slides grid
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      slidesPerGroupAuto: false,
      centeredSlides: false,
      centeredSlidesBounds: false,
      slidesOffsetBefore: 0,
      // in px
      slidesOffsetAfter: 0,
      // in px
      normalizeSlideIndex: true,
      centerInsufficientSlides: false,
      // Disable swiper and hide navigation when container not overflow
      watchOverflow: true,
      // Round length
      roundLengths: false,
      // Touches
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 0,
      touchMoveStopPropagation: false,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchReleaseOnEdges: false,
      // Unique Navigation Elements
      uniqueNavElements: true,
      // Resistance
      resistance: true,
      resistanceRatio: 0.85,
      // Progress
      watchSlidesProgress: false,
      // Cursor
      grabCursor: false,
      // Clicks
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      // Images
      preloadImages: true,
      updateOnImagesReady: true,
      // loop
      loop: false,
      loopAdditionalSlides: 0,
      loopedSlides: null,
      loopFillGroupWithBlank: false,
      loopPreventsSlide: true,
      // rewind
      rewind: false,
      // Swiping/no swiping
      allowSlidePrev: true,
      allowSlideNext: true,
      swipeHandler: null,
      // '.swipe-handler',
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      noSwipingSelector: null,
      // Passive Listeners
      passiveListeners: true,
      maxBackfaceHiddenSlides: 10,
      // NS
      containerModifierClass: 'swiper-',
      // NEW
      slideClass: 'swiper-slide',
      slideBlankClass: 'swiper-slide-invisible-blank',
      slideActiveClass: 'swiper-slide-active',
      slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
      slideVisibleClass: 'swiper-slide-visible',
      slideDuplicateClass: 'swiper-slide-duplicate',
      slideNextClass: 'swiper-slide-next',
      slideDuplicateNextClass: 'swiper-slide-duplicate-next',
      slidePrevClass: 'swiper-slide-prev',
      slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
      wrapperClass: 'swiper-wrapper',
      // Callbacks
      runCallbacksOnInit: true,
      // Internals
      _emitClasses: false
    };

    function moduleExtendParams(params, allModulesParams) {
      return function extendParams(obj) {
        if (obj === void 0) {
          obj = {};
        }

        const moduleParamName = Object.keys(obj)[0];
        const moduleParams = obj[moduleParamName];

        if (typeof moduleParams !== 'object' || moduleParams === null) {
          extend(allModulesParams, obj);
          return;
        }

        if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
          params[moduleParamName] = {
            auto: true
          };
        }

        if (!(moduleParamName in params && 'enabled' in moduleParams)) {
          extend(allModulesParams, obj);
          return;
        }

        if (params[moduleParamName] === true) {
          params[moduleParamName] = {
            enabled: true
          };
        }

        if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
          params[moduleParamName].enabled = true;
        }

        if (!params[moduleParamName]) params[moduleParamName] = {
          enabled: false
        };
        extend(allModulesParams, obj);
      };
    }

    /* eslint no-param-reassign: "off" */
    const prototypes = {
      eventsEmitter,
      update,
      translate,
      transition,
      slide,
      loop,
      grabCursor,
      events: events$1,
      breakpoints,
      checkOverflow: checkOverflow$1,
      classes,
      images
    };
    const extendedDefaults = {};

    class Swiper {
      constructor() {
        let el;
        let params;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
          params = args[0];
        } else {
          [el, params] = args;
        }

        if (!params) params = {};
        params = extend({}, params);
        if (el && !params.el) params.el = el;

        if (params.el && $(params.el).length > 1) {
          const swipers = [];
          $(params.el).each(containerEl => {
            const newParams = extend({}, params, {
              el: containerEl
            });
            swipers.push(new Swiper(newParams));
          });
          return swipers;
        } // Swiper Instance


        const swiper = this;
        swiper.__swiper__ = true;
        swiper.support = getSupport();
        swiper.device = getDevice({
          userAgent: params.userAgent
        });
        swiper.browser = getBrowser();
        swiper.eventsListeners = {};
        swiper.eventsAnyListeners = [];
        swiper.modules = [...swiper.__modules__];

        if (params.modules && Array.isArray(params.modules)) {
          swiper.modules.push(...params.modules);
        }

        const allModulesParams = {};
        swiper.modules.forEach(mod => {
          mod({
            swiper,
            extendParams: moduleExtendParams(params, allModulesParams),
            on: swiper.on.bind(swiper),
            once: swiper.once.bind(swiper),
            off: swiper.off.bind(swiper),
            emit: swiper.emit.bind(swiper)
          });
        }); // Extend defaults with modules params

        const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

        swiper.params = extend({}, swiperParams, extendedDefaults, params);
        swiper.originalParams = extend({}, swiper.params);
        swiper.passedParams = extend({}, params); // add event listeners

        if (swiper.params && swiper.params.on) {
          Object.keys(swiper.params.on).forEach(eventName => {
            swiper.on(eventName, swiper.params.on[eventName]);
          });
        }

        if (swiper.params && swiper.params.onAny) {
          swiper.onAny(swiper.params.onAny);
        } // Save Dom lib


        swiper.$ = $; // Extend Swiper

        Object.assign(swiper, {
          enabled: swiper.params.enabled,
          el,
          // Classes
          classNames: [],
          // Slides
          slides: $(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],

          // isDirection
          isHorizontal() {
            return swiper.params.direction === 'horizontal';
          },

          isVertical() {
            return swiper.params.direction === 'vertical';
          },

          // Indexes
          activeIndex: 0,
          realIndex: 0,
          //
          isBeginning: true,
          isEnd: false,
          // Props
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: false,
          // Locks
          allowSlideNext: swiper.params.allowSlideNext,
          allowSlidePrev: swiper.params.allowSlidePrev,
          // Touch Events
          touchEvents: function touchEvents() {
            const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            const desktop = ['pointerdown', 'pointermove', 'pointerup'];
            swiper.touchEventsTouch = {
              start: touch[0],
              move: touch[1],
              end: touch[2],
              cancel: touch[3]
            };
            swiper.touchEventsDesktop = {
              start: desktop[0],
              move: desktop[1],
              end: desktop[2]
            };
            return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
          }(),
          touchEventsData: {
            isTouched: undefined,
            isMoved: undefined,
            allowTouchCallbacks: undefined,
            touchStartTime: undefined,
            isScrolling: undefined,
            currentTranslate: undefined,
            startTranslate: undefined,
            allowThresholdMove: undefined,
            // Form elements to match
            focusableElements: swiper.params.focusableElements,
            // Last click time
            lastClickTime: now(),
            clickTimeout: undefined,
            // Velocities
            velocities: [],
            allowMomentumBounce: undefined,
            isTouchEvent: undefined,
            startMoving: undefined
          },
          // Clicks
          allowClick: true,
          // Touches
          allowTouchMove: swiper.params.allowTouchMove,
          touches: {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
          },
          // Images
          imagesToLoad: [],
          imagesLoaded: 0
        });
        swiper.emit('_swiper'); // Init

        if (swiper.params.init) {
          swiper.init();
        } // Return app instance


        return swiper;
      }

      enable() {
        const swiper = this;
        if (swiper.enabled) return;
        swiper.enabled = true;

        if (swiper.params.grabCursor) {
          swiper.setGrabCursor();
        }

        swiper.emit('enable');
      }

      disable() {
        const swiper = this;
        if (!swiper.enabled) return;
        swiper.enabled = false;

        if (swiper.params.grabCursor) {
          swiper.unsetGrabCursor();
        }

        swiper.emit('disable');
      }

      setProgress(progress, speed) {
        const swiper = this;
        progress = Math.min(Math.max(progress, 0), 1);
        const min = swiper.minTranslate();
        const max = swiper.maxTranslate();
        const current = (max - min) * progress + min;
        swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      emitContainerClasses() {
        const swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        const cls = swiper.el.className.split(' ').filter(className => {
          return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
        });
        swiper.emit('_containerClasses', cls.join(' '));
      }

      getSlideClasses(slideEl) {
        const swiper = this;
        return slideEl.className.split(' ').filter(className => {
          return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
        }).join(' ');
      }

      emitSlidesClasses() {
        const swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        const updates = [];
        swiper.slides.each(slideEl => {
          const classNames = swiper.getSlideClasses(slideEl);
          updates.push({
            slideEl,
            classNames
          });
          swiper.emit('_slideClass', slideEl, classNames);
        });
        swiper.emit('_slideClasses', updates);
      }

      slidesPerViewDynamic(view, exact) {
        if (view === void 0) {
          view = 'current';
        }

        if (exact === void 0) {
          exact = false;
        }

        const swiper = this;
        const {
          params,
          slides,
          slidesGrid,
          slidesSizesGrid,
          size: swiperSize,
          activeIndex
        } = swiper;
        let spv = 1;

        if (params.centeredSlides) {
          let slideSize = slides[activeIndex].swiperSlideSize;
          let breakLoop;

          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }

          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }
        } else {
          // eslint-disable-next-line
          if (view === 'current') {
            for (let i = activeIndex + 1; i < slides.length; i += 1) {
              const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

              if (slideInView) {
                spv += 1;
              }
            }
          } else {
            // previous
            for (let i = activeIndex - 1; i >= 0; i -= 1) {
              const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

              if (slideInView) {
                spv += 1;
              }
            }
          }
        }

        return spv;
      }

      update() {
        const swiper = this;
        if (!swiper || swiper.destroyed) return;
        const {
          snapGrid,
          params
        } = swiper; // Breakpoints

        if (params.breakpoints) {
          swiper.setBreakpoint();
        }

        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateProgress();
        swiper.updateSlidesClasses();

        function setTranslate() {
          const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
          const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
          swiper.setTranslate(newTranslate);
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }

        let translated;

        if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
          setTranslate();

          if (swiper.params.autoHeight) {
            swiper.updateAutoHeight();
          }
        } else {
          if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
            translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
          } else {
            translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
          }

          if (!translated) {
            setTranslate();
          }
        }

        if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
          swiper.checkOverflow();
        }

        swiper.emit('update');
      }

      changeDirection(newDirection, needUpdate) {
        if (needUpdate === void 0) {
          needUpdate = true;
        }

        const swiper = this;
        const currentDirection = swiper.params.direction;

        if (!newDirection) {
          // eslint-disable-next-line
          newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
        }

        if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
          return swiper;
        }

        swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
        swiper.emitContainerClasses();
        swiper.params.direction = newDirection;
        swiper.slides.each(slideEl => {
          if (newDirection === 'vertical') {
            slideEl.style.width = '';
          } else {
            slideEl.style.height = '';
          }
        });
        swiper.emit('changeDirection');
        if (needUpdate) swiper.update();
        return swiper;
      }

      mount(el) {
        const swiper = this;
        if (swiper.mounted) return true; // Find el

        const $el = $(el || swiper.params.el);
        el = $el[0];

        if (!el) {
          return false;
        }

        el.swiper = swiper;

        const getWrapperSelector = () => {
          return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
        };

        const getWrapper = () => {
          if (el && el.shadowRoot && el.shadowRoot.querySelector) {
            const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

            res.children = options => $el.children(options);

            return res;
          }

          return $el.children(getWrapperSelector());
        }; // Find Wrapper


        let $wrapperEl = getWrapper();

        if ($wrapperEl.length === 0 && swiper.params.createElements) {
          const document = getDocument();
          const wrapper = document.createElement('div');
          $wrapperEl = $(wrapper);
          wrapper.className = swiper.params.wrapperClass;
          $el.append(wrapper);
          $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
            $wrapperEl.append(slideEl);
          });
        }

        Object.assign(swiper, {
          $el,
          el,
          $wrapperEl,
          wrapperEl: $wrapperEl[0],
          mounted: true,
          // RTL
          rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
          rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
          wrongRTL: $wrapperEl.css('display') === '-webkit-box'
        });
        return true;
      }

      init(el) {
        const swiper = this;
        if (swiper.initialized) return swiper;
        const mounted = swiper.mount(el);
        if (mounted === false) return swiper;
        swiper.emit('beforeInit'); // Set breakpoint

        if (swiper.params.breakpoints) {
          swiper.setBreakpoint();
        } // Add Classes


        swiper.addClasses(); // Create loop

        if (swiper.params.loop) {
          swiper.loopCreate();
        } // Update size


        swiper.updateSize(); // Update slides

        swiper.updateSlides();

        if (swiper.params.watchOverflow) {
          swiper.checkOverflow();
        } // Set Grab Cursor


        if (swiper.params.grabCursor && swiper.enabled) {
          swiper.setGrabCursor();
        }

        if (swiper.params.preloadImages) {
          swiper.preloadImages();
        } // Slide To Initial Slide


        if (swiper.params.loop) {
          swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
        } else {
          swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
        } // Attach events


        swiper.attachEvents(); // Init Flag

        swiper.initialized = true; // Emit

        swiper.emit('init');
        swiper.emit('afterInit');
        return swiper;
      }

      destroy(deleteInstance, cleanStyles) {
        if (deleteInstance === void 0) {
          deleteInstance = true;
        }

        if (cleanStyles === void 0) {
          cleanStyles = true;
        }

        const swiper = this;
        const {
          params,
          $el,
          $wrapperEl,
          slides
        } = swiper;

        if (typeof swiper.params === 'undefined' || swiper.destroyed) {
          return null;
        }

        swiper.emit('beforeDestroy'); // Init Flag

        swiper.initialized = false; // Detach events

        swiper.detachEvents(); // Destroy loop

        if (params.loop) {
          swiper.loopDestroy();
        } // Cleanup styles


        if (cleanStyles) {
          swiper.removeClasses();
          $el.removeAttr('style');
          $wrapperEl.removeAttr('style');

          if (slides && slides.length) {
            slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
          }
        }

        swiper.emit('destroy'); // Detach emitter events

        Object.keys(swiper.eventsListeners).forEach(eventName => {
          swiper.off(eventName);
        });

        if (deleteInstance !== false) {
          swiper.$el[0].swiper = null;
          deleteProps(swiper);
        }

        swiper.destroyed = true;
        return null;
      }

      static extendDefaults(newDefaults) {
        extend(extendedDefaults, newDefaults);
      }

      static get extendedDefaults() {
        return extendedDefaults;
      }

      static get defaults() {
        return defaults;
      }

      static installModule(mod) {
        if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
        const modules = Swiper.prototype.__modules__;

        if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
          modules.push(mod);
        }
      }

      static use(module) {
        if (Array.isArray(module)) {
          module.forEach(m => Swiper.installModule(m));
          return Swiper;
        }

        Swiper.installModule(module);
        return Swiper;
      }

    }

    Object.keys(prototypes).forEach(prototypeGroup => {
      Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
        Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
      });
    });
    Swiper.use([Resize, Observer]);

    function Virtual(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        virtual: {
          enabled: false,
          slides: [],
          cache: true,
          renderSlide: null,
          renderExternal: null,
          renderExternalUpdate: true,
          addSlidesBefore: 0,
          addSlidesAfter: 0
        }
      });
      let cssModeTimeout;
      swiper.virtual = {
        cache: {},
        from: undefined,
        to: undefined,
        slides: [],
        offset: 0,
        slidesGrid: []
      };

      function renderSlide(slide, index) {
        const params = swiper.params.virtual;

        if (params.cache && swiper.virtual.cache[index]) {
          return swiper.virtual.cache[index];
        }

        const $slideEl = params.renderSlide ? $(params.renderSlide.call(swiper, slide, index)) : $(`<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`);
        if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
        if (params.cache) swiper.virtual.cache[index] = $slideEl;
        return $slideEl;
      }

      function update(force) {
        const {
          slidesPerView,
          slidesPerGroup,
          centeredSlides
        } = swiper.params;
        const {
          addSlidesBefore,
          addSlidesAfter
        } = swiper.params.virtual;
        const {
          from: previousFrom,
          to: previousTo,
          slides,
          slidesGrid: previousSlidesGrid,
          offset: previousOffset
        } = swiper.virtual;

        if (!swiper.params.cssMode) {
          swiper.updateActiveIndex();
        }

        const activeIndex = swiper.activeIndex || 0;
        let offsetProp;
        if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
        let slidesAfter;
        let slidesBefore;

        if (centeredSlides) {
          slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
          slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
        } else {
          slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
          slidesBefore = slidesPerGroup + addSlidesBefore;
        }

        const from = Math.max((activeIndex || 0) - slidesBefore, 0);
        const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
        const offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
        Object.assign(swiper.virtual, {
          from,
          to,
          offset,
          slidesGrid: swiper.slidesGrid
        });

        function onRendered() {
          swiper.updateSlides();
          swiper.updateProgress();
          swiper.updateSlidesClasses();

          if (swiper.lazy && swiper.params.lazy.enabled) {
            swiper.lazy.load();
          }

          emit('virtualUpdate');
        }

        if (previousFrom === from && previousTo === to && !force) {
          if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
            swiper.slides.css(offsetProp, `${offset}px`);
          }

          swiper.updateProgress();
          emit('virtualUpdate');
          return;
        }

        if (swiper.params.virtual.renderExternal) {
          swiper.params.virtual.renderExternal.call(swiper, {
            offset,
            from,
            to,
            slides: function getSlides() {
              const slidesToRender = [];

              for (let i = from; i <= to; i += 1) {
                slidesToRender.push(slides[i]);
              }

              return slidesToRender;
            }()
          });

          if (swiper.params.virtual.renderExternalUpdate) {
            onRendered();
          } else {
            emit('virtualUpdate');
          }

          return;
        }

        const prependIndexes = [];
        const appendIndexes = [];

        if (force) {
          swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
        } else {
          for (let i = previousFrom; i <= previousTo; i += 1) {
            if (i < from || i > to) {
              swiper.$wrapperEl.find(`.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`).remove();
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          if (i >= from && i <= to) {
            if (typeof previousTo === 'undefined' || force) {
              appendIndexes.push(i);
            } else {
              if (i > previousTo) appendIndexes.push(i);
              if (i < previousFrom) prependIndexes.push(i);
            }
          }
        }

        appendIndexes.forEach(index => {
          swiper.$wrapperEl.append(renderSlide(slides[index], index));
        });
        prependIndexes.sort((a, b) => b - a).forEach(index => {
          swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
        });
        swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, `${offset}px`);
        onRendered();
      }

      function appendSlide(slides) {
        if (typeof slides === 'object' && 'length' in slides) {
          for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) swiper.virtual.slides.push(slides[i]);
          }
        } else {
          swiper.virtual.slides.push(slides);
        }

        update(true);
      }

      function prependSlide(slides) {
        const activeIndex = swiper.activeIndex;
        let newActiveIndex = activeIndex + 1;
        let numberOfNewSlides = 1;

        if (Array.isArray(slides)) {
          for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
          }

          newActiveIndex = activeIndex + slides.length;
          numberOfNewSlides = slides.length;
        } else {
          swiper.virtual.slides.unshift(slides);
        }

        if (swiper.params.virtual.cache) {
          const cache = swiper.virtual.cache;
          const newCache = {};
          Object.keys(cache).forEach(cachedIndex => {
            const $cachedEl = cache[cachedIndex];
            const cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

            if (cachedElIndex) {
              $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
            }

            newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
          });
          swiper.virtual.cache = newCache;
        }

        update(true);
        swiper.slideTo(newActiveIndex, 0);
      }

      function removeSlide(slidesIndexes) {
        if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
        let activeIndex = swiper.activeIndex;

        if (Array.isArray(slidesIndexes)) {
          for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
            swiper.virtual.slides.splice(slidesIndexes[i], 1);

            if (swiper.params.virtual.cache) {
              delete swiper.virtual.cache[slidesIndexes[i]];
            }

            if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
            activeIndex = Math.max(activeIndex, 0);
          }
        } else {
          swiper.virtual.slides.splice(slidesIndexes, 1);

          if (swiper.params.virtual.cache) {
            delete swiper.virtual.cache[slidesIndexes];
          }

          if (slidesIndexes < activeIndex) activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }

        update(true);
        swiper.slideTo(activeIndex, 0);
      }

      function removeAllSlides() {
        swiper.virtual.slides = [];

        if (swiper.params.virtual.cache) {
          swiper.virtual.cache = {};
        }

        update(true);
        swiper.slideTo(0, 0);
      }

      on('beforeInit', () => {
        if (!swiper.params.virtual.enabled) return;
        swiper.virtual.slides = swiper.params.virtual.slides;
        swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;

        if (!swiper.params.initialSlide) {
          update();
        }
      });
      on('setTranslate', () => {
        if (!swiper.params.virtual.enabled) return;

        if (swiper.params.cssMode && !swiper._immediateVirtual) {
          clearTimeout(cssModeTimeout);
          cssModeTimeout = setTimeout(() => {
            update();
          }, 100);
        } else {
          update();
        }
      });
      on('init update resize', () => {
        if (!swiper.params.virtual.enabled) return;

        if (swiper.params.cssMode) {
          setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
        }
      });
      Object.assign(swiper.virtual, {
        appendSlide,
        prependSlide,
        removeSlide,
        removeAllSlides,
        update
      });
    }

    /* eslint-disable consistent-return */
    function Keyboard(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const document = getDocument();
      const window = getWindow();
      swiper.keyboard = {
        enabled: false
      };
      extendParams({
        keyboard: {
          enabled: false,
          onlyInViewport: true,
          pageUpDown: true
        }
      });

      function handle(event) {
        if (!swiper.enabled) return;
        const {
          rtlTranslate: rtl
        } = swiper;
        let e = event;
        if (e.originalEvent) e = e.originalEvent; // jquery fix

        const kc = e.keyCode || e.charCode;
        const pageUpDown = swiper.params.keyboard.pageUpDown;
        const isPageUp = pageUpDown && kc === 33;
        const isPageDown = pageUpDown && kc === 34;
        const isArrowLeft = kc === 37;
        const isArrowRight = kc === 39;
        const isArrowUp = kc === 38;
        const isArrowDown = kc === 40; // Directions locks

        if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
          return false;
        }

        if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
          return false;
        }

        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
          return undefined;
        }

        if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
          return undefined;
        }

        if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
          let inView = false; // Check that swiper should be inside of visible area of window

          if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
            return undefined;
          }

          const $el = swiper.$el;
          const swiperWidth = $el[0].clientWidth;
          const swiperHeight = $el[0].clientHeight;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const swiperOffset = swiper.$el.offset();
          if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
          const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

          for (let i = 0; i < swiperCoord.length; i += 1) {
            const point = swiperCoord[i];

            if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
              if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

              inView = true;
            }
          }

          if (!inView) return undefined;
        }

        if (swiper.isHorizontal()) {
          if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
            if (e.preventDefault) e.preventDefault();else e.returnValue = false;
          }

          if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
          if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
        } else {
          if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
            if (e.preventDefault) e.preventDefault();else e.returnValue = false;
          }

          if (isPageDown || isArrowDown) swiper.slideNext();
          if (isPageUp || isArrowUp) swiper.slidePrev();
        }

        emit('keyPress', kc);
        return undefined;
      }

      function enable() {
        if (swiper.keyboard.enabled) return;
        $(document).on('keydown', handle);
        swiper.keyboard.enabled = true;
      }

      function disable() {
        if (!swiper.keyboard.enabled) return;
        $(document).off('keydown', handle);
        swiper.keyboard.enabled = false;
      }

      on('init', () => {
        if (swiper.params.keyboard.enabled) {
          enable();
        }
      });
      on('destroy', () => {
        if (swiper.keyboard.enabled) {
          disable();
        }
      });
      Object.assign(swiper.keyboard, {
        enable,
        disable
      });
    }

    /* eslint-disable consistent-return */
    function Mousewheel(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const window = getWindow();
      extendParams({
        mousewheel: {
          enabled: false,
          releaseOnEdges: false,
          invert: false,
          forceToAxis: false,
          sensitivity: 1,
          eventsTarget: 'container',
          thresholdDelta: null,
          thresholdTime: null
        }
      });
      swiper.mousewheel = {
        enabled: false
      };
      let timeout;
      let lastScrollTime = now();
      let lastEventBeforeSnap;
      const recentWheelEvents = [];

      function normalize(e) {
        // Reasonable defaults
        const PIXEL_STEP = 10;
        const LINE_HEIGHT = 40;
        const PAGE_HEIGHT = 800;
        let sX = 0;
        let sY = 0; // spinX, spinY

        let pX = 0;
        let pY = 0; // pixelX, pixelY
        // Legacy

        if ('detail' in e) {
          sY = e.detail;
        }

        if ('wheelDelta' in e) {
          sY = -e.wheelDelta / 120;
        }

        if ('wheelDeltaY' in e) {
          sY = -e.wheelDeltaY / 120;
        }

        if ('wheelDeltaX' in e) {
          sX = -e.wheelDeltaX / 120;
        } // side scrolling on FF with DOMMouseScroll


        if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
          sX = sY;
          sY = 0;
        }

        pX = sX * PIXEL_STEP;
        pY = sY * PIXEL_STEP;

        if ('deltaY' in e) {
          pY = e.deltaY;
        }

        if ('deltaX' in e) {
          pX = e.deltaX;
        }

        if (e.shiftKey && !pX) {
          // if user scrolls with shift he wants horizontal scroll
          pX = pY;
          pY = 0;
        }

        if ((pX || pY) && e.deltaMode) {
          if (e.deltaMode === 1) {
            // delta in LINE units
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
          } else {
            // delta in PAGE units
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
          }
        } // Fall-back if spin cannot be determined


        if (pX && !sX) {
          sX = pX < 1 ? -1 : 1;
        }

        if (pY && !sY) {
          sY = pY < 1 ? -1 : 1;
        }

        return {
          spinX: sX,
          spinY: sY,
          pixelX: pX,
          pixelY: pY
        };
      }

      function handleMouseEnter() {
        if (!swiper.enabled) return;
        swiper.mouseEntered = true;
      }

      function handleMouseLeave() {
        if (!swiper.enabled) return;
        swiper.mouseEntered = false;
      }

      function animateSlider(newEvent) {
        if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
          // Prevent if delta of wheel scroll delta is below configured threshold
          return false;
        }

        if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
          // Prevent if time between scrolls is below configured threshold
          return false;
        } // If the movement is NOT big enough and
        // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
        //   Don't go any further (avoid insignificant scroll movement).


        if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
          // Return false as a default
          return true;
        } // If user is scrolling towards the end:
        //   If the slider hasn't hit the latest slide or
        //   if the slider is a loop and
        //   if the slider isn't moving right now:
        //     Go to next slide and
        //     emit a scroll event.
        // Else (the user is scrolling towards the beginning) and
        // if the slider hasn't hit the first slide or
        // if the slider is a loop and
        // if the slider isn't moving right now:
        //   Go to prev slide and
        //   emit a scroll event.


        if (newEvent.direction < 0) {
          if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
            swiper.slideNext();
            emit('scroll', newEvent.raw);
          }
        } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
          swiper.slidePrev();
          emit('scroll', newEvent.raw);
        } // If you got here is because an animation has been triggered so store the current time


        lastScrollTime = new window.Date().getTime(); // Return false as a default

        return false;
      }

      function releaseScroll(newEvent) {
        const params = swiper.params.mousewheel;

        if (newEvent.direction < 0) {
          if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
            // Return true to animate scroll on edges
            return true;
          }
        } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }

        return false;
      }

      function handle(event) {
        let e = event;
        let disableParentSwiper = true;
        if (!swiper.enabled) return;
        const params = swiper.params.mousewheel;

        if (swiper.params.cssMode) {
          e.preventDefault();
        }

        let target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
        if (e.originalEvent) e = e.originalEvent; // jquery fix

        let delta = 0;
        const rtlFactor = swiper.rtlTranslate ? -1 : 1;
        const data = normalize(e);

        if (params.forceToAxis) {
          if (swiper.isHorizontal()) {
            if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
          } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
        } else {
          delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
        }

        if (delta === 0) return true;
        if (params.invert) delta = -delta; // Get the scroll positions

        let positions = swiper.getTranslate() + delta * params.sensitivity;
        if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
        if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
        //     the disableParentSwiper will be true.
        // When loop is false:
        //     if the scroll positions is not on edge,
        //     then the disableParentSwiper will be true.
        //     if the scroll on edge positions,
        //     then the disableParentSwiper will be false.

        disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
        if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

        if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
          // Register the new event in a variable which stores the relevant data
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta),
            raw: event
          }; // Keep the most recent events

          if (recentWheelEvents.length >= 2) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
          //   If direction has changed or
          //   if the scroll is quicker than the previous one:
          //     Animate the slider.
          // Else (this is the first time the wheel is moved):
          //     Animate the slider.

          if (prevEvent) {
            if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
              animateSlider(newEvent);
            }
          } else {
            animateSlider(newEvent);
          } // If it's time to release the scroll:
          //   Return now so you don't hit the preventDefault.


          if (releaseScroll(newEvent)) {
            return true;
          }
        } else {
          // Freemode or scrollContainer:
          // If we recently snapped after a momentum scroll, then ignore wheel events
          // to give time for the deceleration to finish. Stop ignoring after 500 msecs
          // or if it's a new scroll (larger delta or inverse sign as last event before
          // an end-of-momentum snap).
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta)
          };
          const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

          if (!ignoreWheelEvents) {
            lastEventBeforeSnap = undefined;

            if (swiper.params.loop) {
              swiper.loopFix();
            }

            let position = swiper.getTranslate() + delta * params.sensitivity;
            const wasBeginning = swiper.isBeginning;
            const wasEnd = swiper.isEnd;
            if (position >= swiper.minTranslate()) position = swiper.minTranslate();
            if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
            swiper.setTransition(0);
            swiper.setTranslate(position);
            swiper.updateProgress();
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();

            if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
              swiper.updateSlidesClasses();
            }

            if (swiper.params.freeMode.sticky) {
              // When wheel scrolling starts with sticky (aka snap) enabled, then detect
              // the end of a momentum scroll by storing recent (N=15?) wheel events.
              // 1. do all N events have decreasing or same (absolute value) delta?
              // 2. did all N events arrive in the last M (M=500?) msecs?
              // 3. does the earliest event have an (absolute value) delta that's
              //    at least P (P=1?) larger than the most recent event's delta?
              // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
              // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
              // Snap immediately and ignore remaining wheel events in this scroll.
              // See comment above for "remaining wheel events in this scroll" determination.
              // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
              clearTimeout(timeout);
              timeout = undefined;

              if (recentWheelEvents.length >= 15) {
                recentWheelEvents.shift(); // only store the last N events
              }

              const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
              const firstEvent = recentWheelEvents[0];
              recentWheelEvents.push(newEvent);

              if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
                // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
                recentWheelEvents.splice(0);
              } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
                // We're at the end of the deceleration of a momentum scroll, so there's no need
                // to wait for more events. Snap ASAP on the next tick.
                // Also, because there's some remaining momentum we'll bias the snap in the
                // direction of the ongoing scroll because it's better UX for the scroll to snap
                // in the same direction as the scroll instead of reversing to snap.  Therefore,
                // if it's already scrolled more than 20% in the current direction, keep going.
                const snapToThreshold = delta > 0 ? 0.8 : 0.2;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                timeout = nextTick(() => {
                  swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                }, 0); // no delay; move on next tick
              }

              if (!timeout) {
                // if we get here, then we haven't detected the end of a momentum scroll, so
                // we'll consider a scroll "complete" when there haven't been any wheel events
                // for 500ms.
                timeout = nextTick(() => {
                  const snapToThreshold = 0.5;
                  lastEventBeforeSnap = newEvent;
                  recentWheelEvents.splice(0);
                  swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                }, 500);
              }
            } // Emit event


            if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

            if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

            if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
          }
        }

        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        return false;
      }

      function events(method) {
        let target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        target[method]('mouseenter', handleMouseEnter);
        target[method]('mouseleave', handleMouseLeave);
        target[method]('wheel', handle);
      }

      function enable() {
        if (swiper.params.cssMode) {
          swiper.wrapperEl.removeEventListener('wheel', handle);
          return true;
        }

        if (swiper.mousewheel.enabled) return false;
        events('on');
        swiper.mousewheel.enabled = true;
        return true;
      }

      function disable() {
        if (swiper.params.cssMode) {
          swiper.wrapperEl.addEventListener(event, handle);
          return true;
        }

        if (!swiper.mousewheel.enabled) return false;
        events('off');
        swiper.mousewheel.enabled = false;
        return true;
      }

      on('init', () => {
        if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
          disable();
        }

        if (swiper.params.mousewheel.enabled) enable();
      });
      on('destroy', () => {
        if (swiper.params.cssMode) {
          enable();
        }

        if (swiper.mousewheel.enabled) disable();
      });
      Object.assign(swiper.mousewheel, {
        enable,
        disable
      });
    }

    function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
      const document = getDocument();

      if (swiper.params.createElements) {
        Object.keys(checkProps).forEach(key => {
          if (!params[key] && params.auto === true) {
            let element = swiper.$el.children(`.${checkProps[key]}`)[0];

            if (!element) {
              element = document.createElement('div');
              element.className = checkProps[key];
              swiper.$el.append(element);
            }

            params[key] = element;
            originalParams[key] = element;
          }
        });
      }

      return params;
    }

    function Navigation(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: false,
          disabledClass: 'swiper-button-disabled',
          hiddenClass: 'swiper-button-hidden',
          lockClass: 'swiper-button-lock'
        }
      });
      swiper.navigation = {
        nextEl: null,
        $nextEl: null,
        prevEl: null,
        $prevEl: null
      };

      function getEl(el) {
        let $el;

        if (el) {
          $el = $(el);

          if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
            $el = swiper.$el.find(el);
          }
        }

        return $el;
      }

      function toggleEl($el, disabled) {
        const params = swiper.params.navigation;

        if ($el && $el.length > 0) {
          $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
          if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

          if (swiper.params.watchOverflow && swiper.enabled) {
            $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
          }
        }
      }

      function update() {
        // Update Navigation Buttons
        if (swiper.params.loop) return;
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;
        toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
        toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
      }

      function onPrevClick(e) {
        e.preventDefault();
        if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
        swiper.slidePrev();
      }

      function onNextClick(e) {
        e.preventDefault();
        if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
        swiper.slideNext();
      }

      function init() {
        const params = swiper.params.navigation;
        swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
          nextEl: 'swiper-button-next',
          prevEl: 'swiper-button-prev'
        });
        if (!(params.nextEl || params.prevEl)) return;
        const $nextEl = getEl(params.nextEl);
        const $prevEl = getEl(params.prevEl);

        if ($nextEl && $nextEl.length > 0) {
          $nextEl.on('click', onNextClick);
        }

        if ($prevEl && $prevEl.length > 0) {
          $prevEl.on('click', onPrevClick);
        }

        Object.assign(swiper.navigation, {
          $nextEl,
          nextEl: $nextEl && $nextEl[0],
          $prevEl,
          prevEl: $prevEl && $prevEl[0]
        });

        if (!swiper.enabled) {
          if ($nextEl) $nextEl.addClass(params.lockClass);
          if ($prevEl) $prevEl.addClass(params.lockClass);
        }
      }

      function destroy() {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($nextEl && $nextEl.length) {
          $nextEl.off('click', onNextClick);
          $nextEl.removeClass(swiper.params.navigation.disabledClass);
        }

        if ($prevEl && $prevEl.length) {
          $prevEl.off('click', onPrevClick);
          $prevEl.removeClass(swiper.params.navigation.disabledClass);
        }
      }

      on('init', () => {
        init();
        update();
      });
      on('toEdge fromEdge lock unlock', () => {
        update();
      });
      on('destroy', () => {
        destroy();
      });
      on('enable disable', () => {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($nextEl) {
          $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
        }

        if ($prevEl) {
          $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
        }
      });
      on('click', (_s, e) => {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;
        const targetEl = e.target;

        if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
          if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
          let isHidden;

          if ($nextEl) {
            isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
          } else if ($prevEl) {
            isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
          }

          if (isHidden === true) {
            emit('navigationShow');
          } else {
            emit('navigationHide');
          }

          if ($nextEl) {
            $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
          }

          if ($prevEl) {
            $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
          }
        }
      });
      Object.assign(swiper.navigation, {
        update,
        init,
        destroy
      });
    }

    function classesToSelector(classes) {
      if (classes === void 0) {
        classes = '';
      }

      return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
    }

    function Pagination(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const pfx = 'swiper-pagination';
      extendParams({
        pagination: {
          el: null,
          bulletElement: 'span',
          clickable: false,
          hideOnClick: false,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: false,
          type: 'bullets',
          // 'bullets' or 'progressbar' or 'fraction' or 'custom'
          dynamicBullets: false,
          dynamicMainBullets: 1,
          formatFractionCurrent: number => number,
          formatFractionTotal: number => number,
          bulletClass: `${pfx}-bullet`,
          bulletActiveClass: `${pfx}-bullet-active`,
          modifierClass: `${pfx}-`,
          currentClass: `${pfx}-current`,
          totalClass: `${pfx}-total`,
          hiddenClass: `${pfx}-hidden`,
          progressbarFillClass: `${pfx}-progressbar-fill`,
          progressbarOppositeClass: `${pfx}-progressbar-opposite`,
          clickableClass: `${pfx}-clickable`,
          lockClass: `${pfx}-lock`,
          horizontalClass: `${pfx}-horizontal`,
          verticalClass: `${pfx}-vertical`
        }
      });
      swiper.pagination = {
        el: null,
        $el: null,
        bullets: []
      };
      let bulletSize;
      let dynamicBulletIndex = 0;

      function isPaginationDisabled() {
        return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
      }

      function setSideBullets($bulletEl, position) {
        const {
          bulletActiveClass
        } = swiper.params.pagination;
        $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
      }

      function update() {
        // Render || Update Pagination bullets/items
        const rtl = swiper.rtl;
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
        const $el = swiper.pagination.$el; // Current/Total

        let current;
        const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

        if (swiper.params.loop) {
          current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

          if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
            current -= slidesLength - swiper.loopedSlides * 2;
          }

          if (current > total - 1) current -= total;
          if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
        } else if (typeof swiper.snapIndex !== 'undefined') {
          current = swiper.snapIndex;
        } else {
          current = swiper.activeIndex || 0;
        } // Types


        if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
          const bullets = swiper.pagination.bullets;
          let firstIndex;
          let lastIndex;
          let midIndex;

          if (params.dynamicBullets) {
            bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
            $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

            if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
              dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);

              if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
                dynamicBulletIndex = params.dynamicMainBullets - 1;
              } else if (dynamicBulletIndex < 0) {
                dynamicBulletIndex = 0;
              }
            }

            firstIndex = Math.max(current - dynamicBulletIndex, 0);
            lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
            midIndex = (lastIndex + firstIndex) / 2;
          }

          bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

          if ($el.length > 1) {
            bullets.each(bullet => {
              const $bullet = $(bullet);
              const bulletIndex = $bullet.index();

              if (bulletIndex === current) {
                $bullet.addClass(params.bulletActiveClass);
              }

              if (params.dynamicBullets) {
                if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                  $bullet.addClass(`${params.bulletActiveClass}-main`);
                }

                if (bulletIndex === firstIndex) {
                  setSideBullets($bullet, 'prev');
                }

                if (bulletIndex === lastIndex) {
                  setSideBullets($bullet, 'next');
                }
              }
            });
          } else {
            const $bullet = bullets.eq(current);
            const bulletIndex = $bullet.index();
            $bullet.addClass(params.bulletActiveClass);

            if (params.dynamicBullets) {
              const $firstDisplayedBullet = bullets.eq(firstIndex);
              const $lastDisplayedBullet = bullets.eq(lastIndex);

              for (let i = firstIndex; i <= lastIndex; i += 1) {
                bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
              }

              if (swiper.params.loop) {
                if (bulletIndex >= bullets.length) {
                  for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                    bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                  }

                  bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                } else {
                  setSideBullets($firstDisplayedBullet, 'prev');
                  setSideBullets($lastDisplayedBullet, 'next');
                }
              } else {
                setSideBullets($firstDisplayedBullet, 'prev');
                setSideBullets($lastDisplayedBullet, 'next');
              }
            }
          }

          if (params.dynamicBullets) {
            const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
            const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
            const offsetProp = rtl ? 'right' : 'left';
            bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
          }
        }

        if (params.type === 'fraction') {
          $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
          $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
        }

        if (params.type === 'progressbar') {
          let progressbarDirection;

          if (params.progressbarOpposite) {
            progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
          } else {
            progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
          }

          const scale = (current + 1) / total;
          let scaleX = 1;
          let scaleY = 1;

          if (progressbarDirection === 'horizontal') {
            scaleX = scale;
          } else {
            scaleY = scale;
          }

          $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
        }

        if (params.type === 'custom' && params.renderCustom) {
          $el.html(params.renderCustom(swiper, current + 1, total));
          emit('paginationRender', $el[0]);
        } else {
          emit('paginationUpdate', $el[0]);
        }

        if (swiper.params.watchOverflow && swiper.enabled) {
          $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
        }
      }

      function render() {
        // Render Container
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
        const $el = swiper.pagination.$el;
        let paginationHTML = '';

        if (params.type === 'bullets') {
          let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

          if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
            numberOfBullets = slidesLength;
          }

          for (let i = 0; i < numberOfBullets; i += 1) {
            if (params.renderBullet) {
              paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
            } else {
              paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
            }
          }

          $el.html(paginationHTML);
          swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
        }

        if (params.type === 'fraction') {
          if (params.renderFraction) {
            paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
          } else {
            paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
          }

          $el.html(paginationHTML);
        }

        if (params.type === 'progressbar') {
          if (params.renderProgressbar) {
            paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
          } else {
            paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
          }

          $el.html(paginationHTML);
        }

        if (params.type !== 'custom') {
          emit('paginationRender', swiper.pagination.$el[0]);
        }
      }

      function init() {
        swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
          el: 'swiper-pagination'
        });
        const params = swiper.params.pagination;
        if (!params.el) return;
        let $el = $(params.el);
        if ($el.length === 0) return;

        if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
          $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

          if ($el.length > 1) {
            $el = $el.filter(el => {
              if ($(el).parents('.swiper')[0] !== swiper.el) return false;
              return true;
            });
          }
        }

        if (params.type === 'bullets' && params.clickable) {
          $el.addClass(params.clickableClass);
        }

        $el.addClass(params.modifierClass + params.type);
        $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);

        if (params.type === 'bullets' && params.dynamicBullets) {
          $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
          dynamicBulletIndex = 0;

          if (params.dynamicMainBullets < 1) {
            params.dynamicMainBullets = 1;
          }
        }

        if (params.type === 'progressbar' && params.progressbarOpposite) {
          $el.addClass(params.progressbarOppositeClass);
        }

        if (params.clickable) {
          $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
            e.preventDefault();
            let index = $(this).index() * swiper.params.slidesPerGroup;
            if (swiper.params.loop) index += swiper.loopedSlides;
            swiper.slideTo(index);
          });
        }

        Object.assign(swiper.pagination, {
          $el,
          el: $el[0]
        });

        if (!swiper.enabled) {
          $el.addClass(params.lockClass);
        }
      }

      function destroy() {
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const $el = swiper.pagination.$el;
        $el.removeClass(params.hiddenClass);
        $el.removeClass(params.modifierClass + params.type);
        $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

        if (params.clickable) {
          $el.off('click', classesToSelector(params.bulletClass));
        }
      }

      on('init', () => {
        init();
        render();
        update();
      });
      on('activeIndexChange', () => {
        if (swiper.params.loop) {
          update();
        } else if (typeof swiper.snapIndex === 'undefined') {
          update();
        }
      });
      on('snapIndexChange', () => {
        if (!swiper.params.loop) {
          update();
        }
      });
      on('slidesLengthChange', () => {
        if (swiper.params.loop) {
          render();
          update();
        }
      });
      on('snapGridLengthChange', () => {
        if (!swiper.params.loop) {
          render();
          update();
        }
      });
      on('destroy', () => {
        destroy();
      });
      on('enable disable', () => {
        const {
          $el
        } = swiper.pagination;

        if ($el) {
          $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
        }
      });
      on('lock unlock', () => {
        update();
      });
      on('click', (_s, e) => {
        const targetEl = e.target;
        const {
          $el
        } = swiper.pagination;

        if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
          if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
          const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

          if (isHidden === true) {
            emit('paginationShow');
          } else {
            emit('paginationHide');
          }

          $el.toggleClass(swiper.params.pagination.hiddenClass);
        }
      });
      Object.assign(swiper.pagination, {
        render,
        update,
        init,
        destroy
      });
    }

    function Scrollbar(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const document = getDocument();
      let isTouched = false;
      let timeout = null;
      let dragTimeout = null;
      let dragStartPos;
      let dragSize;
      let trackSize;
      let divider;
      extendParams({
        scrollbar: {
          el: null,
          dragSize: 'auto',
          hide: false,
          draggable: false,
          snapOnRelease: true,
          lockClass: 'swiper-scrollbar-lock',
          dragClass: 'swiper-scrollbar-drag'
        }
      });
      swiper.scrollbar = {
        el: null,
        dragEl: null,
        $el: null,
        $dragEl: null
      };

      function setTranslate() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        const {
          scrollbar,
          rtlTranslate: rtl,
          progress
        } = swiper;
        const {
          $dragEl,
          $el
        } = scrollbar;
        const params = swiper.params.scrollbar;
        let newSize = dragSize;
        let newPos = (trackSize - dragSize) * progress;

        if (rtl) {
          newPos = -newPos;

          if (newPos > 0) {
            newSize = dragSize - newPos;
            newPos = 0;
          } else if (-newPos + dragSize > trackSize) {
            newSize = trackSize + newPos;
          }
        } else if (newPos < 0) {
          newSize = dragSize + newPos;
          newPos = 0;
        } else if (newPos + dragSize > trackSize) {
          newSize = trackSize - newPos;
        }

        if (swiper.isHorizontal()) {
          $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
          $dragEl[0].style.width = `${newSize}px`;
        } else {
          $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
          $dragEl[0].style.height = `${newSize}px`;
        }

        if (params.hide) {
          clearTimeout(timeout);
          $el[0].style.opacity = 1;
          timeout = setTimeout(() => {
            $el[0].style.opacity = 0;
            $el.transition(400);
          }, 1000);
        }
      }

      function setTransition(duration) {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        swiper.scrollbar.$dragEl.transition(duration);
      }

      function updateSize() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        const {
          scrollbar
        } = swiper;
        const {
          $dragEl,
          $el
        } = scrollbar;
        $dragEl[0].style.width = '';
        $dragEl[0].style.height = '';
        trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
        divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

        if (swiper.params.scrollbar.dragSize === 'auto') {
          dragSize = trackSize * divider;
        } else {
          dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
        }

        if (swiper.isHorizontal()) {
          $dragEl[0].style.width = `${dragSize}px`;
        } else {
          $dragEl[0].style.height = `${dragSize}px`;
        }

        if (divider >= 1) {
          $el[0].style.display = 'none';
        } else {
          $el[0].style.display = '';
        }

        if (swiper.params.scrollbar.hide) {
          $el[0].style.opacity = 0;
        }

        if (swiper.params.watchOverflow && swiper.enabled) {
          scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
        }
      }

      function getPointerPosition(e) {
        if (swiper.isHorizontal()) {
          return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
        }

        return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
      }

      function setDragPosition(e) {
        const {
          scrollbar,
          rtlTranslate: rtl
        } = swiper;
        const {
          $el
        } = scrollbar;
        let positionRatio;
        positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
        positionRatio = Math.max(Math.min(positionRatio, 1), 0);

        if (rtl) {
          positionRatio = 1 - positionRatio;
        }

        const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
        swiper.updateProgress(position);
        swiper.setTranslate(position);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      function onDragStart(e) {
        const params = swiper.params.scrollbar;
        const {
          scrollbar,
          $wrapperEl
        } = swiper;
        const {
          $el,
          $dragEl
        } = scrollbar;
        isTouched = true;
        dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
        e.preventDefault();
        e.stopPropagation();
        $wrapperEl.transition(100);
        $dragEl.transition(100);
        setDragPosition(e);
        clearTimeout(dragTimeout);
        $el.transition(0);

        if (params.hide) {
          $el.css('opacity', 1);
        }

        if (swiper.params.cssMode) {
          swiper.$wrapperEl.css('scroll-snap-type', 'none');
        }

        emit('scrollbarDragStart', e);
      }

      function onDragMove(e) {
        const {
          scrollbar,
          $wrapperEl
        } = swiper;
        const {
          $el,
          $dragEl
        } = scrollbar;
        if (!isTouched) return;
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        setDragPosition(e);
        $wrapperEl.transition(0);
        $el.transition(0);
        $dragEl.transition(0);
        emit('scrollbarDragMove', e);
      }

      function onDragEnd(e) {
        const params = swiper.params.scrollbar;
        const {
          scrollbar,
          $wrapperEl
        } = swiper;
        const {
          $el
        } = scrollbar;
        if (!isTouched) return;
        isTouched = false;

        if (swiper.params.cssMode) {
          swiper.$wrapperEl.css('scroll-snap-type', '');
          $wrapperEl.transition('');
        }

        if (params.hide) {
          clearTimeout(dragTimeout);
          dragTimeout = nextTick(() => {
            $el.css('opacity', 0);
            $el.transition(400);
          }, 1000);
        }

        emit('scrollbarDragEnd', e);

        if (params.snapOnRelease) {
          swiper.slideToClosest();
        }
      }

      function events(method) {
        const {
          scrollbar,
          touchEventsTouch,
          touchEventsDesktop,
          params,
          support
        } = swiper;
        const $el = scrollbar.$el;
        const target = $el[0];
        const activeListener = support.passiveListener && params.passiveListeners ? {
          passive: false,
          capture: false
        } : false;
        const passiveListener = support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        if (!target) return;
        const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

        if (!support.touch) {
          target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
          document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
          document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
        } else {
          target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
          target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
          target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
        }
      }

      function enableDraggable() {
        if (!swiper.params.scrollbar.el) return;
        events('on');
      }

      function disableDraggable() {
        if (!swiper.params.scrollbar.el) return;
        events('off');
      }

      function init() {
        const {
          scrollbar,
          $el: $swiperEl
        } = swiper;
        swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
          el: 'swiper-scrollbar'
        });
        const params = swiper.params.scrollbar;
        if (!params.el) return;
        let $el = $(params.el);

        if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
          $el = $swiperEl.find(params.el);
        }

        let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

        if ($dragEl.length === 0) {
          $dragEl = $(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
          $el.append($dragEl);
        }

        Object.assign(scrollbar, {
          $el,
          el: $el[0],
          $dragEl,
          dragEl: $dragEl[0]
        });

        if (params.draggable) {
          enableDraggable();
        }

        if ($el) {
          $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
        }
      }

      function destroy() {
        disableDraggable();
      }

      on('init', () => {
        init();
        updateSize();
        setTranslate();
      });
      on('update resize observerUpdate lock unlock', () => {
        updateSize();
      });
      on('setTranslate', () => {
        setTranslate();
      });
      on('setTransition', (_s, duration) => {
        setTransition(duration);
      });
      on('enable disable', () => {
        const {
          $el
        } = swiper.scrollbar;

        if ($el) {
          $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
        }
      });
      on('destroy', () => {
        destroy();
      });
      Object.assign(swiper.scrollbar, {
        updateSize,
        setTranslate,
        init,
        destroy
      });
    }

    function Parallax(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        parallax: {
          enabled: false
        }
      });

      const setTransform = (el, progress) => {
        const {
          rtl
        } = swiper;
        const $el = $(el);
        const rtlFactor = rtl ? -1 : 1;
        const p = $el.attr('data-swiper-parallax') || '0';
        let x = $el.attr('data-swiper-parallax-x');
        let y = $el.attr('data-swiper-parallax-y');
        const scale = $el.attr('data-swiper-parallax-scale');
        const opacity = $el.attr('data-swiper-parallax-opacity');

        if (x || y) {
          x = x || '0';
          y = y || '0';
        } else if (swiper.isHorizontal()) {
          x = p;
          y = '0';
        } else {
          y = p;
          x = '0';
        }

        if (x.indexOf('%') >= 0) {
          x = `${parseInt(x, 10) * progress * rtlFactor}%`;
        } else {
          x = `${x * progress * rtlFactor}px`;
        }

        if (y.indexOf('%') >= 0) {
          y = `${parseInt(y, 10) * progress}%`;
        } else {
          y = `${y * progress}px`;
        }

        if (typeof opacity !== 'undefined' && opacity !== null) {
          const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
          $el[0].style.opacity = currentOpacity;
        }

        if (typeof scale === 'undefined' || scale === null) {
          $el.transform(`translate3d(${x}, ${y}, 0px)`);
        } else {
          const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
          $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
        }
      };

      const setTranslate = () => {
        const {
          $el,
          slides,
          progress,
          snapGrid
        } = swiper;
        $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
          setTransform(el, progress);
        });
        slides.each((slideEl, slideIndex) => {
          let slideProgress = slideEl.progress;

          if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
            slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
          }

          slideProgress = Math.min(Math.max(slideProgress, -1), 1);
          $(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
            setTransform(el, slideProgress);
          });
        });
      };

      const setTransition = function (duration) {
        if (duration === void 0) {
          duration = swiper.params.speed;
        }

        const {
          $el
        } = swiper;
        $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
          const $parallaxEl = $(parallaxEl);
          let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
          if (duration === 0) parallaxDuration = 0;
          $parallaxEl.transition(parallaxDuration);
        });
      };

      on('beforeInit', () => {
        if (!swiper.params.parallax.enabled) return;
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      });
      on('init', () => {
        if (!swiper.params.parallax.enabled) return;
        setTranslate();
      });
      on('setTranslate', () => {
        if (!swiper.params.parallax.enabled) return;
        setTranslate();
      });
      on('setTransition', (_swiper, duration) => {
        if (!swiper.params.parallax.enabled) return;
        setTransition(duration);
      });
    }

    function Zoom(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const window = getWindow();
      extendParams({
        zoom: {
          enabled: false,
          maxRatio: 3,
          minRatio: 1,
          toggle: true,
          containerClass: 'swiper-zoom-container',
          zoomedSlideClass: 'swiper-slide-zoomed'
        }
      });
      swiper.zoom = {
        enabled: false
      };
      let currentScale = 1;
      let isScaling = false;
      let gesturesEnabled;
      let fakeGestureTouched;
      let fakeGestureMoved;
      const gesture = {
        $slideEl: undefined,
        slideWidth: undefined,
        slideHeight: undefined,
        $imageEl: undefined,
        $imageWrapEl: undefined,
        maxRatio: 3
      };
      const image = {
        isTouched: undefined,
        isMoved: undefined,
        currentX: undefined,
        currentY: undefined,
        minX: undefined,
        minY: undefined,
        maxX: undefined,
        maxY: undefined,
        width: undefined,
        height: undefined,
        startX: undefined,
        startY: undefined,
        touchesStart: {},
        touchesCurrent: {}
      };
      const velocity = {
        x: undefined,
        y: undefined,
        prevPositionX: undefined,
        prevPositionY: undefined,
        prevTime: undefined
      };
      let scale = 1;
      Object.defineProperty(swiper.zoom, 'scale', {
        get() {
          return scale;
        },

        set(value) {
          if (scale !== value) {
            const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
            const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
            emit('zoomChange', value, imageEl, slideEl);
          }

          scale = value;
        }

      });

      function getDistanceBetweenTouches(e) {
        if (e.targetTouches.length < 2) return 1;
        const x1 = e.targetTouches[0].pageX;
        const y1 = e.targetTouches[0].pageY;
        const x2 = e.targetTouches[1].pageX;
        const y2 = e.targetTouches[1].pageY;
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance;
      } // Events


      function onGestureStart(e) {
        const support = swiper.support;
        const params = swiper.params.zoom;
        fakeGestureTouched = false;
        fakeGestureMoved = false;

        if (!support.gestures) {
          if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
            return;
          }

          fakeGestureTouched = true;
          gesture.scaleStart = getDistanceBetweenTouches(e);
        }

        if (!gesture.$slideEl || !gesture.$slideEl.length) {
          gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
          if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
          gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
          gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

          if (gesture.$imageWrapEl.length === 0) {
            gesture.$imageEl = undefined;
            return;
          }
        }

        if (gesture.$imageEl) {
          gesture.$imageEl.transition(0);
        }

        isScaling = true;
      }

      function onGestureChange(e) {
        const support = swiper.support;
        const params = swiper.params.zoom;
        const zoom = swiper.zoom;

        if (!support.gestures) {
          if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
            return;
          }

          fakeGestureMoved = true;
          gesture.scaleMove = getDistanceBetweenTouches(e);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
          if (e.type === 'gesturechange') onGestureStart(e);
          return;
        }

        if (support.gestures) {
          zoom.scale = e.scale * currentScale;
        } else {
          zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
        }

        if (zoom.scale > gesture.maxRatio) {
          zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
        }

        if (zoom.scale < params.minRatio) {
          zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
        }

        gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }

      function onGestureEnd(e) {
        const device = swiper.device;
        const support = swiper.support;
        const params = swiper.params.zoom;
        const zoom = swiper.zoom;

        if (!support.gestures) {
          if (!fakeGestureTouched || !fakeGestureMoved) {
            return;
          }

          if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
            return;
          }

          fakeGestureTouched = false;
          fakeGestureMoved = false;
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
        gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
        currentScale = zoom.scale;
        isScaling = false;
        if (zoom.scale === 1) gesture.$slideEl = undefined;
      }

      function onTouchStart(e) {
        const device = swiper.device;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        if (image.isTouched) return;
        if (device.android && e.cancelable) e.preventDefault();
        image.isTouched = true;
        image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      }

      function onTouchMove(e) {
        const zoom = swiper.zoom;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        swiper.allowClick = false;
        if (!image.isTouched || !gesture.$slideEl) return;

        if (!image.isMoved) {
          image.width = gesture.$imageEl[0].offsetWidth;
          image.height = gesture.$imageEl[0].offsetHeight;
          image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
          image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
          gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
          gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
          gesture.$imageWrapEl.transition(0);
        } // Define if we need image drag


        const scaledWidth = image.width * zoom.scale;
        const scaledHeight = image.height * zoom.scale;
        if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

        if (!image.isMoved && !isScaling) {
          if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
            image.isTouched = false;
            return;
          }

          if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
            image.isTouched = false;
            return;
          }
        }

        if (e.cancelable) {
          e.preventDefault();
        }

        e.stopPropagation();
        image.isMoved = true;
        image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
        image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

        if (image.currentX < image.minX) {
          image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
        }

        if (image.currentX > image.maxX) {
          image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
        }

        if (image.currentY < image.minY) {
          image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
        }

        if (image.currentY > image.maxY) {
          image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
        } // Velocity


        if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
        if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
        if (!velocity.prevTime) velocity.prevTime = Date.now();
        velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
        velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
        if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
        if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
        velocity.prevPositionX = image.touchesCurrent.x;
        velocity.prevPositionY = image.touchesCurrent.y;
        velocity.prevTime = Date.now();
        gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
      }

      function onTouchEnd() {
        const zoom = swiper.zoom;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

        if (!image.isTouched || !image.isMoved) {
          image.isTouched = false;
          image.isMoved = false;
          return;
        }

        image.isTouched = false;
        image.isMoved = false;
        let momentumDurationX = 300;
        let momentumDurationY = 300;
        const momentumDistanceX = velocity.x * momentumDurationX;
        const newPositionX = image.currentX + momentumDistanceX;
        const momentumDistanceY = velocity.y * momentumDurationY;
        const newPositionY = image.currentY + momentumDistanceY; // Fix duration

        if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
        if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
        const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
        image.currentX = newPositionX;
        image.currentY = newPositionY; // Define if we need image drag

        const scaledWidth = image.width * zoom.scale;
        const scaledHeight = image.height * zoom.scale;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
        image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
        gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
      }

      function onTransitionEnd() {
        const zoom = swiper.zoom;

        if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
          if (gesture.$imageEl) {
            gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
          }

          if (gesture.$imageWrapEl) {
            gesture.$imageWrapEl.transform('translate3d(0,0,0)');
          }

          zoom.scale = 1;
          currentScale = 1;
          gesture.$slideEl = undefined;
          gesture.$imageEl = undefined;
          gesture.$imageWrapEl = undefined;
        }
      }

      function zoomIn(e) {
        const zoom = swiper.zoom;
        const params = swiper.params.zoom;

        if (!gesture.$slideEl) {
          if (e && e.target) {
            gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
          }

          if (!gesture.$slideEl) {
            if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
              gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
            } else {
              gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
            }
          }

          gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
          gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

        if (swiper.params.cssMode) {
          swiper.wrapperEl.style.overflow = 'hidden';
          swiper.wrapperEl.style.touchAction = 'none';
        }

        gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
        let touchX;
        let touchY;
        let offsetX;
        let offsetY;
        let diffX;
        let diffY;
        let translateX;
        let translateY;
        let imageWidth;
        let imageHeight;
        let scaledWidth;
        let scaledHeight;
        let translateMinX;
        let translateMinY;
        let translateMaxX;
        let translateMaxY;
        let slideWidth;
        let slideHeight;

        if (typeof image.touchesStart.x === 'undefined' && e) {
          touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
          touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
        } else {
          touchX = image.touchesStart.x;
          touchY = image.touchesStart.y;
        }

        zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
        currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

        if (e) {
          slideWidth = gesture.$slideEl[0].offsetWidth;
          slideHeight = gesture.$slideEl[0].offsetHeight;
          offsetX = gesture.$slideEl.offset().left + window.scrollX;
          offsetY = gesture.$slideEl.offset().top + window.scrollY;
          diffX = offsetX + slideWidth / 2 - touchX;
          diffY = offsetY + slideHeight / 2 - touchY;
          imageWidth = gesture.$imageEl[0].offsetWidth;
          imageHeight = gesture.$imageEl[0].offsetHeight;
          scaledWidth = imageWidth * zoom.scale;
          scaledHeight = imageHeight * zoom.scale;
          translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
          translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
          translateMaxX = -translateMinX;
          translateMaxY = -translateMinY;
          translateX = diffX * zoom.scale;
          translateY = diffY * zoom.scale;

          if (translateX < translateMinX) {
            translateX = translateMinX;
          }

          if (translateX > translateMaxX) {
            translateX = translateMaxX;
          }

          if (translateY < translateMinY) {
            translateY = translateMinY;
          }

          if (translateY > translateMaxY) {
            translateY = translateMaxY;
          }
        } else {
          translateX = 0;
          translateY = 0;
        }

        gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
        gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }

      function zoomOut() {
        const zoom = swiper.zoom;
        const params = swiper.params.zoom;

        if (!gesture.$slideEl) {
          if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
            gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
          } else {
            gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          }

          gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
          gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

        if (swiper.params.cssMode) {
          swiper.wrapperEl.style.overflow = '';
          swiper.wrapperEl.style.touchAction = '';
        }

        zoom.scale = 1;
        currentScale = 1;
        gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
        gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
        gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
        gesture.$slideEl = undefined;
      } // Toggle Zoom


      function zoomToggle(e) {
        const zoom = swiper.zoom;

        if (zoom.scale && zoom.scale !== 1) {
          // Zoom Out
          zoomOut();
        } else {
          // Zoom In
          zoomIn(e);
        }
      }

      function getListeners() {
        const support = swiper.support;
        const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        const activeListenerWithCapture = support.passiveListener ? {
          passive: false,
          capture: true
        } : true;
        return {
          passiveListener,
          activeListenerWithCapture
        };
      }

      function getSlideSelector() {
        return `.${swiper.params.slideClass}`;
      }

      function toggleGestures(method) {
        const {
          passiveListener
        } = getListeners();
        const slideSelector = getSlideSelector();
        swiper.$wrapperEl[method]('gesturestart', slideSelector, onGestureStart, passiveListener);
        swiper.$wrapperEl[method]('gesturechange', slideSelector, onGestureChange, passiveListener);
        swiper.$wrapperEl[method]('gestureend', slideSelector, onGestureEnd, passiveListener);
      }

      function enableGestures() {
        if (gesturesEnabled) return;
        gesturesEnabled = true;
        toggleGestures('on');
      }

      function disableGestures() {
        if (!gesturesEnabled) return;
        gesturesEnabled = false;
        toggleGestures('off');
      } // Attach/Detach Events


      function enable() {
        const zoom = swiper.zoom;
        if (zoom.enabled) return;
        zoom.enabled = true;
        const support = swiper.support;
        const {
          passiveListener,
          activeListenerWithCapture
        } = getListeners();
        const slideSelector = getSlideSelector(); // Scale image

        if (support.gestures) {
          swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
          swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
        } else if (swiper.touchEvents.start === 'touchstart') {
          swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
          swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
          swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

          if (swiper.touchEvents.cancel) {
            swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
          }
        } // Move image


        swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
      }

      function disable() {
        const zoom = swiper.zoom;
        if (!zoom.enabled) return;
        const support = swiper.support;
        zoom.enabled = false;
        const {
          passiveListener,
          activeListenerWithCapture
        } = getListeners();
        const slideSelector = getSlideSelector(); // Scale image

        if (support.gestures) {
          swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
          swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
        } else if (swiper.touchEvents.start === 'touchstart') {
          swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
          swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
          swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

          if (swiper.touchEvents.cancel) {
            swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
          }
        } // Move image


        swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
      }

      on('init', () => {
        if (swiper.params.zoom.enabled) {
          enable();
        }
      });
      on('destroy', () => {
        disable();
      });
      on('touchStart', (_s, e) => {
        if (!swiper.zoom.enabled) return;
        onTouchStart(e);
      });
      on('touchEnd', (_s, e) => {
        if (!swiper.zoom.enabled) return;
        onTouchEnd();
      });
      on('doubleTap', (_s, e) => {
        if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
          zoomToggle(e);
        }
      });
      on('transitionEnd', () => {
        if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
          onTransitionEnd();
        }
      });
      on('slideChange', () => {
        if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
          onTransitionEnd();
        }
      });
      Object.assign(swiper.zoom, {
        enable,
        disable,
        in: zoomIn,
        out: zoomOut,
        toggle: zoomToggle
      });
    }

    function Lazy(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        lazy: {
          checkInView: false,
          enabled: false,
          loadPrevNext: false,
          loadPrevNextAmount: 1,
          loadOnTransitionStart: false,
          scrollingElement: '',
          elementClass: 'swiper-lazy',
          loadingClass: 'swiper-lazy-loading',
          loadedClass: 'swiper-lazy-loaded',
          preloaderClass: 'swiper-lazy-preloader'
        }
      });
      swiper.lazy = {};
      let scrollHandlerAttached = false;
      let initialImageLoaded = false;

      function loadInSlide(index, loadInDuplicate) {
        if (loadInDuplicate === void 0) {
          loadInDuplicate = true;
        }

        const params = swiper.params.lazy;
        if (typeof index === 'undefined') return;
        if (swiper.slides.length === 0) return;
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        const $slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`) : swiper.slides.eq(index);
        const $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

        if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
          $images.push($slideEl[0]);
        }

        if ($images.length === 0) return;
        $images.each(imageEl => {
          const $imageEl = $(imageEl);
          $imageEl.addClass(params.loadingClass);
          const background = $imageEl.attr('data-background');
          const src = $imageEl.attr('data-src');
          const srcset = $imageEl.attr('data-srcset');
          const sizes = $imageEl.attr('data-sizes');
          const $pictureEl = $imageEl.parent('picture');
          swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
            if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

            if (background) {
              $imageEl.css('background-image', `url("${background}")`);
              $imageEl.removeAttr('data-background');
            } else {
              if (srcset) {
                $imageEl.attr('srcset', srcset);
                $imageEl.removeAttr('data-srcset');
              }

              if (sizes) {
                $imageEl.attr('sizes', sizes);
                $imageEl.removeAttr('data-sizes');
              }

              if ($pictureEl.length) {
                $pictureEl.children('source').each(sourceEl => {
                  const $source = $(sourceEl);

                  if ($source.attr('data-srcset')) {
                    $source.attr('srcset', $source.attr('data-srcset'));
                    $source.removeAttr('data-srcset');
                  }
                });
              }

              if (src) {
                $imageEl.attr('src', src);
                $imageEl.removeAttr('data-src');
              }
            }

            $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
            $slideEl.find(`.${params.preloaderClass}`).remove();

            if (swiper.params.loop && loadInDuplicate) {
              const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

              if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
                const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
                loadInSlide(originalSlide.index(), false);
              } else {
                const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
                loadInSlide(duplicatedSlide.index(), false);
              }
            }

            emit('lazyImageReady', $slideEl[0], $imageEl[0]);

            if (swiper.params.autoHeight) {
              swiper.updateAutoHeight();
            }
          });
          emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
        });
      }

      function load() {
        const {
          $wrapperEl,
          params: swiperParams,
          slides,
          activeIndex
        } = swiper;
        const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
        const params = swiperParams.lazy;
        let slidesPerView = swiperParams.slidesPerView;

        if (slidesPerView === 'auto') {
          slidesPerView = 0;
        }

        function slideExist(index) {
          if (isVirtual) {
            if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
              return true;
            }
          } else if (slides[index]) return true;

          return false;
        }

        function slideIndex(slideEl) {
          if (isVirtual) {
            return $(slideEl).attr('data-swiper-slide-index');
          }

          return $(slideEl).index();
        }

        if (!initialImageLoaded) initialImageLoaded = true;

        if (swiper.params.watchSlidesProgress) {
          $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each(slideEl => {
            const index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
            loadInSlide(index);
          });
        } else if (slidesPerView > 1) {
          for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
            if (slideExist(i)) loadInSlide(i);
          }
        } else {
          loadInSlide(activeIndex);
        }

        if (params.loadPrevNext) {
          if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
            const amount = params.loadPrevNextAmount;
            const spv = slidesPerView;
            const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
            const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

            for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1) {
              if (slideExist(i)) loadInSlide(i);
            } // Prev Slides


            for (let i = minIndex; i < activeIndex; i += 1) {
              if (slideExist(i)) loadInSlide(i);
            }
          } else {
            const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
            if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
            const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
            if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
          }
        }
      }

      function checkInViewOnLoad() {
        const window = getWindow();
        if (!swiper || swiper.destroyed) return;
        const $scrollElement = swiper.params.lazy.scrollingElement ? $(swiper.params.lazy.scrollingElement) : $(window);
        const isWindow = $scrollElement[0] === window;
        const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
        const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
        const swiperOffset = swiper.$el.offset();
        const {
          rtlTranslate: rtl
        } = swiper;
        let inView = false;
        if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
        const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];

          if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

            inView = true;
          }
        }

        const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;

        if (inView) {
          load();
          $scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
        } else if (!scrollHandlerAttached) {
          scrollHandlerAttached = true;
          $scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
        }
      }

      on('beforeInit', () => {
        if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
          swiper.params.preloadImages = false;
        }
      });
      on('init', () => {
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      });
      on('scroll', () => {
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
          load();
        }
      });
      on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      });
      on('transitionStart', () => {
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
            if (swiper.params.lazy.checkInView) {
              checkInViewOnLoad();
            } else {
              load();
            }
          }
        }
      });
      on('transitionEnd', () => {
        if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      });
      on('slideChange', () => {
        const {
          lazy,
          cssMode,
          watchSlidesProgress,
          touchReleaseOnEdges,
          resistanceRatio
        } = swiper.params;

        if (lazy.enabled && (cssMode || watchSlidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
          load();
        }
      });
      Object.assign(swiper.lazy, {
        load,
        loadInSlide
      });
    }

    /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
    function Controller(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        controller: {
          control: undefined,
          inverse: false,
          by: 'slide' // or 'container'

        }
      });
      swiper.controller = {
        control: undefined
      };

      function LinearSpline(x, y) {
        const binarySearch = function search() {
          let maxIndex;
          let minIndex;
          let guess;
          return (array, val) => {
            minIndex = -1;
            maxIndex = array.length;

            while (maxIndex - minIndex > 1) {
              guess = maxIndex + minIndex >> 1;

              if (array[guess] <= val) {
                minIndex = guess;
              } else {
                maxIndex = guess;
              }
            }

            return maxIndex;
          };
        }();

        this.x = x;
        this.y = y;
        this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
        // (x1,y1) is the known point before given value,
        // (x3,y3) is the known point after given value.

        let i1;
        let i3;

        this.interpolate = function interpolate(x2) {
          if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

          i3 = binarySearch(this.x, x2);
          i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
          // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

          return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
        };

        return this;
      } // xxx: for now i will just save one spline function to to


      function getInterpolateFunction(c) {
        if (!swiper.controller.spline) {
          swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
        }
      }

      function setTranslate(_t, byController) {
        const controlled = swiper.controller.control;
        let multiplier;
        let controlledTranslate;
        const Swiper = swiper.constructor;

        function setControlledTranslate(c) {
          // this will create an Interpolate function based on the snapGrids
          // x is the Grid of the scrolled scroller and y will be the controlled scroller
          // it makes sense to create this only once and recall it for the interpolation
          // the function does a lot of value caching for performance
          const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

          if (swiper.params.controller.by === 'slide') {
            getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
            // but it did not work out

            controlledTranslate = -swiper.controller.spline.interpolate(-translate);
          }

          if (!controlledTranslate || swiper.params.controller.by === 'container') {
            multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
            controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
          }

          if (swiper.params.controller.inverse) {
            controlledTranslate = c.maxTranslate() - controlledTranslate;
          }

          c.updateProgress(controlledTranslate);
          c.setTranslate(controlledTranslate, swiper);
          c.updateActiveIndex();
          c.updateSlidesClasses();
        }

        if (Array.isArray(controlled)) {
          for (let i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
              setControlledTranslate(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper && byController !== controlled) {
          setControlledTranslate(controlled);
        }
      }

      function setTransition(duration, byController) {
        const Swiper = swiper.constructor;
        const controlled = swiper.controller.control;
        let i;

        function setControlledTransition(c) {
          c.setTransition(duration, swiper);

          if (duration !== 0) {
            c.transitionStart();

            if (c.params.autoHeight) {
              nextTick(() => {
                c.updateAutoHeight();
              });
            }

            c.$wrapperEl.transitionEnd(() => {
              if (!controlled) return;

              if (c.params.loop && swiper.params.controller.by === 'slide') {
                c.loopFix();
              }

              c.transitionEnd();
            });
          }
        }

        if (Array.isArray(controlled)) {
          for (i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
              setControlledTransition(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper && byController !== controlled) {
          setControlledTransition(controlled);
        }
      }

      function removeSpline() {
        if (!swiper.controller.control) return;

        if (swiper.controller.spline) {
          swiper.controller.spline = undefined;
          delete swiper.controller.spline;
        }
      }

      on('beforeInit', () => {
        swiper.controller.control = swiper.params.controller.control;
      });
      on('update', () => {
        removeSpline();
      });
      on('resize', () => {
        removeSpline();
      });
      on('observerUpdate', () => {
        removeSpline();
      });
      on('setTranslate', (_s, translate, byController) => {
        if (!swiper.controller.control) return;
        swiper.controller.setTranslate(translate, byController);
      });
      on('setTransition', (_s, duration, byController) => {
        if (!swiper.controller.control) return;
        swiper.controller.setTransition(duration, byController);
      });
      Object.assign(swiper.controller, {
        setTranslate,
        setTransition
      });
    }

    function A11y(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        a11y: {
          enabled: true,
          notificationClass: 'swiper-notification',
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}',
          slideLabelMessage: '{{index}} / {{slidesLength}}',
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null,
          slideRole: 'group',
          id: null
        }
      });
      let liveRegion = null;

      function notify(message) {
        const notification = liveRegion;
        if (notification.length === 0) return;
        notification.html('');
        notification.html(message);
      }

      function getRandomNumber(size) {
        if (size === void 0) {
          size = 16;
        }

        const randomChar = () => Math.round(16 * Math.random()).toString(16);

        return 'x'.repeat(size).replace(/x/g, randomChar);
      }

      function makeElFocusable($el) {
        $el.attr('tabIndex', '0');
      }

      function makeElNotFocusable($el) {
        $el.attr('tabIndex', '-1');
      }

      function addElRole($el, role) {
        $el.attr('role', role);
      }

      function addElRoleDescription($el, description) {
        $el.attr('aria-roledescription', description);
      }

      function addElControls($el, controls) {
        $el.attr('aria-controls', controls);
      }

      function addElLabel($el, label) {
        $el.attr('aria-label', label);
      }

      function addElId($el, id) {
        $el.attr('id', id);
      }

      function addElLive($el, live) {
        $el.attr('aria-live', live);
      }

      function disableEl($el) {
        $el.attr('aria-disabled', true);
      }

      function enableEl($el) {
        $el.attr('aria-disabled', false);
      }

      function onEnterOrSpaceKey(e) {
        if (e.keyCode !== 13 && e.keyCode !== 32) return;
        const params = swiper.params.a11y;
        const $targetEl = $(e.target);

        if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
          if (!(swiper.isEnd && !swiper.params.loop)) {
            swiper.slideNext();
          }

          if (swiper.isEnd) {
            notify(params.lastSlideMessage);
          } else {
            notify(params.nextSlideMessage);
          }
        }

        if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
          if (!(swiper.isBeginning && !swiper.params.loop)) {
            swiper.slidePrev();
          }

          if (swiper.isBeginning) {
            notify(params.firstSlideMessage);
          } else {
            notify(params.prevSlideMessage);
          }
        }

        if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
          $targetEl[0].click();
        }
      }

      function updateNavigation() {
        if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($prevEl && $prevEl.length > 0) {
          if (swiper.isBeginning) {
            disableEl($prevEl);
            makeElNotFocusable($prevEl);
          } else {
            enableEl($prevEl);
            makeElFocusable($prevEl);
          }
        }

        if ($nextEl && $nextEl.length > 0) {
          if (swiper.isEnd) {
            disableEl($nextEl);
            makeElNotFocusable($nextEl);
          } else {
            enableEl($nextEl);
            makeElFocusable($nextEl);
          }
        }
      }

      function hasPagination() {
        return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
      }

      function hasClickablePagination() {
        return hasPagination() && swiper.params.pagination.clickable;
      }

      function updatePagination() {
        const params = swiper.params.a11y;
        if (!hasPagination()) return;
        swiper.pagination.bullets.each(bulletEl => {
          const $bulletEl = $(bulletEl);

          if (swiper.params.pagination.clickable) {
            makeElFocusable($bulletEl);

            if (!swiper.params.pagination.renderBullet) {
              addElRole($bulletEl, 'button');
              addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
            }
          }

          if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
            $bulletEl.attr('aria-current', 'true');
          } else {
            $bulletEl.removeAttr('aria-current');
          }
        });
      }

      const initNavEl = ($el, wrapperId, message) => {
        makeElFocusable($el);

        if ($el[0].tagName !== 'BUTTON') {
          addElRole($el, 'button');
          $el.on('keydown', onEnterOrSpaceKey);
        }

        addElLabel($el, message);
        addElControls($el, wrapperId);
      };

      const handleFocus = e => {
        const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
        if (!slideEl || !swiper.slides.includes(slideEl)) return;
        const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
        const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
        if (isActive || isVisible) return;
        swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
      };

      function init() {
        const params = swiper.params.a11y;
        swiper.$el.append(liveRegion); // Container

        const $containerEl = swiper.$el;

        if (params.containerRoleDescriptionMessage) {
          addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
        }

        if (params.containerMessage) {
          addElLabel($containerEl, params.containerMessage);
        } // Wrapper


        const $wrapperEl = swiper.$wrapperEl;
        const wrapperId = params.id || $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
        const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
        addElId($wrapperEl, wrapperId);
        addElLive($wrapperEl, live); // Slide

        if (params.itemRoleDescriptionMessage) {
          addElRoleDescription($(swiper.slides), params.itemRoleDescriptionMessage);
        }

        addElRole($(swiper.slides), params.slideRole);
        const slidesLength = swiper.params.loop ? swiper.slides.filter(el => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;
        swiper.slides.each((slideEl, index) => {
          const $slideEl = $(slideEl);
          const slideIndex = swiper.params.loop ? parseInt($slideEl.attr('data-swiper-slide-index'), 10) : index;
          const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
          addElLabel($slideEl, ariaLabelMessage);
        }); // Navigation

        let $nextEl;
        let $prevEl;

        if (swiper.navigation && swiper.navigation.$nextEl) {
          $nextEl = swiper.navigation.$nextEl;
        }

        if (swiper.navigation && swiper.navigation.$prevEl) {
          $prevEl = swiper.navigation.$prevEl;
        }

        if ($nextEl && $nextEl.length) {
          initNavEl($nextEl, wrapperId, params.nextSlideMessage);
        }

        if ($prevEl && $prevEl.length) {
          initNavEl($prevEl, wrapperId, params.prevSlideMessage);
        } // Pagination


        if (hasClickablePagination()) {
          swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
        } // Tab focus


        swiper.$el.on('focus', handleFocus, true);
      }

      function destroy() {
        if (liveRegion && liveRegion.length > 0) liveRegion.remove();
        let $nextEl;
        let $prevEl;

        if (swiper.navigation && swiper.navigation.$nextEl) {
          $nextEl = swiper.navigation.$nextEl;
        }

        if (swiper.navigation && swiper.navigation.$prevEl) {
          $prevEl = swiper.navigation.$prevEl;
        }

        if ($nextEl) {
          $nextEl.off('keydown', onEnterOrSpaceKey);
        }

        if ($prevEl) {
          $prevEl.off('keydown', onEnterOrSpaceKey);
        } // Pagination


        if (hasClickablePagination()) {
          swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
        } // Tab focus


        swiper.$el.off('focus', handleFocus, true);
      }

      on('beforeInit', () => {
        liveRegion = $(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
      });
      on('afterInit', () => {
        if (!swiper.params.a11y.enabled) return;
        init();
      });
      on('fromEdge toEdge afterInit lock unlock', () => {
        if (!swiper.params.a11y.enabled) return;
        updateNavigation();
      });
      on('paginationUpdate', () => {
        if (!swiper.params.a11y.enabled) return;
        updatePagination();
      });
      on('destroy', () => {
        if (!swiper.params.a11y.enabled) return;
        destroy();
      });
    }

    function History(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        history: {
          enabled: false,
          root: '',
          replaceState: false,
          key: 'slides'
        }
      });
      let initialized = false;
      let paths = {};

      const slugify = text => {
        return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
      };

      const getPathValues = urlOverride => {
        const window = getWindow();
        let location;

        if (urlOverride) {
          location = new URL(urlOverride);
        } else {
          location = window.location;
        }

        const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
        const total = pathArray.length;
        const key = pathArray[total - 2];
        const value = pathArray[total - 1];
        return {
          key,
          value
        };
      };

      const setHistory = (key, index) => {
        const window = getWindow();
        if (!initialized || !swiper.params.history.enabled) return;
        let location;

        if (swiper.params.url) {
          location = new URL(swiper.params.url);
        } else {
          location = window.location;
        }

        const slide = swiper.slides.eq(index);
        let value = slugify(slide.attr('data-history'));

        if (swiper.params.history.root.length > 0) {
          let root = swiper.params.history.root;
          if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
          value = `${root}/${key}/${value}`;
        } else if (!location.pathname.includes(key)) {
          value = `${key}/${value}`;
        }

        const currentState = window.history.state;

        if (currentState && currentState.value === value) {
          return;
        }

        if (swiper.params.history.replaceState) {
          window.history.replaceState({
            value
          }, null, value);
        } else {
          window.history.pushState({
            value
          }, null, value);
        }
      };

      const scrollToSlide = (speed, value, runCallbacks) => {
        if (value) {
          for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
            const slide = swiper.slides.eq(i);
            const slideHistory = slugify(slide.attr('data-history'));

            if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
              const index = slide.index();
              swiper.slideTo(index, speed, runCallbacks);
            }
          }
        } else {
          swiper.slideTo(0, speed, runCallbacks);
        }
      };

      const setHistoryPopState = () => {
        paths = getPathValues(swiper.params.url);
        scrollToSlide(swiper.params.speed, swiper.paths.value, false);
      };

      const init = () => {
        const window = getWindow();
        if (!swiper.params.history) return;

        if (!window.history || !window.history.pushState) {
          swiper.params.history.enabled = false;
          swiper.params.hashNavigation.enabled = true;
          return;
        }

        initialized = true;
        paths = getPathValues(swiper.params.url);
        if (!paths.key && !paths.value) return;
        scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

        if (!swiper.params.history.replaceState) {
          window.addEventListener('popstate', setHistoryPopState);
        }
      };

      const destroy = () => {
        const window = getWindow();

        if (!swiper.params.history.replaceState) {
          window.removeEventListener('popstate', setHistoryPopState);
        }
      };

      on('init', () => {
        if (swiper.params.history.enabled) {
          init();
        }
      });
      on('destroy', () => {
        if (swiper.params.history.enabled) {
          destroy();
        }
      });
      on('transitionEnd _freeModeNoMomentumRelease', () => {
        if (initialized) {
          setHistory(swiper.params.history.key, swiper.activeIndex);
        }
      });
      on('slideChange', () => {
        if (initialized && swiper.params.cssMode) {
          setHistory(swiper.params.history.key, swiper.activeIndex);
        }
      });
    }

    function HashNavigation(_ref) {
      let {
        swiper,
        extendParams,
        emit,
        on
      } = _ref;
      let initialized = false;
      const document = getDocument();
      const window = getWindow();
      extendParams({
        hashNavigation: {
          enabled: false,
          replaceState: false,
          watchState: false
        }
      });

      const onHashChange = () => {
        emit('hashChange');
        const newHash = document.location.hash.replace('#', '');
        const activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

        if (newHash !== activeSlideHash) {
          const newIndex = swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`).index();
          if (typeof newIndex === 'undefined') return;
          swiper.slideTo(newIndex);
        }
      };

      const setHash = () => {
        if (!initialized || !swiper.params.hashNavigation.enabled) return;

        if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
          window.history.replaceState(null, null, `#${swiper.slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
          emit('hashSet');
        } else {
          const slide = swiper.slides.eq(swiper.activeIndex);
          const hash = slide.attr('data-hash') || slide.attr('data-history');
          document.location.hash = hash || '';
          emit('hashSet');
        }
      };

      const init = () => {
        if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
        initialized = true;
        const hash = document.location.hash.replace('#', '');

        if (hash) {
          const speed = 0;

          for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
            const slide = swiper.slides.eq(i);
            const slideHash = slide.attr('data-hash') || slide.attr('data-history');

            if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
              const index = slide.index();
              swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
            }
          }
        }

        if (swiper.params.hashNavigation.watchState) {
          $(window).on('hashchange', onHashChange);
        }
      };

      const destroy = () => {
        if (swiper.params.hashNavigation.watchState) {
          $(window).off('hashchange', onHashChange);
        }
      };

      on('init', () => {
        if (swiper.params.hashNavigation.enabled) {
          init();
        }
      });
      on('destroy', () => {
        if (swiper.params.hashNavigation.enabled) {
          destroy();
        }
      });
      on('transitionEnd _freeModeNoMomentumRelease', () => {
        if (initialized) {
          setHash();
        }
      });
      on('slideChange', () => {
        if (initialized && swiper.params.cssMode) {
          setHash();
        }
      });
    }

    /* eslint no-underscore-dangle: "off" */
    function Autoplay(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      let timeout;
      swiper.autoplay = {
        running: false,
        paused: false
      };
      extendParams({
        autoplay: {
          enabled: false,
          delay: 3000,
          waitForTransition: true,
          disableOnInteraction: true,
          stopOnLastSlide: false,
          reverseDirection: false,
          pauseOnMouseEnter: false
        }
      });

      function run() {
        const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
        let delay = swiper.params.autoplay.delay;

        if ($activeSlideEl.attr('data-swiper-autoplay')) {
          delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
        }

        clearTimeout(timeout);
        timeout = nextTick(() => {
          let autoplayResult;

          if (swiper.params.autoplay.reverseDirection) {
            if (swiper.params.loop) {
              swiper.loopFix();
              autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
              emit('autoplay');
            } else if (!swiper.isBeginning) {
              autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
              emit('autoplay');
            } else if (!swiper.params.autoplay.stopOnLastSlide) {
              autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
              emit('autoplay');
            } else {
              stop();
            }
          } else if (swiper.params.loop) {
            swiper.loopFix();
            autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
            emit('autoplay');
          } else if (!swiper.isEnd) {
            autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
            emit('autoplay');
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
            emit('autoplay');
          } else {
            stop();
          }

          if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
            run();
          }
        }, delay);
      }

      function start() {
        if (typeof timeout !== 'undefined') return false;
        if (swiper.autoplay.running) return false;
        swiper.autoplay.running = true;
        emit('autoplayStart');
        run();
        return true;
      }

      function stop() {
        if (!swiper.autoplay.running) return false;
        if (typeof timeout === 'undefined') return false;

        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        swiper.autoplay.running = false;
        emit('autoplayStop');
        return true;
      }

      function pause(speed) {
        if (!swiper.autoplay.running) return;
        if (swiper.autoplay.paused) return;
        if (timeout) clearTimeout(timeout);
        swiper.autoplay.paused = true;

        if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
          swiper.autoplay.paused = false;
          run();
        } else {
          ['transitionend', 'webkitTransitionEnd'].forEach(event => {
            swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
          });
        }
      }

      function onVisibilityChange() {
        const document = getDocument();

        if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
          pause();
        }

        if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
          run();
          swiper.autoplay.paused = false;
        }
      }

      function onTransitionEnd(e) {
        if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
        if (e.target !== swiper.$wrapperEl[0]) return;
        ['transitionend', 'webkitTransitionEnd'].forEach(event => {
          swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
        });
        swiper.autoplay.paused = false;

        if (!swiper.autoplay.running) {
          stop();
        } else {
          run();
        }
      }

      function onMouseEnter() {
        if (swiper.params.autoplay.disableOnInteraction) {
          stop();
        } else {
          emit('autoplayPause');
          pause();
        }

        ['transitionend', 'webkitTransitionEnd'].forEach(event => {
          swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
        });
      }

      function onMouseLeave() {
        if (swiper.params.autoplay.disableOnInteraction) {
          return;
        }

        swiper.autoplay.paused = false;
        emit('autoplayResume');
        run();
      }

      function attachMouseEvents() {
        if (swiper.params.autoplay.pauseOnMouseEnter) {
          swiper.$el.on('mouseenter', onMouseEnter);
          swiper.$el.on('mouseleave', onMouseLeave);
        }
      }

      function detachMouseEvents() {
        swiper.$el.off('mouseenter', onMouseEnter);
        swiper.$el.off('mouseleave', onMouseLeave);
      }

      on('init', () => {
        if (swiper.params.autoplay.enabled) {
          start();
          const document = getDocument();
          document.addEventListener('visibilitychange', onVisibilityChange);
          attachMouseEvents();
        }
      });
      on('beforeTransitionStart', (_s, speed, internal) => {
        if (swiper.autoplay.running) {
          if (internal || !swiper.params.autoplay.disableOnInteraction) {
            swiper.autoplay.pause(speed);
          } else {
            stop();
          }
        }
      });
      on('sliderFirstMove', () => {
        if (swiper.autoplay.running) {
          if (swiper.params.autoplay.disableOnInteraction) {
            stop();
          } else {
            pause();
          }
        }
      });
      on('touchEnd', () => {
        if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
          run();
        }
      });
      on('destroy', () => {
        detachMouseEvents();

        if (swiper.autoplay.running) {
          stop();
        }

        const document = getDocument();
        document.removeEventListener('visibilitychange', onVisibilityChange);
      });
      Object.assign(swiper.autoplay, {
        pause,
        run,
        start,
        stop
      });
    }

    function Thumb(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        thumbs: {
          swiper: null,
          multipleActiveThumbs: true,
          autoScrollOffset: 0,
          slideThumbActiveClass: 'swiper-slide-thumb-active',
          thumbsContainerClass: 'swiper-thumbs'
        }
      });
      let initialized = false;
      let swiperCreated = false;
      swiper.thumbs = {
        swiper: null
      };

      function onThumbClick() {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        const clickedIndex = thumbsSwiper.clickedIndex;
        const clickedSlide = thumbsSwiper.clickedSlide;
        if (clickedSlide && $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
        if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
        let slideToIndex;

        if (thumbsSwiper.params.loop) {
          slideToIndex = parseInt($(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
        } else {
          slideToIndex = clickedIndex;
        }

        if (swiper.params.loop) {
          let currentIndex = swiper.activeIndex;

          if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
            swiper.loopFix(); // eslint-disable-next-line

            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
            currentIndex = swiper.activeIndex;
          }

          const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
          const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
          if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
        }

        swiper.slideTo(slideToIndex);
      }

      function init() {
        const {
          thumbs: thumbsParams
        } = swiper.params;
        if (initialized) return false;
        initialized = true;
        const SwiperClass = swiper.constructor;

        if (thumbsParams.swiper instanceof SwiperClass) {
          swiper.thumbs.swiper = thumbsParams.swiper;
          Object.assign(swiper.thumbs.swiper.originalParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          Object.assign(swiper.thumbs.swiper.params, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
        } else if (isObject(thumbsParams.swiper)) {
          const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
          Object.assign(thumbsSwiperParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
          swiperCreated = true;
        }

        swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
        swiper.thumbs.swiper.on('tap', onThumbClick);
        return true;
      }

      function update(initial) {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
        const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
        const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

        if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
          let currentThumbsIndex = thumbsSwiper.activeIndex;
          let newThumbsIndex;
          let direction;

          if (thumbsSwiper.params.loop) {
            if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
              thumbsSwiper.loopFix(); // eslint-disable-next-line

              thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
              currentThumbsIndex = thumbsSwiper.activeIndex;
            } // Find actual thumbs index to slide to


            const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
            const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();

            if (typeof prevThumbsIndex === 'undefined') {
              newThumbsIndex = nextThumbsIndex;
            } else if (typeof nextThumbsIndex === 'undefined') {
              newThumbsIndex = prevThumbsIndex;
            } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
              newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
            } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
              newThumbsIndex = nextThumbsIndex;
            } else {
              newThumbsIndex = prevThumbsIndex;
            }

            direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
          } else {
            newThumbsIndex = swiper.realIndex;
            direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
          }

          if (useOffset) {
            newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
          }

          if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
            if (thumbsSwiper.params.centeredSlides) {
              if (newThumbsIndex > currentThumbsIndex) {
                newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
              } else {
                newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
              }
            } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;

            thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
          }
        } // Activate thumbs


        let thumbsToActivate = 1;
        const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

        if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
          thumbsToActivate = swiper.params.slidesPerView;
        }

        if (!swiper.params.thumbs.multipleActiveThumbs) {
          thumbsToActivate = 1;
        }

        thumbsToActivate = Math.floor(thumbsToActivate);
        thumbsSwiper.slides.removeClass(thumbActiveClass);

        if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
          for (let i = 0; i < thumbsToActivate; i += 1) {
            thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
          }
        } else {
          for (let i = 0; i < thumbsToActivate; i += 1) {
            thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
          }
        }
      }

      on('beforeInit', () => {
        const {
          thumbs
        } = swiper.params;
        if (!thumbs || !thumbs.swiper) return;
        init();
        update(true);
      });
      on('slideChange update resize observerUpdate', () => {
        update();
      });
      on('setTransition', (_s, duration) => {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        thumbsSwiper.setTransition(duration);
      });
      on('beforeDestroy', () => {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;

        if (swiperCreated) {
          thumbsSwiper.destroy();
        }
      });
      Object.assign(swiper.thumbs, {
        init,
        update
      });
    }

    function freeMode(_ref) {
      let {
        swiper,
        extendParams,
        emit,
        once
      } = _ref;
      extendParams({
        freeMode: {
          enabled: false,
          momentum: true,
          momentumRatio: 1,
          momentumBounce: true,
          momentumBounceRatio: 1,
          momentumVelocityRatio: 1,
          sticky: false,
          minimumVelocity: 0.02
        }
      });

      function onTouchStart() {
        const translate = swiper.getTranslate();
        swiper.setTranslate(translate);
        swiper.setTransition(0);
        swiper.touchEventsData.velocities.length = 0;
        swiper.freeMode.onTouchEnd({
          currentPos: swiper.rtl ? swiper.translate : -swiper.translate
        });
      }

      function onTouchMove() {
        const {
          touchEventsData: data,
          touches
        } = swiper; // Velocity

        if (data.velocities.length === 0) {
          data.velocities.push({
            position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
            time: data.touchStartTime
          });
        }

        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
          time: now()
        });
      }

      function onTouchEnd(_ref2) {
        let {
          currentPos
        } = _ref2;
        const {
          params,
          $wrapperEl,
          rtlTranslate: rtl,
          snapGrid,
          touchEventsData: data
        } = swiper; // Time diff

        const touchEndTime = now();
        const timeDiff = touchEndTime - data.touchStartTime;

        if (currentPos < -swiper.minTranslate()) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (currentPos > -swiper.maxTranslate()) {
          if (swiper.slides.length < snapGrid.length) {
            swiper.slideTo(snapGrid.length - 1);
          } else {
            swiper.slideTo(swiper.slides.length - 1);
          }

          return;
        }

        if (params.freeMode.momentum) {
          if (data.velocities.length > 1) {
            const lastMoveEvent = data.velocities.pop();
            const velocityEvent = data.velocities.pop();
            const distance = lastMoveEvent.position - velocityEvent.position;
            const time = lastMoveEvent.time - velocityEvent.time;
            swiper.velocity = distance / time;
            swiper.velocity /= 2;

            if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
              swiper.velocity = 0;
            } // this implies that the user stopped moving a finger then released.
            // There would be no events with distance zero, so the last event is stale.


            if (time > 150 || now() - lastMoveEvent.time > 300) {
              swiper.velocity = 0;
            }
          } else {
            swiper.velocity = 0;
          }

          swiper.velocity *= params.freeMode.momentumVelocityRatio;
          data.velocities.length = 0;
          let momentumDuration = 1000 * params.freeMode.momentumRatio;
          const momentumDistance = swiper.velocity * momentumDuration;
          let newPosition = swiper.translate + momentumDistance;
          if (rtl) newPosition = -newPosition;
          let doBounce = false;
          let afterBouncePosition;
          const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
          let needsLoopFix;

          if (newPosition < swiper.maxTranslate()) {
            if (params.freeMode.momentumBounce) {
              if (newPosition + swiper.maxTranslate() < -bounceAmount) {
                newPosition = swiper.maxTranslate() - bounceAmount;
              }

              afterBouncePosition = swiper.maxTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper.maxTranslate();
            }

            if (params.loop && params.centeredSlides) needsLoopFix = true;
          } else if (newPosition > swiper.minTranslate()) {
            if (params.freeMode.momentumBounce) {
              if (newPosition - swiper.minTranslate() > bounceAmount) {
                newPosition = swiper.minTranslate() + bounceAmount;
              }

              afterBouncePosition = swiper.minTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper.minTranslate();
            }

            if (params.loop && params.centeredSlides) needsLoopFix = true;
          } else if (params.freeMode.sticky) {
            let nextSlide;

            for (let j = 0; j < snapGrid.length; j += 1) {
              if (snapGrid[j] > -newPosition) {
                nextSlide = j;
                break;
              }
            }

            if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
              newPosition = snapGrid[nextSlide];
            } else {
              newPosition = snapGrid[nextSlide - 1];
            }

            newPosition = -newPosition;
          }

          if (needsLoopFix) {
            once('transitionEnd', () => {
              swiper.loopFix();
            });
          } // Fix duration


          if (swiper.velocity !== 0) {
            if (rtl) {
              momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
            } else {
              momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
            }

            if (params.freeMode.sticky) {
              // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
              // event, then durations can be 20+ seconds to slide one (or zero!) slides.
              // It's easy to see this when simulating touch with mouse events. To fix this,
              // limit single-slide swipes to the default slide duration. This also has the
              // nice side effect of matching slide speed if the user stopped moving before
              // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
              // For faster swipes, also apply limits (albeit higher ones).
              const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
              const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

              if (moveDistance < currentSlideSize) {
                momentumDuration = params.speed;
              } else if (moveDistance < 2 * currentSlideSize) {
                momentumDuration = params.speed * 1.5;
              } else {
                momentumDuration = params.speed * 2.5;
              }
            }
          } else if (params.freeMode.sticky) {
            swiper.slideToClosest();
            return;
          }

          if (params.freeMode.momentumBounce && doBounce) {
            swiper.updateProgress(afterBouncePosition);
            swiper.setTransition(momentumDuration);
            swiper.setTranslate(newPosition);
            swiper.transitionStart(true, swiper.swipeDirection);
            swiper.animating = true;
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
              emit('momentumBounce');
              swiper.setTransition(params.speed);
              setTimeout(() => {
                swiper.setTranslate(afterBouncePosition);
                $wrapperEl.transitionEnd(() => {
                  if (!swiper || swiper.destroyed) return;
                  swiper.transitionEnd();
                });
              }, 0);
            });
          } else if (swiper.velocity) {
            emit('_freeModeNoMomentumRelease');
            swiper.updateProgress(newPosition);
            swiper.setTransition(momentumDuration);
            swiper.setTranslate(newPosition);
            swiper.transitionStart(true, swiper.swipeDirection);

            if (!swiper.animating) {
              swiper.animating = true;
              $wrapperEl.transitionEnd(() => {
                if (!swiper || swiper.destroyed) return;
                swiper.transitionEnd();
              });
            }
          } else {
            swiper.updateProgress(newPosition);
          }

          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        } else if (params.freeMode.sticky) {
          swiper.slideToClosest();
          return;
        } else if (params.freeMode) {
          emit('_freeModeNoMomentumRelease');
        }

        if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }
      }

      Object.assign(swiper, {
        freeMode: {
          onTouchStart,
          onTouchMove,
          onTouchEnd
        }
      });
    }

    function Grid(_ref) {
      let {
        swiper,
        extendParams
      } = _ref;
      extendParams({
        grid: {
          rows: 1,
          fill: 'column'
        }
      });
      let slidesNumberEvenToRows;
      let slidesPerRow;
      let numFullColumns;

      const initSlides = slidesLength => {
        const {
          slidesPerView
        } = swiper.params;
        const {
          rows,
          fill
        } = swiper.params.grid;
        slidesPerRow = slidesNumberEvenToRows / rows;
        numFullColumns = Math.floor(slidesLength / rows);

        if (Math.floor(slidesLength / rows) === slidesLength / rows) {
          slidesNumberEvenToRows = slidesLength;
        } else {
          slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
        }

        if (slidesPerView !== 'auto' && fill === 'row') {
          slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
        }
      };

      const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
        const {
          slidesPerGroup,
          spaceBetween
        } = swiper.params;
        const {
          rows,
          fill
        } = swiper.params.grid; // Set slides order

        let newSlideOrderIndex;
        let column;
        let row;

        if (fill === 'row' && slidesPerGroup > 1) {
          const groupIndex = Math.floor(i / (slidesPerGroup * rows));
          const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
          const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
          row = Math.floor(slideIndexInGroup / columnsInGroup);
          column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
          newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
          slide.css({
            '-webkit-order': newSlideOrderIndex,
            order: newSlideOrderIndex
          });
        } else if (fill === 'column') {
          column = Math.floor(i / rows);
          row = i - column * rows;

          if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
            row += 1;

            if (row >= rows) {
              row = 0;
              column += 1;
            }
          }
        } else {
          row = Math.floor(i / slidesPerRow);
          column = i - row * slidesPerRow;
        }

        slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
      };

      const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
        const {
          spaceBetween,
          centeredSlides,
          roundLengths
        } = swiper.params;
        const {
          rows
        } = swiper.params.grid;
        swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
        swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
        swiper.$wrapperEl.css({
          [getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
        });

        if (centeredSlides) {
          snapGrid.splice(0, snapGrid.length);
          const newSlidesGrid = [];

          for (let i = 0; i < snapGrid.length; i += 1) {
            let slidesGridItem = snapGrid[i];
            if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
            if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
          }

          snapGrid.push(...newSlidesGrid);
        }
      };

      swiper.grid = {
        initSlides,
        updateSlide,
        updateWrapperSize
      };
    }

    function appendSlide(slides) {
      const swiper = this;
      const {
        $wrapperEl,
        params
      } = swiper;

      if (params.loop) {
        swiper.loopDestroy();
      }

      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.append(slides[i]);
        }
      } else {
        $wrapperEl.append(slides);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }
    }

    function prependSlide(slides) {
      const swiper = this;
      const {
        params,
        $wrapperEl,
        activeIndex
      } = swiper;

      if (params.loop) {
        swiper.loopDestroy();
      }

      let newActiveIndex = activeIndex + 1;

      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.prepend(slides[i]);
        }

        newActiveIndex = activeIndex + slides.length;
      } else {
        $wrapperEl.prepend(slides);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }

      swiper.slideTo(newActiveIndex, 0, false);
    }

    function addSlide(index, slides) {
      const swiper = this;
      const {
        $wrapperEl,
        params,
        activeIndex
      } = swiper;
      let activeIndexBuffer = activeIndex;

      if (params.loop) {
        activeIndexBuffer -= swiper.loopedSlides;
        swiper.loopDestroy();
        swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
      }

      const baseLength = swiper.slides.length;

      if (index <= 0) {
        swiper.prependSlide(slides);
        return;
      }

      if (index >= baseLength) {
        swiper.appendSlide(slides);
        return;
      }

      let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
      const slidesBuffer = [];

      for (let i = baseLength - 1; i >= index; i -= 1) {
        const currentSlide = swiper.slides.eq(i);
        currentSlide.remove();
        slidesBuffer.unshift(currentSlide);
      }

      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.append(slides[i]);
        }

        newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
      } else {
        $wrapperEl.append(slides);
      }

      for (let i = 0; i < slidesBuffer.length; i += 1) {
        $wrapperEl.append(slidesBuffer[i]);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }

      if (params.loop) {
        swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
        swiper.slideTo(newActiveIndex, 0, false);
      }
    }

    function removeSlide(slidesIndexes) {
      const swiper = this;
      const {
        params,
        $wrapperEl,
        activeIndex
      } = swiper;
      let activeIndexBuffer = activeIndex;

      if (params.loop) {
        activeIndexBuffer -= swiper.loopedSlides;
        swiper.loopDestroy();
        swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
      }

      let newActiveIndex = activeIndexBuffer;
      let indexToRemove;

      if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
        for (let i = 0; i < slidesIndexes.length; i += 1) {
          indexToRemove = slidesIndexes[i];
          if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
          if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
        }

        newActiveIndex = Math.max(newActiveIndex, 0);
      } else {
        indexToRemove = slidesIndexes;
        if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
        newActiveIndex = Math.max(newActiveIndex, 0);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }

      if (params.loop) {
        swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
        swiper.slideTo(newActiveIndex, 0, false);
      }
    }

    function removeAllSlides() {
      const swiper = this;
      const slidesIndexes = [];

      for (let i = 0; i < swiper.slides.length; i += 1) {
        slidesIndexes.push(i);
      }

      swiper.removeSlide(slidesIndexes);
    }

    function Manipulation(_ref) {
      let {
        swiper
      } = _ref;
      Object.assign(swiper, {
        appendSlide: appendSlide.bind(swiper),
        prependSlide: prependSlide.bind(swiper),
        addSlide: addSlide.bind(swiper),
        removeSlide: removeSlide.bind(swiper),
        removeAllSlides: removeAllSlides.bind(swiper)
      });
    }

    function effectInit(params) {
      const {
        effect,
        swiper,
        on,
        setTranslate,
        setTransition,
        overwriteParams,
        perspective
      } = params;
      on('beforeInit', () => {
        if (swiper.params.effect !== effect) return;
        swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

        if (perspective && perspective()) {
          swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        }

        const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
        Object.assign(swiper.params, overwriteParamsResult);
        Object.assign(swiper.originalParams, overwriteParamsResult);
      });
      on('setTranslate', () => {
        if (swiper.params.effect !== effect) return;
        setTranslate();
      });
      on('setTransition', (_s, duration) => {
        if (swiper.params.effect !== effect) return;
        setTransition(duration);
      });
      let requireUpdateOnVirtual;
      on('virtualUpdate', () => {
        if (swiper.params.effect !== effect) return;

        if (!swiper.slides.length) {
          requireUpdateOnVirtual = true;
        }

        requestAnimationFrame(() => {
          if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
            setTranslate();
            requireUpdateOnVirtual = false;
          }
        });
      });
    }

    function effectTarget(effectParams, $slideEl) {
      if (effectParams.transformEl) {
        return $slideEl.find(effectParams.transformEl).css({
          'backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden'
        });
      }

      return $slideEl;
    }

    function effectVirtualTransitionEnd(_ref) {
      let {
        swiper,
        duration,
        transformEl,
        allSlides
      } = _ref;
      const {
        slides,
        activeIndex,
        $wrapperEl
      } = swiper;

      if (swiper.params.virtualTranslate && duration !== 0) {
        let eventTriggered = false;
        let $transitionEndTarget;

        if (allSlides) {
          $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
        } else {
          $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
        }

        $transitionEndTarget.transitionEnd(() => {
          if (eventTriggered) return;
          if (!swiper || swiper.destroyed) return;
          eventTriggered = true;
          swiper.animating = false;
          const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

          for (let i = 0; i < triggerEvents.length; i += 1) {
            $wrapperEl.trigger(triggerEvents[i]);
          }
        });
      }
    }

    function EffectFade(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        fadeEffect: {
          crossFade: false,
          transformEl: null
        }
      });

      const setTranslate = () => {
        const {
          slides
        } = swiper;
        const params = swiper.params.fadeEffect;

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset = $slideEl[0].swiperSlideOffset;
          let tx = -offset;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;

          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }

          const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.css({
            opacity: slideOpacity
          }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.fadeEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl,
          allSlides: true
        });
      };

      effectInit({
        effect: 'fade',
        swiper,
        on,
        setTranslate,
        setTransition,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    function EffectCube(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }
      });

      const setTranslate = () => {
        const {
          $el,
          $wrapperEl,
          slides,
          width: swiperWidth,
          height: swiperHeight,
          rtlTranslate: rtl,
          size: swiperSize,
          browser
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }

            $cubeShadowEl.css({
              height: `${swiperWidth}px`
            });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');

            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;

          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }

          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);

          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }

          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;

          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + round * 4 * swiperSize;
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = 3 * swiperSize + swiperSize * 4 * round;
          }

          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

          if (progress <= 1 && progress > -1) {
            wrapperRotate = slideIndex * 90 + progress * 90;
            if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
          }

          $slideEl.transform(transform);

          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if (shadowBefore.length === 0) {
              shadowBefore = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }

            if (shadowAfter.length === 0) {
              shadowAfter = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }

            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }

        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
            const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }

        const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
        $wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      };

      const setTransition = duration => {
        const {
          $el,
          slides
        } = swiper;
        slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      };

      effectInit({
        effect: 'cube',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => true,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true
        })
      });
    }

    function createShadow(params, $slideEl, side) {
      const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
      const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
      let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

      if (!$shadowEl.length) {
        $shadowEl = $(`<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>`);
        $shadowContainer.append($shadowEl);
      }

      return $shadowEl;
    }

    function EffectFlip(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        flipEffect: {
          slideShadows: true,
          limitRotation: true,
          transformEl: null
        }
      });

      const setTranslate = () => {
        const {
          slides,
          rtlTranslate: rtl
        } = swiper;
        const params = swiper.params.flipEffect;

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;

          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }

          const offset = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
          let ty = 0;

          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if (shadowBefore.length === 0) {
              shadowBefore = createShadow(params, $slideEl, swiper.isHorizontal() ? 'left' : 'top');
            }

            if (shadowAfter.length === 0) {
              shadowAfter = createShadow(params, $slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
            }

            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }

          const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(transform);
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.flipEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl
        });
      };

      effectInit({
        effect: 'flip',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => true,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    function EffectCoverflow(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          scale: 1,
          modifier: 1,
          slideShadows: true,
          transformEl: null
        }
      });

      const setTranslate = () => {
        const {
          width: swiperWidth,
          height: swiperHeight,
          slides,
          slidesSizesGrid
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform = swiper.translate;
        const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth; // Each slide offset from center

        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
          const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

          let translateZ = -translate * Math.abs(offsetMultiplier);
          let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

          if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
            stretch = parseFloat(params.stretch) / 100 * slideSize;
          }

          let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
          let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
          let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;
          if (Math.abs(scale) < 0.001) scale = 0;
          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = createShadow(params, $slideEl, isHorizontal ? 'left' : 'top');
            }

            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = createShadow(params, $slideEl, isHorizontal ? 'right' : 'bottom');
            }

            if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
          }
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.coverflowEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
      };

      effectInit({
        effect: 'coverflow',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => true,
        overwriteParams: () => ({
          watchSlidesProgress: true
        })
      });
    }

    function EffectCreative(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        creativeEffect: {
          transformEl: null,
          limitProgress: 1,
          shadowPerProgress: false,
          progressMultiplier: 1,
          perspective: true,
          prev: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1
          },
          next: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1
          }
        }
      });

      const getTranslateValue = value => {
        if (typeof value === 'string') return value;
        return `${value}px`;
      };

      const setTranslate = () => {
        const {
          slides,
          $wrapperEl,
          slidesSizesGrid
        } = swiper;
        const params = swiper.params.creativeEffect;
        const {
          progressMultiplier: multiplier
        } = params;
        const isCenteredSlides = swiper.params.centeredSlides;

        if (isCenteredSlides) {
          const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
          $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideProgress = $slideEl[0].progress;
          const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
          let originalProgress = progress;

          if (!isCenteredSlides) {
            originalProgress = Math.min(Math.max($slideEl[0].originalProgress, -params.limitProgress), params.limitProgress);
          }

          const offset = $slideEl[0].swiperSlideOffset;
          const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
          const r = [0, 0, 0];
          let custom = false;

          if (!swiper.isHorizontal()) {
            t[1] = t[0];
            t[0] = 0;
          }

          let data = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: 1,
            opacity: 1
          };

          if (progress < 0) {
            data = params.next;
            custom = true;
          } else if (progress > 0) {
            data = params.prev;
            custom = true;
          } // set translate


          t.forEach((value, index) => {
            t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
          }); // set rotates

          r.forEach((value, index) => {
            r[index] = data.rotate[index] * Math.abs(progress * multiplier);
          });
          $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
          const translateString = t.join(', ');
          const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
          const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
          const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
          const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

          if (custom && data.shadow || !custom) {
            let $shadowEl = $slideEl.children('.swiper-slide-shadow');

            if ($shadowEl.length === 0 && data.shadow) {
              $shadowEl = createShadow(params, $slideEl);
            }

            if ($shadowEl.length) {
              const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
              $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
            }
          }

          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(transform).css({
            opacity: opacityString
          });

          if (data.origin) {
            $targetEl.css('transform-origin', data.origin);
          }
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.creativeEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl,
          allSlides: true
        });
      };

      effectInit({
        effect: 'creative',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => swiper.params.creativeEffect.perspective,
        overwriteParams: () => ({
          watchSlidesProgress: true,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    function EffectCards(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        cardsEffect: {
          slideShadows: true,
          transformEl: null,
          rotate: true
        }
      });

      const setTranslate = () => {
        const {
          slides,
          activeIndex
        } = swiper;
        const params = swiper.params.cardsEffect;
        const {
          startTranslate,
          isTouched
        } = swiper.touchEventsData;
        const currentTranslate = swiper.translate;

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideProgress = $slideEl[0].progress;
          const progress = Math.min(Math.max(slideProgress, -4), 4);
          let offset = $slideEl[0].swiperSlideOffset;

          if (swiper.params.centeredSlides && !swiper.params.cssMode) {
            swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
          }

          if (swiper.params.centeredSlides && swiper.params.cssMode) {
            offset -= slides[0].swiperSlideOffset;
          }

          let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
          let tY = 0;
          const tZ = -100 * Math.abs(progress);
          let scale = 1;
          let rotate = -2 * progress;
          let tXAdd = 8 - Math.abs(progress) * 0.75;
          const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
          const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
          const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

          if (isSwipeToNext || isSwipeToPrev) {
            const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
            rotate += -28 * progress * subProgress;
            scale += -0.5 * subProgress;
            tXAdd += 96 * subProgress;
            tY = `${-25 * subProgress * Math.abs(progress)}%`;
          }

          if (progress < 0) {
            // next
            tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
          } else if (progress > 0) {
            // prev
            tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
          } else {
            tX = `${tX}px`;
          }

          if (!swiper.isHorizontal()) {
            const prevY = tY;
            tY = tX;
            tX = prevY;
          }

          const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
          const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rotate : 0}deg)
        scale(${scaleString})
      `;

          if (params.slideShadows) {
            // Set shadows
            let $shadowEl = $slideEl.find('.swiper-slide-shadow');

            if ($shadowEl.length === 0) {
              $shadowEl = createShadow(params, $slideEl);
            }

            if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(transform);
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.cardsEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl
        });
      };

      effectInit({
        effect: 'cards',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => true,
        overwriteParams: () => ({
          watchSlidesProgress: true,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    // Swiper Class
    const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
    Swiper.use(modules);

    return Swiper;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzd2lwZXItYnVuZGxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBTd2lwZXIgOC4xLjFcclxuICogTW9zdCBtb2Rlcm4gbW9iaWxlIHRvdWNoIHNsaWRlciBhbmQgZnJhbWV3b3JrIHdpdGggaGFyZHdhcmUgYWNjZWxlcmF0ZWQgdHJhbnNpdGlvbnNcclxuICogaHR0cHM6Ly9zd2lwZXJqcy5jb21cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTQtMjAyMiBWbGFkaW1pciBLaGFybGFtcGlkaVxyXG4gKlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICpcclxuICogUmVsZWFzZWQgb246IEFwcmlsIDE1LCAyMDIyXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcclxuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcclxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XHJcbiAgICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwuU3dpcGVyID0gZmFjdG9yeSgpKTtcclxufSkodGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU1NSIFdpbmRvdyA0LjAuMlxyXG4gICAgICogQmV0dGVyIGhhbmRsaW5nIGZvciB3aW5kb3cgb2JqZWN0IGluIFNTUiBlbnZpcm9ubWVudFxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL25vbGltaXRzNHdlYi9zc3Itd2luZG93XHJcbiAgICAgKlxyXG4gICAgICogQ29weXJpZ2h0IDIwMjEsIFZsYWRpbWlyIEtoYXJsYW1waWRpXHJcbiAgICAgKlxyXG4gICAgICogTGljZW5zZWQgdW5kZXIgTUlUXHJcbiAgICAgKlxyXG4gICAgICogUmVsZWFzZWQgb246IERlY2VtYmVyIDEzLCAyMDIxXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xyXG4gICAgZnVuY3Rpb24gaXNPYmplY3QkMShvYmopIHtcclxuICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAnY29uc3RydWN0b3InIGluIG9iaiAmJiBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleHRlbmQkMSh0YXJnZXQsIHNyYykge1xyXG4gICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHtcclxuICAgICAgICB0YXJnZXQgPSB7fTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNyYyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgc3JjID0ge307XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICd1bmRlZmluZWQnKSB0YXJnZXRba2V5XSA9IHNyY1trZXldO2Vsc2UgaWYgKGlzT2JqZWN0JDEoc3JjW2tleV0pICYmIGlzT2JqZWN0JDEodGFyZ2V0W2tleV0pICYmIE9iamVjdC5rZXlzKHNyY1trZXldKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBleHRlbmQkMSh0YXJnZXRba2V5XSwgc3JjW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3NyRG9jdW1lbnQgPSB7XHJcbiAgICAgIGJvZHk6IHt9LFxyXG5cclxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcigpIHt9LFxyXG5cclxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHt9LFxyXG5cclxuICAgICAgYWN0aXZlRWxlbWVudDoge1xyXG4gICAgICAgIGJsdXIoKSB7fSxcclxuXHJcbiAgICAgICAgbm9kZU5hbWU6ICcnXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBxdWVyeVNlbGVjdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcXVlcnlTZWxlY3RvckFsbCgpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRFbGVtZW50QnlJZCgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNyZWF0ZUV2ZW50KCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpbml0RXZlbnQoKSB7fVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgY3JlYXRlRWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgY2hpbGROb2RlczogW10sXHJcbiAgICAgICAgICBzdHlsZToge30sXHJcblxyXG4gICAgICAgICAgc2V0QXR0cmlidXRlKCkge30sXHJcblxyXG4gICAgICAgICAgZ2V0RWxlbWVudHNCeVRhZ05hbWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNyZWF0ZUVsZW1lbnROUygpIHtcclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbXBvcnROb2RlKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICBoYXNoOiAnJyxcclxuICAgICAgICBob3N0OiAnJyxcclxuICAgICAgICBob3N0bmFtZTogJycsXHJcbiAgICAgICAgaHJlZjogJycsXHJcbiAgICAgICAgb3JpZ2luOiAnJyxcclxuICAgICAgICBwYXRobmFtZTogJycsXHJcbiAgICAgICAgcHJvdG9jb2w6ICcnLFxyXG4gICAgICAgIHNlYXJjaDogJydcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXREb2N1bWVudCgpIHtcclxuICAgICAgY29uc3QgZG9jID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50IDoge307XHJcbiAgICAgIGV4dGVuZCQxKGRvYywgc3NyRG9jdW1lbnQpO1xyXG4gICAgICByZXR1cm4gZG9jO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNzcldpbmRvdyA9IHtcclxuICAgICAgZG9jdW1lbnQ6IHNzckRvY3VtZW50LFxyXG4gICAgICBuYXZpZ2F0b3I6IHtcclxuICAgICAgICB1c2VyQWdlbnQ6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgaGFzaDogJycsXHJcbiAgICAgICAgaG9zdDogJycsXHJcbiAgICAgICAgaG9zdG5hbWU6ICcnLFxyXG4gICAgICAgIGhyZWY6ICcnLFxyXG4gICAgICAgIG9yaWdpbjogJycsXHJcbiAgICAgICAgcGF0aG5hbWU6ICcnLFxyXG4gICAgICAgIHByb3RvY29sOiAnJyxcclxuICAgICAgICBzZWFyY2g6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGhpc3Rvcnk6IHtcclxuICAgICAgICByZXBsYWNlU3RhdGUoKSB7fSxcclxuXHJcbiAgICAgICAgcHVzaFN0YXRlKCkge30sXHJcblxyXG4gICAgICAgIGdvKCkge30sXHJcblxyXG4gICAgICAgIGJhY2soKSB7fVxyXG5cclxuICAgICAgfSxcclxuICAgICAgQ3VzdG9tRXZlbnQ6IGZ1bmN0aW9uIEN1c3RvbUV2ZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcigpIHt9LFxyXG5cclxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHt9LFxyXG5cclxuICAgICAgZ2V0Q29tcHV0ZWRTdHlsZSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZ2V0UHJvcGVydHlWYWx1ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgSW1hZ2UoKSB7fSxcclxuXHJcbiAgICAgIERhdGUoKSB7fSxcclxuXHJcbiAgICAgIHNjcmVlbjoge30sXHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCkge30sXHJcblxyXG4gICAgICBjbGVhclRpbWVvdXQoKSB7fSxcclxuXHJcbiAgICAgIG1hdGNoTWVkaWEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRXaW5kb3coKSB7XHJcbiAgICAgIGNvbnN0IHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge307XHJcbiAgICAgIGV4dGVuZCQxKHdpbiwgc3NyV2luZG93KTtcclxuICAgICAgcmV0dXJuIHdpbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvbTcgNC4wLjRcclxuICAgICAqIE1pbmltYWxpc3RpYyBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIERPTSBtYW5pcHVsYXRpb24sIHdpdGggYSBqUXVlcnktY29tcGF0aWJsZSBBUElcclxuICAgICAqIGh0dHBzOi8vZnJhbWV3b3JrNy5pby9kb2NzL2RvbTcuaHRtbFxyXG4gICAgICpcclxuICAgICAqIENvcHlyaWdodCAyMDIyLCBWbGFkaW1pciBLaGFybGFtcGlkaVxyXG4gICAgICpcclxuICAgICAqIExpY2Vuc2VkIHVuZGVyIE1JVFxyXG4gICAgICpcclxuICAgICAqIFJlbGVhc2VkIG9uOiBKYW51YXJ5IDExLCAyMDIyXHJcbiAgICAgKi9cclxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXHJcblxyXG4gICAgZnVuY3Rpb24gbWFrZVJlYWN0aXZlKG9iaikge1xyXG4gICAgICBjb25zdCBwcm90byA9IG9iai5fX3Byb3RvX187XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdfX3Byb3RvX18nLCB7XHJcbiAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgcmV0dXJuIHByb3RvO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgcHJvdG8uX19wcm90b19fID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRG9tNyBleHRlbmRzIEFycmF5IHtcclxuICAgICAgY29uc3RydWN0b3IoaXRlbXMpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1zID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdXBlciguLi4oaXRlbXMgfHwgW10pKTtcclxuICAgICAgICAgIG1ha2VSZWFjdGl2ZSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXJyYXlGbGF0KGFycikge1xyXG4gICAgICBpZiAoYXJyID09PSB2b2lkIDApIHtcclxuICAgICAgICBhcnIgPSBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzID0gW107XHJcbiAgICAgIGFyci5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbCkpIHtcclxuICAgICAgICAgIHJlcy5wdXNoKC4uLmFycmF5RmxhdChlbCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMucHVzaChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcnJheUZpbHRlcihhcnIsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoYXJyLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXJyYXlVbmlxdWUoYXJyKSB7XHJcbiAgICAgIGNvbnN0IHVuaXF1ZUFycmF5ID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGlmICh1bmlxdWVBcnJheS5pbmRleE9mKGFycltpXSkgPT09IC0xKSB1bmlxdWVBcnJheS5wdXNoKGFycltpXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB1bmlxdWVBcnJheTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gcXNhKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIFtzZWxlY3Rvcl07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGEgPSBbXTtcclxuICAgICAgY29uc3QgcmVzID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgYS5wdXNoKHJlc1tpXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uICQoc2VsZWN0b3IsIGNvbnRleHQpIHtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgbGV0IGFyciA9IFtdO1xyXG5cclxuICAgICAgaWYgKCFjb250ZXh0ICYmIHNlbGVjdG9yIGluc3RhbmNlb2YgRG9tNykge1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RvcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgRG9tNyhhcnIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnN0IGh0bWwgPSBzZWxlY3Rvci50cmltKCk7XHJcblxyXG4gICAgICAgIGlmIChodG1sLmluZGV4T2YoJzwnKSA+PSAwICYmIGh0bWwuaW5kZXhPZignPicpID49IDApIHtcclxuICAgICAgICAgIGxldCB0b0NyZWF0ZSA9ICdkaXYnO1xyXG4gICAgICAgICAgaWYgKGh0bWwuaW5kZXhPZignPGxpJykgPT09IDApIHRvQ3JlYXRlID0gJ3VsJztcclxuICAgICAgICAgIGlmIChodG1sLmluZGV4T2YoJzx0cicpID09PSAwKSB0b0NyZWF0ZSA9ICd0Ym9keSc7XHJcbiAgICAgICAgICBpZiAoaHRtbC5pbmRleE9mKCc8dGQnKSA9PT0gMCB8fCBodG1sLmluZGV4T2YoJzx0aCcpID09PSAwKSB0b0NyZWF0ZSA9ICd0cic7XHJcbiAgICAgICAgICBpZiAoaHRtbC5pbmRleE9mKCc8dGJvZHknKSA9PT0gMCkgdG9DcmVhdGUgPSAndGFibGUnO1xyXG4gICAgICAgICAgaWYgKGh0bWwuaW5kZXhPZignPG9wdGlvbicpID09PSAwKSB0b0NyZWF0ZSA9ICdzZWxlY3QnO1xyXG4gICAgICAgICAgY29uc3QgdGVtcFBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodG9DcmVhdGUpO1xyXG4gICAgICAgICAgdGVtcFBhcmVudC5pbm5lckhUTUwgPSBodG1sO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGVtcFBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHRlbXBQYXJlbnQuY2hpbGROb2Rlc1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFyciA9IHFzYShzZWxlY3Rvci50cmltKCksIGNvbnRleHQgfHwgZG9jdW1lbnQpO1xyXG4gICAgICAgIH0gLy8gYXJyID0gcXNhKHNlbGVjdG9yLCBkb2N1bWVudCk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yLm5vZGVUeXBlIHx8IHNlbGVjdG9yID09PSB3aW5kb3cgfHwgc2VsZWN0b3IgPT09IGRvY3VtZW50KSB7XHJcbiAgICAgICAgYXJyLnB1c2goc2VsZWN0b3IpO1xyXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgRG9tNykgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgICAgIGFyciA9IHNlbGVjdG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbmV3IERvbTcoYXJyYXlVbmlxdWUoYXJyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgJC5mbiA9IERvbTcucHJvdG90eXBlOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRDbGFzcygpIHtcclxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNsYXNzZXMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XHJcbiAgICAgICAgY2xhc3Nlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IGFycmF5RmxhdChjbGFzc2VzLm1hcChjID0+IGMuc3BsaXQoJyAnKSkpO1xyXG4gICAgICB0aGlzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVDbGFzcygpIHtcclxuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBjbGFzc2VzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XHJcbiAgICAgICAgY2xhc3Nlc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjbGFzc05hbWVzID0gYXJyYXlGbGF0KGNsYXNzZXMubWFwKGMgPT4gYy5zcGxpdCgnICcpKSk7XHJcbiAgICAgIHRoaXMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc05hbWVzKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKCkge1xyXG4gICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGNsYXNzZXMgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcclxuICAgICAgICBjbGFzc2VzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBhcnJheUZsYXQoY2xhc3Nlcy5tYXAoYyA9PiBjLnNwbGl0KCcgJykpKTtcclxuICAgICAgdGhpcy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBjbGFzc05hbWVzLmZvckVhY2goY2xhc3NOYW1lID0+IHtcclxuICAgICAgICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFzQ2xhc3MoKSB7XHJcbiAgICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgY2xhc3NlcyA9IG5ldyBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xyXG4gICAgICAgIGNsYXNzZXNbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IGFycmF5RmxhdChjbGFzc2VzLm1hcChjID0+IGMuc3BsaXQoJyAnKSkpO1xyXG4gICAgICByZXR1cm4gYXJyYXlGaWx0ZXIodGhpcywgZWwgPT4ge1xyXG4gICAgICAgIHJldHVybiBjbGFzc05hbWVzLmZpbHRlcihjbGFzc05hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpLmxlbmd0aCA+IDA7XHJcbiAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXR0cihhdHRycywgdmFsdWUpIHtcclxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGF0dHJzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIC8vIEdldCBhdHRyXHJcbiAgICAgICAgaWYgKHRoaXNbMF0pIHJldHVybiB0aGlzWzBdLmdldEF0dHJpYnV0ZShhdHRycyk7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgfSAvLyBTZXQgYXR0cnNcclxuXHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgLy8gU3RyaW5nXHJcbiAgICAgICAgICB0aGlzW2ldLnNldEF0dHJpYnV0ZShhdHRycywgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICAgIGZvciAoY29uc3QgYXR0ck5hbWUgaW4gYXR0cnMpIHtcclxuICAgICAgICAgICAgdGhpc1tpXVthdHRyTmFtZV0gPSBhdHRyc1thdHRyTmFtZV07XHJcbiAgICAgICAgICAgIHRoaXNbaV0uc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyc1thdHRyTmFtZV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlQXR0cihhdHRyKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIHRoaXNbaV0ucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm0odHJhbnNmb3JtKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIHRoaXNbaV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2l0aW9uJDEoZHVyYXRpb24pIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgdGhpc1tpXS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB0eXBlb2YgZHVyYXRpb24gIT09ICdzdHJpbmcnID8gYCR7ZHVyYXRpb259bXNgIDogZHVyYXRpb247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uKCkge1xyXG4gICAgICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcclxuICAgICAgICBhcmdzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBbZXZlbnRUeXBlLCB0YXJnZXRTZWxlY3RvciwgbGlzdGVuZXIsIGNhcHR1cmVdID0gYXJncztcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgYXJnc1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFtldmVudFR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlXSA9IGFyZ3M7XHJcbiAgICAgICAgdGFyZ2V0U2VsZWN0b3IgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY2FwdHVyZSkgY2FwdHVyZSA9IGZhbHNlO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaGFuZGxlTGl2ZUV2ZW50KGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50RGF0YSA9IGUudGFyZ2V0LmRvbTdFdmVudERhdGEgfHwgW107XHJcblxyXG4gICAgICAgIGlmIChldmVudERhdGEuaW5kZXhPZihlKSA8IDApIHtcclxuICAgICAgICAgIGV2ZW50RGF0YS51bnNoaWZ0KGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQodGFyZ2V0KS5pcyh0YXJnZXRTZWxlY3RvcikpIGxpc3RlbmVyLmFwcGx5KHRhcmdldCwgZXZlbnREYXRhKTtlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmVudHMgPSAkKHRhcmdldCkucGFyZW50cygpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBwYXJlbnRzLmxlbmd0aDsgayArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHBhcmVudHNba10pLmlzKHRhcmdldFNlbGVjdG9yKSkgbGlzdGVuZXIuYXBwbHkocGFyZW50c1trXSwgZXZlbnREYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZUV2ZW50KGUpIHtcclxuICAgICAgICBjb25zdCBldmVudERhdGEgPSBlICYmIGUudGFyZ2V0ID8gZS50YXJnZXQuZG9tN0V2ZW50RGF0YSB8fCBbXSA6IFtdO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnREYXRhLmluZGV4T2YoZSkgPCAwKSB7XHJcbiAgICAgICAgICBldmVudERhdGEudW5zaGlmdChlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGV2ZW50RGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGV2ZW50VHlwZS5zcGxpdCgnICcpO1xyXG4gICAgICBsZXQgajtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGVsID0gdGhpc1tpXTtcclxuXHJcbiAgICAgICAgaWYgKCF0YXJnZXRTZWxlY3Rvcikge1xyXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGV2ZW50cy5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGV2ZW50c1tqXTtcclxuICAgICAgICAgICAgaWYgKCFlbC5kb203TGlzdGVuZXJzKSBlbC5kb203TGlzdGVuZXJzID0ge307XHJcbiAgICAgICAgICAgIGlmICghZWwuZG9tN0xpc3RlbmVyc1tldmVudF0pIGVsLmRvbTdMaXN0ZW5lcnNbZXZlbnRdID0gW107XHJcbiAgICAgICAgICAgIGVsLmRvbTdMaXN0ZW5lcnNbZXZlbnRdLnB1c2goe1xyXG4gICAgICAgICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgICAgICAgIHByb3h5TGlzdGVuZXI6IGhhbmRsZUV2ZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVFdmVudCwgY2FwdHVyZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIExpdmUgZXZlbnRzXHJcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZXZlbnRzLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnRzW2pdO1xyXG4gICAgICAgICAgICBpZiAoIWVsLmRvbTdMaXZlTGlzdGVuZXJzKSBlbC5kb203TGl2ZUxpc3RlbmVycyA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoIWVsLmRvbTdMaXZlTGlzdGVuZXJzW2V2ZW50XSkgZWwuZG9tN0xpdmVMaXN0ZW5lcnNbZXZlbnRdID0gW107XHJcbiAgICAgICAgICAgIGVsLmRvbTdMaXZlTGlzdGVuZXJzW2V2ZW50XS5wdXNoKHtcclxuICAgICAgICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICAgICAgICBwcm94eUxpc3RlbmVyOiBoYW5kbGVMaXZlRXZlbnRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZUxpdmVFdmVudCwgY2FwdHVyZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvZmYoKSB7XHJcbiAgICAgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xyXG4gICAgICAgIGFyZ3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IFtldmVudFR5cGUsIHRhcmdldFNlbGVjdG9yLCBsaXN0ZW5lciwgY2FwdHVyZV0gPSBhcmdzO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBhcmdzWzFdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgW2V2ZW50VHlwZSwgbGlzdGVuZXIsIGNhcHR1cmVdID0gYXJncztcclxuICAgICAgICB0YXJnZXRTZWxlY3RvciA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjYXB0dXJlKSBjYXB0dXJlID0gZmFsc2U7XHJcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGV2ZW50VHlwZS5zcGxpdCgnICcpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBjb25zdCBldmVudCA9IGV2ZW50c1tpXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICAgICAgICBjb25zdCBlbCA9IHRoaXNbal07XHJcbiAgICAgICAgICBsZXQgaGFuZGxlcnM7XHJcblxyXG4gICAgICAgICAgaWYgKCF0YXJnZXRTZWxlY3RvciAmJiBlbC5kb203TGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXJzID0gZWwuZG9tN0xpc3RlbmVyc1tldmVudF07XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldFNlbGVjdG9yICYmIGVsLmRvbTdMaXZlTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXJzID0gZWwuZG9tN0xpdmVMaXN0ZW5lcnNbZXZlbnRdO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChoYW5kbGVycyAmJiBoYW5kbGVycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7IGsgPj0gMDsgayAtPSAxKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IGhhbmRsZXJzW2tdO1xyXG5cclxuICAgICAgICAgICAgICBpZiAobGlzdGVuZXIgJiYgaGFuZGxlci5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIucHJveHlMaXN0ZW5lciwgY2FwdHVyZSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UoaywgMSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lciAmJiBoYW5kbGVyLmxpc3RlbmVyICYmIGhhbmRsZXIubGlzdGVuZXIuZG9tN3Byb3h5ICYmIGhhbmRsZXIubGlzdGVuZXIuZG9tN3Byb3h5ID09PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlci5wcm94eUxpc3RlbmVyLCBjYXB0dXJlKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShrLCAxKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlci5wcm94eUxpc3RlbmVyLCBjYXB0dXJlKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShrLCAxKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyaWdnZXIoKSB7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG5cclxuICAgICAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW45KSwgX2tleTkgPSAwOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XHJcbiAgICAgICAgYXJnc1tfa2V5OV0gPSBhcmd1bWVudHNbX2tleTldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBldmVudHMgPSBhcmdzWzBdLnNwbGl0KCcgJyk7XHJcbiAgICAgIGNvbnN0IGV2ZW50RGF0YSA9IGFyZ3NbMV07XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnRzW2ldO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAgIGNvbnN0IGVsID0gdGhpc1tqXTtcclxuXHJcbiAgICAgICAgICBpZiAod2luZG93LkN1c3RvbUV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2dCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoZXZlbnQsIHtcclxuICAgICAgICAgICAgICBkZXRhaWw6IGV2ZW50RGF0YSxcclxuICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsLmRvbTdFdmVudERhdGEgPSBhcmdzLmZpbHRlcigoZGF0YSwgZGF0YUluZGV4KSA9PiBkYXRhSW5kZXggPiAwKTtcclxuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldnQpO1xyXG4gICAgICAgICAgICBlbC5kb203RXZlbnREYXRhID0gW107XHJcbiAgICAgICAgICAgIGRlbGV0ZSBlbC5kb203RXZlbnREYXRhO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCQxKGNhbGxiYWNrKSB7XHJcbiAgICAgIGNvbnN0IGRvbSA9IHRoaXM7XHJcblxyXG4gICAgICBmdW5jdGlvbiBmaXJlQ2FsbEJhY2soZSkge1xyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdGhpcykgcmV0dXJuO1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZSk7XHJcbiAgICAgICAgZG9tLm9mZigndHJhbnNpdGlvbmVuZCcsIGZpcmVDYWxsQmFjayk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGRvbS5vbigndHJhbnNpdGlvbmVuZCcsIGZpcmVDYWxsQmFjayk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG91dGVyV2lkdGgoaW5jbHVkZU1hcmdpbnMpIHtcclxuICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmIChpbmNsdWRlTWFyZ2lucykge1xyXG4gICAgICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5zdHlsZXMoKTtcclxuICAgICAgICAgIHJldHVybiB0aGlzWzBdLm9mZnNldFdpZHRoICsgcGFyc2VGbG9hdChzdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnbWFyZ2luLXJpZ2h0JykpICsgcGFyc2VGbG9hdChzdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnbWFyZ2luLWxlZnQnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpc1swXS5vZmZzZXRXaWR0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb3V0ZXJIZWlnaHQoaW5jbHVkZU1hcmdpbnMpIHtcclxuICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmIChpbmNsdWRlTWFyZ2lucykge1xyXG4gICAgICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5zdHlsZXMoKTtcclxuICAgICAgICAgIHJldHVybiB0aGlzWzBdLm9mZnNldEhlaWdodCArIHBhcnNlRmxvYXQoc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ21hcmdpbi10b3AnKSkgKyBwYXJzZUZsb2F0KHN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKCdtYXJnaW4tYm90dG9tJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0ub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvZmZzZXQoKSB7XHJcbiAgICAgIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcclxuICAgICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzWzBdO1xyXG4gICAgICAgIGNvbnN0IGJveCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgIGNvbnN0IGNsaWVudFRvcCA9IGVsLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwO1xyXG4gICAgICAgIGNvbnN0IGNsaWVudExlZnQgPSBlbC5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwO1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IGVsID09PSB3aW5kb3cgPyB3aW5kb3cuc2Nyb2xsWSA6IGVsLnNjcm9sbFRvcDtcclxuICAgICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gZWwgPT09IHdpbmRvdyA/IHdpbmRvdy5zY3JvbGxYIDogZWwuc2Nyb2xsTGVmdDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdG9wOiBib3gudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wLFxyXG4gICAgICAgICAgbGVmdDogYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN0eWxlcygpIHtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGlmICh0aGlzWzBdKSByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpc1swXSwgbnVsbCk7XHJcbiAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjc3MocHJvcHMsIHZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICBsZXQgaTtcclxuXHJcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIC8vIC5jc3MoJ3dpZHRoJylcclxuICAgICAgICAgIGlmICh0aGlzWzBdKSByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpc1swXSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIC5jc3MoeyB3aWR0aDogJzEwMHB4JyB9KVxyXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgdGhpc1tpXS5zdHlsZVtwcm9wXSA9IHByb3BzW3Byb3BdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0eXBlb2YgcHJvcHMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy8gLmNzcygnd2lkdGgnLCAnMTAwcHgnKVxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICB0aGlzW2ldLnN0eWxlW3Byb3BzXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVhY2goY2FsbGJhY2spIHtcclxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuIHRoaXM7XHJcbiAgICAgIHRoaXMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoZWwsIFtlbCwgaW5kZXhdKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFjaykge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhcnJheUZpbHRlcih0aGlzLCBjYWxsYmFjayk7XHJcbiAgICAgIHJldHVybiAkKHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaHRtbChodG1sKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgaHRtbCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1swXSA/IHRoaXNbMF0uaW5uZXJIVE1MIDogbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgdGhpc1tpXS5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZXh0KHRleHQpIHtcclxuICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzWzBdID8gdGhpc1swXS50ZXh0Q29udGVudC50cmltKCkgOiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICB0aGlzW2ldLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXMoc2VsZWN0b3IpIHtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgY29uc3QgZWwgPSB0aGlzWzBdO1xyXG4gICAgICBsZXQgY29tcGFyZVdpdGg7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBpZiAoIWVsIHx8IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWYgKGVsLm1hdGNoZXMpIHJldHVybiBlbC5tYXRjaGVzKHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoZWwubXNNYXRjaGVzU2VsZWN0b3IpIHJldHVybiBlbC5tc01hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgY29tcGFyZVdpdGggPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbXBhcmVXaXRoLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAoY29tcGFyZVdpdGhbaV0gPT09IGVsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNlbGVjdG9yID09PSBkb2N1bWVudCkge1xyXG4gICAgICAgIHJldHVybiBlbCA9PT0gZG9jdW1lbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZWxlY3RvciA9PT0gd2luZG93KSB7XHJcbiAgICAgICAgcmV0dXJuIGVsID09PSB3aW5kb3c7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZWxlY3Rvci5ub2RlVHlwZSB8fCBzZWxlY3RvciBpbnN0YW5jZW9mIERvbTcpIHtcclxuICAgICAgICBjb21wYXJlV2l0aCA9IHNlbGVjdG9yLm5vZGVUeXBlID8gW3NlbGVjdG9yXSA6IHNlbGVjdG9yO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29tcGFyZVdpdGgubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGlmIChjb21wYXJlV2l0aFtpXSA9PT0gZWwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5kZXgoKSB7XHJcbiAgICAgIGxldCBjaGlsZCA9IHRoaXNbMF07XHJcbiAgICAgIGxldCBpO1xyXG5cclxuICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgaSA9IDA7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG5cclxuICAgICAgICB3aGlsZSAoKGNoaWxkID0gY2hpbGQucHJldmlvdXNTaWJsaW5nKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKSBpICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlcShpbmRleCkge1xyXG4gICAgICBpZiAodHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIHRoaXM7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKGluZGV4ID4gbGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIHJldHVybiAkKFtdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgIGNvbnN0IHJldHVybkluZGV4ID0gbGVuZ3RoICsgaW5kZXg7XHJcbiAgICAgICAgaWYgKHJldHVybkluZGV4IDwgMCkgcmV0dXJuICQoW10pO1xyXG4gICAgICAgIHJldHVybiAkKFt0aGlzW3JldHVybkluZGV4XV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gJChbdGhpc1tpbmRleF1dKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmQoKSB7XHJcbiAgICAgIGxldCBuZXdDaGlsZDtcclxuICAgICAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhcmd1bWVudHMubGVuZ3RoOyBrICs9IDEpIHtcclxuICAgICAgICBuZXdDaGlsZCA9IGsgPCAwIHx8IGFyZ3VtZW50cy5sZW5ndGggPD0gayA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1trXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIG5ld0NoaWxkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gbmV3Q2hpbGQ7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAodGVtcERpdi5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgdGhpc1tpXS5hcHBlbmRDaGlsZCh0ZW1wRGl2LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG5ld0NoaWxkIGluc3RhbmNlb2YgRG9tNykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5ld0NoaWxkLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICAgICAgICAgICAgdGhpc1tpXS5hcHBlbmRDaGlsZChuZXdDaGlsZFtqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXNbaV0uYXBwZW5kQ2hpbGQobmV3Q2hpbGQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGVuZChuZXdDaGlsZCkge1xyXG4gICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBsZXQgajtcclxuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdDaGlsZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGNvbnN0IHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gbmV3Q2hpbGQ7XHJcblxyXG4gICAgICAgICAgZm9yIChqID0gdGVtcERpdi5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7IGogPj0gMDsgaiAtPSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXNbaV0uaW5zZXJ0QmVmb3JlKHRlbXBEaXYuY2hpbGROb2Rlc1tqXSwgdGhpc1tpXS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG5ld0NoaWxkIGluc3RhbmNlb2YgRG9tNykge1xyXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IG5ld0NoaWxkLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXNbaV0uaW5zZXJ0QmVmb3JlKG5ld0NoaWxkW2pdLCB0aGlzW2ldLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzW2ldLmluc2VydEJlZm9yZShuZXdDaGlsZCwgdGhpc1tpXS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5leHQoc2VsZWN0b3IpIHtcclxuICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmIChzZWxlY3Rvcikge1xyXG4gICAgICAgICAgaWYgKHRoaXNbMF0ubmV4dEVsZW1lbnRTaWJsaW5nICYmICQodGhpc1swXS5uZXh0RWxlbWVudFNpYmxpbmcpLmlzKHNlbGVjdG9yKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChbdGhpc1swXS5uZXh0RWxlbWVudFNpYmxpbmddKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gJChbXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpc1swXS5uZXh0RWxlbWVudFNpYmxpbmcpIHJldHVybiAkKFt0aGlzWzBdLm5leHRFbGVtZW50U2libGluZ10pO1xyXG4gICAgICAgIHJldHVybiAkKFtdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuICQoW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5leHRBbGwoc2VsZWN0b3IpIHtcclxuICAgICAgY29uc3QgbmV4dEVscyA9IFtdO1xyXG4gICAgICBsZXQgZWwgPSB0aGlzWzBdO1xyXG4gICAgICBpZiAoIWVsKSByZXR1cm4gJChbXSk7XHJcblxyXG4gICAgICB3aGlsZSAoZWwubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IGVsLm5leHRFbGVtZW50U2libGluZzsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG5cclxuICAgICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgIGlmICgkKG5leHQpLmlzKHNlbGVjdG9yKSkgbmV4dEVscy5wdXNoKG5leHQpO1xyXG4gICAgICAgIH0gZWxzZSBuZXh0RWxzLnB1c2gobmV4dCk7XHJcblxyXG4gICAgICAgIGVsID0gbmV4dDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuICQobmV4dEVscyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJldihzZWxlY3Rvcikge1xyXG4gICAgICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzWzBdO1xyXG5cclxuICAgICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgIGlmIChlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmICQoZWwucHJldmlvdXNFbGVtZW50U2libGluZykuaXMoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFtlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuICQoW10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHJldHVybiAkKFtlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXSk7XHJcbiAgICAgICAgcmV0dXJuICQoW10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gJChbXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJldkFsbChzZWxlY3Rvcikge1xyXG4gICAgICBjb25zdCBwcmV2RWxzID0gW107XHJcbiAgICAgIGxldCBlbCA9IHRoaXNbMF07XHJcbiAgICAgIGlmICghZWwpIHJldHVybiAkKFtdKTtcclxuXHJcbiAgICAgIHdoaWxlIChlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcHJldiA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICBpZiAoJChwcmV2KS5pcyhzZWxlY3RvcikpIHByZXZFbHMucHVzaChwcmV2KTtcclxuICAgICAgICB9IGVsc2UgcHJldkVscy5wdXNoKHByZXYpO1xyXG5cclxuICAgICAgICBlbCA9IHByZXY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkKHByZXZFbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcmVudChzZWxlY3Rvcikge1xyXG4gICAgICBjb25zdCBwYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzW2ldLnBhcmVudE5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzW2ldLnBhcmVudE5vZGUpLmlzKHNlbGVjdG9yKSkgcGFyZW50cy5wdXNoKHRoaXNbaV0ucGFyZW50Tm9kZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJlbnRzLnB1c2godGhpc1tpXS5wYXJlbnROb2RlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkKHBhcmVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcmVudHMoc2VsZWN0b3IpIHtcclxuICAgICAgY29uc3QgcGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpc1tpXS5wYXJlbnROb2RlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblxyXG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoJChwYXJlbnQpLmlzKHNlbGVjdG9yKSkgcGFyZW50cy5wdXNoKHBhcmVudCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkKHBhcmVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IpIHtcclxuICAgICAgbGV0IGNsb3Nlc3QgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblxyXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiAkKFtdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjbG9zZXN0LmlzKHNlbGVjdG9yKSkge1xyXG4gICAgICAgIGNsb3Nlc3QgPSBjbG9zZXN0LnBhcmVudHMoc2VsZWN0b3IpLmVxKDApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY2xvc2VzdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaW5kKHNlbGVjdG9yKSB7XHJcbiAgICAgIGNvbnN0IGZvdW5kRWxlbWVudHMgPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGZvdW5kID0gdGhpc1tpXS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmb3VuZC5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgICAgICAgZm91bmRFbGVtZW50cy5wdXNoKGZvdW5kW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkKGZvdW5kRWxlbWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoaWxkcmVuKHNlbGVjdG9yKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZXMgPSB0aGlzW2ldLmNoaWxkcmVuO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkTm9kZXMubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAgIGlmICghc2VsZWN0b3IgfHwgJChjaGlsZE5vZGVzW2pdKS5pcyhzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZE5vZGVzW2pdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkKGNoaWxkcmVuKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmUoKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzW2ldLnBhcmVudE5vZGUpIHRoaXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzW2ldKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgTWV0aG9kcyA9IHtcclxuICAgICAgYWRkQ2xhc3MsXHJcbiAgICAgIHJlbW92ZUNsYXNzLFxyXG4gICAgICBoYXNDbGFzcyxcclxuICAgICAgdG9nZ2xlQ2xhc3MsXHJcbiAgICAgIGF0dHIsXHJcbiAgICAgIHJlbW92ZUF0dHIsXHJcbiAgICAgIHRyYW5zZm9ybSxcclxuICAgICAgdHJhbnNpdGlvbjogdHJhbnNpdGlvbiQxLFxyXG4gICAgICBvbixcclxuICAgICAgb2ZmLFxyXG4gICAgICB0cmlnZ2VyLFxyXG4gICAgICB0cmFuc2l0aW9uRW5kOiB0cmFuc2l0aW9uRW5kJDEsXHJcbiAgICAgIG91dGVyV2lkdGgsXHJcbiAgICAgIG91dGVySGVpZ2h0LFxyXG4gICAgICBzdHlsZXMsXHJcbiAgICAgIG9mZnNldCxcclxuICAgICAgY3NzLFxyXG4gICAgICBlYWNoLFxyXG4gICAgICBodG1sLFxyXG4gICAgICB0ZXh0LFxyXG4gICAgICBpcyxcclxuICAgICAgaW5kZXgsXHJcbiAgICAgIGVxLFxyXG4gICAgICBhcHBlbmQsXHJcbiAgICAgIHByZXBlbmQsXHJcbiAgICAgIG5leHQsXHJcbiAgICAgIG5leHRBbGwsXHJcbiAgICAgIHByZXYsXHJcbiAgICAgIHByZXZBbGwsXHJcbiAgICAgIHBhcmVudCxcclxuICAgICAgcGFyZW50cyxcclxuICAgICAgY2xvc2VzdCxcclxuICAgICAgZmluZCxcclxuICAgICAgY2hpbGRyZW4sXHJcbiAgICAgIGZpbHRlcixcclxuICAgICAgcmVtb3ZlXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmtleXMoTWV0aG9kcykuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCQuZm4sIG1ldGhvZE5hbWUsIHtcclxuICAgICAgICB2YWx1ZTogTWV0aG9kc1ttZXRob2ROYW1lXSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb3BzKG9iaikge1xyXG4gICAgICBjb25zdCBvYmplY3QgPSBvYmo7XHJcbiAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBvYmplY3Rba2V5XSA9IG51bGw7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgey8vIG5vIGdldHRlciBmb3Igb2JqZWN0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsvLyBzb21ldGhpbmcgZ290IHdyb25nXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaywgZGVsYXkpIHtcclxuICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHtcclxuICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbm93KCkge1xyXG4gICAgICByZXR1cm4gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlJDEoZWwpIHtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGxldCBzdHlsZTtcclxuXHJcbiAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xyXG4gICAgICAgIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXN0eWxlICYmIGVsLmN1cnJlbnRTdHlsZSkge1xyXG4gICAgICAgIHN0eWxlID0gZWwuY3VycmVudFN0eWxlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUgPSBlbC5zdHlsZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRyYW5zbGF0ZShlbCwgYXhpcykge1xyXG4gICAgICBpZiAoYXhpcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgYXhpcyA9ICd4JztcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGxldCBtYXRyaXg7XHJcbiAgICAgIGxldCBjdXJUcmFuc2Zvcm07XHJcbiAgICAgIGxldCB0cmFuc2Zvcm1NYXRyaXg7XHJcbiAgICAgIGNvbnN0IGN1clN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSQxKGVsKTtcclxuXHJcbiAgICAgIGlmICh3aW5kb3cuV2ViS2l0Q1NTTWF0cml4KSB7XHJcbiAgICAgICAgY3VyVHJhbnNmb3JtID0gY3VyU3R5bGUudHJhbnNmb3JtIHx8IGN1clN0eWxlLndlYmtpdFRyYW5zZm9ybTtcclxuXHJcbiAgICAgICAgaWYgKGN1clRyYW5zZm9ybS5zcGxpdCgnLCcpLmxlbmd0aCA+IDYpIHtcclxuICAgICAgICAgIGN1clRyYW5zZm9ybSA9IGN1clRyYW5zZm9ybS5zcGxpdCgnLCAnKS5tYXAoYSA9PiBhLnJlcGxhY2UoJywnLCAnLicpKS5qb2luKCcsICcpO1xyXG4gICAgICAgIH0gLy8gU29tZSBvbGQgdmVyc2lvbnMgb2YgV2Via2l0IGNob2tlIHdoZW4gJ25vbmUnIGlzIHBhc3NlZDsgcGFzc1xyXG4gICAgICAgIC8vIGVtcHR5IHN0cmluZyBpbnN0ZWFkIGluIHRoaXMgY2FzZVxyXG5cclxuXHJcbiAgICAgICAgdHJhbnNmb3JtTWF0cml4ID0gbmV3IHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgoY3VyVHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IGN1clRyYW5zZm9ybSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdHJhbnNmb3JtTWF0cml4ID0gY3VyU3R5bGUuTW96VHJhbnNmb3JtIHx8IGN1clN0eWxlLk9UcmFuc2Zvcm0gfHwgY3VyU3R5bGUuTXNUcmFuc2Zvcm0gfHwgY3VyU3R5bGUubXNUcmFuc2Zvcm0gfHwgY3VyU3R5bGUudHJhbnNmb3JtIHx8IGN1clN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpLnJlcGxhY2UoJ3RyYW5zbGF0ZSgnLCAnbWF0cml4KDEsIDAsIDAsIDEsJyk7XHJcbiAgICAgICAgbWF0cml4ID0gdHJhbnNmb3JtTWF0cml4LnRvU3RyaW5nKCkuc3BsaXQoJywnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGF4aXMgPT09ICd4Jykge1xyXG4gICAgICAgIC8vIExhdGVzdCBDaHJvbWUgYW5kIHdlYmtpdHMgRml4XHJcbiAgICAgICAgaWYgKHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgpIGN1clRyYW5zZm9ybSA9IHRyYW5zZm9ybU1hdHJpeC5tNDE7IC8vIENyYXp5IElFMTAgTWF0cml4XHJcbiAgICAgICAgZWxzZSBpZiAobWF0cml4Lmxlbmd0aCA9PT0gMTYpIGN1clRyYW5zZm9ybSA9IHBhcnNlRmxvYXQobWF0cml4WzEyXSk7IC8vIE5vcm1hbCBCcm93c2Vyc1xyXG4gICAgICAgIGVsc2UgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbNF0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYXhpcyA9PT0gJ3knKSB7XHJcbiAgICAgICAgLy8gTGF0ZXN0IENocm9tZSBhbmQgd2Via2l0cyBGaXhcclxuICAgICAgICBpZiAod2luZG93LldlYktpdENTU01hdHJpeCkgY3VyVHJhbnNmb3JtID0gdHJhbnNmb3JtTWF0cml4Lm00MjsgLy8gQ3JhenkgSUUxMCBNYXRyaXhcclxuICAgICAgICBlbHNlIGlmIChtYXRyaXgubGVuZ3RoID09PSAxNikgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbMTNdKTsgLy8gTm9ybWFsIEJyb3dzZXJzXHJcbiAgICAgICAgZWxzZSBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFs1XSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjdXJUcmFuc2Zvcm0gfHwgMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc09iamVjdChvKSB7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgbyAhPT0gbnVsbCAmJiBvLmNvbnN0cnVjdG9yICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSkgPT09ICdPYmplY3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzTm9kZShub2RlKSB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5IVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbm9kZSAmJiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSAxMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXh0ZW5kKCkge1xyXG4gICAgICBjb25zdCB0byA9IE9iamVjdChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pO1xyXG4gICAgICBjb25zdCBub0V4dGVuZCA9IFsnX19wcm90b19fJywgJ2NvbnN0cnVjdG9yJywgJ3Byb3RvdHlwZSddO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBjb25zdCBuZXh0U291cmNlID0gaSA8IDAgfHwgYXJndW1lbnRzLmxlbmd0aCA8PSBpID8gdW5kZWZpbmVkIDogYXJndW1lbnRzW2ldO1xyXG5cclxuICAgICAgICBpZiAobmV4dFNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIG5leHRTb3VyY2UgIT09IG51bGwgJiYgIWlzTm9kZShuZXh0U291cmNlKSkge1xyXG4gICAgICAgICAgY29uc3Qga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKS5maWx0ZXIoa2V5ID0+IG5vRXh0ZW5kLmluZGV4T2Yoa2V5KSA8IDApO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4ICs9IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHRvW25leHRLZXldKSAmJiBpc09iamVjdChuZXh0U291cmNlW25leHRLZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRTb3VyY2VbbmV4dEtleV0uX19zd2lwZXJfXykge1xyXG4gICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBleHRlbmQodG9bbmV4dEtleV0sIG5leHRTb3VyY2VbbmV4dEtleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzT2JqZWN0KHRvW25leHRLZXldKSAmJiBpc09iamVjdChuZXh0U291cmNlW25leHRLZXldKSkge1xyXG4gICAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFNvdXJjZVtuZXh0S2V5XS5fX3N3aXBlcl9fKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGV4dGVuZCh0b1tuZXh0S2V5XSwgbmV4dFNvdXJjZVtuZXh0S2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0bztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRDU1NQcm9wZXJ0eShlbCwgdmFyTmFtZSwgdmFyVmFsdWUpIHtcclxuICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkodmFyTmFtZSwgdmFyVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGVDU1NNb2RlU2Nyb2xsKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgdGFyZ2V0UG9zaXRpb24sXHJcbiAgICAgICAgc2lkZVxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSAtc3dpcGVyLnRyYW5zbGF0ZTtcclxuICAgICAgbGV0IHN0YXJ0VGltZSA9IG51bGw7XHJcbiAgICAgIGxldCB0aW1lO1xyXG4gICAgICBjb25zdCBkdXJhdGlvbiA9IHN3aXBlci5wYXJhbXMuc3BlZWQ7XHJcbiAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSAnbm9uZSc7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShzd2lwZXIuY3NzTW9kZUZyYW1lSUQpO1xyXG4gICAgICBjb25zdCBkaXIgPSB0YXJnZXRQb3NpdGlvbiA+IHN0YXJ0UG9zaXRpb24gPyAnbmV4dCcgOiAncHJldic7XHJcblxyXG4gICAgICBjb25zdCBpc091dE9mQm91bmQgPSAoY3VycmVudCwgdGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRpciA9PT0gJ25leHQnICYmIGN1cnJlbnQgPj0gdGFyZ2V0IHx8IGRpciA9PT0gJ3ByZXYnICYmIGN1cnJlbnQgPD0gdGFyZ2V0O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgYW5pbWF0ZSA9ICgpID0+IHtcclxuICAgICAgICB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIGlmIChzdGFydFRpbWUgPT09IG51bGwpIHtcclxuICAgICAgICAgIHN0YXJ0VGltZSA9IHRpbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWF4KE1hdGgubWluKCh0aW1lIC0gc3RhcnRUaW1lKSAvIGR1cmF0aW9uLCAxKSwgMCk7XHJcbiAgICAgICAgY29uc3QgZWFzZVByb2dyZXNzID0gMC41IC0gTWF0aC5jb3MocHJvZ3Jlc3MgKiBNYXRoLlBJKSAvIDI7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRQb3NpdGlvbiA9IHN0YXJ0UG9zaXRpb24gKyBlYXNlUHJvZ3Jlc3MgKiAodGFyZ2V0UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKGlzT3V0T2ZCb3VuZChjdXJyZW50UG9zaXRpb24sIHRhcmdldFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgY3VycmVudFBvc2l0aW9uID0gdGFyZ2V0UG9zaXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIud3JhcHBlckVsLnNjcm9sbFRvKHtcclxuICAgICAgICAgIFtzaWRlXTogY3VycmVudFBvc2l0aW9uXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChpc091dE9mQm91bmQoY3VycmVudFBvc2l0aW9uLCB0YXJnZXRQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSAnJztcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcbiAgICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc2Nyb2xsVG8oe1xyXG4gICAgICAgICAgICAgIFtzaWRlXTogY3VycmVudFBvc2l0aW9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoc3dpcGVyLmNzc01vZGVGcmFtZUlEKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXBlci5jc3NNb2RlRnJhbWVJRCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhbmltYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHN1cHBvcnQ7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsY1N1cHBvcnQoKSB7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc21vb3RoU2Nyb2xsOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgJ3Njcm9sbEJlaGF2aW9yJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUsXHJcbiAgICAgICAgdG91Y2g6ICEhKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKSxcclxuICAgICAgICBwYXNzaXZlTGlzdGVuZXI6IGZ1bmN0aW9uIGNoZWNrUGFzc2l2ZUxpc3RlbmVyKCkge1xyXG4gICAgICAgICAgbGV0IHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xyXG4gICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0UGFzc2l2ZUxpc3RlbmVyJywgbnVsbCwgb3B0cyk7XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7Ly8gTm8gc3VwcG9ydFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBzdXBwb3J0c1Bhc3NpdmU7XHJcbiAgICAgICAgfSgpLFxyXG4gICAgICAgIGdlc3R1cmVzOiBmdW5jdGlvbiBjaGVja0dlc3R1cmVzKCkge1xyXG4gICAgICAgICAgcmV0dXJuICdvbmdlc3R1cmVzdGFydCcgaW4gd2luZG93O1xyXG4gICAgICAgIH0oKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFN1cHBvcnQoKSB7XHJcbiAgICAgIGlmICghc3VwcG9ydCkge1xyXG4gICAgICAgIHN1cHBvcnQgPSBjYWxjU3VwcG9ydCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3VwcG9ydDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGV2aWNlQ2FjaGVkO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNhbGNEZXZpY2UoX3RlbXApIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICB1c2VyQWdlbnRcclxuICAgICAgfSA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wO1xyXG4gICAgICBjb25zdCBzdXBwb3J0ID0gZ2V0U3VwcG9ydCgpO1xyXG4gICAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcclxuICAgICAgY29uc3QgcGxhdGZvcm0gPSB3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtO1xyXG4gICAgICBjb25zdCB1YSA9IHVzZXJBZ2VudCB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuICAgICAgY29uc3QgZGV2aWNlID0ge1xyXG4gICAgICAgIGlvczogZmFsc2UsXHJcbiAgICAgICAgYW5kcm9pZDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgY29uc3Qgc2NyZWVuV2lkdGggPSB3aW5kb3cuc2NyZWVuLndpZHRoO1xyXG4gICAgICBjb25zdCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodDtcclxuICAgICAgY29uc3QgYW5kcm9pZCA9IHVhLm1hdGNoKC8oQW5kcm9pZCk7P1tcXHNcXC9dKyhbXFxkLl0rKT8vKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG5cclxuICAgICAgbGV0IGlwYWQgPSB1YS5tYXRjaCgvKGlQYWQpLipPU1xccyhbXFxkX10rKS8pO1xyXG4gICAgICBjb25zdCBpcG9kID0gdWEubWF0Y2goLyhpUG9kKSguKk9TXFxzKFtcXGRfXSspKT8vKTtcclxuICAgICAgY29uc3QgaXBob25lID0gIWlwYWQgJiYgdWEubWF0Y2goLyhpUGhvbmVcXHNPU3xpT1MpXFxzKFtcXGRfXSspLyk7XHJcbiAgICAgIGNvbnN0IHdpbmRvd3MgPSBwbGF0Zm9ybSA9PT0gJ1dpbjMyJztcclxuICAgICAgbGV0IG1hY29zID0gcGxhdGZvcm0gPT09ICdNYWNJbnRlbCc7IC8vIGlQYWRPcyAxMyBmaXhcclxuXHJcbiAgICAgIGNvbnN0IGlQYWRTY3JlZW5zID0gWycxMDI0eDEzNjYnLCAnMTM2NngxMDI0JywgJzgzNHgxMTk0JywgJzExOTR4ODM0JywgJzgzNHgxMTEyJywgJzExMTJ4ODM0JywgJzc2OHgxMDI0JywgJzEwMjR4NzY4JywgJzgyMHgxMTgwJywgJzExODB4ODIwJywgJzgxMHgxMDgwJywgJzEwODB4ODEwJ107XHJcblxyXG4gICAgICBpZiAoIWlwYWQgJiYgbWFjb3MgJiYgc3VwcG9ydC50b3VjaCAmJiBpUGFkU2NyZWVucy5pbmRleE9mKGAke3NjcmVlbldpZHRofXgke3NjcmVlbkhlaWdodH1gKSA+PSAwKSB7XHJcbiAgICAgICAgaXBhZCA9IHVhLm1hdGNoKC8oVmVyc2lvbilcXC8oW1xcZC5dKykvKTtcclxuICAgICAgICBpZiAoIWlwYWQpIGlwYWQgPSBbMCwgMSwgJzEzXzBfMCddO1xyXG4gICAgICAgIG1hY29zID0gZmFsc2U7XHJcbiAgICAgIH0gLy8gQW5kcm9pZFxyXG5cclxuXHJcbiAgICAgIGlmIChhbmRyb2lkICYmICF3aW5kb3dzKSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gJ2FuZHJvaWQnO1xyXG4gICAgICAgIGRldmljZS5hbmRyb2lkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlwYWQgfHwgaXBob25lIHx8IGlwb2QpIHtcclxuICAgICAgICBkZXZpY2Uub3MgPSAnaW9zJztcclxuICAgICAgICBkZXZpY2UuaW9zID0gdHJ1ZTtcclxuICAgICAgfSAvLyBFeHBvcnQgb2JqZWN0XHJcblxyXG5cclxuICAgICAgcmV0dXJuIGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREZXZpY2Uob3ZlcnJpZGVzKSB7XHJcbiAgICAgIGlmIChvdmVycmlkZXMgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIG92ZXJyaWRlcyA9IHt9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWRldmljZUNhY2hlZCkge1xyXG4gICAgICAgIGRldmljZUNhY2hlZCA9IGNhbGNEZXZpY2Uob3ZlcnJpZGVzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRldmljZUNhY2hlZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJvd3NlcjtcclxuXHJcbiAgICBmdW5jdGlvbiBjYWxjQnJvd3NlcigpIHtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBpc1NhZmFyaSgpIHtcclxuICAgICAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHVhLmluZGV4T2YoJ3NhZmFyaScpID49IDAgJiYgdWEuaW5kZXhPZignY2hyb21lJykgPCAwICYmIHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA8IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNTYWZhcmk6IGlzU2FmYXJpKCksXHJcbiAgICAgICAgaXNXZWJWaWV3OiAvKGlQaG9uZXxpUG9kfGlQYWQpLipBcHBsZVdlYktpdCg/IS4qU2FmYXJpKS9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0QnJvd3NlcigpIHtcclxuICAgICAgaWYgKCFicm93c2VyKSB7XHJcbiAgICAgICAgYnJvd3NlciA9IGNhbGNCcm93c2VyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBicm93c2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFJlc2l6ZShfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICBsZXQgb2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICBsZXQgYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xyXG5cclxuICAgICAgY29uc3QgcmVzaXplSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuaW5pdGlhbGl6ZWQpIHJldHVybjtcclxuICAgICAgICBlbWl0KCdiZWZvcmVSZXNpemUnKTtcclxuICAgICAgICBlbWl0KCdyZXNpemUnKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGNyZWF0ZU9ic2VydmVyID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQgfHwgIXN3aXBlci5pbml0aWFsaXplZCkgcmV0dXJuO1xyXG4gICAgICAgIG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xyXG4gICAgICAgICAgYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICAgIGhlaWdodFxyXG4gICAgICAgICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAgICAgICBsZXQgbmV3V2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgbGV0IG5ld0hlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKF9yZWYyID0+IHtcclxuICAgICAgICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICAgICAgY29udGVudEJveFNpemUsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50UmVjdCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFxyXG4gICAgICAgICAgICAgIH0gPSBfcmVmMjtcclxuICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gc3dpcGVyLmVsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgbmV3V2lkdGggPSBjb250ZW50UmVjdCA/IGNvbnRlbnRSZWN0LndpZHRoIDogKGNvbnRlbnRCb3hTaXplWzBdIHx8IGNvbnRlbnRCb3hTaXplKS5pbmxpbmVTaXplO1xyXG4gICAgICAgICAgICAgIG5ld0hlaWdodCA9IGNvbnRlbnRSZWN0ID8gY29udGVudFJlY3QuaGVpZ2h0IDogKGNvbnRlbnRCb3hTaXplWzBdIHx8IGNvbnRlbnRCb3hTaXplKS5ibG9ja1NpemU7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5ld1dpZHRoICE9PSB3aWR0aCB8fCBuZXdIZWlnaHQgIT09IGhlaWdodCkge1xyXG4gICAgICAgICAgICAgIHJlc2l6ZUhhbmRsZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShzd2lwZXIuZWwpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgcmVtb3ZlT2JzZXJ2ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uRnJhbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9ic2VydmVyICYmIG9ic2VydmVyLnVub2JzZXJ2ZSAmJiBzd2lwZXIuZWwpIHtcclxuICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShzd2lwZXIuZWwpO1xyXG4gICAgICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IG9yaWVudGF0aW9uQ2hhbmdlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuaW5pdGlhbGl6ZWQpIHJldHVybjtcclxuICAgICAgICBlbWl0KCdvcmllbnRhdGlvbmNoYW5nZScpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgb24oJ2luaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMucmVzaXplT2JzZXJ2ZXIgJiYgdHlwZW9mIHdpbmRvdy5SZXNpemVPYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNyZWF0ZU9ic2VydmVyKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgb3JpZW50YXRpb25DaGFuZ2VIYW5kbGVyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZU9ic2VydmVyKCk7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIG9yaWVudGF0aW9uQ2hhbmdlSGFuZGxlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIE9ic2VydmVyKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGNvbnN0IG9ic2VydmVycyA9IFtdO1xyXG4gICAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcclxuXHJcbiAgICAgIGNvbnN0IGF0dGFjaCA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICBvcHRpb25zID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBPYnNlcnZlckZ1bmMgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2Via2l0TXV0YXRpb25PYnNlcnZlcjtcclxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBPYnNlcnZlckZ1bmMobXV0YXRpb25zID0+IHtcclxuICAgICAgICAgIC8vIFRoZSBvYnNlcnZlclVwZGF0ZSBldmVudCBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcclxuICAgICAgICAgIC8vIG9uY2UgZGVzcGl0ZSB0aGUgbnVtYmVyIG9mIG11dGF0aW9ucy4gIEFkZGl0aW9uYWxcclxuICAgICAgICAgIC8vIHRyaWdnZXJzIGFyZSByZWR1bmRhbnQgYW5kIGFyZSB2ZXJ5IGNvc3RseVxyXG4gICAgICAgICAgaWYgKG11dGF0aW9ucy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZW1pdCgnb2JzZXJ2ZXJVcGRhdGUnLCBtdXRhdGlvbnNbMF0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3Qgb2JzZXJ2ZXJVcGRhdGUgPSBmdW5jdGlvbiBvYnNlcnZlclVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgZW1pdCgnb2JzZXJ2ZXJVcGRhdGUnLCBtdXRhdGlvbnNbMF0pO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9ic2VydmVyVXBkYXRlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KG9ic2VydmVyVXBkYXRlLCAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwge1xyXG4gICAgICAgICAgYXR0cmlidXRlczogdHlwZW9mIG9wdGlvbnMuYXR0cmlidXRlcyA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5hdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgY2hpbGRMaXN0OiB0eXBlb2Ygb3B0aW9ucy5jaGlsZExpc3QgPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IG9wdGlvbnMuY2hpbGRMaXN0LFxyXG4gICAgICAgICAgY2hhcmFjdGVyRGF0YTogdHlwZW9mIG9wdGlvbnMuY2hhcmFjdGVyRGF0YSA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5jaGFyYWN0ZXJEYXRhXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMub2JzZXJ2ZXIpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMub2JzZXJ2ZVBhcmVudHMpIHtcclxuICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclBhcmVudHMgPSBzd2lwZXIuJGVsLnBhcmVudHMoKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lclBhcmVudHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgYXR0YWNoKGNvbnRhaW5lclBhcmVudHNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gT2JzZXJ2ZSBjb250YWluZXJcclxuXHJcblxyXG4gICAgICAgIGF0dGFjaChzd2lwZXIuJGVsWzBdLCB7XHJcbiAgICAgICAgICBjaGlsZExpc3Q6IHN3aXBlci5wYXJhbXMub2JzZXJ2ZVNsaWRlQ2hpbGRyZW5cclxuICAgICAgICB9KTsgLy8gT2JzZXJ2ZSB3cmFwcGVyXHJcblxyXG4gICAgICAgIGF0dGFjaChzd2lwZXIuJHdyYXBwZXJFbFswXSwge1xyXG4gICAgICAgICAgYXR0cmlidXRlczogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVycy5zcGxpY2UoMCwgb2JzZXJ2ZXJzLmxlbmd0aCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBleHRlbmRQYXJhbXMoe1xyXG4gICAgICAgIG9ic2VydmVyOiBmYWxzZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogZmFsc2UsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignaW5pdCcsIGluaXQpO1xyXG4gICAgICBvbignZGVzdHJveScsIGRlc3Ryb3kpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXHJcbiAgICB2YXIgZXZlbnRzRW1pdHRlciA9IHtcclxuICAgICAgb24oZXZlbnRzLCBoYW5kbGVyLCBwcmlvcml0eSkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHNlbGY7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gcHJpb3JpdHkgPyAndW5zaGlmdCcgOiAncHVzaCc7XHJcbiAgICAgICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgICAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSkgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdID0gW107XHJcbiAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF1bbWV0aG9kXShoYW5kbGVyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9uY2UoZXZlbnRzLCBoYW5kbGVyLCBwcmlvcml0eSkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHNlbGY7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uY2VIYW5kbGVyKCkge1xyXG4gICAgICAgICAgc2VsZi5vZmYoZXZlbnRzLCBvbmNlSGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgaWYgKG9uY2VIYW5kbGVyLl9fZW1pdHRlclByb3h5KSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvbmNlSGFuZGxlci5fX2VtaXR0ZXJQcm94eTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcclxuICAgICAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBoYW5kbGVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25jZUhhbmRsZXIuX19lbWl0dGVyUHJveHkgPSBoYW5kbGVyO1xyXG4gICAgICAgIHJldHVybiBzZWxmLm9uKGV2ZW50cywgb25jZUhhbmRsZXIsIHByaW9yaXR5KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9uQW55KGhhbmRsZXIsIHByaW9yaXR5KSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gc2VsZjtcclxuICAgICAgICBjb25zdCBtZXRob2QgPSBwcmlvcml0eSA/ICd1bnNoaWZ0JyA6ICdwdXNoJztcclxuXHJcbiAgICAgICAgaWYgKHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XHJcbiAgICAgICAgICBzZWxmLmV2ZW50c0FueUxpc3RlbmVyc1ttZXRob2RdKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvZmZBbnkoaGFuZGxlcikge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICghc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnMpIHJldHVybiBzZWxmO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnMuaW5kZXhPZihoYW5kbGVyKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgIHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9mZihldmVudHMsIGhhbmRsZXIpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoIXNlbGYuZXZlbnRzTGlzdGVuZXJzKSByZXR1cm4gc2VsZjtcclxuICAgICAgICBldmVudHMuc3BsaXQoJyAnKS5mb3JFYWNoKGV2ZW50ID0+IHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdID0gW107XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSkge1xyXG4gICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChldmVudEhhbmRsZXIgPT09IGhhbmRsZXIgfHwgZXZlbnRIYW5kbGVyLl9fZW1pdHRlclByb3h5ICYmIGV2ZW50SGFuZGxlci5fX2VtaXR0ZXJQcm94eSA9PT0gaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGVtaXQoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuIHNlbGY7XHJcbiAgICAgICAgbGV0IGV2ZW50cztcclxuICAgICAgICBsZXQgZGF0YTtcclxuICAgICAgICBsZXQgY29udGV4dDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XHJcbiAgICAgICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoYXJnc1swXSkpIHtcclxuICAgICAgICAgIGV2ZW50cyA9IGFyZ3NbMF07XHJcbiAgICAgICAgICBkYXRhID0gYXJncy5zbGljZSgxLCBhcmdzLmxlbmd0aCk7XHJcbiAgICAgICAgICBjb250ZXh0ID0gc2VsZjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZXZlbnRzID0gYXJnc1swXS5ldmVudHM7XHJcbiAgICAgICAgICBkYXRhID0gYXJnc1swXS5kYXRhO1xyXG4gICAgICAgICAgY29udGV4dCA9IGFyZ3NbMF0uY29udGV4dCB8fCBzZWxmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YS51bnNoaWZ0KGNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50c0FycmF5ID0gQXJyYXkuaXNBcnJheShldmVudHMpID8gZXZlbnRzIDogZXZlbnRzLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgZXZlbnRzQXJyYXkuZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgICAgICBpZiAoc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnMgJiYgc2VsZi5ldmVudHNBbnlMaXN0ZW5lcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzQW55TGlzdGVuZXJzLmZvckVhY2goZXZlbnRIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkoY29udGV4dCwgW2V2ZW50LCAuLi5kYXRhXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzZWxmLmV2ZW50c0xpc3RlbmVycyAmJiBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0pIHtcclxuICAgICAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goZXZlbnRIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkoY29udGV4dCwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVTaXplKCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBsZXQgd2lkdGg7XHJcbiAgICAgIGxldCBoZWlnaHQ7XHJcbiAgICAgIGNvbnN0ICRlbCA9IHN3aXBlci4kZWw7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMud2lkdGggIT09ICd1bmRlZmluZWQnICYmIHN3aXBlci5wYXJhbXMud2lkdGggIT09IG51bGwpIHtcclxuICAgICAgICB3aWR0aCA9IHN3aXBlci5wYXJhbXMud2lkdGg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2lkdGggPSAkZWxbMF0uY2xpZW50V2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygc3dpcGVyLnBhcmFtcy5oZWlnaHQgIT09ICd1bmRlZmluZWQnICYmIHN3aXBlci5wYXJhbXMuaGVpZ2h0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgaGVpZ2h0ID0gc3dpcGVyLnBhcmFtcy5oZWlnaHQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGVpZ2h0ID0gJGVsWzBdLmNsaWVudEhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHdpZHRoID09PSAwICYmIHN3aXBlci5pc0hvcml6b250YWwoKSB8fCBoZWlnaHQgPT09IDAgJiYgc3dpcGVyLmlzVmVydGljYWwoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSAvLyBTdWJ0cmFjdCBwYWRkaW5nc1xyXG5cclxuXHJcbiAgICAgIHdpZHRoID0gd2lkdGggLSBwYXJzZUludCgkZWwuY3NzKCdwYWRkaW5nLWxlZnQnKSB8fCAwLCAxMCkgLSBwYXJzZUludCgkZWwuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCwgMTApO1xyXG4gICAgICBoZWlnaHQgPSBoZWlnaHQgLSBwYXJzZUludCgkZWwuY3NzKCdwYWRkaW5nLXRvcCcpIHx8IDAsIDEwKSAtIHBhcnNlSW50KCRlbC5jc3MoJ3BhZGRpbmctYm90dG9tJykgfHwgMCwgMTApO1xyXG4gICAgICBpZiAoTnVtYmVyLmlzTmFOKHdpZHRoKSkgd2lkdGggPSAwO1xyXG4gICAgICBpZiAoTnVtYmVyLmlzTmFOKGhlaWdodCkpIGhlaWdodCA9IDA7XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XHJcbiAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgIHNpemU6IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHdpZHRoIDogaGVpZ2h0XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlcygpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldERpcmVjdGlvbkxhYmVsKHByb3BlcnR5KSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xyXG4gICAgICAgIH0gLy8gcHJldHRpZXItaWdub3JlXHJcblxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgJ3dpZHRoJzogJ2hlaWdodCcsXHJcbiAgICAgICAgICAnbWFyZ2luLXRvcCc6ICdtYXJnaW4tbGVmdCcsXHJcbiAgICAgICAgICAnbWFyZ2luLWJvdHRvbSAnOiAnbWFyZ2luLXJpZ2h0JyxcclxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdtYXJnaW4tdG9wJyxcclxuICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiAnbWFyZ2luLWJvdHRvbScsXHJcbiAgICAgICAgICAncGFkZGluZy1sZWZ0JzogJ3BhZGRpbmctdG9wJyxcclxuICAgICAgICAgICdwYWRkaW5nLXJpZ2h0JzogJ3BhZGRpbmctYm90dG9tJyxcclxuICAgICAgICAgICdtYXJnaW5SaWdodCc6ICdtYXJnaW5Cb3R0b20nXHJcbiAgICAgICAgfVtwcm9wZXJ0eV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUobm9kZSwgbGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChub2RlLmdldFByb3BlcnR5VmFsdWUoZ2V0RGlyZWN0aW9uTGFiZWwobGFiZWwpKSB8fCAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgICR3cmFwcGVyRWwsXHJcbiAgICAgICAgc2l6ZTogc3dpcGVyU2l6ZSxcclxuICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcclxuICAgICAgICB3cm9uZ1JUTFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBwYXJhbXMudmlydHVhbC5lbmFibGVkO1xyXG4gICAgICBjb25zdCBwcmV2aW91c1NsaWRlc0xlbmd0aCA9IGlzVmlydHVhbCA/IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggOiBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcclxuICAgICAgY29uc3Qgc2xpZGVzID0gJHdyYXBwZXJFbC5jaGlsZHJlbihgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfWApO1xyXG4gICAgICBjb25zdCBzbGlkZXNMZW5ndGggPSBpc1ZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIDogc2xpZGVzLmxlbmd0aDtcclxuICAgICAgbGV0IHNuYXBHcmlkID0gW107XHJcbiAgICAgIGNvbnN0IHNsaWRlc0dyaWQgPSBbXTtcclxuICAgICAgY29uc3Qgc2xpZGVzU2l6ZXNHcmlkID0gW107XHJcbiAgICAgIGxldCBvZmZzZXRCZWZvcmUgPSBwYXJhbXMuc2xpZGVzT2Zmc2V0QmVmb3JlO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBvZmZzZXRCZWZvcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBvZmZzZXRCZWZvcmUgPSBwYXJhbXMuc2xpZGVzT2Zmc2V0QmVmb3JlLmNhbGwoc3dpcGVyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG9mZnNldEFmdGVyID0gcGFyYW1zLnNsaWRlc09mZnNldEFmdGVyO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBvZmZzZXRBZnRlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG9mZnNldEFmdGVyID0gcGFyYW1zLnNsaWRlc09mZnNldEFmdGVyLmNhbGwoc3dpcGVyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcHJldmlvdXNTbmFwR3JpZExlbmd0aCA9IHN3aXBlci5zbmFwR3JpZC5sZW5ndGg7XHJcbiAgICAgIGNvbnN0IHByZXZpb3VzU2xpZGVzR3JpZExlbmd0aCA9IHN3aXBlci5zbGlkZXNHcmlkLmxlbmd0aDtcclxuICAgICAgbGV0IHNwYWNlQmV0d2VlbiA9IHBhcmFtcy5zcGFjZUJldHdlZW47XHJcbiAgICAgIGxldCBzbGlkZVBvc2l0aW9uID0gLW9mZnNldEJlZm9yZTtcclxuICAgICAgbGV0IHByZXZTbGlkZVNpemUgPSAwO1xyXG4gICAgICBsZXQgaW5kZXggPSAwO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBzd2lwZXJTaXplID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBzcGFjZUJldHdlZW4gPT09ICdzdHJpbmcnICYmIHNwYWNlQmV0d2Vlbi5pbmRleE9mKCclJykgPj0gMCkge1xyXG4gICAgICAgIHNwYWNlQmV0d2VlbiA9IHBhcnNlRmxvYXQoc3BhY2VCZXR3ZWVuLnJlcGxhY2UoJyUnLCAnJykpIC8gMTAwICogc3dpcGVyU2l6ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLnZpcnR1YWxTaXplID0gLXNwYWNlQmV0d2VlbjsgLy8gcmVzZXQgbWFyZ2luc1xyXG5cclxuICAgICAgaWYgKHJ0bCkgc2xpZGVzLmNzcyh7XHJcbiAgICAgICAgbWFyZ2luTGVmdDogJycsXHJcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnJyxcclxuICAgICAgICBtYXJnaW5Ub3A6ICcnXHJcbiAgICAgIH0pO2Vsc2Ugc2xpZGVzLmNzcyh7XHJcbiAgICAgICAgbWFyZ2luUmlnaHQ6ICcnLFxyXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJycsXHJcbiAgICAgICAgbWFyZ2luVG9wOiAnJ1xyXG4gICAgICB9KTsgLy8gcmVzZXQgY3NzTW9kZSBvZmZzZXRzXHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgc2V0Q1NTUHJvcGVydHkoc3dpcGVyLndyYXBwZXJFbCwgJy0tc3dpcGVyLWNlbnRlcmVkLW9mZnNldC1iZWZvcmUnLCAnJyk7XHJcbiAgICAgICAgc2V0Q1NTUHJvcGVydHkoc3dpcGVyLndyYXBwZXJFbCwgJy0tc3dpcGVyLWNlbnRlcmVkLW9mZnNldC1hZnRlcicsICcnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZ3JpZEVuYWJsZWQgPSBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMSAmJiBzd2lwZXIuZ3JpZDtcclxuXHJcbiAgICAgIGlmIChncmlkRW5hYmxlZCkge1xyXG4gICAgICAgIHN3aXBlci5ncmlkLmluaXRTbGlkZXMoc2xpZGVzTGVuZ3RoKTtcclxuICAgICAgfSAvLyBDYWxjIHNsaWRlc1xyXG5cclxuXHJcbiAgICAgIGxldCBzbGlkZVNpemU7XHJcbiAgICAgIGNvbnN0IHNob3VsZFJlc2V0U2xpZGVTaXplID0gcGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyAmJiBwYXJhbXMuYnJlYWtwb2ludHMgJiYgT2JqZWN0LmtleXMocGFyYW1zLmJyZWFrcG9pbnRzKS5maWx0ZXIoa2V5ID0+IHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHBhcmFtcy5icmVha3BvaW50c1trZXldLnNsaWRlc1BlclZpZXcgIT09ICd1bmRlZmluZWQnO1xyXG4gICAgICB9KS5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNMZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIHNsaWRlU2l6ZSA9IDA7XHJcbiAgICAgICAgY29uc3Qgc2xpZGUgPSBzbGlkZXMuZXEoaSk7XHJcblxyXG4gICAgICAgIGlmIChncmlkRW5hYmxlZCkge1xyXG4gICAgICAgICAgc3dpcGVyLmdyaWQudXBkYXRlU2xpZGUoaSwgc2xpZGUsIHNsaWRlc0xlbmd0aCwgZ2V0RGlyZWN0aW9uTGFiZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNsaWRlLmNzcygnZGlzcGxheScpID09PSAnbm9uZScpIGNvbnRpbnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgICBpZiAoc2hvdWxkUmVzZXRTbGlkZVNpemUpIHtcclxuICAgICAgICAgICAgc2xpZGVzW2ldLnN0eWxlW2dldERpcmVjdGlvbkxhYmVsKCd3aWR0aCcpXSA9IGBgO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IHNsaWRlU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShzbGlkZVswXSk7XHJcbiAgICAgICAgICBjb25zdCBjdXJyZW50VHJhbnNmb3JtID0gc2xpZGVbMF0uc3R5bGUudHJhbnNmb3JtO1xyXG4gICAgICAgICAgY29uc3QgY3VycmVudFdlYktpdFRyYW5zZm9ybSA9IHNsaWRlWzBdLnN0eWxlLndlYmtpdFRyYW5zZm9ybTtcclxuXHJcbiAgICAgICAgICBpZiAoY3VycmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBzbGlkZVswXS5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGN1cnJlbnRXZWJLaXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgc2xpZGVbMF0uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ25vbmUnO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSB7XHJcbiAgICAgICAgICAgIHNsaWRlU2l6ZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHNsaWRlLm91dGVyV2lkdGgodHJ1ZSkgOiBzbGlkZS5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICd3aWR0aCcpO1xyXG4gICAgICAgICAgICBjb25zdCBwYWRkaW5nTGVmdCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdwYWRkaW5nLWxlZnQnKTtcclxuICAgICAgICAgICAgY29uc3QgcGFkZGluZ1JpZ2h0ID0gZ2V0RGlyZWN0aW9uUHJvcGVydHlWYWx1ZShzbGlkZVN0eWxlcywgJ3BhZGRpbmctcmlnaHQnKTtcclxuICAgICAgICAgICAgY29uc3QgbWFyZ2luTGVmdCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdtYXJnaW4tbGVmdCcpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXJnaW5SaWdodCA9IGdldERpcmVjdGlvblByb3BlcnR5VmFsdWUoc2xpZGVTdHlsZXMsICdtYXJnaW4tcmlnaHQnKTtcclxuICAgICAgICAgICAgY29uc3QgYm94U2l6aW5nID0gc2xpZGVTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnYm94LXNpemluZycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJveFNpemluZyAmJiBib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xyXG4gICAgICAgICAgICAgIHNsaWRlU2l6ZSA9IHdpZHRoICsgbWFyZ2luTGVmdCArIG1hcmdpblJpZ2h0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgICAgIGNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0V2lkdGhcclxuICAgICAgICAgICAgICB9ID0gc2xpZGVbMF07XHJcbiAgICAgICAgICAgICAgc2xpZGVTaXplID0gd2lkdGggKyBwYWRkaW5nTGVmdCArIHBhZGRpbmdSaWdodCArIG1hcmdpbkxlZnQgKyBtYXJnaW5SaWdodCArIChvZmZzZXRXaWR0aCAtIGNsaWVudFdpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChjdXJyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHNsaWRlWzBdLnN0eWxlLnRyYW5zZm9ybSA9IGN1cnJlbnRUcmFuc2Zvcm07XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGN1cnJlbnRXZWJLaXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgc2xpZGVbMF0uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gY3VycmVudFdlYktpdFRyYW5zZm9ybTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVTaXplID0gTWF0aC5mbG9vcihzbGlkZVNpemUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzbGlkZVNpemUgPSAoc3dpcGVyU2l6ZSAtIChwYXJhbXMuc2xpZGVzUGVyVmlldyAtIDEpICogc3BhY2VCZXR3ZWVuKSAvIHBhcmFtcy5zbGlkZXNQZXJWaWV3O1xyXG4gICAgICAgICAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHNsaWRlU2l6ZSA9IE1hdGguZmxvb3Ioc2xpZGVTaXplKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2xpZGVzW2ldKSB7XHJcbiAgICAgICAgICAgIHNsaWRlc1tpXS5zdHlsZVtnZXREaXJlY3Rpb25MYWJlbCgnd2lkdGgnKV0gPSBgJHtzbGlkZVNpemV9cHhgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNsaWRlc1tpXSkge1xyXG4gICAgICAgICAgc2xpZGVzW2ldLnN3aXBlclNsaWRlU2l6ZSA9IHNsaWRlU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNsaWRlc1NpemVzR3JpZC5wdXNoKHNsaWRlU2l6ZSk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcclxuICAgICAgICAgIHNsaWRlUG9zaXRpb24gPSBzbGlkZVBvc2l0aW9uICsgc2xpZGVTaXplIC8gMiArIHByZXZTbGlkZVNpemUgLyAyICsgc3BhY2VCZXR3ZWVuO1xyXG4gICAgICAgICAgaWYgKHByZXZTbGlkZVNpemUgPT09IDAgJiYgaSAhPT0gMCkgc2xpZGVQb3NpdGlvbiA9IHNsaWRlUG9zaXRpb24gLSBzd2lwZXJTaXplIC8gMiAtIHNwYWNlQmV0d2VlbjtcclxuICAgICAgICAgIGlmIChpID09PSAwKSBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiAtIHN3aXBlclNpemUgLyAyIC0gc3BhY2VCZXR3ZWVuO1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHNsaWRlUG9zaXRpb24pIDwgMSAvIDEwMDApIHNsaWRlUG9zaXRpb24gPSAwO1xyXG4gICAgICAgICAgaWYgKHBhcmFtcy5yb3VuZExlbmd0aHMpIHNsaWRlUG9zaXRpb24gPSBNYXRoLmZsb29yKHNsaWRlUG9zaXRpb24pO1xyXG4gICAgICAgICAgaWYgKGluZGV4ICUgcGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAwKSBzbmFwR3JpZC5wdXNoKHNsaWRlUG9zaXRpb24pO1xyXG4gICAgICAgICAgc2xpZGVzR3JpZC5wdXNoKHNsaWRlUG9zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAocGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVQb3NpdGlvbiA9IE1hdGguZmxvb3Ioc2xpZGVQb3NpdGlvbik7XHJcbiAgICAgICAgICBpZiAoKGluZGV4IC0gTWF0aC5taW4oc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAsIGluZGV4KSkgJSBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAwKSBzbmFwR3JpZC5wdXNoKHNsaWRlUG9zaXRpb24pO1xyXG4gICAgICAgICAgc2xpZGVzR3JpZC5wdXNoKHNsaWRlUG9zaXRpb24pO1xyXG4gICAgICAgICAgc2xpZGVQb3NpdGlvbiA9IHNsaWRlUG9zaXRpb24gKyBzbGlkZVNpemUgKyBzcGFjZUJldHdlZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIudmlydHVhbFNpemUgKz0gc2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuO1xyXG4gICAgICAgIHByZXZTbGlkZVNpemUgPSBzbGlkZVNpemU7XHJcbiAgICAgICAgaW5kZXggKz0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLnZpcnR1YWxTaXplID0gTWF0aC5tYXgoc3dpcGVyLnZpcnR1YWxTaXplLCBzd2lwZXJTaXplKSArIG9mZnNldEFmdGVyO1xyXG5cclxuICAgICAgaWYgKHJ0bCAmJiB3cm9uZ1JUTCAmJiAocGFyYW1zLmVmZmVjdCA9PT0gJ3NsaWRlJyB8fCBwYXJhbXMuZWZmZWN0ID09PSAnY292ZXJmbG93JykpIHtcclxuICAgICAgICAkd3JhcHBlckVsLmNzcyh7XHJcbiAgICAgICAgICB3aWR0aDogYCR7c3dpcGVyLnZpcnR1YWxTaXplICsgcGFyYW1zLnNwYWNlQmV0d2Vlbn1weGBcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5zZXRXcmFwcGVyU2l6ZSkge1xyXG4gICAgICAgICR3cmFwcGVyRWwuY3NzKHtcclxuICAgICAgICAgIFtnZXREaXJlY3Rpb25MYWJlbCgnd2lkdGgnKV06IGAke3N3aXBlci52aXJ0dWFsU2l6ZSArIHBhcmFtcy5zcGFjZUJldHdlZW59cHhgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChncmlkRW5hYmxlZCkge1xyXG4gICAgICAgIHN3aXBlci5ncmlkLnVwZGF0ZVdyYXBwZXJTaXplKHNsaWRlU2l6ZSwgc25hcEdyaWQsIGdldERpcmVjdGlvbkxhYmVsKTtcclxuICAgICAgfSAvLyBSZW1vdmUgbGFzdCBncmlkIGVsZW1lbnRzIGRlcGVuZGluZyBvbiB3aWR0aFxyXG5cclxuXHJcbiAgICAgIGlmICghcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2xpZGVzR3JpZCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNuYXBHcmlkLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBsZXQgc2xpZGVzR3JpZEl0ZW0gPSBzbmFwR3JpZFtpXTtcclxuICAgICAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZXNHcmlkSXRlbSA9IE1hdGguZmxvb3Ioc2xpZGVzR3JpZEl0ZW0pO1xyXG5cclxuICAgICAgICAgIGlmIChzbmFwR3JpZFtpXSA8PSBzd2lwZXIudmlydHVhbFNpemUgLSBzd2lwZXJTaXplKSB7XHJcbiAgICAgICAgICAgIG5ld1NsaWRlc0dyaWQucHVzaChzbGlkZXNHcmlkSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzbmFwR3JpZCA9IG5ld1NsaWRlc0dyaWQ7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmZsb29yKHN3aXBlci52aXJ0dWFsU2l6ZSAtIHN3aXBlclNpemUpIC0gTWF0aC5mbG9vcihzbmFwR3JpZFtzbmFwR3JpZC5sZW5ndGggLSAxXSkgPiAxKSB7XHJcbiAgICAgICAgICBzbmFwR3JpZC5wdXNoKHN3aXBlci52aXJ0dWFsU2l6ZSAtIHN3aXBlclNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNuYXBHcmlkLmxlbmd0aCA9PT0gMCkgc25hcEdyaWQgPSBbMF07XHJcblxyXG4gICAgICBpZiAocGFyYW1zLnNwYWNlQmV0d2VlbiAhPT0gMCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IHN3aXBlci5pc0hvcml6b250YWwoKSAmJiBydGwgPyAnbWFyZ2luTGVmdCcgOiBnZXREaXJlY3Rpb25MYWJlbCgnbWFyZ2luUmlnaHQnKTtcclxuICAgICAgICBzbGlkZXMuZmlsdGVyKChfLCBzbGlkZUluZGV4KSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXBhcmFtcy5jc3NNb2RlKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgICBpZiAoc2xpZGVJbmRleCA9PT0gc2xpZGVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pLmNzcyh7XHJcbiAgICAgICAgICBba2V5XTogYCR7c3BhY2VCZXR3ZWVufXB4YFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlc0JvdW5kcykge1xyXG4gICAgICAgIGxldCBhbGxTbGlkZXNTaXplID0gMDtcclxuICAgICAgICBzbGlkZXNTaXplc0dyaWQuZm9yRWFjaChzbGlkZVNpemVWYWx1ZSA9PiB7XHJcbiAgICAgICAgICBhbGxTbGlkZXNTaXplICs9IHNsaWRlU2l6ZVZhbHVlICsgKHBhcmFtcy5zcGFjZUJldHdlZW4gPyBwYXJhbXMuc3BhY2VCZXR3ZWVuIDogMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYWxsU2xpZGVzU2l6ZSAtPSBwYXJhbXMuc3BhY2VCZXR3ZWVuO1xyXG4gICAgICAgIGNvbnN0IG1heFNuYXAgPSBhbGxTbGlkZXNTaXplIC0gc3dpcGVyU2l6ZTtcclxuICAgICAgICBzbmFwR3JpZCA9IHNuYXBHcmlkLm1hcChzbmFwID0+IHtcclxuICAgICAgICAgIGlmIChzbmFwIDwgMCkgcmV0dXJuIC1vZmZzZXRCZWZvcmU7XHJcbiAgICAgICAgICBpZiAoc25hcCA+IG1heFNuYXApIHJldHVybiBtYXhTbmFwICsgb2Zmc2V0QWZ0ZXI7XHJcbiAgICAgICAgICByZXR1cm4gc25hcDtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5jZW50ZXJJbnN1ZmZpY2llbnRTbGlkZXMpIHtcclxuICAgICAgICBsZXQgYWxsU2xpZGVzU2l6ZSA9IDA7XHJcbiAgICAgICAgc2xpZGVzU2l6ZXNHcmlkLmZvckVhY2goc2xpZGVTaXplVmFsdWUgPT4ge1xyXG4gICAgICAgICAgYWxsU2xpZGVzU2l6ZSArPSBzbGlkZVNpemVWYWx1ZSArIChwYXJhbXMuc3BhY2VCZXR3ZWVuID8gcGFyYW1zLnNwYWNlQmV0d2VlbiA6IDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFsbFNsaWRlc1NpemUgLT0gcGFyYW1zLnNwYWNlQmV0d2VlbjtcclxuXHJcbiAgICAgICAgaWYgKGFsbFNsaWRlc1NpemUgPCBzd2lwZXJTaXplKSB7XHJcbiAgICAgICAgICBjb25zdCBhbGxTbGlkZXNPZmZzZXQgPSAoc3dpcGVyU2l6ZSAtIGFsbFNsaWRlc1NpemUpIC8gMjtcclxuICAgICAgICAgIHNuYXBHcmlkLmZvckVhY2goKHNuYXAsIHNuYXBJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBzbmFwR3JpZFtzbmFwSW5kZXhdID0gc25hcCAtIGFsbFNsaWRlc09mZnNldDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2xpZGVzR3JpZC5mb3JFYWNoKChzbmFwLCBzbmFwSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgc2xpZGVzR3JpZFtzbmFwSW5kZXhdID0gc25hcCArIGFsbFNsaWRlc09mZnNldDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcclxuICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgc25hcEdyaWQsXHJcbiAgICAgICAgc2xpZGVzR3JpZCxcclxuICAgICAgICBzbGlkZXNTaXplc0dyaWRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNlbnRlcmVkU2xpZGVzICYmIHBhcmFtcy5jc3NNb2RlICYmICFwYXJhbXMuY2VudGVyZWRTbGlkZXNCb3VuZHMpIHtcclxuICAgICAgICBzZXRDU1NQcm9wZXJ0eShzd2lwZXIud3JhcHBlckVsLCAnLS1zd2lwZXItY2VudGVyZWQtb2Zmc2V0LWJlZm9yZScsIGAkey1zbmFwR3JpZFswXX1weGApO1xyXG4gICAgICAgIHNldENTU1Byb3BlcnR5KHN3aXBlci53cmFwcGVyRWwsICctLXN3aXBlci1jZW50ZXJlZC1vZmZzZXQtYWZ0ZXInLCBgJHtzd2lwZXIuc2l6ZSAvIDIgLSBzbGlkZXNTaXplc0dyaWRbc2xpZGVzU2l6ZXNHcmlkLmxlbmd0aCAtIDFdIC8gMn1weGApO1xyXG4gICAgICAgIGNvbnN0IGFkZFRvU25hcEdyaWQgPSAtc3dpcGVyLnNuYXBHcmlkWzBdO1xyXG4gICAgICAgIGNvbnN0IGFkZFRvU2xpZGVzR3JpZCA9IC1zd2lwZXIuc2xpZGVzR3JpZFswXTtcclxuICAgICAgICBzd2lwZXIuc25hcEdyaWQgPSBzd2lwZXIuc25hcEdyaWQubWFwKHYgPT4gdiArIGFkZFRvU25hcEdyaWQpO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZXNHcmlkID0gc3dpcGVyLnNsaWRlc0dyaWQubWFwKHYgPT4gdiArIGFkZFRvU2xpZGVzR3JpZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzbGlkZXNMZW5ndGggIT09IHByZXZpb3VzU2xpZGVzTGVuZ3RoKSB7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ3NsaWRlc0xlbmd0aENoYW5nZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc25hcEdyaWQubGVuZ3RoICE9PSBwcmV2aW91c1NuYXBHcmlkTGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdykgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnc25hcEdyaWRMZW5ndGhDaGFuZ2UnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNsaWRlc0dyaWQubGVuZ3RoICE9PSBwcmV2aW91c1NsaWRlc0dyaWRMZW5ndGgpIHtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnc2xpZGVzR3JpZExlbmd0aENoYW5nZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MpIHtcclxuICAgICAgICBzd2lwZXIudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghaXNWaXJ0dWFsICYmICFwYXJhbXMuY3NzTW9kZSAmJiAocGFyYW1zLmVmZmVjdCA9PT0gJ3NsaWRlJyB8fCBwYXJhbXMuZWZmZWN0ID09PSAnZmFkZScpKSB7XHJcbiAgICAgICAgY29uc3QgYmFja0ZhY2VIaWRkZW5DbGFzcyA9IGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWJhY2tmYWNlLWhpZGRlbmA7XHJcbiAgICAgICAgY29uc3QgaGFzQ2xhc3NCYWNrZmFjZUNsYXNzQWRkZWQgPSBzd2lwZXIuJGVsLmhhc0NsYXNzKGJhY2tGYWNlSGlkZGVuQ2xhc3MpO1xyXG5cclxuICAgICAgICBpZiAoc2xpZGVzTGVuZ3RoIDw9IHBhcmFtcy5tYXhCYWNrZmFjZUhpZGRlblNsaWRlcykge1xyXG4gICAgICAgICAgaWYgKCFoYXNDbGFzc0JhY2tmYWNlQ2xhc3NBZGRlZCkgc3dpcGVyLiRlbC5hZGRDbGFzcyhiYWNrRmFjZUhpZGRlbkNsYXNzKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGhhc0NsYXNzQmFja2ZhY2VDbGFzc0FkZGVkKSB7XHJcbiAgICAgICAgICBzd2lwZXIuJGVsLnJlbW92ZUNsYXNzKGJhY2tGYWNlSGlkZGVuQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUF1dG9IZWlnaHQoc3BlZWQpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3QgYWN0aXZlU2xpZGVzID0gW107XHJcbiAgICAgIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkO1xyXG4gICAgICBsZXQgbmV3SGVpZ2h0ID0gMDtcclxuICAgICAgbGV0IGk7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHNwZWVkID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHNwZWVkKTtcclxuICAgICAgfSBlbHNlIGlmIChzcGVlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHN3aXBlci5wYXJhbXMuc3BlZWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBnZXRTbGlkZUJ5SW5kZXggPSBpbmRleCA9PiB7XHJcbiAgICAgICAgaWYgKGlzVmlydHVhbCkge1xyXG4gICAgICAgICAgcmV0dXJuIHN3aXBlci5zbGlkZXMuZmlsdGVyKGVsID0+IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApID09PSBpbmRleClbMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3dpcGVyLnNsaWRlcy5lcShpbmRleClbMF07XHJcbiAgICAgIH07IC8vIEZpbmQgc2xpZGVzIGN1cnJlbnRseSBpbiB2aWV3XHJcblxyXG5cclxuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyAhPT0gJ2F1dG8nICYmIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpIHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xyXG4gICAgICAgICAgc3dpcGVyLnZpc2libGVTbGlkZXMuZWFjaChzbGlkZSA9PiB7XHJcbiAgICAgICAgICAgIGFjdGl2ZVNsaWRlcy5wdXNoKHNsaWRlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgTWF0aC5jZWlsKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyk7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleCArIGk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IHN3aXBlci5zbGlkZXMubGVuZ3RoICYmICFpc1ZpcnR1YWwpIGJyZWFrO1xyXG4gICAgICAgICAgICBhY3RpdmVTbGlkZXMucHVzaChnZXRTbGlkZUJ5SW5kZXgoaW5kZXgpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWN0aXZlU2xpZGVzLnB1c2goZ2V0U2xpZGVCeUluZGV4KHN3aXBlci5hY3RpdmVJbmRleCkpO1xyXG4gICAgICB9IC8vIEZpbmQgbmV3IGhlaWdodCBmcm9tIGhpZ2hlc3Qgc2xpZGUgaW4gdmlld1xyXG5cclxuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY3RpdmVTbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFjdGl2ZVNsaWRlc1tpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnN0IGhlaWdodCA9IGFjdGl2ZVNsaWRlc1tpXS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICBuZXdIZWlnaHQgPSBoZWlnaHQgPiBuZXdIZWlnaHQgPyBoZWlnaHQgOiBuZXdIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IC8vIFVwZGF0ZSBIZWlnaHRcclxuXHJcblxyXG4gICAgICBpZiAobmV3SGVpZ2h0IHx8IG5ld0hlaWdodCA9PT0gMCkgc3dpcGVyLiR3cmFwcGVyRWwuY3NzKCdoZWlnaHQnLCBgJHtuZXdIZWlnaHR9cHhgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVTbGlkZXNPZmZzZXQoKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHNsaWRlcyA9IHN3aXBlci5zbGlkZXM7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIHNsaWRlc1tpXS5zd2lwZXJTbGlkZU9mZnNldCA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHNsaWRlc1tpXS5vZmZzZXRMZWZ0IDogc2xpZGVzW2ldLm9mZnNldFRvcDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlc1Byb2dyZXNzKHRyYW5zbGF0ZSkge1xyXG4gICAgICBpZiAodHJhbnNsYXRlID09PSB2b2lkIDApIHtcclxuICAgICAgICB0cmFuc2xhdGUgPSB0aGlzICYmIHRoaXMudHJhbnNsYXRlIHx8IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgcnRsVHJhbnNsYXRlOiBydGwsXHJcbiAgICAgICAgc25hcEdyaWRcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgaWYgKHR5cGVvZiBzbGlkZXNbMF0uc3dpcGVyU2xpZGVPZmZzZXQgPT09ICd1bmRlZmluZWQnKSBzd2lwZXIudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XHJcbiAgICAgIGxldCBvZmZzZXRDZW50ZXIgPSAtdHJhbnNsYXRlO1xyXG4gICAgICBpZiAocnRsKSBvZmZzZXRDZW50ZXIgPSB0cmFuc2xhdGU7IC8vIFZpc2libGUgU2xpZGVzXHJcblxyXG4gICAgICBzbGlkZXMucmVtb3ZlQ2xhc3MocGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzKTtcclxuICAgICAgc3dpcGVyLnZpc2libGVTbGlkZXNJbmRleGVzID0gW107XHJcbiAgICAgIHN3aXBlci52aXNpYmxlU2xpZGVzID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IHNsaWRlID0gc2xpZGVzW2ldO1xyXG4gICAgICAgIGxldCBzbGlkZU9mZnNldCA9IHNsaWRlLnN3aXBlclNsaWRlT2Zmc2V0O1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmNzc01vZGUgJiYgcGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XHJcbiAgICAgICAgICBzbGlkZU9mZnNldCAtPSBzbGlkZXNbMF0uc3dpcGVyU2xpZGVPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzbGlkZVByb2dyZXNzID0gKG9mZnNldENlbnRlciArIChwYXJhbXMuY2VudGVyZWRTbGlkZXMgPyBzd2lwZXIubWluVHJhbnNsYXRlKCkgOiAwKSAtIHNsaWRlT2Zmc2V0KSAvIChzbGlkZS5zd2lwZXJTbGlkZVNpemUgKyBwYXJhbXMuc3BhY2VCZXR3ZWVuKTtcclxuICAgICAgICBjb25zdCBvcmlnaW5hbFNsaWRlUHJvZ3Jlc3MgPSAob2Zmc2V0Q2VudGVyIC0gc25hcEdyaWRbMF0gKyAocGFyYW1zLmNlbnRlcmVkU2xpZGVzID8gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIDogMCkgLSBzbGlkZU9mZnNldCkgLyAoc2xpZGUuc3dpcGVyU2xpZGVTaXplICsgcGFyYW1zLnNwYWNlQmV0d2Vlbik7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVCZWZvcmUgPSAtKG9mZnNldENlbnRlciAtIHNsaWRlT2Zmc2V0KTtcclxuICAgICAgICBjb25zdCBzbGlkZUFmdGVyID0gc2xpZGVCZWZvcmUgKyBzd2lwZXIuc2xpZGVzU2l6ZXNHcmlkW2ldO1xyXG4gICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHNsaWRlQmVmb3JlID49IDAgJiYgc2xpZGVCZWZvcmUgPCBzd2lwZXIuc2l6ZSAtIDEgfHwgc2xpZGVBZnRlciA+IDEgJiYgc2xpZGVBZnRlciA8PSBzd2lwZXIuc2l6ZSB8fCBzbGlkZUJlZm9yZSA8PSAwICYmIHNsaWRlQWZ0ZXIgPj0gc3dpcGVyLnNpemU7XHJcblxyXG4gICAgICAgIGlmIChpc1Zpc2libGUpIHtcclxuICAgICAgICAgIHN3aXBlci52aXNpYmxlU2xpZGVzLnB1c2goc2xpZGUpO1xyXG4gICAgICAgICAgc3dpcGVyLnZpc2libGVTbGlkZXNJbmRleGVzLnB1c2goaSk7XHJcbiAgICAgICAgICBzbGlkZXMuZXEoaSkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNsaWRlLnByb2dyZXNzID0gcnRsID8gLXNsaWRlUHJvZ3Jlc3MgOiBzbGlkZVByb2dyZXNzO1xyXG4gICAgICAgIHNsaWRlLm9yaWdpbmFsUHJvZ3Jlc3MgPSBydGwgPyAtb3JpZ2luYWxTbGlkZVByb2dyZXNzIDogb3JpZ2luYWxTbGlkZVByb2dyZXNzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIudmlzaWJsZVNsaWRlcyA9ICQoc3dpcGVyLnZpc2libGVTbGlkZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVByb2dyZXNzKHRyYW5zbGF0ZSkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0cmFuc2xhdGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyAtMSA6IDE7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG5cclxuICAgICAgICB0cmFuc2xhdGUgPSBzd2lwZXIgJiYgc3dpcGVyLnRyYW5zbGF0ZSAmJiBzd2lwZXIudHJhbnNsYXRlICogbXVsdGlwbGllciB8fCAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBwcm9ncmVzcyxcclxuICAgICAgICBpc0JlZ2lubmluZyxcclxuICAgICAgICBpc0VuZFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBjb25zdCB3YXNCZWdpbm5pbmcgPSBpc0JlZ2lubmluZztcclxuICAgICAgY29uc3Qgd2FzRW5kID0gaXNFbmQ7XHJcblxyXG4gICAgICBpZiAodHJhbnNsYXRlc0RpZmYgPT09IDApIHtcclxuICAgICAgICBwcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgaXNCZWdpbm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIGlzRW5kID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcm9ncmVzcyA9ICh0cmFuc2xhdGUgLSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIC8gdHJhbnNsYXRlc0RpZmY7XHJcbiAgICAgICAgaXNCZWdpbm5pbmcgPSBwcm9ncmVzcyA8PSAwO1xyXG4gICAgICAgIGlzRW5kID0gcHJvZ3Jlc3MgPj0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcclxuICAgICAgICBwcm9ncmVzcyxcclxuICAgICAgICBpc0JlZ2lubmluZyxcclxuICAgICAgICBpc0VuZFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKHBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzIHx8IHBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBwYXJhbXMuYXV0b0hlaWdodCkgc3dpcGVyLnVwZGF0ZVNsaWRlc1Byb2dyZXNzKHRyYW5zbGF0ZSk7XHJcblxyXG4gICAgICBpZiAoaXNCZWdpbm5pbmcgJiYgIXdhc0JlZ2lubmluZykge1xyXG4gICAgICAgIHN3aXBlci5lbWl0KCdyZWFjaEJlZ2lubmluZyB0b0VkZ2UnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzRW5kICYmICF3YXNFbmQpIHtcclxuICAgICAgICBzd2lwZXIuZW1pdCgncmVhY2hFbmQgdG9FZGdlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh3YXNCZWdpbm5pbmcgJiYgIWlzQmVnaW5uaW5nIHx8IHdhc0VuZCAmJiAhaXNFbmQpIHtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnZnJvbUVkZ2UnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLmVtaXQoJ3Byb2dyZXNzJywgcHJvZ3Jlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlc0NsYXNzZXMoKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgICR3cmFwcGVyRWwsXHJcbiAgICAgICAgYWN0aXZlSW5kZXgsXHJcbiAgICAgICAgcmVhbEluZGV4XHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgIGNvbnN0IGlzVmlydHVhbCA9IHN3aXBlci52aXJ0dWFsICYmIHBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XHJcbiAgICAgIHNsaWRlcy5yZW1vdmVDbGFzcyhgJHtwYXJhbXMuc2xpZGVBY3RpdmVDbGFzc30gJHtwYXJhbXMuc2xpZGVOZXh0Q2xhc3N9ICR7cGFyYW1zLnNsaWRlUHJldkNsYXNzfSAke3BhcmFtcy5zbGlkZUR1cGxpY2F0ZUFjdGl2ZUNsYXNzfSAke3BhcmFtcy5zbGlkZUR1cGxpY2F0ZU5leHRDbGFzc30gJHtwYXJhbXMuc2xpZGVEdXBsaWNhdGVQcmV2Q2xhc3N9YCk7XHJcbiAgICAgIGxldCBhY3RpdmVTbGlkZTtcclxuXHJcbiAgICAgIGlmIChpc1ZpcnR1YWwpIHtcclxuICAgICAgICBhY3RpdmVTbGlkZSA9IHN3aXBlci4kd3JhcHBlckVsLmZpbmQoYC4ke3BhcmFtcy5zbGlkZUNsYXNzfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7YWN0aXZlSW5kZXh9XCJdYCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWN0aXZlU2xpZGUgPSBzbGlkZXMuZXEoYWN0aXZlSW5kZXgpO1xyXG4gICAgICB9IC8vIEFjdGl2ZSBjbGFzc2VzXHJcblxyXG5cclxuICAgICAgYWN0aXZlU2xpZGUuYWRkQ2xhc3MocGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MpO1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgLy8gRHVwbGljYXRlIHRvIGFsbCBsb29wZWQgc2xpZGVzXHJcbiAgICAgICAgaWYgKGFjdGl2ZVNsaWRlLmhhc0NsYXNzKHBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzKSkge1xyXG4gICAgICAgICAgJHdyYXBwZXJFbC5jaGlsZHJlbihgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9Om5vdCguJHtwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzc30pW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtyZWFsSW5kZXh9XCJdYCkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlRHVwbGljYXRlQWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkd3JhcHBlckVsLmNoaWxkcmVuKGAuJHtwYXJhbXMuc2xpZGVDbGFzc30uJHtwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzc31bZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3JlYWxJbmRleH1cIl1gKS5hZGRDbGFzcyhwYXJhbXMuc2xpZGVEdXBsaWNhdGVBY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IC8vIE5leHQgU2xpZGVcclxuXHJcblxyXG4gICAgICBsZXQgbmV4dFNsaWRlID0gYWN0aXZlU2xpZGUubmV4dEFsbChgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9YCkuZXEoMCkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlTmV4dENsYXNzKTtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCAmJiBuZXh0U2xpZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzLmVxKDApO1xyXG4gICAgICAgIG5leHRTbGlkZS5hZGRDbGFzcyhwYXJhbXMuc2xpZGVOZXh0Q2xhc3MpO1xyXG4gICAgICB9IC8vIFByZXYgU2xpZGVcclxuXHJcblxyXG4gICAgICBsZXQgcHJldlNsaWRlID0gYWN0aXZlU2xpZGUucHJldkFsbChgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9YCkuZXEoMCkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCAmJiBwcmV2U2xpZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcHJldlNsaWRlID0gc2xpZGVzLmVxKC0xKTtcclxuICAgICAgICBwcmV2U2xpZGUuYWRkQ2xhc3MocGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgLy8gRHVwbGljYXRlIHRvIGFsbCBsb29wZWQgc2xpZGVzXHJcbiAgICAgICAgaWYgKG5leHRTbGlkZS5oYXNDbGFzcyhwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpIHtcclxuICAgICAgICAgICR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3BhcmFtcy5zbGlkZUNsYXNzfTpub3QoLiR7cGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3N9KVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7bmV4dFNsaWRlLmF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyl9XCJdYCkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlRHVwbGljYXRlTmV4dENsYXNzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHdyYXBwZXJFbC5jaGlsZHJlbihgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LiR7cGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3N9W2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtuZXh0U2xpZGUuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKX1cIl1gKS5hZGRDbGFzcyhwYXJhbXMuc2xpZGVEdXBsaWNhdGVOZXh0Q2xhc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByZXZTbGlkZS5oYXNDbGFzcyhwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpIHtcclxuICAgICAgICAgICR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3BhcmFtcy5zbGlkZUNsYXNzfTpub3QoLiR7cGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3N9KVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7cHJldlNsaWRlLmF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyl9XCJdYCkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlRHVwbGljYXRlUHJldkNsYXNzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHdyYXBwZXJFbC5jaGlsZHJlbihgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LiR7cGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3N9W2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtwcmV2U2xpZGUuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKX1cIl1gKS5hZGRDbGFzcyhwYXJhbXMuc2xpZGVEdXBsaWNhdGVQcmV2Q2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLmVtaXRTbGlkZXNDbGFzc2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlQWN0aXZlSW5kZXgobmV3QWN0aXZlSW5kZXgpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHNsaWRlc0dyaWQsXHJcbiAgICAgICAgc25hcEdyaWQsXHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgIGFjdGl2ZUluZGV4OiBwcmV2aW91c0luZGV4LFxyXG4gICAgICAgIHJlYWxJbmRleDogcHJldmlvdXNSZWFsSW5kZXgsXHJcbiAgICAgICAgc25hcEluZGV4OiBwcmV2aW91c1NuYXBJbmRleFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBsZXQgYWN0aXZlSW5kZXggPSBuZXdBY3RpdmVJbmRleDtcclxuICAgICAgbGV0IHNuYXBJbmRleDtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgYWN0aXZlSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNHcmlkLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHNsaWRlc0dyaWRbaSArIDFdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZiAodHJhbnNsYXRlID49IHNsaWRlc0dyaWRbaV0gJiYgdHJhbnNsYXRlIDwgc2xpZGVzR3JpZFtpICsgMV0gLSAoc2xpZGVzR3JpZFtpICsgMV0gLSBzbGlkZXNHcmlkW2ldKSAvIDIpIHtcclxuICAgICAgICAgICAgICBhY3RpdmVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHJhbnNsYXRlID49IHNsaWRlc0dyaWRbaV0gJiYgdHJhbnNsYXRlIDwgc2xpZGVzR3JpZFtpICsgMV0pIHtcclxuICAgICAgICAgICAgICBhY3RpdmVJbmRleCA9IGkgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zbGF0ZSA+PSBzbGlkZXNHcmlkW2ldKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUluZGV4ID0gaTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIE5vcm1hbGl6ZSBzbGlkZUluZGV4XHJcblxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLm5vcm1hbGl6ZVNsaWRlSW5kZXgpIHtcclxuICAgICAgICAgIGlmIChhY3RpdmVJbmRleCA8IDAgfHwgdHlwZW9mIGFjdGl2ZUluZGV4ID09PSAndW5kZWZpbmVkJykgYWN0aXZlSW5kZXggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNuYXBHcmlkLmluZGV4T2YodHJhbnNsYXRlKSA+PSAwKSB7XHJcbiAgICAgICAgc25hcEluZGV4ID0gc25hcEdyaWQuaW5kZXhPZih0cmFuc2xhdGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHNraXAgPSBNYXRoLm1pbihwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwLCBhY3RpdmVJbmRleCk7XHJcbiAgICAgICAgc25hcEluZGV4ID0gc2tpcCArIE1hdGguZmxvb3IoKGFjdGl2ZUluZGV4IC0gc2tpcCkgLyBwYXJhbXMuc2xpZGVzUGVyR3JvdXApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc25hcEluZGV4ID49IHNuYXBHcmlkLmxlbmd0aCkgc25hcEluZGV4ID0gc25hcEdyaWQubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAgIGlmIChhY3RpdmVJbmRleCA9PT0gcHJldmlvdXNJbmRleCkge1xyXG4gICAgICAgIGlmIChzbmFwSW5kZXggIT09IHByZXZpb3VzU25hcEluZGV4KSB7XHJcbiAgICAgICAgICBzd2lwZXIuc25hcEluZGV4ID0gc25hcEluZGV4O1xyXG4gICAgICAgICAgc3dpcGVyLmVtaXQoJ3NuYXBJbmRleENoYW5nZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9IC8vIEdldCByZWFsIGluZGV4XHJcblxyXG5cclxuICAgICAgY29uc3QgcmVhbEluZGV4ID0gcGFyc2VJbnQoc3dpcGVyLnNsaWRlcy5lcShhY3RpdmVJbmRleCkuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSB8fCBhY3RpdmVJbmRleCwgMTApO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xyXG4gICAgICAgIHNuYXBJbmRleCxcclxuICAgICAgICByZWFsSW5kZXgsXHJcbiAgICAgICAgcHJldmlvdXNJbmRleCxcclxuICAgICAgICBhY3RpdmVJbmRleFxyXG4gICAgICB9KTtcclxuICAgICAgc3dpcGVyLmVtaXQoJ2FjdGl2ZUluZGV4Q2hhbmdlJyk7XHJcbiAgICAgIHN3aXBlci5lbWl0KCdzbmFwSW5kZXhDaGFuZ2UnKTtcclxuXHJcbiAgICAgIGlmIChwcmV2aW91c1JlYWxJbmRleCAhPT0gcmVhbEluZGV4KSB7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ3JlYWxJbmRleENoYW5nZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLmluaXRpYWxpemVkIHx8IHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0KSB7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ3NsaWRlQ2hhbmdlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVDbGlja2VkU2xpZGUoZSkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICBjb25zdCBzbGlkZSA9ICQoZSkuY2xvc2VzdChgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9YClbMF07XHJcbiAgICAgIGxldCBzbGlkZUZvdW5kID0gZmFsc2U7XHJcbiAgICAgIGxldCBzbGlkZUluZGV4O1xyXG5cclxuICAgICAgaWYgKHNsaWRlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzd2lwZXIuc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnNsaWRlc1tpXSA9PT0gc2xpZGUpIHtcclxuICAgICAgICAgICAgc2xpZGVGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzbGlkZSAmJiBzbGlkZUZvdW5kKSB7XHJcbiAgICAgICAgc3dpcGVyLmNsaWNrZWRTbGlkZSA9IHNsaWRlO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHtcclxuICAgICAgICAgIHN3aXBlci5jbGlja2VkSW5kZXggPSBwYXJzZUludCgkKHNsaWRlKS5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3aXBlci5jbGlja2VkSW5kZXggPSBzbGlkZUluZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2lwZXIuY2xpY2tlZFNsaWRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHN3aXBlci5jbGlja2VkSW5kZXggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLnNsaWRlVG9DbGlja2VkU2xpZGUgJiYgc3dpcGVyLmNsaWNrZWRJbmRleCAhPT0gdW5kZWZpbmVkICYmIHN3aXBlci5jbGlja2VkSW5kZXggIT09IHN3aXBlci5hY3RpdmVJbmRleCkge1xyXG4gICAgICAgIHN3aXBlci5zbGlkZVRvQ2xpY2tlZFNsaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgdXBkYXRlID0ge1xyXG4gICAgICB1cGRhdGVTaXplLFxyXG4gICAgICB1cGRhdGVTbGlkZXMsXHJcbiAgICAgIHVwZGF0ZUF1dG9IZWlnaHQsXHJcbiAgICAgIHVwZGF0ZVNsaWRlc09mZnNldCxcclxuICAgICAgdXBkYXRlU2xpZGVzUHJvZ3Jlc3MsXHJcbiAgICAgIHVwZGF0ZVByb2dyZXNzLFxyXG4gICAgICB1cGRhdGVTbGlkZXNDbGFzc2VzLFxyXG4gICAgICB1cGRhdGVBY3RpdmVJbmRleCxcclxuICAgICAgdXBkYXRlQ2xpY2tlZFNsaWRlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFN3aXBlclRyYW5zbGF0ZShheGlzKSB7XHJcbiAgICAgIGlmIChheGlzID09PSB2b2lkIDApIHtcclxuICAgICAgICBheGlzID0gdGhpcy5pc0hvcml6b250YWwoKSA/ICd4JyA6ICd5JztcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcclxuICAgICAgICB0cmFuc2xhdGUsXHJcbiAgICAgICAgJHdyYXBwZXJFbFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJ0bCA/IC10cmFuc2xhdGUgOiB0cmFuc2xhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgIHJldHVybiB0cmFuc2xhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBjdXJyZW50VHJhbnNsYXRlID0gZ2V0VHJhbnNsYXRlKCR3cmFwcGVyRWxbMF0sIGF4aXMpO1xyXG4gICAgICBpZiAocnRsKSBjdXJyZW50VHJhbnNsYXRlID0gLWN1cnJlbnRUcmFuc2xhdGU7XHJcbiAgICAgIHJldHVybiBjdXJyZW50VHJhbnNsYXRlIHx8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKHRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgJHdyYXBwZXJFbCxcclxuICAgICAgICB3cmFwcGVyRWwsXHJcbiAgICAgICAgcHJvZ3Jlc3NcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgbGV0IHggPSAwO1xyXG4gICAgICBsZXQgeSA9IDA7XHJcbiAgICAgIGNvbnN0IHogPSAwO1xyXG5cclxuICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xyXG4gICAgICAgIHggPSBydGwgPyAtdHJhbnNsYXRlIDogdHJhbnNsYXRlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHkgPSB0cmFuc2xhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMucm91bmRMZW5ndGhzKSB7XHJcbiAgICAgICAgeCA9IE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgeSA9IE1hdGguZmxvb3IoeSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgIHdyYXBwZXJFbFtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnc2Nyb2xsTGVmdCcgOiAnc2Nyb2xsVG9wJ10gPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAteCA6IC15O1xyXG4gICAgICB9IGVsc2UgaWYgKCFwYXJhbXMudmlydHVhbFRyYW5zbGF0ZSkge1xyXG4gICAgICAgICR3cmFwcGVyRWwudHJhbnNmb3JtKGB0cmFuc2xhdGUzZCgke3h9cHgsICR7eX1weCwgJHt6fXB4KWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIucHJldmlvdXNUcmFuc2xhdGUgPSBzd2lwZXIudHJhbnNsYXRlO1xyXG4gICAgICBzd2lwZXIudHJhbnNsYXRlID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8geCA6IHk7IC8vIENoZWNrIGlmIHdlIG5lZWQgdG8gdXBkYXRlIHByb2dyZXNzXHJcblxyXG4gICAgICBsZXQgbmV3UHJvZ3Jlc3M7XHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZXNEaWZmID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKHRyYW5zbGF0ZXNEaWZmID09PSAwKSB7XHJcbiAgICAgICAgbmV3UHJvZ3Jlc3MgPSAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1Byb2dyZXNzID0gKHRyYW5zbGF0ZSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSkgLyB0cmFuc2xhdGVzRGlmZjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5ld1Byb2dyZXNzICE9PSBwcm9ncmVzcykge1xyXG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuZW1pdCgnc2V0VHJhbnNsYXRlJywgc3dpcGVyLnRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtaW5UcmFuc2xhdGUoKSB7XHJcbiAgICAgIHJldHVybiAtdGhpcy5zbmFwR3JpZFswXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYXhUcmFuc2xhdGUoKSB7XHJcbiAgICAgIHJldHVybiAtdGhpcy5zbmFwR3JpZFt0aGlzLnNuYXBHcmlkLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZVRvKHRyYW5zbGF0ZSwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgdHJhbnNsYXRlQm91bmRzLCBpbnRlcm5hbCkge1xyXG4gICAgICBpZiAodHJhbnNsYXRlID09PSB2b2lkIDApIHtcclxuICAgICAgICB0cmFuc2xhdGUgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0cmFuc2xhdGVCb3VuZHMgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHRyYW5zbGF0ZUJvdW5kcyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgd3JhcHBlckVsXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMucHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBtaW5UcmFuc2xhdGUgPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XHJcbiAgICAgIGNvbnN0IG1heFRyYW5zbGF0ZSA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcclxuICAgICAgbGV0IG5ld1RyYW5zbGF0ZTtcclxuICAgICAgaWYgKHRyYW5zbGF0ZUJvdW5kcyAmJiB0cmFuc2xhdGUgPiBtaW5UcmFuc2xhdGUpIG5ld1RyYW5zbGF0ZSA9IG1pblRyYW5zbGF0ZTtlbHNlIGlmICh0cmFuc2xhdGVCb3VuZHMgJiYgdHJhbnNsYXRlIDwgbWF4VHJhbnNsYXRlKSBuZXdUcmFuc2xhdGUgPSBtYXhUcmFuc2xhdGU7ZWxzZSBuZXdUcmFuc2xhdGUgPSB0cmFuc2xhdGU7IC8vIFVwZGF0ZSBwcm9ncmVzc1xyXG5cclxuICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKG5ld1RyYW5zbGF0ZSk7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICBjb25zdCBpc0ggPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XHJcblxyXG4gICAgICAgIGlmIChzcGVlZCA9PT0gMCkge1xyXG4gICAgICAgICAgd3JhcHBlckVsW2lzSCA/ICdzY3JvbGxMZWZ0JyA6ICdzY3JvbGxUb3AnXSA9IC1uZXdUcmFuc2xhdGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICghc3dpcGVyLnN1cHBvcnQuc21vb3RoU2Nyb2xsKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVDU1NNb2RlU2Nyb2xsKHtcclxuICAgICAgICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgICAgICAgdGFyZ2V0UG9zaXRpb246IC1uZXdUcmFuc2xhdGUsXHJcbiAgICAgICAgICAgICAgc2lkZTogaXNIID8gJ2xlZnQnIDogJ3RvcCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdyYXBwZXJFbC5zY3JvbGxUbyh7XHJcbiAgICAgICAgICAgIFtpc0ggPyAnbGVmdCcgOiAndG9wJ106IC1uZXdUcmFuc2xhdGUsXHJcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNwZWVkID09PSAwKSB7XHJcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XHJcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdUcmFuc2xhdGUpO1xyXG5cclxuICAgICAgICBpZiAocnVuQ2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICBzd2lwZXIuZW1pdCgnYmVmb3JlVHJhbnNpdGlvblN0YXJ0Jywgc3BlZWQsIGludGVybmFsKTtcclxuICAgICAgICAgIHN3aXBlci5lbWl0KCd0cmFuc2l0aW9uRW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHNwZWVkKTtcclxuICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKG5ld1RyYW5zbGF0ZSk7XHJcblxyXG4gICAgICAgIGlmIChydW5DYWxsYmFja3MpIHtcclxuICAgICAgICAgIHN3aXBlci5lbWl0KCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnLCBzcGVlZCwgaW50ZXJuYWwpO1xyXG4gICAgICAgICAgc3dpcGVyLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nKSB7XHJcbiAgICAgICAgICBzd2lwZXIuYW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICBpZiAoIXN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpIHtcclxuICAgICAgICAgICAgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoZSkge1xyXG4gICAgICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcclxuICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMpIHJldHVybjtcclxuICAgICAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFswXS5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLiR3cmFwcGVyRWxbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2Via2l0VHJhbnNpdGlvbkVuZCcsIHN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICAgIHN3aXBlci5vblRyYW5zbGF0ZVRvV3JhcHBlclRyYW5zaXRpb25FbmQgPSBudWxsO1xyXG4gICAgICAgICAgICAgIGRlbGV0ZSBzd2lwZXIub25UcmFuc2xhdGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kO1xyXG5cclxuICAgICAgICAgICAgICBpZiAocnVuQ2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBzd2lwZXIuZW1pdCgndHJhbnNpdGlvbkVuZCcpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFswXS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFswXS5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgc3dpcGVyLm9uVHJhbnNsYXRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdHJhbnNsYXRlID0ge1xyXG4gICAgICBnZXRUcmFuc2xhdGU6IGdldFN3aXBlclRyYW5zbGF0ZSxcclxuICAgICAgc2V0VHJhbnNsYXRlLFxyXG4gICAgICBtaW5UcmFuc2xhdGUsXHJcbiAgICAgIG1heFRyYW5zbGF0ZSxcclxuICAgICAgdHJhbnNsYXRlVG9cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoIXN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgIHN3aXBlci4kd3JhcHBlckVsLnRyYW5zaXRpb24oZHVyYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuZW1pdCgnc2V0VHJhbnNpdGlvbicsIGR1cmF0aW9uLCBieUNvbnRyb2xsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zaXRpb25FbWl0KF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzLFxyXG4gICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgICBzdGVwXHJcbiAgICAgIH0gPSBfcmVmO1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgYWN0aXZlSW5kZXgsXHJcbiAgICAgICAgcHJldmlvdXNJbmRleFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBsZXQgZGlyID0gZGlyZWN0aW9uO1xyXG5cclxuICAgICAgaWYgKCFkaXIpIHtcclxuICAgICAgICBpZiAoYWN0aXZlSW5kZXggPiBwcmV2aW91c0luZGV4KSBkaXIgPSAnbmV4dCc7ZWxzZSBpZiAoYWN0aXZlSW5kZXggPCBwcmV2aW91c0luZGV4KSBkaXIgPSAncHJldic7ZWxzZSBkaXIgPSAncmVzZXQnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuZW1pdChgdHJhbnNpdGlvbiR7c3RlcH1gKTtcclxuXHJcbiAgICAgIGlmIChydW5DYWxsYmFja3MgJiYgYWN0aXZlSW5kZXggIT09IHByZXZpb3VzSW5kZXgpIHtcclxuICAgICAgICBpZiAoZGlyID09PSAncmVzZXQnKSB7XHJcbiAgICAgICAgICBzd2lwZXIuZW1pdChgc2xpZGVSZXNldFRyYW5zaXRpb24ke3N0ZXB9YCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIuZW1pdChgc2xpZGVDaGFuZ2VUcmFuc2l0aW9uJHtzdGVwfWApO1xyXG5cclxuICAgICAgICBpZiAoZGlyID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgIHN3aXBlci5lbWl0KGBzbGlkZU5leHRUcmFuc2l0aW9uJHtzdGVwfWApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2lwZXIuZW1pdChgc2xpZGVQcmV2VHJhbnNpdGlvbiR7c3RlcH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2l0aW9uU3RhcnQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pIHtcclxuICAgICAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBpZiAocGFyYW1zLmNzc01vZGUpIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMuYXV0b0hlaWdodCkge1xyXG4gICAgICAgIHN3aXBlci51cGRhdGVBdXRvSGVpZ2h0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRyYW5zaXRpb25FbWl0KHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzLFxyXG4gICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgICBzdGVwOiAnU3RhcnQnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pIHtcclxuICAgICAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBzd2lwZXIuYW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgIGlmIChwYXJhbXMuY3NzTW9kZSkgcmV0dXJuO1xyXG4gICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbigwKTtcclxuICAgICAgdHJhbnNpdGlvbkVtaXQoe1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBydW5DYWxsYmFja3MsXHJcbiAgICAgICAgZGlyZWN0aW9uLFxyXG4gICAgICAgIHN0ZXA6ICdFbmQnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0cmFuc2l0aW9uID0ge1xyXG4gICAgICBzZXRUcmFuc2l0aW9uLFxyXG4gICAgICB0cmFuc2l0aW9uU3RhcnQsXHJcbiAgICAgIHRyYW5zaXRpb25FbmRcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc2xpZGVUbyhpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwsIGluaXRpYWwpIHtcclxuICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHtcclxuICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicgJiYgdHlwZW9mIGluZGV4ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlICdpbmRleCcgYXJndW1lbnQgY2Fubm90IGhhdmUgdHlwZSBvdGhlciB0aGFuICdudW1iZXInIG9yICdzdHJpbmcnLiBbJHt0eXBlb2YgaW5kZXh9XSBnaXZlbi5gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgYGluZGV4YCBhcmd1bWVudCBjb252ZXJ0ZWQgZnJvbSBgc3RyaW5nYCB0byBgbnVtYmVyYC5cclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGluZGV4QXNOdW1iZXIgPSBwYXJzZUludChpbmRleCwgMTApO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERldGVybWluZXMgd2hldGhlciB0aGUgYGluZGV4YCBhcmd1bWVudCBpcyBhIHZhbGlkIGBudW1iZXJgXHJcbiAgICAgICAgICogYWZ0ZXIgYmVpbmcgY29udmVydGVkIGZyb20gdGhlIGBzdHJpbmdgIHR5cGUuXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IGlzVmFsaWROdW1iZXIgPSBpc0Zpbml0ZShpbmRleEFzTnVtYmVyKTtcclxuXHJcbiAgICAgICAgaWYgKCFpc1ZhbGlkTnVtYmVyKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwYXNzZWQtaW4gJ2luZGV4JyAoc3RyaW5nKSBjb3VsZG4ndCBiZSBjb252ZXJ0ZWQgdG8gJ251bWJlcicuIFske2luZGV4fV0gZ2l2ZW4uYCk7XHJcbiAgICAgICAgfSAvLyBLbm93aW5nIHRoYXQgdGhlIGNvbnZlcnRlZCBgaW5kZXhgIGlzIGEgdmFsaWQgbnVtYmVyLFxyXG4gICAgICAgIC8vIHdlIGNhbiB1cGRhdGUgdGhlIG9yaWdpbmFsIGFyZ3VtZW50J3MgdmFsdWUuXHJcblxyXG5cclxuICAgICAgICBpbmRleCA9IGluZGV4QXNOdW1iZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGxldCBzbGlkZUluZGV4ID0gaW5kZXg7XHJcbiAgICAgIGlmIChzbGlkZUluZGV4IDwgMCkgc2xpZGVJbmRleCA9IDA7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgc25hcEdyaWQsXHJcbiAgICAgICAgc2xpZGVzR3JpZCxcclxuICAgICAgICBwcmV2aW91c0luZGV4LFxyXG4gICAgICAgIGFjdGl2ZUluZGV4LFxyXG4gICAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxyXG4gICAgICAgIHdyYXBwZXJFbCxcclxuICAgICAgICBlbmFibGVkXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMucHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uIHx8ICFlbmFibGVkICYmICFpbnRlcm5hbCAmJiAhaW5pdGlhbCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc2tpcCA9IE1hdGgubWluKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwLCBzbGlkZUluZGV4KTtcclxuICAgICAgbGV0IHNuYXBJbmRleCA9IHNraXAgKyBNYXRoLmZsb29yKChzbGlkZUluZGV4IC0gc2tpcCkgLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcclxuICAgICAgaWYgKHNuYXBJbmRleCA+PSBzbmFwR3JpZC5sZW5ndGgpIHNuYXBJbmRleCA9IHNuYXBHcmlkLmxlbmd0aCAtIDE7XHJcblxyXG4gICAgICBpZiAoKGFjdGl2ZUluZGV4IHx8IHBhcmFtcy5pbml0aWFsU2xpZGUgfHwgMCkgPT09IChwcmV2aW91c0luZGV4IHx8IDApICYmIHJ1bkNhbGxiYWNrcykge1xyXG4gICAgICAgIHN3aXBlci5lbWl0KCdiZWZvcmVTbGlkZUNoYW5nZVN0YXJ0Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IC1zbmFwR3JpZFtzbmFwSW5kZXhdOyAvLyBVcGRhdGUgcHJvZ3Jlc3NcclxuXHJcbiAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyh0cmFuc2xhdGUpOyAvLyBOb3JtYWxpemUgc2xpZGVJbmRleFxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5ub3JtYWxpemVTbGlkZUluZGV4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNHcmlkLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBjb25zdCBub3JtYWxpemVkVHJhbnNsYXRlID0gLU1hdGguZmxvb3IodHJhbnNsYXRlICogMTAwKTtcclxuICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRHcmlkID0gTWF0aC5mbG9vcihzbGlkZXNHcmlkW2ldICogMTAwKTtcclxuICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRHcmlkTmV4dCA9IE1hdGguZmxvb3Ioc2xpZGVzR3JpZFtpICsgMV0gKiAxMDApO1xyXG5cclxuICAgICAgICAgIGlmICh0eXBlb2Ygc2xpZGVzR3JpZFtpICsgMV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGlmIChub3JtYWxpemVkVHJhbnNsYXRlID49IG5vcm1hbGl6ZWRHcmlkICYmIG5vcm1hbGl6ZWRUcmFuc2xhdGUgPCBub3JtYWxpemVkR3JpZE5leHQgLSAobm9ybWFsaXplZEdyaWROZXh0IC0gbm9ybWFsaXplZEdyaWQpIC8gMikge1xyXG4gICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vcm1hbGl6ZWRUcmFuc2xhdGUgPj0gbm9ybWFsaXplZEdyaWQgJiYgbm9ybWFsaXplZFRyYW5zbGF0ZSA8IG5vcm1hbGl6ZWRHcmlkTmV4dCkge1xyXG4gICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChub3JtYWxpemVkVHJhbnNsYXRlID49IG5vcm1hbGl6ZWRHcmlkKSB7XHJcbiAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSAvLyBEaXJlY3Rpb25zIGxvY2tzXHJcblxyXG5cclxuICAgICAgaWYgKHN3aXBlci5pbml0aWFsaXplZCAmJiBzbGlkZUluZGV4ICE9PSBhY3RpdmVJbmRleCkge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVOZXh0ICYmIHRyYW5zbGF0ZSA8IHN3aXBlci50cmFuc2xhdGUgJiYgdHJhbnNsYXRlIDwgc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiB0cmFuc2xhdGUgPiBzd2lwZXIudHJhbnNsYXRlICYmIHRyYW5zbGF0ZSA+IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xyXG4gICAgICAgICAgaWYgKChhY3RpdmVJbmRleCB8fCAwKSAhPT0gc2xpZGVJbmRleCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGRpcmVjdGlvbjtcclxuICAgICAgaWYgKHNsaWRlSW5kZXggPiBhY3RpdmVJbmRleCkgZGlyZWN0aW9uID0gJ25leHQnO2Vsc2UgaWYgKHNsaWRlSW5kZXggPCBhY3RpdmVJbmRleCkgZGlyZWN0aW9uID0gJ3ByZXYnO2Vsc2UgZGlyZWN0aW9uID0gJ3Jlc2V0JzsgLy8gVXBkYXRlIEluZGV4XHJcblxyXG4gICAgICBpZiAocnRsICYmIC10cmFuc2xhdGUgPT09IHN3aXBlci50cmFuc2xhdGUgfHwgIXJ0bCAmJiB0cmFuc2xhdGUgPT09IHN3aXBlci50cmFuc2xhdGUpIHtcclxuICAgICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoc2xpZGVJbmRleCk7IC8vIFVwZGF0ZSBIZWlnaHRcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5hdXRvSGVpZ2h0KSB7XHJcbiAgICAgICAgICBzd2lwZXIudXBkYXRlQXV0b0hlaWdodCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5lZmZlY3QgIT09ICdzbGlkZScpIHtcclxuICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUodHJhbnNsYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gIT09ICdyZXNldCcpIHtcclxuICAgICAgICAgIHN3aXBlci50cmFuc2l0aW9uU3RhcnQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICBjb25zdCBpc0ggPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XHJcbiAgICAgICAgY29uc3QgdCA9IHJ0bCA/IHRyYW5zbGF0ZSA6IC10cmFuc2xhdGU7XHJcblxyXG4gICAgICAgIGlmIChzcGVlZCA9PT0gMCkge1xyXG4gICAgICAgICAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQ7XHJcblxyXG4gICAgICAgICAgaWYgKGlzVmlydHVhbCkge1xyXG4gICAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBzd2lwZXIuX2ltbWVkaWF0ZVZpcnR1YWwgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdyYXBwZXJFbFtpc0ggPyAnc2Nyb2xsTGVmdCcgOiAnc2Nyb2xsVG9wJ10gPSB0O1xyXG5cclxuICAgICAgICAgIGlmIChpc1ZpcnR1YWwpIHtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gJyc7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLl9zd2lwZXJJbW1lZGlhdGVWaXJ0dWFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoIXN3aXBlci5zdXBwb3J0LnNtb290aFNjcm9sbCkge1xyXG4gICAgICAgICAgICBhbmltYXRlQ1NTTW9kZVNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uOiB0LFxyXG4gICAgICAgICAgICAgIHNpZGU6IGlzSCA/ICdsZWZ0JyA6ICd0b3AnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB3cmFwcGVyRWwuc2Nyb2xsVG8oe1xyXG4gICAgICAgICAgICBbaXNIID8gJ2xlZnQnIDogJ3RvcCddOiB0LFxyXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKHNwZWVkKTtcclxuICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xyXG4gICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoc2xpZGVJbmRleCk7XHJcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XHJcbiAgICAgIHN3aXBlci5lbWl0KCdiZWZvcmVUcmFuc2l0aW9uU3RhcnQnLCBzcGVlZCwgaW50ZXJuYWwpO1xyXG4gICAgICBzd2lwZXIudHJhbnNpdGlvblN0YXJ0KHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgIGlmIChzcGVlZCA9PT0gMCkge1xyXG4gICAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKHJ1bkNhbGxiYWNrcywgZGlyZWN0aW9uKTtcclxuICAgICAgfSBlbHNlIGlmICghc3dpcGVyLmFuaW1hdGluZykge1xyXG4gICAgICAgIHN3aXBlci5hbmltYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZCkge1xyXG4gICAgICAgICAgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gdHJhbnNpdGlvbkVuZChlKSB7XHJcbiAgICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzKSByZXR1cm47XHJcbiAgICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsWzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFswXS5yZW1vdmVFdmVudExpc3RlbmVyKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgc3dpcGVyLm9uU2xpZGVUb1dyYXBwZXJUcmFuc2l0aW9uRW5kID0gbnVsbDtcclxuICAgICAgICAgICAgZGVsZXRlIHN3aXBlci5vblNsaWRlVG9XcmFwcGVyVHJhbnNpdGlvbkVuZDtcclxuICAgICAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQocnVuQ2FsbGJhY2tzLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXBlci4kd3JhcHBlckVsWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgIHN3aXBlci4kd3JhcHBlckVsWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCBzd2lwZXIub25TbGlkZVRvV3JhcHBlclRyYW5zaXRpb25FbmQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzbGlkZVRvTG9vcChpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpIHtcclxuICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHtcclxuICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgbGV0IG5ld0luZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgbmV3SW5kZXggKz0gc3dpcGVyLmxvb3BlZFNsaWRlcztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKG5ld0luZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXHJcbiAgICBmdW5jdGlvbiBzbGlkZU5leHQoc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpIHtcclxuICAgICAgaWYgKHNwZWVkID09PSB2b2lkIDApIHtcclxuICAgICAgICBzcGVlZCA9IHRoaXMucGFyYW1zLnNwZWVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocnVuQ2FsbGJhY2tzID09PSB2b2lkIDApIHtcclxuICAgICAgICBydW5DYWxsYmFja3MgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgYW5pbWF0aW5nLFxyXG4gICAgICAgIGVuYWJsZWQsXHJcbiAgICAgICAgcGFyYW1zXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgIGlmICghZW5hYmxlZCkgcmV0dXJuIHN3aXBlcjtcclxuICAgICAgbGV0IHBlckdyb3VwID0gcGFyYW1zLnNsaWRlc1Blckdyb3VwO1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8pIHtcclxuICAgICAgICBwZXJHcm91cCA9IE1hdGgubWF4KHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygnY3VycmVudCcsIHRydWUpLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaW5jcmVtZW50ID0gc3dpcGVyLmFjdGl2ZUluZGV4IDwgcGFyYW1zLnNsaWRlc1Blckdyb3VwU2tpcCA/IDEgOiBwZXJHcm91cDtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCkge1xyXG4gICAgICAgIGlmIChhbmltYXRpbmcgJiYgcGFyYW1zLmxvb3BQcmV2ZW50c1NsaWRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcblxyXG4gICAgICAgIHN3aXBlci5fY2xpZW50TGVmdCA9IHN3aXBlci4kd3JhcHBlckVsWzBdLmNsaWVudExlZnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMucmV3aW5kICYmIHN3aXBlci5pc0VuZCkge1xyXG4gICAgICAgIHJldHVybiBzd2lwZXIuc2xpZGVUbygwLCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXggKyBpbmNyZW1lbnQsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFwib2ZmXCIgKi9cclxuICAgIGZ1bmN0aW9uIHNsaWRlUHJldihzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCkge1xyXG4gICAgICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgYW5pbWF0aW5nLFxyXG4gICAgICAgIHNuYXBHcmlkLFxyXG4gICAgICAgIHNsaWRlc0dyaWQsXHJcbiAgICAgICAgcnRsVHJhbnNsYXRlLFxyXG4gICAgICAgIGVuYWJsZWRcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgaWYgKCFlbmFibGVkKSByZXR1cm4gc3dpcGVyO1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgaWYgKGFuaW1hdGluZyAmJiBwYXJhbXMubG9vcFByZXZlbnRzU2xpZGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBzd2lwZXIubG9vcEZpeCgpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuXHJcbiAgICAgICAgc3dpcGVyLl9jbGllbnRMZWZ0ID0gc3dpcGVyLiR3cmFwcGVyRWxbMF0uY2xpZW50TGVmdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdHJhbnNsYXRlID0gcnRsVHJhbnNsYXRlID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xyXG5cclxuICAgICAgZnVuY3Rpb24gbm9ybWFsaXplKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwgPCAwKSByZXR1cm4gLU1hdGguZmxvb3IoTWF0aC5hYnModmFsKSk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFRyYW5zbGF0ZSA9IG5vcm1hbGl6ZSh0cmFuc2xhdGUpO1xyXG4gICAgICBjb25zdCBub3JtYWxpemVkU25hcEdyaWQgPSBzbmFwR3JpZC5tYXAodmFsID0+IG5vcm1hbGl6ZSh2YWwpKTtcclxuICAgICAgbGV0IHByZXZTbmFwID0gc25hcEdyaWRbbm9ybWFsaXplZFNuYXBHcmlkLmluZGV4T2Yobm9ybWFsaXplZFRyYW5zbGF0ZSkgLSAxXTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgcHJldlNuYXAgPT09ICd1bmRlZmluZWQnICYmIHBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgbGV0IHByZXZTbmFwSW5kZXg7XHJcbiAgICAgICAgc25hcEdyaWQuZm9yRWFjaCgoc25hcCwgc25hcEluZGV4KSA9PiB7XHJcbiAgICAgICAgICBpZiAobm9ybWFsaXplZFRyYW5zbGF0ZSA+PSBzbmFwKSB7XHJcbiAgICAgICAgICAgIC8vIHByZXZTbmFwID0gc25hcDtcclxuICAgICAgICAgICAgcHJldlNuYXBJbmRleCA9IHNuYXBJbmRleDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBwcmV2U25hcEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgcHJldlNuYXAgPSBzbmFwR3JpZFtwcmV2U25hcEluZGV4ID4gMCA/IHByZXZTbmFwSW5kZXggLSAxIDogcHJldlNuYXBJbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcHJldkluZGV4ID0gMDtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgcHJldlNuYXAgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcHJldkluZGV4ID0gc2xpZGVzR3JpZC5pbmRleE9mKHByZXZTbmFwKTtcclxuICAgICAgICBpZiAocHJldkluZGV4IDwgMCkgcHJldkluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4IC0gMTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxICYmIHBhcmFtcy5zbGlkZXNQZXJHcm91cEF1dG8pIHtcclxuICAgICAgICAgIHByZXZJbmRleCA9IHByZXZJbmRleCAtIHN3aXBlci5zbGlkZXNQZXJWaWV3RHluYW1pYygncHJldmlvdXMnLCB0cnVlKSArIDE7XHJcbiAgICAgICAgICBwcmV2SW5kZXggPSBNYXRoLm1heChwcmV2SW5kZXgsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5yZXdpbmQgJiYgc3dpcGVyLmlzQmVnaW5uaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdEluZGV4ID0gc3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkICYmIHN3aXBlci52aXJ0dWFsID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCAtIDEgOiBzd2lwZXIuc2xpZGVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKGxhc3RJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3dpcGVyLnNsaWRlVG8ocHJldkluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXHJcbiAgICBmdW5jdGlvbiBzbGlkZVJlc2V0KHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKSB7XHJcbiAgICAgIGlmIChzcGVlZCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgc3BlZWQgPSB0aGlzLnBhcmFtcy5zcGVlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJ1bkNhbGxiYWNrcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgcmV0dXJuIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiAqL1xyXG4gICAgZnVuY3Rpb24gc2xpZGVUb0Nsb3Nlc3Qoc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwsIHRocmVzaG9sZCkge1xyXG4gICAgICBpZiAoc3BlZWQgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHNwZWVkID0gdGhpcy5wYXJhbXMuc3BlZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChydW5DYWxsYmFja3MgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHJ1bkNhbGxiYWNrcyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aHJlc2hvbGQgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHRocmVzaG9sZCA9IDAuNTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgbGV0IGluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xyXG4gICAgICBjb25zdCBza2lwID0gTWF0aC5taW4oc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAsIGluZGV4KTtcclxuICAgICAgY29uc3Qgc25hcEluZGV4ID0gc2tpcCArIE1hdGguZmxvb3IoKGluZGV4IC0gc2tpcCkgLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcclxuICAgICAgY29uc3QgdHJhbnNsYXRlID0gc3dpcGVyLnJ0bFRyYW5zbGF0ZSA/IHN3aXBlci50cmFuc2xhdGUgOiAtc3dpcGVyLnRyYW5zbGF0ZTtcclxuXHJcbiAgICAgIGlmICh0cmFuc2xhdGUgPj0gc3dpcGVyLnNuYXBHcmlkW3NuYXBJbmRleF0pIHtcclxuICAgICAgICAvLyBUaGUgY3VycmVudCB0cmFuc2xhdGUgaXMgb24gb3IgYWZ0ZXIgdGhlIGN1cnJlbnQgc25hcCBpbmRleCwgc28gdGhlIGNob2ljZVxyXG4gICAgICAgIC8vIGlzIGJldHdlZW4gdGhlIGN1cnJlbnQgaW5kZXggYW5kIHRoZSBvbmUgYWZ0ZXIgaXQuXHJcbiAgICAgICAgY29uc3QgY3VycmVudFNuYXAgPSBzd2lwZXIuc25hcEdyaWRbc25hcEluZGV4XTtcclxuICAgICAgICBjb25zdCBuZXh0U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXggKyAxXTtcclxuXHJcbiAgICAgICAgaWYgKHRyYW5zbGF0ZSAtIGN1cnJlbnRTbmFwID4gKG5leHRTbmFwIC0gY3VycmVudFNuYXApICogdGhyZXNob2xkKSB7XHJcbiAgICAgICAgICBpbmRleCArPSBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBUaGUgY3VycmVudCB0cmFuc2xhdGUgaXMgYmVmb3JlIHRoZSBjdXJyZW50IHNuYXAgaW5kZXgsIHNvIHRoZSBjaG9pY2VcclxuICAgICAgICAvLyBpcyBiZXR3ZWVuIHRoZSBjdXJyZW50IGluZGV4IGFuZCB0aGUgb25lIGJlZm9yZSBpdC5cclxuICAgICAgICBjb25zdCBwcmV2U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXggLSAxXTtcclxuICAgICAgICBjb25zdCBjdXJyZW50U25hcCA9IHN3aXBlci5zbmFwR3JpZFtzbmFwSW5kZXhdO1xyXG5cclxuICAgICAgICBpZiAodHJhbnNsYXRlIC0gcHJldlNuYXAgPD0gKGN1cnJlbnRTbmFwIC0gcHJldlNuYXApICogdGhyZXNob2xkKSB7XHJcbiAgICAgICAgICBpbmRleCAtPSBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaW5kZXggPSBNYXRoLm1heChpbmRleCwgMCk7XHJcbiAgICAgIGluZGV4ID0gTWF0aC5taW4oaW5kZXgsIHN3aXBlci5zbGlkZXNHcmlkLmxlbmd0aCAtIDEpO1xyXG4gICAgICByZXR1cm4gc3dpcGVyLnNsaWRlVG8oaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzbGlkZVRvQ2xpY2tlZFNsaWRlKCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgICR3cmFwcGVyRWxcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgY29uc3Qgc2xpZGVzUGVyVmlldyA9IHBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgPyBzd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKSA6IHBhcmFtcy5zbGlkZXNQZXJWaWV3O1xyXG4gICAgICBsZXQgc2xpZGVUb0luZGV4ID0gc3dpcGVyLmNsaWNrZWRJbmRleDtcclxuICAgICAgbGV0IHJlYWxJbmRleDtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCkge1xyXG4gICAgICAgIGlmIChzd2lwZXIuYW5pbWF0aW5nKSByZXR1cm47XHJcbiAgICAgICAgcmVhbEluZGV4ID0gcGFyc2VJbnQoJChzd2lwZXIuY2xpY2tlZFNsaWRlKS5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcclxuICAgICAgICAgIGlmIChzbGlkZVRvSW5kZXggPCBzd2lwZXIubG9vcGVkU2xpZGVzIC0gc2xpZGVzUGVyVmlldyAvIDIgfHwgc2xpZGVUb0luZGV4ID4gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSBzd2lwZXIubG9vcGVkU2xpZGVzICsgc2xpZGVzUGVyVmlldyAvIDIpIHtcclxuICAgICAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcclxuICAgICAgICAgICAgc2xpZGVUb0luZGV4ID0gJHdyYXBwZXJFbC5jaGlsZHJlbihgLiR7cGFyYW1zLnNsaWRlQ2xhc3N9W2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtyZWFsSW5kZXh9XCJdOm5vdCguJHtwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzc30pYCkuZXEoMCkuaW5kZXgoKTtcclxuICAgICAgICAgICAgbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNsaWRlVG9JbmRleCA+IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gc2xpZGVzUGVyVmlldykge1xyXG4gICAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcclxuICAgICAgICAgIHNsaWRlVG9JbmRleCA9ICR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3BhcmFtcy5zbGlkZUNsYXNzfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7cmVhbEluZGV4fVwiXTpub3QoLiR7cGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3N9KWApLmVxKDApLmluZGV4KCk7XHJcbiAgICAgICAgICBuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBzbGlkZSA9IHtcclxuICAgICAgc2xpZGVUbyxcclxuICAgICAgc2xpZGVUb0xvb3AsXHJcbiAgICAgIHNsaWRlTmV4dCxcclxuICAgICAgc2xpZGVQcmV2LFxyXG4gICAgICBzbGlkZVJlc2V0LFxyXG4gICAgICBzbGlkZVRvQ2xvc2VzdCxcclxuICAgICAgc2xpZGVUb0NsaWNrZWRTbGlkZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb29wQ3JlYXRlKCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgJHdyYXBwZXJFbFxyXG4gICAgICB9ID0gc3dpcGVyOyAvLyBSZW1vdmUgZHVwbGljYXRlZCBzbGlkZXNcclxuXHJcbiAgICAgIGNvbnN0ICRzZWxlY3RvciA9ICR3cmFwcGVyRWwuY2hpbGRyZW4oKS5sZW5ndGggPiAwID8gJCgkd3JhcHBlckVsLmNoaWxkcmVuKClbMF0ucGFyZW50Tm9kZSkgOiAkd3JhcHBlckVsO1xyXG4gICAgICAkc2VsZWN0b3IuY2hpbGRyZW4oYC4ke3BhcmFtcy5zbGlkZUNsYXNzfS4ke3BhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzfWApLnJlbW92ZSgpO1xyXG4gICAgICBsZXQgc2xpZGVzID0gJHNlbGVjdG9yLmNoaWxkcmVuKGAuJHtwYXJhbXMuc2xpZGVDbGFzc31gKTtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcEZpbGxHcm91cFdpdGhCbGFuaykge1xyXG4gICAgICAgIGNvbnN0IGJsYW5rU2xpZGVzTnVtID0gcGFyYW1zLnNsaWRlc1Blckdyb3VwIC0gc2xpZGVzLmxlbmd0aCAlIHBhcmFtcy5zbGlkZXNQZXJHcm91cDtcclxuXHJcbiAgICAgICAgaWYgKGJsYW5rU2xpZGVzTnVtICE9PSBwYXJhbXMuc2xpZGVzUGVyR3JvdXApIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxhbmtTbGlkZXNOdW07IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBibGFua05vZGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKS5hZGRDbGFzcyhgJHtwYXJhbXMuc2xpZGVDbGFzc30gJHtwYXJhbXMuc2xpZGVCbGFua0NsYXNzfWApO1xyXG4gICAgICAgICAgICAkc2VsZWN0b3IuYXBwZW5kKGJsYW5rTm9kZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2xpZGVzID0gJHNlbGVjdG9yLmNoaWxkcmVuKGAuJHtwYXJhbXMuc2xpZGVDbGFzc31gKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nICYmICFwYXJhbXMubG9vcGVkU2xpZGVzKSBwYXJhbXMubG9vcGVkU2xpZGVzID0gc2xpZGVzLmxlbmd0aDtcclxuICAgICAgc3dpcGVyLmxvb3BlZFNsaWRlcyA9IE1hdGguY2VpbChwYXJzZUZsb2F0KHBhcmFtcy5sb29wZWRTbGlkZXMgfHwgcGFyYW1zLnNsaWRlc1BlclZpZXcsIDEwKSk7XHJcbiAgICAgIHN3aXBlci5sb29wZWRTbGlkZXMgKz0gcGFyYW1zLmxvb3BBZGRpdGlvbmFsU2xpZGVzO1xyXG5cclxuICAgICAgaWYgKHN3aXBlci5sb29wZWRTbGlkZXMgPiBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3dpcGVyLmxvb3BlZFNsaWRlcyA9IHNsaWRlcy5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHByZXBlbmRTbGlkZXMgPSBbXTtcclxuICAgICAgY29uc3QgYXBwZW5kU2xpZGVzID0gW107XHJcbiAgICAgIHNsaWRlcy5lYWNoKChlbCwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBzbGlkZSA9ICQoZWwpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPCBzd2lwZXIubG9vcGVkU2xpZGVzKSB7XHJcbiAgICAgICAgICBhcHBlbmRTbGlkZXMucHVzaChlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPCBzbGlkZXMubGVuZ3RoICYmIGluZGV4ID49IHNsaWRlcy5sZW5ndGggLSBzd2lwZXIubG9vcGVkU2xpZGVzKSB7XHJcbiAgICAgICAgICBwcmVwZW5kU2xpZGVzLnB1c2goZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2xpZGUuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBpbmRleCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcHBlbmRTbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAkc2VsZWN0b3IuYXBwZW5kKCQoYXBwZW5kU2xpZGVzW2ldLmNsb25lTm9kZSh0cnVlKSkuYWRkQ2xhc3MocGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3MpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IHByZXBlbmRTbGlkZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcclxuICAgICAgICAkc2VsZWN0b3IucHJlcGVuZCgkKHByZXBlbmRTbGlkZXNbaV0uY2xvbmVOb2RlKHRydWUpKS5hZGRDbGFzcyhwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9vcEZpeCgpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgc3dpcGVyLmVtaXQoJ2JlZm9yZUxvb3BGaXgnKTtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIGFjdGl2ZUluZGV4LFxyXG4gICAgICAgIHNsaWRlcyxcclxuICAgICAgICBsb29wZWRTbGlkZXMsXHJcbiAgICAgICAgYWxsb3dTbGlkZVByZXYsXHJcbiAgICAgICAgYWxsb3dTbGlkZU5leHQsXHJcbiAgICAgICAgc25hcEdyaWQsXHJcbiAgICAgICAgcnRsVHJhbnNsYXRlOiBydGxcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgbGV0IG5ld0luZGV4O1xyXG4gICAgICBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPSB0cnVlO1xyXG4gICAgICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSB0cnVlO1xyXG4gICAgICBjb25zdCBzbmFwVHJhbnNsYXRlID0gLXNuYXBHcmlkW2FjdGl2ZUluZGV4XTtcclxuICAgICAgY29uc3QgZGlmZiA9IHNuYXBUcmFuc2xhdGUgLSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCk7IC8vIEZpeCBGb3IgTmVnYXRpdmUgT3ZlcnNsaWRpbmdcclxuXHJcbiAgICAgIGlmIChhY3RpdmVJbmRleCA8IGxvb3BlZFNsaWRlcykge1xyXG4gICAgICAgIG5ld0luZGV4ID0gc2xpZGVzLmxlbmd0aCAtIGxvb3BlZFNsaWRlcyAqIDMgKyBhY3RpdmVJbmRleDtcclxuICAgICAgICBuZXdJbmRleCArPSBsb29wZWRTbGlkZXM7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVDaGFuZ2VkID0gc3dpcGVyLnNsaWRlVG8obmV3SW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKHNsaWRlQ2hhbmdlZCAmJiBkaWZmICE9PSAwKSB7XHJcbiAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKChydGwgPyAtc3dpcGVyLnRyYW5zbGF0ZSA6IHN3aXBlci50cmFuc2xhdGUpIC0gZGlmZik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGFjdGl2ZUluZGV4ID49IHNsaWRlcy5sZW5ndGggLSBsb29wZWRTbGlkZXMpIHtcclxuICAgICAgICAvLyBGaXggRm9yIFBvc2l0aXZlIE92ZXJzbGlkaW5nXHJcbiAgICAgICAgbmV3SW5kZXggPSAtc2xpZGVzLmxlbmd0aCArIGFjdGl2ZUluZGV4ICsgbG9vcGVkU2xpZGVzO1xyXG4gICAgICAgIG5ld0luZGV4ICs9IGxvb3BlZFNsaWRlcztcclxuICAgICAgICBjb25zdCBzbGlkZUNoYW5nZWQgPSBzd2lwZXIuc2xpZGVUbyhuZXdJbmRleCwgMCwgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoc2xpZGVDaGFuZ2VkICYmIGRpZmYgIT09IDApIHtcclxuICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2xhdGUoKHJ0bCA/IC1zd2lwZXIudHJhbnNsYXRlIDogc3dpcGVyLnRyYW5zbGF0ZSkgLSBkaWZmKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IGFsbG93U2xpZGVQcmV2O1xyXG4gICAgICBzd2lwZXIuYWxsb3dTbGlkZU5leHQgPSBhbGxvd1NsaWRlTmV4dDtcclxuICAgICAgc3dpcGVyLmVtaXQoJ2xvb3BGaXgnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb29wRGVzdHJveSgpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgICR3cmFwcGVyRWwsXHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgIHNsaWRlc1xyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAkd3JhcHBlckVsLmNoaWxkcmVuKGAuJHtwYXJhbXMuc2xpZGVDbGFzc30uJHtwYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzc30sLiR7cGFyYW1zLnNsaWRlQ2xhc3N9LiR7cGFyYW1zLnNsaWRlQmxhbmtDbGFzc31gKS5yZW1vdmUoKTtcclxuICAgICAgc2xpZGVzLnJlbW92ZUF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvb3AgPSB7XHJcbiAgICAgIGxvb3BDcmVhdGUsXHJcbiAgICAgIGxvb3BGaXgsXHJcbiAgICAgIGxvb3BEZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldEdyYWJDdXJzb3IobW92aW5nKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGlmIChzd2lwZXIuc3VwcG9ydC50b3VjaCB8fCAhc3dpcGVyLnBhcmFtcy5zaW11bGF0ZVRvdWNoIHx8IHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuaXNMb2NrZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSByZXR1cm47XHJcbiAgICAgIGNvbnN0IGVsID0gc3dpcGVyLnBhcmFtcy50b3VjaEV2ZW50c1RhcmdldCA9PT0gJ2NvbnRhaW5lcicgPyBzd2lwZXIuZWwgOiBzd2lwZXIud3JhcHBlckVsO1xyXG4gICAgICBlbC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgIGVsLnN0eWxlLmN1cnNvciA9IG1vdmluZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdW5zZXRHcmFiQ3Vyc29yKCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHN3aXBlci5zdXBwb3J0LnRvdWNoIHx8IHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuaXNMb2NrZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXJbc3dpcGVyLnBhcmFtcy50b3VjaEV2ZW50c1RhcmdldCA9PT0gJ2NvbnRhaW5lcicgPyAnZWwnIDogJ3dyYXBwZXJFbCddLnN0eWxlLmN1cnNvciA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBncmFiQ3Vyc29yID0ge1xyXG4gICAgICBzZXRHcmFiQ3Vyc29yLFxyXG4gICAgICB1bnNldEdyYWJDdXJzb3JcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VzdEVsZW1lbnQoc2VsZWN0b3IsIGJhc2UpIHtcclxuICAgICAgaWYgKGJhc2UgPT09IHZvaWQgMCkge1xyXG4gICAgICAgIGJhc2UgPSB0aGlzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBfX2Nsb3Nlc3RGcm9tKGVsKSB7XHJcbiAgICAgICAgaWYgKCFlbCB8fCBlbCA9PT0gZ2V0RG9jdW1lbnQoKSB8fCBlbCA9PT0gZ2V0V2luZG93KCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmIChlbC5hc3NpZ25lZFNsb3QpIGVsID0gZWwuYXNzaWduZWRTbG90O1xyXG4gICAgICAgIGNvbnN0IGZvdW5kID0gZWwuY2xvc2VzdChzZWxlY3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kIHx8IF9fY2xvc2VzdEZyb20oZWwuZ2V0Um9vdE5vZGUoKS5ob3N0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIF9fY2xvc2VzdEZyb20oYmFzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBzd2lwZXIudG91Y2hFdmVudHNEYXRhO1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgIHRvdWNoZXMsXHJcbiAgICAgICAgZW5hYmxlZFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBpZiAoIWVuYWJsZWQpIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChzd2lwZXIuYW5pbWF0aW5nICYmIHBhcmFtcy5wcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghc3dpcGVyLmFuaW1hdGluZyAmJiBwYXJhbXMuY3NzTW9kZSAmJiBwYXJhbXMubG9vcCkge1xyXG4gICAgICAgIHN3aXBlci5sb29wRml4KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBlID0gZXZlbnQ7XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQpIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XHJcbiAgICAgIGxldCAkdGFyZ2V0RWwgPSAkKGUudGFyZ2V0KTtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMudG91Y2hFdmVudHNUYXJnZXQgPT09ICd3cmFwcGVyJykge1xyXG4gICAgICAgIGlmICghJHRhcmdldEVsLmNsb3Nlc3Qoc3dpcGVyLndyYXBwZXJFbCkubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEuaXNUb3VjaEV2ZW50ID0gZS50eXBlID09PSAndG91Y2hzdGFydCc7XHJcbiAgICAgIGlmICghZGF0YS5pc1RvdWNoRXZlbnQgJiYgJ3doaWNoJyBpbiBlICYmIGUud2hpY2ggPT09IDMpIHJldHVybjtcclxuICAgICAgaWYgKCFkYXRhLmlzVG91Y2hFdmVudCAmJiAnYnV0dG9uJyBpbiBlICYmIGUuYnV0dG9uID4gMCkgcmV0dXJuO1xyXG4gICAgICBpZiAoZGF0YS5pc1RvdWNoZWQgJiYgZGF0YS5pc01vdmVkKSByZXR1cm47IC8vIGNoYW5nZSB0YXJnZXQgZWwgZm9yIHNoYWRvdyByb290IGNvbXBvbmVudFxyXG5cclxuICAgICAgY29uc3Qgc3dpcGluZ0NsYXNzSGFzVmFsdWUgPSAhIXBhcmFtcy5ub1N3aXBpbmdDbGFzcyAmJiBwYXJhbXMubm9Td2lwaW5nQ2xhc3MgIT09ICcnO1xyXG5cclxuICAgICAgaWYgKHN3aXBpbmdDbGFzc0hhc1ZhbHVlICYmIGUudGFyZ2V0ICYmIGUudGFyZ2V0LnNoYWRvd1Jvb3QgJiYgZXZlbnQucGF0aCAmJiBldmVudC5wYXRoWzBdKSB7XHJcbiAgICAgICAgJHRhcmdldEVsID0gJChldmVudC5wYXRoWzBdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgbm9Td2lwaW5nU2VsZWN0b3IgPSBwYXJhbXMubm9Td2lwaW5nU2VsZWN0b3IgPyBwYXJhbXMubm9Td2lwaW5nU2VsZWN0b3IgOiBgLiR7cGFyYW1zLm5vU3dpcGluZ0NsYXNzfWA7XHJcbiAgICAgIGNvbnN0IGlzVGFyZ2V0U2hhZG93ID0gISEoZS50YXJnZXQgJiYgZS50YXJnZXQuc2hhZG93Um9vdCk7IC8vIHVzZSBjbG9zZXN0RWxlbWVudCBmb3Igc2hhZG93IHJvb3QgZWxlbWVudCB0byBnZXQgdGhlIGFjdHVhbCBjbG9zZXN0IGZvciBuZXN0ZWQgc2hhZG93IHJvb3QgZWxlbWVudFxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5ub1N3aXBpbmcgJiYgKGlzVGFyZ2V0U2hhZG93ID8gY2xvc2VzdEVsZW1lbnQobm9Td2lwaW5nU2VsZWN0b3IsIGUudGFyZ2V0KSA6ICR0YXJnZXRFbC5jbG9zZXN0KG5vU3dpcGluZ1NlbGVjdG9yKVswXSkpIHtcclxuICAgICAgICBzd2lwZXIuYWxsb3dDbGljayA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLnN3aXBlSGFuZGxlcikge1xyXG4gICAgICAgIGlmICghJHRhcmdldEVsLmNsb3Nlc3QocGFyYW1zLnN3aXBlSGFuZGxlcilbMF0pIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdG91Y2hlcy5jdXJyZW50WCA9IGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYIDogZS5wYWdlWDtcclxuICAgICAgdG91Y2hlcy5jdXJyZW50WSA9IGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZIDogZS5wYWdlWTtcclxuICAgICAgY29uc3Qgc3RhcnRYID0gdG91Y2hlcy5jdXJyZW50WDtcclxuICAgICAgY29uc3Qgc3RhcnRZID0gdG91Y2hlcy5jdXJyZW50WTsgLy8gRG8gTk9UIHN0YXJ0IGlmIGlPUyBlZGdlIHN3aXBlIGlzIGRldGVjdGVkLiBPdGhlcndpc2UgaU9TIGFwcCBjYW5ub3Qgc3dpcGUtdG8tZ28tYmFjayBhbnltb3JlXHJcblxyXG4gICAgICBjb25zdCBlZGdlU3dpcGVEZXRlY3Rpb24gPSBwYXJhbXMuZWRnZVN3aXBlRGV0ZWN0aW9uIHx8IHBhcmFtcy5pT1NFZGdlU3dpcGVEZXRlY3Rpb247XHJcbiAgICAgIGNvbnN0IGVkZ2VTd2lwZVRocmVzaG9sZCA9IHBhcmFtcy5lZGdlU3dpcGVUaHJlc2hvbGQgfHwgcGFyYW1zLmlPU0VkZ2VTd2lwZVRocmVzaG9sZDtcclxuXHJcbiAgICAgIGlmIChlZGdlU3dpcGVEZXRlY3Rpb24gJiYgKHN0YXJ0WCA8PSBlZGdlU3dpcGVUaHJlc2hvbGQgfHwgc3RhcnRYID49IHdpbmRvdy5pbm5lcldpZHRoIC0gZWRnZVN3aXBlVGhyZXNob2xkKSkge1xyXG4gICAgICAgIGlmIChlZGdlU3dpcGVEZXRlY3Rpb24gPT09ICdwcmV2ZW50Jykge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLCB7XHJcbiAgICAgICAgaXNUb3VjaGVkOiB0cnVlLFxyXG4gICAgICAgIGlzTW92ZWQ6IGZhbHNlLFxyXG4gICAgICAgIGFsbG93VG91Y2hDYWxsYmFja3M6IHRydWUsXHJcbiAgICAgICAgaXNTY3JvbGxpbmc6IHVuZGVmaW5lZCxcclxuICAgICAgICBzdGFydE1vdmluZzogdW5kZWZpbmVkXHJcbiAgICAgIH0pO1xyXG4gICAgICB0b3VjaGVzLnN0YXJ0WCA9IHN0YXJ0WDtcclxuICAgICAgdG91Y2hlcy5zdGFydFkgPSBzdGFydFk7XHJcbiAgICAgIGRhdGEudG91Y2hTdGFydFRpbWUgPSBub3coKTtcclxuICAgICAgc3dpcGVyLmFsbG93Q2xpY2sgPSB0cnVlO1xyXG4gICAgICBzd2lwZXIudXBkYXRlU2l6ZSgpO1xyXG4gICAgICBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgIGlmIChwYXJhbXMudGhyZXNob2xkID4gMCkgZGF0YS5hbGxvd1RocmVzaG9sZE1vdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmIChlLnR5cGUgIT09ICd0b3VjaHN0YXJ0Jykge1xyXG4gICAgICAgIGxldCBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmICgkdGFyZ2V0RWwuaXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykpIHtcclxuICAgICAgICAgIHByZXZlbnREZWZhdWx0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgaWYgKCR0YXJnZXRFbFswXS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcpIHtcclxuICAgICAgICAgICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gJHRhcmdldEVsWzBdKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZFByZXZlbnREZWZhdWx0ID0gcHJldmVudERlZmF1bHQgJiYgc3dpcGVyLmFsbG93VG91Y2hNb3ZlICYmIHBhcmFtcy50b3VjaFN0YXJ0UHJldmVudERlZmF1bHQ7XHJcblxyXG4gICAgICAgIGlmICgocGFyYW1zLnRvdWNoU3RhcnRGb3JjZVByZXZlbnREZWZhdWx0IHx8IHNob3VsZFByZXZlbnREZWZhdWx0KSAmJiAhJHRhcmdldEVsWzBdLmlzQ29udGVudEVkaXRhYmxlKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy5mcmVlTW9kZSAmJiBzd2lwZXIucGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQgJiYgc3dpcGVyLmZyZWVNb2RlICYmIHN3aXBlci5hbmltYXRpbmcgJiYgIXBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hTdGFydCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuZW1pdCgndG91Y2hTdGFydCcsIGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3QgZGF0YSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGE7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgdG91Y2hlcyxcclxuICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcclxuICAgICAgICBlbmFibGVkXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgIGlmICghZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICBsZXQgZSA9IGV2ZW50O1xyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xyXG5cclxuICAgICAgaWYgKCFkYXRhLmlzVG91Y2hlZCkge1xyXG4gICAgICAgIGlmIChkYXRhLnN0YXJ0TW92aW5nICYmIGRhdGEuaXNTY3JvbGxpbmcpIHtcclxuICAgICAgICAgIHN3aXBlci5lbWl0KCd0b3VjaE1vdmVPcHBvc2l0ZScsIGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZGF0YS5pc1RvdWNoRXZlbnQgJiYgZS50eXBlICE9PSAndG91Y2htb3ZlJykgcmV0dXJuO1xyXG4gICAgICBjb25zdCB0YXJnZXRUb3VjaCA9IGUudHlwZSA9PT0gJ3RvdWNobW92ZScgJiYgZS50YXJnZXRUb3VjaGVzICYmIChlLnRhcmdldFRvdWNoZXNbMF0gfHwgZS5jaGFuZ2VkVG91Y2hlc1swXSk7XHJcbiAgICAgIGNvbnN0IHBhZ2VYID0gZS50eXBlID09PSAndG91Y2htb3ZlJyA/IHRhcmdldFRvdWNoLnBhZ2VYIDogZS5wYWdlWDtcclxuICAgICAgY29uc3QgcGFnZVkgPSBlLnR5cGUgPT09ICd0b3VjaG1vdmUnID8gdGFyZ2V0VG91Y2gucGFnZVkgOiBlLnBhZ2VZO1xyXG5cclxuICAgICAgaWYgKGUucHJldmVudGVkQnlOZXN0ZWRTd2lwZXIpIHtcclxuICAgICAgICB0b3VjaGVzLnN0YXJ0WCA9IHBhZ2VYO1xyXG4gICAgICAgIHRvdWNoZXMuc3RhcnRZID0gcGFnZVk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXN3aXBlci5hbGxvd1RvdWNoTW92ZSkge1xyXG4gICAgICAgIGlmICghJChlLnRhcmdldCkuaXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykpIHtcclxuICAgICAgICAgIHN3aXBlci5hbGxvd0NsaWNrID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5pc1RvdWNoZWQpIHtcclxuICAgICAgICAgIE9iamVjdC5hc3NpZ24odG91Y2hlcywge1xyXG4gICAgICAgICAgICBzdGFydFg6IHBhZ2VYLFxyXG4gICAgICAgICAgICBzdGFydFk6IHBhZ2VZLFxyXG4gICAgICAgICAgICBjdXJyZW50WDogcGFnZVgsXHJcbiAgICAgICAgICAgIGN1cnJlbnRZOiBwYWdlWVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBkYXRhLnRvdWNoU3RhcnRUaW1lID0gbm93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkYXRhLmlzVG91Y2hFdmVudCAmJiBwYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcyAmJiAhcGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBpZiAoc3dpcGVyLmlzVmVydGljYWwoKSkge1xyXG4gICAgICAgICAgLy8gVmVydGljYWxcclxuICAgICAgICAgIGlmIChwYWdlWSA8IHRvdWNoZXMuc3RhcnRZICYmIHN3aXBlci50cmFuc2xhdGUgPD0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpIHx8IHBhZ2VZID4gdG91Y2hlcy5zdGFydFkgJiYgc3dpcGVyLnRyYW5zbGF0ZSA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcclxuICAgICAgICAgICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHBhZ2VYIDwgdG91Y2hlcy5zdGFydFggJiYgc3dpcGVyLnRyYW5zbGF0ZSA8PSBzd2lwZXIubWF4VHJhbnNsYXRlKCkgfHwgcGFnZVggPiB0b3VjaGVzLnN0YXJ0WCAmJiBzd2lwZXIudHJhbnNsYXRlID49IHN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEuaXNUb3VjaEV2ZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgJChlLnRhcmdldCkuaXMoZGF0YS5mb2N1c2FibGVFbGVtZW50cykpIHtcclxuICAgICAgICAgIGRhdGEuaXNNb3ZlZCA9IHRydWU7XHJcbiAgICAgICAgICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEuYWxsb3dUb3VjaENhbGxiYWNrcykge1xyXG4gICAgICAgIHN3aXBlci5lbWl0KCd0b3VjaE1vdmUnLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUudGFyZ2V0VG91Y2hlcyAmJiBlLnRhcmdldFRvdWNoZXMubGVuZ3RoID4gMSkgcmV0dXJuO1xyXG4gICAgICB0b3VjaGVzLmN1cnJlbnRYID0gcGFnZVg7XHJcbiAgICAgIHRvdWNoZXMuY3VycmVudFkgPSBwYWdlWTtcclxuICAgICAgY29uc3QgZGlmZlggPSB0b3VjaGVzLmN1cnJlbnRYIC0gdG91Y2hlcy5zdGFydFg7XHJcbiAgICAgIGNvbnN0IGRpZmZZID0gdG91Y2hlcy5jdXJyZW50WSAtIHRvdWNoZXMuc3RhcnRZO1xyXG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy50aHJlc2hvbGQgJiYgTWF0aC5zcXJ0KGRpZmZYICoqIDIgKyBkaWZmWSAqKiAyKSA8IHN3aXBlci5wYXJhbXMudGhyZXNob2xkKSByZXR1cm47XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGRhdGEuaXNTY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgbGV0IHRvdWNoQW5nbGU7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgdG91Y2hlcy5jdXJyZW50WSA9PT0gdG91Y2hlcy5zdGFydFkgfHwgc3dpcGVyLmlzVmVydGljYWwoKSAmJiB0b3VjaGVzLmN1cnJlbnRYID09PSB0b3VjaGVzLnN0YXJ0WCkge1xyXG4gICAgICAgICAgZGF0YS5pc1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgICAgICAgIGlmIChkaWZmWCAqIGRpZmZYICsgZGlmZlkgKiBkaWZmWSA+PSAyNSkge1xyXG4gICAgICAgICAgICB0b3VjaEFuZ2xlID0gTWF0aC5hdGFuMihNYXRoLmFicyhkaWZmWSksIE1hdGguYWJzKGRpZmZYKSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgICAgICAgICBkYXRhLmlzU2Nyb2xsaW5nID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gdG91Y2hBbmdsZSA+IHBhcmFtcy50b3VjaEFuZ2xlIDogOTAgLSB0b3VjaEFuZ2xlID4gcGFyYW1zLnRvdWNoQW5nbGU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZGF0YS5pc1Njcm9sbGluZykge1xyXG4gICAgICAgIHN3aXBlci5lbWl0KCd0b3VjaE1vdmVPcHBvc2l0ZScsIGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGRhdGEuc3RhcnRNb3ZpbmcgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaWYgKHRvdWNoZXMuY3VycmVudFggIT09IHRvdWNoZXMuc3RhcnRYIHx8IHRvdWNoZXMuY3VycmVudFkgIT09IHRvdWNoZXMuc3RhcnRZKSB7XHJcbiAgICAgICAgICBkYXRhLnN0YXJ0TW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkYXRhLmlzU2Nyb2xsaW5nKSB7XHJcbiAgICAgICAgZGF0YS5pc1RvdWNoZWQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghZGF0YS5zdGFydE1vdmluZykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLmFsbG93Q2xpY2sgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghcGFyYW1zLmNzc01vZGUgJiYgZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLnRvdWNoTW92ZVN0b3BQcm9wYWdhdGlvbiAmJiAhcGFyYW1zLm5lc3RlZCkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghZGF0YS5pc01vdmVkKSB7XHJcbiAgICAgICAgaWYgKHBhcmFtcy5sb29wICYmICFwYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRhdGEuc3RhcnRUcmFuc2xhdGUgPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zaXRpb24oMCk7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIuYW5pbWF0aW5nKSB7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC50cmlnZ2VyKCd3ZWJraXRUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRhdGEuYWxsb3dNb21lbnR1bUJvdW5jZSA9IGZhbHNlOyAvLyBHcmFiIEN1cnNvclxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmdyYWJDdXJzb3IgJiYgKHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9PT0gdHJ1ZSB8fCBzd2lwZXIuYWxsb3dTbGlkZVByZXYgPT09IHRydWUpKSB7XHJcbiAgICAgICAgICBzd2lwZXIuc2V0R3JhYkN1cnNvcih0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXBlci5lbWl0KCdzbGlkZXJGaXJzdE1vdmUnLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLmVtaXQoJ3NsaWRlck1vdmUnLCBlKTtcclxuICAgICAgZGF0YS5pc01vdmVkID0gdHJ1ZTtcclxuICAgICAgbGV0IGRpZmYgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyBkaWZmWCA6IGRpZmZZO1xyXG4gICAgICB0b3VjaGVzLmRpZmYgPSBkaWZmO1xyXG4gICAgICBkaWZmICo9IHBhcmFtcy50b3VjaFJhdGlvO1xyXG4gICAgICBpZiAocnRsKSBkaWZmID0gLWRpZmY7XHJcbiAgICAgIHN3aXBlci5zd2lwZURpcmVjdGlvbiA9IGRpZmYgPiAwID8gJ3ByZXYnIDogJ25leHQnO1xyXG4gICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkaWZmICsgZGF0YS5zdGFydFRyYW5zbGF0ZTtcclxuICAgICAgbGV0IGRpc2FibGVQYXJlbnRTd2lwZXIgPSB0cnVlO1xyXG4gICAgICBsZXQgcmVzaXN0YW5jZVJhdGlvID0gcGFyYW1zLnJlc2lzdGFuY2VSYXRpbztcclxuXHJcbiAgICAgIGlmIChwYXJhbXMudG91Y2hSZWxlYXNlT25FZGdlcykge1xyXG4gICAgICAgIHJlc2lzdGFuY2VSYXRpbyA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkaWZmID4gMCAmJiBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPiBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHtcclxuICAgICAgICBkaXNhYmxlUGFyZW50U3dpcGVyID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHBhcmFtcy5yZXNpc3RhbmNlKSBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBzd2lwZXIubWluVHJhbnNsYXRlKCkgLSAxICsgKC1zd2lwZXIubWluVHJhbnNsYXRlKCkgKyBkYXRhLnN0YXJ0VHJhbnNsYXRlICsgZGlmZikgKiogcmVzaXN0YW5jZVJhdGlvO1xyXG4gICAgICB9IGVsc2UgaWYgKGRpZmYgPCAwICYmIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA8IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xyXG4gICAgICAgIGRpc2FibGVQYXJlbnRTd2lwZXIgPSBmYWxzZTtcclxuICAgICAgICBpZiAocGFyYW1zLnJlc2lzdGFuY2UpIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSArIDEgLSAoc3dpcGVyLm1heFRyYW5zbGF0ZSgpIC0gZGF0YS5zdGFydFRyYW5zbGF0ZSAtIGRpZmYpICoqIHJlc2lzdGFuY2VSYXRpbztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRpc2FibGVQYXJlbnRTd2lwZXIpIHtcclxuICAgICAgICBlLnByZXZlbnRlZEJ5TmVzdGVkU3dpcGVyID0gdHJ1ZTtcclxuICAgICAgfSAvLyBEaXJlY3Rpb25zIGxvY2tzXHJcblxyXG5cclxuICAgICAgaWYgKCFzd2lwZXIuYWxsb3dTbGlkZU5leHQgJiYgc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcgJiYgZGF0YS5jdXJyZW50VHJhbnNsYXRlIDwgZGF0YS5zdGFydFRyYW5zbGF0ZSkge1xyXG4gICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghc3dpcGVyLmFsbG93U2xpZGVQcmV2ICYmIHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ3ByZXYnICYmIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA+IGRhdGEuc3RhcnRUcmFuc2xhdGUpIHtcclxuICAgICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkYXRhLnN0YXJ0VHJhbnNsYXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiAhc3dpcGVyLmFsbG93U2xpZGVOZXh0KSB7XHJcbiAgICAgICAgZGF0YS5jdXJyZW50VHJhbnNsYXRlID0gZGF0YS5zdGFydFRyYW5zbGF0ZTtcclxuICAgICAgfSAvLyBUaHJlc2hvbGRcclxuXHJcblxyXG4gICAgICBpZiAocGFyYW1zLnRocmVzaG9sZCA+IDApIHtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZikgPiBwYXJhbXMudGhyZXNob2xkIHx8IGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlKSB7XHJcbiAgICAgICAgICBpZiAoIWRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlKSB7XHJcbiAgICAgICAgICAgIGRhdGEuYWxsb3dUaHJlc2hvbGRNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdG91Y2hlcy5zdGFydFggPSB0b3VjaGVzLmN1cnJlbnRYO1xyXG4gICAgICAgICAgICB0b3VjaGVzLnN0YXJ0WSA9IHRvdWNoZXMuY3VycmVudFk7XHJcbiAgICAgICAgICAgIGRhdGEuY3VycmVudFRyYW5zbGF0ZSA9IGRhdGEuc3RhcnRUcmFuc2xhdGU7XHJcbiAgICAgICAgICAgIHRvdWNoZXMuZGlmZiA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/IHRvdWNoZXMuY3VycmVudFggLSB0b3VjaGVzLnN0YXJ0WCA6IHRvdWNoZXMuY3VycmVudFkgLSB0b3VjaGVzLnN0YXJ0WTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPSBkYXRhLnN0YXJ0VHJhbnNsYXRlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXJhbXMuZm9sbG93RmluZ2VyIHx8IHBhcmFtcy5jc3NNb2RlKSByZXR1cm47IC8vIFVwZGF0ZSBhY3RpdmUgaW5kZXggaW4gZnJlZSBtb2RlXHJcblxyXG4gICAgICBpZiAocGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIHN3aXBlci5mcmVlTW9kZSB8fCBwYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcykge1xyXG4gICAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xyXG4gICAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkICYmIHN3aXBlci5mcmVlTW9kZSkge1xyXG4gICAgICAgIHN3aXBlci5mcmVlTW9kZS5vblRvdWNoTW92ZSgpO1xyXG4gICAgICB9IC8vIFVwZGF0ZSBwcm9ncmVzc1xyXG5cclxuXHJcbiAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhkYXRhLmN1cnJlbnRUcmFuc2xhdGUpOyAvLyBVcGRhdGUgdHJhbnNsYXRlXHJcblxyXG4gICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKGRhdGEuY3VycmVudFRyYW5zbGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCBkYXRhID0gc3dpcGVyLnRvdWNoRXZlbnRzRGF0YTtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICB0b3VjaGVzLFxyXG4gICAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsLFxyXG4gICAgICAgIHNsaWRlc0dyaWQsXHJcbiAgICAgICAgZW5hYmxlZFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBpZiAoIWVuYWJsZWQpIHJldHVybjtcclxuICAgICAgbGV0IGUgPSBldmVudDtcclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDtcclxuXHJcbiAgICAgIGlmIChkYXRhLmFsbG93VG91Y2hDYWxsYmFja3MpIHtcclxuICAgICAgICBzd2lwZXIuZW1pdCgndG91Y2hFbmQnLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YS5hbGxvd1RvdWNoQ2FsbGJhY2tzID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoIWRhdGEuaXNUb3VjaGVkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEuaXNNb3ZlZCAmJiBwYXJhbXMuZ3JhYkN1cnNvcikge1xyXG4gICAgICAgICAgc3dpcGVyLnNldEdyYWJDdXJzb3IoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YS5pc01vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgZGF0YS5zdGFydE1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSAvLyBSZXR1cm4gR3JhYiBDdXJzb3JcclxuXHJcblxyXG4gICAgICBpZiAocGFyYW1zLmdyYWJDdXJzb3IgJiYgZGF0YS5pc01vdmVkICYmIGRhdGEuaXNUb3VjaGVkICYmIChzd2lwZXIuYWxsb3dTbGlkZU5leHQgPT09IHRydWUgfHwgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID09PSB0cnVlKSkge1xyXG4gICAgICAgIHN3aXBlci5zZXRHcmFiQ3Vyc29yKGZhbHNlKTtcclxuICAgICAgfSAvLyBUaW1lIGRpZmZcclxuXHJcblxyXG4gICAgICBjb25zdCB0b3VjaEVuZFRpbWUgPSBub3coKTtcclxuICAgICAgY29uc3QgdGltZURpZmYgPSB0b3VjaEVuZFRpbWUgLSBkYXRhLnRvdWNoU3RhcnRUaW1lOyAvLyBUYXAsIGRvdWJsZVRhcCwgQ2xpY2tcclxuXHJcbiAgICAgIGlmIChzd2lwZXIuYWxsb3dDbGljaykge1xyXG4gICAgICAgIGNvbnN0IHBhdGhUcmVlID0gZS5wYXRoIHx8IGUuY29tcG9zZWRQYXRoICYmIGUuY29tcG9zZWRQYXRoKCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZUNsaWNrZWRTbGlkZShwYXRoVHJlZSAmJiBwYXRoVHJlZVswXSB8fCBlLnRhcmdldCk7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ3RhcCBjbGljaycsIGUpO1xyXG5cclxuICAgICAgICBpZiAodGltZURpZmYgPCAzMDAgJiYgdG91Y2hFbmRUaW1lIC0gZGF0YS5sYXN0Q2xpY2tUaW1lIDwgMzAwKSB7XHJcbiAgICAgICAgICBzd2lwZXIuZW1pdCgnZG91YmxlVGFwIGRvdWJsZUNsaWNrJywgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhLmxhc3RDbGlja1RpbWUgPSBub3coKTtcclxuICAgICAgbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmRlc3Ryb3llZCkgc3dpcGVyLmFsbG93Q2xpY2sgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICghZGF0YS5pc1RvdWNoZWQgfHwgIWRhdGEuaXNNb3ZlZCB8fCAhc3dpcGVyLnN3aXBlRGlyZWN0aW9uIHx8IHRvdWNoZXMuZGlmZiA9PT0gMCB8fCBkYXRhLmN1cnJlbnRUcmFuc2xhdGUgPT09IGRhdGEuc3RhcnRUcmFuc2xhdGUpIHtcclxuICAgICAgICBkYXRhLmlzVG91Y2hlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRhdGEuaXNNb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRhdGEuc3RhcnRNb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEuaXNUb3VjaGVkID0gZmFsc2U7XHJcbiAgICAgIGRhdGEuaXNNb3ZlZCA9IGZhbHNlO1xyXG4gICAgICBkYXRhLnN0YXJ0TW92aW5nID0gZmFsc2U7XHJcbiAgICAgIGxldCBjdXJyZW50UG9zO1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5mb2xsb3dGaW5nZXIpIHtcclxuICAgICAgICBjdXJyZW50UG9zID0gcnRsID8gc3dpcGVyLnRyYW5zbGF0ZSA6IC1zd2lwZXIudHJhbnNsYXRlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN1cnJlbnRQb3MgPSAtZGF0YS5jdXJyZW50VHJhbnNsYXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlICYmIHBhcmFtcy5mcmVlTW9kZS5lbmFibGVkKSB7XHJcbiAgICAgICAgc3dpcGVyLmZyZWVNb2RlLm9uVG91Y2hFbmQoe1xyXG4gICAgICAgICAgY3VycmVudFBvc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSAvLyBGaW5kIGN1cnJlbnQgc2xpZGVcclxuXHJcblxyXG4gICAgICBsZXQgc3RvcEluZGV4ID0gMDtcclxuICAgICAgbGV0IGdyb3VwU2l6ZSA9IHN3aXBlci5zbGlkZXNTaXplc0dyaWRbMF07XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0dyaWQubGVuZ3RoOyBpICs9IGkgPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwID8gMSA6IHBhcmFtcy5zbGlkZXNQZXJHcm91cCkge1xyXG4gICAgICAgIGNvbnN0IGluY3JlbWVudCA9IGkgPCBwYXJhbXMuc2xpZGVzUGVyR3JvdXBTa2lwIC0gMSA/IDEgOiBwYXJhbXMuc2xpZGVzUGVyR3JvdXA7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygc2xpZGVzR3JpZFtpICsgaW5jcmVtZW50XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGlmIChjdXJyZW50UG9zID49IHNsaWRlc0dyaWRbaV0gJiYgY3VycmVudFBvcyA8IHNsaWRlc0dyaWRbaSArIGluY3JlbWVudF0pIHtcclxuICAgICAgICAgICAgc3RvcEluZGV4ID0gaTtcclxuICAgICAgICAgICAgZ3JvdXBTaXplID0gc2xpZGVzR3JpZFtpICsgaW5jcmVtZW50XSAtIHNsaWRlc0dyaWRbaV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50UG9zID49IHNsaWRlc0dyaWRbaV0pIHtcclxuICAgICAgICAgIHN0b3BJbmRleCA9IGk7XHJcbiAgICAgICAgICBncm91cFNpemUgPSBzbGlkZXNHcmlkW3NsaWRlc0dyaWQubGVuZ3RoIC0gMV0gLSBzbGlkZXNHcmlkW3NsaWRlc0dyaWQubGVuZ3RoIC0gMl07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcmV3aW5kRmlyc3RJbmRleCA9IG51bGw7XHJcbiAgICAgIGxldCByZXdpbmRMYXN0SW5kZXggPSBudWxsO1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5yZXdpbmQpIHtcclxuICAgICAgICBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nKSB7XHJcbiAgICAgICAgICByZXdpbmRMYXN0SW5kZXggPSBzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwgPyBzd2lwZXIudmlydHVhbC5zbGlkZXMubGVuZ3RoIC0gMSA6IHN3aXBlci5zbGlkZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN3aXBlci5pc0VuZCkge1xyXG4gICAgICAgICAgcmV3aW5kRmlyc3RJbmRleCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IC8vIEZpbmQgY3VycmVudCBzbGlkZSBzaXplXHJcblxyXG5cclxuICAgICAgY29uc3QgcmF0aW8gPSAoY3VycmVudFBvcyAtIHNsaWRlc0dyaWRbc3RvcEluZGV4XSkgLyBncm91cFNpemU7XHJcbiAgICAgIGNvbnN0IGluY3JlbWVudCA9IHN0b3BJbmRleCA8IHBhcmFtcy5zbGlkZXNQZXJHcm91cFNraXAgLSAxID8gMSA6IHBhcmFtcy5zbGlkZXNQZXJHcm91cDtcclxuXHJcbiAgICAgIGlmICh0aW1lRGlmZiA+IHBhcmFtcy5sb25nU3dpcGVzTXMpIHtcclxuICAgICAgICAvLyBMb25nIHRvdWNoZXNcclxuICAgICAgICBpZiAoIXBhcmFtcy5sb25nU3dpcGVzKSB7XHJcbiAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuYWN0aXZlSW5kZXgpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5zd2lwZURpcmVjdGlvbiA9PT0gJ25leHQnKSB7XHJcbiAgICAgICAgICBpZiAocmF0aW8gPj0gcGFyYW1zLmxvbmdTd2lwZXNSYXRpbykgc3dpcGVyLnNsaWRlVG8ocGFyYW1zLnJld2luZCAmJiBzd2lwZXIuaXNFbmQgPyByZXdpbmRGaXJzdEluZGV4IDogc3RvcEluZGV4ICsgaW5jcmVtZW50KTtlbHNlIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICAgIGlmIChyYXRpbyA+IDEgLSBwYXJhbXMubG9uZ1N3aXBlc1JhdGlvKSB7XHJcbiAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHN0b3BJbmRleCArIGluY3JlbWVudCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHJld2luZExhc3RJbmRleCAhPT0gbnVsbCAmJiByYXRpbyA8IDAgJiYgTWF0aC5hYnMocmF0aW8pID4gcGFyYW1zLmxvbmdTd2lwZXNSYXRpbykge1xyXG4gICAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhyZXdpbmRMYXN0SW5kZXgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3RvcEluZGV4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gU2hvcnQgc3dpcGVzXHJcbiAgICAgICAgaWYgKCFwYXJhbXMuc2hvcnRTd2lwZXMpIHtcclxuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5hY3RpdmVJbmRleCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpc05hdkJ1dHRvblRhcmdldCA9IHN3aXBlci5uYXZpZ2F0aW9uICYmIChlLnRhcmdldCA9PT0gc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsIHx8IGUudGFyZ2V0ID09PSBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwpO1xyXG5cclxuICAgICAgICBpZiAoIWlzTmF2QnV0dG9uVGFyZ2V0KSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8ocmV3aW5kRmlyc3RJbmRleCAhPT0gbnVsbCA/IHJld2luZEZpcnN0SW5kZXggOiBzdG9wSW5kZXggKyBpbmNyZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICdwcmV2Jykge1xyXG4gICAgICAgICAgICBzd2lwZXIuc2xpZGVUbyhyZXdpbmRMYXN0SW5kZXggIT09IG51bGwgPyByZXdpbmRMYXN0SW5kZXggOiBzdG9wSW5kZXgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQgPT09IHN3aXBlci5uYXZpZ2F0aW9uLm5leHRFbCkge1xyXG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3RvcEluZGV4ICsgaW5jcmVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3RvcEluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICBlbFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBpZiAoZWwgJiYgZWwub2Zmc2V0V2lkdGggPT09IDApIHJldHVybjsgLy8gQnJlYWtwb2ludHNcclxuXHJcbiAgICAgIGlmIChwYXJhbXMuYnJlYWtwb2ludHMpIHtcclxuICAgICAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xyXG4gICAgICB9IC8vIFNhdmUgbG9ja3NcclxuXHJcblxyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgYWxsb3dTbGlkZU5leHQsXHJcbiAgICAgICAgYWxsb3dTbGlkZVByZXYsXHJcbiAgICAgICAgc25hcEdyaWRcclxuICAgICAgfSA9IHN3aXBlcjsgLy8gRGlzYWJsZSBsb2NrcyBvbiByZXNpemVcclxuXHJcbiAgICAgIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IHRydWU7XHJcbiAgICAgIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9IHRydWU7XHJcbiAgICAgIHN3aXBlci51cGRhdGVTaXplKCk7XHJcbiAgICAgIHN3aXBlci51cGRhdGVTbGlkZXMoKTtcclxuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuXHJcbiAgICAgIGlmICgocGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyB8fCBwYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpICYmIHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxLCAwLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzd2lwZXIuYXV0b3BsYXkgJiYgc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcgJiYgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkge1xyXG4gICAgICAgIHN3aXBlci5hdXRvcGxheS5ydW4oKTtcclxuICAgICAgfSAvLyBSZXR1cm4gbG9ja3MgYWZ0ZXIgcmVzaXplXHJcblxyXG5cclxuICAgICAgc3dpcGVyLmFsbG93U2xpZGVQcmV2ID0gYWxsb3dTbGlkZVByZXY7XHJcbiAgICAgIHN3aXBlci5hbGxvd1NsaWRlTmV4dCA9IGFsbG93U2xpZGVOZXh0O1xyXG5cclxuICAgICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzbmFwR3JpZCAhPT0gc3dpcGVyLnNuYXBHcmlkKSB7XHJcbiAgICAgICAgc3dpcGVyLmNoZWNrT3ZlcmZsb3coKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICBpZiAoIXN3aXBlci5hbGxvd0NsaWNrKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMucHJldmVudENsaWNrcykgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5wcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb24gJiYgc3dpcGVyLmFuaW1hdGluZykge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TY3JvbGwoKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICB3cmFwcGVyRWwsXHJcbiAgICAgICAgcnRsVHJhbnNsYXRlLFxyXG4gICAgICAgIGVuYWJsZWRcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgaWYgKCFlbmFibGVkKSByZXR1cm47XHJcbiAgICAgIHN3aXBlci5wcmV2aW91c1RyYW5zbGF0ZSA9IHN3aXBlci50cmFuc2xhdGU7XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XHJcbiAgICAgICAgc3dpcGVyLnRyYW5zbGF0ZSA9IC13cmFwcGVyRWwuc2Nyb2xsTGVmdDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2lwZXIudHJhbnNsYXRlID0gLXdyYXBwZXJFbC5zY3JvbGxUb3A7XHJcbiAgICAgIH0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcblxyXG5cclxuICAgICAgaWYgKHN3aXBlci50cmFuc2xhdGUgPT09IDApIHN3aXBlci50cmFuc2xhdGUgPSAwO1xyXG4gICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcclxuICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuICAgICAgbGV0IG5ld1Byb2dyZXNzO1xyXG4gICAgICBjb25zdCB0cmFuc2xhdGVzRGlmZiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKTtcclxuXHJcbiAgICAgIGlmICh0cmFuc2xhdGVzRGlmZiA9PT0gMCkge1xyXG4gICAgICAgIG5ld1Byb2dyZXNzID0gMDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdQcm9ncmVzcyA9IChzd2lwZXIudHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAvIHRyYW5zbGF0ZXNEaWZmO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmV3UHJvZ3Jlc3MgIT09IHN3aXBlci5wcm9ncmVzcykge1xyXG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhydGxUcmFuc2xhdGUgPyAtc3dpcGVyLnRyYW5zbGF0ZSA6IHN3aXBlci50cmFuc2xhdGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuZW1pdCgnc2V0VHJhbnNsYXRlJywgc3dpcGVyLnRyYW5zbGF0ZSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkdW1teUV2ZW50QXR0YWNoZWQgPSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiBkdW1teUV2ZW50TGlzdGVuZXIoKSB7fVxyXG5cclxuICAgIGNvbnN0IGV2ZW50cyA9IChzd2lwZXIsIG1ldGhvZCkgPT4ge1xyXG4gICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgdG91Y2hFdmVudHMsXHJcbiAgICAgICAgZWwsXHJcbiAgICAgICAgd3JhcHBlckVsLFxyXG4gICAgICAgIGRldmljZSxcclxuICAgICAgICBzdXBwb3J0XHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgIGNvbnN0IGNhcHR1cmUgPSAhIXBhcmFtcy5uZXN0ZWQ7XHJcbiAgICAgIGNvbnN0IGRvbU1ldGhvZCA9IG1ldGhvZCA9PT0gJ29uJyA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdyZW1vdmVFdmVudExpc3RlbmVyJztcclxuICAgICAgY29uc3Qgc3dpcGVyTWV0aG9kID0gbWV0aG9kOyAvLyBUb3VjaCBFdmVudHNcclxuXHJcbiAgICAgIGlmICghc3VwcG9ydC50b3VjaCkge1xyXG4gICAgICAgIGVsW2RvbU1ldGhvZF0odG91Y2hFdmVudHMuc3RhcnQsIHN3aXBlci5vblRvdWNoU3RhcnQsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudFtkb21NZXRob2RdKHRvdWNoRXZlbnRzLm1vdmUsIHN3aXBlci5vblRvdWNoTW92ZSwgY2FwdHVyZSk7XHJcbiAgICAgICAgZG9jdW1lbnRbZG9tTWV0aG9kXSh0b3VjaEV2ZW50cy5lbmQsIHN3aXBlci5vblRvdWNoRW5kLCBmYWxzZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gdG91Y2hFdmVudHMuc3RhcnQgPT09ICd0b3VjaHN0YXJ0JyAmJiBzdXBwb3J0LnBhc3NpdmVMaXN0ZW5lciAmJiBwYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcclxuICAgICAgICAgIHBhc3NpdmU6IHRydWUsXHJcbiAgICAgICAgICBjYXB0dXJlOiBmYWxzZVxyXG4gICAgICAgIH0gOiBmYWxzZTtcclxuICAgICAgICBlbFtkb21NZXRob2RdKHRvdWNoRXZlbnRzLnN0YXJ0LCBzd2lwZXIub25Ub3VjaFN0YXJ0LCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgIGVsW2RvbU1ldGhvZF0odG91Y2hFdmVudHMubW92ZSwgc3dpcGVyLm9uVG91Y2hNb3ZlLCBzdXBwb3J0LnBhc3NpdmVMaXN0ZW5lciA/IHtcclxuICAgICAgICAgIHBhc3NpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgY2FwdHVyZVxyXG4gICAgICAgIH0gOiBjYXB0dXJlKTtcclxuICAgICAgICBlbFtkb21NZXRob2RdKHRvdWNoRXZlbnRzLmVuZCwgc3dpcGVyLm9uVG91Y2hFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIGlmICh0b3VjaEV2ZW50cy5jYW5jZWwpIHtcclxuICAgICAgICAgIGVsW2RvbU1ldGhvZF0odG91Y2hFdmVudHMuY2FuY2VsLCBzd2lwZXIub25Ub3VjaEVuZCwgcGFzc2l2ZUxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gLy8gUHJldmVudCBMaW5rcyBDbGlja3NcclxuXHJcblxyXG4gICAgICBpZiAocGFyYW1zLnByZXZlbnRDbGlja3MgfHwgcGFyYW1zLnByZXZlbnRDbGlja3NQcm9wYWdhdGlvbikge1xyXG4gICAgICAgIGVsW2RvbU1ldGhvZF0oJ2NsaWNrJywgc3dpcGVyLm9uQ2xpY2ssIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICB3cmFwcGVyRWxbZG9tTWV0aG9kXSgnc2Nyb2xsJywgc3dpcGVyLm9uU2Nyb2xsKTtcclxuICAgICAgfSAvLyBSZXNpemUgaGFuZGxlclxyXG5cclxuXHJcbiAgICAgIGlmIChwYXJhbXMudXBkYXRlT25XaW5kb3dSZXNpemUpIHtcclxuICAgICAgICBzd2lwZXJbc3dpcGVyTWV0aG9kXShkZXZpY2UuaW9zIHx8IGRldmljZS5hbmRyb2lkID8gJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZSBvYnNlcnZlclVwZGF0ZScgOiAncmVzaXplIG9ic2VydmVyVXBkYXRlJywgb25SZXNpemUsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN3aXBlcltzd2lwZXJNZXRob2RdKCdvYnNlcnZlclVwZGF0ZScsIG9uUmVzaXplLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdHRhY2hFdmVudHMoKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICBzdXBwb3J0XHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgIHN3aXBlci5vblRvdWNoU3RhcnQgPSBvblRvdWNoU3RhcnQuYmluZChzd2lwZXIpO1xyXG4gICAgICBzd2lwZXIub25Ub3VjaE1vdmUgPSBvblRvdWNoTW92ZS5iaW5kKHN3aXBlcik7XHJcbiAgICAgIHN3aXBlci5vblRvdWNoRW5kID0gb25Ub3VjaEVuZC5iaW5kKHN3aXBlcik7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICBzd2lwZXIub25TY3JvbGwgPSBvblNjcm9sbC5iaW5kKHN3aXBlcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXBlci5vbkNsaWNrID0gb25DbGljay5iaW5kKHN3aXBlcik7XHJcblxyXG4gICAgICBpZiAoc3VwcG9ydC50b3VjaCAmJiAhZHVtbXlFdmVudEF0dGFjaGVkKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGR1bW15RXZlbnRMaXN0ZW5lcik7XHJcbiAgICAgICAgZHVtbXlFdmVudEF0dGFjaGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnRzKHN3aXBlciwgJ29uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGV0YWNoRXZlbnRzKCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBldmVudHMoc3dpcGVyLCAnb2ZmJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGV2ZW50cyQxID0ge1xyXG4gICAgICBhdHRhY2hFdmVudHMsXHJcbiAgICAgIGRldGFjaEV2ZW50c1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpc0dyaWRFbmFibGVkID0gKHN3aXBlciwgcGFyYW1zKSA9PiB7XHJcbiAgICAgIHJldHVybiBzd2lwZXIuZ3JpZCAmJiBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0QnJlYWtwb2ludCgpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIGFjdGl2ZUluZGV4LFxyXG4gICAgICAgIGluaXRpYWxpemVkLFxyXG4gICAgICAgIGxvb3BlZFNsaWRlcyA9IDAsXHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgICRlbFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBjb25zdCBicmVha3BvaW50cyA9IHBhcmFtcy5icmVha3BvaW50cztcclxuICAgICAgaWYgKCFicmVha3BvaW50cyB8fCBicmVha3BvaW50cyAmJiBPYmplY3Qua2V5cyhicmVha3BvaW50cykubGVuZ3RoID09PSAwKSByZXR1cm47IC8vIEdldCBicmVha3BvaW50IGZvciB3aW5kb3cgd2lkdGggYW5kIHVwZGF0ZSBwYXJhbWV0ZXJzXHJcblxyXG4gICAgICBjb25zdCBicmVha3BvaW50ID0gc3dpcGVyLmdldEJyZWFrcG9pbnQoYnJlYWtwb2ludHMsIHN3aXBlci5wYXJhbXMuYnJlYWtwb2ludHNCYXNlLCBzd2lwZXIuZWwpO1xyXG4gICAgICBpZiAoIWJyZWFrcG9pbnQgfHwgc3dpcGVyLmN1cnJlbnRCcmVha3BvaW50ID09PSBicmVha3BvaW50KSByZXR1cm47XHJcbiAgICAgIGNvbnN0IGJyZWFrcG9pbnRPbmx5UGFyYW1zID0gYnJlYWtwb2ludCBpbiBicmVha3BvaW50cyA/IGJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdIDogdW5kZWZpbmVkO1xyXG4gICAgICBjb25zdCBicmVha3BvaW50UGFyYW1zID0gYnJlYWtwb2ludE9ubHlQYXJhbXMgfHwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zO1xyXG4gICAgICBjb25zdCB3YXNNdWx0aVJvdyA9IGlzR3JpZEVuYWJsZWQoc3dpcGVyLCBwYXJhbXMpO1xyXG4gICAgICBjb25zdCBpc011bHRpUm93ID0gaXNHcmlkRW5hYmxlZChzd2lwZXIsIGJyZWFrcG9pbnRQYXJhbXMpO1xyXG4gICAgICBjb25zdCB3YXNFbmFibGVkID0gcGFyYW1zLmVuYWJsZWQ7XHJcblxyXG4gICAgICBpZiAod2FzTXVsdGlSb3cgJiYgIWlzTXVsdGlSb3cpIHtcclxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZCAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XHJcbiAgICAgICAgc3dpcGVyLmVtaXRDb250YWluZXJDbGFzc2VzKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXdhc011bHRpUm93ICYmIGlzTXVsdGlSb3cpIHtcclxuICAgICAgICAkZWwuYWRkQ2xhc3MoYCR7cGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9Z3JpZGApO1xyXG5cclxuICAgICAgICBpZiAoYnJlYWtwb2ludFBhcmFtcy5ncmlkLmZpbGwgJiYgYnJlYWtwb2ludFBhcmFtcy5ncmlkLmZpbGwgPT09ICdjb2x1bW4nIHx8ICFicmVha3BvaW50UGFyYW1zLmdyaWQuZmlsbCAmJiBwYXJhbXMuZ3JpZC5maWxsID09PSAnY29sdW1uJykge1xyXG4gICAgICAgICAgJGVsLmFkZENsYXNzKGAke3BhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfWdyaWQtY29sdW1uYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIuZW1pdENvbnRhaW5lckNsYXNzZXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGlyZWN0aW9uQ2hhbmdlZCA9IGJyZWFrcG9pbnRQYXJhbXMuZGlyZWN0aW9uICYmIGJyZWFrcG9pbnRQYXJhbXMuZGlyZWN0aW9uICE9PSBwYXJhbXMuZGlyZWN0aW9uO1xyXG4gICAgICBjb25zdCBuZWVkc1JlTG9vcCA9IHBhcmFtcy5sb29wICYmIChicmVha3BvaW50UGFyYW1zLnNsaWRlc1BlclZpZXcgIT09IHBhcmFtcy5zbGlkZXNQZXJWaWV3IHx8IGRpcmVjdGlvbkNoYW5nZWQpO1xyXG5cclxuICAgICAgaWYgKGRpcmVjdGlvbkNoYW5nZWQgJiYgaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICBzd2lwZXIuY2hhbmdlRGlyZWN0aW9uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV4dGVuZChzd2lwZXIucGFyYW1zLCBicmVha3BvaW50UGFyYW1zKTtcclxuICAgICAgY29uc3QgaXNFbmFibGVkID0gc3dpcGVyLnBhcmFtcy5lbmFibGVkO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlciwge1xyXG4gICAgICAgIGFsbG93VG91Y2hNb3ZlOiBzd2lwZXIucGFyYW1zLmFsbG93VG91Y2hNb3ZlLFxyXG4gICAgICAgIGFsbG93U2xpZGVOZXh0OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVOZXh0LFxyXG4gICAgICAgIGFsbG93U2xpZGVQcmV2OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVQcmV2XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHdhc0VuYWJsZWQgJiYgIWlzRW5hYmxlZCkge1xyXG4gICAgICAgIHN3aXBlci5kaXNhYmxlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXdhc0VuYWJsZWQgJiYgaXNFbmFibGVkKSB7XHJcbiAgICAgICAgc3dpcGVyLmVuYWJsZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuY3VycmVudEJyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG4gICAgICBzd2lwZXIuZW1pdCgnX2JlZm9yZUJyZWFrcG9pbnQnLCBicmVha3BvaW50UGFyYW1zKTtcclxuXHJcbiAgICAgIGlmIChuZWVkc1JlTG9vcCAmJiBpbml0aWFsaXplZCkge1xyXG4gICAgICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xyXG4gICAgICAgIHN3aXBlci5sb29wQ3JlYXRlKCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZVRvKGFjdGl2ZUluZGV4IC0gbG9vcGVkU2xpZGVzICsgc3dpcGVyLmxvb3BlZFNsaWRlcywgMCwgZmFsc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2lwZXIuZW1pdCgnYnJlYWtwb2ludCcsIGJyZWFrcG9pbnRQYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEJyZWFrcG9pbnQoYnJlYWtwb2ludHMsIGJhc2UsIGNvbnRhaW5lckVsKSB7XHJcbiAgICAgIGlmIChiYXNlID09PSB2b2lkIDApIHtcclxuICAgICAgICBiYXNlID0gJ3dpbmRvdyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghYnJlYWtwb2ludHMgfHwgYmFzZSA9PT0gJ2NvbnRhaW5lcicgJiYgIWNvbnRhaW5lckVsKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBsZXQgYnJlYWtwb2ludCA9IGZhbHNlO1xyXG4gICAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcclxuICAgICAgY29uc3QgY3VycmVudEhlaWdodCA9IGJhc2UgPT09ICd3aW5kb3cnID8gd2luZG93LmlubmVySGVpZ2h0IDogY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0O1xyXG4gICAgICBjb25zdCBwb2ludHMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cykubWFwKHBvaW50ID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHBvaW50ID09PSAnc3RyaW5nJyAmJiBwb2ludC5pbmRleE9mKCdAJykgPT09IDApIHtcclxuICAgICAgICAgIGNvbnN0IG1pblJhdGlvID0gcGFyc2VGbG9hdChwb2ludC5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBjdXJyZW50SGVpZ2h0ICogbWluUmF0aW87XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgcG9pbnRcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdmFsdWU6IHBvaW50LFxyXG4gICAgICAgICAgcG9pbnRcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICAgICAgcG9pbnRzLnNvcnQoKGEsIGIpID0+IHBhcnNlSW50KGEudmFsdWUsIDEwKSAtIHBhcnNlSW50KGIudmFsdWUsIDEwKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHBvaW50LFxyXG4gICAgICAgICAgdmFsdWVcclxuICAgICAgICB9ID0gcG9pbnRzW2ldO1xyXG5cclxuICAgICAgICBpZiAoYmFzZSA9PT0gJ3dpbmRvdycpIHtcclxuICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShgKG1pbi13aWR0aDogJHt2YWx1ZX1weClgKS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBwb2ludDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIDw9IGNvbnRhaW5lckVsLmNsaWVudFdpZHRoKSB7XHJcbiAgICAgICAgICBicmVha3BvaW50ID0gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYnJlYWtwb2ludCB8fCAnbWF4JztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYnJlYWtwb2ludHMgPSB7XHJcbiAgICAgIHNldEJyZWFrcG9pbnQsXHJcbiAgICAgIGdldEJyZWFrcG9pbnRcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZUNsYXNzZXMoZW50cmllcywgcHJlZml4KSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdENsYXNzZXMgPSBbXTtcclxuICAgICAgZW50cmllcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goY2xhc3NOYW1lcyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtW2NsYXNzTmFtZXNdKSB7XHJcbiAgICAgICAgICAgICAgcmVzdWx0Q2xhc3Nlcy5wdXNoKHByZWZpeCArIGNsYXNzTmFtZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgcmVzdWx0Q2xhc3Nlcy5wdXNoKHByZWZpeCArIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXN1bHRDbGFzc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZENsYXNzZXMoKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjbGFzc05hbWVzLFxyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICBydGwsXHJcbiAgICAgICAgJGVsLFxyXG4gICAgICAgIGRldmljZSxcclxuICAgICAgICBzdXBwb3J0XHJcbiAgICAgIH0gPSBzd2lwZXI7IC8vIHByZXR0aWVyLWlnbm9yZVxyXG5cclxuICAgICAgY29uc3Qgc3VmZml4ZXMgPSBwcmVwYXJlQ2xhc3NlcyhbJ2luaXRpYWxpemVkJywgcGFyYW1zLmRpcmVjdGlvbiwge1xyXG4gICAgICAgICdwb2ludGVyLWV2ZW50cyc6ICFzdXBwb3J0LnRvdWNoXHJcbiAgICAgIH0sIHtcclxuICAgICAgICAnZnJlZS1tb2RlJzogc3dpcGVyLnBhcmFtcy5mcmVlTW9kZSAmJiBwYXJhbXMuZnJlZU1vZGUuZW5hYmxlZFxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ2F1dG9oZWlnaHQnOiBwYXJhbXMuYXV0b0hlaWdodFxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ3J0bCc6IHJ0bFxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ2dyaWQnOiBwYXJhbXMuZ3JpZCAmJiBwYXJhbXMuZ3JpZC5yb3dzID4gMVxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ2dyaWQtY29sdW1uJzogcGFyYW1zLmdyaWQgJiYgcGFyYW1zLmdyaWQucm93cyA+IDEgJiYgcGFyYW1zLmdyaWQuZmlsbCA9PT0gJ2NvbHVtbidcclxuICAgICAgfSwge1xyXG4gICAgICAgICdhbmRyb2lkJzogZGV2aWNlLmFuZHJvaWRcclxuICAgICAgfSwge1xyXG4gICAgICAgICdpb3MnOiBkZXZpY2UuaW9zXHJcbiAgICAgIH0sIHtcclxuICAgICAgICAnY3NzLW1vZGUnOiBwYXJhbXMuY3NzTW9kZVxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ2NlbnRlcmVkJzogcGFyYW1zLmNzc01vZGUgJiYgcGFyYW1zLmNlbnRlcmVkU2xpZGVzXHJcbiAgICAgIH1dLCBwYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzcyk7XHJcbiAgICAgIGNsYXNzTmFtZXMucHVzaCguLi5zdWZmaXhlcyk7XHJcbiAgICAgICRlbC5hZGRDbGFzcyhbLi4uY2xhc3NOYW1lc10uam9pbignICcpKTtcclxuICAgICAgc3dpcGVyLmVtaXRDb250YWluZXJDbGFzc2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlQ2xhc3NlcygpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgICRlbCxcclxuICAgICAgICBjbGFzc05hbWVzXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICRlbC5yZW1vdmVDbGFzcyhjbGFzc05hbWVzLmpvaW4oJyAnKSk7XHJcbiAgICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjbGFzc2VzID0ge1xyXG4gICAgICBhZGRDbGFzc2VzLFxyXG4gICAgICByZW1vdmVDbGFzc2VzXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZUVsLCBzcmMsIHNyY3NldCwgc2l6ZXMsIGNoZWNrRm9yQ29tcGxldGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICBsZXQgaW1hZ2U7XHJcblxyXG4gICAgICBmdW5jdGlvbiBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaXNQaWN0dXJlID0gJChpbWFnZUVsKS5wYXJlbnQoJ3BpY3R1cmUnKVswXTtcclxuXHJcbiAgICAgIGlmICghaXNQaWN0dXJlICYmICghaW1hZ2VFbC5jb21wbGV0ZSB8fCAhY2hlY2tGb3JDb21wbGV0ZSkpIHtcclxuICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICBpbWFnZSA9IG5ldyB3aW5kb3cuSW1hZ2UoKTtcclxuICAgICAgICAgIGltYWdlLm9ubG9hZCA9IG9uUmVhZHk7XHJcbiAgICAgICAgICBpbWFnZS5vbmVycm9yID0gb25SZWFkeTtcclxuXHJcbiAgICAgICAgICBpZiAoc2l6ZXMpIHtcclxuICAgICAgICAgICAgaW1hZ2Uuc2l6ZXMgPSBzaXplcztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoc3Jjc2V0KSB7XHJcbiAgICAgICAgICAgIGltYWdlLnNyY3NldCA9IHNyY3NldDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHNyYztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb25SZWFkeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBpbWFnZSBhbHJlYWR5IGxvYWRlZC4uLlxyXG4gICAgICAgIG9uUmVhZHkoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZWxvYWRJbWFnZXMoKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIHN3aXBlci5pbWFnZXNUb0xvYWQgPSBzd2lwZXIuJGVsLmZpbmQoJ2ltZycpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHN3aXBlciA9PT0gJ3VuZGVmaW5lZCcgfHwgc3dpcGVyID09PSBudWxsIHx8ICFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChzd2lwZXIuaW1hZ2VzTG9hZGVkICE9PSB1bmRlZmluZWQpIHN3aXBlci5pbWFnZXNMb2FkZWQgKz0gMTtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5pbWFnZXNMb2FkZWQgPT09IHN3aXBlci5pbWFnZXNUb0xvYWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy51cGRhdGVPbkltYWdlc1JlYWR5KSBzd2lwZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICBzd2lwZXIuZW1pdCgnaW1hZ2VzUmVhZHknKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3dpcGVyLmltYWdlc1RvTG9hZC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGltYWdlRWwgPSBzd2lwZXIuaW1hZ2VzVG9Mb2FkW2ldO1xyXG4gICAgICAgIHN3aXBlci5sb2FkSW1hZ2UoaW1hZ2VFbCwgaW1hZ2VFbC5jdXJyZW50U3JjIHx8IGltYWdlRWwuZ2V0QXR0cmlidXRlKCdzcmMnKSwgaW1hZ2VFbC5zcmNzZXQgfHwgaW1hZ2VFbC5nZXRBdHRyaWJ1dGUoJ3NyY3NldCcpLCBpbWFnZUVsLnNpemVzIHx8IGltYWdlRWwuZ2V0QXR0cmlidXRlKCdzaXplcycpLCB0cnVlLCBvblJlYWR5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbWFnZXMgPSB7XHJcbiAgICAgIGxvYWRJbWFnZSxcclxuICAgICAgcHJlbG9hZEltYWdlc1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja092ZXJmbG93KCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgaXNMb2NrZWQ6IHdhc0xvY2tlZCxcclxuICAgICAgICBwYXJhbXNcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHNsaWRlc09mZnNldEJlZm9yZVxyXG4gICAgICB9ID0gcGFyYW1zO1xyXG5cclxuICAgICAgaWYgKHNsaWRlc09mZnNldEJlZm9yZSkge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTbGlkZUluZGV4ID0gc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgIGNvbnN0IGxhc3RTbGlkZVJpZ2h0RWRnZSA9IHN3aXBlci5zbGlkZXNHcmlkW2xhc3RTbGlkZUluZGV4XSArIHN3aXBlci5zbGlkZXNTaXplc0dyaWRbbGFzdFNsaWRlSW5kZXhdICsgc2xpZGVzT2Zmc2V0QmVmb3JlICogMjtcclxuICAgICAgICBzd2lwZXIuaXNMb2NrZWQgPSBzd2lwZXIuc2l6ZSA+IGxhc3RTbGlkZVJpZ2h0RWRnZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2lwZXIuaXNMb2NrZWQgPSBzd2lwZXIuc25hcEdyaWQubGVuZ3RoID09PSAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmFsbG93U2xpZGVOZXh0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgc3dpcGVyLmFsbG93U2xpZGVOZXh0ID0gIXN3aXBlci5pc0xvY2tlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5hbGxvd1NsaWRlUHJldiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHN3aXBlci5hbGxvd1NsaWRlUHJldiA9ICFzd2lwZXIuaXNMb2NrZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh3YXNMb2NrZWQgJiYgd2FzTG9ja2VkICE9PSBzd2lwZXIuaXNMb2NrZWQpIHtcclxuICAgICAgICBzd2lwZXIuaXNFbmQgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHdhc0xvY2tlZCAhPT0gc3dpcGVyLmlzTG9ja2VkKSB7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoc3dpcGVyLmlzTG9ja2VkID8gJ2xvY2snIDogJ3VubG9jaycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNoZWNrT3ZlcmZsb3ckMSA9IHtcclxuICAgICAgY2hlY2tPdmVyZmxvd1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgIGluaXQ6IHRydWUsXHJcbiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxyXG4gICAgICB0b3VjaEV2ZW50c1RhcmdldDogJ3dyYXBwZXInLFxyXG4gICAgICBpbml0aWFsU2xpZGU6IDAsXHJcbiAgICAgIHNwZWVkOiAzMDAsXHJcbiAgICAgIGNzc01vZGU6IGZhbHNlLFxyXG4gICAgICB1cGRhdGVPbldpbmRvd1Jlc2l6ZTogdHJ1ZSxcclxuICAgICAgcmVzaXplT2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgIG5lc3RlZDogZmFsc2UsXHJcbiAgICAgIGNyZWF0ZUVsZW1lbnRzOiBmYWxzZSxcclxuICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgZm9jdXNhYmxlRWxlbWVudHM6ICdpbnB1dCwgc2VsZWN0LCBvcHRpb24sIHRleHRhcmVhLCBidXR0b24sIHZpZGVvLCBsYWJlbCcsXHJcbiAgICAgIC8vIE92ZXJyaWRlc1xyXG4gICAgICB3aWR0aDogbnVsbCxcclxuICAgICAgaGVpZ2h0OiBudWxsLFxyXG4gICAgICAvL1xyXG4gICAgICBwcmV2ZW50SW50ZXJhY3Rpb25PblRyYW5zaXRpb246IGZhbHNlLFxyXG4gICAgICAvLyBzc3JcclxuICAgICAgdXNlckFnZW50OiBudWxsLFxyXG4gICAgICB1cmw6IG51bGwsXHJcbiAgICAgIC8vIFRvIHN1cHBvcnQgaU9TJ3Mgc3dpcGUtdG8tZ28tYmFjayBnZXN0dXJlICh3aGVuIGJlaW5nIHVzZWQgaW4tYXBwKS5cclxuICAgICAgZWRnZVN3aXBlRGV0ZWN0aW9uOiBmYWxzZSxcclxuICAgICAgZWRnZVN3aXBlVGhyZXNob2xkOiAyMCxcclxuICAgICAgLy8gQXV0b2hlaWdodFxyXG4gICAgICBhdXRvSGVpZ2h0OiBmYWxzZSxcclxuICAgICAgLy8gU2V0IHdyYXBwZXIgd2lkdGhcclxuICAgICAgc2V0V3JhcHBlclNpemU6IGZhbHNlLFxyXG4gICAgICAvLyBWaXJ0dWFsIFRyYW5zbGF0ZVxyXG4gICAgICB2aXJ0dWFsVHJhbnNsYXRlOiBmYWxzZSxcclxuICAgICAgLy8gRWZmZWN0c1xyXG4gICAgICBlZmZlY3Q6ICdzbGlkZScsXHJcbiAgICAgIC8vICdzbGlkZScgb3IgJ2ZhZGUnIG9yICdjdWJlJyBvciAnY292ZXJmbG93JyBvciAnZmxpcCdcclxuICAgICAgLy8gQnJlYWtwb2ludHNcclxuICAgICAgYnJlYWtwb2ludHM6IHVuZGVmaW5lZCxcclxuICAgICAgYnJlYWtwb2ludHNCYXNlOiAnd2luZG93JyxcclxuICAgICAgLy8gU2xpZGVzIGdyaWRcclxuICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gICAgICBzbGlkZXNQZXJHcm91cDogMSxcclxuICAgICAgc2xpZGVzUGVyR3JvdXBTa2lwOiAwLFxyXG4gICAgICBzbGlkZXNQZXJHcm91cEF1dG86IGZhbHNlLFxyXG4gICAgICBjZW50ZXJlZFNsaWRlczogZmFsc2UsXHJcbiAgICAgIGNlbnRlcmVkU2xpZGVzQm91bmRzOiBmYWxzZSxcclxuICAgICAgc2xpZGVzT2Zmc2V0QmVmb3JlOiAwLFxyXG4gICAgICAvLyBpbiBweFxyXG4gICAgICBzbGlkZXNPZmZzZXRBZnRlcjogMCxcclxuICAgICAgLy8gaW4gcHhcclxuICAgICAgbm9ybWFsaXplU2xpZGVJbmRleDogdHJ1ZSxcclxuICAgICAgY2VudGVySW5zdWZmaWNpZW50U2xpZGVzOiBmYWxzZSxcclxuICAgICAgLy8gRGlzYWJsZSBzd2lwZXIgYW5kIGhpZGUgbmF2aWdhdGlvbiB3aGVuIGNvbnRhaW5lciBub3Qgb3ZlcmZsb3dcclxuICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgLy8gUm91bmQgbGVuZ3RoXHJcbiAgICAgIHJvdW5kTGVuZ3RoczogZmFsc2UsXHJcbiAgICAgIC8vIFRvdWNoZXNcclxuICAgICAgdG91Y2hSYXRpbzogMSxcclxuICAgICAgdG91Y2hBbmdsZTogNDUsXHJcbiAgICAgIHNpbXVsYXRlVG91Y2g6IHRydWUsXHJcbiAgICAgIHNob3J0U3dpcGVzOiB0cnVlLFxyXG4gICAgICBsb25nU3dpcGVzOiB0cnVlLFxyXG4gICAgICBsb25nU3dpcGVzUmF0aW86IDAuNSxcclxuICAgICAgbG9uZ1N3aXBlc01zOiAzMDAsXHJcbiAgICAgIGZvbGxvd0ZpbmdlcjogdHJ1ZSxcclxuICAgICAgYWxsb3dUb3VjaE1vdmU6IHRydWUsXHJcbiAgICAgIHRocmVzaG9sZDogMCxcclxuICAgICAgdG91Y2hNb3ZlU3RvcFByb3BhZ2F0aW9uOiBmYWxzZSxcclxuICAgICAgdG91Y2hTdGFydFByZXZlbnREZWZhdWx0OiB0cnVlLFxyXG4gICAgICB0b3VjaFN0YXJ0Rm9yY2VQcmV2ZW50RGVmYXVsdDogZmFsc2UsXHJcbiAgICAgIHRvdWNoUmVsZWFzZU9uRWRnZXM6IGZhbHNlLFxyXG4gICAgICAvLyBVbmlxdWUgTmF2aWdhdGlvbiBFbGVtZW50c1xyXG4gICAgICB1bmlxdWVOYXZFbGVtZW50czogdHJ1ZSxcclxuICAgICAgLy8gUmVzaXN0YW5jZVxyXG4gICAgICByZXNpc3RhbmNlOiB0cnVlLFxyXG4gICAgICByZXNpc3RhbmNlUmF0aW86IDAuODUsXHJcbiAgICAgIC8vIFByb2dyZXNzXHJcbiAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IGZhbHNlLFxyXG4gICAgICAvLyBDdXJzb3JcclxuICAgICAgZ3JhYkN1cnNvcjogZmFsc2UsXHJcbiAgICAgIC8vIENsaWNrc1xyXG4gICAgICBwcmV2ZW50Q2xpY2tzOiB0cnVlLFxyXG4gICAgICBwcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb246IHRydWUsXHJcbiAgICAgIHNsaWRlVG9DbGlja2VkU2xpZGU6IGZhbHNlLFxyXG4gICAgICAvLyBJbWFnZXNcclxuICAgICAgcHJlbG9hZEltYWdlczogdHJ1ZSxcclxuICAgICAgdXBkYXRlT25JbWFnZXNSZWFkeTogdHJ1ZSxcclxuICAgICAgLy8gbG9vcFxyXG4gICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgbG9vcEFkZGl0aW9uYWxTbGlkZXM6IDAsXHJcbiAgICAgIGxvb3BlZFNsaWRlczogbnVsbCxcclxuICAgICAgbG9vcEZpbGxHcm91cFdpdGhCbGFuazogZmFsc2UsXHJcbiAgICAgIGxvb3BQcmV2ZW50c1NsaWRlOiB0cnVlLFxyXG4gICAgICAvLyByZXdpbmRcclxuICAgICAgcmV3aW5kOiBmYWxzZSxcclxuICAgICAgLy8gU3dpcGluZy9ubyBzd2lwaW5nXHJcbiAgICAgIGFsbG93U2xpZGVQcmV2OiB0cnVlLFxyXG4gICAgICBhbGxvd1NsaWRlTmV4dDogdHJ1ZSxcclxuICAgICAgc3dpcGVIYW5kbGVyOiBudWxsLFxyXG4gICAgICAvLyAnLnN3aXBlLWhhbmRsZXInLFxyXG4gICAgICBub1N3aXBpbmc6IHRydWUsXHJcbiAgICAgIG5vU3dpcGluZ0NsYXNzOiAnc3dpcGVyLW5vLXN3aXBpbmcnLFxyXG4gICAgICBub1N3aXBpbmdTZWxlY3RvcjogbnVsbCxcclxuICAgICAgLy8gUGFzc2l2ZSBMaXN0ZW5lcnNcclxuICAgICAgcGFzc2l2ZUxpc3RlbmVyczogdHJ1ZSxcclxuICAgICAgbWF4QmFja2ZhY2VIaWRkZW5TbGlkZXM6IDEwLFxyXG4gICAgICAvLyBOU1xyXG4gICAgICBjb250YWluZXJNb2RpZmllckNsYXNzOiAnc3dpcGVyLScsXHJcbiAgICAgIC8vIE5FV1xyXG4gICAgICBzbGlkZUNsYXNzOiAnc3dpcGVyLXNsaWRlJyxcclxuICAgICAgc2xpZGVCbGFua0NsYXNzOiAnc3dpcGVyLXNsaWRlLWludmlzaWJsZS1ibGFuaycsXHJcbiAgICAgIHNsaWRlQWN0aXZlQ2xhc3M6ICdzd2lwZXItc2xpZGUtYWN0aXZlJyxcclxuICAgICAgc2xpZGVEdXBsaWNhdGVBY3RpdmVDbGFzczogJ3N3aXBlci1zbGlkZS1kdXBsaWNhdGUtYWN0aXZlJyxcclxuICAgICAgc2xpZGVWaXNpYmxlQ2xhc3M6ICdzd2lwZXItc2xpZGUtdmlzaWJsZScsXHJcbiAgICAgIHNsaWRlRHVwbGljYXRlQ2xhc3M6ICdzd2lwZXItc2xpZGUtZHVwbGljYXRlJyxcclxuICAgICAgc2xpZGVOZXh0Q2xhc3M6ICdzd2lwZXItc2xpZGUtbmV4dCcsXHJcbiAgICAgIHNsaWRlRHVwbGljYXRlTmV4dENsYXNzOiAnc3dpcGVyLXNsaWRlLWR1cGxpY2F0ZS1uZXh0JyxcclxuICAgICAgc2xpZGVQcmV2Q2xhc3M6ICdzd2lwZXItc2xpZGUtcHJldicsXHJcbiAgICAgIHNsaWRlRHVwbGljYXRlUHJldkNsYXNzOiAnc3dpcGVyLXNsaWRlLWR1cGxpY2F0ZS1wcmV2JyxcclxuICAgICAgd3JhcHBlckNsYXNzOiAnc3dpcGVyLXdyYXBwZXInLFxyXG4gICAgICAvLyBDYWxsYmFja3NcclxuICAgICAgcnVuQ2FsbGJhY2tzT25Jbml0OiB0cnVlLFxyXG4gICAgICAvLyBJbnRlcm5hbHNcclxuICAgICAgX2VtaXRDbGFzc2VzOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb2R1bGVFeHRlbmRQYXJhbXMocGFyYW1zLCBhbGxNb2R1bGVzUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiBleHRlbmRQYXJhbXMob2JqKSB7XHJcbiAgICAgICAgaWYgKG9iaiA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZHVsZVBhcmFtTmFtZSA9IE9iamVjdC5rZXlzKG9iailbMF07XHJcbiAgICAgICAgY29uc3QgbW9kdWxlUGFyYW1zID0gb2JqW21vZHVsZVBhcmFtTmFtZV07XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlUGFyYW1zICE9PSAnb2JqZWN0JyB8fCBtb2R1bGVQYXJhbXMgPT09IG51bGwpIHtcclxuICAgICAgICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFsnbmF2aWdhdGlvbicsICdwYWdpbmF0aW9uJywgJ3Njcm9sbGJhciddLmluZGV4T2YobW9kdWxlUGFyYW1OYW1lKSA+PSAwICYmIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSA9IHtcclxuICAgICAgICAgICAgYXV0bzogdHJ1ZVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghKG1vZHVsZVBhcmFtTmFtZSBpbiBwYXJhbXMgJiYgJ2VuYWJsZWQnIGluIG1vZHVsZVBhcmFtcykpIHtcclxuICAgICAgICAgIGV4dGVuZChhbGxNb2R1bGVzUGFyYW1zLCBvYmopO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSA9IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0gPT09ICdvYmplY3QnICYmICEoJ2VuYWJsZWQnIGluIHBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdKSkge1xyXG4gICAgICAgICAgcGFyYW1zW21vZHVsZVBhcmFtTmFtZV0uZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXBhcmFtc1ttb2R1bGVQYXJhbU5hbWVdKSBwYXJhbXNbbW9kdWxlUGFyYW1OYW1lXSA9IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBleHRlbmQoYWxsTW9kdWxlc1BhcmFtcywgb2JqKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IFwib2ZmXCIgKi9cclxuICAgIGNvbnN0IHByb3RvdHlwZXMgPSB7XHJcbiAgICAgIGV2ZW50c0VtaXR0ZXIsXHJcbiAgICAgIHVwZGF0ZSxcclxuICAgICAgdHJhbnNsYXRlLFxyXG4gICAgICB0cmFuc2l0aW9uLFxyXG4gICAgICBzbGlkZSxcclxuICAgICAgbG9vcCxcclxuICAgICAgZ3JhYkN1cnNvcixcclxuICAgICAgZXZlbnRzOiBldmVudHMkMSxcclxuICAgICAgYnJlYWtwb2ludHMsXHJcbiAgICAgIGNoZWNrT3ZlcmZsb3c6IGNoZWNrT3ZlcmZsb3ckMSxcclxuICAgICAgY2xhc3NlcyxcclxuICAgICAgaW1hZ2VzXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZXh0ZW5kZWREZWZhdWx0cyA9IHt9O1xyXG5cclxuICAgIGNsYXNzIFN3aXBlciB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBlbDtcclxuICAgICAgICBsZXQgcGFyYW1zO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcclxuICAgICAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgYXJnc1swXS5jb25zdHJ1Y3RvciAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnc1swXSkuc2xpY2UoOCwgLTEpID09PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgcGFyYW1zID0gYXJnc1swXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgW2VsLCBwYXJhbXNdID0gYXJncztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuICAgICAgICBwYXJhbXMgPSBleHRlbmQoe30sIHBhcmFtcyk7XHJcbiAgICAgICAgaWYgKGVsICYmICFwYXJhbXMuZWwpIHBhcmFtcy5lbCA9IGVsO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmVsICYmICQocGFyYW1zLmVsKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICBjb25zdCBzd2lwZXJzID0gW107XHJcbiAgICAgICAgICAkKHBhcmFtcy5lbCkuZWFjaChjb250YWluZXJFbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhcmFtcyA9IGV4dGVuZCh7fSwgcGFyYW1zLCB7XHJcbiAgICAgICAgICAgICAgZWw6IGNvbnRhaW5lckVsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzd2lwZXJzLnB1c2gobmV3IFN3aXBlcihuZXdQYXJhbXMpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHN3aXBlcnM7XHJcbiAgICAgICAgfSAvLyBTd2lwZXIgSW5zdGFuY2VcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgICAgc3dpcGVyLl9fc3dpcGVyX18gPSB0cnVlO1xyXG4gICAgICAgIHN3aXBlci5zdXBwb3J0ID0gZ2V0U3VwcG9ydCgpO1xyXG4gICAgICAgIHN3aXBlci5kZXZpY2UgPSBnZXREZXZpY2Uoe1xyXG4gICAgICAgICAgdXNlckFnZW50OiBwYXJhbXMudXNlckFnZW50XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3dpcGVyLmJyb3dzZXIgPSBnZXRCcm93c2VyKCk7XHJcbiAgICAgICAgc3dpcGVyLmV2ZW50c0xpc3RlbmVycyA9IHt9O1xyXG4gICAgICAgIHN3aXBlci5ldmVudHNBbnlMaXN0ZW5lcnMgPSBbXTtcclxuICAgICAgICBzd2lwZXIubW9kdWxlcyA9IFsuLi5zd2lwZXIuX19tb2R1bGVzX19dO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLm1vZHVsZXMgJiYgQXJyYXkuaXNBcnJheShwYXJhbXMubW9kdWxlcykpIHtcclxuICAgICAgICAgIHN3aXBlci5tb2R1bGVzLnB1c2goLi4ucGFyYW1zLm1vZHVsZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYWxsTW9kdWxlc1BhcmFtcyA9IHt9O1xyXG4gICAgICAgIHN3aXBlci5tb2R1bGVzLmZvckVhY2gobW9kID0+IHtcclxuICAgICAgICAgIG1vZCh7XHJcbiAgICAgICAgICAgIHN3aXBlcixcclxuICAgICAgICAgICAgZXh0ZW5kUGFyYW1zOiBtb2R1bGVFeHRlbmRQYXJhbXMocGFyYW1zLCBhbGxNb2R1bGVzUGFyYW1zKSxcclxuICAgICAgICAgICAgb246IHN3aXBlci5vbi5iaW5kKHN3aXBlciksXHJcbiAgICAgICAgICAgIG9uY2U6IHN3aXBlci5vbmNlLmJpbmQoc3dpcGVyKSxcclxuICAgICAgICAgICAgb2ZmOiBzd2lwZXIub2ZmLmJpbmQoc3dpcGVyKSxcclxuICAgICAgICAgICAgZW1pdDogc3dpcGVyLmVtaXQuYmluZChzd2lwZXIpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgLy8gRXh0ZW5kIGRlZmF1bHRzIHdpdGggbW9kdWxlcyBwYXJhbXNcclxuXHJcbiAgICAgICAgY29uc3Qgc3dpcGVyUGFyYW1zID0gZXh0ZW5kKHt9LCBkZWZhdWx0cywgYWxsTW9kdWxlc1BhcmFtcyk7IC8vIEV4dGVuZCBkZWZhdWx0cyB3aXRoIHBhc3NlZCBwYXJhbXNcclxuXHJcbiAgICAgICAgc3dpcGVyLnBhcmFtcyA9IGV4dGVuZCh7fSwgc3dpcGVyUGFyYW1zLCBleHRlbmRlZERlZmF1bHRzLCBwYXJhbXMpO1xyXG4gICAgICAgIHN3aXBlci5vcmlnaW5hbFBhcmFtcyA9IGV4dGVuZCh7fSwgc3dpcGVyLnBhcmFtcyk7XHJcbiAgICAgICAgc3dpcGVyLnBhc3NlZFBhcmFtcyA9IGV4dGVuZCh7fSwgcGFyYW1zKTsgLy8gYWRkIGV2ZW50IGxpc3RlbmVyc1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcyAmJiBzd2lwZXIucGFyYW1zLm9uKSB7XHJcbiAgICAgICAgICBPYmplY3Qua2V5cyhzd2lwZXIucGFyYW1zLm9uKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXBlci5vbihldmVudE5hbWUsIHN3aXBlci5wYXJhbXMub25bZXZlbnROYW1lXSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zICYmIHN3aXBlci5wYXJhbXMub25BbnkpIHtcclxuICAgICAgICAgIHN3aXBlci5vbkFueShzd2lwZXIucGFyYW1zLm9uQW55KTtcclxuICAgICAgICB9IC8vIFNhdmUgRG9tIGxpYlxyXG5cclxuXHJcbiAgICAgICAgc3dpcGVyLiQgPSAkOyAvLyBFeHRlbmQgU3dpcGVyXHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XHJcbiAgICAgICAgICBlbmFibGVkOiBzd2lwZXIucGFyYW1zLmVuYWJsZWQsXHJcbiAgICAgICAgICBlbCxcclxuICAgICAgICAgIC8vIENsYXNzZXNcclxuICAgICAgICAgIGNsYXNzTmFtZXM6IFtdLFxyXG4gICAgICAgICAgLy8gU2xpZGVzXHJcbiAgICAgICAgICBzbGlkZXM6ICQoKSxcclxuICAgICAgICAgIHNsaWRlc0dyaWQ6IFtdLFxyXG4gICAgICAgICAgc25hcEdyaWQ6IFtdLFxyXG4gICAgICAgICAgc2xpZGVzU2l6ZXNHcmlkOiBbXSxcclxuXHJcbiAgICAgICAgICAvLyBpc0RpcmVjdGlvblxyXG4gICAgICAgICAgaXNIb3Jpem9udGFsKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3dpcGVyLnBhcmFtcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJztcclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgaXNWZXJ0aWNhbCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID09PSAndmVydGljYWwnO1xyXG4gICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAvLyBJbmRleGVzXHJcbiAgICAgICAgICBhY3RpdmVJbmRleDogMCxcclxuICAgICAgICAgIHJlYWxJbmRleDogMCxcclxuICAgICAgICAgIC8vXHJcbiAgICAgICAgICBpc0JlZ2lubmluZzogdHJ1ZSxcclxuICAgICAgICAgIGlzRW5kOiBmYWxzZSxcclxuICAgICAgICAgIC8vIFByb3BzXHJcbiAgICAgICAgICB0cmFuc2xhdGU6IDAsXHJcbiAgICAgICAgICBwcmV2aW91c1RyYW5zbGF0ZTogMCxcclxuICAgICAgICAgIHByb2dyZXNzOiAwLFxyXG4gICAgICAgICAgdmVsb2NpdHk6IDAsXHJcbiAgICAgICAgICBhbmltYXRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgLy8gTG9ja3NcclxuICAgICAgICAgIGFsbG93U2xpZGVOZXh0OiBzd2lwZXIucGFyYW1zLmFsbG93U2xpZGVOZXh0LFxyXG4gICAgICAgICAgYWxsb3dTbGlkZVByZXY6IHN3aXBlci5wYXJhbXMuYWxsb3dTbGlkZVByZXYsXHJcbiAgICAgICAgICAvLyBUb3VjaCBFdmVudHNcclxuICAgICAgICAgIHRvdWNoRXZlbnRzOiBmdW5jdGlvbiB0b3VjaEV2ZW50cygpIHtcclxuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJ107XHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2t0b3AgPSBbJ3BvaW50ZXJkb3duJywgJ3BvaW50ZXJtb3ZlJywgJ3BvaW50ZXJ1cCddO1xyXG4gICAgICAgICAgICBzd2lwZXIudG91Y2hFdmVudHNUb3VjaCA9IHtcclxuICAgICAgICAgICAgICBzdGFydDogdG91Y2hbMF0sXHJcbiAgICAgICAgICAgICAgbW92ZTogdG91Y2hbMV0sXHJcbiAgICAgICAgICAgICAgZW5kOiB0b3VjaFsyXSxcclxuICAgICAgICAgICAgICBjYW5jZWw6IHRvdWNoWzNdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHN3aXBlci50b3VjaEV2ZW50c0Rlc2t0b3AgPSB7XHJcbiAgICAgICAgICAgICAgc3RhcnQ6IGRlc2t0b3BbMF0sXHJcbiAgICAgICAgICAgICAgbW92ZTogZGVza3RvcFsxXSxcclxuICAgICAgICAgICAgICBlbmQ6IGRlc2t0b3BbMl1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHN3aXBlci5zdXBwb3J0LnRvdWNoIHx8ICFzd2lwZXIucGFyYW1zLnNpbXVsYXRlVG91Y2ggPyBzd2lwZXIudG91Y2hFdmVudHNUb3VjaCA6IHN3aXBlci50b3VjaEV2ZW50c0Rlc2t0b3A7XHJcbiAgICAgICAgICB9KCksXHJcbiAgICAgICAgICB0b3VjaEV2ZW50c0RhdGE6IHtcclxuICAgICAgICAgICAgaXNUb3VjaGVkOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGlzTW92ZWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgYWxsb3dUb3VjaENhbGxiYWNrczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB0b3VjaFN0YXJ0VGltZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBpc1Njcm9sbGluZzogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhbnNsYXRlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHN0YXJ0VHJhbnNsYXRlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGFsbG93VGhyZXNob2xkTW92ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAvLyBGb3JtIGVsZW1lbnRzIHRvIG1hdGNoXHJcbiAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzOiBzd2lwZXIucGFyYW1zLmZvY3VzYWJsZUVsZW1lbnRzLFxyXG4gICAgICAgICAgICAvLyBMYXN0IGNsaWNrIHRpbWVcclxuICAgICAgICAgICAgbGFzdENsaWNrVGltZTogbm93KCksXHJcbiAgICAgICAgICAgIGNsaWNrVGltZW91dDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAvLyBWZWxvY2l0aWVzXHJcbiAgICAgICAgICAgIHZlbG9jaXRpZXM6IFtdLFxyXG4gICAgICAgICAgICBhbGxvd01vbWVudHVtQm91bmNlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGlzVG91Y2hFdmVudDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBzdGFydE1vdmluZzogdW5kZWZpbmVkXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgLy8gQ2xpY2tzXHJcbiAgICAgICAgICBhbGxvd0NsaWNrOiB0cnVlLFxyXG4gICAgICAgICAgLy8gVG91Y2hlc1xyXG4gICAgICAgICAgYWxsb3dUb3VjaE1vdmU6IHN3aXBlci5wYXJhbXMuYWxsb3dUb3VjaE1vdmUsXHJcbiAgICAgICAgICB0b3VjaGVzOiB7XHJcbiAgICAgICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICAgICAgc3RhcnRZOiAwLFxyXG4gICAgICAgICAgICBjdXJyZW50WDogMCxcclxuICAgICAgICAgICAgY3VycmVudFk6IDAsXHJcbiAgICAgICAgICAgIGRpZmY6IDBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAvLyBJbWFnZXNcclxuICAgICAgICAgIGltYWdlc1RvTG9hZDogW10sXHJcbiAgICAgICAgICBpbWFnZXNMb2FkZWQ6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnX3N3aXBlcicpOyAvLyBJbml0XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmluaXQpIHtcclxuICAgICAgICAgIHN3aXBlci5pbml0KCk7XHJcbiAgICAgICAgfSAvLyBSZXR1cm4gYXBwIGluc3RhbmNlXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gc3dpcGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbmFibGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICBpZiAoc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmdyYWJDdXJzb3IpIHtcclxuICAgICAgICAgIHN3aXBlci5zZXRHcmFiQ3Vyc29yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIuZW1pdCgnZW5hYmxlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRpc2FibGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgc3dpcGVyLmVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZ3JhYkN1cnNvcikge1xyXG4gICAgICAgICAgc3dpcGVyLnVuc2V0R3JhYkN1cnNvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ2Rpc2FibGUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0UHJvZ3Jlc3MocHJvZ3Jlc3MsIHNwZWVkKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICBwcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHByb2dyZXNzLCAwKSwgMSk7XHJcbiAgICAgICAgY29uc3QgbWluID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gKG1heCAtIG1pbikgKiBwcm9ncmVzcyArIG1pbjtcclxuICAgICAgICBzd2lwZXIudHJhbnNsYXRlVG8oY3VycmVudCwgdHlwZW9mIHNwZWVkID09PSAndW5kZWZpbmVkJyA/IDAgOiBzcGVlZCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZW1pdENvbnRhaW5lckNsYXNzZXMoKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMuX2VtaXRDbGFzc2VzIHx8ICFzd2lwZXIuZWwpIHJldHVybjtcclxuICAgICAgICBjb25zdCBjbHMgPSBzd2lwZXIuZWwuY2xhc3NOYW1lLnNwbGl0KCcgJykuZmlsdGVyKGNsYXNzTmFtZSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gY2xhc3NOYW1lLmluZGV4T2YoJ3N3aXBlcicpID09PSAwIHx8IGNsYXNzTmFtZS5pbmRleE9mKHN3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzcykgPT09IDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ19jb250YWluZXJDbGFzc2VzJywgY2xzLmpvaW4oJyAnKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldFNsaWRlQ2xhc3NlcyhzbGlkZUVsKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICByZXR1cm4gc2xpZGVFbC5jbGFzc05hbWUuc3BsaXQoJyAnKS5maWx0ZXIoY2xhc3NOYW1lID0+IHtcclxuICAgICAgICAgIHJldHVybiBjbGFzc05hbWUuaW5kZXhPZignc3dpcGVyLXNsaWRlJykgPT09IDAgfHwgY2xhc3NOYW1lLmluZGV4T2Yoc3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzKSA9PT0gMDtcclxuICAgICAgICB9KS5qb2luKCcgJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVtaXRTbGlkZXNDbGFzc2VzKCkge1xyXG4gICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLl9lbWl0Q2xhc3NlcyB8fCAhc3dpcGVyLmVsKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IFtdO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZXMuZWFjaChzbGlkZUVsID0+IHtcclxuICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBzd2lwZXIuZ2V0U2xpZGVDbGFzc2VzKHNsaWRlRWwpO1xyXG4gICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgc2xpZGVFbCxcclxuICAgICAgICAgICAgY2xhc3NOYW1lc1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzd2lwZXIuZW1pdCgnX3NsaWRlQ2xhc3MnLCBzbGlkZUVsLCBjbGFzc05hbWVzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnX3NsaWRlQ2xhc3NlcycsIHVwZGF0ZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzbGlkZXNQZXJWaWV3RHluYW1pYyh2aWV3LCBleGFjdCkge1xyXG4gICAgICAgIGlmICh2aWV3ID09PSB2b2lkIDApIHtcclxuICAgICAgICAgIHZpZXcgPSAnY3VycmVudCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXhhY3QgPT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgZXhhY3QgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgICAgc2xpZGVzLFxyXG4gICAgICAgICAgc2xpZGVzR3JpZCxcclxuICAgICAgICAgIHNsaWRlc1NpemVzR3JpZCxcclxuICAgICAgICAgIHNpemU6IHN3aXBlclNpemUsXHJcbiAgICAgICAgICBhY3RpdmVJbmRleFxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgbGV0IHNwdiA9IDE7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcclxuICAgICAgICAgIGxldCBzbGlkZVNpemUgPSBzbGlkZXNbYWN0aXZlSW5kZXhdLnN3aXBlclNsaWRlU2l6ZTtcclxuICAgICAgICAgIGxldCBicmVha0xvb3A7XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IGFjdGl2ZUluZGV4ICsgMTsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAoc2xpZGVzW2ldICYmICFicmVha0xvb3ApIHtcclxuICAgICAgICAgICAgICBzbGlkZVNpemUgKz0gc2xpZGVzW2ldLnN3aXBlclNsaWRlU2l6ZTtcclxuICAgICAgICAgICAgICBzcHYgKz0gMTtcclxuICAgICAgICAgICAgICBpZiAoc2xpZGVTaXplID4gc3dpcGVyU2l6ZSkgYnJlYWtMb29wID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChzbGlkZXNbaV0gJiYgIWJyZWFrTG9vcCkge1xyXG4gICAgICAgICAgICAgIHNsaWRlU2l6ZSArPSBzbGlkZXNbaV0uc3dpcGVyU2xpZGVTaXplO1xyXG4gICAgICAgICAgICAgIHNwdiArPSAxO1xyXG4gICAgICAgICAgICAgIGlmIChzbGlkZVNpemUgPiBzd2lwZXJTaXplKSBicmVha0xvb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICAgICAgaWYgKHZpZXcgPT09ICdjdXJyZW50Jykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gYWN0aXZlSW5kZXggKyAxOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2xpZGVJblZpZXcgPSBleGFjdCA/IHNsaWRlc0dyaWRbaV0gKyBzbGlkZXNTaXplc0dyaWRbaV0gLSBzbGlkZXNHcmlkW2FjdGl2ZUluZGV4XSA8IHN3aXBlclNpemUgOiBzbGlkZXNHcmlkW2ldIC0gc2xpZGVzR3JpZFthY3RpdmVJbmRleF0gPCBzd2lwZXJTaXplO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoc2xpZGVJblZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHNwdiArPSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcHJldmlvdXNcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGFjdGl2ZUluZGV4IC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgICBjb25zdCBzbGlkZUluVmlldyA9IHNsaWRlc0dyaWRbYWN0aXZlSW5kZXhdIC0gc2xpZGVzR3JpZFtpXSA8IHN3aXBlclNpemU7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChzbGlkZUluVmlldykge1xyXG4gICAgICAgICAgICAgICAgc3B2ICs9IDE7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3B2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgc25hcEdyaWQsXHJcbiAgICAgICAgICBwYXJhbXNcclxuICAgICAgICB9ID0gc3dpcGVyOyAvLyBCcmVha3BvaW50c1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgICBzd2lwZXIuc2V0QnJlYWtwb2ludCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNpemUoKTtcclxuICAgICAgICBzd2lwZXIudXBkYXRlU2xpZGVzKCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKCkge1xyXG4gICAgICAgICAgY29uc3QgdHJhbnNsYXRlVmFsdWUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gc3dpcGVyLnRyYW5zbGF0ZSAqIC0xIDogc3dpcGVyLnRyYW5zbGF0ZTtcclxuICAgICAgICAgIGNvbnN0IG5ld1RyYW5zbGF0ZSA9IE1hdGgubWluKE1hdGgubWF4KHRyYW5zbGF0ZVZhbHVlLCBzd2lwZXIubWF4VHJhbnNsYXRlKCkpLCBzd2lwZXIubWluVHJhbnNsYXRlKCkpO1xyXG4gICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdUcmFuc2xhdGUpO1xyXG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XHJcbiAgICAgICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRyYW5zbGF0ZWQ7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlICYmIHN3aXBlci5wYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCkge1xyXG4gICAgICAgICAgc2V0VHJhbnNsYXRlKCk7XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b0hlaWdodCkge1xyXG4gICAgICAgICAgICBzd2lwZXIudXBkYXRlQXV0b0hlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nIHx8IHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpICYmIHN3aXBlci5pc0VuZCAmJiAhc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVkID0gc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxLCAwLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVkID0gc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCF0cmFuc2xhdGVkKSB7XHJcbiAgICAgICAgICAgIHNldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHNuYXBHcmlkICE9PSBzd2lwZXIuc25hcEdyaWQpIHtcclxuICAgICAgICAgIHN3aXBlci5jaGVja092ZXJmbG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIuZW1pdCgndXBkYXRlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNoYW5nZURpcmVjdGlvbihuZXdEaXJlY3Rpb24sIG5lZWRVcGRhdGUpIHtcclxuICAgICAgICBpZiAobmVlZFVwZGF0ZSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICBuZWVkVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgY3VycmVudERpcmVjdGlvbiA9IHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICBpZiAoIW5ld0RpcmVjdGlvbikge1xyXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbiAgICAgICAgICBuZXdEaXJlY3Rpb24gPSBjdXJyZW50RGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5ld0RpcmVjdGlvbiA9PT0gY3VycmVudERpcmVjdGlvbiB8fCBuZXdEaXJlY3Rpb24gIT09ICdob3Jpem9udGFsJyAmJiBuZXdEaXJlY3Rpb24gIT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICAgIHJldHVybiBzd2lwZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIuJGVsLnJlbW92ZUNsYXNzKGAke3N3aXBlci5wYXJhbXMuY29udGFpbmVyTW9kaWZpZXJDbGFzc30ke2N1cnJlbnREaXJlY3Rpb259YCkuYWRkQ2xhc3MoYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfSR7bmV3RGlyZWN0aW9ufWApO1xyXG4gICAgICAgIHN3aXBlci5lbWl0Q29udGFpbmVyQ2xhc3NlcygpO1xyXG4gICAgICAgIHN3aXBlci5wYXJhbXMuZGlyZWN0aW9uID0gbmV3RGlyZWN0aW9uO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZXMuZWFjaChzbGlkZUVsID0+IHtcclxuICAgICAgICAgIGlmIChuZXdEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICAgICAgc2xpZGVFbC5zdHlsZS53aWR0aCA9ICcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2xpZGVFbC5zdHlsZS5oZWlnaHQgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnY2hhbmdlRGlyZWN0aW9uJyk7XHJcbiAgICAgICAgaWYgKG5lZWRVcGRhdGUpIHN3aXBlci51cGRhdGUoKTtcclxuICAgICAgICByZXR1cm4gc3dpcGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtb3VudChlbCkge1xyXG4gICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHN3aXBlci5tb3VudGVkKSByZXR1cm4gdHJ1ZTsgLy8gRmluZCBlbFxyXG5cclxuICAgICAgICBjb25zdCAkZWwgPSAkKGVsIHx8IHN3aXBlci5wYXJhbXMuZWwpO1xyXG4gICAgICAgIGVsID0gJGVsWzBdO1xyXG5cclxuICAgICAgICBpZiAoIWVsKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbC5zd2lwZXIgPSBzd2lwZXI7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFdyYXBwZXJTZWxlY3RvciA9ICgpID0+IHtcclxuICAgICAgICAgIHJldHVybiBgLiR7KHN3aXBlci5wYXJhbXMud3JhcHBlckNsYXNzIHx8ICcnKS50cmltKCkuc3BsaXQoJyAnKS5qb2luKCcuJyl9YDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBnZXRXcmFwcGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVsICYmIGVsLnNoYWRvd1Jvb3QgJiYgZWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9ICQoZWwuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKGdldFdyYXBwZXJTZWxlY3RvcigpKSk7IC8vIENoaWxkcmVuIG5lZWRzIHRvIHJldHVybiBzbG90IGl0ZW1zXHJcblxyXG4gICAgICAgICAgICByZXMuY2hpbGRyZW4gPSBvcHRpb25zID0+ICRlbC5jaGlsZHJlbihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuICRlbC5jaGlsZHJlbihnZXRXcmFwcGVyU2VsZWN0b3IoKSk7XHJcbiAgICAgICAgfTsgLy8gRmluZCBXcmFwcGVyXHJcblxyXG5cclxuICAgICAgICBsZXQgJHdyYXBwZXJFbCA9IGdldFdyYXBwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKCR3cmFwcGVyRWwubGVuZ3RoID09PSAwICYmIHN3aXBlci5wYXJhbXMuY3JlYXRlRWxlbWVudHMpIHtcclxuICAgICAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICR3cmFwcGVyRWwgPSAkKHdyYXBwZXIpO1xyXG4gICAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSBzd2lwZXIucGFyYW1zLndyYXBwZXJDbGFzcztcclxuICAgICAgICAgICRlbC5hcHBlbmQod3JhcHBlcik7XHJcbiAgICAgICAgICAkZWwuY2hpbGRyZW4oYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gKS5lYWNoKHNsaWRlRWwgPT4ge1xyXG4gICAgICAgICAgICAkd3JhcHBlckVsLmFwcGVuZChzbGlkZUVsKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcclxuICAgICAgICAgICRlbCxcclxuICAgICAgICAgIGVsLFxyXG4gICAgICAgICAgJHdyYXBwZXJFbCxcclxuICAgICAgICAgIHdyYXBwZXJFbDogJHdyYXBwZXJFbFswXSxcclxuICAgICAgICAgIG1vdW50ZWQ6IHRydWUsXHJcbiAgICAgICAgICAvLyBSVExcclxuICAgICAgICAgIHJ0bDogZWwuZGlyLnRvTG93ZXJDYXNlKCkgPT09ICdydGwnIHx8ICRlbC5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJyxcclxuICAgICAgICAgIHJ0bFRyYW5zbGF0ZTogc3dpcGVyLnBhcmFtcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyAmJiAoZWwuZGlyLnRvTG93ZXJDYXNlKCkgPT09ICdydGwnIHx8ICRlbC5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJyksXHJcbiAgICAgICAgICB3cm9uZ1JUTDogJHdyYXBwZXJFbC5jc3MoJ2Rpc3BsYXknKSA9PT0gJy13ZWJraXQtYm94J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpbml0KGVsKSB7XHJcbiAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgICBpZiAoc3dpcGVyLmluaXRpYWxpemVkKSByZXR1cm4gc3dpcGVyO1xyXG4gICAgICAgIGNvbnN0IG1vdW50ZWQgPSBzd2lwZXIubW91bnQoZWwpO1xyXG4gICAgICAgIGlmIChtb3VudGVkID09PSBmYWxzZSkgcmV0dXJuIHN3aXBlcjtcclxuICAgICAgICBzd2lwZXIuZW1pdCgnYmVmb3JlSW5pdCcpOyAvLyBTZXQgYnJlYWtwb2ludFxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5icmVha3BvaW50cykge1xyXG4gICAgICAgICAgc3dpcGVyLnNldEJyZWFrcG9pbnQoKTtcclxuICAgICAgICB9IC8vIEFkZCBDbGFzc2VzXHJcblxyXG5cclxuICAgICAgICBzd2lwZXIuYWRkQ2xhc3NlcygpOyAvLyBDcmVhdGUgbG9vcFxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xyXG4gICAgICAgIH0gLy8gVXBkYXRlIHNpemVcclxuXHJcblxyXG4gICAgICAgIHN3aXBlci51cGRhdGVTaXplKCk7IC8vIFVwZGF0ZSBzbGlkZXNcclxuXHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93KSB7XHJcbiAgICAgICAgICBzd2lwZXIuY2hlY2tPdmVyZmxvdygpO1xyXG4gICAgICAgIH0gLy8gU2V0IEdyYWIgQ3Vyc29yXHJcblxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5ncmFiQ3Vyc29yICYmIHN3aXBlci5lbmFibGVkKSB7XHJcbiAgICAgICAgICBzd2lwZXIuc2V0R3JhYkN1cnNvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMucHJlbG9hZEltYWdlcykge1xyXG4gICAgICAgICAgc3dpcGVyLnByZWxvYWRJbWFnZXMoKTtcclxuICAgICAgICB9IC8vIFNsaWRlIFRvIEluaXRpYWwgU2xpZGVcclxuXHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcclxuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHN3aXBlci5wYXJhbXMuaW5pdGlhbFNsaWRlICsgc3dpcGVyLmxvb3BlZFNsaWRlcywgMCwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQsIGZhbHNlLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnBhcmFtcy5pbml0aWFsU2xpZGUsIDAsIHN3aXBlci5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0LCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSAvLyBBdHRhY2ggZXZlbnRzXHJcblxyXG5cclxuICAgICAgICBzd2lwZXIuYXR0YWNoRXZlbnRzKCk7IC8vIEluaXQgRmxhZ1xyXG5cclxuICAgICAgICBzd2lwZXIuaW5pdGlhbGl6ZWQgPSB0cnVlOyAvLyBFbWl0XHJcblxyXG4gICAgICAgIHN3aXBlci5lbWl0KCdpbml0Jyk7XHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ2FmdGVySW5pdCcpO1xyXG4gICAgICAgIHJldHVybiBzd2lwZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlc3Ryb3koZGVsZXRlSW5zdGFuY2UsIGNsZWFuU3R5bGVzKSB7XHJcbiAgICAgICAgaWYgKGRlbGV0ZUluc3RhbmNlID09PSB2b2lkIDApIHtcclxuICAgICAgICAgIGRlbGV0ZUluc3RhbmNlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbGVhblN0eWxlcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICBjbGVhblN0eWxlcyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHBhcmFtcyxcclxuICAgICAgICAgICRlbCxcclxuICAgICAgICAgICR3cmFwcGVyRWwsXHJcbiAgICAgICAgICBzbGlkZXNcclxuICAgICAgICB9ID0gc3dpcGVyO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHN3aXBlci5wYXJhbXMgPT09ICd1bmRlZmluZWQnIHx8IHN3aXBlci5kZXN0cm95ZWQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ2JlZm9yZURlc3Ryb3knKTsgLy8gSW5pdCBGbGFnXHJcblxyXG4gICAgICAgIHN3aXBlci5pbml0aWFsaXplZCA9IGZhbHNlOyAvLyBEZXRhY2ggZXZlbnRzXHJcblxyXG4gICAgICAgIHN3aXBlci5kZXRhY2hFdmVudHMoKTsgLy8gRGVzdHJveSBsb29wXHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMubG9vcCkge1xyXG4gICAgICAgICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XHJcbiAgICAgICAgfSAvLyBDbGVhbnVwIHN0eWxlc1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGNsZWFuU3R5bGVzKSB7XHJcbiAgICAgICAgICBzd2lwZXIucmVtb3ZlQ2xhc3NlcygpO1xyXG4gICAgICAgICAgJGVsLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAkd3JhcHBlckVsLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNsaWRlcyAmJiBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNsaWRlcy5yZW1vdmVDbGFzcyhbcGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzLCBwYXJhbXMuc2xpZGVBY3RpdmVDbGFzcywgcGFyYW1zLnNsaWRlTmV4dENsYXNzLCBwYXJhbXMuc2xpZGVQcmV2Q2xhc3NdLmpvaW4oJyAnKSkucmVtb3ZlQXR0cignc3R5bGUnKS5yZW1vdmVBdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVyLmVtaXQoJ2Rlc3Ryb3knKTsgLy8gRGV0YWNoIGVtaXR0ZXIgZXZlbnRzXHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKHN3aXBlci5ldmVudHNMaXN0ZW5lcnMpLmZvckVhY2goZXZlbnROYW1lID0+IHtcclxuICAgICAgICAgIHN3aXBlci5vZmYoZXZlbnROYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGRlbGV0ZUluc3RhbmNlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgc3dpcGVyLiRlbFswXS5zd2lwZXIgPSBudWxsO1xyXG4gICAgICAgICAgZGVsZXRlUHJvcHMoc3dpcGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXBlci5kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdGF0aWMgZXh0ZW5kRGVmYXVsdHMobmV3RGVmYXVsdHMpIHtcclxuICAgICAgICBleHRlbmQoZXh0ZW5kZWREZWZhdWx0cywgbmV3RGVmYXVsdHMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdGF0aWMgZ2V0IGV4dGVuZGVkRGVmYXVsdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZGVkRGVmYXVsdHM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0YXRpYyBnZXQgZGVmYXVsdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdGF0aWMgaW5zdGFsbE1vZHVsZShtb2QpIHtcclxuICAgICAgICBpZiAoIVN3aXBlci5wcm90b3R5cGUuX19tb2R1bGVzX18pIFN3aXBlci5wcm90b3R5cGUuX19tb2R1bGVzX18gPSBbXTtcclxuICAgICAgICBjb25zdCBtb2R1bGVzID0gU3dpcGVyLnByb3RvdHlwZS5fX21vZHVsZXNfXztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2QgPT09ICdmdW5jdGlvbicgJiYgbW9kdWxlcy5pbmRleE9mKG1vZCkgPCAwKSB7XHJcbiAgICAgICAgICBtb2R1bGVzLnB1c2gobW9kKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0YXRpYyB1c2UobW9kdWxlKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobW9kdWxlKSkge1xyXG4gICAgICAgICAgbW9kdWxlLmZvckVhY2gobSA9PiBTd2lwZXIuaW5zdGFsbE1vZHVsZShtKSk7XHJcbiAgICAgICAgICByZXR1cm4gU3dpcGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU3dpcGVyLmluc3RhbGxNb2R1bGUobW9kdWxlKTtcclxuICAgICAgICByZXR1cm4gU3dpcGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5rZXlzKHByb3RvdHlwZXMpLmZvckVhY2gocHJvdG90eXBlR3JvdXAgPT4ge1xyXG4gICAgICBPYmplY3Qua2V5cyhwcm90b3R5cGVzW3Byb3RvdHlwZUdyb3VwXSkuZm9yRWFjaChwcm90b01ldGhvZCA9PiB7XHJcbiAgICAgICAgU3dpcGVyLnByb3RvdHlwZVtwcm90b01ldGhvZF0gPSBwcm90b3R5cGVzW3Byb3RvdHlwZUdyb3VwXVtwcm90b01ldGhvZF07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBTd2lwZXIudXNlKFtSZXNpemUsIE9ic2VydmVyXSk7XHJcblxyXG4gICAgZnVuY3Rpb24gVmlydHVhbChfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGV4dGVuZFBhcmFtcyxcclxuICAgICAgICBvbixcclxuICAgICAgICBlbWl0XHJcbiAgICAgIH0gPSBfcmVmO1xyXG4gICAgICBleHRlbmRQYXJhbXMoe1xyXG4gICAgICAgIHZpcnR1YWw6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgc2xpZGVzOiBbXSxcclxuICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgcmVuZGVyU2xpZGU6IG51bGwsXHJcbiAgICAgICAgICByZW5kZXJFeHRlcm5hbDogbnVsbCxcclxuICAgICAgICAgIHJlbmRlckV4dGVybmFsVXBkYXRlOiB0cnVlLFxyXG4gICAgICAgICAgYWRkU2xpZGVzQmVmb3JlOiAwLFxyXG4gICAgICAgICAgYWRkU2xpZGVzQWZ0ZXI6IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgY3NzTW9kZVRpbWVvdXQ7XHJcbiAgICAgIHN3aXBlci52aXJ0dWFsID0ge1xyXG4gICAgICAgIGNhY2hlOiB7fSxcclxuICAgICAgICBmcm9tOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdG86IHVuZGVmaW5lZCxcclxuICAgICAgICBzbGlkZXM6IFtdLFxyXG4gICAgICAgIG9mZnNldDogMCxcclxuICAgICAgICBzbGlkZXNHcmlkOiBbXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyU2xpZGUoc2xpZGUsIGluZGV4KSB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy52aXJ0dWFsO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmNhY2hlICYmIHN3aXBlci52aXJ0dWFsLmNhY2hlW2luZGV4XSkge1xyXG4gICAgICAgICAgcmV0dXJuIHN3aXBlci52aXJ0dWFsLmNhY2hlW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0ICRzbGlkZUVsID0gcGFyYW1zLnJlbmRlclNsaWRlID8gJChwYXJhbXMucmVuZGVyU2xpZGUuY2FsbChzd2lwZXIsIHNsaWRlLCBpbmRleCkpIDogJChgPGRpdiBjbGFzcz1cIiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfVwiIGRhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtpbmRleH1cIj4ke3NsaWRlfTwvZGl2PmApO1xyXG4gICAgICAgIGlmICghJHNsaWRlRWwuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSkgJHNsaWRlRWwuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKHBhcmFtcy5jYWNoZSkgc3dpcGVyLnZpcnR1YWwuY2FjaGVbaW5kZXhdID0gJHNsaWRlRWw7XHJcbiAgICAgICAgcmV0dXJuICRzbGlkZUVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGUoZm9yY2UpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3LFxyXG4gICAgICAgICAgc2xpZGVzUGVyR3JvdXAsXHJcbiAgICAgICAgICBjZW50ZXJlZFNsaWRlc1xyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIGFkZFNsaWRlc0JlZm9yZSxcclxuICAgICAgICAgIGFkZFNsaWRlc0FmdGVyXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXMudmlydHVhbDtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBmcm9tOiBwcmV2aW91c0Zyb20sXHJcbiAgICAgICAgICB0bzogcHJldmlvdXNUbyxcclxuICAgICAgICAgIHNsaWRlcyxcclxuICAgICAgICAgIHNsaWRlc0dyaWQ6IHByZXZpb3VzU2xpZGVzR3JpZCxcclxuICAgICAgICAgIG9mZnNldDogcHJldmlvdXNPZmZzZXRcclxuICAgICAgICB9ID0gc3dpcGVyLnZpcnR1YWw7XHJcblxyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4IHx8IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldFByb3A7XHJcbiAgICAgICAgaWYgKHN3aXBlci5ydGxUcmFuc2xhdGUpIG9mZnNldFByb3AgPSAncmlnaHQnO2Vsc2Ugb2Zmc2V0UHJvcCA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gICAgICAgIGxldCBzbGlkZXNBZnRlcjtcclxuICAgICAgICBsZXQgc2xpZGVzQmVmb3JlO1xyXG5cclxuICAgICAgICBpZiAoY2VudGVyZWRTbGlkZXMpIHtcclxuICAgICAgICAgIHNsaWRlc0FmdGVyID0gTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgKyBzbGlkZXNQZXJHcm91cCArIGFkZFNsaWRlc0FmdGVyO1xyXG4gICAgICAgICAgc2xpZGVzQmVmb3JlID0gTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgKyBzbGlkZXNQZXJHcm91cCArIGFkZFNsaWRlc0JlZm9yZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2xpZGVzQWZ0ZXIgPSBzbGlkZXNQZXJWaWV3ICsgKHNsaWRlc1Blckdyb3VwIC0gMSkgKyBhZGRTbGlkZXNBZnRlcjtcclxuICAgICAgICAgIHNsaWRlc0JlZm9yZSA9IHNsaWRlc1Blckdyb3VwICsgYWRkU2xpZGVzQmVmb3JlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZnJvbSA9IE1hdGgubWF4KChhY3RpdmVJbmRleCB8fCAwKSAtIHNsaWRlc0JlZm9yZSwgMCk7XHJcbiAgICAgICAgY29uc3QgdG8gPSBNYXRoLm1pbigoYWN0aXZlSW5kZXggfHwgMCkgKyBzbGlkZXNBZnRlciwgc2xpZGVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IChzd2lwZXIuc2xpZGVzR3JpZFtmcm9tXSB8fCAwKSAtIChzd2lwZXIuc2xpZGVzR3JpZFswXSB8fCAwKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHN3aXBlci52aXJ0dWFsLCB7XHJcbiAgICAgICAgICBmcm9tLFxyXG4gICAgICAgICAgdG8sXHJcbiAgICAgICAgICBvZmZzZXQsXHJcbiAgICAgICAgICBzbGlkZXNHcmlkOiBzd2lwZXIuc2xpZGVzR3JpZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvblJlbmRlcmVkKCkge1xyXG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlcygpO1xyXG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICAgICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIubGF6eSAmJiBzd2lwZXIucGFyYW1zLmxhenkuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBzd2lwZXIubGF6eS5sb2FkKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZW1pdCgndmlydHVhbFVwZGF0ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByZXZpb3VzRnJvbSA9PT0gZnJvbSAmJiBwcmV2aW91c1RvID09PSB0byAmJiAhZm9yY2UpIHtcclxuICAgICAgICAgIGlmIChzd2lwZXIuc2xpZGVzR3JpZCAhPT0gcHJldmlvdXNTbGlkZXNHcmlkICYmIG9mZnNldCAhPT0gcHJldmlvdXNPZmZzZXQpIHtcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlcy5jc3Mob2Zmc2V0UHJvcCwgYCR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICAgICAgICBlbWl0KCd2aXJ0dWFsVXBkYXRlJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLnJlbmRlckV4dGVybmFsKSB7XHJcbiAgICAgICAgICBzd2lwZXIucGFyYW1zLnZpcnR1YWwucmVuZGVyRXh0ZXJuYWwuY2FsbChzd2lwZXIsIHtcclxuICAgICAgICAgICAgb2Zmc2V0LFxyXG4gICAgICAgICAgICBmcm9tLFxyXG4gICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgc2xpZGVzOiBmdW5jdGlvbiBnZXRTbGlkZXMoKSB7XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2xpZGVzVG9SZW5kZXIgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGZyb207IGkgPD0gdG87IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9SZW5kZXIucHVzaChzbGlkZXNbaV0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHNsaWRlc1RvUmVuZGVyO1xyXG4gICAgICAgICAgICB9KClcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwucmVuZGVyRXh0ZXJuYWxVcGRhdGUpIHtcclxuICAgICAgICAgICAgb25SZW5kZXJlZCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZW1pdCgndmlydHVhbFVwZGF0ZScpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHByZXBlbmRJbmRleGVzID0gW107XHJcbiAgICAgICAgY29uc3QgYXBwZW5kSW5kZXhlcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoZm9yY2UpIHtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLmZpbmQoYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gKS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IHByZXZpb3VzRnJvbTsgaSA8PSBwcmV2aW91c1RvOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKGkgPCBmcm9tIHx8IGkgPiB0bykge1xyXG4gICAgICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLmZpbmQoYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31bZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke2l9XCJdYCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAoaSA+PSBmcm9tICYmIGkgPD0gdG8pIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcmV2aW91c1RvID09PSAndW5kZWZpbmVkJyB8fCBmb3JjZSkge1xyXG4gICAgICAgICAgICAgIGFwcGVuZEluZGV4ZXMucHVzaChpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAoaSA+IHByZXZpb3VzVG8pIGFwcGVuZEluZGV4ZXMucHVzaChpKTtcclxuICAgICAgICAgICAgICBpZiAoaSA8IHByZXZpb3VzRnJvbSkgcHJlcGVuZEluZGV4ZXMucHVzaChpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwZW5kSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLmFwcGVuZChyZW5kZXJTbGlkZShzbGlkZXNbaW5kZXhdLCBpbmRleCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHByZXBlbmRJbmRleGVzLnNvcnQoKGEsIGIpID0+IGIgLSBhKS5mb3JFYWNoKGluZGV4ID0+IHtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLnByZXBlbmQocmVuZGVyU2xpZGUoc2xpZGVzW2luZGV4XSwgaW5kZXgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5jaGlsZHJlbignLnN3aXBlci1zbGlkZScpLmNzcyhvZmZzZXRQcm9wLCBgJHtvZmZzZXR9cHhgKTtcclxuICAgICAgICBvblJlbmRlcmVkKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFwcGVuZFNsaWRlKHNsaWRlcykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2xpZGVzID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBzbGlkZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChzbGlkZXNbaV0pIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5wdXNoKHNsaWRlc1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5wdXNoKHNsaWRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGUodHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHByZXBlbmRTbGlkZShzbGlkZXMpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleDtcclxuICAgICAgICBsZXQgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleCArIDE7XHJcbiAgICAgICAgbGV0IG51bWJlck9mTmV3U2xpZGVzID0gMTtcclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2xpZGVzKSkge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKHNsaWRlc1tpXSkgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnVuc2hpZnQoc2xpZGVzW2ldKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBuZXdBY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4ICsgc2xpZGVzLmxlbmd0aDtcclxuICAgICAgICAgIG51bWJlck9mTmV3U2xpZGVzID0gc2xpZGVzLmxlbmd0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnVuc2hpZnQoc2xpZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwuY2FjaGUpIHtcclxuICAgICAgICAgIGNvbnN0IGNhY2hlID0gc3dpcGVyLnZpcnR1YWwuY2FjaGU7XHJcbiAgICAgICAgICBjb25zdCBuZXdDYWNoZSA9IHt9O1xyXG4gICAgICAgICAgT2JqZWN0LmtleXMoY2FjaGUpLmZvckVhY2goY2FjaGVkSW5kZXggPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkY2FjaGVkRWwgPSBjYWNoZVtjYWNoZWRJbmRleF07XHJcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZEVsSW5kZXggPSAkY2FjaGVkRWwuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWNoZWRFbEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgJGNhY2hlZEVsLmF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JywgcGFyc2VJbnQoY2FjaGVkRWxJbmRleCwgMTApICsgbnVtYmVyT2ZOZXdTbGlkZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXdDYWNoZVtwYXJzZUludChjYWNoZWRJbmRleCwgMTApICsgbnVtYmVyT2ZOZXdTbGlkZXNdID0gJGNhY2hlZEVsO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzd2lwZXIudmlydHVhbC5jYWNoZSA9IG5ld0NhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlKHRydWUpO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4LCAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVtb3ZlU2xpZGUoc2xpZGVzSW5kZXhlcykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2xpZGVzSW5kZXhlcyA9PT0gJ3VuZGVmaW5lZCcgfHwgc2xpZGVzSW5kZXhlcyA9PT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBhY3RpdmVJbmRleCA9IHN3aXBlci5hY3RpdmVJbmRleDtcclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2xpZGVzSW5kZXhlcykpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSBzbGlkZXNJbmRleGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XHJcbiAgICAgICAgICAgIHN3aXBlci52aXJ0dWFsLnNsaWRlcy5zcGxpY2Uoc2xpZGVzSW5kZXhlc1tpXSwgMSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmNhY2hlKSB7XHJcbiAgICAgICAgICAgICAgZGVsZXRlIHN3aXBlci52aXJ0dWFsLmNhY2hlW3NsaWRlc0luZGV4ZXNbaV1dO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2xpZGVzSW5kZXhlc1tpXSA8IGFjdGl2ZUluZGV4KSBhY3RpdmVJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICBhY3RpdmVJbmRleCA9IE1hdGgubWF4KGFjdGl2ZUluZGV4LCAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzLnNwbGljZShzbGlkZXNJbmRleGVzLCAxKTtcclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmNhY2hlKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBzd2lwZXIudmlydHVhbC5jYWNoZVtzbGlkZXNJbmRleGVzXTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoc2xpZGVzSW5kZXhlcyA8IGFjdGl2ZUluZGV4KSBhY3RpdmVJbmRleCAtPSAxO1xyXG4gICAgICAgICAgYWN0aXZlSW5kZXggPSBNYXRoLm1heChhY3RpdmVJbmRleCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oYWN0aXZlSW5kZXgsIDApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiByZW1vdmVBbGxTbGlkZXMoKSB7XHJcbiAgICAgICAgc3dpcGVyLnZpcnR1YWwuc2xpZGVzID0gW107XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwuY2FjaGUpIHtcclxuICAgICAgICAgIHN3aXBlci52aXJ0dWFsLmNhY2hlID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oMCwgMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIudmlydHVhbC5zbGlkZXMgPSBzd2lwZXIucGFyYW1zLnZpcnR1YWwuc2xpZGVzO1xyXG4gICAgICAgIHN3aXBlci5jbGFzc05hbWVzLnB1c2goYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfXZpcnR1YWxgKTtcclxuICAgICAgICBzd2lwZXIucGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICAgIHN3aXBlci5vcmlnaW5hbFBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLmluaXRpYWxTbGlkZSkge1xyXG4gICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUgJiYgIXN3aXBlci5faW1tZWRpYXRlVmlydHVhbCkge1xyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KGNzc01vZGVUaW1lb3V0KTtcclxuICAgICAgICAgIGNzc01vZGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2luaXQgdXBkYXRlIHJlc2l6ZScsICgpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIHNldENTU1Byb3BlcnR5KHN3aXBlci53cmFwcGVyRWwsICctLXN3aXBlci12aXJ0dWFsLXNpemUnLCBgJHtzd2lwZXIudmlydHVhbFNpemV9cHhgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci52aXJ0dWFsLCB7XHJcbiAgICAgICAgYXBwZW5kU2xpZGUsXHJcbiAgICAgICAgcHJlcGVuZFNsaWRlLFxyXG4gICAgICAgIHJlbW92ZVNsaWRlLFxyXG4gICAgICAgIHJlbW92ZUFsbFNsaWRlcyxcclxuICAgICAgICB1cGRhdGVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cclxuICAgIGZ1bmN0aW9uIEtleWJvYXJkKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIHN3aXBlci5rZXlib2FyZCA9IHtcclxuICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgICBleHRlbmRQYXJhbXMoe1xyXG4gICAgICAgIGtleWJvYXJkOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgIG9ubHlJblZpZXdwb3J0OiB0cnVlLFxyXG4gICAgICAgICAgcGFnZVVwRG93bjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBoYW5kbGUoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgcnRsVHJhbnNsYXRlOiBydGxcclxuICAgICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAgIGxldCBlID0gZXZlbnQ7XHJcbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy8ganF1ZXJ5IGZpeFxyXG5cclxuICAgICAgICBjb25zdCBrYyA9IGUua2V5Q29kZSB8fCBlLmNoYXJDb2RlO1xyXG4gICAgICAgIGNvbnN0IHBhZ2VVcERvd24gPSBzd2lwZXIucGFyYW1zLmtleWJvYXJkLnBhZ2VVcERvd247XHJcbiAgICAgICAgY29uc3QgaXNQYWdlVXAgPSBwYWdlVXBEb3duICYmIGtjID09PSAzMztcclxuICAgICAgICBjb25zdCBpc1BhZ2VEb3duID0gcGFnZVVwRG93biAmJiBrYyA9PT0gMzQ7XHJcbiAgICAgICAgY29uc3QgaXNBcnJvd0xlZnQgPSBrYyA9PT0gMzc7XHJcbiAgICAgICAgY29uc3QgaXNBcnJvd1JpZ2h0ID0ga2MgPT09IDM5O1xyXG4gICAgICAgIGNvbnN0IGlzQXJyb3dVcCA9IGtjID09PSAzODtcclxuICAgICAgICBjb25zdCBpc0Fycm93RG93biA9IGtjID09PSA0MDsgLy8gRGlyZWN0aW9ucyBsb2Nrc1xyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlTmV4dCAmJiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIGlzQXJyb3dSaWdodCB8fCBzd2lwZXIuaXNWZXJ0aWNhbCgpICYmIGlzQXJyb3dEb3duIHx8IGlzUGFnZURvd24pKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5hbGxvd1NsaWRlUHJldiAmJiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpICYmIGlzQXJyb3dMZWZ0IHx8IHN3aXBlci5pc1ZlcnRpY2FsKCkgJiYgaXNBcnJvd1VwIHx8IGlzUGFnZVVwKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUuc2hpZnRLZXkgfHwgZS5hbHRLZXkgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xyXG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUgJiYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0JyB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0YXJlYScpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMua2V5Ym9hcmQub25seUluVmlld3BvcnQgJiYgKGlzUGFnZVVwIHx8IGlzUGFnZURvd24gfHwgaXNBcnJvd0xlZnQgfHwgaXNBcnJvd1JpZ2h0IHx8IGlzQXJyb3dVcCB8fCBpc0Fycm93RG93bikpIHtcclxuICAgICAgICAgIGxldCBpblZpZXcgPSBmYWxzZTsgLy8gQ2hlY2sgdGhhdCBzd2lwZXIgc2hvdWxkIGJlIGluc2lkZSBvZiB2aXNpYmxlIGFyZWEgb2Ygd2luZG93XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci4kZWwucGFyZW50cyhgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfWApLmxlbmd0aCA+IDAgJiYgc3dpcGVyLiRlbC5wYXJlbnRzKGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3N9YCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgJGVsID0gc3dpcGVyLiRlbDtcclxuICAgICAgICAgIGNvbnN0IHN3aXBlcldpZHRoID0gJGVsWzBdLmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgY29uc3Qgc3dpcGVySGVpZ2h0ID0gJGVsWzBdLmNsaWVudEhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgICBjb25zdCBzd2lwZXJPZmZzZXQgPSBzd2lwZXIuJGVsLm9mZnNldCgpO1xyXG4gICAgICAgICAgaWYgKHJ0bCkgc3dpcGVyT2Zmc2V0LmxlZnQgLT0gc3dpcGVyLiRlbFswXS5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgY29uc3Qgc3dpcGVyQ29vcmQgPSBbW3N3aXBlck9mZnNldC5sZWZ0LCBzd2lwZXJPZmZzZXQudG9wXSwgW3N3aXBlck9mZnNldC5sZWZ0ICsgc3dpcGVyV2lkdGgsIHN3aXBlck9mZnNldC50b3BdLCBbc3dpcGVyT2Zmc2V0LmxlZnQsIHN3aXBlck9mZnNldC50b3AgKyBzd2lwZXJIZWlnaHRdLCBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzd2lwZXJXaWR0aCwgc3dpcGVyT2Zmc2V0LnRvcCArIHN3aXBlckhlaWdodF1dO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3dpcGVyQ29vcmQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSBzd2lwZXJDb29yZFtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb2ludFswXSA+PSAwICYmIHBvaW50WzBdIDw9IHdpbmRvd1dpZHRoICYmIHBvaW50WzFdID49IDAgJiYgcG9pbnRbMV0gPD0gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHBvaW50WzBdID09PSAwICYmIHBvaW50WzFdID09PSAwKSBjb250aW51ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG5cclxuICAgICAgICAgICAgICBpblZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCFpblZpZXcpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XHJcbiAgICAgICAgICBpZiAoaXNQYWdlVXAgfHwgaXNQYWdlRG93biB8fCBpc0Fycm93TGVmdCB8fCBpc0Fycm93UmlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoKGlzUGFnZURvd24gfHwgaXNBcnJvd1JpZ2h0KSAmJiAhcnRsIHx8IChpc1BhZ2VVcCB8fCBpc0Fycm93TGVmdCkgJiYgcnRsKSBzd2lwZXIuc2xpZGVOZXh0KCk7XHJcbiAgICAgICAgICBpZiAoKGlzUGFnZVVwIHx8IGlzQXJyb3dMZWZ0KSAmJiAhcnRsIHx8IChpc1BhZ2VEb3duIHx8IGlzQXJyb3dSaWdodCkgJiYgcnRsKSBzd2lwZXIuc2xpZGVQcmV2KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChpc1BhZ2VVcCB8fCBpc1BhZ2VEb3duIHx8IGlzQXJyb3dVcCB8fCBpc0Fycm93RG93bikge1xyXG4gICAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc1BhZ2VEb3duIHx8IGlzQXJyb3dEb3duKSBzd2lwZXIuc2xpZGVOZXh0KCk7XHJcbiAgICAgICAgICBpZiAoaXNQYWdlVXAgfHwgaXNBcnJvd1VwKSBzd2lwZXIuc2xpZGVQcmV2KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbWl0KCdrZXlQcmVzcycsIGtjKTtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBlbmFibGUoKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5rZXlib2FyZC5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCBoYW5kbGUpO1xyXG4gICAgICAgIHN3aXBlci5rZXlib2FyZC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgICAgICBpZiAoIXN3aXBlci5rZXlib2FyZC5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdrZXlkb3duJywgaGFuZGxlKTtcclxuICAgICAgICBzd2lwZXIua2V5Ym9hcmQuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvbignaW5pdCcsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5rZXlib2FyZC5lbmFibGVkKSB7XHJcbiAgICAgICAgICBlbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLmtleWJvYXJkLmVuYWJsZWQpIHtcclxuICAgICAgICAgIGRpc2FibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5rZXlib2FyZCwge1xyXG4gICAgICAgIGVuYWJsZSxcclxuICAgICAgICBkaXNhYmxlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXHJcbiAgICBmdW5jdGlvbiBNb3VzZXdoZWVsKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICBleHRlbmRQYXJhbXMoe1xyXG4gICAgICAgIG1vdXNld2hlZWw6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgcmVsZWFzZU9uRWRnZXM6IGZhbHNlLFxyXG4gICAgICAgICAgaW52ZXJ0OiBmYWxzZSxcclxuICAgICAgICAgIGZvcmNlVG9BeGlzOiBmYWxzZSxcclxuICAgICAgICAgIHNlbnNpdGl2aXR5OiAxLFxyXG4gICAgICAgICAgZXZlbnRzVGFyZ2V0OiAnY29udGFpbmVyJyxcclxuICAgICAgICAgIHRocmVzaG9sZERlbHRhOiBudWxsLFxyXG4gICAgICAgICAgdGhyZXNob2xkVGltZTogbnVsbFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHN3aXBlci5tb3VzZXdoZWVsID0ge1xyXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCB0aW1lb3V0O1xyXG4gICAgICBsZXQgbGFzdFNjcm9sbFRpbWUgPSBub3coKTtcclxuICAgICAgbGV0IGxhc3RFdmVudEJlZm9yZVNuYXA7XHJcbiAgICAgIGNvbnN0IHJlY2VudFdoZWVsRXZlbnRzID0gW107XHJcblxyXG4gICAgICBmdW5jdGlvbiBub3JtYWxpemUoZSkge1xyXG4gICAgICAgIC8vIFJlYXNvbmFibGUgZGVmYXVsdHNcclxuICAgICAgICBjb25zdCBQSVhFTF9TVEVQID0gMTA7XHJcbiAgICAgICAgY29uc3QgTElORV9IRUlHSFQgPSA0MDtcclxuICAgICAgICBjb25zdCBQQUdFX0hFSUdIVCA9IDgwMDtcclxuICAgICAgICBsZXQgc1ggPSAwO1xyXG4gICAgICAgIGxldCBzWSA9IDA7IC8vIHNwaW5YLCBzcGluWVxyXG5cclxuICAgICAgICBsZXQgcFggPSAwO1xyXG4gICAgICAgIGxldCBwWSA9IDA7IC8vIHBpeGVsWCwgcGl4ZWxZXHJcbiAgICAgICAgLy8gTGVnYWN5XHJcblxyXG4gICAgICAgIGlmICgnZGV0YWlsJyBpbiBlKSB7XHJcbiAgICAgICAgICBzWSA9IGUuZGV0YWlsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCd3aGVlbERlbHRhJyBpbiBlKSB7XHJcbiAgICAgICAgICBzWSA9IC1lLndoZWVsRGVsdGEgLyAxMjA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJ3doZWVsRGVsdGFZJyBpbiBlKSB7XHJcbiAgICAgICAgICBzWSA9IC1lLndoZWVsRGVsdGFZIC8gMTIwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCd3aGVlbERlbHRhWCcgaW4gZSkge1xyXG4gICAgICAgICAgc1ggPSAtZS53aGVlbERlbHRhWCAvIDEyMDtcclxuICAgICAgICB9IC8vIHNpZGUgc2Nyb2xsaW5nIG9uIEZGIHdpdGggRE9NTW91c2VTY3JvbGxcclxuXHJcblxyXG4gICAgICAgIGlmICgnYXhpcycgaW4gZSAmJiBlLmF4aXMgPT09IGUuSE9SSVpPTlRBTF9BWElTKSB7XHJcbiAgICAgICAgICBzWCA9IHNZO1xyXG4gICAgICAgICAgc1kgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcFggPSBzWCAqIFBJWEVMX1NURVA7XHJcbiAgICAgICAgcFkgPSBzWSAqIFBJWEVMX1NURVA7XHJcblxyXG4gICAgICAgIGlmICgnZGVsdGFZJyBpbiBlKSB7XHJcbiAgICAgICAgICBwWSA9IGUuZGVsdGFZO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCdkZWx0YVgnIGluIGUpIHtcclxuICAgICAgICAgIHBYID0gZS5kZWx0YVg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS5zaGlmdEtleSAmJiAhcFgpIHtcclxuICAgICAgICAgIC8vIGlmIHVzZXIgc2Nyb2xscyB3aXRoIHNoaWZ0IGhlIHdhbnRzIGhvcml6b250YWwgc2Nyb2xsXHJcbiAgICAgICAgICBwWCA9IHBZO1xyXG4gICAgICAgICAgcFkgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKChwWCB8fCBwWSkgJiYgZS5kZWx0YU1vZGUpIHtcclxuICAgICAgICAgIGlmIChlLmRlbHRhTW9kZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyBkZWx0YSBpbiBMSU5FIHVuaXRzXHJcbiAgICAgICAgICAgIHBYICo9IExJTkVfSEVJR0hUO1xyXG4gICAgICAgICAgICBwWSAqPSBMSU5FX0hFSUdIVDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGRlbHRhIGluIFBBR0UgdW5pdHNcclxuICAgICAgICAgICAgcFggKj0gUEFHRV9IRUlHSFQ7XHJcbiAgICAgICAgICAgIHBZICo9IFBBR0VfSEVJR0hUO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gRmFsbC1iYWNrIGlmIHNwaW4gY2Fubm90IGJlIGRldGVybWluZWRcclxuXHJcblxyXG4gICAgICAgIGlmIChwWCAmJiAhc1gpIHtcclxuICAgICAgICAgIHNYID0gcFggPCAxID8gLTEgOiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBZICYmICFzWSkge1xyXG4gICAgICAgICAgc1kgPSBwWSA8IDEgPyAtMSA6IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgc3Bpblg6IHNYLFxyXG4gICAgICAgICAgc3Bpblk6IHNZLFxyXG4gICAgICAgICAgcGl4ZWxYOiBwWCxcclxuICAgICAgICAgIHBpeGVsWTogcFlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZUVudGVyKCkge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIubW91c2VFbnRlcmVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaGFuZGxlTW91c2VMZWF2ZSgpIHtcclxuICAgICAgICBpZiAoIXN3aXBlci5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgc3dpcGVyLm1vdXNlRW50ZXJlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBhbmltYXRlU2xpZGVyKG5ld0V2ZW50KSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC50aHJlc2hvbGREZWx0YSAmJiBuZXdFdmVudC5kZWx0YSA8IHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC50aHJlc2hvbGREZWx0YSkge1xyXG4gICAgICAgICAgLy8gUHJldmVudCBpZiBkZWx0YSBvZiB3aGVlbCBzY3JvbGwgZGVsdGEgaXMgYmVsb3cgY29uZmlndXJlZCB0aHJlc2hvbGRcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwudGhyZXNob2xkVGltZSAmJiBub3coKSAtIGxhc3RTY3JvbGxUaW1lIDwgc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLnRocmVzaG9sZFRpbWUpIHtcclxuICAgICAgICAgIC8vIFByZXZlbnQgaWYgdGltZSBiZXR3ZWVuIHNjcm9sbHMgaXMgYmVsb3cgY29uZmlndXJlZCB0aHJlc2hvbGRcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IC8vIElmIHRoZSBtb3ZlbWVudCBpcyBOT1QgYmlnIGVub3VnaCBhbmRcclxuICAgICAgICAvLyBpZiB0aGUgbGFzdCB0aW1lIHRoZSB1c2VyIHNjcm9sbGVkIHdhcyB0b28gY2xvc2UgdG8gdGhlIGN1cnJlbnQgb25lIChhdm9pZCBjb250aW51b3VzbHkgdHJpZ2dlcmluZyB0aGUgc2xpZGVyKTpcclxuICAgICAgICAvLyAgIERvbid0IGdvIGFueSBmdXJ0aGVyIChhdm9pZCBpbnNpZ25pZmljYW50IHNjcm9sbCBtb3ZlbWVudCkuXHJcblxyXG5cclxuICAgICAgICBpZiAobmV3RXZlbnQuZGVsdGEgPj0gNiAmJiBub3coKSAtIGxhc3RTY3JvbGxUaW1lIDwgNjApIHtcclxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBhcyBhIGRlZmF1bHRcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gLy8gSWYgdXNlciBpcyBzY3JvbGxpbmcgdG93YXJkcyB0aGUgZW5kOlxyXG4gICAgICAgIC8vICAgSWYgdGhlIHNsaWRlciBoYXNuJ3QgaGl0IHRoZSBsYXRlc3Qgc2xpZGUgb3JcclxuICAgICAgICAvLyAgIGlmIHRoZSBzbGlkZXIgaXMgYSBsb29wIGFuZFxyXG4gICAgICAgIC8vICAgaWYgdGhlIHNsaWRlciBpc24ndCBtb3ZpbmcgcmlnaHQgbm93OlxyXG4gICAgICAgIC8vICAgICBHbyB0byBuZXh0IHNsaWRlIGFuZFxyXG4gICAgICAgIC8vICAgICBlbWl0IGEgc2Nyb2xsIGV2ZW50LlxyXG4gICAgICAgIC8vIEVsc2UgKHRoZSB1c2VyIGlzIHNjcm9sbGluZyB0b3dhcmRzIHRoZSBiZWdpbm5pbmcpIGFuZFxyXG4gICAgICAgIC8vIGlmIHRoZSBzbGlkZXIgaGFzbid0IGhpdCB0aGUgZmlyc3Qgc2xpZGUgb3JcclxuICAgICAgICAvLyBpZiB0aGUgc2xpZGVyIGlzIGEgbG9vcCBhbmRcclxuICAgICAgICAvLyBpZiB0aGUgc2xpZGVyIGlzbid0IG1vdmluZyByaWdodCBub3c6XHJcbiAgICAgICAgLy8gICBHbyB0byBwcmV2IHNsaWRlIGFuZFxyXG4gICAgICAgIC8vICAgZW1pdCBhIHNjcm9sbCBldmVudC5cclxuXHJcblxyXG4gICAgICAgIGlmIChuZXdFdmVudC5kaXJlY3Rpb24gPCAwKSB7XHJcbiAgICAgICAgICBpZiAoKCFzd2lwZXIuaXNFbmQgfHwgc3dpcGVyLnBhcmFtcy5sb29wKSAmJiAhc3dpcGVyLmFuaW1hdGluZykge1xyXG4gICAgICAgICAgICBzd2lwZXIuc2xpZGVOZXh0KCk7XHJcbiAgICAgICAgICAgIGVtaXQoJ3Njcm9sbCcsIG5ld0V2ZW50LnJhdyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgoIXN3aXBlci5pc0JlZ2lubmluZyB8fCBzd2lwZXIucGFyYW1zLmxvb3ApICYmICFzd2lwZXIuYW5pbWF0aW5nKSB7XHJcbiAgICAgICAgICBzd2lwZXIuc2xpZGVQcmV2KCk7XHJcbiAgICAgICAgICBlbWl0KCdzY3JvbGwnLCBuZXdFdmVudC5yYXcpO1xyXG4gICAgICAgIH0gLy8gSWYgeW91IGdvdCBoZXJlIGlzIGJlY2F1c2UgYW4gYW5pbWF0aW9uIGhhcyBiZWVuIHRyaWdnZXJlZCBzbyBzdG9yZSB0aGUgY3VycmVudCB0aW1lXHJcblxyXG5cclxuICAgICAgICBsYXN0U2Nyb2xsVGltZSA9IG5ldyB3aW5kb3cuRGF0ZSgpLmdldFRpbWUoKTsgLy8gUmV0dXJuIGZhbHNlIGFzIGEgZGVmYXVsdFxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlbGVhc2VTY3JvbGwobmV3RXZlbnQpIHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLm1vdXNld2hlZWw7XHJcblxyXG4gICAgICAgIGlmIChuZXdFdmVudC5kaXJlY3Rpb24gPCAwKSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgcGFyYW1zLnJlbGVhc2VPbkVkZ2VzKSB7XHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0cnVlIHRvIGFuaW1hdGUgc2Nyb2xsIG9uIGVkZ2VzXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgcGFyYW1zLnJlbGVhc2VPbkVkZ2VzKSB7XHJcbiAgICAgICAgICAvLyBSZXR1cm4gdHJ1ZSB0byBhbmltYXRlIHNjcm9sbCBvbiBlZGdlc1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShldmVudCkge1xyXG4gICAgICAgIGxldCBlID0gZXZlbnQ7XHJcbiAgICAgICAgbGV0IGRpc2FibGVQYXJlbnRTd2lwZXIgPSB0cnVlO1xyXG4gICAgICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLm1vdXNld2hlZWw7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXQgPSBzd2lwZXIuJGVsO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLmV2ZW50c1RhcmdldCAhPT0gJ2NvbnRhaW5lcicpIHtcclxuICAgICAgICAgIHRhcmdldCA9ICQoc3dpcGVyLnBhcmFtcy5tb3VzZXdoZWVsLmV2ZW50c1RhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5tb3VzZUVudGVyZWQgJiYgIXRhcmdldFswXS5jb250YWlucyhlLnRhcmdldCkgJiYgIXBhcmFtcy5yZWxlYXNlT25FZGdlcykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy8ganF1ZXJ5IGZpeFxyXG5cclxuICAgICAgICBsZXQgZGVsdGEgPSAwO1xyXG4gICAgICAgIGNvbnN0IHJ0bEZhY3RvciA9IHN3aXBlci5ydGxUcmFuc2xhdGUgPyAtMSA6IDE7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IG5vcm1hbGl6ZShlKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5mb3JjZVRvQXhpcykge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGF0YS5waXhlbFgpID4gTWF0aC5hYnMoZGF0YS5waXhlbFkpKSBkZWx0YSA9IC1kYXRhLnBpeGVsWCAqIHJ0bEZhY3RvcjtlbHNlIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhkYXRhLnBpeGVsWSkgPiBNYXRoLmFicyhkYXRhLnBpeGVsWCkpIGRlbHRhID0gLWRhdGEucGl4ZWxZO2Vsc2UgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRlbHRhID0gTWF0aC5hYnMoZGF0YS5waXhlbFgpID4gTWF0aC5hYnMoZGF0YS5waXhlbFkpID8gLWRhdGEucGl4ZWxYICogcnRsRmFjdG9yIDogLWRhdGEucGl4ZWxZO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRlbHRhID09PSAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAocGFyYW1zLmludmVydCkgZGVsdGEgPSAtZGVsdGE7IC8vIEdldCB0aGUgc2Nyb2xsIHBvc2l0aW9uc1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb25zID0gc3dpcGVyLmdldFRyYW5zbGF0ZSgpICsgZGVsdGEgKiBwYXJhbXMuc2Vuc2l0aXZpdHk7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9ucyA+PSBzd2lwZXIubWluVHJhbnNsYXRlKCkpIHBvc2l0aW9ucyA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcclxuICAgICAgICBpZiAocG9zaXRpb25zIDw9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSkgcG9zaXRpb25zID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpOyAvLyBXaGVuIGxvb3AgaXMgdHJ1ZTpcclxuICAgICAgICAvLyAgICAgdGhlIGRpc2FibGVQYXJlbnRTd2lwZXIgd2lsbCBiZSB0cnVlLlxyXG4gICAgICAgIC8vIFdoZW4gbG9vcCBpcyBmYWxzZTpcclxuICAgICAgICAvLyAgICAgaWYgdGhlIHNjcm9sbCBwb3NpdGlvbnMgaXMgbm90IG9uIGVkZ2UsXHJcbiAgICAgICAgLy8gICAgIHRoZW4gdGhlIGRpc2FibGVQYXJlbnRTd2lwZXIgd2lsbCBiZSB0cnVlLlxyXG4gICAgICAgIC8vICAgICBpZiB0aGUgc2Nyb2xsIG9uIGVkZ2UgcG9zaXRpb25zLFxyXG4gICAgICAgIC8vICAgICB0aGVuIHRoZSBkaXNhYmxlUGFyZW50U3dpcGVyIHdpbGwgYmUgZmFsc2UuXHJcblxyXG4gICAgICAgIGRpc2FibGVQYXJlbnRTd2lwZXIgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyB0cnVlIDogIShwb3NpdGlvbnMgPT09IHN3aXBlci5taW5UcmFuc2xhdGUoKSB8fCBwb3NpdGlvbnMgPT09IHN3aXBlci5tYXhUcmFuc2xhdGUoKSk7XHJcbiAgICAgICAgaWYgKGRpc2FibGVQYXJlbnRTd2lwZXIgJiYgc3dpcGVyLnBhcmFtcy5uZXN0ZWQpIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5mcmVlTW9kZSB8fCAhc3dpcGVyLnBhcmFtcy5mcmVlTW9kZS5lbmFibGVkKSB7XHJcbiAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgbmV3IGV2ZW50IGluIGEgdmFyaWFibGUgd2hpY2ggc3RvcmVzIHRoZSByZWxldmFudCBkYXRhXHJcbiAgICAgICAgICBjb25zdCBuZXdFdmVudCA9IHtcclxuICAgICAgICAgICAgdGltZTogbm93KCksXHJcbiAgICAgICAgICAgIGRlbHRhOiBNYXRoLmFicyhkZWx0YSksXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogTWF0aC5zaWduKGRlbHRhKSxcclxuICAgICAgICAgICAgcmF3OiBldmVudFxyXG4gICAgICAgICAgfTsgLy8gS2VlcCB0aGUgbW9zdCByZWNlbnQgZXZlbnRzXHJcblxyXG4gICAgICAgICAgaWYgKHJlY2VudFdoZWVsRXZlbnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNoaWZ0KCk7IC8vIG9ubHkgc3RvcmUgdGhlIGxhc3QgTiBldmVudHNcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBwcmV2RXZlbnQgPSByZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPyByZWNlbnRXaGVlbEV2ZW50c1tyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnB1c2gobmV3RXZlbnQpOyAvLyBJZiB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgcHJldmlvdXMgcmVjb3JkZWQgZXZlbnQ6XHJcbiAgICAgICAgICAvLyAgIElmIGRpcmVjdGlvbiBoYXMgY2hhbmdlZCBvclxyXG4gICAgICAgICAgLy8gICBpZiB0aGUgc2Nyb2xsIGlzIHF1aWNrZXIgdGhhbiB0aGUgcHJldmlvdXMgb25lOlxyXG4gICAgICAgICAgLy8gICAgIEFuaW1hdGUgdGhlIHNsaWRlci5cclxuICAgICAgICAgIC8vIEVsc2UgKHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgdGhlIHdoZWVsIGlzIG1vdmVkKTpcclxuICAgICAgICAgIC8vICAgICBBbmltYXRlIHRoZSBzbGlkZXIuXHJcblxyXG4gICAgICAgICAgaWYgKHByZXZFdmVudCkge1xyXG4gICAgICAgICAgICBpZiAobmV3RXZlbnQuZGlyZWN0aW9uICE9PSBwcmV2RXZlbnQuZGlyZWN0aW9uIHx8IG5ld0V2ZW50LmRlbHRhID4gcHJldkV2ZW50LmRlbHRhIHx8IG5ld0V2ZW50LnRpbWUgPiBwcmV2RXZlbnQudGltZSArIDE1MCkge1xyXG4gICAgICAgICAgICAgIGFuaW1hdGVTbGlkZXIobmV3RXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmltYXRlU2xpZGVyKG5ld0V2ZW50KTtcclxuICAgICAgICAgIH0gLy8gSWYgaXQncyB0aW1lIHRvIHJlbGVhc2UgdGhlIHNjcm9sbDpcclxuICAgICAgICAgIC8vICAgUmV0dXJuIG5vdyBzbyB5b3UgZG9uJ3QgaGl0IHRoZSBwcmV2ZW50RGVmYXVsdC5cclxuXHJcblxyXG4gICAgICAgICAgaWYgKHJlbGVhc2VTY3JvbGwobmV3RXZlbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBGcmVlbW9kZSBvciBzY3JvbGxDb250YWluZXI6XHJcbiAgICAgICAgICAvLyBJZiB3ZSByZWNlbnRseSBzbmFwcGVkIGFmdGVyIGEgbW9tZW50dW0gc2Nyb2xsLCB0aGVuIGlnbm9yZSB3aGVlbCBldmVudHNcclxuICAgICAgICAgIC8vIHRvIGdpdmUgdGltZSBmb3IgdGhlIGRlY2VsZXJhdGlvbiB0byBmaW5pc2guIFN0b3AgaWdub3JpbmcgYWZ0ZXIgNTAwIG1zZWNzXHJcbiAgICAgICAgICAvLyBvciBpZiBpdCdzIGEgbmV3IHNjcm9sbCAobGFyZ2VyIGRlbHRhIG9yIGludmVyc2Ugc2lnbiBhcyBsYXN0IGV2ZW50IGJlZm9yZVxyXG4gICAgICAgICAgLy8gYW4gZW5kLW9mLW1vbWVudHVtIHNuYXApLlxyXG4gICAgICAgICAgY29uc3QgbmV3RXZlbnQgPSB7XHJcbiAgICAgICAgICAgIHRpbWU6IG5vdygpLFxyXG4gICAgICAgICAgICBkZWx0YTogTWF0aC5hYnMoZGVsdGEpLFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IE1hdGguc2lnbihkZWx0YSlcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zdCBpZ25vcmVXaGVlbEV2ZW50cyA9IGxhc3RFdmVudEJlZm9yZVNuYXAgJiYgbmV3RXZlbnQudGltZSA8IGxhc3RFdmVudEJlZm9yZVNuYXAudGltZSArIDUwMCAmJiBuZXdFdmVudC5kZWx0YSA8PSBsYXN0RXZlbnRCZWZvcmVTbmFwLmRlbHRhICYmIG5ld0V2ZW50LmRpcmVjdGlvbiA9PT0gbGFzdEV2ZW50QmVmb3JlU25hcC5kaXJlY3Rpb247XHJcblxyXG4gICAgICAgICAgaWYgKCFpZ25vcmVXaGVlbEV2ZW50cykge1xyXG4gICAgICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xyXG4gICAgICAgICAgICAgIHN3aXBlci5sb29wRml4KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHN3aXBlci5nZXRUcmFuc2xhdGUoKSArIGRlbHRhICogcGFyYW1zLnNlbnNpdGl2aXR5O1xyXG4gICAgICAgICAgICBjb25zdCB3YXNCZWdpbm5pbmcgPSBzd2lwZXIuaXNCZWdpbm5pbmc7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhc0VuZCA9IHN3aXBlci5pc0VuZDtcclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID49IHN3aXBlci5taW5UcmFuc2xhdGUoKSkgcG9zaXRpb24gPSBzd2lwZXIubWluVHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA8PSBzd2lwZXIubWF4VHJhbnNsYXRlKCkpIHBvc2l0aW9uID0gc3dpcGVyLm1heFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbigwKTtcclxuICAgICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgICAgICAgICBzd2lwZXIudXBkYXRlQWN0aXZlSW5kZXgoKTtcclxuICAgICAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghd2FzQmVnaW5uaW5nICYmIHN3aXBlci5pc0JlZ2lubmluZyB8fCAhd2FzRW5kICYmIHN3aXBlci5pc0VuZCkge1xyXG4gICAgICAgICAgICAgIHN3aXBlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xyXG4gICAgICAgICAgICAgIC8vIFdoZW4gd2hlZWwgc2Nyb2xsaW5nIHN0YXJ0cyB3aXRoIHN0aWNreSAoYWthIHNuYXApIGVuYWJsZWQsIHRoZW4gZGV0ZWN0XHJcbiAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCBieSBzdG9yaW5nIHJlY2VudCAoTj0xNT8pIHdoZWVsIGV2ZW50cy5cclxuICAgICAgICAgICAgICAvLyAxLiBkbyBhbGwgTiBldmVudHMgaGF2ZSBkZWNyZWFzaW5nIG9yIHNhbWUgKGFic29sdXRlIHZhbHVlKSBkZWx0YT9cclxuICAgICAgICAgICAgICAvLyAyLiBkaWQgYWxsIE4gZXZlbnRzIGFycml2ZSBpbiB0aGUgbGFzdCBNIChNPTUwMD8pIG1zZWNzP1xyXG4gICAgICAgICAgICAgIC8vIDMuIGRvZXMgdGhlIGVhcmxpZXN0IGV2ZW50IGhhdmUgYW4gKGFic29sdXRlIHZhbHVlKSBkZWx0YSB0aGF0J3NcclxuICAgICAgICAgICAgICAvLyAgICBhdCBsZWFzdCBQIChQPTE/KSBsYXJnZXIgdGhhbiB0aGUgbW9zdCByZWNlbnQgZXZlbnQncyBkZWx0YT9cclxuICAgICAgICAgICAgICAvLyA0LiBkb2VzIHRoZSBsYXRlc3QgZXZlbnQgaGF2ZSBhIGRlbHRhIHRoYXQncyBzbWFsbGVyIHRoYW4gUSAoUT02PykgcGl4ZWxzP1xyXG4gICAgICAgICAgICAgIC8vIElmIDEtNCBhcmUgXCJ5ZXNcIiB0aGVuIHdlJ3JlIG5lYXIgdGhlIGVuZCBvZiBhIG1vbWVudHVtIHNjcm9sbCBkZWNlbGVyYXRpb24uXHJcbiAgICAgICAgICAgICAgLy8gU25hcCBpbW1lZGlhdGVseSBhbmQgaWdub3JlIHJlbWFpbmluZyB3aGVlbCBldmVudHMgaW4gdGhpcyBzY3JvbGwuXHJcbiAgICAgICAgICAgICAgLy8gU2VlIGNvbW1lbnQgYWJvdmUgZm9yIFwicmVtYWluaW5nIHdoZWVsIGV2ZW50cyBpbiB0aGlzIHNjcm9sbFwiIGRldGVybWluYXRpb24uXHJcbiAgICAgICAgICAgICAgLy8gSWYgMS00IGFyZW4ndCBzYXRpc2ZpZWQsIHRoZW4gd2FpdCB0byBzbmFwIHVudGlsIDUwMG1zIGFmdGVyIHRoZSBsYXN0IGV2ZW50LlxyXG4gICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgICAgICB0aW1lb3V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICBpZiAocmVjZW50V2hlZWxFdmVudHMubGVuZ3RoID49IDE1KSB7XHJcbiAgICAgICAgICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5zaGlmdCgpOyAvLyBvbmx5IHN0b3JlIHRoZSBsYXN0IE4gZXZlbnRzXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBwcmV2RXZlbnQgPSByZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggPyByZWNlbnRXaGVlbEV2ZW50c1tyZWNlbnRXaGVlbEV2ZW50cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICBjb25zdCBmaXJzdEV2ZW50ID0gcmVjZW50V2hlZWxFdmVudHNbMF07XHJcbiAgICAgICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMucHVzaChuZXdFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChwcmV2RXZlbnQgJiYgKG5ld0V2ZW50LmRlbHRhID4gcHJldkV2ZW50LmRlbHRhIHx8IG5ld0V2ZW50LmRpcmVjdGlvbiAhPT0gcHJldkV2ZW50LmRpcmVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIC8vIEluY3JlYXNpbmcgb3IgcmV2ZXJzZS1zaWduIGRlbHRhIG1lYW5zIHRoZSB1c2VyIHN0YXJ0ZWQgc2Nyb2xsaW5nIGFnYWluLiBDbGVhciB0aGUgd2hlZWwgZXZlbnQgbG9nLlxyXG4gICAgICAgICAgICAgICAgcmVjZW50V2hlZWxFdmVudHMuc3BsaWNlKDApO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjZW50V2hlZWxFdmVudHMubGVuZ3RoID49IDE1ICYmIG5ld0V2ZW50LnRpbWUgLSBmaXJzdEV2ZW50LnRpbWUgPCA1MDAgJiYgZmlyc3RFdmVudC5kZWx0YSAtIG5ld0V2ZW50LmRlbHRhID49IDEgJiYgbmV3RXZlbnQuZGVsdGEgPD0gNikge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UncmUgYXQgdGhlIGVuZCBvZiB0aGUgZGVjZWxlcmF0aW9uIG9mIGEgbW9tZW50dW0gc2Nyb2xsLCBzbyB0aGVyZSdzIG5vIG5lZWRcclxuICAgICAgICAgICAgICAgIC8vIHRvIHdhaXQgZm9yIG1vcmUgZXZlbnRzLiBTbmFwIEFTQVAgb24gdGhlIG5leHQgdGljay5cclxuICAgICAgICAgICAgICAgIC8vIEFsc28sIGJlY2F1c2UgdGhlcmUncyBzb21lIHJlbWFpbmluZyBtb21lbnR1bSB3ZSdsbCBiaWFzIHRoZSBzbmFwIGluIHRoZVxyXG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0aW9uIG9mIHRoZSBvbmdvaW5nIHNjcm9sbCBiZWNhdXNlIGl0J3MgYmV0dGVyIFVYIGZvciB0aGUgc2Nyb2xsIHRvIHNuYXBcclxuICAgICAgICAgICAgICAgIC8vIGluIHRoZSBzYW1lIGRpcmVjdGlvbiBhcyB0aGUgc2Nyb2xsIGluc3RlYWQgb2YgcmV2ZXJzaW5nIHRvIHNuYXAuICBUaGVyZWZvcmUsXHJcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIGFscmVhZHkgc2Nyb2xsZWQgbW9yZSB0aGFuIDIwJSBpbiB0aGUgY3VycmVudCBkaXJlY3Rpb24sIGtlZXAgZ29pbmcuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwVG9UaHJlc2hvbGQgPSBkZWx0YSA+IDAgPyAwLjggOiAwLjI7XHJcbiAgICAgICAgICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gbmV3RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICByZWNlbnRXaGVlbEV2ZW50cy5zcGxpY2UoMCk7XHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzd2lwZXIuc2xpZGVUb0Nsb3Nlc3Qoc3dpcGVyLnBhcmFtcy5zcGVlZCwgdHJ1ZSwgdW5kZWZpbmVkLCBzbmFwVG9UaHJlc2hvbGQpO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7IC8vIG5vIGRlbGF5OyBtb3ZlIG9uIG5leHQgdGlja1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBnZXQgaGVyZSwgdGhlbiB3ZSBoYXZlbid0IGRldGVjdGVkIHRoZSBlbmQgb2YgYSBtb21lbnR1bSBzY3JvbGwsIHNvXHJcbiAgICAgICAgICAgICAgICAvLyB3ZSdsbCBjb25zaWRlciBhIHNjcm9sbCBcImNvbXBsZXRlXCIgd2hlbiB0aGVyZSBoYXZlbid0IGJlZW4gYW55IHdoZWVsIGV2ZW50c1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yIDUwMG1zLlxyXG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc25hcFRvVGhyZXNob2xkID0gMC41O1xyXG4gICAgICAgICAgICAgICAgICBsYXN0RXZlbnRCZWZvcmVTbmFwID0gbmV3RXZlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIHJlY2VudFdoZWVsRXZlbnRzLnNwbGljZSgwKTtcclxuICAgICAgICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KHN3aXBlci5wYXJhbXMuc3BlZWQsIHRydWUsIHVuZGVmaW5lZCwgc25hcFRvVGhyZXNob2xkKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IC8vIEVtaXQgZXZlbnRcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoIWlnbm9yZVdoZWVsRXZlbnRzKSBlbWl0KCdzY3JvbGwnLCBlKTsgLy8gU3RvcCBhdXRvcGxheVxyXG5cclxuICAgICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkgJiYgc3dpcGVyLnBhcmFtcy5hdXRvcGxheURpc2FibGVPbkludGVyYWN0aW9uKSBzd2lwZXIuYXV0b3BsYXkuc3RvcCgpOyAvLyBSZXR1cm4gcGFnZSBzY3JvbGwgb24gZWRnZSBwb3NpdGlvbnNcclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpIHx8IHBvc2l0aW9uID09PSBzd2lwZXIubWF4VHJhbnNsYXRlKCkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGV2ZW50cyhtZXRob2QpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gc3dpcGVyLiRlbDtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ldmVudHNUYXJnZXQgIT09ICdjb250YWluZXInKSB7XHJcbiAgICAgICAgICB0YXJnZXQgPSAkKHN3aXBlci5wYXJhbXMubW91c2V3aGVlbC5ldmVudHNUYXJnZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFyZ2V0W21ldGhvZF0oJ21vdXNlZW50ZXInLCBoYW5kbGVNb3VzZUVudGVyKTtcclxuICAgICAgICB0YXJnZXRbbWV0aG9kXSgnbW91c2VsZWF2ZScsIGhhbmRsZU1vdXNlTGVhdmUpO1xyXG4gICAgICAgIHRhcmdldFttZXRob2RdKCd3aGVlbCcsIGhhbmRsZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgICBzd2lwZXIud3JhcHBlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgaGFuZGxlKTtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBldmVudHMoJ29uJyk7XHJcbiAgICAgICAgc3dpcGVyLm1vdXNld2hlZWwuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgICAgc3dpcGVyLndyYXBwZXJFbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGUpO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBldmVudHMoJ29mZicpO1xyXG4gICAgICAgIHN3aXBlci5tb3VzZXdoZWVsLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgb24oJ2luaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIGRpc2FibGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLm1vdXNld2hlZWwuZW5hYmxlZCkgZW5hYmxlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgICBlbmFibGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIubW91c2V3aGVlbC5lbmFibGVkKSBkaXNhYmxlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5tb3VzZXdoZWVsLCB7XHJcbiAgICAgICAgZW5hYmxlLFxyXG4gICAgICAgIGRpc2FibGVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZChzd2lwZXIsIG9yaWdpbmFsUGFyYW1zLCBwYXJhbXMsIGNoZWNrUHJvcHMpIHtcclxuICAgICAgY29uc3QgZG9jdW1lbnQgPSBnZXREb2N1bWVudCgpO1xyXG5cclxuICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY3JlYXRlRWxlbWVudHMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhjaGVja1Byb3BzKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXBhcmFtc1trZXldICYmIHBhcmFtcy5hdXRvID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gc3dpcGVyLiRlbC5jaGlsZHJlbihgLiR7Y2hlY2tQcm9wc1trZXldfWApWzBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2hlY2tQcm9wc1trZXldO1xyXG4gICAgICAgICAgICAgIHN3aXBlci4kZWwuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwYXJhbXNba2V5XSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsUGFyYW1zW2tleV0gPSBlbGVtZW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIE5hdmlnYXRpb24oX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb24sXHJcbiAgICAgICAgZW1pdFxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICBuZXh0RWw6IG51bGwsXHJcbiAgICAgICAgICBwcmV2RWw6IG51bGwsXHJcbiAgICAgICAgICBoaWRlT25DbGljazogZmFsc2UsXHJcbiAgICAgICAgICBkaXNhYmxlZENsYXNzOiAnc3dpcGVyLWJ1dHRvbi1kaXNhYmxlZCcsXHJcbiAgICAgICAgICBoaWRkZW5DbGFzczogJ3N3aXBlci1idXR0b24taGlkZGVuJyxcclxuICAgICAgICAgIGxvY2tDbGFzczogJ3N3aXBlci1idXR0b24tbG9jaydcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBzd2lwZXIubmF2aWdhdGlvbiA9IHtcclxuICAgICAgICBuZXh0RWw6IG51bGwsXHJcbiAgICAgICAgJG5leHRFbDogbnVsbCxcclxuICAgICAgICBwcmV2RWw6IG51bGwsXHJcbiAgICAgICAgJHByZXZFbDogbnVsbFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0RWwoZWwpIHtcclxuICAgICAgICBsZXQgJGVsO1xyXG5cclxuICAgICAgICBpZiAoZWwpIHtcclxuICAgICAgICAgICRlbCA9ICQoZWwpO1xyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnVuaXF1ZU5hdkVsZW1lbnRzICYmIHR5cGVvZiBlbCA9PT0gJ3N0cmluZycgJiYgJGVsLmxlbmd0aCA+IDEgJiYgc3dpcGVyLiRlbC5maW5kKGVsKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgJGVsID0gc3dpcGVyLiRlbC5maW5kKGVsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHRvZ2dsZUVsKCRlbCwgZGlzYWJsZWQpIHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLm5hdmlnYXRpb247XHJcblxyXG4gICAgICAgIGlmICgkZWwgJiYgJGVsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICRlbFtkaXNhYmxlZCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShwYXJhbXMuZGlzYWJsZWRDbGFzcyk7XHJcbiAgICAgICAgICBpZiAoJGVsWzBdICYmICRlbFswXS50YWdOYW1lID09PSAnQlVUVE9OJykgJGVsWzBdLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMud2F0Y2hPdmVyZmxvdyAmJiBzd2lwZXIuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAkZWxbc3dpcGVyLmlzTG9ja2VkID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKHBhcmFtcy5sb2NrQ2xhc3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSBOYXZpZ2F0aW9uIEJ1dHRvbnNcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJG5leHRFbCxcclxuICAgICAgICAgICRwcmV2RWxcclxuICAgICAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XHJcbiAgICAgICAgdG9nZ2xlRWwoJHByZXZFbCwgc3dpcGVyLmlzQmVnaW5uaW5nICYmICFzd2lwZXIucGFyYW1zLnJld2luZCk7XHJcbiAgICAgICAgdG9nZ2xlRWwoJG5leHRFbCwgc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLnJld2luZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uUHJldkNsaWNrKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5sb29wICYmICFzd2lwZXIucGFyYW1zLnJld2luZCkgcmV0dXJuO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZVByZXYoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25OZXh0Q2xpY2soZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAoc3dpcGVyLmlzRW5kICYmICFzd2lwZXIucGFyYW1zLmxvb3AgJiYgIXN3aXBlci5wYXJhbXMucmV3aW5kKSByZXR1cm47XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlTmV4dCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbjtcclxuICAgICAgICBzd2lwZXIucGFyYW1zLm5hdmlnYXRpb24gPSBjcmVhdGVFbGVtZW50SWZOb3REZWZpbmVkKHN3aXBlciwgc3dpcGVyLm9yaWdpbmFsUGFyYW1zLm5hdmlnYXRpb24sIHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbiwge1xyXG4gICAgICAgICAgbmV4dEVsOiAnc3dpcGVyLWJ1dHRvbi1uZXh0JyxcclxuICAgICAgICAgIHByZXZFbDogJ3N3aXBlci1idXR0b24tcHJldidcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoIShwYXJhbXMubmV4dEVsIHx8IHBhcmFtcy5wcmV2RWwpKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgJG5leHRFbCA9IGdldEVsKHBhcmFtcy5uZXh0RWwpO1xyXG4gICAgICAgIGNvbnN0ICRwcmV2RWwgPSBnZXRFbChwYXJhbXMucHJldkVsKTtcclxuXHJcbiAgICAgICAgaWYgKCRuZXh0RWwgJiYgJG5leHRFbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAkbmV4dEVsLm9uKCdjbGljaycsIG9uTmV4dENsaWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkcHJldkVsICYmICRwcmV2RWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgJHByZXZFbC5vbignY2xpY2snLCBvblByZXZDbGljayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5uYXZpZ2F0aW9uLCB7XHJcbiAgICAgICAgICAkbmV4dEVsLFxyXG4gICAgICAgICAgbmV4dEVsOiAkbmV4dEVsICYmICRuZXh0RWxbMF0sXHJcbiAgICAgICAgICAkcHJldkVsLFxyXG4gICAgICAgICAgcHJldkVsOiAkcHJldkVsICYmICRwcmV2RWxbMF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFzd2lwZXIuZW5hYmxlZCkge1xyXG4gICAgICAgICAgaWYgKCRuZXh0RWwpICRuZXh0RWwuYWRkQ2xhc3MocGFyYW1zLmxvY2tDbGFzcyk7XHJcbiAgICAgICAgICBpZiAoJHByZXZFbCkgJHByZXZFbC5hZGRDbGFzcyhwYXJhbXMubG9ja0NsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJG5leHRFbCxcclxuICAgICAgICAgICRwcmV2RWxcclxuICAgICAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XHJcblxyXG4gICAgICAgIGlmICgkbmV4dEVsICYmICRuZXh0RWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkbmV4dEVsLm9mZignY2xpY2snLCBvbk5leHRDbGljayk7XHJcbiAgICAgICAgICAkbmV4dEVsLnJlbW92ZUNsYXNzKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5kaXNhYmxlZENsYXNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkcHJldkVsICYmICRwcmV2RWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkcHJldkVsLm9mZignY2xpY2snLCBvblByZXZDbGljayk7XHJcbiAgICAgICAgICAkcHJldkVsLnJlbW92ZUNsYXNzKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5kaXNhYmxlZENsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9uKCdpbml0JywgKCkgPT4ge1xyXG4gICAgICAgIGluaXQoKTtcclxuICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCd0b0VkZ2UgZnJvbUVkZ2UgbG9jayB1bmxvY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZW5hYmxlIGRpc2FibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJG5leHRFbCxcclxuICAgICAgICAgICRwcmV2RWxcclxuICAgICAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XHJcblxyXG4gICAgICAgIGlmICgkbmV4dEVsKSB7XHJcbiAgICAgICAgICAkbmV4dEVsW3N3aXBlci5lbmFibGVkID8gJ3JlbW92ZUNsYXNzJyA6ICdhZGRDbGFzcyddKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5sb2NrQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRwcmV2RWwpIHtcclxuICAgICAgICAgICRwcmV2RWxbc3dpcGVyLmVuYWJsZWQgPyAncmVtb3ZlQ2xhc3MnIDogJ2FkZENsYXNzJ10oc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmxvY2tDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2NsaWNrJywgKF9zLCBlKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJG5leHRFbCxcclxuICAgICAgICAgICRwcmV2RWxcclxuICAgICAgICB9ID0gc3dpcGVyLm5hdmlnYXRpb247XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0RWwgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRlT25DbGljayAmJiAhJCh0YXJnZXRFbCkuaXMoJHByZXZFbCkgJiYgISQodGFyZ2V0RWwpLmlzKCRuZXh0RWwpKSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhZ2luYXRpb24gJiYgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uICYmIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5jbGlja2FibGUgJiYgKHN3aXBlci5wYWdpbmF0aW9uLmVsID09PSB0YXJnZXRFbCB8fCBzd2lwZXIucGFnaW5hdGlvbi5lbC5jb250YWlucyh0YXJnZXRFbCkpKSByZXR1cm47XHJcbiAgICAgICAgICBsZXQgaXNIaWRkZW47XHJcblxyXG4gICAgICAgICAgaWYgKCRuZXh0RWwpIHtcclxuICAgICAgICAgICAgaXNIaWRkZW4gPSAkbmV4dEVsLmhhc0NsYXNzKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCRwcmV2RWwpIHtcclxuICAgICAgICAgICAgaXNIaWRkZW4gPSAkcHJldkVsLmhhc0NsYXNzKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlzSGlkZGVuID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGVtaXQoJ25hdmlnYXRpb25TaG93Jyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbWl0KCduYXZpZ2F0aW9uSGlkZScpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgkbmV4dEVsKSB7XHJcbiAgICAgICAgICAgICRuZXh0RWwudG9nZ2xlQ2xhc3Moc3dpcGVyLnBhcmFtcy5uYXZpZ2F0aW9uLmhpZGRlbkNsYXNzKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoJHByZXZFbCkge1xyXG4gICAgICAgICAgICAkcHJldkVsLnRvZ2dsZUNsYXNzKHN3aXBlci5wYXJhbXMubmF2aWdhdGlvbi5oaWRkZW5DbGFzcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIubmF2aWdhdGlvbiwge1xyXG4gICAgICAgIHVwZGF0ZSxcclxuICAgICAgICBpbml0LFxyXG4gICAgICAgIGRlc3Ryb3lcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xhc3Nlc1RvU2VsZWN0b3IoY2xhc3Nlcykge1xyXG4gICAgICBpZiAoY2xhc3NlcyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgY2xhc3NlcyA9ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYC4ke2NsYXNzZXMudHJpbSgpLnJlcGxhY2UoLyhbXFwuOiFcXC9dKS9nLCAnXFxcXCQxJykgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIC5yZXBsYWNlKC8gL2csICcuJyl9YDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBQYWdpbmF0aW9uKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGNvbnN0IHBmeCA9ICdzd2lwZXItcGFnaW5hdGlvbic7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgZWw6IG51bGwsXHJcbiAgICAgICAgICBidWxsZXRFbGVtZW50OiAnc3BhbicsXHJcbiAgICAgICAgICBjbGlja2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgaGlkZU9uQ2xpY2s6IGZhbHNlLFxyXG4gICAgICAgICAgcmVuZGVyQnVsbGV0OiBudWxsLFxyXG4gICAgICAgICAgcmVuZGVyUHJvZ3Jlc3NiYXI6IG51bGwsXHJcbiAgICAgICAgICByZW5kZXJGcmFjdGlvbjogbnVsbCxcclxuICAgICAgICAgIHJlbmRlckN1c3RvbTogbnVsbCxcclxuICAgICAgICAgIHByb2dyZXNzYmFyT3Bwb3NpdGU6IGZhbHNlLFxyXG4gICAgICAgICAgdHlwZTogJ2J1bGxldHMnLFxyXG4gICAgICAgICAgLy8gJ2J1bGxldHMnIG9yICdwcm9ncmVzc2Jhcicgb3IgJ2ZyYWN0aW9uJyBvciAnY3VzdG9tJ1xyXG4gICAgICAgICAgZHluYW1pY0J1bGxldHM6IGZhbHNlLFxyXG4gICAgICAgICAgZHluYW1pY01haW5CdWxsZXRzOiAxLFxyXG4gICAgICAgICAgZm9ybWF0RnJhY3Rpb25DdXJyZW50OiBudW1iZXIgPT4gbnVtYmVyLFxyXG4gICAgICAgICAgZm9ybWF0RnJhY3Rpb25Ub3RhbDogbnVtYmVyID0+IG51bWJlcixcclxuICAgICAgICAgIGJ1bGxldENsYXNzOiBgJHtwZnh9LWJ1bGxldGAsXHJcbiAgICAgICAgICBidWxsZXRBY3RpdmVDbGFzczogYCR7cGZ4fS1idWxsZXQtYWN0aXZlYCxcclxuICAgICAgICAgIG1vZGlmaWVyQ2xhc3M6IGAke3BmeH0tYCxcclxuICAgICAgICAgIGN1cnJlbnRDbGFzczogYCR7cGZ4fS1jdXJyZW50YCxcclxuICAgICAgICAgIHRvdGFsQ2xhc3M6IGAke3BmeH0tdG90YWxgLFxyXG4gICAgICAgICAgaGlkZGVuQ2xhc3M6IGAke3BmeH0taGlkZGVuYCxcclxuICAgICAgICAgIHByb2dyZXNzYmFyRmlsbENsYXNzOiBgJHtwZnh9LXByb2dyZXNzYmFyLWZpbGxgLFxyXG4gICAgICAgICAgcHJvZ3Jlc3NiYXJPcHBvc2l0ZUNsYXNzOiBgJHtwZnh9LXByb2dyZXNzYmFyLW9wcG9zaXRlYCxcclxuICAgICAgICAgIGNsaWNrYWJsZUNsYXNzOiBgJHtwZnh9LWNsaWNrYWJsZWAsXHJcbiAgICAgICAgICBsb2NrQ2xhc3M6IGAke3BmeH0tbG9ja2AsXHJcbiAgICAgICAgICBob3Jpem9udGFsQ2xhc3M6IGAke3BmeH0taG9yaXpvbnRhbGAsXHJcbiAgICAgICAgICB2ZXJ0aWNhbENsYXNzOiBgJHtwZnh9LXZlcnRpY2FsYFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHN3aXBlci5wYWdpbmF0aW9uID0ge1xyXG4gICAgICAgIGVsOiBudWxsLFxyXG4gICAgICAgICRlbDogbnVsbCxcclxuICAgICAgICBidWxsZXRzOiBbXVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgYnVsbGV0U2l6ZTtcclxuICAgICAgbGV0IGR5bmFtaWNCdWxsZXRJbmRleCA9IDA7XHJcblxyXG4gICAgICBmdW5jdGlvbiBpc1BhZ2luYXRpb25EaXNhYmxlZCgpIHtcclxuICAgICAgICByZXR1cm4gIXN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5lbCB8fCAhc3dpcGVyLnBhZ2luYXRpb24uZWwgfHwgIXN3aXBlci5wYWdpbmF0aW9uLiRlbCB8fCBzd2lwZXIucGFnaW5hdGlvbi4kZWwubGVuZ3RoID09PSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZXRTaWRlQnVsbGV0cygkYnVsbGV0RWwsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgYnVsbGV0QWN0aXZlQ2xhc3NcclxuICAgICAgICB9ID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xyXG4gICAgICAgICRidWxsZXRFbFtwb3NpdGlvbl0oKS5hZGRDbGFzcyhgJHtidWxsZXRBY3RpdmVDbGFzc30tJHtwb3NpdGlvbn1gKVtwb3NpdGlvbl0oKS5hZGRDbGFzcyhgJHtidWxsZXRBY3RpdmVDbGFzc30tJHtwb3NpdGlvbn0tJHtwb3NpdGlvbn1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgIC8vIFJlbmRlciB8fCBVcGRhdGUgUGFnaW5hdGlvbiBidWxsZXRzL2l0ZW1zXHJcbiAgICAgICAgY29uc3QgcnRsID0gc3dpcGVyLnJ0bDtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb247XHJcbiAgICAgICAgaWYgKGlzUGFnaW5hdGlvbkRpc2FibGVkKCkpIHJldHVybjtcclxuICAgICAgICBjb25zdCBzbGlkZXNMZW5ndGggPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCA/IHN3aXBlci52aXJ0dWFsLnNsaWRlcy5sZW5ndGggOiBzd2lwZXIuc2xpZGVzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCAkZWwgPSBzd2lwZXIucGFnaW5hdGlvbi4kZWw7IC8vIEN1cnJlbnQvVG90YWxcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnQ7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBNYXRoLmNlaWwoKHNsaWRlc0xlbmd0aCAtIHN3aXBlci5sb29wZWRTbGlkZXMgKiAyKSAvIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXApIDogc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xyXG4gICAgICAgICAgY3VycmVudCA9IE1hdGguY2VpbCgoc3dpcGVyLmFjdGl2ZUluZGV4IC0gc3dpcGVyLmxvb3BlZFNsaWRlcykgLyBzd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcclxuXHJcbiAgICAgICAgICBpZiAoY3VycmVudCA+IHNsaWRlc0xlbmd0aCAtIDEgLSBzd2lwZXIubG9vcGVkU2xpZGVzICogMikge1xyXG4gICAgICAgICAgICBjdXJyZW50IC09IHNsaWRlc0xlbmd0aCAtIHN3aXBlci5sb29wZWRTbGlkZXMgKiAyO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChjdXJyZW50ID4gdG90YWwgLSAxKSBjdXJyZW50IC09IHRvdGFsO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnQgPCAwICYmIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvblR5cGUgIT09ICdidWxsZXRzJykgY3VycmVudCA9IHRvdGFsICsgY3VycmVudDtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzd2lwZXIuc25hcEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY3VycmVudCA9IHN3aXBlci5zbmFwSW5kZXg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGN1cnJlbnQgPSBzd2lwZXIuYWN0aXZlSW5kZXggfHwgMDtcclxuICAgICAgICB9IC8vIFR5cGVzXHJcblxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdidWxsZXRzJyAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzICYmIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3QgYnVsbGV0cyA9IHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHM7XHJcbiAgICAgICAgICBsZXQgZmlyc3RJbmRleDtcclxuICAgICAgICAgIGxldCBsYXN0SW5kZXg7XHJcbiAgICAgICAgICBsZXQgbWlkSW5kZXg7XHJcblxyXG4gICAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xyXG4gICAgICAgICAgICBidWxsZXRTaXplID0gYnVsbGV0cy5lcSgwKVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnb3V0ZXJXaWR0aCcgOiAnb3V0ZXJIZWlnaHQnXSh0cnVlKTtcclxuICAgICAgICAgICAgJGVsLmNzcyhzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnd2lkdGgnIDogJ2hlaWdodCcsIGAke2J1bGxldFNpemUgKiAocGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyArIDQpfXB4YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyA+IDEgJiYgc3dpcGVyLnByZXZpb3VzSW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGR5bmFtaWNCdWxsZXRJbmRleCArPSBjdXJyZW50IC0gKHN3aXBlci5wcmV2aW91c0luZGV4IC0gc3dpcGVyLmxvb3BlZFNsaWRlcyB8fCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGR5bmFtaWNCdWxsZXRJbmRleCA+IHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljQnVsbGV0SW5kZXggPSBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzIC0gMTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGR5bmFtaWNCdWxsZXRJbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGR5bmFtaWNCdWxsZXRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaXJzdEluZGV4ID0gTWF0aC5tYXgoY3VycmVudCAtIGR5bmFtaWNCdWxsZXRJbmRleCwgMCk7XHJcbiAgICAgICAgICAgIGxhc3RJbmRleCA9IGZpcnN0SW5kZXggKyAoTWF0aC5taW4oYnVsbGV0cy5sZW5ndGgsIHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHMpIC0gMSk7XHJcbiAgICAgICAgICAgIG1pZEluZGV4ID0gKGxhc3RJbmRleCArIGZpcnN0SW5kZXgpIC8gMjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBidWxsZXRzLnJlbW92ZUNsYXNzKFsnJywgJy1uZXh0JywgJy1uZXh0LW5leHQnLCAnLXByZXYnLCAnLXByZXYtcHJldicsICctbWFpbiddLm1hcChzdWZmaXggPT4gYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfSR7c3VmZml4fWApLmpvaW4oJyAnKSk7XHJcblxyXG4gICAgICAgICAgaWYgKCRlbC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGJ1bGxldHMuZWFjaChidWxsZXQgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0ICRidWxsZXQgPSAkKGJ1bGxldCk7XHJcbiAgICAgICAgICAgICAgY29uc3QgYnVsbGV0SW5kZXggPSAkYnVsbGV0LmluZGV4KCk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChidWxsZXRJbmRleCA9PT0gY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgJGJ1bGxldC5hZGRDbGFzcyhwYXJhbXMuYnVsbGV0QWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID49IGZpcnN0SW5kZXggJiYgYnVsbGV0SW5kZXggPD0gbGFzdEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICRidWxsZXQuYWRkQ2xhc3MoYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfS1tYWluYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID09PSBmaXJzdEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgIHNldFNpZGVCdWxsZXRzKCRidWxsZXQsICdwcmV2Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldEluZGV4ID09PSBsYXN0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgc2V0U2lkZUJ1bGxldHMoJGJ1bGxldCwgJ25leHQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgJGJ1bGxldCA9IGJ1bGxldHMuZXEoY3VycmVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1bGxldEluZGV4ID0gJGJ1bGxldC5pbmRleCgpO1xyXG4gICAgICAgICAgICAkYnVsbGV0LmFkZENsYXNzKHBhcmFtcy5idWxsZXRBY3RpdmVDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNCdWxsZXRzKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgJGZpcnN0RGlzcGxheWVkQnVsbGV0ID0gYnVsbGV0cy5lcShmaXJzdEluZGV4KTtcclxuICAgICAgICAgICAgICBjb25zdCAkbGFzdERpc3BsYXllZEJ1bGxldCA9IGJ1bGxldHMuZXEobGFzdEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGZpcnN0SW5kZXg7IGkgPD0gbGFzdEluZGV4OyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGJ1bGxldHMuZXEoaSkuYWRkQ2xhc3MoYCR7cGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzfS1tYWluYCk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0SW5kZXggPj0gYnVsbGV0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHBhcmFtcy5keW5hbWljTWFpbkJ1bGxldHM7IGkgPj0gMDsgaSAtPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0cy5lcShidWxsZXRzLmxlbmd0aCAtIGkpLmFkZENsYXNzKGAke3BhcmFtcy5idWxsZXRBY3RpdmVDbGFzc30tbWFpbmApO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBidWxsZXRzLmVxKGJ1bGxldHMubGVuZ3RoIC0gcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyAtIDEpLmFkZENsYXNzKGAke3BhcmFtcy5idWxsZXRBY3RpdmVDbGFzc30tcHJldmApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgc2V0U2lkZUJ1bGxldHMoJGZpcnN0RGlzcGxheWVkQnVsbGV0LCAncHJldicpO1xyXG4gICAgICAgICAgICAgICAgICBzZXRTaWRlQnVsbGV0cygkbGFzdERpc3BsYXllZEJ1bGxldCwgJ25leHQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0U2lkZUJ1bGxldHMoJGZpcnN0RGlzcGxheWVkQnVsbGV0LCAncHJldicpO1xyXG4gICAgICAgICAgICAgICAgc2V0U2lkZUJ1bGxldHMoJGxhc3REaXNwbGF5ZWRCdWxsZXQsICduZXh0Jyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHBhcmFtcy5keW5hbWljQnVsbGV0cykge1xyXG4gICAgICAgICAgICBjb25zdCBkeW5hbWljQnVsbGV0c0xlbmd0aCA9IE1hdGgubWluKGJ1bGxldHMubGVuZ3RoLCBwYXJhbXMuZHluYW1pY01haW5CdWxsZXRzICsgNCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1bGxldHNPZmZzZXQgPSAoYnVsbGV0U2l6ZSAqIGR5bmFtaWNCdWxsZXRzTGVuZ3RoIC0gYnVsbGV0U2l6ZSkgLyAyIC0gbWlkSW5kZXggKiBidWxsZXRTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRQcm9wID0gcnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JztcclxuICAgICAgICAgICAgYnVsbGV0cy5jc3Moc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gb2Zmc2V0UHJvcCA6ICd0b3AnLCBgJHtidWxsZXRzT2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdmcmFjdGlvbicpIHtcclxuICAgICAgICAgICRlbC5maW5kKGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy5jdXJyZW50Q2xhc3MpKS50ZXh0KHBhcmFtcy5mb3JtYXRGcmFjdGlvbkN1cnJlbnQoY3VycmVudCArIDEpKTtcclxuICAgICAgICAgICRlbC5maW5kKGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy50b3RhbENsYXNzKSkudGV4dChwYXJhbXMuZm9ybWF0RnJhY3Rpb25Ub3RhbCh0b3RhbCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAncHJvZ3Jlc3NiYXInKSB7XHJcbiAgICAgICAgICBsZXQgcHJvZ3Jlc3NiYXJEaXJlY3Rpb247XHJcblxyXG4gICAgICAgICAgaWYgKHBhcmFtcy5wcm9ncmVzc2Jhck9wcG9zaXRlKSB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzYmFyRGlyZWN0aW9uID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzYmFyRGlyZWN0aW9uID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBzY2FsZSA9IChjdXJyZW50ICsgMSkgLyB0b3RhbDtcclxuICAgICAgICAgIGxldCBzY2FsZVggPSAxO1xyXG4gICAgICAgICAgbGV0IHNjYWxlWSA9IDE7XHJcblxyXG4gICAgICAgICAgaWYgKHByb2dyZXNzYmFyRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuICAgICAgICAgICAgc2NhbGVYID0gc2NhbGU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzY2FsZVkgPSBzY2FsZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkZWwuZmluZChjbGFzc2VzVG9TZWxlY3RvcihwYXJhbXMucHJvZ3Jlc3NiYXJGaWxsQ2xhc3MpKS50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZVgoJHtzY2FsZVh9KSBzY2FsZVkoJHtzY2FsZVl9KWApLnRyYW5zaXRpb24oc3dpcGVyLnBhcmFtcy5zcGVlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdjdXN0b20nICYmIHBhcmFtcy5yZW5kZXJDdXN0b20pIHtcclxuICAgICAgICAgICRlbC5odG1sKHBhcmFtcy5yZW5kZXJDdXN0b20oc3dpcGVyLCBjdXJyZW50ICsgMSwgdG90YWwpKTtcclxuICAgICAgICAgIGVtaXQoJ3BhZ2luYXRpb25SZW5kZXInLCAkZWxbMF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlbWl0KCdwYWdpbmF0aW9uVXBkYXRlJywgJGVsWzBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLndhdGNoT3ZlcmZsb3cgJiYgc3dpcGVyLmVuYWJsZWQpIHtcclxuICAgICAgICAgICRlbFtzd2lwZXIuaXNMb2NrZWQgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10ocGFyYW1zLmxvY2tDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAgICAgLy8gUmVuZGVyIENvbnRhaW5lclxyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbjtcclxuICAgICAgICBpZiAoaXNQYWdpbmF0aW9uRGlzYWJsZWQoKSkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNsaWRlc0xlbmd0aCA9IHN3aXBlci52aXJ0dWFsICYmIHN3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkID8gc3dpcGVyLnZpcnR1YWwuc2xpZGVzLmxlbmd0aCA6IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0ICRlbCA9IHN3aXBlci5wYWdpbmF0aW9uLiRlbDtcclxuICAgICAgICBsZXQgcGFnaW5hdGlvbkhUTUwgPSAnJztcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycpIHtcclxuICAgICAgICAgIGxldCBudW1iZXJPZkJ1bGxldHMgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBNYXRoLmNlaWwoKHNsaWRlc0xlbmd0aCAtIHN3aXBlci5sb29wZWRTbGlkZXMgKiAyKSAvIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXApIDogc3dpcGVyLnNuYXBHcmlkLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5mcmVlTW9kZSAmJiBzd2lwZXIucGFyYW1zLmZyZWVNb2RlLmVuYWJsZWQgJiYgIXN3aXBlci5wYXJhbXMubG9vcCAmJiBudW1iZXJPZkJ1bGxldHMgPiBzbGlkZXNMZW5ndGgpIHtcclxuICAgICAgICAgICAgbnVtYmVyT2ZCdWxsZXRzID0gc2xpZGVzTGVuZ3RoO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZCdWxsZXRzOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5yZW5kZXJCdWxsZXQpIHtcclxuICAgICAgICAgICAgICBwYWdpbmF0aW9uSFRNTCArPSBwYXJhbXMucmVuZGVyQnVsbGV0LmNhbGwoc3dpcGVyLCBpLCBwYXJhbXMuYnVsbGV0Q2xhc3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHBhZ2luYXRpb25IVE1MICs9IGA8JHtwYXJhbXMuYnVsbGV0RWxlbWVudH0gY2xhc3M9XCIke3BhcmFtcy5idWxsZXRDbGFzc31cIj48LyR7cGFyYW1zLmJ1bGxldEVsZW1lbnR9PmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkZWwuaHRtbChwYWdpbmF0aW9uSFRNTCk7XHJcbiAgICAgICAgICBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzID0gJGVsLmZpbmQoY2xhc3Nlc1RvU2VsZWN0b3IocGFyYW1zLmJ1bGxldENsYXNzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdmcmFjdGlvbicpIHtcclxuICAgICAgICAgIGlmIChwYXJhbXMucmVuZGVyRnJhY3Rpb24pIHtcclxuICAgICAgICAgICAgcGFnaW5hdGlvbkhUTUwgPSBwYXJhbXMucmVuZGVyRnJhY3Rpb24uY2FsbChzd2lwZXIsIHBhcmFtcy5jdXJyZW50Q2xhc3MsIHBhcmFtcy50b3RhbENsYXNzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhZ2luYXRpb25IVE1MID0gYDxzcGFuIGNsYXNzPVwiJHtwYXJhbXMuY3VycmVudENsYXNzfVwiPjwvc3Bhbj5gICsgJyAvICcgKyBgPHNwYW4gY2xhc3M9XCIke3BhcmFtcy50b3RhbENsYXNzfVwiPjwvc3Bhbj5gO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICRlbC5odG1sKHBhZ2luYXRpb25IVE1MKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ3Byb2dyZXNzYmFyJykge1xyXG4gICAgICAgICAgaWYgKHBhcmFtcy5yZW5kZXJQcm9ncmVzc2Jhcikge1xyXG4gICAgICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IHBhcmFtcy5yZW5kZXJQcm9ncmVzc2Jhci5jYWxsKHN3aXBlciwgcGFyYW1zLnByb2dyZXNzYmFyRmlsbENsYXNzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhZ2luYXRpb25IVE1MID0gYDxzcGFuIGNsYXNzPVwiJHtwYXJhbXMucHJvZ3Jlc3NiYXJGaWxsQ2xhc3N9XCI+PC9zcGFuPmA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJGVsLmh0bWwocGFnaW5hdGlvbkhUTUwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlICE9PSAnY3VzdG9tJykge1xyXG4gICAgICAgICAgZW1pdCgncGFnaW5hdGlvblJlbmRlcicsIHN3aXBlci5wYWdpbmF0aW9uLiRlbFswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgIHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbiA9IGNyZWF0ZUVsZW1lbnRJZk5vdERlZmluZWQoc3dpcGVyLCBzd2lwZXIub3JpZ2luYWxQYXJhbXMucGFnaW5hdGlvbiwgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLCB7XHJcbiAgICAgICAgICBlbDogJ3N3aXBlci1wYWdpbmF0aW9uJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbjtcclxuICAgICAgICBpZiAoIXBhcmFtcy5lbCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCAkZWwgPSAkKHBhcmFtcy5lbCk7XHJcbiAgICAgICAgaWYgKCRlbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMudW5pcXVlTmF2RWxlbWVudHMgJiYgdHlwZW9mIHBhcmFtcy5lbCA9PT0gJ3N0cmluZycgJiYgJGVsLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICRlbCA9IHN3aXBlci4kZWwuZmluZChwYXJhbXMuZWwpOyAvLyBjaGVjayBpZiBpdCBiZWxvbmdzIHRvIGFub3RoZXIgbmVzdGVkIFN3aXBlclxyXG5cclxuICAgICAgICAgIGlmICgkZWwubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAkZWwgPSAkZWwuZmlsdGVyKGVsID0+IHtcclxuICAgICAgICAgICAgICBpZiAoJChlbCkucGFyZW50cygnLnN3aXBlcicpWzBdICE9PSBzd2lwZXIuZWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdidWxsZXRzJyAmJiBwYXJhbXMuY2xpY2thYmxlKSB7XHJcbiAgICAgICAgICAkZWwuYWRkQ2xhc3MocGFyYW1zLmNsaWNrYWJsZUNsYXNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRlbC5hZGRDbGFzcyhwYXJhbXMubW9kaWZpZXJDbGFzcyArIHBhcmFtcy50eXBlKTtcclxuICAgICAgICAkZWwuYWRkQ2xhc3Moc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnYnVsbGV0cycgJiYgcGFyYW1zLmR5bmFtaWNCdWxsZXRzKSB7XHJcbiAgICAgICAgICAkZWwuYWRkQ2xhc3MoYCR7cGFyYW1zLm1vZGlmaWVyQ2xhc3N9JHtwYXJhbXMudHlwZX0tZHluYW1pY2ApO1xyXG4gICAgICAgICAgZHluYW1pY0J1bGxldEluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgICBpZiAocGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyA8IDEpIHtcclxuICAgICAgICAgICAgcGFyYW1zLmR5bmFtaWNNYWluQnVsbGV0cyA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdwcm9ncmVzc2JhcicgJiYgcGFyYW1zLnByb2dyZXNzYmFyT3Bwb3NpdGUpIHtcclxuICAgICAgICAgICRlbC5hZGRDbGFzcyhwYXJhbXMucHJvZ3Jlc3NiYXJPcHBvc2l0ZUNsYXNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuY2xpY2thYmxlKSB7XHJcbiAgICAgICAgICAkZWwub24oJ2NsaWNrJywgY2xhc3Nlc1RvU2VsZWN0b3IocGFyYW1zLmJ1bGxldENsYXNzKSwgZnVuY3Rpb24gb25DbGljayhlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gJCh0aGlzKS5pbmRleCgpICogc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJHcm91cDtcclxuICAgICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkgaW5kZXggKz0gc3dpcGVyLmxvb3BlZFNsaWRlcztcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8oaW5kZXgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5wYWdpbmF0aW9uLCB7XHJcbiAgICAgICAgICAkZWwsXHJcbiAgICAgICAgICBlbDogJGVsWzBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghc3dpcGVyLmVuYWJsZWQpIHtcclxuICAgICAgICAgICRlbC5hZGRDbGFzcyhwYXJhbXMubG9ja0NsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uO1xyXG4gICAgICAgIGlmIChpc1BhZ2luYXRpb25EaXNhYmxlZCgpKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgJGVsID0gc3dpcGVyLnBhZ2luYXRpb24uJGVsO1xyXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhwYXJhbXMuaGlkZGVuQ2xhc3MpO1xyXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhwYXJhbXMubW9kaWZpZXJDbGFzcyArIHBhcmFtcy50eXBlKTtcclxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3Moc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gcGFyYW1zLmhvcml6b250YWxDbGFzcyA6IHBhcmFtcy52ZXJ0aWNhbENsYXNzKTtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhZ2luYXRpb24uYnVsbGV0cyAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLnJlbW92ZUNsYXNzKSBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLnJlbW92ZUNsYXNzKHBhcmFtcy5idWxsZXRBY3RpdmVDbGFzcyk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuY2xpY2thYmxlKSB7XHJcbiAgICAgICAgICAkZWwub2ZmKCdjbGljaycsIGNsYXNzZXNUb1NlbGVjdG9yKHBhcmFtcy5idWxsZXRDbGFzcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgb24oJ2luaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2FjdGl2ZUluZGV4Q2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcclxuICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN3aXBlci5zbmFwSW5kZXggPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc25hcEluZGV4Q2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2xpZGVzTGVuZ3RoQ2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcclxuICAgICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NuYXBHcmlkTGVuZ3RoQ2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5sb29wKSB7XHJcbiAgICAgICAgICByZW5kZXIoKTtcclxuICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdlbmFibGUgZGlzYWJsZScsICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAkZWxcclxuICAgICAgICB9ID0gc3dpcGVyLnBhZ2luYXRpb247XHJcblxyXG4gICAgICAgIGlmICgkZWwpIHtcclxuICAgICAgICAgICRlbFtzd2lwZXIuZW5hYmxlZCA/ICdyZW1vdmVDbGFzcycgOiAnYWRkQ2xhc3MnXShzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24ubG9ja0NsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignbG9jayB1bmxvY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignY2xpY2snLCAoX3MsIGUpID0+IHtcclxuICAgICAgICBjb25zdCB0YXJnZXRFbCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICRlbFxyXG4gICAgICAgIH0gPSBzd2lwZXIucGFnaW5hdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5lbCAmJiBzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uaGlkZU9uQ2xpY2sgJiYgJGVsLmxlbmd0aCA+IDAgJiYgISQodGFyZ2V0RWwpLmhhc0NsYXNzKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcykpIHtcclxuICAgICAgICAgIGlmIChzd2lwZXIubmF2aWdhdGlvbiAmJiAoc3dpcGVyLm5hdmlnYXRpb24ubmV4dEVsICYmIHRhcmdldEVsID09PSBzd2lwZXIubmF2aWdhdGlvbi5uZXh0RWwgfHwgc3dpcGVyLm5hdmlnYXRpb24ucHJldkVsICYmIHRhcmdldEVsID09PSBzd2lwZXIubmF2aWdhdGlvbi5wcmV2RWwpKSByZXR1cm47XHJcbiAgICAgICAgICBjb25zdCBpc0hpZGRlbiA9ICRlbC5oYXNDbGFzcyhzd2lwZXIucGFyYW1zLnBhZ2luYXRpb24uaGlkZGVuQ2xhc3MpO1xyXG5cclxuICAgICAgICAgIGlmIChpc0hpZGRlbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBlbWl0KCdwYWdpbmF0aW9uU2hvdycpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZW1pdCgncGFnaW5hdGlvbkhpZGUnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkZWwudG9nZ2xlQ2xhc3Moc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmhpZGRlbkNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5wYWdpbmF0aW9uLCB7XHJcbiAgICAgICAgcmVuZGVyLFxyXG4gICAgICAgIHVwZGF0ZSxcclxuICAgICAgICBpbml0LFxyXG4gICAgICAgIGRlc3Ryb3lcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gU2Nyb2xsYmFyKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgbGV0IGlzVG91Y2hlZCA9IGZhbHNlO1xyXG4gICAgICBsZXQgdGltZW91dCA9IG51bGw7XHJcbiAgICAgIGxldCBkcmFnVGltZW91dCA9IG51bGw7XHJcbiAgICAgIGxldCBkcmFnU3RhcnRQb3M7XHJcbiAgICAgIGxldCBkcmFnU2l6ZTtcclxuICAgICAgbGV0IHRyYWNrU2l6ZTtcclxuICAgICAgbGV0IGRpdmlkZXI7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICBlbDogbnVsbCxcclxuICAgICAgICAgIGRyYWdTaXplOiAnYXV0bycsXHJcbiAgICAgICAgICBoaWRlOiBmYWxzZSxcclxuICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICBzbmFwT25SZWxlYXNlOiB0cnVlLFxyXG4gICAgICAgICAgbG9ja0NsYXNzOiAnc3dpcGVyLXNjcm9sbGJhci1sb2NrJyxcclxuICAgICAgICAgIGRyYWdDbGFzczogJ3N3aXBlci1zY3JvbGxiYXItZHJhZydcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBzd2lwZXIuc2Nyb2xsYmFyID0ge1xyXG4gICAgICAgIGVsOiBudWxsLFxyXG4gICAgICAgIGRyYWdFbDogbnVsbCxcclxuICAgICAgICAkZWw6IG51bGwsXHJcbiAgICAgICAgJGRyYWdFbDogbnVsbFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKCkge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzY3JvbGxiYXIsXHJcbiAgICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bCxcclxuICAgICAgICAgIHByb2dyZXNzXHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAkZHJhZ0VsLFxyXG4gICAgICAgICAgJGVsXHJcbiAgICAgICAgfSA9IHNjcm9sbGJhcjtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnNjcm9sbGJhcjtcclxuICAgICAgICBsZXQgbmV3U2l6ZSA9IGRyYWdTaXplO1xyXG4gICAgICAgIGxldCBuZXdQb3MgPSAodHJhY2tTaXplIC0gZHJhZ1NpemUpICogcHJvZ3Jlc3M7XHJcblxyXG4gICAgICAgIGlmIChydGwpIHtcclxuICAgICAgICAgIG5ld1BvcyA9IC1uZXdQb3M7XHJcblxyXG4gICAgICAgICAgaWYgKG5ld1BvcyA+IDApIHtcclxuICAgICAgICAgICAgbmV3U2l6ZSA9IGRyYWdTaXplIC0gbmV3UG9zO1xyXG4gICAgICAgICAgICBuZXdQb3MgPSAwO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICgtbmV3UG9zICsgZHJhZ1NpemUgPiB0cmFja1NpemUpIHtcclxuICAgICAgICAgICAgbmV3U2l6ZSA9IHRyYWNrU2l6ZSArIG5ld1BvcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG5ld1BvcyA8IDApIHtcclxuICAgICAgICAgIG5ld1NpemUgPSBkcmFnU2l6ZSArIG5ld1BvcztcclxuICAgICAgICAgIG5ld1BvcyA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuZXdQb3MgKyBkcmFnU2l6ZSA+IHRyYWNrU2l6ZSkge1xyXG4gICAgICAgICAgbmV3U2l6ZSA9IHRyYWNrU2l6ZSAtIG5ld1BvcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcclxuICAgICAgICAgICRkcmFnRWwudHJhbnNmb3JtKGB0cmFuc2xhdGUzZCgke25ld1Bvc31weCwgMCwgMClgKTtcclxuICAgICAgICAgICRkcmFnRWxbMF0uc3R5bGUud2lkdGggPSBgJHtuZXdTaXplfXB4YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJGRyYWdFbC50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKDBweCwgJHtuZXdQb3N9cHgsIDApYCk7XHJcbiAgICAgICAgICAkZHJhZ0VsWzBdLnN0eWxlLmhlaWdodCA9IGAke25ld1NpemV9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5oaWRlKSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgICAkZWxbMF0uc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICRlbFswXS5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgJGVsLnRyYW5zaXRpb24oNDAwKTtcclxuICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihkdXJhdGlvbikge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwgfHwgIXN3aXBlci5zY3JvbGxiYXIuZWwpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIuc2Nyb2xsYmFyLiRkcmFnRWwudHJhbnNpdGlvbihkdXJhdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNpemUoKSB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5lbCB8fCAhc3dpcGVyLnNjcm9sbGJhci5lbCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHNjcm9sbGJhclxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJGRyYWdFbCxcclxuICAgICAgICAgICRlbFxyXG4gICAgICAgIH0gPSBzY3JvbGxiYXI7XHJcbiAgICAgICAgJGRyYWdFbFswXS5zdHlsZS53aWR0aCA9ICcnO1xyXG4gICAgICAgICRkcmFnRWxbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XHJcbiAgICAgICAgdHJhY2tTaXplID0gc3dpcGVyLmlzSG9yaXpvbnRhbCgpID8gJGVsWzBdLm9mZnNldFdpZHRoIDogJGVsWzBdLm9mZnNldEhlaWdodDtcclxuICAgICAgICBkaXZpZGVyID0gc3dpcGVyLnNpemUgLyAoc3dpcGVyLnZpcnR1YWxTaXplICsgc3dpcGVyLnBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUgLSAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyA/IHN3aXBlci5zbmFwR3JpZFswXSA6IDApKTtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmRyYWdTaXplID09PSAnYXV0bycpIHtcclxuICAgICAgICAgIGRyYWdTaXplID0gdHJhY2tTaXplICogZGl2aWRlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZHJhZ1NpemUgPSBwYXJzZUludChzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5kcmFnU2l6ZSwgMTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5pc0hvcml6b250YWwoKSkge1xyXG4gICAgICAgICAgJGRyYWdFbFswXS5zdHlsZS53aWR0aCA9IGAke2RyYWdTaXplfXB4YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJGRyYWdFbFswXS5zdHlsZS5oZWlnaHQgPSBgJHtkcmFnU2l6ZX1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGl2aWRlciA+PSAxKSB7XHJcbiAgICAgICAgICAkZWxbMF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJGVsWzBdLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5oaWRlKSB7XHJcbiAgICAgICAgICAkZWxbMF0uc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaE92ZXJmbG93ICYmIHN3aXBlci5lbmFibGVkKSB7XHJcbiAgICAgICAgICBzY3JvbGxiYXIuJGVsW3N3aXBlci5pc0xvY2tlZCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5sb2NrQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uKGUpIHtcclxuICAgICAgICBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZS50eXBlID09PSAndG91Y2hzdGFydCcgfHwgZS50eXBlID09PSAndG91Y2htb3ZlJyA/IGUudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYIDogZS5jbGllbnRYO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnIHx8IGUudHlwZSA9PT0gJ3RvdWNobW92ZScgPyBlLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSA6IGUuY2xpZW50WTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0RHJhZ1Bvc2l0aW9uKGUpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzY3JvbGxiYXIsXHJcbiAgICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bFxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJGVsXHJcbiAgICAgICAgfSA9IHNjcm9sbGJhcjtcclxuICAgICAgICBsZXQgcG9zaXRpb25SYXRpbztcclxuICAgICAgICBwb3NpdGlvblJhdGlvID0gKGdldFBvaW50ZXJQb3NpdGlvbihlKSAtICRlbC5vZmZzZXQoKVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJ10gLSAoZHJhZ1N0YXJ0UG9zICE9PSBudWxsID8gZHJhZ1N0YXJ0UG9zIDogZHJhZ1NpemUgLyAyKSkgLyAodHJhY2tTaXplIC0gZHJhZ1NpemUpO1xyXG4gICAgICAgIHBvc2l0aW9uUmF0aW8gPSBNYXRoLm1heChNYXRoLm1pbihwb3NpdGlvblJhdGlvLCAxKSwgMCk7XHJcblxyXG4gICAgICAgIGlmIChydGwpIHtcclxuICAgICAgICAgIHBvc2l0aW9uUmF0aW8gPSAxIC0gcG9zaXRpb25SYXRpbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpICsgKHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSkgKiBwb3NpdGlvblJhdGlvO1xyXG4gICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhwb3NpdGlvbik7XHJcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShwb3NpdGlvbik7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25EcmFnU3RhcnQoZSkge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHNjcm9sbGJhcixcclxuICAgICAgICAgICR3cmFwcGVyRWxcclxuICAgICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICRlbCxcclxuICAgICAgICAgICRkcmFnRWxcclxuICAgICAgICB9ID0gc2Nyb2xsYmFyO1xyXG4gICAgICAgIGlzVG91Y2hlZCA9IHRydWU7XHJcbiAgICAgICAgZHJhZ1N0YXJ0UG9zID0gZS50YXJnZXQgPT09ICRkcmFnRWxbMF0gfHwgZS50YXJnZXQgPT09ICRkcmFnRWwgPyBnZXRQb2ludGVyUG9zaXRpb24oZSkgLSBlLnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJ10gOiBudWxsO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICR3cmFwcGVyRWwudHJhbnNpdGlvbigxMDApO1xyXG4gICAgICAgICRkcmFnRWwudHJhbnNpdGlvbigxMDApO1xyXG4gICAgICAgIHNldERyYWdQb3NpdGlvbihlKTtcclxuICAgICAgICBjbGVhclRpbWVvdXQoZHJhZ1RpbWVvdXQpO1xyXG4gICAgICAgICRlbC50cmFuc2l0aW9uKDApO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmhpZGUpIHtcclxuICAgICAgICAgICRlbC5jc3MoJ29wYWNpdHknLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLmNzcygnc2Nyb2xsLXNuYXAtdHlwZScsICdub25lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbWl0KCdzY3JvbGxiYXJEcmFnU3RhcnQnLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25EcmFnTW92ZShlKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgc2Nyb2xsYmFyLFxyXG4gICAgICAgICAgJHdyYXBwZXJFbFxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJGVsLFxyXG4gICAgICAgICAgJGRyYWdFbFxyXG4gICAgICAgIH0gPSBzY3JvbGxiYXI7XHJcbiAgICAgICAgaWYgKCFpc1RvdWNoZWQpIHJldHVybjtcclxuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO2Vsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIHNldERyYWdQb3NpdGlvbihlKTtcclxuICAgICAgICAkd3JhcHBlckVsLnRyYW5zaXRpb24oMCk7XHJcbiAgICAgICAgJGVsLnRyYW5zaXRpb24oMCk7XHJcbiAgICAgICAgJGRyYWdFbC50cmFuc2l0aW9uKDApO1xyXG4gICAgICAgIGVtaXQoJ3Njcm9sbGJhckRyYWdNb3ZlJywgZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uRHJhZ0VuZChlKSB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgc2Nyb2xsYmFyLFxyXG4gICAgICAgICAgJHdyYXBwZXJFbFxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJGVsXHJcbiAgICAgICAgfSA9IHNjcm9sbGJhcjtcclxuICAgICAgICBpZiAoIWlzVG91Y2hlZCkgcmV0dXJuO1xyXG4gICAgICAgIGlzVG91Y2hlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5jc3MoJ3Njcm9sbC1zbmFwLXR5cGUnLCAnJyk7XHJcbiAgICAgICAgICAkd3JhcHBlckVsLnRyYW5zaXRpb24oJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5oaWRlKSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQoZHJhZ1RpbWVvdXQpO1xyXG4gICAgICAgICAgZHJhZ1RpbWVvdXQgPSBuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICRlbC5jc3MoJ29wYWNpdHknLCAwKTtcclxuICAgICAgICAgICAgJGVsLnRyYW5zaXRpb24oNDAwKTtcclxuICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZW1pdCgnc2Nyb2xsYmFyRHJhZ0VuZCcsIGUpO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnNuYXBPblJlbGVhc2UpIHtcclxuICAgICAgICAgIHN3aXBlci5zbGlkZVRvQ2xvc2VzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZXZlbnRzKG1ldGhvZCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHNjcm9sbGJhcixcclxuICAgICAgICAgIHRvdWNoRXZlbnRzVG91Y2gsXHJcbiAgICAgICAgICB0b3VjaEV2ZW50c0Rlc2t0b3AsXHJcbiAgICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgICBzdXBwb3J0XHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICBjb25zdCAkZWwgPSBzY3JvbGxiYXIuJGVsO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICRlbFswXTtcclxuICAgICAgICBjb25zdCBhY3RpdmVMaXN0ZW5lciA9IHN1cHBvcnQucGFzc2l2ZUxpc3RlbmVyICYmIHBhcmFtcy5wYXNzaXZlTGlzdGVuZXJzID8ge1xyXG4gICAgICAgICAgcGFzc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICBjYXB0dXJlOiBmYWxzZVxyXG4gICAgICAgIH0gOiBmYWxzZTtcclxuICAgICAgICBjb25zdCBwYXNzaXZlTGlzdGVuZXIgPSBzdXBwb3J0LnBhc3NpdmVMaXN0ZW5lciAmJiBwYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcclxuICAgICAgICAgIHBhc3NpdmU6IHRydWUsXHJcbiAgICAgICAgICBjYXB0dXJlOiBmYWxzZVxyXG4gICAgICAgIH0gOiBmYWxzZTtcclxuICAgICAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50TWV0aG9kID0gbWV0aG9kID09PSAnb24nID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1xyXG5cclxuICAgICAgICBpZiAoIXN1cHBvcnQudG91Y2gpIHtcclxuICAgICAgICAgIHRhcmdldFtldmVudE1ldGhvZF0odG91Y2hFdmVudHNEZXNrdG9wLnN0YXJ0LCBvbkRyYWdTdGFydCwgYWN0aXZlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgZG9jdW1lbnRbZXZlbnRNZXRob2RdKHRvdWNoRXZlbnRzRGVza3RvcC5tb3ZlLCBvbkRyYWdNb3ZlLCBhY3RpdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgICBkb2N1bWVudFtldmVudE1ldGhvZF0odG91Y2hFdmVudHNEZXNrdG9wLmVuZCwgb25EcmFnRW5kLCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0YXJnZXRbZXZlbnRNZXRob2RdKHRvdWNoRXZlbnRzVG91Y2guc3RhcnQsIG9uRHJhZ1N0YXJ0LCBhY3RpdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgICB0YXJnZXRbZXZlbnRNZXRob2RdKHRvdWNoRXZlbnRzVG91Y2gubW92ZSwgb25EcmFnTW92ZSwgYWN0aXZlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgdGFyZ2V0W2V2ZW50TWV0aG9kXSh0b3VjaEV2ZW50c1RvdWNoLmVuZCwgb25EcmFnRW5kLCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZW5hYmxlRHJhZ2dhYmxlKCkge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZWwpIHJldHVybjtcclxuICAgICAgICBldmVudHMoJ29uJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRpc2FibGVEcmFnZ2FibGUoKSB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLnNjcm9sbGJhci5lbCkgcmV0dXJuO1xyXG4gICAgICAgIGV2ZW50cygnb2ZmJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgc2Nyb2xsYmFyLFxyXG4gICAgICAgICAgJGVsOiAkc3dpcGVyRWxcclxuICAgICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAgIHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyID0gY3JlYXRlRWxlbWVudElmTm90RGVmaW5lZChzd2lwZXIsIHN3aXBlci5vcmlnaW5hbFBhcmFtcy5zY3JvbGxiYXIsIHN3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLCB7XHJcbiAgICAgICAgICBlbDogJ3N3aXBlci1zY3JvbGxiYXInXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXI7XHJcbiAgICAgICAgaWYgKCFwYXJhbXMuZWwpIHJldHVybjtcclxuICAgICAgICBsZXQgJGVsID0gJChwYXJhbXMuZWwpO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy51bmlxdWVOYXZFbGVtZW50cyAmJiB0eXBlb2YgcGFyYW1zLmVsID09PSAnc3RyaW5nJyAmJiAkZWwubGVuZ3RoID4gMSAmJiAkc3dpcGVyRWwuZmluZChwYXJhbXMuZWwpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgJGVsID0gJHN3aXBlckVsLmZpbmQocGFyYW1zLmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCAkZHJhZ0VsID0gJGVsLmZpbmQoYC4ke3N3aXBlci5wYXJhbXMuc2Nyb2xsYmFyLmRyYWdDbGFzc31gKTtcclxuXHJcbiAgICAgICAgaWYgKCRkcmFnRWwubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAkZHJhZ0VsID0gJChgPGRpdiBjbGFzcz1cIiR7c3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIuZHJhZ0NsYXNzfVwiPjwvZGl2PmApO1xyXG4gICAgICAgICAgJGVsLmFwcGVuZCgkZHJhZ0VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc2Nyb2xsYmFyLCB7XHJcbiAgICAgICAgICAkZWwsXHJcbiAgICAgICAgICBlbDogJGVsWzBdLFxyXG4gICAgICAgICAgJGRyYWdFbCxcclxuICAgICAgICAgIGRyYWdFbDogJGRyYWdFbFswXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgZW5hYmxlRHJhZ2dhYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGVsKSB7XHJcbiAgICAgICAgICAkZWxbc3dpcGVyLmVuYWJsZWQgPyAncmVtb3ZlQ2xhc3MnIDogJ2FkZENsYXNzJ10oc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIubG9ja0NsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgZGlzYWJsZURyYWdnYWJsZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvbignaW5pdCcsICgpID0+IHtcclxuICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgdXBkYXRlU2l6ZSgpO1xyXG4gICAgICAgIHNldFRyYW5zbGF0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3VwZGF0ZSByZXNpemUgb2JzZXJ2ZXJVcGRhdGUgbG9jayB1bmxvY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdXBkYXRlU2l6ZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcclxuICAgICAgICBzZXRUcmFuc2xhdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zLCBkdXJhdGlvbikgPT4ge1xyXG4gICAgICAgIHNldFRyYW5zaXRpb24oZHVyYXRpb24pO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2VuYWJsZSBkaXNhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICRlbFxyXG4gICAgICAgIH0gPSBzd2lwZXIuc2Nyb2xsYmFyO1xyXG5cclxuICAgICAgICBpZiAoJGVsKSB7XHJcbiAgICAgICAgICAkZWxbc3dpcGVyLmVuYWJsZWQgPyAncmVtb3ZlQ2xhc3MnIDogJ2FkZENsYXNzJ10oc3dpcGVyLnBhcmFtcy5zY3JvbGxiYXIubG9ja0NsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5zY3JvbGxiYXIsIHtcclxuICAgICAgICB1cGRhdGVTaXplLFxyXG4gICAgICAgIHNldFRyYW5zbGF0ZSxcclxuICAgICAgICBpbml0LFxyXG4gICAgICAgIGRlc3Ryb3lcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gUGFyYWxsYXgoX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgcGFyYWxsYXg6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHNldFRyYW5zZm9ybSA9IChlbCwgcHJvZ3Jlc3MpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBydGxcclxuICAgICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAgIGNvbnN0ICRlbCA9ICQoZWwpO1xyXG4gICAgICAgIGNvbnN0IHJ0bEZhY3RvciA9IHJ0bCA/IC0xIDogMTtcclxuICAgICAgICBjb25zdCBwID0gJGVsLmF0dHIoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4JykgfHwgJzAnO1xyXG4gICAgICAgIGxldCB4ID0gJGVsLmF0dHIoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LXgnKTtcclxuICAgICAgICBsZXQgeSA9ICRlbC5hdHRyKCdkYXRhLXN3aXBlci1wYXJhbGxheC15Jyk7XHJcbiAgICAgICAgY29uc3Qgc2NhbGUgPSAkZWwuYXR0cignZGF0YS1zd2lwZXItcGFyYWxsYXgtc2NhbGUnKTtcclxuICAgICAgICBjb25zdCBvcGFjaXR5ID0gJGVsLmF0dHIoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LW9wYWNpdHknKTtcclxuXHJcbiAgICAgICAgaWYgKHggfHwgeSkge1xyXG4gICAgICAgICAgeCA9IHggfHwgJzAnO1xyXG4gICAgICAgICAgeSA9IHkgfHwgJzAnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XHJcbiAgICAgICAgICB4ID0gcDtcclxuICAgICAgICAgIHkgPSAnMCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHkgPSBwO1xyXG4gICAgICAgICAgeCA9ICcwJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh4LmluZGV4T2YoJyUnKSA+PSAwKSB7XHJcbiAgICAgICAgICB4ID0gYCR7cGFyc2VJbnQoeCwgMTApICogcHJvZ3Jlc3MgKiBydGxGYWN0b3J9JWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHggPSBgJHt4ICogcHJvZ3Jlc3MgKiBydGxGYWN0b3J9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHkuaW5kZXhPZignJScpID49IDApIHtcclxuICAgICAgICAgIHkgPSBgJHtwYXJzZUludCh5LCAxMCkgKiBwcm9ncmVzc30lYDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeSA9IGAke3kgKiBwcm9ncmVzc31weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wYWNpdHkgIT09ICd1bmRlZmluZWQnICYmIG9wYWNpdHkgIT09IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRPcGFjaXR5ID0gb3BhY2l0eSAtIChvcGFjaXR5IC0gMSkgKiAoMSAtIE1hdGguYWJzKHByb2dyZXNzKSk7XHJcbiAgICAgICAgICAkZWxbMF0uc3R5bGUub3BhY2l0eSA9IGN1cnJlbnRPcGFjaXR5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzY2FsZSA9PT0gJ3VuZGVmaW5lZCcgfHwgc2NhbGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICRlbC50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKCR7eH0sICR7eX0sIDBweClgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgY3VycmVudFNjYWxlID0gc2NhbGUgLSAoc2NhbGUgLSAxKSAqICgxIC0gTWF0aC5hYnMocHJvZ3Jlc3MpKTtcclxuICAgICAgICAgICRlbC50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKCR7eH0sICR7eX0sIDBweCkgc2NhbGUoJHtjdXJyZW50U2NhbGV9KWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAkZWwsXHJcbiAgICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgICBwcm9ncmVzcyxcclxuICAgICAgICAgIHNuYXBHcmlkXHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICAkZWwuY2hpbGRyZW4oJ1tkYXRhLXN3aXBlci1wYXJhbGxheF0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC14XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXldLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgtb3BhY2l0eV0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC1zY2FsZV0nKS5lYWNoKGVsID0+IHtcclxuICAgICAgICAgIHNldFRyYW5zZm9ybShlbCwgcHJvZ3Jlc3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNsaWRlcy5lYWNoKChzbGlkZUVsLCBzbGlkZUluZGV4KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2xpZGVQcm9ncmVzcyA9IHNsaWRlRWwucHJvZ3Jlc3M7XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPiAxICYmIHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyAhPT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgICAgIHNsaWRlUHJvZ3Jlc3MgKz0gTWF0aC5jZWlsKHNsaWRlSW5kZXggLyAyKSAtIHByb2dyZXNzICogKHNuYXBHcmlkLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNsaWRlUHJvZ3Jlc3MgPSBNYXRoLm1pbihNYXRoLm1heChzbGlkZVByb2dyZXNzLCAtMSksIDEpO1xyXG4gICAgICAgICAgJChzbGlkZUVsKS5maW5kKCdbZGF0YS1zd2lwZXItcGFyYWxsYXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteF0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC15XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LW9wYWNpdHldLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgtc2NhbGVdJykuZWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgIHNldFRyYW5zZm9ybShlbCwgc2xpZGVQcm9ncmVzcyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHNldFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcclxuICAgICAgICBpZiAoZHVyYXRpb24gPT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgZHVyYXRpb24gPSBzd2lwZXIucGFyYW1zLnNwZWVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJGVsXHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICAkZWwuZmluZCgnW2RhdGEtc3dpcGVyLXBhcmFsbGF4XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteV0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC1vcGFjaXR5XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXNjYWxlXScpLmVhY2gocGFyYWxsYXhFbCA9PiB7XHJcbiAgICAgICAgICBjb25zdCAkcGFyYWxsYXhFbCA9ICQocGFyYWxsYXhFbCk7XHJcbiAgICAgICAgICBsZXQgcGFyYWxsYXhEdXJhdGlvbiA9IHBhcnNlSW50KCRwYXJhbGxheEVsLmF0dHIoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LWR1cmF0aW9uJyksIDEwKSB8fCBkdXJhdGlvbjtcclxuICAgICAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkgcGFyYWxsYXhEdXJhdGlvbiA9IDA7XHJcbiAgICAgICAgICAkcGFyYWxsYXhFbC50cmFuc2l0aW9uKHBhcmFsbGF4RHVyYXRpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLnBhcmFsbGF4LmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIucGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICAgIHN3aXBlci5vcmlnaW5hbFBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdpbml0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgc2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2V0VHJhbnNsYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgc2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2V0VHJhbnNpdGlvbicsIChfc3dpcGVyLCBkdXJhdGlvbikgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5wYXJhbGxheC5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFpvb20oX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb24sXHJcbiAgICAgICAgZW1pdFxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgem9vbToge1xyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICBtYXhSYXRpbzogMyxcclxuICAgICAgICAgIG1pblJhdGlvOiAxLFxyXG4gICAgICAgICAgdG9nZ2xlOiB0cnVlLFxyXG4gICAgICAgICAgY29udGFpbmVyQ2xhc3M6ICdzd2lwZXItem9vbS1jb250YWluZXInLFxyXG4gICAgICAgICAgem9vbWVkU2xpZGVDbGFzczogJ3N3aXBlci1zbGlkZS16b29tZWQnXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgc3dpcGVyLnpvb20gPSB7XHJcbiAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgbGV0IGN1cnJlbnRTY2FsZSA9IDE7XHJcbiAgICAgIGxldCBpc1NjYWxpbmcgPSBmYWxzZTtcclxuICAgICAgbGV0IGdlc3R1cmVzRW5hYmxlZDtcclxuICAgICAgbGV0IGZha2VHZXN0dXJlVG91Y2hlZDtcclxuICAgICAgbGV0IGZha2VHZXN0dXJlTW92ZWQ7XHJcbiAgICAgIGNvbnN0IGdlc3R1cmUgPSB7XHJcbiAgICAgICAgJHNsaWRlRWw6IHVuZGVmaW5lZCxcclxuICAgICAgICBzbGlkZVdpZHRoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2xpZGVIZWlnaHQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAkaW1hZ2VFbDogdW5kZWZpbmVkLFxyXG4gICAgICAgICRpbWFnZVdyYXBFbDogdW5kZWZpbmVkLFxyXG4gICAgICAgIG1heFJhdGlvOiAzXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IGltYWdlID0ge1xyXG4gICAgICAgIGlzVG91Y2hlZDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGlzTW92ZWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBjdXJyZW50WDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGN1cnJlbnRZOiB1bmRlZmluZWQsXHJcbiAgICAgICAgbWluWDogdW5kZWZpbmVkLFxyXG4gICAgICAgIG1pblk6IHVuZGVmaW5lZCxcclxuICAgICAgICBtYXhYOiB1bmRlZmluZWQsXHJcbiAgICAgICAgbWF4WTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgc3RhcnRYOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc3RhcnRZOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdG91Y2hlc1N0YXJ0OiB7fSxcclxuICAgICAgICB0b3VjaGVzQ3VycmVudDoge31cclxuICAgICAgfTtcclxuICAgICAgY29uc3QgdmVsb2NpdHkgPSB7XHJcbiAgICAgICAgeDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHk6IHVuZGVmaW5lZCxcclxuICAgICAgICBwcmV2UG9zaXRpb25YOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcHJldlBvc2l0aW9uWTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHByZXZUaW1lOiB1bmRlZmluZWRcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNjYWxlID0gMTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN3aXBlci56b29tLCAnc2NhbGUnLCB7XHJcbiAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgcmV0dXJuIHNjYWxlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldCh2YWx1ZSkge1xyXG4gICAgICAgICAgaWYgKHNjYWxlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBpbWFnZUVsID0gZ2VzdHVyZS4kaW1hZ2VFbCA/IGdlc3R1cmUuJGltYWdlRWxbMF0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNsaWRlRWwgPSBnZXN0dXJlLiRzbGlkZUVsID8gZ2VzdHVyZS4kc2xpZGVFbFswXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgZW1pdCgnem9vbUNoYW5nZScsIHZhbHVlLCBpbWFnZUVsLCBzbGlkZUVsKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0RGlzdGFuY2VCZXR3ZWVuVG91Y2hlcyhlKSB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0VG91Y2hlcy5sZW5ndGggPCAyKSByZXR1cm4gMTtcclxuICAgICAgICBjb25zdCB4MSA9IGUudGFyZ2V0VG91Y2hlc1swXS5wYWdlWDtcclxuICAgICAgICBjb25zdCB5MSA9IGUudGFyZ2V0VG91Y2hlc1swXS5wYWdlWTtcclxuICAgICAgICBjb25zdCB4MiA9IGUudGFyZ2V0VG91Y2hlc1sxXS5wYWdlWDtcclxuICAgICAgICBjb25zdCB5MiA9IGUudGFyZ2V0VG91Y2hlc1sxXS5wYWdlWTtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydCgoeDIgLSB4MSkgKiogMiArICh5MiAtIHkxKSAqKiAyKTtcclxuICAgICAgICByZXR1cm4gZGlzdGFuY2U7XHJcbiAgICAgIH0gLy8gRXZlbnRzXHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gb25HZXN0dXJlU3RhcnQoZSkge1xyXG4gICAgICAgIGNvbnN0IHN1cHBvcnQgPSBzd2lwZXIuc3VwcG9ydDtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XHJcbiAgICAgICAgZmFrZUdlc3R1cmVUb3VjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgZmFrZUdlc3R1cmVNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIXN1cHBvcnQuZ2VzdHVyZXMpIHtcclxuICAgICAgICAgIGlmIChlLnR5cGUgIT09ICd0b3VjaHN0YXJ0JyB8fCBlLnR5cGUgPT09ICd0b3VjaHN0YXJ0JyAmJiBlLnRhcmdldFRvdWNoZXMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZmFrZUdlc3R1cmVUb3VjaGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGdlc3R1cmUuc2NhbGVTdGFydCA9IGdldERpc3RhbmNlQmV0d2VlblRvdWNoZXMoZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWdlc3R1cmUuJHNsaWRlRWwgfHwgIWdlc3R1cmUuJHNsaWRlRWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICBnZXN0dXJlLiRzbGlkZUVsID0gJChlLnRhcmdldCkuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfWApO1xyXG4gICAgICAgICAgaWYgKGdlc3R1cmUuJHNsaWRlRWwubGVuZ3RoID09PSAwKSBnZXN0dXJlLiRzbGlkZUVsID0gc3dpcGVyLnNsaWRlcy5lcShzd2lwZXIuYWN0aXZlSW5kZXgpO1xyXG4gICAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbCA9IGdlc3R1cmUuJHNsaWRlRWwuZmluZChgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApLmVxKDApLmZpbmQoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKS5lcSgwKTtcclxuICAgICAgICAgIGdlc3R1cmUuJGltYWdlV3JhcEVsID0gZ2VzdHVyZS4kaW1hZ2VFbC5wYXJlbnQoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcclxuICAgICAgICAgIGdlc3R1cmUubWF4UmF0aW8gPSBnZXN0dXJlLiRpbWFnZVdyYXBFbC5hdHRyKCdkYXRhLXN3aXBlci16b29tJykgfHwgcGFyYW1zLm1heFJhdGlvO1xyXG5cclxuICAgICAgICAgIGlmIChnZXN0dXJlLiRpbWFnZVdyYXBFbC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGdlc3R1cmUuJGltYWdlRWwpIHtcclxuICAgICAgICAgIGdlc3R1cmUuJGltYWdlRWwudHJhbnNpdGlvbigwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlzU2NhbGluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uR2VzdHVyZUNoYW5nZShlKSB7XHJcbiAgICAgICAgY29uc3Qgc3VwcG9ydCA9IHN3aXBlci5zdXBwb3J0O1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuem9vbTtcclxuICAgICAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XHJcblxyXG4gICAgICAgIGlmICghc3VwcG9ydC5nZXN0dXJlcykge1xyXG4gICAgICAgICAgaWYgKGUudHlwZSAhPT0gJ3RvdWNobW92ZScgfHwgZS50eXBlID09PSAndG91Y2htb3ZlJyAmJiBlLnRhcmdldFRvdWNoZXMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZmFrZUdlc3R1cmVNb3ZlZCA9IHRydWU7XHJcbiAgICAgICAgICBnZXN0dXJlLnNjYWxlTW92ZSA9IGdldERpc3RhbmNlQmV0d2VlblRvdWNoZXMoZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWdlc3R1cmUuJGltYWdlRWwgfHwgZ2VzdHVyZS4kaW1hZ2VFbC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGlmIChlLnR5cGUgPT09ICdnZXN0dXJlY2hhbmdlJykgb25HZXN0dXJlU3RhcnQoZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3VwcG9ydC5nZXN0dXJlcykge1xyXG4gICAgICAgICAgem9vbS5zY2FsZSA9IGUuc2NhbGUgKiBjdXJyZW50U2NhbGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHpvb20uc2NhbGUgPSBnZXN0dXJlLnNjYWxlTW92ZSAvIGdlc3R1cmUuc2NhbGVTdGFydCAqIGN1cnJlbnRTY2FsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh6b29tLnNjYWxlID4gZ2VzdHVyZS5tYXhSYXRpbykge1xyXG4gICAgICAgICAgem9vbS5zY2FsZSA9IGdlc3R1cmUubWF4UmF0aW8gLSAxICsgKHpvb20uc2NhbGUgLSBnZXN0dXJlLm1heFJhdGlvICsgMSkgKiogMC41O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHpvb20uc2NhbGUgPCBwYXJhbXMubWluUmF0aW8pIHtcclxuICAgICAgICAgIHpvb20uc2NhbGUgPSBwYXJhbXMubWluUmF0aW8gKyAxIC0gKHBhcmFtcy5taW5SYXRpbyAtIHpvb20uc2NhbGUgKyAxKSAqKiAwLjU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXN0dXJlLiRpbWFnZUVsLnRyYW5zZm9ybShgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKCR7em9vbS5zY2FsZX0pYCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uR2VzdHVyZUVuZChlKSB7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gc3dpcGVyLmRldmljZTtcclxuICAgICAgICBjb25zdCBzdXBwb3J0ID0gc3dpcGVyLnN1cHBvcnQ7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xyXG4gICAgICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcclxuXHJcbiAgICAgICAgaWYgKCFzdXBwb3J0Lmdlc3R1cmVzKSB7XHJcbiAgICAgICAgICBpZiAoIWZha2VHZXN0dXJlVG91Y2hlZCB8fCAhZmFrZUdlc3R1cmVNb3ZlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGUudHlwZSAhPT0gJ3RvdWNoZW5kJyB8fCBlLnR5cGUgPT09ICd0b3VjaGVuZCcgJiYgZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPCAyICYmICFkZXZpY2UuYW5kcm9pZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZmFrZUdlc3R1cmVUb3VjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBmYWtlR2VzdHVyZU1vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWdlc3R1cmUuJGltYWdlRWwgfHwgZ2VzdHVyZS4kaW1hZ2VFbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICB6b29tLnNjYWxlID0gTWF0aC5tYXgoTWF0aC5taW4oem9vbS5zY2FsZSwgZ2VzdHVyZS5tYXhSYXRpbyksIHBhcmFtcy5taW5SYXRpbyk7XHJcbiAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbC50cmFuc2l0aW9uKHN3aXBlci5wYXJhbXMuc3BlZWQpLnRyYW5zZm9ybShgdHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKCR7em9vbS5zY2FsZX0pYCk7XHJcbiAgICAgICAgY3VycmVudFNjYWxlID0gem9vbS5zY2FsZTtcclxuICAgICAgICBpc1NjYWxpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAoem9vbS5zY2FsZSA9PT0gMSkgZ2VzdHVyZS4kc2xpZGVFbCA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGUpIHtcclxuICAgICAgICBjb25zdCBkZXZpY2UgPSBzd2lwZXIuZGV2aWNlO1xyXG4gICAgICAgIGlmICghZ2VzdHVyZS4kaW1hZ2VFbCB8fCBnZXN0dXJlLiRpbWFnZUVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChpbWFnZS5pc1RvdWNoZWQpIHJldHVybjtcclxuICAgICAgICBpZiAoZGV2aWNlLmFuZHJvaWQgJiYgZS5jYW5jZWxhYmxlKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaW1hZ2UuaXNUb3VjaGVkID0gdHJ1ZTtcclxuICAgICAgICBpbWFnZS50b3VjaGVzU3RhcnQueCA9IGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYIDogZS5wYWdlWDtcclxuICAgICAgICBpbWFnZS50b3VjaGVzU3RhcnQueSA9IGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZIDogZS5wYWdlWTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoZSkge1xyXG4gICAgICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcclxuICAgICAgICBpZiAoIWdlc3R1cmUuJGltYWdlRWwgfHwgZ2VzdHVyZS4kaW1hZ2VFbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICBzd2lwZXIuYWxsb3dDbGljayA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghaW1hZ2UuaXNUb3VjaGVkIHx8ICFnZXN0dXJlLiRzbGlkZUVsKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghaW1hZ2UuaXNNb3ZlZCkge1xyXG4gICAgICAgICAgaW1hZ2Uud2lkdGggPSBnZXN0dXJlLiRpbWFnZUVsWzBdLm9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgaW1hZ2UuaGVpZ2h0ID0gZ2VzdHVyZS4kaW1hZ2VFbFswXS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICBpbWFnZS5zdGFydFggPSBnZXRUcmFuc2xhdGUoZ2VzdHVyZS4kaW1hZ2VXcmFwRWxbMF0sICd4JykgfHwgMDtcclxuICAgICAgICAgIGltYWdlLnN0YXJ0WSA9IGdldFRyYW5zbGF0ZShnZXN0dXJlLiRpbWFnZVdyYXBFbFswXSwgJ3knKSB8fCAwO1xyXG4gICAgICAgICAgZ2VzdHVyZS5zbGlkZVdpZHRoID0gZ2VzdHVyZS4kc2xpZGVFbFswXS5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgIGdlc3R1cmUuc2xpZGVIZWlnaHQgPSBnZXN0dXJlLiRzbGlkZUVsWzBdLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgIGdlc3R1cmUuJGltYWdlV3JhcEVsLnRyYW5zaXRpb24oMCk7XHJcbiAgICAgICAgfSAvLyBEZWZpbmUgaWYgd2UgbmVlZCBpbWFnZSBkcmFnXHJcblxyXG5cclxuICAgICAgICBjb25zdCBzY2FsZWRXaWR0aCA9IGltYWdlLndpZHRoICogem9vbS5zY2FsZTtcclxuICAgICAgICBjb25zdCBzY2FsZWRIZWlnaHQgPSBpbWFnZS5oZWlnaHQgKiB6b29tLnNjYWxlO1xyXG4gICAgICAgIGlmIChzY2FsZWRXaWR0aCA8IGdlc3R1cmUuc2xpZGVXaWR0aCAmJiBzY2FsZWRIZWlnaHQgPCBnZXN0dXJlLnNsaWRlSGVpZ2h0KSByZXR1cm47XHJcbiAgICAgICAgaW1hZ2UubWluWCA9IE1hdGgubWluKGdlc3R1cmUuc2xpZGVXaWR0aCAvIDIgLSBzY2FsZWRXaWR0aCAvIDIsIDApO1xyXG4gICAgICAgIGltYWdlLm1heFggPSAtaW1hZ2UubWluWDtcclxuICAgICAgICBpbWFnZS5taW5ZID0gTWF0aC5taW4oZ2VzdHVyZS5zbGlkZUhlaWdodCAvIDIgLSBzY2FsZWRIZWlnaHQgLyAyLCAwKTtcclxuICAgICAgICBpbWFnZS5tYXhZID0gLWltYWdlLm1pblk7XHJcbiAgICAgICAgaW1hZ2UudG91Y2hlc0N1cnJlbnQueCA9IGUudHlwZSA9PT0gJ3RvdWNobW92ZScgPyBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVggOiBlLnBhZ2VYO1xyXG4gICAgICAgIGltYWdlLnRvdWNoZXNDdXJyZW50LnkgPSBlLnR5cGUgPT09ICd0b3VjaG1vdmUnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZIDogZS5wYWdlWTtcclxuXHJcbiAgICAgICAgaWYgKCFpbWFnZS5pc01vdmVkICYmICFpc1NjYWxpbmcpIHtcclxuICAgICAgICAgIGlmIChzd2lwZXIuaXNIb3Jpem9udGFsKCkgJiYgKE1hdGguZmxvb3IoaW1hZ2UubWluWCkgPT09IE1hdGguZmxvb3IoaW1hZ2Uuc3RhcnRYKSAmJiBpbWFnZS50b3VjaGVzQ3VycmVudC54IDwgaW1hZ2UudG91Y2hlc1N0YXJ0LnggfHwgTWF0aC5mbG9vcihpbWFnZS5tYXhYKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFgpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnggPiBpbWFnZS50b3VjaGVzU3RhcnQueCkpIHtcclxuICAgICAgICAgICAgaW1hZ2UuaXNUb3VjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSAmJiAoTWF0aC5mbG9vcihpbWFnZS5taW5ZKSA9PT0gTWF0aC5mbG9vcihpbWFnZS5zdGFydFkpICYmIGltYWdlLnRvdWNoZXNDdXJyZW50LnkgPCBpbWFnZS50b3VjaGVzU3RhcnQueSB8fCBNYXRoLmZsb29yKGltYWdlLm1heFkpID09PSBNYXRoLmZsb29yKGltYWdlLnN0YXJ0WSkgJiYgaW1hZ2UudG91Y2hlc0N1cnJlbnQueSA+IGltYWdlLnRvdWNoZXNTdGFydC55KSkge1xyXG4gICAgICAgICAgICBpbWFnZS5pc1RvdWNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUuY2FuY2VsYWJsZSkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpbWFnZS5pc01vdmVkID0gdHJ1ZTtcclxuICAgICAgICBpbWFnZS5jdXJyZW50WCA9IGltYWdlLnRvdWNoZXNDdXJyZW50LnggLSBpbWFnZS50b3VjaGVzU3RhcnQueCArIGltYWdlLnN0YXJ0WDtcclxuICAgICAgICBpbWFnZS5jdXJyZW50WSA9IGltYWdlLnRvdWNoZXNDdXJyZW50LnkgLSBpbWFnZS50b3VjaGVzU3RhcnQueSArIGltYWdlLnN0YXJ0WTtcclxuXHJcbiAgICAgICAgaWYgKGltYWdlLmN1cnJlbnRYIDwgaW1hZ2UubWluWCkge1xyXG4gICAgICAgICAgaW1hZ2UuY3VycmVudFggPSBpbWFnZS5taW5YICsgMSAtIChpbWFnZS5taW5YIC0gaW1hZ2UuY3VycmVudFggKyAxKSAqKiAwLjg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW1hZ2UuY3VycmVudFggPiBpbWFnZS5tYXhYKSB7XHJcbiAgICAgICAgICBpbWFnZS5jdXJyZW50WCA9IGltYWdlLm1heFggLSAxICsgKGltYWdlLmN1cnJlbnRYIC0gaW1hZ2UubWF4WCArIDEpICoqIDAuODtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbWFnZS5jdXJyZW50WSA8IGltYWdlLm1pblkpIHtcclxuICAgICAgICAgIGltYWdlLmN1cnJlbnRZID0gaW1hZ2UubWluWSArIDEgLSAoaW1hZ2UubWluWSAtIGltYWdlLmN1cnJlbnRZICsgMSkgKiogMC44O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGltYWdlLmN1cnJlbnRZID4gaW1hZ2UubWF4WSkge1xyXG4gICAgICAgICAgaW1hZ2UuY3VycmVudFkgPSBpbWFnZS5tYXhZIC0gMSArIChpbWFnZS5jdXJyZW50WSAtIGltYWdlLm1heFkgKyAxKSAqKiAwLjg7XHJcbiAgICAgICAgfSAvLyBWZWxvY2l0eVxyXG5cclxuXHJcbiAgICAgICAgaWYgKCF2ZWxvY2l0eS5wcmV2UG9zaXRpb25YKSB2ZWxvY2l0eS5wcmV2UG9zaXRpb25YID0gaW1hZ2UudG91Y2hlc0N1cnJlbnQueDtcclxuICAgICAgICBpZiAoIXZlbG9jaXR5LnByZXZQb3NpdGlvblkpIHZlbG9jaXR5LnByZXZQb3NpdGlvblkgPSBpbWFnZS50b3VjaGVzQ3VycmVudC55O1xyXG4gICAgICAgIGlmICghdmVsb2NpdHkucHJldlRpbWUpIHZlbG9jaXR5LnByZXZUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB2ZWxvY2l0eS54ID0gKGltYWdlLnRvdWNoZXNDdXJyZW50LnggLSB2ZWxvY2l0eS5wcmV2UG9zaXRpb25YKSAvIChEYXRlLm5vdygpIC0gdmVsb2NpdHkucHJldlRpbWUpIC8gMjtcclxuICAgICAgICB2ZWxvY2l0eS55ID0gKGltYWdlLnRvdWNoZXNDdXJyZW50LnkgLSB2ZWxvY2l0eS5wcmV2UG9zaXRpb25ZKSAvIChEYXRlLm5vdygpIC0gdmVsb2NpdHkucHJldlRpbWUpIC8gMjtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoaW1hZ2UudG91Y2hlc0N1cnJlbnQueCAtIHZlbG9jaXR5LnByZXZQb3NpdGlvblgpIDwgMikgdmVsb2NpdHkueCA9IDA7XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGltYWdlLnRvdWNoZXNDdXJyZW50LnkgLSB2ZWxvY2l0eS5wcmV2UG9zaXRpb25ZKSA8IDIpIHZlbG9jaXR5LnkgPSAwO1xyXG4gICAgICAgIHZlbG9jaXR5LnByZXZQb3NpdGlvblggPSBpbWFnZS50b3VjaGVzQ3VycmVudC54O1xyXG4gICAgICAgIHZlbG9jaXR5LnByZXZQb3NpdGlvblkgPSBpbWFnZS50b3VjaGVzQ3VycmVudC55O1xyXG4gICAgICAgIHZlbG9jaXR5LnByZXZUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBnZXN0dXJlLiRpbWFnZVdyYXBFbC50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKCR7aW1hZ2UuY3VycmVudFh9cHgsICR7aW1hZ2UuY3VycmVudFl9cHgsMClgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25Ub3VjaEVuZCgpIHtcclxuICAgICAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XHJcbiAgICAgICAgaWYgKCFnZXN0dXJlLiRpbWFnZUVsIHx8IGdlc3R1cmUuJGltYWdlRWwubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghaW1hZ2UuaXNUb3VjaGVkIHx8ICFpbWFnZS5pc01vdmVkKSB7XHJcbiAgICAgICAgICBpbWFnZS5pc1RvdWNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgIGltYWdlLmlzTW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGltYWdlLmlzVG91Y2hlZCA9IGZhbHNlO1xyXG4gICAgICAgIGltYWdlLmlzTW92ZWQgPSBmYWxzZTtcclxuICAgICAgICBsZXQgbW9tZW50dW1EdXJhdGlvblggPSAzMDA7XHJcbiAgICAgICAgbGV0IG1vbWVudHVtRHVyYXRpb25ZID0gMzAwO1xyXG4gICAgICAgIGNvbnN0IG1vbWVudHVtRGlzdGFuY2VYID0gdmVsb2NpdHkueCAqIG1vbWVudHVtRHVyYXRpb25YO1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uWCA9IGltYWdlLmN1cnJlbnRYICsgbW9tZW50dW1EaXN0YW5jZVg7XHJcbiAgICAgICAgY29uc3QgbW9tZW50dW1EaXN0YW5jZVkgPSB2ZWxvY2l0eS55ICogbW9tZW50dW1EdXJhdGlvblk7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb25ZID0gaW1hZ2UuY3VycmVudFkgKyBtb21lbnR1bURpc3RhbmNlWTsgLy8gRml4IGR1cmF0aW9uXHJcblxyXG4gICAgICAgIGlmICh2ZWxvY2l0eS54ICE9PSAwKSBtb21lbnR1bUR1cmF0aW9uWCA9IE1hdGguYWJzKChuZXdQb3NpdGlvblggLSBpbWFnZS5jdXJyZW50WCkgLyB2ZWxvY2l0eS54KTtcclxuICAgICAgICBpZiAodmVsb2NpdHkueSAhPT0gMCkgbW9tZW50dW1EdXJhdGlvblkgPSBNYXRoLmFicygobmV3UG9zaXRpb25ZIC0gaW1hZ2UuY3VycmVudFkpIC8gdmVsb2NpdHkueSk7XHJcbiAgICAgICAgY29uc3QgbW9tZW50dW1EdXJhdGlvbiA9IE1hdGgubWF4KG1vbWVudHVtRHVyYXRpb25YLCBtb21lbnR1bUR1cmF0aW9uWSk7XHJcbiAgICAgICAgaW1hZ2UuY3VycmVudFggPSBuZXdQb3NpdGlvblg7XHJcbiAgICAgICAgaW1hZ2UuY3VycmVudFkgPSBuZXdQb3NpdGlvblk7IC8vIERlZmluZSBpZiB3ZSBuZWVkIGltYWdlIGRyYWdcclxuXHJcbiAgICAgICAgY29uc3Qgc2NhbGVkV2lkdGggPSBpbWFnZS53aWR0aCAqIHpvb20uc2NhbGU7XHJcbiAgICAgICAgY29uc3Qgc2NhbGVkSGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0ICogem9vbS5zY2FsZTtcclxuICAgICAgICBpbWFnZS5taW5YID0gTWF0aC5taW4oZ2VzdHVyZS5zbGlkZVdpZHRoIC8gMiAtIHNjYWxlZFdpZHRoIC8gMiwgMCk7XHJcbiAgICAgICAgaW1hZ2UubWF4WCA9IC1pbWFnZS5taW5YO1xyXG4gICAgICAgIGltYWdlLm1pblkgPSBNYXRoLm1pbihnZXN0dXJlLnNsaWRlSGVpZ2h0IC8gMiAtIHNjYWxlZEhlaWdodCAvIDIsIDApO1xyXG4gICAgICAgIGltYWdlLm1heFkgPSAtaW1hZ2UubWluWTtcclxuICAgICAgICBpbWFnZS5jdXJyZW50WCA9IE1hdGgubWF4KE1hdGgubWluKGltYWdlLmN1cnJlbnRYLCBpbWFnZS5tYXhYKSwgaW1hZ2UubWluWCk7XHJcbiAgICAgICAgaW1hZ2UuY3VycmVudFkgPSBNYXRoLm1heChNYXRoLm1pbihpbWFnZS5jdXJyZW50WSwgaW1hZ2UubWF4WSksIGltYWdlLm1pblkpO1xyXG4gICAgICAgIGdlc3R1cmUuJGltYWdlV3JhcEVsLnRyYW5zaXRpb24obW9tZW50dW1EdXJhdGlvbikudHJhbnNmb3JtKGB0cmFuc2xhdGUzZCgke2ltYWdlLmN1cnJlbnRYfXB4LCAke2ltYWdlLmN1cnJlbnRZfXB4LDApYCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCgpIHtcclxuICAgICAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XHJcblxyXG4gICAgICAgIGlmIChnZXN0dXJlLiRzbGlkZUVsICYmIHN3aXBlci5wcmV2aW91c0luZGV4ICE9PSBzd2lwZXIuYWN0aXZlSW5kZXgpIHtcclxuICAgICAgICAgIGlmIChnZXN0dXJlLiRpbWFnZUVsKSB7XHJcbiAgICAgICAgICAgIGdlc3R1cmUuJGltYWdlRWwudHJhbnNmb3JtKCd0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSknKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZ2VzdHVyZS4kaW1hZ2VXcmFwRWwpIHtcclxuICAgICAgICAgICAgZ2VzdHVyZS4kaW1hZ2VXcmFwRWwudHJhbnNmb3JtKCd0cmFuc2xhdGUzZCgwLDAsMCknKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB6b29tLnNjYWxlID0gMTtcclxuICAgICAgICAgIGN1cnJlbnRTY2FsZSA9IDE7XHJcbiAgICAgICAgICBnZXN0dXJlLiRzbGlkZUVsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIGdlc3R1cmUuJGltYWdlV3JhcEVsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gem9vbUluKGUpIHtcclxuICAgICAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy56b29tO1xyXG5cclxuICAgICAgICBpZiAoIWdlc3R1cmUuJHNsaWRlRWwpIHtcclxuICAgICAgICAgIGlmIChlICYmIGUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGdlc3R1cmUuJHNsaWRlRWwgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9YCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCFnZXN0dXJlLiRzbGlkZUVsKSB7XHJcbiAgICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgJiYgc3dpcGVyLnZpcnR1YWwpIHtcclxuICAgICAgICAgICAgICBnZXN0dXJlLiRzbGlkZUVsID0gc3dpcGVyLiR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBnZXN0dXJlLiRzbGlkZUVsID0gc3dpcGVyLnNsaWRlcy5lcShzd2lwZXIuYWN0aXZlSW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbCA9IGdlc3R1cmUuJHNsaWRlRWwuZmluZChgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApLmVxKDApLmZpbmQoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKS5lcSgwKTtcclxuICAgICAgICAgIGdlc3R1cmUuJGltYWdlV3JhcEVsID0gZ2VzdHVyZS4kaW1hZ2VFbC5wYXJlbnQoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZ2VzdHVyZS4kaW1hZ2VFbCB8fCBnZXN0dXJlLiRpbWFnZUVsLmxlbmd0aCA9PT0gMCB8fCAhZ2VzdHVyZS4kaW1hZ2VXcmFwRWwgfHwgZ2VzdHVyZS4kaW1hZ2VXcmFwRWwubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXN0dXJlLiRzbGlkZUVsLmFkZENsYXNzKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xyXG4gICAgICAgIGxldCB0b3VjaFg7XHJcbiAgICAgICAgbGV0IHRvdWNoWTtcclxuICAgICAgICBsZXQgb2Zmc2V0WDtcclxuICAgICAgICBsZXQgb2Zmc2V0WTtcclxuICAgICAgICBsZXQgZGlmZlg7XHJcbiAgICAgICAgbGV0IGRpZmZZO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVYO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVZO1xyXG4gICAgICAgIGxldCBpbWFnZVdpZHRoO1xyXG4gICAgICAgIGxldCBpbWFnZUhlaWdodDtcclxuICAgICAgICBsZXQgc2NhbGVkV2lkdGg7XHJcbiAgICAgICAgbGV0IHNjYWxlZEhlaWdodDtcclxuICAgICAgICBsZXQgdHJhbnNsYXRlTWluWDtcclxuICAgICAgICBsZXQgdHJhbnNsYXRlTWluWTtcclxuICAgICAgICBsZXQgdHJhbnNsYXRlTWF4WDtcclxuICAgICAgICBsZXQgdHJhbnNsYXRlTWF4WTtcclxuICAgICAgICBsZXQgc2xpZGVXaWR0aDtcclxuICAgICAgICBsZXQgc2xpZGVIZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW1hZ2UudG91Y2hlc1N0YXJ0LnggPT09ICd1bmRlZmluZWQnICYmIGUpIHtcclxuICAgICAgICAgIHRvdWNoWCA9IGUudHlwZSA9PT0gJ3RvdWNoZW5kJyA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggOiBlLnBhZ2VYO1xyXG4gICAgICAgICAgdG91Y2hZID0gZS50eXBlID09PSAndG91Y2hlbmQnID8gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSA6IGUucGFnZVk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRvdWNoWCA9IGltYWdlLnRvdWNoZXNTdGFydC54O1xyXG4gICAgICAgICAgdG91Y2hZID0gaW1hZ2UudG91Y2hlc1N0YXJ0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB6b29tLnNjYWxlID0gZ2VzdHVyZS4kaW1hZ2VXcmFwRWwuYXR0cignZGF0YS1zd2lwZXItem9vbScpIHx8IHBhcmFtcy5tYXhSYXRpbztcclxuICAgICAgICBjdXJyZW50U2NhbGUgPSBnZXN0dXJlLiRpbWFnZVdyYXBFbC5hdHRyKCdkYXRhLXN3aXBlci16b29tJykgfHwgcGFyYW1zLm1heFJhdGlvO1xyXG5cclxuICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgc2xpZGVXaWR0aCA9IGdlc3R1cmUuJHNsaWRlRWxbMF0ub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICBzbGlkZUhlaWdodCA9IGdlc3R1cmUuJHNsaWRlRWxbMF0ub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgb2Zmc2V0WCA9IGdlc3R1cmUuJHNsaWRlRWwub2Zmc2V0KCkubGVmdCArIHdpbmRvdy5zY3JvbGxYO1xyXG4gICAgICAgICAgb2Zmc2V0WSA9IGdlc3R1cmUuJHNsaWRlRWwub2Zmc2V0KCkudG9wICsgd2luZG93LnNjcm9sbFk7XHJcbiAgICAgICAgICBkaWZmWCA9IG9mZnNldFggKyBzbGlkZVdpZHRoIC8gMiAtIHRvdWNoWDtcclxuICAgICAgICAgIGRpZmZZID0gb2Zmc2V0WSArIHNsaWRlSGVpZ2h0IC8gMiAtIHRvdWNoWTtcclxuICAgICAgICAgIGltYWdlV2lkdGggPSBnZXN0dXJlLiRpbWFnZUVsWzBdLm9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgaW1hZ2VIZWlnaHQgPSBnZXN0dXJlLiRpbWFnZUVsWzBdLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgIHNjYWxlZFdpZHRoID0gaW1hZ2VXaWR0aCAqIHpvb20uc2NhbGU7XHJcbiAgICAgICAgICBzY2FsZWRIZWlnaHQgPSBpbWFnZUhlaWdodCAqIHpvb20uc2NhbGU7XHJcbiAgICAgICAgICB0cmFuc2xhdGVNaW5YID0gTWF0aC5taW4oc2xpZGVXaWR0aCAvIDIgLSBzY2FsZWRXaWR0aCAvIDIsIDApO1xyXG4gICAgICAgICAgdHJhbnNsYXRlTWluWSA9IE1hdGgubWluKHNsaWRlSGVpZ2h0IC8gMiAtIHNjYWxlZEhlaWdodCAvIDIsIDApO1xyXG4gICAgICAgICAgdHJhbnNsYXRlTWF4WCA9IC10cmFuc2xhdGVNaW5YO1xyXG4gICAgICAgICAgdHJhbnNsYXRlTWF4WSA9IC10cmFuc2xhdGVNaW5ZO1xyXG4gICAgICAgICAgdHJhbnNsYXRlWCA9IGRpZmZYICogem9vbS5zY2FsZTtcclxuICAgICAgICAgIHRyYW5zbGF0ZVkgPSBkaWZmWSAqIHpvb20uc2NhbGU7XHJcblxyXG4gICAgICAgICAgaWYgKHRyYW5zbGF0ZVggPCB0cmFuc2xhdGVNaW5YKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVggPSB0cmFuc2xhdGVNaW5YO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0cmFuc2xhdGVYID4gdHJhbnNsYXRlTWF4WCkge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVYID0gdHJhbnNsYXRlTWF4WDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodHJhbnNsYXRlWSA8IHRyYW5zbGF0ZU1pblkpIHtcclxuICAgICAgICAgICAgdHJhbnNsYXRlWSA9IHRyYW5zbGF0ZU1pblk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRyYW5zbGF0ZVkgPiB0cmFuc2xhdGVNYXhZKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVkgPSB0cmFuc2xhdGVNYXhZO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0cmFuc2xhdGVYID0gMDtcclxuICAgICAgICAgIHRyYW5zbGF0ZVkgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2VzdHVyZS4kaW1hZ2VXcmFwRWwudHJhbnNpdGlvbigzMDApLnRyYW5zZm9ybShgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgsMClgKTtcclxuICAgICAgICBnZXN0dXJlLiRpbWFnZUVsLnRyYW5zaXRpb24oMzAwKS50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZSgke3pvb20uc2NhbGV9KWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiB6b29tT3V0KCkge1xyXG4gICAgICAgIGNvbnN0IHpvb20gPSBzd2lwZXIuem9vbTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLnpvb207XHJcblxyXG4gICAgICAgIGlmICghZ2VzdHVyZS4kc2xpZGVFbCkge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZCAmJiBzd2lwZXIudmlydHVhbCkge1xyXG4gICAgICAgICAgICBnZXN0dXJlLiRzbGlkZUVsID0gc3dpcGVyLiR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVBY3RpdmVDbGFzc31gKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdlc3R1cmUuJHNsaWRlRWwgPSBzd2lwZXIuc2xpZGVzLmVxKHN3aXBlci5hY3RpdmVJbmRleCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbCA9IGdlc3R1cmUuJHNsaWRlRWwuZmluZChgLiR7cGFyYW1zLmNvbnRhaW5lckNsYXNzfWApLmVxKDApLmZpbmQoJ3BpY3R1cmUsIGltZywgc3ZnLCBjYW52YXMsIC5zd2lwZXItem9vbS10YXJnZXQnKS5lcSgwKTtcclxuICAgICAgICAgIGdlc3R1cmUuJGltYWdlV3JhcEVsID0gZ2VzdHVyZS4kaW1hZ2VFbC5wYXJlbnQoYC4ke3BhcmFtcy5jb250YWluZXJDbGFzc31gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZ2VzdHVyZS4kaW1hZ2VFbCB8fCBnZXN0dXJlLiRpbWFnZUVsLmxlbmd0aCA9PT0gMCB8fCAhZ2VzdHVyZS4kaW1hZ2VXcmFwRWwgfHwgZ2VzdHVyZS4kaW1hZ2VXcmFwRWwubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuICAgICAgICAgIHN3aXBlci53cmFwcGVyRWwuc3R5bGUudG91Y2hBY3Rpb24gPSAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpvb20uc2NhbGUgPSAxO1xyXG4gICAgICAgIGN1cnJlbnRTY2FsZSA9IDE7XHJcbiAgICAgICAgZ2VzdHVyZS4kaW1hZ2VXcmFwRWwudHJhbnNpdGlvbigzMDApLnRyYW5zZm9ybSgndHJhbnNsYXRlM2QoMCwwLDApJyk7XHJcbiAgICAgICAgZ2VzdHVyZS4kaW1hZ2VFbC50cmFuc2l0aW9uKDMwMCkudHJhbnNmb3JtKCd0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSknKTtcclxuICAgICAgICBnZXN0dXJlLiRzbGlkZUVsLnJlbW92ZUNsYXNzKGAke3BhcmFtcy56b29tZWRTbGlkZUNsYXNzfWApO1xyXG4gICAgICAgIGdlc3R1cmUuJHNsaWRlRWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0gLy8gVG9nZ2xlIFpvb21cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiB6b29tVG9nZ2xlKGUpIHtcclxuICAgICAgICBjb25zdCB6b29tID0gc3dpcGVyLnpvb207XHJcblxyXG4gICAgICAgIGlmICh6b29tLnNjYWxlICYmIHpvb20uc2NhbGUgIT09IDEpIHtcclxuICAgICAgICAgIC8vIFpvb20gT3V0XHJcbiAgICAgICAgICB6b29tT3V0KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIFpvb20gSW5cclxuICAgICAgICAgIHpvb21JbihlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldExpc3RlbmVycygpIHtcclxuICAgICAgICBjb25zdCBzdXBwb3J0ID0gc3dpcGVyLnN1cHBvcnQ7XHJcbiAgICAgICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gc3dpcGVyLnRvdWNoRXZlbnRzLnN0YXJ0ID09PSAndG91Y2hzdGFydCcgJiYgc3VwcG9ydC5wYXNzaXZlTGlzdGVuZXIgJiYgc3dpcGVyLnBhcmFtcy5wYXNzaXZlTGlzdGVuZXJzID8ge1xyXG4gICAgICAgICAgcGFzc2l2ZTogdHJ1ZSxcclxuICAgICAgICAgIGNhcHR1cmU6IGZhbHNlXHJcbiAgICAgICAgfSA6IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmUgPSBzdXBwb3J0LnBhc3NpdmVMaXN0ZW5lciA/IHtcclxuICAgICAgICAgIHBhc3NpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgY2FwdHVyZTogdHJ1ZVxyXG4gICAgICAgIH0gOiB0cnVlO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBwYXNzaXZlTGlzdGVuZXIsXHJcbiAgICAgICAgICBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0U2xpZGVTZWxlY3RvcigpIHtcclxuICAgICAgICByZXR1cm4gYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVDbGFzc31gO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiB0b2dnbGVHZXN0dXJlcyhtZXRob2QpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBwYXNzaXZlTGlzdGVuZXJcclxuICAgICAgICB9ID0gZ2V0TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVTZWxlY3RvciA9IGdldFNsaWRlU2VsZWN0b3IoKTtcclxuICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFttZXRob2RdKCdnZXN0dXJlc3RhcnQnLCBzbGlkZVNlbGVjdG9yLCBvbkdlc3R1cmVTdGFydCwgcGFzc2l2ZUxpc3RlbmVyKTtcclxuICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFttZXRob2RdKCdnZXN0dXJlY2hhbmdlJywgc2xpZGVTZWxlY3Rvciwgb25HZXN0dXJlQ2hhbmdlLCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgIHN3aXBlci4kd3JhcHBlckVsW21ldGhvZF0oJ2dlc3R1cmVlbmQnLCBzbGlkZVNlbGVjdG9yLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVuYWJsZUdlc3R1cmVzKCkge1xyXG4gICAgICAgIGlmIChnZXN0dXJlc0VuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBnZXN0dXJlc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRvZ2dsZUdlc3R1cmVzKCdvbicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBkaXNhYmxlR2VzdHVyZXMoKSB7XHJcbiAgICAgICAgaWYgKCFnZXN0dXJlc0VuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBnZXN0dXJlc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0b2dnbGVHZXN0dXJlcygnb2ZmJyk7XHJcbiAgICAgIH0gLy8gQXR0YWNoL0RldGFjaCBFdmVudHNcclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBlbmFibGUoKSB7XHJcbiAgICAgICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xyXG4gICAgICAgIGlmICh6b29tLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICB6b29tLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IHN1cHBvcnQgPSBzd2lwZXIuc3VwcG9ydDtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBwYXNzaXZlTGlzdGVuZXIsXHJcbiAgICAgICAgICBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlXHJcbiAgICAgICAgfSA9IGdldExpc3RlbmVycygpO1xyXG4gICAgICAgIGNvbnN0IHNsaWRlU2VsZWN0b3IgPSBnZXRTbGlkZVNlbGVjdG9yKCk7IC8vIFNjYWxlIGltYWdlXHJcblxyXG4gICAgICAgIGlmIChzdXBwb3J0Lmdlc3R1cmVzKSB7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5vbihzd2lwZXIudG91Y2hFdmVudHMuc3RhcnQsIGVuYWJsZUdlc3R1cmVzLCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgc3dpcGVyLiR3cmFwcGVyRWwub24oc3dpcGVyLnRvdWNoRXZlbnRzLmVuZCwgZGlzYWJsZUdlc3R1cmVzLCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLnRvdWNoRXZlbnRzLnN0YXJ0ID09PSAndG91Y2hzdGFydCcpIHtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLm9uKHN3aXBlci50b3VjaEV2ZW50cy5zdGFydCwgc2xpZGVTZWxlY3Rvciwgb25HZXN0dXJlU3RhcnQsIHBhc3NpdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5vbihzd2lwZXIudG91Y2hFdmVudHMubW92ZSwgc2xpZGVTZWxlY3Rvciwgb25HZXN0dXJlQ2hhbmdlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLm9uKHN3aXBlci50b3VjaEV2ZW50cy5lbmQsIHNsaWRlU2VsZWN0b3IsIG9uR2VzdHVyZUVuZCwgcGFzc2l2ZUxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnRvdWNoRXZlbnRzLmNhbmNlbCkge1xyXG4gICAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5vbihzd2lwZXIudG91Y2hFdmVudHMuY2FuY2VsLCBzbGlkZVNlbGVjdG9yLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBNb3ZlIGltYWdlXHJcblxyXG5cclxuICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5vbihzd2lwZXIudG91Y2hFdmVudHMubW92ZSwgYC4ke3N3aXBlci5wYXJhbXMuem9vbS5jb250YWluZXJDbGFzc31gLCBvblRvdWNoTW92ZSwgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICAgICAgY29uc3Qgem9vbSA9IHN3aXBlci56b29tO1xyXG4gICAgICAgIGlmICghem9vbS5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc3VwcG9ydCA9IHN3aXBlci5zdXBwb3J0O1xyXG4gICAgICAgIHpvb20uZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHBhc3NpdmVMaXN0ZW5lcixcclxuICAgICAgICAgIGFjdGl2ZUxpc3RlbmVyV2l0aENhcHR1cmVcclxuICAgICAgICB9ID0gZ2V0TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVTZWxlY3RvciA9IGdldFNsaWRlU2VsZWN0b3IoKTsgLy8gU2NhbGUgaW1hZ2VcclxuXHJcbiAgICAgICAgaWYgKHN1cHBvcnQuZ2VzdHVyZXMpIHtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLm9mZihzd2lwZXIudG91Y2hFdmVudHMuc3RhcnQsIGVuYWJsZUdlc3R1cmVzLCBwYXNzaXZlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgc3dpcGVyLiR3cmFwcGVyRWwub2ZmKHN3aXBlci50b3VjaEV2ZW50cy5lbmQsIGRpc2FibGVHZXN0dXJlcywgcGFzc2l2ZUxpc3RlbmVyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN3aXBlci50b3VjaEV2ZW50cy5zdGFydCA9PT0gJ3RvdWNoc3RhcnQnKSB7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbC5vZmYoc3dpcGVyLnRvdWNoRXZlbnRzLnN0YXJ0LCBzbGlkZVNlbGVjdG9yLCBvbkdlc3R1cmVTdGFydCwgcGFzc2l2ZUxpc3RlbmVyKTtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLm9mZihzd2lwZXIudG91Y2hFdmVudHMubW92ZSwgc2xpZGVTZWxlY3Rvciwgb25HZXN0dXJlQ2hhbmdlLCBhY3RpdmVMaXN0ZW5lcldpdGhDYXB0dXJlKTtcclxuICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLm9mZihzd2lwZXIudG91Y2hFdmVudHMuZW5kLCBzbGlkZVNlbGVjdG9yLCBvbkdlc3R1cmVFbmQsIHBhc3NpdmVMaXN0ZW5lcik7XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci50b3VjaEV2ZW50cy5jYW5jZWwpIHtcclxuICAgICAgICAgICAgc3dpcGVyLiR3cmFwcGVyRWwub2ZmKHN3aXBlci50b3VjaEV2ZW50cy5jYW5jZWwsIHNsaWRlU2VsZWN0b3IsIG9uR2VzdHVyZUVuZCwgcGFzc2l2ZUxpc3RlbmVyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIE1vdmUgaW1hZ2VcclxuXHJcblxyXG4gICAgICAgIHN3aXBlci4kd3JhcHBlckVsLm9mZihzd2lwZXIudG91Y2hFdmVudHMubW92ZSwgYC4ke3N3aXBlci5wYXJhbXMuem9vbS5jb250YWluZXJDbGFzc31gLCBvblRvdWNoTW92ZSwgYWN0aXZlTGlzdGVuZXJXaXRoQ2FwdHVyZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9uKCdpbml0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLnpvb20uZW5hYmxlZCkge1xyXG4gICAgICAgICAgZW5hYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgZGlzYWJsZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3RvdWNoU3RhcnQnLCAoX3MsIGUpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlci56b29tLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBvblRvdWNoU3RhcnQoZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbigndG91Y2hFbmQnLCAoX3MsIGUpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlci56b29tLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBvblRvdWNoRW5kKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZG91YmxlVGFwJywgKF9zLCBlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nICYmIHN3aXBlci5wYXJhbXMuem9vbS5lbmFibGVkICYmIHN3aXBlci56b29tLmVuYWJsZWQgJiYgc3dpcGVyLnBhcmFtcy56b29tLnRvZ2dsZSkge1xyXG4gICAgICAgICAgem9vbVRvZ2dsZShlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbigndHJhbnNpdGlvbkVuZCcsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnpvb20uZW5hYmxlZCAmJiBzd2lwZXIucGFyYW1zLnpvb20uZW5hYmxlZCkge1xyXG4gICAgICAgICAgb25UcmFuc2l0aW9uRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NsaWRlQ2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIuem9vbS5lbmFibGVkICYmIHN3aXBlci5wYXJhbXMuem9vbS5lbmFibGVkICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgICAgb25UcmFuc2l0aW9uRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIuem9vbSwge1xyXG4gICAgICAgIGVuYWJsZSxcclxuICAgICAgICBkaXNhYmxlLFxyXG4gICAgICAgIGluOiB6b29tSW4sXHJcbiAgICAgICAgb3V0OiB6b29tT3V0LFxyXG4gICAgICAgIHRvZ2dsZTogem9vbVRvZ2dsZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBMYXp5KF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIGVtaXRcclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgbGF6eToge1xyXG4gICAgICAgICAgY2hlY2tJblZpZXc6IGZhbHNlLFxyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICBsb2FkUHJldk5leHQ6IGZhbHNlLFxyXG4gICAgICAgICAgbG9hZFByZXZOZXh0QW1vdW50OiAxLFxyXG4gICAgICAgICAgbG9hZE9uVHJhbnNpdGlvblN0YXJ0OiBmYWxzZSxcclxuICAgICAgICAgIHNjcm9sbGluZ0VsZW1lbnQ6ICcnLFxyXG4gICAgICAgICAgZWxlbWVudENsYXNzOiAnc3dpcGVyLWxhenknLFxyXG4gICAgICAgICAgbG9hZGluZ0NsYXNzOiAnc3dpcGVyLWxhenktbG9hZGluZycsXHJcbiAgICAgICAgICBsb2FkZWRDbGFzczogJ3N3aXBlci1sYXp5LWxvYWRlZCcsXHJcbiAgICAgICAgICBwcmVsb2FkZXJDbGFzczogJ3N3aXBlci1sYXp5LXByZWxvYWRlcidcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBzd2lwZXIubGF6eSA9IHt9O1xyXG4gICAgICBsZXQgc2Nyb2xsSGFuZGxlckF0dGFjaGVkID0gZmFsc2U7XHJcbiAgICAgIGxldCBpbml0aWFsSW1hZ2VMb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvYWRJblNsaWRlKGluZGV4LCBsb2FkSW5EdXBsaWNhdGUpIHtcclxuICAgICAgICBpZiAobG9hZEluRHVwbGljYXRlID09PSB2b2lkIDApIHtcclxuICAgICAgICAgIGxvYWRJbkR1cGxpY2F0ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmxhenk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuICAgICAgICBpZiAoc3dpcGVyLnNsaWRlcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcclxuICAgICAgICBjb25zdCAkc2xpZGVFbCA9IGlzVmlydHVhbCA/IHN3aXBlci4kd3JhcHBlckVsLmNoaWxkcmVuKGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9W2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtpbmRleH1cIl1gKSA6IHN3aXBlci5zbGlkZXMuZXEoaW5kZXgpO1xyXG4gICAgICAgIGNvbnN0ICRpbWFnZXMgPSAkc2xpZGVFbC5maW5kKGAuJHtwYXJhbXMuZWxlbWVudENsYXNzfTpub3QoLiR7cGFyYW1zLmxvYWRlZENsYXNzfSk6bm90KC4ke3BhcmFtcy5sb2FkaW5nQ2xhc3N9KWApO1xyXG5cclxuICAgICAgICBpZiAoJHNsaWRlRWwuaGFzQ2xhc3MocGFyYW1zLmVsZW1lbnRDbGFzcykgJiYgISRzbGlkZUVsLmhhc0NsYXNzKHBhcmFtcy5sb2FkZWRDbGFzcykgJiYgISRzbGlkZUVsLmhhc0NsYXNzKHBhcmFtcy5sb2FkaW5nQ2xhc3MpKSB7XHJcbiAgICAgICAgICAkaW1hZ2VzLnB1c2goJHNsaWRlRWxbMF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRpbWFnZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgJGltYWdlcy5lYWNoKGltYWdlRWwgPT4ge1xyXG4gICAgICAgICAgY29uc3QgJGltYWdlRWwgPSAkKGltYWdlRWwpO1xyXG4gICAgICAgICAgJGltYWdlRWwuYWRkQ2xhc3MocGFyYW1zLmxvYWRpbmdDbGFzcyk7XHJcbiAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gJGltYWdlRWwuYXR0cignZGF0YS1iYWNrZ3JvdW5kJyk7XHJcbiAgICAgICAgICBjb25zdCBzcmMgPSAkaW1hZ2VFbC5hdHRyKCdkYXRhLXNyYycpO1xyXG4gICAgICAgICAgY29uc3Qgc3Jjc2V0ID0gJGltYWdlRWwuYXR0cignZGF0YS1zcmNzZXQnKTtcclxuICAgICAgICAgIGNvbnN0IHNpemVzID0gJGltYWdlRWwuYXR0cignZGF0YS1zaXplcycpO1xyXG4gICAgICAgICAgY29uc3QgJHBpY3R1cmVFbCA9ICRpbWFnZUVsLnBhcmVudCgncGljdHVyZScpO1xyXG4gICAgICAgICAgc3dpcGVyLmxvYWRJbWFnZSgkaW1hZ2VFbFswXSwgc3JjIHx8IGJhY2tncm91bmQsIHNyY3NldCwgc2l6ZXMsIGZhbHNlLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3dpcGVyID09PSAndW5kZWZpbmVkJyB8fCBzd2lwZXIgPT09IG51bGwgfHwgIXN3aXBlciB8fCBzd2lwZXIgJiYgIXN3aXBlci5wYXJhbXMgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgICAkaW1hZ2VFbC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCBgdXJsKFwiJHtiYWNrZ3JvdW5kfVwiKWApO1xyXG4gICAgICAgICAgICAgICRpbWFnZUVsLnJlbW92ZUF0dHIoJ2RhdGEtYmFja2dyb3VuZCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChzcmNzZXQpIHtcclxuICAgICAgICAgICAgICAgICRpbWFnZUVsLmF0dHIoJ3NyY3NldCcsIHNyY3NldCk7XHJcbiAgICAgICAgICAgICAgICAkaW1hZ2VFbC5yZW1vdmVBdHRyKCdkYXRhLXNyY3NldCcpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHNpemVzKSB7XHJcbiAgICAgICAgICAgICAgICAkaW1hZ2VFbC5hdHRyKCdzaXplcycsIHNpemVzKTtcclxuICAgICAgICAgICAgICAgICRpbWFnZUVsLnJlbW92ZUF0dHIoJ2RhdGEtc2l6ZXMnKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmICgkcGljdHVyZUVsLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJHBpY3R1cmVFbC5jaGlsZHJlbignc291cmNlJykuZWFjaChzb3VyY2VFbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0ICRzb3VyY2UgPSAkKHNvdXJjZUVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmICgkc291cmNlLmF0dHIoJ2RhdGEtc3Jjc2V0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc291cmNlLmF0dHIoJ3NyY3NldCcsICRzb3VyY2UuYXR0cignZGF0YS1zcmNzZXQnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvdXJjZS5yZW1vdmVBdHRyKCdkYXRhLXNyY3NldCcpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChzcmMpIHtcclxuICAgICAgICAgICAgICAgICRpbWFnZUVsLmF0dHIoJ3NyYycsIHNyYyk7XHJcbiAgICAgICAgICAgICAgICAkaW1hZ2VFbC5yZW1vdmVBdHRyKCdkYXRhLXNyYycpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGltYWdlRWwuYWRkQ2xhc3MocGFyYW1zLmxvYWRlZENsYXNzKS5yZW1vdmVDbGFzcyhwYXJhbXMubG9hZGluZ0NsYXNzKTtcclxuICAgICAgICAgICAgJHNsaWRlRWwuZmluZChgLiR7cGFyYW1zLnByZWxvYWRlckNsYXNzfWApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCAmJiBsb2FkSW5EdXBsaWNhdGUpIHtcclxuICAgICAgICAgICAgICBjb25zdCBzbGlkZU9yaWdpbmFsSW5kZXggPSAkc2xpZGVFbC5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoJHNsaWRlRWwuaGFzQ2xhc3Moc3dpcGVyLnBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxTbGlkZSA9IHN3aXBlci4kd3JhcHBlckVsLmNoaWxkcmVuKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3NsaWRlT3JpZ2luYWxJbmRleH1cIl06bm90KC4ke3N3aXBlci5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzc30pYCk7XHJcbiAgICAgICAgICAgICAgICBsb2FkSW5TbGlkZShvcmlnaW5hbFNsaWRlLmluZGV4KCksIGZhbHNlKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZHVwbGljYXRlZFNsaWRlID0gc3dpcGVyLiR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3N3aXBlci5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzc31bZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3NsaWRlT3JpZ2luYWxJbmRleH1cIl1gKTtcclxuICAgICAgICAgICAgICAgIGxvYWRJblNsaWRlKGR1cGxpY2F0ZWRTbGlkZS5pbmRleCgpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbWl0KCdsYXp5SW1hZ2VSZWFkeScsICRzbGlkZUVsWzBdLCAkaW1hZ2VFbFswXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLnVwZGF0ZUF1dG9IZWlnaHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBlbWl0KCdsYXp5SW1hZ2VMb2FkJywgJHNsaWRlRWxbMF0sICRpbWFnZUVsWzBdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gbG9hZCgpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAkd3JhcHBlckVsLFxyXG4gICAgICAgICAgcGFyYW1zOiBzd2lwZXJQYXJhbXMsXHJcbiAgICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgICBhY3RpdmVJbmRleFxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3QgaXNWaXJ0dWFsID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyUGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXJQYXJhbXMubGF6eTtcclxuICAgICAgICBsZXQgc2xpZGVzUGVyVmlldyA9IHN3aXBlclBhcmFtcy5zbGlkZXNQZXJWaWV3O1xyXG5cclxuICAgICAgICBpZiAoc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNsaWRlRXhpc3QoaW5kZXgpIHtcclxuICAgICAgICAgIGlmIChpc1ZpcnR1YWwpIHtcclxuICAgICAgICAgICAgaWYgKCR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3N3aXBlclBhcmFtcy5zbGlkZUNsYXNzfVtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7aW5kZXh9XCJdYCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoc2xpZGVzW2luZGV4XSkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2xpZGVJbmRleChzbGlkZUVsKSB7XHJcbiAgICAgICAgICBpZiAoaXNWaXJ0dWFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKHNsaWRlRWwpLmF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuICQoc2xpZGVFbCkuaW5kZXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaW5pdGlhbEltYWdlTG9hZGVkKSBpbml0aWFsSW1hZ2VMb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzKSB7XHJcbiAgICAgICAgICAkd3JhcHBlckVsLmNoaWxkcmVuKGAuJHtzd2lwZXJQYXJhbXMuc2xpZGVWaXNpYmxlQ2xhc3N9YCkuZWFjaChzbGlkZUVsID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpc1ZpcnR1YWwgPyAkKHNsaWRlRWwpLmF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4JykgOiAkKHNsaWRlRWwpLmluZGV4KCk7XHJcbiAgICAgICAgICAgIGxvYWRJblNsaWRlKGluZGV4KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2xpZGVzUGVyVmlldyA+IDEpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleDsgaSA8IGFjdGl2ZUluZGV4ICsgc2xpZGVzUGVyVmlldzsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChzbGlkZUV4aXN0KGkpKSBsb2FkSW5TbGlkZShpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9hZEluU2xpZGUoYWN0aXZlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5sb2FkUHJldk5leHQpIHtcclxuICAgICAgICAgIGlmIChzbGlkZXNQZXJWaWV3ID4gMSB8fCBwYXJhbXMubG9hZFByZXZOZXh0QW1vdW50ICYmIHBhcmFtcy5sb2FkUHJldk5leHRBbW91bnQgPiAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFtb3VudCA9IHBhcmFtcy5sb2FkUHJldk5leHRBbW91bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwdiA9IHNsaWRlc1BlclZpZXc7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heEluZGV4ID0gTWF0aC5taW4oYWN0aXZlSW5kZXggKyBzcHYgKyBNYXRoLm1heChhbW91bnQsIHNwdiksIHNsaWRlcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCBtaW5JbmRleCA9IE1hdGgubWF4KGFjdGl2ZUluZGV4IC0gTWF0aC5tYXgoc3B2LCBhbW91bnQpLCAwKTsgLy8gTmV4dCBTbGlkZXNcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBhY3RpdmVJbmRleCArIHNsaWRlc1BlclZpZXc7IGkgPCBtYXhJbmRleDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNsaWRlRXhpc3QoaSkpIGxvYWRJblNsaWRlKGkpO1xyXG4gICAgICAgICAgICB9IC8vIFByZXYgU2xpZGVzXHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IG1pbkluZGV4OyBpIDwgYWN0aXZlSW5kZXg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgIGlmIChzbGlkZUV4aXN0KGkpKSBsb2FkSW5TbGlkZShpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dFNsaWRlID0gJHdyYXBwZXJFbC5jaGlsZHJlbihgLiR7c3dpcGVyUGFyYW1zLnNsaWRlTmV4dENsYXNzfWApO1xyXG4gICAgICAgICAgICBpZiAobmV4dFNsaWRlLmxlbmd0aCA+IDApIGxvYWRJblNsaWRlKHNsaWRlSW5kZXgobmV4dFNsaWRlKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZTbGlkZSA9ICR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3N3aXBlclBhcmFtcy5zbGlkZVByZXZDbGFzc31gKTtcclxuICAgICAgICAgICAgaWYgKHByZXZTbGlkZS5sZW5ndGggPiAwKSBsb2FkSW5TbGlkZShzbGlkZUluZGV4KHByZXZTbGlkZSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tJblZpZXdPbkxvYWQoKSB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KCk7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0ICRzY3JvbGxFbGVtZW50ID0gc3dpcGVyLnBhcmFtcy5sYXp5LnNjcm9sbGluZ0VsZW1lbnQgPyAkKHN3aXBlci5wYXJhbXMubGF6eS5zY3JvbGxpbmdFbGVtZW50KSA6ICQod2luZG93KTtcclxuICAgICAgICBjb25zdCBpc1dpbmRvdyA9ICRzY3JvbGxFbGVtZW50WzBdID09PSB3aW5kb3c7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsRWxlbWVudFdpZHRoID0gaXNXaW5kb3cgPyB3aW5kb3cuaW5uZXJXaWR0aCA6ICRzY3JvbGxFbGVtZW50WzBdLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbEVsZW1lbnRIZWlnaHQgPSBpc1dpbmRvdyA/IHdpbmRvdy5pbm5lckhlaWdodCA6ICRzY3JvbGxFbGVtZW50WzBdLm9mZnNldEhlaWdodDtcclxuICAgICAgICBjb25zdCBzd2lwZXJPZmZzZXQgPSBzd2lwZXIuJGVsLm9mZnNldCgpO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHJ0bFRyYW5zbGF0ZTogcnRsXHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICBsZXQgaW5WaWV3ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHJ0bCkgc3dpcGVyT2Zmc2V0LmxlZnQgLT0gc3dpcGVyLiRlbFswXS5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIGNvbnN0IHN3aXBlckNvb3JkID0gW1tzd2lwZXJPZmZzZXQubGVmdCwgc3dpcGVyT2Zmc2V0LnRvcF0sIFtzd2lwZXJPZmZzZXQubGVmdCArIHN3aXBlci53aWR0aCwgc3dpcGVyT2Zmc2V0LnRvcF0sIFtzd2lwZXJPZmZzZXQubGVmdCwgc3dpcGVyT2Zmc2V0LnRvcCArIHN3aXBlci5oZWlnaHRdLCBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzd2lwZXIud2lkdGgsIHN3aXBlck9mZnNldC50b3AgKyBzd2lwZXIuaGVpZ2h0XV07XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3dpcGVyQ29vcmQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGNvbnN0IHBvaW50ID0gc3dpcGVyQ29vcmRbaV07XHJcblxyXG4gICAgICAgICAgaWYgKHBvaW50WzBdID49IDAgJiYgcG9pbnRbMF0gPD0gc2Nyb2xsRWxlbWVudFdpZHRoICYmIHBvaW50WzFdID49IDAgJiYgcG9pbnRbMV0gPD0gc2Nyb2xsRWxlbWVudEhlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAocG9pbnRbMF0gPT09IDAgJiYgcG9pbnRbMV0gPT09IDApIGNvbnRpbnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblxyXG4gICAgICAgICAgICBpblZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFzc2l2ZUxpc3RlbmVyID0gc3dpcGVyLnRvdWNoRXZlbnRzLnN0YXJ0ID09PSAndG91Y2hzdGFydCcgJiYgc3dpcGVyLnN1cHBvcnQucGFzc2l2ZUxpc3RlbmVyICYmIHN3aXBlci5wYXJhbXMucGFzc2l2ZUxpc3RlbmVycyA/IHtcclxuICAgICAgICAgIHBhc3NpdmU6IHRydWUsXHJcbiAgICAgICAgICBjYXB0dXJlOiBmYWxzZVxyXG4gICAgICAgIH0gOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKGluVmlldykge1xyXG4gICAgICAgICAgbG9hZCgpO1xyXG4gICAgICAgICAgJHNjcm9sbEVsZW1lbnQub2ZmKCdzY3JvbGwnLCBjaGVja0luVmlld09uTG9hZCwgcGFzc2l2ZUxpc3RlbmVyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFzY3JvbGxIYW5kbGVyQXR0YWNoZWQpIHtcclxuICAgICAgICAgIHNjcm9sbEhhbmRsZXJBdHRhY2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAkc2Nyb2xsRWxlbWVudC5vbignc2Nyb2xsJywgY2hlY2tJblZpZXdPbkxvYWQsIHBhc3NpdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sYXp5LmVuYWJsZWQgJiYgc3dpcGVyLnBhcmFtcy5wcmVsb2FkSW1hZ2VzKSB7XHJcbiAgICAgICAgICBzd2lwZXIucGFyYW1zLnByZWxvYWRJbWFnZXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignaW5pdCcsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sYXp5LmVuYWJsZWQpIHtcclxuICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxhenkuY2hlY2tJblZpZXcpIHtcclxuICAgICAgICAgICAgY2hlY2tJblZpZXdPbkxvYWQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvYWQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2Nyb2xsJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmZyZWVNb2RlICYmIHN3aXBlci5wYXJhbXMuZnJlZU1vZGUuZW5hYmxlZCAmJiAhc3dpcGVyLnBhcmFtcy5mcmVlTW9kZS5zdGlja3kpIHtcclxuICAgICAgICAgIGxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2Nyb2xsYmFyRHJhZ01vdmUgcmVzaXplIF9mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxhenkuZW5hYmxlZCkge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubGF6eS5jaGVja0luVmlldykge1xyXG4gICAgICAgICAgICBjaGVja0luVmlld09uTG9hZCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9hZCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCd0cmFuc2l0aW9uU3RhcnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubGF6eS5lbmFibGVkKSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5sYXp5LmxvYWRPblRyYW5zaXRpb25TdGFydCB8fCAhc3dpcGVyLnBhcmFtcy5sYXp5LmxvYWRPblRyYW5zaXRpb25TdGFydCAmJiAhaW5pdGlhbEltYWdlTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxhenkuY2hlY2tJblZpZXcpIHtcclxuICAgICAgICAgICAgICBjaGVja0luVmlld09uTG9hZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCd0cmFuc2l0aW9uRW5kJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxhenkuZW5hYmxlZCAmJiAhc3dpcGVyLnBhcmFtcy5sYXp5LmxvYWRPblRyYW5zaXRpb25TdGFydCkge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubGF6eS5jaGVja0luVmlldykge1xyXG4gICAgICAgICAgICBjaGVja0luVmlld09uTG9hZCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9hZCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBsYXp5LFxyXG4gICAgICAgICAgY3NzTW9kZSxcclxuICAgICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3MsXHJcbiAgICAgICAgICB0b3VjaFJlbGVhc2VPbkVkZ2VzLFxyXG4gICAgICAgICAgcmVzaXN0YW5jZVJhdGlvXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXM7XHJcblxyXG4gICAgICAgIGlmIChsYXp5LmVuYWJsZWQgJiYgKGNzc01vZGUgfHwgd2F0Y2hTbGlkZXNQcm9ncmVzcyAmJiAodG91Y2hSZWxlYXNlT25FZGdlcyB8fCByZXNpc3RhbmNlUmF0aW8gPT09IDApKSkge1xyXG4gICAgICAgICAgbG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLmxhenksIHtcclxuICAgICAgICBsb2FkLFxyXG4gICAgICAgIGxvYWRJblNsaWRlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGVzbGludCBuby1iaXR3aXNlOiBbXCJlcnJvclwiLCB7IFwiYWxsb3dcIjogW1wiPj5cIl0gfV0gKi9cclxuICAgIGZ1bmN0aW9uIENvbnRyb2xsZXIoX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgY29udHJvbGxlcjoge1xyXG4gICAgICAgICAgY29udHJvbDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgaW52ZXJzZTogZmFsc2UsXHJcbiAgICAgICAgICBieTogJ3NsaWRlJyAvLyBvciAnY29udGFpbmVyJ1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBzd2lwZXIuY29udHJvbGxlciA9IHtcclxuICAgICAgICBjb250cm9sOiB1bmRlZmluZWRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIExpbmVhclNwbGluZSh4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgYmluYXJ5U2VhcmNoID0gZnVuY3Rpb24gc2VhcmNoKCkge1xyXG4gICAgICAgICAgbGV0IG1heEluZGV4O1xyXG4gICAgICAgICAgbGV0IG1pbkluZGV4O1xyXG4gICAgICAgICAgbGV0IGd1ZXNzO1xyXG4gICAgICAgICAgcmV0dXJuIChhcnJheSwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgIG1pbkluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKG1heEluZGV4IC0gbWluSW5kZXggPiAxKSB7XHJcbiAgICAgICAgICAgICAgZ3Vlc3MgPSBtYXhJbmRleCArIG1pbkluZGV4ID4+IDE7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChhcnJheVtndWVzc10gPD0gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5JbmRleCA9IGd1ZXNzO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXhJbmRleCA9IGd1ZXNzO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1heEluZGV4O1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KCk7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IHgubGVuZ3RoIC0gMTsgLy8gR2l2ZW4gYW4geCB2YWx1ZSAoeDIpLCByZXR1cm4gdGhlIGV4cGVjdGVkIHkyIHZhbHVlOlxyXG4gICAgICAgIC8vICh4MSx5MSkgaXMgdGhlIGtub3duIHBvaW50IGJlZm9yZSBnaXZlbiB2YWx1ZSxcclxuICAgICAgICAvLyAoeDMseTMpIGlzIHRoZSBrbm93biBwb2ludCBhZnRlciBnaXZlbiB2YWx1ZS5cclxuXHJcbiAgICAgICAgbGV0IGkxO1xyXG4gICAgICAgIGxldCBpMztcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIGludGVycG9sYXRlKHgyKSB7XHJcbiAgICAgICAgICBpZiAoIXgyKSByZXR1cm4gMDsgLy8gR2V0IHRoZSBpbmRleGVzIG9mIHgxIGFuZCB4MyAodGhlIGFycmF5IGluZGV4ZXMgYmVmb3JlIGFuZCBhZnRlciBnaXZlbiB4Mik6XHJcblxyXG4gICAgICAgICAgaTMgPSBiaW5hcnlTZWFyY2godGhpcy54LCB4Mik7XHJcbiAgICAgICAgICBpMSA9IGkzIC0gMTsgLy8gV2UgaGF2ZSBvdXIgaW5kZXhlcyBpMSAmIGkzLCBzbyB3ZSBjYW4gY2FsY3VsYXRlIGFscmVhZHk6XHJcbiAgICAgICAgICAvLyB5MiA6PSAoKHgy4oiSeDEpIMOXICh5M+KIknkxKSkgw7cgKHgz4oiSeDEpICsgeTFcclxuXHJcbiAgICAgICAgICByZXR1cm4gKHgyIC0gdGhpcy54W2kxXSkgKiAodGhpcy55W2kzXSAtIHRoaXMueVtpMV0pIC8gKHRoaXMueFtpM10gLSB0aGlzLnhbaTFdKSArIHRoaXMueVtpMV07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH0gLy8geHh4OiBmb3Igbm93IGkgd2lsbCBqdXN0IHNhdmUgb25lIHNwbGluZSBmdW5jdGlvbiB0byB0b1xyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldEludGVycG9sYXRlRnVuY3Rpb24oYykge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lKSB7XHJcbiAgICAgICAgICBzd2lwZXIuY29udHJvbGxlci5zcGxpbmUgPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBuZXcgTGluZWFyU3BsaW5lKHN3aXBlci5zbGlkZXNHcmlkLCBjLnNsaWRlc0dyaWQpIDogbmV3IExpbmVhclNwbGluZShzd2lwZXIuc25hcEdyaWQsIGMuc25hcEdyaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0VHJhbnNsYXRlKF90LCBieUNvbnRyb2xsZXIpIHtcclxuICAgICAgICBjb25zdCBjb250cm9sbGVkID0gc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbDtcclxuICAgICAgICBsZXQgbXVsdGlwbGllcjtcclxuICAgICAgICBsZXQgY29udHJvbGxlZFRyYW5zbGF0ZTtcclxuICAgICAgICBjb25zdCBTd2lwZXIgPSBzd2lwZXIuY29uc3RydWN0b3I7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldENvbnRyb2xsZWRUcmFuc2xhdGUoYykge1xyXG4gICAgICAgICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSBhbiBJbnRlcnBvbGF0ZSBmdW5jdGlvbiBiYXNlZCBvbiB0aGUgc25hcEdyaWRzXHJcbiAgICAgICAgICAvLyB4IGlzIHRoZSBHcmlkIG9mIHRoZSBzY3JvbGxlZCBzY3JvbGxlciBhbmQgeSB3aWxsIGJlIHRoZSBjb250cm9sbGVkIHNjcm9sbGVyXHJcbiAgICAgICAgICAvLyBpdCBtYWtlcyBzZW5zZSB0byBjcmVhdGUgdGhpcyBvbmx5IG9uY2UgYW5kIHJlY2FsbCBpdCBmb3IgdGhlIGludGVycG9sYXRpb25cclxuICAgICAgICAgIC8vIHRoZSBmdW5jdGlvbiBkb2VzIGEgbG90IG9mIHZhbHVlIGNhY2hpbmcgZm9yIHBlcmZvcm1hbmNlXHJcbiAgICAgICAgICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIucnRsVHJhbnNsYXRlID8gLXN3aXBlci50cmFuc2xhdGUgOiBzd2lwZXIudHJhbnNsYXRlO1xyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuYnkgPT09ICdzbGlkZScpIHtcclxuICAgICAgICAgICAgZ2V0SW50ZXJwb2xhdGVGdW5jdGlvbihjKTsgLy8gaSBhbSBub3Qgc3VyZSB3aHkgdGhlIHZhbHVlcyBoYXZlIHRvIGJlIG11bHRpcGxpY2F0ZWQgdGhpcyB3YXksIHRyaWVkIHRvIGludmVydCB0aGUgc25hcEdyaWRcclxuICAgICAgICAgICAgLy8gYnV0IGl0IGRpZCBub3Qgd29yayBvdXRcclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSAtc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lLmludGVycG9sYXRlKC10cmFuc2xhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghY29udHJvbGxlZFRyYW5zbGF0ZSB8fCBzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuYnkgPT09ICdjb250YWluZXInKSB7XHJcbiAgICAgICAgICAgIG11bHRpcGxpZXIgPSAoYy5tYXhUcmFuc2xhdGUoKSAtIGMubWluVHJhbnNsYXRlKCkpIC8gKHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIHN3aXBlci5taW5UcmFuc2xhdGUoKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSAodHJhbnNsYXRlIC0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSAqIG11bHRpcGxpZXIgKyBjLm1pblRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmNvbnRyb2xsZXIuaW52ZXJzZSkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVkVHJhbnNsYXRlID0gYy5tYXhUcmFuc2xhdGUoKSAtIGNvbnRyb2xsZWRUcmFuc2xhdGU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYy51cGRhdGVQcm9ncmVzcyhjb250cm9sbGVkVHJhbnNsYXRlKTtcclxuICAgICAgICAgIGMuc2V0VHJhbnNsYXRlKGNvbnRyb2xsZWRUcmFuc2xhdGUsIHN3aXBlcik7XHJcbiAgICAgICAgICBjLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XHJcbiAgICAgICAgICBjLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xsZWQpKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRyb2xsZWQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZWRbaV0gIT09IGJ5Q29udHJvbGxlciAmJiBjb250cm9sbGVkW2ldIGluc3RhbmNlb2YgU3dpcGVyKSB7XHJcbiAgICAgICAgICAgICAgc2V0Q29udHJvbGxlZFRyYW5zbGF0ZShjb250cm9sbGVkW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udHJvbGxlZCBpbnN0YW5jZW9mIFN3aXBlciAmJiBieUNvbnRyb2xsZXIgIT09IGNvbnRyb2xsZWQpIHtcclxuICAgICAgICAgIHNldENvbnRyb2xsZWRUcmFuc2xhdGUoY29udHJvbGxlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZXRUcmFuc2l0aW9uKGR1cmF0aW9uLCBieUNvbnRyb2xsZXIpIHtcclxuICAgICAgICBjb25zdCBTd2lwZXIgPSBzd2lwZXIuY29uc3RydWN0b3I7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlZCA9IHN3aXBlci5jb250cm9sbGVyLmNvbnRyb2w7XHJcbiAgICAgICAgbGV0IGk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGMpIHtcclxuICAgICAgICAgIGMuc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgc3dpcGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAoZHVyYXRpb24gIT09IDApIHtcclxuICAgICAgICAgICAgYy50cmFuc2l0aW9uU3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYy51cGRhdGVBdXRvSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGMuJHdyYXBwZXJFbC50cmFuc2l0aW9uRW5kKCgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIWNvbnRyb2xsZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGMucGFyYW1zLmxvb3AgJiYgc3dpcGVyLnBhcmFtcy5jb250cm9sbGVyLmJ5ID09PSAnc2xpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICBjLmxvb3BGaXgoKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGMudHJhbnNpdGlvbkVuZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xsZWQpKSB7XHJcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29udHJvbGxlZC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlZFtpXSAhPT0gYnlDb250cm9sbGVyICYmIGNvbnRyb2xsZWRbaV0gaW5zdGFuY2VvZiBTd2lwZXIpIHtcclxuICAgICAgICAgICAgICBzZXRDb250cm9sbGVkVHJhbnNpdGlvbihjb250cm9sbGVkW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udHJvbGxlZCBpbnN0YW5jZW9mIFN3aXBlciAmJiBieUNvbnRyb2xsZXIgIT09IGNvbnRyb2xsZWQpIHtcclxuICAgICAgICAgIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGNvbnRyb2xsZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVtb3ZlU3BsaW5lKCkge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lKSB7XHJcbiAgICAgICAgICBzd2lwZXIuY29udHJvbGxlci5zcGxpbmUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBkZWxldGUgc3dpcGVyLmNvbnRyb2xsZXIuc3BsaW5lO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgb24oJ2JlZm9yZUluaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCA9IHN3aXBlci5wYXJhbXMuY29udHJvbGxlci5jb250cm9sO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICByZW1vdmVTcGxpbmUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlU3BsaW5lKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignb2JzZXJ2ZXJVcGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlU3BsaW5lKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2V0VHJhbnNsYXRlJywgKF9zLCB0cmFuc2xhdGUsIGJ5Q29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCkgcmV0dXJuO1xyXG4gICAgICAgIHN3aXBlci5jb250cm9sbGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUsIGJ5Q29udHJvbGxlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2V0VHJhbnNpdGlvbicsIChfcywgZHVyYXRpb24sIGJ5Q29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmNvbnRyb2xsZXIuY29udHJvbCkgcmV0dXJuO1xyXG4gICAgICAgIHN3aXBlci5jb250cm9sbGVyLnNldFRyYW5zaXRpb24oZHVyYXRpb24sIGJ5Q29udHJvbGxlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBPYmplY3QuYXNzaWduKHN3aXBlci5jb250cm9sbGVyLCB7XHJcbiAgICAgICAgc2V0VHJhbnNsYXRlLFxyXG4gICAgICAgIHNldFRyYW5zaXRpb25cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gQTExeShfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGV4dGVuZFBhcmFtcyxcclxuICAgICAgICBvblxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBhMTF5OiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgbm90aWZpY2F0aW9uQ2xhc3M6ICdzd2lwZXItbm90aWZpY2F0aW9uJyxcclxuICAgICAgICAgIHByZXZTbGlkZU1lc3NhZ2U6ICdQcmV2aW91cyBzbGlkZScsXHJcbiAgICAgICAgICBuZXh0U2xpZGVNZXNzYWdlOiAnTmV4dCBzbGlkZScsXHJcbiAgICAgICAgICBmaXJzdFNsaWRlTWVzc2FnZTogJ1RoaXMgaXMgdGhlIGZpcnN0IHNsaWRlJyxcclxuICAgICAgICAgIGxhc3RTbGlkZU1lc3NhZ2U6ICdUaGlzIGlzIHRoZSBsYXN0IHNsaWRlJyxcclxuICAgICAgICAgIHBhZ2luYXRpb25CdWxsZXRNZXNzYWdlOiAnR28gdG8gc2xpZGUge3tpbmRleH19JyxcclxuICAgICAgICAgIHNsaWRlTGFiZWxNZXNzYWdlOiAne3tpbmRleH19IC8ge3tzbGlkZXNMZW5ndGh9fScsXHJcbiAgICAgICAgICBjb250YWluZXJNZXNzYWdlOiBudWxsLFxyXG4gICAgICAgICAgY29udGFpbmVyUm9sZURlc2NyaXB0aW9uTWVzc2FnZTogbnVsbCxcclxuICAgICAgICAgIGl0ZW1Sb2xlRGVzY3JpcHRpb25NZXNzYWdlOiBudWxsLFxyXG4gICAgICAgICAgc2xpZGVSb2xlOiAnZ3JvdXAnLFxyXG4gICAgICAgICAgaWQ6IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgbGl2ZVJlZ2lvbiA9IG51bGw7XHJcblxyXG4gICAgICBmdW5jdGlvbiBub3RpZnkobWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGxpdmVSZWdpb247XHJcbiAgICAgICAgaWYgKG5vdGlmaWNhdGlvbi5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICBub3RpZmljYXRpb24uaHRtbCgnJyk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmh0bWwobWVzc2FnZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldFJhbmRvbU51bWJlcihzaXplKSB7XHJcbiAgICAgICAgaWYgKHNpemUgPT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgc2l6ZSA9IDE2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmFuZG9tQ2hhciA9ICgpID0+IE1hdGgucm91bmQoMTYgKiBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygxNik7XHJcblxyXG4gICAgICAgIHJldHVybiAneCcucmVwZWF0KHNpemUpLnJlcGxhY2UoL3gvZywgcmFuZG9tQ2hhcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG1ha2VFbEZvY3VzYWJsZSgkZWwpIHtcclxuICAgICAgICAkZWwuYXR0cigndGFiSW5kZXgnLCAnMCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBtYWtlRWxOb3RGb2N1c2FibGUoJGVsKSB7XHJcbiAgICAgICAgJGVsLmF0dHIoJ3RhYkluZGV4JywgJy0xJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFkZEVsUm9sZSgkZWwsIHJvbGUpIHtcclxuICAgICAgICAkZWwuYXR0cigncm9sZScsIHJvbGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBhZGRFbFJvbGVEZXNjcmlwdGlvbigkZWwsIGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgJGVsLmF0dHIoJ2FyaWEtcm9sZWRlc2NyaXB0aW9uJywgZGVzY3JpcHRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBhZGRFbENvbnRyb2xzKCRlbCwgY29udHJvbHMpIHtcclxuICAgICAgICAkZWwuYXR0cignYXJpYS1jb250cm9scycsIGNvbnRyb2xzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gYWRkRWxMYWJlbCgkZWwsIGxhYmVsKSB7XHJcbiAgICAgICAgJGVsLmF0dHIoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFkZEVsSWQoJGVsLCBpZCkge1xyXG4gICAgICAgICRlbC5hdHRyKCdpZCcsIGlkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gYWRkRWxMaXZlKCRlbCwgbGl2ZSkge1xyXG4gICAgICAgICRlbC5hdHRyKCdhcmlhLWxpdmUnLCBsaXZlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZGlzYWJsZUVsKCRlbCkge1xyXG4gICAgICAgICRlbC5hdHRyKCdhcmlhLWRpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVuYWJsZUVsKCRlbCkge1xyXG4gICAgICAgICRlbC5hdHRyKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbkVudGVyT3JTcGFjZUtleShlKSB7XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSAhPT0gMTMgJiYgZS5rZXlDb2RlICE9PSAzMikgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuYTExeTtcclxuICAgICAgICBjb25zdCAkdGFyZ2V0RWwgPSAkKGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5uYXZpZ2F0aW9uICYmIHN3aXBlci5uYXZpZ2F0aW9uLiRuZXh0RWwgJiYgJHRhcmdldEVsLmlzKHN3aXBlci5uYXZpZ2F0aW9uLiRuZXh0RWwpKSB7XHJcbiAgICAgICAgICBpZiAoIShzd2lwZXIuaXNFbmQgJiYgIXN3aXBlci5wYXJhbXMubG9vcCkpIHtcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlTmV4dCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIuaXNFbmQpIHtcclxuICAgICAgICAgICAgbm90aWZ5KHBhcmFtcy5sYXN0U2xpZGVNZXNzYWdlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vdGlmeShwYXJhbXMubmV4dFNsaWRlTWVzc2FnZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24uJHByZXZFbCAmJiAkdGFyZ2V0RWwuaXMoc3dpcGVyLm5hdmlnYXRpb24uJHByZXZFbCkpIHtcclxuICAgICAgICAgIGlmICghKHN3aXBlci5pc0JlZ2lubmluZyAmJiAhc3dpcGVyLnBhcmFtcy5sb29wKSkge1xyXG4gICAgICAgICAgICBzd2lwZXIuc2xpZGVQcmV2KCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5pc0JlZ2lubmluZykge1xyXG4gICAgICAgICAgICBub3RpZnkocGFyYW1zLmZpcnN0U2xpZGVNZXNzYWdlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vdGlmeShwYXJhbXMucHJldlNsaWRlTWVzc2FnZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhZ2luYXRpb24gJiYgJHRhcmdldEVsLmlzKGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcykpKSB7XHJcbiAgICAgICAgICAkdGFyZ2V0RWxbMF0uY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZU5hdmlnYXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCB8fCBzd2lwZXIucGFyYW1zLnJld2luZCB8fCAhc3dpcGVyLm5hdmlnYXRpb24pIHJldHVybjtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAkbmV4dEVsLFxyXG4gICAgICAgICAgJHByZXZFbFxyXG4gICAgICAgIH0gPSBzd2lwZXIubmF2aWdhdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKCRwcmV2RWwgJiYgJHByZXZFbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBpZiAoc3dpcGVyLmlzQmVnaW5uaW5nKSB7XHJcbiAgICAgICAgICAgIGRpc2FibGVFbCgkcHJldkVsKTtcclxuICAgICAgICAgICAgbWFrZUVsTm90Rm9jdXNhYmxlKCRwcmV2RWwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZW5hYmxlRWwoJHByZXZFbCk7XHJcbiAgICAgICAgICAgIG1ha2VFbEZvY3VzYWJsZSgkcHJldkVsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkbmV4dEVsICYmICRuZXh0RWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5pc0VuZCkge1xyXG4gICAgICAgICAgICBkaXNhYmxlRWwoJG5leHRFbCk7XHJcbiAgICAgICAgICAgIG1ha2VFbE5vdEZvY3VzYWJsZSgkbmV4dEVsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVuYWJsZUVsKCRuZXh0RWwpO1xyXG4gICAgICAgICAgICBtYWtlRWxGb2N1c2FibGUoJG5leHRFbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBoYXNQYWdpbmF0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBzd2lwZXIucGFnaW5hdGlvbiAmJiBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzICYmIHN3aXBlci5wYWdpbmF0aW9uLmJ1bGxldHMubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBoYXNDbGlja2FibGVQYWdpbmF0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBoYXNQYWdpbmF0aW9uKCkgJiYgc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmNsaWNrYWJsZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlUGFnaW5hdGlvbigpIHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmExMXk7XHJcbiAgICAgICAgaWYgKCFoYXNQYWdpbmF0aW9uKCkpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIucGFnaW5hdGlvbi5idWxsZXRzLmVhY2goYnVsbGV0RWwgPT4ge1xyXG4gICAgICAgICAgY29uc3QgJGJ1bGxldEVsID0gJChidWxsZXRFbCk7XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5jbGlja2FibGUpIHtcclxuICAgICAgICAgICAgbWFrZUVsRm9jdXNhYmxlKCRidWxsZXRFbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5yZW5kZXJCdWxsZXQpIHtcclxuICAgICAgICAgICAgICBhZGRFbFJvbGUoJGJ1bGxldEVsLCAnYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgYWRkRWxMYWJlbCgkYnVsbGV0RWwsIHBhcmFtcy5wYWdpbmF0aW9uQnVsbGV0TWVzc2FnZS5yZXBsYWNlKC9cXHtcXHtpbmRleFxcfVxcfS8sICRidWxsZXRFbC5pbmRleCgpICsgMSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCRidWxsZXRFbC5pcyhgLiR7c3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmJ1bGxldEFjdGl2ZUNsYXNzfWApKSB7XHJcbiAgICAgICAgICAgICRidWxsZXRFbC5hdHRyKCdhcmlhLWN1cnJlbnQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGJ1bGxldEVsLnJlbW92ZUF0dHIoJ2FyaWEtY3VycmVudCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBpbml0TmF2RWwgPSAoJGVsLCB3cmFwcGVySWQsIG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBtYWtlRWxGb2N1c2FibGUoJGVsKTtcclxuXHJcbiAgICAgICAgaWYgKCRlbFswXS50YWdOYW1lICE9PSAnQlVUVE9OJykge1xyXG4gICAgICAgICAgYWRkRWxSb2xlKCRlbCwgJ2J1dHRvbicpO1xyXG4gICAgICAgICAgJGVsLm9uKCdrZXlkb3duJywgb25FbnRlck9yU3BhY2VLZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkRWxMYWJlbCgkZWwsIG1lc3NhZ2UpO1xyXG4gICAgICAgIGFkZEVsQ29udHJvbHMoJGVsLCB3cmFwcGVySWQpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgaGFuZGxlRm9jdXMgPSBlID0+IHtcclxuICAgICAgICBjb25zdCBzbGlkZUVsID0gZS50YXJnZXQuY2xvc2VzdChgLiR7c3dpcGVyLnBhcmFtcy5zbGlkZUNsYXNzfWApO1xyXG4gICAgICAgIGlmICghc2xpZGVFbCB8fCAhc3dpcGVyLnNsaWRlcy5pbmNsdWRlcyhzbGlkZUVsKSkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gc3dpcGVyLnNsaWRlcy5pbmRleE9mKHNsaWRlRWwpID09PSBzd2lwZXIuYWN0aXZlSW5kZXg7XHJcbiAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gc3dpcGVyLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzICYmIHN3aXBlci52aXNpYmxlU2xpZGVzICYmIHN3aXBlci52aXNpYmxlU2xpZGVzLmluY2x1ZGVzKHNsaWRlRWwpO1xyXG4gICAgICAgIGlmIChpc0FjdGl2ZSB8fCBpc1Zpc2libGUpIHJldHVybjtcclxuICAgICAgICBzd2lwZXIuc2xpZGVUbyhzd2lwZXIuc2xpZGVzLmluZGV4T2Yoc2xpZGVFbCksIDApO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmExMXk7XHJcbiAgICAgICAgc3dpcGVyLiRlbC5hcHBlbmQobGl2ZVJlZ2lvbik7IC8vIENvbnRhaW5lclxyXG5cclxuICAgICAgICBjb25zdCAkY29udGFpbmVyRWwgPSBzd2lwZXIuJGVsO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmNvbnRhaW5lclJvbGVEZXNjcmlwdGlvbk1lc3NhZ2UpIHtcclxuICAgICAgICAgIGFkZEVsUm9sZURlc2NyaXB0aW9uKCRjb250YWluZXJFbCwgcGFyYW1zLmNvbnRhaW5lclJvbGVEZXNjcmlwdGlvbk1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5jb250YWluZXJNZXNzYWdlKSB7XHJcbiAgICAgICAgICBhZGRFbExhYmVsKCRjb250YWluZXJFbCwgcGFyYW1zLmNvbnRhaW5lck1lc3NhZ2UpO1xyXG4gICAgICAgIH0gLy8gV3JhcHBlclxyXG5cclxuXHJcbiAgICAgICAgY29uc3QgJHdyYXBwZXJFbCA9IHN3aXBlci4kd3JhcHBlckVsO1xyXG4gICAgICAgIGNvbnN0IHdyYXBwZXJJZCA9IHBhcmFtcy5pZCB8fCAkd3JhcHBlckVsLmF0dHIoJ2lkJykgfHwgYHN3aXBlci13cmFwcGVyLSR7Z2V0UmFuZG9tTnVtYmVyKDE2KX1gO1xyXG4gICAgICAgIGNvbnN0IGxpdmUgPSBzd2lwZXIucGFyYW1zLmF1dG9wbGF5ICYmIHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZW5hYmxlZCA/ICdvZmYnIDogJ3BvbGl0ZSc7XHJcbiAgICAgICAgYWRkRWxJZCgkd3JhcHBlckVsLCB3cmFwcGVySWQpO1xyXG4gICAgICAgIGFkZEVsTGl2ZSgkd3JhcHBlckVsLCBsaXZlKTsgLy8gU2xpZGVcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5pdGVtUm9sZURlc2NyaXB0aW9uTWVzc2FnZSkge1xyXG4gICAgICAgICAgYWRkRWxSb2xlRGVzY3JpcHRpb24oJChzd2lwZXIuc2xpZGVzKSwgcGFyYW1zLml0ZW1Sb2xlRGVzY3JpcHRpb25NZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZEVsUm9sZSgkKHN3aXBlci5zbGlkZXMpLCBwYXJhbXMuc2xpZGVSb2xlKTtcclxuICAgICAgICBjb25zdCBzbGlkZXNMZW5ndGggPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBzd2lwZXIuc2xpZGVzLmZpbHRlcihlbCA9PiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKHN3aXBlci5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpLmxlbmd0aCA6IHN3aXBlci5zbGlkZXMubGVuZ3RoO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZXMuZWFjaCgoc2xpZGVFbCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0ICRzbGlkZUVsID0gJChzbGlkZUVsKTtcclxuICAgICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBzd2lwZXIucGFyYW1zLmxvb3AgPyBwYXJzZUludCgkc2xpZGVFbC5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCkgOiBpbmRleDtcclxuICAgICAgICAgIGNvbnN0IGFyaWFMYWJlbE1lc3NhZ2UgPSBwYXJhbXMuc2xpZGVMYWJlbE1lc3NhZ2UucmVwbGFjZSgvXFx7XFx7aW5kZXhcXH1cXH0vLCBzbGlkZUluZGV4ICsgMSkucmVwbGFjZSgvXFx7XFx7c2xpZGVzTGVuZ3RoXFx9XFx9Lywgc2xpZGVzTGVuZ3RoKTtcclxuICAgICAgICAgIGFkZEVsTGFiZWwoJHNsaWRlRWwsIGFyaWFMYWJlbE1lc3NhZ2UpO1xyXG4gICAgICAgIH0pOyAvLyBOYXZpZ2F0aW9uXHJcblxyXG4gICAgICAgIGxldCAkbmV4dEVsO1xyXG4gICAgICAgIGxldCAkcHJldkVsO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24uJG5leHRFbCkge1xyXG4gICAgICAgICAgJG5leHRFbCA9IHN3aXBlci5uYXZpZ2F0aW9uLiRuZXh0RWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24uJHByZXZFbCkge1xyXG4gICAgICAgICAgJHByZXZFbCA9IHN3aXBlci5uYXZpZ2F0aW9uLiRwcmV2RWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJG5leHRFbCAmJiAkbmV4dEVsLmxlbmd0aCkge1xyXG4gICAgICAgICAgaW5pdE5hdkVsKCRuZXh0RWwsIHdyYXBwZXJJZCwgcGFyYW1zLm5leHRTbGlkZU1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRwcmV2RWwgJiYgJHByZXZFbC5sZW5ndGgpIHtcclxuICAgICAgICAgIGluaXROYXZFbCgkcHJldkVsLCB3cmFwcGVySWQsIHBhcmFtcy5wcmV2U2xpZGVNZXNzYWdlKTtcclxuICAgICAgICB9IC8vIFBhZ2luYXRpb25cclxuXHJcblxyXG4gICAgICAgIGlmIChoYXNDbGlja2FibGVQYWdpbmF0aW9uKCkpIHtcclxuICAgICAgICAgIHN3aXBlci5wYWdpbmF0aW9uLiRlbC5vbigna2V5ZG93bicsIGNsYXNzZXNUb1NlbGVjdG9yKHN3aXBlci5wYXJhbXMucGFnaW5hdGlvbi5idWxsZXRDbGFzcyksIG9uRW50ZXJPclNwYWNlS2V5KTtcclxuICAgICAgICB9IC8vIFRhYiBmb2N1c1xyXG5cclxuXHJcbiAgICAgICAgc3dpcGVyLiRlbC5vbignZm9jdXMnLCBoYW5kbGVGb2N1cywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKGxpdmVSZWdpb24gJiYgbGl2ZVJlZ2lvbi5sZW5ndGggPiAwKSBsaXZlUmVnaW9uLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCAkbmV4dEVsO1xyXG4gICAgICAgIGxldCAkcHJldkVsO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24uJG5leHRFbCkge1xyXG4gICAgICAgICAgJG5leHRFbCA9IHN3aXBlci5uYXZpZ2F0aW9uLiRuZXh0RWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLm5hdmlnYXRpb24gJiYgc3dpcGVyLm5hdmlnYXRpb24uJHByZXZFbCkge1xyXG4gICAgICAgICAgJHByZXZFbCA9IHN3aXBlci5uYXZpZ2F0aW9uLiRwcmV2RWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJG5leHRFbCkge1xyXG4gICAgICAgICAgJG5leHRFbC5vZmYoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJHByZXZFbCkge1xyXG4gICAgICAgICAgJHByZXZFbC5vZmYoJ2tleWRvd24nLCBvbkVudGVyT3JTcGFjZUtleSk7XHJcbiAgICAgICAgfSAvLyBQYWdpbmF0aW9uXHJcblxyXG5cclxuICAgICAgICBpZiAoaGFzQ2xpY2thYmxlUGFnaW5hdGlvbigpKSB7XHJcbiAgICAgICAgICBzd2lwZXIucGFnaW5hdGlvbi4kZWwub2ZmKCdrZXlkb3duJywgY2xhc3Nlc1RvU2VsZWN0b3Ioc3dpcGVyLnBhcmFtcy5wYWdpbmF0aW9uLmJ1bGxldENsYXNzKSwgb25FbnRlck9yU3BhY2VLZXkpO1xyXG4gICAgICAgIH0gLy8gVGFiIGZvY3VzXHJcblxyXG5cclxuICAgICAgICBzd2lwZXIuJGVsLm9mZignZm9jdXMnLCBoYW5kbGVGb2N1cywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9uKCdiZWZvcmVJbml0JywgKCkgPT4ge1xyXG4gICAgICAgIGxpdmVSZWdpb24gPSAkKGA8c3BhbiBjbGFzcz1cIiR7c3dpcGVyLnBhcmFtcy5hMTF5Lm5vdGlmaWNhdGlvbkNsYXNzfVwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPjwvc3Bhbj5gKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdhZnRlckluaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIGluaXQoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdmcm9tRWRnZSB0b0VkZ2UgYWZ0ZXJJbml0IGxvY2sgdW5sb2NrJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5hMTF5LmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICB1cGRhdGVOYXZpZ2F0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbigncGFnaW5hdGlvblVwZGF0ZScsICgpID0+IHtcclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMuYTExeS5lbmFibGVkKSByZXR1cm47XHJcbiAgICAgICAgdXBkYXRlUGFnaW5hdGlvbigpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIucGFyYW1zLmExMXkuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gSGlzdG9yeShfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGV4dGVuZFBhcmFtcyxcclxuICAgICAgICBvblxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBoaXN0b3J5OiB7XHJcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgIHJvb3Q6ICcnLFxyXG4gICAgICAgICAgcmVwbGFjZVN0YXRlOiBmYWxzZSxcclxuICAgICAgICAgIGtleTogJ3NsaWRlcydcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgbGV0IHBhdGhzID0ge307XHJcblxyXG4gICAgICBjb25zdCBzbHVnaWZ5ID0gdGV4dCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMrL2csICctJykucmVwbGFjZSgvW15cXHctXSsvZywgJycpLnJlcGxhY2UoLy0tKy9nLCAnLScpLnJlcGxhY2UoL14tKy8sICcnKS5yZXBsYWNlKC8tKyQvLCAnJyk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBnZXRQYXRoVmFsdWVzID0gdXJsT3ZlcnJpZGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICAgIGxldCBsb2NhdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKHVybE92ZXJyaWRlKSB7XHJcbiAgICAgICAgICBsb2NhdGlvbiA9IG5ldyBVUkwodXJsT3ZlcnJpZGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhdGhBcnJheSA9IGxvY2F0aW9uLnBhdGhuYW1lLnNsaWNlKDEpLnNwbGl0KCcvJykuZmlsdGVyKHBhcnQgPT4gcGFydCAhPT0gJycpO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gcGF0aEFycmF5Lmxlbmd0aDtcclxuICAgICAgICBjb25zdCBrZXkgPSBwYXRoQXJyYXlbdG90YWwgLSAyXTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGhBcnJheVt0b3RhbCAtIDFdO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBrZXksXHJcbiAgICAgICAgICB2YWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzZXRIaXN0b3J5ID0gKGtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coKTtcclxuICAgICAgICBpZiAoIWluaXRpYWxpemVkIHx8ICFzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBsb2NhdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMudXJsKSB7XHJcbiAgICAgICAgICBsb2NhdGlvbiA9IG5ldyBVUkwoc3dpcGVyLnBhcmFtcy51cmwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaWRlID0gc3dpcGVyLnNsaWRlcy5lcShpbmRleCk7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gc2x1Z2lmeShzbGlkZS5hdHRyKCdkYXRhLWhpc3RvcnknKSk7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmhpc3Rvcnkucm9vdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgcm9vdCA9IHN3aXBlci5wYXJhbXMuaGlzdG9yeS5yb290O1xyXG4gICAgICAgICAgaWYgKHJvb3Rbcm9vdC5sZW5ndGggLSAxXSA9PT0gJy8nKSByb290ID0gcm9vdC5zbGljZSgwLCByb290Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgdmFsdWUgPSBgJHtyb290fS8ke2tleX0vJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIWxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKGtleSkpIHtcclxuICAgICAgICAgIHZhbHVlID0gYCR7a2V5fS8ke3ZhbHVlfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5zdGF0ZTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZSAmJiBjdXJyZW50U3RhdGUudmFsdWUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xyXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcclxuICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICAgIH0sIG51bGwsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICAgIH0sIG51bGwsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzY3JvbGxUb1NsaWRlID0gKHNwZWVkLCB2YWx1ZSwgcnVuQ2FsbGJhY2tzKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gc3dpcGVyLnNsaWRlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBzbGlkZSA9IHN3aXBlci5zbGlkZXMuZXEoaSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNsaWRlSGlzdG9yeSA9IHNsdWdpZnkoc2xpZGUuYXR0cignZGF0YS1oaXN0b3J5JykpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNsaWRlSGlzdG9yeSA9PT0gdmFsdWUgJiYgIXNsaWRlLmhhc0NsYXNzKHN3aXBlci5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpIHtcclxuICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHNsaWRlLmluZGV4KCk7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8oaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKDAsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHNldEhpc3RvcnlQb3BTdGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBwYXRocyA9IGdldFBhdGhWYWx1ZXMoc3dpcGVyLnBhcmFtcy51cmwpO1xyXG4gICAgICAgIHNjcm9sbFRvU2xpZGUoc3dpcGVyLnBhcmFtcy5zcGVlZCwgc3dpcGVyLnBhdGhzLnZhbHVlLCBmYWxzZSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5oaXN0b3J5KSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghd2luZG93Lmhpc3RvcnkgfHwgIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG4gICAgICAgICAgc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgIHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgcGF0aHMgPSBnZXRQYXRoVmFsdWVzKHN3aXBlci5wYXJhbXMudXJsKTtcclxuICAgICAgICBpZiAoIXBhdGhzLmtleSAmJiAhcGF0aHMudmFsdWUpIHJldHVybjtcclxuICAgICAgICBzY3JvbGxUb1NsaWRlKDAsIHBhdGhzLnZhbHVlLCBzd2lwZXIucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCk7XHJcblxyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xyXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgc2V0SGlzdG9yeVBvcFN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMuaGlzdG9yeS5yZXBsYWNlU3RhdGUpIHtcclxuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHNldEhpc3RvcnlQb3BTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgb24oJ2luaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5lbmFibGVkKSB7XHJcbiAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2Rlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuaGlzdG9yeS5lbmFibGVkKSB7XHJcbiAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3RyYW5zaXRpb25FbmQgX2ZyZWVNb2RlTm9Nb21lbnR1bVJlbGVhc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGluaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICBzZXRIaXN0b3J5KHN3aXBlci5wYXJhbXMuaGlzdG9yeS5rZXksIHN3aXBlci5hY3RpdmVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NsaWRlQ2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChpbml0aWFsaXplZCAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgIHNldEhpc3Rvcnkoc3dpcGVyLnBhcmFtcy5oaXN0b3J5LmtleSwgc3dpcGVyLmFjdGl2ZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEhhc2hOYXZpZ2F0aW9uKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIGVtaXQsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xyXG4gICAgICBleHRlbmRQYXJhbXMoe1xyXG4gICAgICAgIGhhc2hOYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgIHJlcGxhY2VTdGF0ZTogZmFsc2UsXHJcbiAgICAgICAgICB3YXRjaFN0YXRlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBvbkhhc2hDaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgZW1pdCgnaGFzaENoYW5nZScpO1xyXG4gICAgICAgIGNvbnN0IG5ld0hhc2ggPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlU2xpZGVIYXNoID0gc3dpcGVyLnNsaWRlcy5lcShzd2lwZXIuYWN0aXZlSW5kZXgpLmF0dHIoJ2RhdGEtaGFzaCcpO1xyXG5cclxuICAgICAgICBpZiAobmV3SGFzaCAhPT0gYWN0aXZlU2xpZGVIYXNoKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXdJbmRleCA9IHN3aXBlci4kd3JhcHBlckVsLmNoaWxkcmVuKGAuJHtzd2lwZXIucGFyYW1zLnNsaWRlQ2xhc3N9W2RhdGEtaGFzaD1cIiR7bmV3SGFzaH1cIl1gKS5pbmRleCgpO1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBuZXdJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuICAgICAgICAgIHN3aXBlci5zbGlkZVRvKG5ld0luZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzZXRIYXNoID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghaW5pdGlhbGl6ZWQgfHwgIXN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5yZXBsYWNlU3RhdGUgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XHJcbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgbnVsbCwgYCMke3N3aXBlci5zbGlkZXMuZXEoc3dpcGVyLmFjdGl2ZUluZGV4KS5hdHRyKCdkYXRhLWhhc2gnKX1gIHx8ICcnKTtcclxuICAgICAgICAgIGVtaXQoJ2hhc2hTZXQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgc2xpZGUgPSBzd2lwZXIuc2xpZGVzLmVxKHN3aXBlci5hY3RpdmVJbmRleCk7XHJcbiAgICAgICAgICBjb25zdCBoYXNoID0gc2xpZGUuYXR0cignZGF0YS1oYXNoJykgfHwgc2xpZGUuYXR0cignZGF0YS1oaXN0b3J5Jyk7XHJcbiAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5oYXNoID0gaGFzaCB8fCAnJztcclxuICAgICAgICAgIGVtaXQoJ2hhc2hTZXQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi5lbmFibGVkIHx8IHN3aXBlci5wYXJhbXMuaGlzdG9yeSAmJiBzd2lwZXIucGFyYW1zLmhpc3RvcnkuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBoYXNoID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xyXG5cclxuICAgICAgICBpZiAoaGFzaCkge1xyXG4gICAgICAgICAgY29uc3Qgc3BlZWQgPSAwO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBzd2lwZXIuc2xpZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNsaWRlID0gc3dpcGVyLnNsaWRlcy5lcShpKTtcclxuICAgICAgICAgICAgY29uc3Qgc2xpZGVIYXNoID0gc2xpZGUuYXR0cignZGF0YS1oYXNoJykgfHwgc2xpZGUuYXR0cignZGF0YS1oaXN0b3J5Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2xpZGVIYXNoID09PSBoYXNoICYmICFzbGlkZS5oYXNDbGFzcyhzd2lwZXIucGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzbGlkZS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKGluZGV4LCBzcGVlZCwgc3dpcGVyLnBhcmFtcy5ydW5DYWxsYmFja3NPbkluaXQsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5oYXNoTmF2aWdhdGlvbi53YXRjaFN0YXRlKSB7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBvbkhhc2hDaGFuZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24ud2F0Y2hTdGF0ZSkge1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9mZignaGFzaGNoYW5nZScsIG9uSGFzaENoYW5nZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgb24oJ2luaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuaGFzaE5hdmlnYXRpb24uZW5hYmxlZCkge1xyXG4gICAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmhhc2hOYXZpZ2F0aW9uLmVuYWJsZWQpIHtcclxuICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbigndHJhbnNpdGlvbkVuZCBfZnJlZU1vZGVOb01vbWVudHVtUmVsZWFzZScsICgpID0+IHtcclxuICAgICAgICBpZiAoaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgIHNldEhhc2goKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGluaXRpYWxpemVkICYmIHN3aXBlci5wYXJhbXMuY3NzTW9kZSkge1xyXG4gICAgICAgICAgc2V0SGFzaCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogZXNsaW50IG5vLXVuZGVyc2NvcmUtZGFuZ2xlOiBcIm9mZlwiICovXHJcbiAgICBmdW5jdGlvbiBBdXRvcGxheShfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGV4dGVuZFBhcmFtcyxcclxuICAgICAgICBvbixcclxuICAgICAgICBlbWl0XHJcbiAgICAgIH0gPSBfcmVmO1xyXG4gICAgICBsZXQgdGltZW91dDtcclxuICAgICAgc3dpcGVyLmF1dG9wbGF5ID0ge1xyXG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxyXG4gICAgICAgIHBhdXNlZDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBhdXRvcGxheToge1xyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICBkZWxheTogMzAwMCxcclxuICAgICAgICAgIHdhaXRGb3JUcmFuc2l0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgZGlzYWJsZU9uSW50ZXJhY3Rpb246IHRydWUsXHJcbiAgICAgICAgICBzdG9wT25MYXN0U2xpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgcmV2ZXJzZURpcmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgICBwYXVzZU9uTW91c2VFbnRlcjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgICAgIGNvbnN0ICRhY3RpdmVTbGlkZUVsID0gc3dpcGVyLnNsaWRlcy5lcShzd2lwZXIuYWN0aXZlSW5kZXgpO1xyXG4gICAgICAgIGxldCBkZWxheSA9IHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGVsYXk7XHJcblxyXG4gICAgICAgIGlmICgkYWN0aXZlU2xpZGVFbC5hdHRyKCdkYXRhLXN3aXBlci1hdXRvcGxheScpKSB7XHJcbiAgICAgICAgICBkZWxheSA9ICRhY3RpdmVTbGlkZUVsLmF0dHIoJ2RhdGEtc3dpcGVyLWF1dG9wbGF5JykgfHwgc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICB0aW1lb3V0ID0gbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgbGV0IGF1dG9wbGF5UmVzdWx0O1xyXG5cclxuICAgICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LnJldmVyc2VEaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMubG9vcCkge1xyXG4gICAgICAgICAgICAgIHN3aXBlci5sb29wRml4KCk7XHJcbiAgICAgICAgICAgICAgYXV0b3BsYXlSZXN1bHQgPSBzd2lwZXIuc2xpZGVQcmV2KHN3aXBlci5wYXJhbXMuc3BlZWQsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgIGVtaXQoJ2F1dG9wbGF5Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN3aXBlci5pc0JlZ2lubmluZykge1xyXG4gICAgICAgICAgICAgIGF1dG9wbGF5UmVzdWx0ID0gc3dpcGVyLnNsaWRlUHJldihzd2lwZXIucGFyYW1zLnNwZWVkLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LnN0b3BPbkxhc3RTbGlkZSkge1xyXG4gICAgICAgICAgICAgIGF1dG9wbGF5UmVzdWx0ID0gc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxLCBzd2lwZXIucGFyYW1zLnNwZWVkLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcclxuICAgICAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcclxuICAgICAgICAgICAgYXV0b3BsYXlSZXN1bHQgPSBzd2lwZXIuc2xpZGVOZXh0KHN3aXBlci5wYXJhbXMuc3BlZWQsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICBlbWl0KCdhdXRvcGxheScpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICghc3dpcGVyLmlzRW5kKSB7XHJcbiAgICAgICAgICAgIGF1dG9wbGF5UmVzdWx0ID0gc3dpcGVyLnNsaWRlTmV4dChzd2lwZXIucGFyYW1zLnNwZWVkLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgZW1pdCgnYXV0b3BsYXknKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuc3RvcE9uTGFzdFNsaWRlKSB7XHJcbiAgICAgICAgICAgIGF1dG9wbGF5UmVzdWx0ID0gc3dpcGVyLnNsaWRlVG8oMCwgc3dpcGVyLnBhcmFtcy5zcGVlZCwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGVtaXQoJ2F1dG9wbGF5Jyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdG9wKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSAmJiBzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcnVuKCk7ZWxzZSBpZiAoYXV0b3BsYXlSZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJ1bigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aW1lb3V0ICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmIChzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHN3aXBlci5hdXRvcGxheS5ydW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICBlbWl0KCdhdXRvcGxheVN0YXJ0Jyk7XHJcbiAgICAgICAgcnVuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKCFzd2lwZXIuYXV0b3BsYXkucnVubmluZykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGltZW91dCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcclxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIuYXV0b3BsYXkucnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGVtaXQoJ2F1dG9wbGF5U3RvcCcpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBwYXVzZShzcGVlZCkge1xyXG4gICAgICAgIGlmICghc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHJldHVybjtcclxuICAgICAgICBpZiAoc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChzcGVlZCA9PT0gMCB8fCAhc3dpcGVyLnBhcmFtcy5hdXRvcGxheS53YWl0Rm9yVHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgcnVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIFsndHJhbnNpdGlvbmVuZCcsICd3ZWJraXRUcmFuc2l0aW9uRW5kJ10uZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsWzBdLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uVHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uVmlzaWJpbGl0eUNoYW5nZSgpIHtcclxuICAgICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nICYmIHN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSB7XHJcbiAgICAgICAgICBwYXVzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnICYmIHN3aXBlci5hdXRvcGxheS5wYXVzZWQpIHtcclxuICAgICAgICAgIHJ1bigpO1xyXG4gICAgICAgICAgc3dpcGVyLmF1dG9wbGF5LnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25UcmFuc2l0aW9uRW5kKGUpIHtcclxuICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkIHx8ICFzd2lwZXIuJHdyYXBwZXJFbCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gc3dpcGVyLiR3cmFwcGVyRWxbMF0pIHJldHVybjtcclxuICAgICAgICBbJ3RyYW5zaXRpb25lbmQnLCAnd2Via2l0VHJhbnNpdGlvbkVuZCddLmZvckVhY2goZXZlbnQgPT4ge1xyXG4gICAgICAgICAgc3dpcGVyLiR3cmFwcGVyRWxbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgb25UcmFuc2l0aW9uRW5kKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzd2lwZXIuYXV0b3BsYXkucGF1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHtcclxuICAgICAgICAgIHN0b3AoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcnVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbk1vdXNlRW50ZXIoKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcclxuICAgICAgICAgIHN0b3AoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZW1pdCgnYXV0b3BsYXlQYXVzZScpO1xyXG4gICAgICAgICAgcGF1c2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFsndHJhbnNpdGlvbmVuZCcsICd3ZWJraXRUcmFuc2l0aW9uRW5kJ10uZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgICAgICBzd2lwZXIuJHdyYXBwZXJFbFswXS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvblRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbk1vdXNlTGVhdmUoKSB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXBlci5hdXRvcGxheS5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICBlbWl0KCdhdXRvcGxheVJlc3VtZScpO1xyXG4gICAgICAgIHJ1bigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBhdHRhY2hNb3VzZUV2ZW50cygpIHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5wYXVzZU9uTW91c2VFbnRlcikge1xyXG4gICAgICAgICAgc3dpcGVyLiRlbC5vbignbW91c2VlbnRlcicsIG9uTW91c2VFbnRlcik7XHJcbiAgICAgICAgICBzd2lwZXIuJGVsLm9uKCdtb3VzZWxlYXZlJywgb25Nb3VzZUxlYXZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRldGFjaE1vdXNlRXZlbnRzKCkge1xyXG4gICAgICAgIHN3aXBlci4kZWwub2ZmKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyKTtcclxuICAgICAgICBzd2lwZXIuJGVsLm9mZignbW91c2VsZWF2ZScsIG9uTW91c2VMZWF2ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9uKCdpbml0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuICAgICAgICAgIHN0YXJ0KCk7XHJcbiAgICAgICAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlKTtcclxuICAgICAgICAgIGF0dGFjaE1vdXNlRXZlbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgb24oJ2JlZm9yZVRyYW5zaXRpb25TdGFydCcsIChfcywgc3BlZWQsIGludGVybmFsKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSB7XHJcbiAgICAgICAgICBpZiAoaW50ZXJuYWwgfHwgIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcclxuICAgICAgICAgICAgc3dpcGVyLmF1dG9wbGF5LnBhdXNlKHNwZWVkKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0b3AoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2xpZGVyRmlyc3RNb3ZlJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChzd2lwZXIuYXV0b3BsYXkucnVubmluZykge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcclxuICAgICAgICAgICAgc3RvcCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGF1c2UoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbigndG91Y2hFbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuY3NzTW9kZSAmJiBzd2lwZXIuYXV0b3BsYXkucGF1c2VkICYmICFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uKSB7XHJcbiAgICAgICAgICBydW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICBkZXRhY2hNb3VzZUV2ZW50cygpO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHtcclxuICAgICAgICAgIHN0b3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlKTtcclxuICAgICAgfSk7XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLmF1dG9wbGF5LCB7XHJcbiAgICAgICAgcGF1c2UsXHJcbiAgICAgICAgcnVuLFxyXG4gICAgICAgIHN0YXJ0LFxyXG4gICAgICAgIHN0b3BcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gVGh1bWIoX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgdGh1bWJzOiB7XHJcbiAgICAgICAgICBzd2lwZXI6IG51bGwsXHJcbiAgICAgICAgICBtdWx0aXBsZUFjdGl2ZVRodW1iczogdHJ1ZSxcclxuICAgICAgICAgIGF1dG9TY3JvbGxPZmZzZXQ6IDAsXHJcbiAgICAgICAgICBzbGlkZVRodW1iQWN0aXZlQ2xhc3M6ICdzd2lwZXItc2xpZGUtdGh1bWItYWN0aXZlJyxcclxuICAgICAgICAgIHRodW1ic0NvbnRhaW5lckNsYXNzOiAnc3dpcGVyLXRodW1icydcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgbGV0IHN3aXBlckNyZWF0ZWQgPSBmYWxzZTtcclxuICAgICAgc3dpcGVyLnRodW1icyA9IHtcclxuICAgICAgICBzd2lwZXI6IG51bGxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uVGh1bWJDbGljaygpIHtcclxuICAgICAgICBjb25zdCB0aHVtYnNTd2lwZXIgPSBzd2lwZXIudGh1bWJzLnN3aXBlcjtcclxuICAgICAgICBpZiAoIXRodW1ic1N3aXBlciB8fCB0aHVtYnNTd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgY2xpY2tlZEluZGV4ID0gdGh1bWJzU3dpcGVyLmNsaWNrZWRJbmRleDtcclxuICAgICAgICBjb25zdCBjbGlja2VkU2xpZGUgPSB0aHVtYnNTd2lwZXIuY2xpY2tlZFNsaWRlO1xyXG4gICAgICAgIGlmIChjbGlja2VkU2xpZGUgJiYgJChjbGlja2VkU2xpZGUpLmhhc0NsYXNzKHN3aXBlci5wYXJhbXMudGh1bWJzLnNsaWRlVGh1bWJBY3RpdmVDbGFzcykpIHJldHVybjtcclxuICAgICAgICBpZiAodHlwZW9mIGNsaWNrZWRJbmRleCA9PT0gJ3VuZGVmaW5lZCcgfHwgY2xpY2tlZEluZGV4ID09PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHNsaWRlVG9JbmRleDtcclxuXHJcbiAgICAgICAgaWYgKHRodW1ic1N3aXBlci5wYXJhbXMubG9vcCkge1xyXG4gICAgICAgICAgc2xpZGVUb0luZGV4ID0gcGFyc2VJbnQoJCh0aHVtYnNTd2lwZXIuY2xpY2tlZFNsaWRlKS5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpLCAxMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNsaWRlVG9JbmRleCA9IGNsaWNrZWRJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucGFyYW1zLmxvb3ApIHtcclxuICAgICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBzd2lwZXIuYWN0aXZlSW5kZXg7XHJcblxyXG4gICAgICAgICAgaWYgKHN3aXBlci5zbGlkZXMuZXEoY3VycmVudEluZGV4KS5oYXNDbGFzcyhzd2lwZXIucGFyYW1zLnNsaWRlRHVwbGljYXRlQ2xhc3MpKSB7XHJcbiAgICAgICAgICAgIHN3aXBlci5sb29wRml4KCk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG5cclxuICAgICAgICAgICAgc3dpcGVyLl9jbGllbnRMZWZ0ID0gc3dpcGVyLiR3cmFwcGVyRWxbMF0uY2xpZW50TGVmdDtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gc3dpcGVyLmFjdGl2ZUluZGV4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IHByZXZJbmRleCA9IHN3aXBlci5zbGlkZXMuZXEoY3VycmVudEluZGV4KS5wcmV2QWxsKGBbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCIke3NsaWRlVG9JbmRleH1cIl1gKS5lcSgwKS5pbmRleCgpO1xyXG4gICAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gc3dpcGVyLnNsaWRlcy5lcShjdXJyZW50SW5kZXgpLm5leHRBbGwoYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c2xpZGVUb0luZGV4fVwiXWApLmVxKDApLmluZGV4KCk7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHByZXZJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHNsaWRlVG9JbmRleCA9IG5leHRJbmRleDtlbHNlIGlmICh0eXBlb2YgbmV4dEluZGV4ID09PSAndW5kZWZpbmVkJykgc2xpZGVUb0luZGV4ID0gcHJldkluZGV4O2Vsc2UgaWYgKG5leHRJbmRleCAtIGN1cnJlbnRJbmRleCA8IGN1cnJlbnRJbmRleCAtIHByZXZJbmRleCkgc2xpZGVUb0luZGV4ID0gbmV4dEluZGV4O2Vsc2Ugc2xpZGVUb0luZGV4ID0gcHJldkluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVyLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICB0aHVtYnM6IHRodW1ic1BhcmFtc1xyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICAgIGlmIChpbml0aWFsaXplZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBTd2lwZXJDbGFzcyA9IHN3aXBlci5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAgICAgaWYgKHRodW1ic1BhcmFtcy5zd2lwZXIgaW5zdGFuY2VvZiBTd2lwZXJDbGFzcykge1xyXG4gICAgICAgICAgc3dpcGVyLnRodW1icy5zd2lwZXIgPSB0aHVtYnNQYXJhbXMuc3dpcGVyO1xyXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIudGh1bWJzLnN3aXBlci5vcmlnaW5hbFBhcmFtcywge1xyXG4gICAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHN3aXBlci50aHVtYnMuc3dpcGVyLnBhcmFtcywge1xyXG4gICAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdCh0aHVtYnNQYXJhbXMuc3dpcGVyKSkge1xyXG4gICAgICAgICAgY29uc3QgdGh1bWJzU3dpcGVyUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGh1bWJzUGFyYW1zLnN3aXBlcik7XHJcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHRodW1ic1N3aXBlclBhcmFtcywge1xyXG4gICAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzd2lwZXIudGh1bWJzLnN3aXBlciA9IG5ldyBTd2lwZXJDbGFzcyh0aHVtYnNTd2lwZXJQYXJhbXMpO1xyXG4gICAgICAgICAgc3dpcGVyQ3JlYXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZXIudGh1bWJzLnN3aXBlci4kZWwuYWRkQ2xhc3Moc3dpcGVyLnBhcmFtcy50aHVtYnMudGh1bWJzQ29udGFpbmVyQ2xhc3MpO1xyXG4gICAgICAgIHN3aXBlci50aHVtYnMuc3dpcGVyLm9uKCd0YXAnLCBvblRodW1iQ2xpY2spO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGUoaW5pdGlhbCkge1xyXG4gICAgICAgIGNvbnN0IHRodW1ic1N3aXBlciA9IHN3aXBlci50aHVtYnMuc3dpcGVyO1xyXG4gICAgICAgIGlmICghdGh1bWJzU3dpcGVyIHx8IHRodW1ic1N3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcclxuICAgICAgICBjb25zdCBzbGlkZXNQZXJWaWV3ID0gdGh1bWJzU3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgPyB0aHVtYnNTd2lwZXIuc2xpZGVzUGVyVmlld0R5bmFtaWMoKSA6IHRodW1ic1N3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldztcclxuICAgICAgICBjb25zdCBhdXRvU2Nyb2xsT2Zmc2V0ID0gc3dpcGVyLnBhcmFtcy50aHVtYnMuYXV0b1Njcm9sbE9mZnNldDtcclxuICAgICAgICBjb25zdCB1c2VPZmZzZXQgPSBhdXRvU2Nyb2xsT2Zmc2V0ICYmICF0aHVtYnNTd2lwZXIucGFyYW1zLmxvb3A7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXIucmVhbEluZGV4ICE9PSB0aHVtYnNTd2lwZXIucmVhbEluZGV4IHx8IHVzZU9mZnNldCkge1xyXG4gICAgICAgICAgbGV0IGN1cnJlbnRUaHVtYnNJbmRleCA9IHRodW1ic1N3aXBlci5hY3RpdmVJbmRleDtcclxuICAgICAgICAgIGxldCBuZXdUaHVtYnNJbmRleDtcclxuICAgICAgICAgIGxldCBkaXJlY3Rpb247XHJcblxyXG4gICAgICAgICAgaWYgKHRodW1ic1N3aXBlci5wYXJhbXMubG9vcCkge1xyXG4gICAgICAgICAgICBpZiAodGh1bWJzU3dpcGVyLnNsaWRlcy5lcShjdXJyZW50VGh1bWJzSW5kZXgpLmhhc0NsYXNzKHRodW1ic1N3aXBlci5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpIHtcclxuICAgICAgICAgICAgICB0aHVtYnNTd2lwZXIubG9vcEZpeCgpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuXHJcbiAgICAgICAgICAgICAgdGh1bWJzU3dpcGVyLl9jbGllbnRMZWZ0ID0gdGh1bWJzU3dpcGVyLiR3cmFwcGVyRWxbMF0uY2xpZW50TGVmdDtcclxuICAgICAgICAgICAgICBjdXJyZW50VGh1bWJzSW5kZXggPSB0aHVtYnNTd2lwZXIuYWN0aXZlSW5kZXg7XHJcbiAgICAgICAgICAgIH0gLy8gRmluZCBhY3R1YWwgdGh1bWJzIGluZGV4IHRvIHNsaWRlIHRvXHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJldlRodW1ic0luZGV4ID0gdGh1bWJzU3dpcGVyLnNsaWRlcy5lcShjdXJyZW50VGh1bWJzSW5kZXgpLnByZXZBbGwoYFtkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIiR7c3dpcGVyLnJlYWxJbmRleH1cIl1gKS5lcSgwKS5pbmRleCgpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0VGh1bWJzSW5kZXggPSB0aHVtYnNTd2lwZXIuc2xpZGVzLmVxKGN1cnJlbnRUaHVtYnNJbmRleCkubmV4dEFsbChgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzd2lwZXIucmVhbEluZGV4fVwiXWApLmVxKDApLmluZGV4KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHByZXZUaHVtYnNJbmRleCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IG5leHRUaHVtYnNJbmRleDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbmV4dFRodW1ic0luZGV4ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgIG5ld1RodW1ic0luZGV4ID0gcHJldlRodW1ic0luZGV4O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5leHRUaHVtYnNJbmRleCAtIGN1cnJlbnRUaHVtYnNJbmRleCA9PT0gY3VycmVudFRodW1ic0luZGV4IC0gcHJldlRodW1ic0luZGV4KSB7XHJcbiAgICAgICAgICAgICAgbmV3VGh1bWJzSW5kZXggPSB0aHVtYnNTd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwID4gMSA/IG5leHRUaHVtYnNJbmRleCA6IGN1cnJlbnRUaHVtYnNJbmRleDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXh0VGh1bWJzSW5kZXggLSBjdXJyZW50VGh1bWJzSW5kZXggPCBjdXJyZW50VGh1bWJzSW5kZXggLSBwcmV2VGh1bWJzSW5kZXgpIHtcclxuICAgICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IG5leHRUaHVtYnNJbmRleDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IHByZXZUaHVtYnNJbmRleDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gc3dpcGVyLmFjdGl2ZUluZGV4ID4gc3dpcGVyLnByZXZpb3VzSW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IHN3aXBlci5yZWFsSW5kZXg7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IG5ld1RodW1ic0luZGV4ID4gc3dpcGVyLnByZXZpb3VzSW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHVzZU9mZnNldCkge1xyXG4gICAgICAgICAgICBuZXdUaHVtYnNJbmRleCArPSBkaXJlY3Rpb24gPT09ICduZXh0JyA/IGF1dG9TY3JvbGxPZmZzZXQgOiAtMSAqIGF1dG9TY3JvbGxPZmZzZXQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRodW1ic1N3aXBlci52aXNpYmxlU2xpZGVzSW5kZXhlcyAmJiB0aHVtYnNTd2lwZXIudmlzaWJsZVNsaWRlc0luZGV4ZXMuaW5kZXhPZihuZXdUaHVtYnNJbmRleCkgPCAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aHVtYnNTd2lwZXIucGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKG5ld1RodW1ic0luZGV4ID4gY3VycmVudFRodW1ic0luZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IG5ld1RodW1ic0luZGV4IC0gTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgKyAxO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUaHVtYnNJbmRleCA9IG5ld1RodW1ic0luZGV4ICsgTWF0aC5mbG9vcihzbGlkZXNQZXJWaWV3IC8gMikgLSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdUaHVtYnNJbmRleCA+IGN1cnJlbnRUaHVtYnNJbmRleCAmJiB0aHVtYnNTd2lwZXIucGFyYW1zLnNsaWRlc1Blckdyb3VwID09PSAxKSA7XHJcblxyXG4gICAgICAgICAgICB0aHVtYnNTd2lwZXIuc2xpZGVUbyhuZXdUaHVtYnNJbmRleCwgaW5pdGlhbCA/IDAgOiB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gQWN0aXZhdGUgdGh1bWJzXHJcblxyXG5cclxuICAgICAgICBsZXQgdGh1bWJzVG9BY3RpdmF0ZSA9IDE7XHJcbiAgICAgICAgY29uc3QgdGh1bWJBY3RpdmVDbGFzcyA9IHN3aXBlci5wYXJhbXMudGh1bWJzLnNsaWRlVGh1bWJBY3RpdmVDbGFzcztcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEgJiYgIXN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcclxuICAgICAgICAgIHRodW1ic1RvQWN0aXZhdGUgPSBzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5wYXJhbXMudGh1bWJzLm11bHRpcGxlQWN0aXZlVGh1bWJzKSB7XHJcbiAgICAgICAgICB0aHVtYnNUb0FjdGl2YXRlID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRodW1ic1RvQWN0aXZhdGUgPSBNYXRoLmZsb29yKHRodW1ic1RvQWN0aXZhdGUpO1xyXG4gICAgICAgIHRodW1ic1N3aXBlci5zbGlkZXMucmVtb3ZlQ2xhc3ModGh1bWJBY3RpdmVDbGFzcyk7XHJcblxyXG4gICAgICAgIGlmICh0aHVtYnNTd2lwZXIucGFyYW1zLmxvb3AgfHwgdGh1bWJzU3dpcGVyLnBhcmFtcy52aXJ0dWFsICYmIHRodW1ic1N3aXBlci5wYXJhbXMudmlydHVhbC5lbmFibGVkKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRodW1ic1RvQWN0aXZhdGU7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICB0aHVtYnNTd2lwZXIuJHdyYXBwZXJFbC5jaGlsZHJlbihgW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzd2lwZXIucmVhbEluZGV4ICsgaX1cIl1gKS5hZGRDbGFzcyh0aHVtYkFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aHVtYnNUb0FjdGl2YXRlOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgdGh1bWJzU3dpcGVyLnNsaWRlcy5lcShzd2lwZXIucmVhbEluZGV4ICsgaSkuYWRkQ2xhc3ModGh1bWJBY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICB0aHVtYnNcclxuICAgICAgICB9ID0gc3dpcGVyLnBhcmFtcztcclxuICAgICAgICBpZiAoIXRodW1icyB8fCAhdGh1bWJzLnN3aXBlcikgcmV0dXJuO1xyXG4gICAgICAgIGluaXQoKTtcclxuICAgICAgICB1cGRhdGUodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignc2xpZGVDaGFuZ2UgdXBkYXRlIHJlc2l6ZSBvYnNlcnZlclVwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG9uKCdzZXRUcmFuc2l0aW9uJywgKF9zLCBkdXJhdGlvbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRodW1ic1N3aXBlciA9IHN3aXBlci50aHVtYnMuc3dpcGVyO1xyXG4gICAgICAgIGlmICghdGh1bWJzU3dpcGVyIHx8IHRodW1ic1N3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcclxuICAgICAgICB0aHVtYnNTd2lwZXIuc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBvbignYmVmb3JlRGVzdHJveScsICgpID0+IHtcclxuICAgICAgICBjb25zdCB0aHVtYnNTd2lwZXIgPSBzd2lwZXIudGh1bWJzLnN3aXBlcjtcclxuICAgICAgICBpZiAoIXRodW1ic1N3aXBlciB8fCB0aHVtYnNTd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChzd2lwZXJDcmVhdGVkKSB7XHJcbiAgICAgICAgICB0aHVtYnNTd2lwZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLnRodW1icywge1xyXG4gICAgICAgIGluaXQsXHJcbiAgICAgICAgdXBkYXRlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZyZWVNb2RlKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIGVtaXQsXHJcbiAgICAgICAgb25jZVxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBmcmVlTW9kZToge1xyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICBtb21lbnR1bTogdHJ1ZSxcclxuICAgICAgICAgIG1vbWVudHVtUmF0aW86IDEsXHJcbiAgICAgICAgICBtb21lbnR1bUJvdW5jZTogdHJ1ZSxcclxuICAgICAgICAgIG1vbWVudHVtQm91bmNlUmF0aW86IDEsXHJcbiAgICAgICAgICBtb21lbnR1bVZlbG9jaXR5UmF0aW86IDEsXHJcbiAgICAgICAgICBzdGlja3k6IGZhbHNlLFxyXG4gICAgICAgICAgbWluaW11bVZlbG9jaXR5OiAwLjAyXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcclxuICAgICAgICBjb25zdCB0cmFuc2xhdGUgPSBzd2lwZXIuZ2V0VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xyXG4gICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKDApO1xyXG4gICAgICAgIHN3aXBlci50b3VjaEV2ZW50c0RhdGEudmVsb2NpdGllcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHN3aXBlci5mcmVlTW9kZS5vblRvdWNoRW5kKHtcclxuICAgICAgICAgIGN1cnJlbnRQb3M6IHN3aXBlci5ydGwgPyBzd2lwZXIudHJhbnNsYXRlIDogLXN3aXBlci50cmFuc2xhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgdG91Y2hFdmVudHNEYXRhOiBkYXRhLFxyXG4gICAgICAgICAgdG91Y2hlc1xyXG4gICAgICAgIH0gPSBzd2lwZXI7IC8vIFZlbG9jaXR5XHJcblxyXG4gICAgICAgIGlmIChkYXRhLnZlbG9jaXRpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBkYXRhLnZlbG9jaXRpZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0b3VjaGVzW3N3aXBlci5pc0hvcml6b250YWwoKSA/ICdzdGFydFgnIDogJ3N0YXJ0WSddLFxyXG4gICAgICAgICAgICB0aW1lOiBkYXRhLnRvdWNoU3RhcnRUaW1lXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRhdGEudmVsb2NpdGllcy5wdXNoKHtcclxuICAgICAgICAgIHBvc2l0aW9uOiB0b3VjaGVzW3N3aXBlci5pc0hvcml6b250YWwoKSA/ICdjdXJyZW50WCcgOiAnY3VycmVudFknXSxcclxuICAgICAgICAgIHRpbWU6IG5vdygpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uVG91Y2hFbmQoX3JlZjIpIHtcclxuICAgICAgICBsZXQge1xyXG4gICAgICAgICAgY3VycmVudFBvc1xyXG4gICAgICAgIH0gPSBfcmVmMjtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgICAkd3JhcHBlckVsLFxyXG4gICAgICAgICAgcnRsVHJhbnNsYXRlOiBydGwsXHJcbiAgICAgICAgICBzbmFwR3JpZCxcclxuICAgICAgICAgIHRvdWNoRXZlbnRzRGF0YTogZGF0YVxyXG4gICAgICAgIH0gPSBzd2lwZXI7IC8vIFRpbWUgZGlmZlxyXG5cclxuICAgICAgICBjb25zdCB0b3VjaEVuZFRpbWUgPSBub3coKTtcclxuICAgICAgICBjb25zdCB0aW1lRGlmZiA9IHRvdWNoRW5kVGltZSAtIGRhdGEudG91Y2hTdGFydFRpbWU7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UG9zIDwgLXN3aXBlci5taW5UcmFuc2xhdGUoKSkge1xyXG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLmFjdGl2ZUluZGV4KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UG9zID4gLXN3aXBlci5tYXhUcmFuc2xhdGUoKSkge1xyXG4gICAgICAgICAgaWYgKHN3aXBlci5zbGlkZXMubGVuZ3RoIDwgc25hcEdyaWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHNuYXBHcmlkLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8oc3dpcGVyLnNsaWRlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmZyZWVNb2RlLm1vbWVudHVtKSB7XHJcbiAgICAgICAgICBpZiAoZGF0YS52ZWxvY2l0aWVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdE1vdmVFdmVudCA9IGRhdGEudmVsb2NpdGllcy5wb3AoKTtcclxuICAgICAgICAgICAgY29uc3QgdmVsb2NpdHlFdmVudCA9IGRhdGEudmVsb2NpdGllcy5wb3AoKTtcclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBsYXN0TW92ZUV2ZW50LnBvc2l0aW9uIC0gdmVsb2NpdHlFdmVudC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IGxhc3RNb3ZlRXZlbnQudGltZSAtIHZlbG9jaXR5RXZlbnQudGltZTtcclxuICAgICAgICAgICAgc3dpcGVyLnZlbG9jaXR5ID0gZGlzdGFuY2UgLyB0aW1lO1xyXG4gICAgICAgICAgICBzd2lwZXIudmVsb2NpdHkgLz0gMjtcclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhzd2lwZXIudmVsb2NpdHkpIDwgcGFyYW1zLmZyZWVNb2RlLm1pbmltdW1WZWxvY2l0eSkge1xyXG4gICAgICAgICAgICAgIHN3aXBlci52ZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgICAgIH0gLy8gdGhpcyBpbXBsaWVzIHRoYXQgdGhlIHVzZXIgc3RvcHBlZCBtb3ZpbmcgYSBmaW5nZXIgdGhlbiByZWxlYXNlZC5cclxuICAgICAgICAgICAgLy8gVGhlcmUgd291bGQgYmUgbm8gZXZlbnRzIHdpdGggZGlzdGFuY2UgemVybywgc28gdGhlIGxhc3QgZXZlbnQgaXMgc3RhbGUuXHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRpbWUgPiAxNTAgfHwgbm93KCkgLSBsYXN0TW92ZUV2ZW50LnRpbWUgPiAzMDApIHtcclxuICAgICAgICAgICAgICBzd2lwZXIudmVsb2NpdHkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzd2lwZXIudmVsb2NpdHkgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHN3aXBlci52ZWxvY2l0eSAqPSBwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1WZWxvY2l0eVJhdGlvO1xyXG4gICAgICAgICAgZGF0YS52ZWxvY2l0aWVzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICBsZXQgbW9tZW50dW1EdXJhdGlvbiA9IDEwMDAgKiBwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1SYXRpbztcclxuICAgICAgICAgIGNvbnN0IG1vbWVudHVtRGlzdGFuY2UgPSBzd2lwZXIudmVsb2NpdHkgKiBtb21lbnR1bUR1cmF0aW9uO1xyXG4gICAgICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gc3dpcGVyLnRyYW5zbGF0ZSArIG1vbWVudHVtRGlzdGFuY2U7XHJcbiAgICAgICAgICBpZiAocnRsKSBuZXdQb3NpdGlvbiA9IC1uZXdQb3NpdGlvbjtcclxuICAgICAgICAgIGxldCBkb0JvdW5jZSA9IGZhbHNlO1xyXG4gICAgICAgICAgbGV0IGFmdGVyQm91bmNlUG9zaXRpb247XHJcbiAgICAgICAgICBjb25zdCBib3VuY2VBbW91bnQgPSBNYXRoLmFicyhzd2lwZXIudmVsb2NpdHkpICogMjAgKiBwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2VSYXRpbztcclxuICAgICAgICAgIGxldCBuZWVkc0xvb3BGaXg7XHJcblxyXG4gICAgICAgICAgaWYgKG5ld1Bvc2l0aW9uIDwgc3dpcGVyLm1heFRyYW5zbGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2UpIHtcclxuICAgICAgICAgICAgICBpZiAobmV3UG9zaXRpb24gKyBzd2lwZXIubWF4VHJhbnNsYXRlKCkgPCAtYm91bmNlQW1vdW50KSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHN3aXBlci5tYXhUcmFuc2xhdGUoKSAtIGJvdW5jZUFtb3VudDtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGFmdGVyQm91bmNlUG9zaXRpb24gPSBzd2lwZXIubWF4VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgICAgZG9Cb3VuY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGRhdGEuYWxsb3dNb21lbnR1bUJvdW5jZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBzd2lwZXIubWF4VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMubG9vcCAmJiBwYXJhbXMuY2VudGVyZWRTbGlkZXMpIG5lZWRzTG9vcEZpeCA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG5ld1Bvc2l0aW9uID4gc3dpcGVyLm1pblRyYW5zbGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2UpIHtcclxuICAgICAgICAgICAgICBpZiAobmV3UG9zaXRpb24gLSBzd2lwZXIubWluVHJhbnNsYXRlKCkgPiBib3VuY2VBbW91bnQpIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc3dpcGVyLm1pblRyYW5zbGF0ZSgpICsgYm91bmNlQW1vdW50O1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYWZ0ZXJCb3VuY2VQb3NpdGlvbiA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcclxuICAgICAgICAgICAgICBkb0JvdW5jZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgZGF0YS5hbGxvd01vbWVudHVtQm91bmNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHN3aXBlci5taW5UcmFuc2xhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5sb29wICYmIHBhcmFtcy5jZW50ZXJlZFNsaWRlcykgbmVlZHNMb29wRml4ID0gdHJ1ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xyXG4gICAgICAgICAgICBsZXQgbmV4dFNsaWRlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzbmFwR3JpZC5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgICAgICAgICAgIGlmIChzbmFwR3JpZFtqXSA+IC1uZXdQb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmV4dFNsaWRlID0gajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNuYXBHcmlkW25leHRTbGlkZV0gLSBuZXdQb3NpdGlvbikgPCBNYXRoLmFicyhzbmFwR3JpZFtuZXh0U2xpZGUgLSAxXSAtIG5ld1Bvc2l0aW9uKSB8fCBzd2lwZXIuc3dpcGVEaXJlY3Rpb24gPT09ICduZXh0Jykge1xyXG4gICAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gc25hcEdyaWRbbmV4dFNsaWRlXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHNuYXBHcmlkW25leHRTbGlkZSAtIDFdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXdQb3NpdGlvbiA9IC1uZXdQb3NpdGlvbjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAobmVlZHNMb29wRml4KSB7XHJcbiAgICAgICAgICAgIG9uY2UoJ3RyYW5zaXRpb25FbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLmxvb3BGaXgoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IC8vIEZpeCBkdXJhdGlvblxyXG5cclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnZlbG9jaXR5ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChydGwpIHtcclxuICAgICAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gTWF0aC5hYnMoKC1uZXdQb3NpdGlvbiAtIHN3aXBlci50cmFuc2xhdGUpIC8gc3dpcGVyLnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gTWF0aC5hYnMoKG5ld1Bvc2l0aW9uIC0gc3dpcGVyLnRyYW5zbGF0ZSkgLyBzd2lwZXIudmVsb2NpdHkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xyXG4gICAgICAgICAgICAgIC8vIElmIGZyZWVNb2RlLnN0aWNreSBpcyBhY3RpdmUgYW5kIHRoZSB1c2VyIGVuZHMgYSBzd2lwZSB3aXRoIGEgc2xvdy12ZWxvY2l0eVxyXG4gICAgICAgICAgICAgIC8vIGV2ZW50LCB0aGVuIGR1cmF0aW9ucyBjYW4gYmUgMjArIHNlY29uZHMgdG8gc2xpZGUgb25lIChvciB6ZXJvISkgc2xpZGVzLlxyXG4gICAgICAgICAgICAgIC8vIEl0J3MgZWFzeSB0byBzZWUgdGhpcyB3aGVuIHNpbXVsYXRpbmcgdG91Y2ggd2l0aCBtb3VzZSBldmVudHMuIFRvIGZpeCB0aGlzLFxyXG4gICAgICAgICAgICAgIC8vIGxpbWl0IHNpbmdsZS1zbGlkZSBzd2lwZXMgdG8gdGhlIGRlZmF1bHQgc2xpZGUgZHVyYXRpb24uIFRoaXMgYWxzbyBoYXMgdGhlXHJcbiAgICAgICAgICAgICAgLy8gbmljZSBzaWRlIGVmZmVjdCBvZiBtYXRjaGluZyBzbGlkZSBzcGVlZCBpZiB0aGUgdXNlciBzdG9wcGVkIG1vdmluZyBiZWZvcmVcclxuICAgICAgICAgICAgICAvLyBsaWZ0aW5nIGZpbmdlciBvciBtb3VzZSB2cy4gbW92aW5nIHNsb3dseSBiZWZvcmUgbGlmdGluZyB0aGUgZmluZ2VyL21vdXNlLlxyXG4gICAgICAgICAgICAgIC8vIEZvciBmYXN0ZXIgc3dpcGVzLCBhbHNvIGFwcGx5IGxpbWl0cyAoYWxiZWl0IGhpZ2hlciBvbmVzKS5cclxuICAgICAgICAgICAgICBjb25zdCBtb3ZlRGlzdGFuY2UgPSBNYXRoLmFicygocnRsID8gLW5ld1Bvc2l0aW9uIDogbmV3UG9zaXRpb24pIC0gc3dpcGVyLnRyYW5zbGF0ZSk7XHJcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNsaWRlU2l6ZSA9IHN3aXBlci5zbGlkZXNTaXplc0dyaWRbc3dpcGVyLmFjdGl2ZUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKG1vdmVEaXN0YW5jZSA8IGN1cnJlbnRTbGlkZVNpemUpIHtcclxuICAgICAgICAgICAgICAgIG1vbWVudHVtRHVyYXRpb24gPSBwYXJhbXMuc3BlZWQ7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChtb3ZlRGlzdGFuY2UgPCAyICogY3VycmVudFNsaWRlU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IHBhcmFtcy5zcGVlZCAqIDEuNTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IHBhcmFtcy5zcGVlZCAqIDIuNTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xyXG4gICAgICAgICAgICBzd2lwZXIuc2xpZGVUb0Nsb3Nlc3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChwYXJhbXMuZnJlZU1vZGUubW9tZW50dW1Cb3VuY2UgJiYgZG9Cb3VuY2UpIHtcclxuICAgICAgICAgICAgc3dpcGVyLnVwZGF0ZVByb2dyZXNzKGFmdGVyQm91bmNlUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihtb21lbnR1bUR1cmF0aW9uKTtcclxuICAgICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHN3aXBlci50cmFuc2l0aW9uU3RhcnQodHJ1ZSwgc3dpcGVyLnN3aXBlRGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICR3cmFwcGVyRWwudHJhbnNpdGlvbkVuZCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCB8fCAhZGF0YS5hbGxvd01vbWVudHVtQm91bmNlKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgZW1pdCgnbW9tZW50dW1Cb3VuY2UnKTtcclxuICAgICAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNpdGlvbihwYXJhbXMuc3BlZWQpO1xyXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dpcGVyLnNldFRyYW5zbGF0ZShhZnRlckJvdW5jZVBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyRWwudHJhbnNpdGlvbkVuZCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25FbmQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLnZlbG9jaXR5KSB7XHJcbiAgICAgICAgICAgIGVtaXQoJ19mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJyk7XHJcbiAgICAgICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHN3aXBlci5zZXRUcmFuc2l0aW9uKG1vbWVudHVtRHVyYXRpb24pO1xyXG4gICAgICAgICAgICBzd2lwZXIuc2V0VHJhbnNsYXRlKG5ld1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgc3dpcGVyLnRyYW5zaXRpb25TdGFydCh0cnVlLCBzd2lwZXIuc3dpcGVEaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzd2lwZXIuYW5pbWF0aW5nKSB7XHJcbiAgICAgICAgICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgJHdyYXBwZXJFbC50cmFuc2l0aW9uRW5kKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHN3aXBlci50cmFuc2l0aW9uRW5kKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3aXBlci51cGRhdGVQcm9ncmVzcyhuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XHJcbiAgICAgICAgICBzd2lwZXIudXBkYXRlU2xpZGVzQ2xhc3NlcygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmZyZWVNb2RlLnN0aWNreSkge1xyXG4gICAgICAgICAgc3dpcGVyLnNsaWRlVG9DbG9zZXN0KCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuZnJlZU1vZGUpIHtcclxuICAgICAgICAgIGVtaXQoJ19mcmVlTW9kZU5vTW9tZW50dW1SZWxlYXNlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXBhcmFtcy5mcmVlTW9kZS5tb21lbnR1bSB8fCB0aW1lRGlmZiA+PSBwYXJhbXMubG9uZ1N3aXBlc01zKSB7XHJcbiAgICAgICAgICBzd2lwZXIudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgICAgICAgIHN3aXBlci51cGRhdGVBY3RpdmVJbmRleCgpO1xyXG4gICAgICAgICAgc3dpcGVyLnVwZGF0ZVNsaWRlc0NsYXNzZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLCB7XHJcbiAgICAgICAgZnJlZU1vZGU6IHtcclxuICAgICAgICAgIG9uVG91Y2hTdGFydCxcclxuICAgICAgICAgIG9uVG91Y2hNb3ZlLFxyXG4gICAgICAgICAgb25Ub3VjaEVuZFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gR3JpZChfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGV4dGVuZFBhcmFtc1xyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICByb3dzOiAxLFxyXG4gICAgICAgICAgZmlsbDogJ2NvbHVtbidcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgc2xpZGVzTnVtYmVyRXZlblRvUm93cztcclxuICAgICAgbGV0IHNsaWRlc1BlclJvdztcclxuICAgICAgbGV0IG51bUZ1bGxDb2x1bW5zO1xyXG5cclxuICAgICAgY29uc3QgaW5pdFNsaWRlcyA9IHNsaWRlc0xlbmd0aCA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgc2xpZGVzUGVyVmlld1xyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHJvd3MsXHJcbiAgICAgICAgICBmaWxsXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXMuZ3JpZDtcclxuICAgICAgICBzbGlkZXNQZXJSb3cgPSBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzIC8gcm93cztcclxuICAgICAgICBudW1GdWxsQ29sdW1ucyA9IE1hdGguZmxvb3Ioc2xpZGVzTGVuZ3RoIC8gcm93cyk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmZsb29yKHNsaWRlc0xlbmd0aCAvIHJvd3MpID09PSBzbGlkZXNMZW5ndGggLyByb3dzKSB7XHJcbiAgICAgICAgICBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzID0gc2xpZGVzTGVuZ3RoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzID0gTWF0aC5jZWlsKHNsaWRlc0xlbmd0aCAvIHJvd3MpICogcm93cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzbGlkZXNQZXJWaWV3ICE9PSAnYXV0bycgJiYgZmlsbCA9PT0gJ3JvdycpIHtcclxuICAgICAgICAgIHNsaWRlc051bWJlckV2ZW5Ub1Jvd3MgPSBNYXRoLm1heChzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzLCBzbGlkZXNQZXJWaWV3ICogcm93cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgdXBkYXRlU2xpZGUgPSAoaSwgc2xpZGUsIHNsaWRlc0xlbmd0aCwgZ2V0RGlyZWN0aW9uTGFiZWwpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzbGlkZXNQZXJHcm91cCxcclxuICAgICAgICAgIHNwYWNlQmV0d2VlblxyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHJvd3MsXHJcbiAgICAgICAgICBmaWxsXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXMuZ3JpZDsgLy8gU2V0IHNsaWRlcyBvcmRlclxyXG5cclxuICAgICAgICBsZXQgbmV3U2xpZGVPcmRlckluZGV4O1xyXG4gICAgICAgIGxldCBjb2x1bW47XHJcbiAgICAgICAgbGV0IHJvdztcclxuXHJcbiAgICAgICAgaWYgKGZpbGwgPT09ICdyb3cnICYmIHNsaWRlc1Blckdyb3VwID4gMSkge1xyXG4gICAgICAgICAgY29uc3QgZ3JvdXBJbmRleCA9IE1hdGguZmxvb3IoaSAvIChzbGlkZXNQZXJHcm91cCAqIHJvd3MpKTtcclxuICAgICAgICAgIGNvbnN0IHNsaWRlSW5kZXhJbkdyb3VwID0gaSAtIHJvd3MgKiBzbGlkZXNQZXJHcm91cCAqIGdyb3VwSW5kZXg7XHJcbiAgICAgICAgICBjb25zdCBjb2x1bW5zSW5Hcm91cCA9IGdyb3VwSW5kZXggPT09IDAgPyBzbGlkZXNQZXJHcm91cCA6IE1hdGgubWluKE1hdGguY2VpbCgoc2xpZGVzTGVuZ3RoIC0gZ3JvdXBJbmRleCAqIHJvd3MgKiBzbGlkZXNQZXJHcm91cCkgLyByb3dzKSwgc2xpZGVzUGVyR3JvdXApO1xyXG4gICAgICAgICAgcm93ID0gTWF0aC5mbG9vcihzbGlkZUluZGV4SW5Hcm91cCAvIGNvbHVtbnNJbkdyb3VwKTtcclxuICAgICAgICAgIGNvbHVtbiA9IHNsaWRlSW5kZXhJbkdyb3VwIC0gcm93ICogY29sdW1uc0luR3JvdXAgKyBncm91cEluZGV4ICogc2xpZGVzUGVyR3JvdXA7XHJcbiAgICAgICAgICBuZXdTbGlkZU9yZGVySW5kZXggPSBjb2x1bW4gKyByb3cgKiBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzIC8gcm93cztcclxuICAgICAgICAgIHNsaWRlLmNzcyh7XHJcbiAgICAgICAgICAgICctd2Via2l0LW9yZGVyJzogbmV3U2xpZGVPcmRlckluZGV4LFxyXG4gICAgICAgICAgICBvcmRlcjogbmV3U2xpZGVPcmRlckluZGV4XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGZpbGwgPT09ICdjb2x1bW4nKSB7XHJcbiAgICAgICAgICBjb2x1bW4gPSBNYXRoLmZsb29yKGkgLyByb3dzKTtcclxuICAgICAgICAgIHJvdyA9IGkgLSBjb2x1bW4gKiByb3dzO1xyXG5cclxuICAgICAgICAgIGlmIChjb2x1bW4gPiBudW1GdWxsQ29sdW1ucyB8fCBjb2x1bW4gPT09IG51bUZ1bGxDb2x1bW5zICYmIHJvdyA9PT0gcm93cyAtIDEpIHtcclxuICAgICAgICAgICAgcm93ICs9IDE7XHJcblxyXG4gICAgICAgICAgICBpZiAocm93ID49IHJvd3MpIHtcclxuICAgICAgICAgICAgICByb3cgPSAwO1xyXG4gICAgICAgICAgICAgIGNvbHVtbiArPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJvdyA9IE1hdGguZmxvb3IoaSAvIHNsaWRlc1BlclJvdyk7XHJcbiAgICAgICAgICBjb2x1bW4gPSBpIC0gcm93ICogc2xpZGVzUGVyUm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2xpZGUuY3NzKGdldERpcmVjdGlvbkxhYmVsKCdtYXJnaW4tdG9wJyksIHJvdyAhPT0gMCA/IHNwYWNlQmV0d2VlbiAmJiBgJHtzcGFjZUJldHdlZW59cHhgIDogJycpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgdXBkYXRlV3JhcHBlclNpemUgPSAoc2xpZGVTaXplLCBzbmFwR3JpZCwgZ2V0RGlyZWN0aW9uTGFiZWwpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzcGFjZUJldHdlZW4sXHJcbiAgICAgICAgICBjZW50ZXJlZFNsaWRlcyxcclxuICAgICAgICAgIHJvdW5kTGVuZ3Roc1xyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHJvd3NcclxuICAgICAgICB9ID0gc3dpcGVyLnBhcmFtcy5ncmlkO1xyXG4gICAgICAgIHN3aXBlci52aXJ0dWFsU2l6ZSA9IChzbGlkZVNpemUgKyBzcGFjZUJldHdlZW4pICogc2xpZGVzTnVtYmVyRXZlblRvUm93cztcclxuICAgICAgICBzd2lwZXIudmlydHVhbFNpemUgPSBNYXRoLmNlaWwoc3dpcGVyLnZpcnR1YWxTaXplIC8gcm93cykgLSBzcGFjZUJldHdlZW47XHJcbiAgICAgICAgc3dpcGVyLiR3cmFwcGVyRWwuY3NzKHtcclxuICAgICAgICAgIFtnZXREaXJlY3Rpb25MYWJlbCgnd2lkdGgnKV06IGAke3N3aXBlci52aXJ0dWFsU2l6ZSArIHNwYWNlQmV0d2Vlbn1weGBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNlbnRlcmVkU2xpZGVzKSB7XHJcbiAgICAgICAgICBzbmFwR3JpZC5zcGxpY2UoMCwgc25hcEdyaWQubGVuZ3RoKTtcclxuICAgICAgICAgIGNvbnN0IG5ld1NsaWRlc0dyaWQgPSBbXTtcclxuXHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNuYXBHcmlkLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBzbGlkZXNHcmlkSXRlbSA9IHNuYXBHcmlkW2ldO1xyXG4gICAgICAgICAgICBpZiAocm91bmRMZW5ndGhzKSBzbGlkZXNHcmlkSXRlbSA9IE1hdGguZmxvb3Ioc2xpZGVzR3JpZEl0ZW0pO1xyXG4gICAgICAgICAgICBpZiAoc25hcEdyaWRbaV0gPCBzd2lwZXIudmlydHVhbFNpemUgKyBzbmFwR3JpZFswXSkgbmV3U2xpZGVzR3JpZC5wdXNoKHNsaWRlc0dyaWRJdGVtKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzbmFwR3JpZC5wdXNoKC4uLm5ld1NsaWRlc0dyaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN3aXBlci5ncmlkID0ge1xyXG4gICAgICAgIGluaXRTbGlkZXMsXHJcbiAgICAgICAgdXBkYXRlU2xpZGUsXHJcbiAgICAgICAgdXBkYXRlV3JhcHBlclNpemVcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRTbGlkZShzbGlkZXMpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgICR3cmFwcGVyRWwsXHJcbiAgICAgICAgcGFyYW1zXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBzbGlkZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAoc2xpZGVzW2ldKSAkd3JhcHBlckVsLmFwcGVuZChzbGlkZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkd3JhcHBlckVsLmFwcGVuZChzbGlkZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhcmFtcy5vYnNlcnZlcikge1xyXG4gICAgICAgIHN3aXBlci51cGRhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZXBlbmRTbGlkZShzbGlkZXMpIHtcclxuICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcztcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICAkd3JhcHBlckVsLFxyXG4gICAgICAgIGFjdGl2ZUluZGV4XHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBzd2lwZXIubG9vcERlc3Ryb3koKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXggKyAxO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBzbGlkZXMgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIHNsaWRlcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpZiAoc2xpZGVzW2ldKSAkd3JhcHBlckVsLnByZXBlbmQoc2xpZGVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXggKyBzbGlkZXMubGVuZ3RoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICR3cmFwcGVyRWwucHJlcGVuZChzbGlkZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBzd2lwZXIubG9vcENyZWF0ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhcmFtcy5vYnNlcnZlcikge1xyXG4gICAgICAgIHN3aXBlci51cGRhdGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpcGVyLnNsaWRlVG8obmV3QWN0aXZlSW5kZXgsIDAsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRTbGlkZShpbmRleCwgc2xpZGVzKSB7XHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXM7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICAkd3JhcHBlckVsLFxyXG4gICAgICAgIHBhcmFtcyxcclxuICAgICAgICBhY3RpdmVJbmRleFxyXG4gICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICBsZXQgYWN0aXZlSW5kZXhCdWZmZXIgPSBhY3RpdmVJbmRleDtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCkge1xyXG4gICAgICAgIGFjdGl2ZUluZGV4QnVmZmVyIC09IHN3aXBlci5sb29wZWRTbGlkZXM7XHJcbiAgICAgICAgc3dpcGVyLmxvb3BEZXN0cm95KCk7XHJcbiAgICAgICAgc3dpcGVyLnNsaWRlcyA9ICR3cmFwcGVyRWwuY2hpbGRyZW4oYC4ke3BhcmFtcy5zbGlkZUNsYXNzfWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBiYXNlTGVuZ3RoID0gc3dpcGVyLnNsaWRlcy5sZW5ndGg7XHJcblxyXG4gICAgICBpZiAoaW5kZXggPD0gMCkge1xyXG4gICAgICAgIHN3aXBlci5wcmVwZW5kU2xpZGUoc2xpZGVzKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSBiYXNlTGVuZ3RoKSB7XHJcbiAgICAgICAgc3dpcGVyLmFwcGVuZFNsaWRlKHNsaWRlcyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleEJ1ZmZlciA+IGluZGV4ID8gYWN0aXZlSW5kZXhCdWZmZXIgKyAxIDogYWN0aXZlSW5kZXhCdWZmZXI7XHJcbiAgICAgIGNvbnN0IHNsaWRlc0J1ZmZlciA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IGJhc2VMZW5ndGggLSAxOyBpID49IGluZGV4OyBpIC09IDEpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBzd2lwZXIuc2xpZGVzLmVxKGkpO1xyXG4gICAgICAgIGN1cnJlbnRTbGlkZS5yZW1vdmUoKTtcclxuICAgICAgICBzbGlkZXNCdWZmZXIudW5zaGlmdChjdXJyZW50U2xpZGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHNsaWRlcyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gc2xpZGVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGlmIChzbGlkZXNbaV0pICR3cmFwcGVyRWwuYXBwZW5kKHNsaWRlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdBY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4QnVmZmVyID4gaW5kZXggPyBhY3RpdmVJbmRleEJ1ZmZlciArIHNsaWRlcy5sZW5ndGggOiBhY3RpdmVJbmRleEJ1ZmZlcjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkd3JhcHBlckVsLmFwcGVuZChzbGlkZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlc0J1ZmZlci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICR3cmFwcGVyRWwuYXBwZW5kKHNsaWRlc0J1ZmZlcltpXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCkge1xyXG4gICAgICAgIHN3aXBlci5sb29wQ3JlYXRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcGFyYW1zLm9ic2VydmVyKSB7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCArIHN3aXBlci5sb29wZWRTbGlkZXMsIDAsIGZhbHNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCwgMCwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlU2xpZGUoc2xpZGVzSW5kZXhlcykge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgICR3cmFwcGVyRWwsXHJcbiAgICAgICAgYWN0aXZlSW5kZXhcclxuICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgbGV0IGFjdGl2ZUluZGV4QnVmZmVyID0gYWN0aXZlSW5kZXg7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBhY3RpdmVJbmRleEJ1ZmZlciAtPSBzd2lwZXIubG9vcGVkU2xpZGVzO1xyXG4gICAgICAgIHN3aXBlci5sb29wRGVzdHJveSgpO1xyXG4gICAgICAgIHN3aXBlci5zbGlkZXMgPSAkd3JhcHBlckVsLmNoaWxkcmVuKGAuJHtwYXJhbXMuc2xpZGVDbGFzc31gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXhCdWZmZXI7XHJcbiAgICAgIGxldCBpbmRleFRvUmVtb3ZlO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBzbGlkZXNJbmRleGVzID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBzbGlkZXNJbmRleGVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXNJbmRleGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gc2xpZGVzSW5kZXhlc1tpXTtcclxuICAgICAgICAgIGlmIChzd2lwZXIuc2xpZGVzW2luZGV4VG9SZW1vdmVdKSBzd2lwZXIuc2xpZGVzLmVxKGluZGV4VG9SZW1vdmUpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgaWYgKGluZGV4VG9SZW1vdmUgPCBuZXdBY3RpdmVJbmRleCkgbmV3QWN0aXZlSW5kZXggLT0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld0FjdGl2ZUluZGV4ID0gTWF0aC5tYXgobmV3QWN0aXZlSW5kZXgsIDApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZGV4VG9SZW1vdmUgPSBzbGlkZXNJbmRleGVzO1xyXG4gICAgICAgIGlmIChzd2lwZXIuc2xpZGVzW2luZGV4VG9SZW1vdmVdKSBzd2lwZXIuc2xpZGVzLmVxKGluZGV4VG9SZW1vdmUpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChpbmRleFRvUmVtb3ZlIDwgbmV3QWN0aXZlSW5kZXgpIG5ld0FjdGl2ZUluZGV4IC09IDE7XHJcbiAgICAgICAgbmV3QWN0aXZlSW5kZXggPSBNYXRoLm1heChuZXdBY3RpdmVJbmRleCwgMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMubG9vcCkge1xyXG4gICAgICAgIHN3aXBlci5sb29wQ3JlYXRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcGFyYW1zLm9ic2VydmVyKSB7XHJcbiAgICAgICAgc3dpcGVyLnVwZGF0ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmxvb3ApIHtcclxuICAgICAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCArIHN3aXBlci5sb29wZWRTbGlkZXMsIDAsIGZhbHNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2lwZXIuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCwgMCwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlQWxsU2xpZGVzKCkge1xyXG4gICAgICBjb25zdCBzd2lwZXIgPSB0aGlzO1xyXG4gICAgICBjb25zdCBzbGlkZXNJbmRleGVzID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN3aXBlci5zbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBzbGlkZXNJbmRleGVzLnB1c2goaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXBlci5yZW1vdmVTbGlkZShzbGlkZXNJbmRleGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBNYW5pcHVsYXRpb24oX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlclxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIsIHtcclxuICAgICAgICBhcHBlbmRTbGlkZTogYXBwZW5kU2xpZGUuYmluZChzd2lwZXIpLFxyXG4gICAgICAgIHByZXBlbmRTbGlkZTogcHJlcGVuZFNsaWRlLmJpbmQoc3dpcGVyKSxcclxuICAgICAgICBhZGRTbGlkZTogYWRkU2xpZGUuYmluZChzd2lwZXIpLFxyXG4gICAgICAgIHJlbW92ZVNsaWRlOiByZW1vdmVTbGlkZS5iaW5kKHN3aXBlciksXHJcbiAgICAgICAgcmVtb3ZlQWxsU2xpZGVzOiByZW1vdmVBbGxTbGlkZXMuYmluZChzd2lwZXIpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVmZmVjdEluaXQocGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBlZmZlY3QsXHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIG9uLFxyXG4gICAgICAgIHNldFRyYW5zbGF0ZSxcclxuICAgICAgICBzZXRUcmFuc2l0aW9uLFxyXG4gICAgICAgIG92ZXJ3cml0ZVBhcmFtcyxcclxuICAgICAgICBwZXJzcGVjdGl2ZVxyXG4gICAgICB9ID0gcGFyYW1zO1xyXG4gICAgICBvbignYmVmb3JlSW5pdCcsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xyXG4gICAgICAgIHN3aXBlci5jbGFzc05hbWVzLnB1c2goYCR7c3dpcGVyLnBhcmFtcy5jb250YWluZXJNb2RpZmllckNsYXNzfSR7ZWZmZWN0fWApO1xyXG5cclxuICAgICAgICBpZiAocGVyc3BlY3RpdmUgJiYgcGVyc3BlY3RpdmUoKSkge1xyXG4gICAgICAgICAgc3dpcGVyLmNsYXNzTmFtZXMucHVzaChgJHtzd2lwZXIucGFyYW1zLmNvbnRhaW5lck1vZGlmaWVyQ2xhc3N9M2RgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG92ZXJ3cml0ZVBhcmFtc1Jlc3VsdCA9IG92ZXJ3cml0ZVBhcmFtcyA/IG92ZXJ3cml0ZVBhcmFtcygpIDoge307XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzd2lwZXIucGFyYW1zLCBvdmVyd3JpdGVQYXJhbXNSZXN1bHQpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3dpcGVyLm9yaWdpbmFsUGFyYW1zLCBvdmVyd3JpdGVQYXJhbXNSZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NldFRyYW5zbGF0ZScsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xyXG4gICAgICAgIHNldFRyYW5zbGF0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgb24oJ3NldFRyYW5zaXRpb24nLCAoX3MsIGR1cmF0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKHN3aXBlci5wYXJhbXMuZWZmZWN0ICE9PSBlZmZlY3QpIHJldHVybjtcclxuICAgICAgICBzZXRUcmFuc2l0aW9uKGR1cmF0aW9uKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGxldCByZXF1aXJlVXBkYXRlT25WaXJ0dWFsO1xyXG4gICAgICBvbigndmlydHVhbFVwZGF0ZScsICgpID0+IHtcclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5lZmZlY3QgIT09IGVmZmVjdCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoIXN3aXBlci5zbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICByZXF1aXJlVXBkYXRlT25WaXJ0dWFsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVxdWlyZVVwZGF0ZU9uVmlydHVhbCAmJiBzd2lwZXIuc2xpZGVzICYmIHN3aXBlci5zbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNldFRyYW5zbGF0ZSgpO1xyXG4gICAgICAgICAgICByZXF1aXJlVXBkYXRlT25WaXJ0dWFsID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVmZmVjdFRhcmdldChlZmZlY3RQYXJhbXMsICRzbGlkZUVsKSB7XHJcbiAgICAgIGlmIChlZmZlY3RQYXJhbXMudHJhbnNmb3JtRWwpIHtcclxuICAgICAgICByZXR1cm4gJHNsaWRlRWwuZmluZChlZmZlY3RQYXJhbXMudHJhbnNmb3JtRWwpLmNzcyh7XHJcbiAgICAgICAgICAnYmFja2ZhY2UtdmlzaWJpbGl0eSc6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgJy13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eSc6ICdoaWRkZW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkc2xpZGVFbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZChfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgIHRyYW5zZm9ybUVsLFxyXG4gICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIHNsaWRlcyxcclxuICAgICAgICBhY3RpdmVJbmRleCxcclxuICAgICAgICAkd3JhcHBlckVsXHJcbiAgICAgIH0gPSBzd2lwZXI7XHJcblxyXG4gICAgICBpZiAoc3dpcGVyLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlICYmIGR1cmF0aW9uICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50VHJpZ2dlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgbGV0ICR0cmFuc2l0aW9uRW5kVGFyZ2V0O1xyXG5cclxuICAgICAgICBpZiAoYWxsU2xpZGVzKSB7XHJcbiAgICAgICAgICAkdHJhbnNpdGlvbkVuZFRhcmdldCA9IHRyYW5zZm9ybUVsID8gc2xpZGVzLmZpbmQodHJhbnNmb3JtRWwpIDogc2xpZGVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkdHJhbnNpdGlvbkVuZFRhcmdldCA9IHRyYW5zZm9ybUVsID8gc2xpZGVzLmVxKGFjdGl2ZUluZGV4KS5maW5kKHRyYW5zZm9ybUVsKSA6IHNsaWRlcy5lcShhY3RpdmVJbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkdHJhbnNpdGlvbkVuZFRhcmdldC50cmFuc2l0aW9uRW5kKCgpID0+IHtcclxuICAgICAgICAgIGlmIChldmVudFRyaWdnZXJlZCkgcmV0dXJuO1xyXG4gICAgICAgICAgaWYgKCFzd2lwZXIgfHwgc3dpcGVyLmRlc3Ryb3llZCkgcmV0dXJuO1xyXG4gICAgICAgICAgZXZlbnRUcmlnZ2VyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgc3dpcGVyLmFuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgY29uc3QgdHJpZ2dlckV2ZW50cyA9IFsnd2Via2l0VHJhbnNpdGlvbkVuZCcsICd0cmFuc2l0aW9uZW5kJ107XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmlnZ2VyRXZlbnRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICR3cmFwcGVyRWwudHJpZ2dlcih0cmlnZ2VyRXZlbnRzW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEVmZmVjdEZhZGUoX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgZmFkZUVmZmVjdDoge1xyXG4gICAgICAgICAgY3Jvc3NGYWRlOiBmYWxzZSxcclxuICAgICAgICAgIHRyYW5zZm9ybUVsOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzbGlkZXNcclxuICAgICAgICB9ID0gc3dpcGVyO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHN3aXBlci5wYXJhbXMuZmFkZUVmZmVjdDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGNvbnN0ICRzbGlkZUVsID0gc3dpcGVyLnNsaWRlcy5lcShpKTtcclxuICAgICAgICAgIGNvbnN0IG9mZnNldCA9ICRzbGlkZUVsWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xyXG4gICAgICAgICAgbGV0IHR4ID0gLW9mZnNldDtcclxuICAgICAgICAgIGlmICghc3dpcGVyLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB0eCAtPSBzd2lwZXIudHJhbnNsYXRlO1xyXG4gICAgICAgICAgbGV0IHR5ID0gMDtcclxuXHJcbiAgICAgICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xyXG4gICAgICAgICAgICB0eSA9IHR4O1xyXG4gICAgICAgICAgICB0eCA9IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3Qgc2xpZGVPcGFjaXR5ID0gc3dpcGVyLnBhcmFtcy5mYWRlRWZmZWN0LmNyb3NzRmFkZSA/IE1hdGgubWF4KDEgLSBNYXRoLmFicygkc2xpZGVFbFswXS5wcm9ncmVzcyksIDApIDogMSArIE1hdGgubWluKE1hdGgubWF4KCRzbGlkZUVsWzBdLnByb2dyZXNzLCAtMSksIDApO1xyXG4gICAgICAgICAgY29uc3QgJHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgJHNsaWRlRWwpO1xyXG4gICAgICAgICAgJHRhcmdldEVsLmNzcyh7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IHNsaWRlT3BhY2l0eVxyXG4gICAgICAgICAgfSkudHJhbnNmb3JtKGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAwcHgpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm1FbFxyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zLmZhZGVFZmZlY3Q7XHJcbiAgICAgICAgY29uc3QgJHRyYW5zaXRpb25FbGVtZW50cyA9IHRyYW5zZm9ybUVsID8gc3dpcGVyLnNsaWRlcy5maW5kKHRyYW5zZm9ybUVsKSA6IHN3aXBlci5zbGlkZXM7XHJcbiAgICAgICAgJHRyYW5zaXRpb25FbGVtZW50cy50cmFuc2l0aW9uKGR1cmF0aW9uKTtcclxuICAgICAgICBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCh7XHJcbiAgICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgICBkdXJhdGlvbixcclxuICAgICAgICAgIHRyYW5zZm9ybUVsLFxyXG4gICAgICAgICAgYWxsU2xpZGVzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBlZmZlY3RJbml0KHtcclxuICAgICAgICBlZmZlY3Q6ICdmYWRlJyxcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgb24sXHJcbiAgICAgICAgc2V0VHJhbnNsYXRlLFxyXG4gICAgICAgIHNldFRyYW5zaXRpb24sXHJcbiAgICAgICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xyXG4gICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgICAgICAgIHNsaWRlc1Blckdyb3VwOiAxLFxyXG4gICAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcclxuICAgICAgICAgIHNwYWNlQmV0d2VlbjogMCxcclxuICAgICAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBFZmZlY3RDdWJlKF9yZWYpIHtcclxuICAgICAgbGV0IHtcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgZXh0ZW5kUGFyYW1zLFxyXG4gICAgICAgIG9uXHJcbiAgICAgIH0gPSBfcmVmO1xyXG4gICAgICBleHRlbmRQYXJhbXMoe1xyXG4gICAgICAgIGN1YmVFZmZlY3Q6IHtcclxuICAgICAgICAgIHNsaWRlU2hhZG93czogdHJ1ZSxcclxuICAgICAgICAgIHNoYWRvdzogdHJ1ZSxcclxuICAgICAgICAgIHNoYWRvd09mZnNldDogMjAsXHJcbiAgICAgICAgICBzaGFkb3dTY2FsZTogMC45NFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBzZXRUcmFuc2xhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgJGVsLFxyXG4gICAgICAgICAgJHdyYXBwZXJFbCxcclxuICAgICAgICAgIHNsaWRlcyxcclxuICAgICAgICAgIHdpZHRoOiBzd2lwZXJXaWR0aCxcclxuICAgICAgICAgIGhlaWdodDogc3dpcGVySGVpZ2h0LFxyXG4gICAgICAgICAgcnRsVHJhbnNsYXRlOiBydGwsXHJcbiAgICAgICAgICBzaXplOiBzd2lwZXJTaXplLFxyXG4gICAgICAgICAgYnJvd3NlclxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5jdWJlRWZmZWN0O1xyXG4gICAgICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHN3aXBlci5pc0hvcml6b250YWwoKTtcclxuICAgICAgICBjb25zdCBpc1ZpcnR1YWwgPSBzd2lwZXIudmlydHVhbCAmJiBzd2lwZXIucGFyYW1zLnZpcnR1YWwuZW5hYmxlZDtcclxuICAgICAgICBsZXQgd3JhcHBlclJvdGF0ZSA9IDA7XHJcbiAgICAgICAgbGV0ICRjdWJlU2hhZG93RWw7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuc2hhZG93KSB7XHJcbiAgICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgICRjdWJlU2hhZG93RWwgPSAkd3JhcHBlckVsLmZpbmQoJy5zd2lwZXItY3ViZS1zaGFkb3cnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkY3ViZVNoYWRvd0VsLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICRjdWJlU2hhZG93RWwgPSAkKCc8ZGl2IGNsYXNzPVwic3dpcGVyLWN1YmUtc2hhZG93XCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgJHdyYXBwZXJFbC5hcHBlbmQoJGN1YmVTaGFkb3dFbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRjdWJlU2hhZG93RWwuY3NzKHtcclxuICAgICAgICAgICAgICBoZWlnaHQ6IGAke3N3aXBlcldpZHRofXB4YFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRjdWJlU2hhZG93RWwgPSAkZWwuZmluZCgnLnN3aXBlci1jdWJlLXNoYWRvdycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRjdWJlU2hhZG93RWwubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgJGN1YmVTaGFkb3dFbCA9ICQoJzxkaXYgY2xhc3M9XCJzd2lwZXItY3ViZS1zaGFkb3dcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAkZWwuYXBwZW5kKCRjdWJlU2hhZG93RWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgY29uc3QgJHNsaWRlRWwgPSBzbGlkZXMuZXEoaSk7XHJcbiAgICAgICAgICBsZXQgc2xpZGVJbmRleCA9IGk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzVmlydHVhbCkge1xyXG4gICAgICAgICAgICBzbGlkZUluZGV4ID0gcGFyc2VJbnQoJHNsaWRlRWwuYXR0cignZGF0YS1zd2lwZXItc2xpZGUtaW5kZXgnKSwgMTApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBzbGlkZUFuZ2xlID0gc2xpZGVJbmRleCAqIDkwO1xyXG4gICAgICAgICAgbGV0IHJvdW5kID0gTWF0aC5mbG9vcihzbGlkZUFuZ2xlIC8gMzYwKTtcclxuXHJcbiAgICAgICAgICBpZiAocnRsKSB7XHJcbiAgICAgICAgICAgIHNsaWRlQW5nbGUgPSAtc2xpZGVBbmdsZTtcclxuICAgICAgICAgICAgcm91bmQgPSBNYXRoLmZsb29yKC1zbGlkZUFuZ2xlIC8gMzYwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWF4KE1hdGgubWluKCRzbGlkZUVsWzBdLnByb2dyZXNzLCAxKSwgLTEpO1xyXG4gICAgICAgICAgbGV0IHR4ID0gMDtcclxuICAgICAgICAgIGxldCB0eSA9IDA7XHJcbiAgICAgICAgICBsZXQgdHogPSAwO1xyXG5cclxuICAgICAgICAgIGlmIChzbGlkZUluZGV4ICUgNCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0eCA9IC1yb3VuZCAqIDQgKiBzd2lwZXJTaXplO1xyXG4gICAgICAgICAgICB0eiA9IDA7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKChzbGlkZUluZGV4IC0gMSkgJSA0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHR4ID0gMDtcclxuICAgICAgICAgICAgdHogPSAtcm91bmQgKiA0ICogc3dpcGVyU2l6ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoKHNsaWRlSW5kZXggLSAyKSAlIDQgPT09IDApIHtcclxuICAgICAgICAgICAgdHggPSBzd2lwZXJTaXplICsgcm91bmQgKiA0ICogc3dpcGVyU2l6ZTtcclxuICAgICAgICAgICAgdHogPSBzd2lwZXJTaXplO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICgoc2xpZGVJbmRleCAtIDMpICUgNCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0eCA9IC1zd2lwZXJTaXplO1xyXG4gICAgICAgICAgICB0eiA9IDMgKiBzd2lwZXJTaXplICsgc3dpcGVyU2l6ZSAqIDQgKiByb3VuZDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAocnRsKSB7XHJcbiAgICAgICAgICAgIHR4ID0gLXR4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgIHR5ID0gdHg7XHJcbiAgICAgICAgICAgIHR4ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgcm90YXRlWCgke2lzSG9yaXpvbnRhbCA/IDAgOiAtc2xpZGVBbmdsZX1kZWcpIHJvdGF0ZVkoJHtpc0hvcml6b250YWwgPyBzbGlkZUFuZ2xlIDogMH1kZWcpIHRyYW5zbGF0ZTNkKCR7dHh9cHgsICR7dHl9cHgsICR7dHp9cHgpYDtcclxuXHJcbiAgICAgICAgICBpZiAocHJvZ3Jlc3MgPD0gMSAmJiBwcm9ncmVzcyA+IC0xKSB7XHJcbiAgICAgICAgICAgIHdyYXBwZXJSb3RhdGUgPSBzbGlkZUluZGV4ICogOTAgKyBwcm9ncmVzcyAqIDkwO1xyXG4gICAgICAgICAgICBpZiAocnRsKSB3cmFwcGVyUm90YXRlID0gLXNsaWRlSW5kZXggKiA5MCAtIHByb2dyZXNzICogOTA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJHNsaWRlRWwudHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcblxyXG4gICAgICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcclxuICAgICAgICAgICAgLy8gU2V0IHNoYWRvd3NcclxuICAgICAgICAgICAgbGV0IHNoYWRvd0JlZm9yZSA9IGlzSG9yaXpvbnRhbCA/ICRzbGlkZUVsLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQnKSA6ICRzbGlkZUVsLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCcpO1xyXG4gICAgICAgICAgICBsZXQgc2hhZG93QWZ0ZXIgPSBpc0hvcml6b250YWwgPyAkc2xpZGVFbC5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCcpIDogJHNsaWRlRWwuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhZG93QmVmb3JlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIHNoYWRvd0JlZm9yZSA9ICQoYDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGUtc2hhZG93LSR7aXNIb3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCd9XCI+PC9kaXY+YCk7XHJcbiAgICAgICAgICAgICAgJHNsaWRlRWwuYXBwZW5kKHNoYWRvd0JlZm9yZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFkb3dBZnRlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICBzaGFkb3dBZnRlciA9ICQoYDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGUtc2hhZG93LSR7aXNIb3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nfVwiPjwvZGl2PmApO1xyXG4gICAgICAgICAgICAgICRzbGlkZUVsLmFwcGVuZChzaGFkb3dBZnRlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFkb3dCZWZvcmUubGVuZ3RoKSBzaGFkb3dCZWZvcmVbMF0uc3R5bGUub3BhY2l0eSA9IE1hdGgubWF4KC1wcm9ncmVzcywgMCk7XHJcbiAgICAgICAgICAgIGlmIChzaGFkb3dBZnRlci5sZW5ndGgpIHNoYWRvd0FmdGVyWzBdLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1heChwcm9ncmVzcywgMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkd3JhcHBlckVsLmNzcyh7XHJcbiAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJzogYDUwJSA1MCUgLSR7c3dpcGVyU2l6ZSAvIDJ9cHhgLFxyXG4gICAgICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiBgNTAlIDUwJSAtJHtzd2lwZXJTaXplIC8gMn1weGBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5zaGFkb3cpIHtcclxuICAgICAgICAgIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgICAgICAgICAgJGN1YmVTaGFkb3dFbC50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKDBweCwgJHtzd2lwZXJXaWR0aCAvIDIgKyBwYXJhbXMuc2hhZG93T2Zmc2V0fXB4LCAkey1zd2lwZXJXaWR0aCAvIDJ9cHgpIHJvdGF0ZVgoOTBkZWcpIHJvdGF0ZVooMGRlZykgc2NhbGUoJHtwYXJhbXMuc2hhZG93U2NhbGV9KWApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hhZG93QW5nbGUgPSBNYXRoLmFicyh3cmFwcGVyUm90YXRlKSAtIE1hdGguZmxvb3IoTWF0aC5hYnMod3JhcHBlclJvdGF0ZSkgLyA5MCkgKiA5MDtcclxuICAgICAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IDEuNSAtIChNYXRoLnNpbihzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIgKyBNYXRoLmNvcyhzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIpO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZTEgPSBwYXJhbXMuc2hhZG93U2NhbGU7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlMiA9IHBhcmFtcy5zaGFkb3dTY2FsZSAvIG11bHRpcGxpZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcmFtcy5zaGFkb3dPZmZzZXQ7XHJcbiAgICAgICAgICAgICRjdWJlU2hhZG93RWwudHJhbnNmb3JtKGBzY2FsZTNkKCR7c2NhbGUxfSwgMSwgJHtzY2FsZTJ9KSB0cmFuc2xhdGUzZCgwcHgsICR7c3dpcGVySGVpZ2h0IC8gMiArIG9mZnNldH1weCwgJHstc3dpcGVySGVpZ2h0IC8gMiAvIHNjYWxlMn1weCkgcm90YXRlWCgtOTBkZWcpYCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB6RmFjdG9yID0gYnJvd3Nlci5pc1NhZmFyaSB8fCBicm93c2VyLmlzV2ViVmlldyA/IC1zd2lwZXJTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgJHdyYXBwZXJFbC50cmFuc2Zvcm0oYHRyYW5zbGF0ZTNkKDBweCwwLCR7ekZhY3Rvcn1weCkgcm90YXRlWCgke3N3aXBlci5pc0hvcml6b250YWwoKSA/IDAgOiB3cmFwcGVyUm90YXRlfWRlZykgcm90YXRlWSgke3N3aXBlci5pc0hvcml6b250YWwoKSA/IC13cmFwcGVyUm90YXRlIDogMH1kZWcpYCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICRlbCxcclxuICAgICAgICAgIHNsaWRlc1xyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgc2xpZGVzLnRyYW5zaXRpb24oZHVyYXRpb24pLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsIC5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbSwgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpLnRyYW5zaXRpb24oZHVyYXRpb24pO1xyXG5cclxuICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jdWJlRWZmZWN0LnNoYWRvdyAmJiAhc3dpcGVyLmlzSG9yaXpvbnRhbCgpKSB7XHJcbiAgICAgICAgICAkZWwuZmluZCgnLnN3aXBlci1jdWJlLXNoYWRvdycpLnRyYW5zaXRpb24oZHVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGVmZmVjdEluaXQoe1xyXG4gICAgICAgIGVmZmVjdDogJ2N1YmUnLFxyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBvbixcclxuICAgICAgICBzZXRUcmFuc2xhdGUsXHJcbiAgICAgICAgc2V0VHJhbnNpdGlvbixcclxuICAgICAgICBwZXJzcGVjdGl2ZTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XHJcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gICAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDEsXHJcbiAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4gICAgICAgICAgcmVzaXN0YW5jZVJhdGlvOiAwLFxyXG4gICAgICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxyXG4gICAgICAgICAgY2VudGVyZWRTbGlkZXM6IGZhbHNlLFxyXG4gICAgICAgICAgdmlydHVhbFRyYW5zbGF0ZTogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVNoYWRvdyhwYXJhbXMsICRzbGlkZUVsLCBzaWRlKSB7XHJcbiAgICAgIGNvbnN0IHNoYWRvd0NsYXNzID0gYHN3aXBlci1zbGlkZS1zaGFkb3cke3NpZGUgPyBgLSR7c2lkZX1gIDogJyd9YDtcclxuICAgICAgY29uc3QgJHNoYWRvd0NvbnRhaW5lciA9IHBhcmFtcy50cmFuc2Zvcm1FbCA/ICRzbGlkZUVsLmZpbmQocGFyYW1zLnRyYW5zZm9ybUVsKSA6ICRzbGlkZUVsO1xyXG4gICAgICBsZXQgJHNoYWRvd0VsID0gJHNoYWRvd0NvbnRhaW5lci5jaGlsZHJlbihgLiR7c2hhZG93Q2xhc3N9YCk7XHJcblxyXG4gICAgICBpZiAoISRzaGFkb3dFbC5sZW5ndGgpIHtcclxuICAgICAgICAkc2hhZG93RWwgPSAkKGA8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlLXNoYWRvdyR7c2lkZSA/IGAtJHtzaWRlfWAgOiAnJ31cIj48L2Rpdj5gKTtcclxuICAgICAgICAkc2hhZG93Q29udGFpbmVyLmFwcGVuZCgkc2hhZG93RWwpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gJHNoYWRvd0VsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEVmZmVjdEZsaXAoX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgZmxpcEVmZmVjdDoge1xyXG4gICAgICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlLFxyXG4gICAgICAgICAgbGltaXRSb3RhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgIHRyYW5zZm9ybUVsOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgICBydGxUcmFuc2xhdGU6IHJ0bFxyXG4gICAgICAgIH0gPSBzd2lwZXI7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgY29uc3QgJHNsaWRlRWwgPSBzbGlkZXMuZXEoaSk7XHJcbiAgICAgICAgICBsZXQgcHJvZ3Jlc3MgPSAkc2xpZGVFbFswXS5wcm9ncmVzcztcclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5mbGlwRWZmZWN0LmxpbWl0Um90YXRpb24pIHtcclxuICAgICAgICAgICAgcHJvZ3Jlc3MgPSBNYXRoLm1heChNYXRoLm1pbigkc2xpZGVFbFswXS5wcm9ncmVzcywgMSksIC0xKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBvZmZzZXQgPSAkc2xpZGVFbFswXS5zd2lwZXJTbGlkZU9mZnNldDtcclxuICAgICAgICAgIGNvbnN0IHJvdGF0ZSA9IC0xODAgKiBwcm9ncmVzcztcclxuICAgICAgICAgIGxldCByb3RhdGVZID0gcm90YXRlO1xyXG4gICAgICAgICAgbGV0IHJvdGF0ZVggPSAwO1xyXG4gICAgICAgICAgbGV0IHR4ID0gc3dpcGVyLnBhcmFtcy5jc3NNb2RlID8gLW9mZnNldCAtIHN3aXBlci50cmFuc2xhdGUgOiAtb2Zmc2V0O1xyXG4gICAgICAgICAgbGV0IHR5ID0gMDtcclxuXHJcbiAgICAgICAgICBpZiAoIXN3aXBlci5pc0hvcml6b250YWwoKSkge1xyXG4gICAgICAgICAgICB0eSA9IHR4O1xyXG4gICAgICAgICAgICB0eCA9IDA7XHJcbiAgICAgICAgICAgIHJvdGF0ZVggPSAtcm90YXRlWTtcclxuICAgICAgICAgICAgcm90YXRlWSA9IDA7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHJ0bCkge1xyXG4gICAgICAgICAgICByb3RhdGVZID0gLXJvdGF0ZVk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJHNsaWRlRWxbMF0uc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQocHJvZ3Jlc3MpKSArIHNsaWRlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgaWYgKHBhcmFtcy5zbGlkZVNoYWRvd3MpIHtcclxuICAgICAgICAgICAgLy8gU2V0IHNoYWRvd3NcclxuICAgICAgICAgICAgbGV0IHNoYWRvd0JlZm9yZSA9IHN3aXBlci5pc0hvcml6b250YWwoKSA/ICRzbGlkZUVsLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQnKSA6ICRzbGlkZUVsLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCcpO1xyXG4gICAgICAgICAgICBsZXQgc2hhZG93QWZ0ZXIgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAkc2xpZGVFbC5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCcpIDogJHNsaWRlRWwuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhZG93QmVmb3JlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIHNoYWRvd0JlZm9yZSA9IGNyZWF0ZVNoYWRvdyhwYXJhbXMsICRzbGlkZUVsLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFkb3dBZnRlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICBzaGFkb3dBZnRlciA9IGNyZWF0ZVNoYWRvdyhwYXJhbXMsICRzbGlkZUVsLCBzd2lwZXIuaXNIb3Jpem9udGFsKCkgPyAncmlnaHQnIDogJ2JvdHRvbScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhZG93QmVmb3JlLmxlbmd0aCkgc2hhZG93QmVmb3JlWzBdLnN0eWxlLm9wYWNpdHkgPSBNYXRoLm1heCgtcHJvZ3Jlc3MsIDApO1xyXG4gICAgICAgICAgICBpZiAoc2hhZG93QWZ0ZXIubGVuZ3RoKSBzaGFkb3dBZnRlclswXS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgocHJvZ3Jlc3MsIDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAwcHgpIHJvdGF0ZVgoJHtyb3RhdGVYfWRlZykgcm90YXRlWSgke3JvdGF0ZVl9ZGVnKWA7XHJcbiAgICAgICAgICBjb25zdCAkdGFyZ2V0RWwgPSBlZmZlY3RUYXJnZXQocGFyYW1zLCAkc2xpZGVFbCk7XHJcbiAgICAgICAgICAkdGFyZ2V0RWwudHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3Qgc2V0VHJhbnNpdGlvbiA9IGR1cmF0aW9uID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm1FbFxyXG4gICAgICAgIH0gPSBzd2lwZXIucGFyYW1zLmZsaXBFZmZlY3Q7XHJcbiAgICAgICAgY29uc3QgJHRyYW5zaXRpb25FbGVtZW50cyA9IHRyYW5zZm9ybUVsID8gc3dpcGVyLnNsaWRlcy5maW5kKHRyYW5zZm9ybUVsKSA6IHN3aXBlci5zbGlkZXM7XHJcbiAgICAgICAgJHRyYW5zaXRpb25FbGVtZW50cy50cmFuc2l0aW9uKGR1cmF0aW9uKS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AsIC5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0LCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20sIC5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQnKS50cmFuc2l0aW9uKGR1cmF0aW9uKTtcclxuICAgICAgICBlZmZlY3RWaXJ0dWFsVHJhbnNpdGlvbkVuZCh7XHJcbiAgICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgICBkdXJhdGlvbixcclxuICAgICAgICAgIHRyYW5zZm9ybUVsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBlZmZlY3RJbml0KHtcclxuICAgICAgICBlZmZlY3Q6ICdmbGlwJyxcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgb24sXHJcbiAgICAgICAgc2V0VHJhbnNsYXRlLFxyXG4gICAgICAgIHNldFRyYW5zaXRpb24sXHJcbiAgICAgICAgcGVyc3BlY3RpdmU6ICgpID0+IHRydWUsXHJcbiAgICAgICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xyXG4gICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgICAgICAgIHNsaWRlc1Blckdyb3VwOiAxLFxyXG4gICAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcclxuICAgICAgICAgIHNwYWNlQmV0d2VlbjogMCxcclxuICAgICAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBFZmZlY3RDb3ZlcmZsb3coX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgY292ZXJmbG93RWZmZWN0OiB7XHJcbiAgICAgICAgICByb3RhdGU6IDUwLFxyXG4gICAgICAgICAgc3RyZXRjaDogMCxcclxuICAgICAgICAgIGRlcHRoOiAxMDAsXHJcbiAgICAgICAgICBzY2FsZTogMSxcclxuICAgICAgICAgIG1vZGlmaWVyOiAxLFxyXG4gICAgICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlLFxyXG4gICAgICAgICAgdHJhbnNmb3JtRWw6IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHdpZHRoOiBzd2lwZXJXaWR0aCxcclxuICAgICAgICAgIGhlaWdodDogc3dpcGVySGVpZ2h0LFxyXG4gICAgICAgICAgc2xpZGVzLFxyXG4gICAgICAgICAgc2xpZGVzU2l6ZXNHcmlkXHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNvdmVyZmxvd0VmZmVjdDtcclxuICAgICAgICBjb25zdCBpc0hvcml6b250YWwgPSBzd2lwZXIuaXNIb3Jpem9udGFsKCk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3dpcGVyLnRyYW5zbGF0ZTtcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBpc0hvcml6b250YWwgPyAtdHJhbnNmb3JtICsgc3dpcGVyV2lkdGggLyAyIDogLXRyYW5zZm9ybSArIHN3aXBlckhlaWdodCAvIDI7XHJcbiAgICAgICAgY29uc3Qgcm90YXRlID0gaXNIb3Jpem9udGFsID8gcGFyYW1zLnJvdGF0ZSA6IC1wYXJhbXMucm90YXRlO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IHBhcmFtcy5kZXB0aDsgLy8gRWFjaCBzbGlkZSBvZmZzZXQgZnJvbSBjZW50ZXJcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHNsaWRlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgY29uc3QgJHNsaWRlRWwgPSBzbGlkZXMuZXEoaSk7XHJcbiAgICAgICAgICBjb25zdCBzbGlkZVNpemUgPSBzbGlkZXNTaXplc0dyaWRbaV07XHJcbiAgICAgICAgICBjb25zdCBzbGlkZU9mZnNldCA9ICRzbGlkZUVsWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xyXG4gICAgICAgICAgY29uc3QgY2VudGVyT2Zmc2V0ID0gKGNlbnRlciAtIHNsaWRlT2Zmc2V0IC0gc2xpZGVTaXplIC8gMikgLyBzbGlkZVNpemU7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRNdWx0aXBsaWVyID0gdHlwZW9mIHBhcmFtcy5tb2RpZmllciA9PT0gJ2Z1bmN0aW9uJyA/IHBhcmFtcy5tb2RpZmllcihjZW50ZXJPZmZzZXQpIDogY2VudGVyT2Zmc2V0ICogcGFyYW1zLm1vZGlmaWVyO1xyXG4gICAgICAgICAgbGV0IHJvdGF0ZVkgPSBpc0hvcml6b250YWwgPyByb3RhdGUgKiBvZmZzZXRNdWx0aXBsaWVyIDogMDtcclxuICAgICAgICAgIGxldCByb3RhdGVYID0gaXNIb3Jpem9udGFsID8gMCA6IHJvdGF0ZSAqIG9mZnNldE11bHRpcGxpZXI7IC8vIHZhciByb3RhdGVaID0gMFxyXG5cclxuICAgICAgICAgIGxldCB0cmFuc2xhdGVaID0gLXRyYW5zbGF0ZSAqIE1hdGguYWJzKG9mZnNldE11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgbGV0IHN0cmV0Y2ggPSBwYXJhbXMuc3RyZXRjaDsgLy8gQWxsb3cgcGVyY2VudGFnZSB0byBtYWtlIGEgcmVsYXRpdmUgc3RyZXRjaCBmb3IgcmVzcG9uc2l2ZSBzbGlkZXJzXHJcblxyXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdHJldGNoID09PSAnc3RyaW5nJyAmJiBzdHJldGNoLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgc3RyZXRjaCA9IHBhcnNlRmxvYXQocGFyYW1zLnN0cmV0Y2gpIC8gMTAwICogc2xpZGVTaXplO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCB0cmFuc2xhdGVZID0gaXNIb3Jpem9udGFsID8gMCA6IHN0cmV0Y2ggKiBvZmZzZXRNdWx0aXBsaWVyO1xyXG4gICAgICAgICAgbGV0IHRyYW5zbGF0ZVggPSBpc0hvcml6b250YWwgPyBzdHJldGNoICogb2Zmc2V0TXVsdGlwbGllciA6IDA7XHJcbiAgICAgICAgICBsZXQgc2NhbGUgPSAxIC0gKDEgLSBwYXJhbXMuc2NhbGUpICogTWF0aC5hYnMob2Zmc2V0TXVsdGlwbGllcik7IC8vIEZpeCBmb3IgdWx0cmEgc21hbGwgdmFsdWVzXHJcblxyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVgpIDwgMC4wMDEpIHRyYW5zbGF0ZVggPSAwO1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVkpIDwgMC4wMDEpIHRyYW5zbGF0ZVkgPSAwO1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVopIDwgMC4wMDEpIHRyYW5zbGF0ZVogPSAwO1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVkpIDwgMC4wMDEpIHJvdGF0ZVkgPSAwO1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVgpIDwgMC4wMDEpIHJvdGF0ZVggPSAwO1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHNjYWxlKSA8IDAuMDAxKSBzY2FsZSA9IDA7XHJcbiAgICAgICAgICBjb25zdCBzbGlkZVRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3RyYW5zbGF0ZVh9cHgsJHt0cmFuc2xhdGVZfXB4LCR7dHJhbnNsYXRlWn1weCkgIHJvdGF0ZVgoJHtyb3RhdGVYfWRlZykgcm90YXRlWSgke3JvdGF0ZVl9ZGVnKSBzY2FsZSgke3NjYWxlfSlgO1xyXG4gICAgICAgICAgY29uc3QgJHRhcmdldEVsID0gZWZmZWN0VGFyZ2V0KHBhcmFtcywgJHNsaWRlRWwpO1xyXG4gICAgICAgICAgJHRhcmdldEVsLnRyYW5zZm9ybShzbGlkZVRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAkc2xpZGVFbFswXS5zdHlsZS56SW5kZXggPSAtTWF0aC5hYnMoTWF0aC5yb3VuZChvZmZzZXRNdWx0aXBsaWVyKSkgKyAxO1xyXG5cclxuICAgICAgICAgIGlmIChwYXJhbXMuc2xpZGVTaGFkb3dzKSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBzaGFkb3dzXHJcbiAgICAgICAgICAgIGxldCAkc2hhZG93QmVmb3JlRWwgPSBpc0hvcml6b250YWwgPyAkc2xpZGVFbC5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykgOiAkc2xpZGVFbC5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AnKTtcclxuICAgICAgICAgICAgbGV0ICRzaGFkb3dBZnRlckVsID0gaXNIb3Jpem9udGFsID8gJHNsaWRlRWwuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQnKSA6ICRzbGlkZUVsLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzaGFkb3dCZWZvcmVFbC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAkc2hhZG93QmVmb3JlRWwgPSBjcmVhdGVTaGFkb3cocGFyYW1zLCAkc2xpZGVFbCwgaXNIb3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNoYWRvd0FmdGVyRWwubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgJHNoYWRvd0FmdGVyRWwgPSBjcmVhdGVTaGFkb3cocGFyYW1zLCAkc2xpZGVFbCwgaXNIb3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRzaGFkb3dCZWZvcmVFbC5sZW5ndGgpICRzaGFkb3dCZWZvcmVFbFswXS5zdHlsZS5vcGFjaXR5ID0gb2Zmc2V0TXVsdGlwbGllciA+IDAgPyBvZmZzZXRNdWx0aXBsaWVyIDogMDtcclxuICAgICAgICAgICAgaWYgKCRzaGFkb3dBZnRlckVsLmxlbmd0aCkgJHNoYWRvd0FmdGVyRWxbMF0uc3R5bGUub3BhY2l0eSA9IC1vZmZzZXRNdWx0aXBsaWVyID4gMCA/IC1vZmZzZXRNdWx0aXBsaWVyIDogMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHRyYW5zZm9ybUVsXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXMuY292ZXJmbG93RWZmZWN0O1xyXG4gICAgICAgIGNvbnN0ICR0cmFuc2l0aW9uRWxlbWVudHMgPSB0cmFuc2Zvcm1FbCA/IHN3aXBlci5zbGlkZXMuZmluZCh0cmFuc2Zvcm1FbCkgOiBzd2lwZXIuc2xpZGVzO1xyXG4gICAgICAgICR0cmFuc2l0aW9uRWxlbWVudHMudHJhbnNpdGlvbihkdXJhdGlvbikuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykudHJhbnNpdGlvbihkdXJhdGlvbik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBlZmZlY3RJbml0KHtcclxuICAgICAgICBlZmZlY3Q6ICdjb3ZlcmZsb3cnLFxyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBvbixcclxuICAgICAgICBzZXRUcmFuc2xhdGUsXHJcbiAgICAgICAgc2V0VHJhbnNpdGlvbixcclxuICAgICAgICBwZXJzcGVjdGl2ZTogKCkgPT4gdHJ1ZSxcclxuICAgICAgICBvdmVyd3JpdGVQYXJhbXM6ICgpID0+ICh7XHJcbiAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gRWZmZWN0Q3JlYXRpdmUoX3JlZikge1xyXG4gICAgICBsZXQge1xyXG4gICAgICAgIHN3aXBlcixcclxuICAgICAgICBleHRlbmRQYXJhbXMsXHJcbiAgICAgICAgb25cclxuICAgICAgfSA9IF9yZWY7XHJcbiAgICAgIGV4dGVuZFBhcmFtcyh7XHJcbiAgICAgICAgY3JlYXRpdmVFZmZlY3Q6IHtcclxuICAgICAgICAgIHRyYW5zZm9ybUVsOiBudWxsLFxyXG4gICAgICAgICAgbGltaXRQcm9ncmVzczogMSxcclxuICAgICAgICAgIHNoYWRvd1BlclByb2dyZXNzOiBmYWxzZSxcclxuICAgICAgICAgIHByb2dyZXNzTXVsdGlwbGllcjogMSxcclxuICAgICAgICAgIHBlcnNwZWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgcHJldjoge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IFswLCAwLCAwXSxcclxuICAgICAgICAgICAgcm90YXRlOiBbMCwgMCwgMF0sXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIHNjYWxlOiAxXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbmV4dDoge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IFswLCAwLCAwXSxcclxuICAgICAgICAgICAgcm90YXRlOiBbMCwgMCwgMF0sXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIHNjYWxlOiAxXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGdldFRyYW5zbGF0ZVZhbHVlID0gdmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfXB4YDtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHNldFRyYW5zbGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICBzbGlkZXMsXHJcbiAgICAgICAgICAkd3JhcHBlckVsLFxyXG4gICAgICAgICAgc2xpZGVzU2l6ZXNHcmlkXHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNyZWF0aXZlRWZmZWN0O1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHByb2dyZXNzTXVsdGlwbGllcjogbXVsdGlwbGllclxyXG4gICAgICAgIH0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgaXNDZW50ZXJlZFNsaWRlcyA9IHN3aXBlci5wYXJhbXMuY2VudGVyZWRTbGlkZXM7XHJcblxyXG4gICAgICAgIGlmIChpc0NlbnRlcmVkU2xpZGVzKSB7XHJcbiAgICAgICAgICBjb25zdCBtYXJnaW4gPSBzbGlkZXNTaXplc0dyaWRbMF0gLyAyIC0gc3dpcGVyLnBhcmFtcy5zbGlkZXNPZmZzZXRCZWZvcmUgfHwgMDtcclxuICAgICAgICAgICR3cmFwcGVyRWwudHJhbnNmb3JtKGB0cmFuc2xhdGVYKGNhbGMoNTAlIC0gJHttYXJnaW59cHgpKWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGNvbnN0ICRzbGlkZUVsID0gc2xpZGVzLmVxKGkpO1xyXG4gICAgICAgICAgY29uc3Qgc2xpZGVQcm9ncmVzcyA9ICRzbGlkZUVsWzBdLnByb2dyZXNzO1xyXG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1pbihNYXRoLm1heCgkc2xpZGVFbFswXS5wcm9ncmVzcywgLXBhcmFtcy5saW1pdFByb2dyZXNzKSwgcGFyYW1zLmxpbWl0UHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgbGV0IG9yaWdpbmFsUHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuXHJcbiAgICAgICAgICBpZiAoIWlzQ2VudGVyZWRTbGlkZXMpIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxQcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KCRzbGlkZUVsWzBdLm9yaWdpbmFsUHJvZ3Jlc3MsIC1wYXJhbXMubGltaXRQcm9ncmVzcyksIHBhcmFtcy5saW1pdFByb2dyZXNzKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBvZmZzZXQgPSAkc2xpZGVFbFswXS5zd2lwZXJTbGlkZU9mZnNldDtcclxuICAgICAgICAgIGNvbnN0IHQgPSBbc3dpcGVyLnBhcmFtcy5jc3NNb2RlID8gLW9mZnNldCAtIHN3aXBlci50cmFuc2xhdGUgOiAtb2Zmc2V0LCAwLCAwXTtcclxuICAgICAgICAgIGNvbnN0IHIgPSBbMCwgMCwgMF07XHJcbiAgICAgICAgICBsZXQgY3VzdG9tID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgaWYgKCFzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcclxuICAgICAgICAgICAgdFsxXSA9IHRbMF07XHJcbiAgICAgICAgICAgIHRbMF0gPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IFswLCAwLCAwXSxcclxuICAgICAgICAgICAgcm90YXRlOiBbMCwgMCwgMF0sXHJcbiAgICAgICAgICAgIHNjYWxlOiAxLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDApIHtcclxuICAgICAgICAgICAgZGF0YSA9IHBhcmFtcy5uZXh0O1xyXG4gICAgICAgICAgICBjdXN0b20gPSB0cnVlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChwcm9ncmVzcyA+IDApIHtcclxuICAgICAgICAgICAgZGF0YSA9IHBhcmFtcy5wcmV2O1xyXG4gICAgICAgICAgICBjdXN0b20gPSB0cnVlO1xyXG4gICAgICAgICAgfSAvLyBzZXQgdHJhbnNsYXRlXHJcblxyXG5cclxuICAgICAgICAgIHQuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRbaW5kZXhdID0gYGNhbGMoJHt2YWx1ZX1weCArICgke2dldFRyYW5zbGF0ZVZhbHVlKGRhdGEudHJhbnNsYXRlW2luZGV4XSl9ICogJHtNYXRoLmFicyhwcm9ncmVzcyAqIG11bHRpcGxpZXIpfSkpYDtcclxuICAgICAgICAgIH0pOyAvLyBzZXQgcm90YXRlc1xyXG5cclxuICAgICAgICAgIHIuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHJbaW5kZXhdID0gZGF0YS5yb3RhdGVbaW5kZXhdICogTWF0aC5hYnMocHJvZ3Jlc3MgKiBtdWx0aXBsaWVyKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJHNsaWRlRWxbMF0uc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQoc2xpZGVQcm9ncmVzcykpICsgc2xpZGVzLmxlbmd0aDtcclxuICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZVN0cmluZyA9IHQuam9pbignLCAnKTtcclxuICAgICAgICAgIGNvbnN0IHJvdGF0ZVN0cmluZyA9IGByb3RhdGVYKCR7clswXX1kZWcpIHJvdGF0ZVkoJHtyWzFdfWRlZykgcm90YXRlWigke3JbMl19ZGVnKWA7XHJcbiAgICAgICAgICBjb25zdCBzY2FsZVN0cmluZyA9IG9yaWdpbmFsUHJvZ3Jlc3MgPCAwID8gYHNjYWxlKCR7MSArICgxIC0gZGF0YS5zY2FsZSkgKiBvcmlnaW5hbFByb2dyZXNzICogbXVsdGlwbGllcn0pYCA6IGBzY2FsZSgkezEgLSAoMSAtIGRhdGEuc2NhbGUpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXJ9KWA7XHJcbiAgICAgICAgICBjb25zdCBvcGFjaXR5U3RyaW5nID0gb3JpZ2luYWxQcm9ncmVzcyA8IDAgPyAxICsgKDEgLSBkYXRhLm9wYWNpdHkpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXIgOiAxIC0gKDEgLSBkYXRhLm9wYWNpdHkpICogb3JpZ2luYWxQcm9ncmVzcyAqIG11bHRpcGxpZXI7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt0cmFuc2xhdGVTdHJpbmd9KSAke3JvdGF0ZVN0cmluZ30gJHtzY2FsZVN0cmluZ31gOyAvLyBTZXQgc2hhZG93c1xyXG5cclxuICAgICAgICAgIGlmIChjdXN0b20gJiYgZGF0YS5zaGFkb3cgfHwgIWN1c3RvbSkge1xyXG4gICAgICAgICAgICBsZXQgJHNoYWRvd0VsID0gJHNsaWRlRWwuY2hpbGRyZW4oJy5zd2lwZXItc2xpZGUtc2hhZG93Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNoYWRvd0VsLmxlbmd0aCA9PT0gMCAmJiBkYXRhLnNoYWRvdykge1xyXG4gICAgICAgICAgICAgICRzaGFkb3dFbCA9IGNyZWF0ZVNoYWRvdyhwYXJhbXMsICRzbGlkZUVsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRzaGFkb3dFbC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBjb25zdCBzaGFkb3dPcGFjaXR5ID0gcGFyYW1zLnNoYWRvd1BlclByb2dyZXNzID8gcHJvZ3Jlc3MgKiAoMSAvIHBhcmFtcy5saW1pdFByb2dyZXNzKSA6IHByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICRzaGFkb3dFbFswXS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5taW4oTWF0aC5tYXgoTWF0aC5hYnMoc2hhZG93T3BhY2l0eSksIDApLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0ICR0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsICRzbGlkZUVsKTtcclxuICAgICAgICAgICR0YXJnZXRFbC50cmFuc2Zvcm0odHJhbnNmb3JtKS5jc3Moe1xyXG4gICAgICAgICAgICBvcGFjaXR5OiBvcGFjaXR5U3RyaW5nXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoZGF0YS5vcmlnaW4pIHtcclxuICAgICAgICAgICAgJHRhcmdldEVsLmNzcygndHJhbnNmb3JtLW9yaWdpbicsIGRhdGEub3JpZ2luKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHRyYW5zZm9ybUVsXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXMuY3JlYXRpdmVFZmZlY3Q7XHJcbiAgICAgICAgY29uc3QgJHRyYW5zaXRpb25FbGVtZW50cyA9IHRyYW5zZm9ybUVsID8gc3dpcGVyLnNsaWRlcy5maW5kKHRyYW5zZm9ybUVsKSA6IHN3aXBlci5zbGlkZXM7XHJcbiAgICAgICAgJHRyYW5zaXRpb25FbGVtZW50cy50cmFuc2l0aW9uKGR1cmF0aW9uKS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpLnRyYW5zaXRpb24oZHVyYXRpb24pO1xyXG4gICAgICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcclxuICAgICAgICAgIHN3aXBlcixcclxuICAgICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgICAgdHJhbnNmb3JtRWwsXHJcbiAgICAgICAgICBhbGxTbGlkZXM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGVmZmVjdEluaXQoe1xyXG4gICAgICAgIGVmZmVjdDogJ2NyZWF0aXZlJyxcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgb24sXHJcbiAgICAgICAgc2V0VHJhbnNsYXRlLFxyXG4gICAgICAgIHNldFRyYW5zaXRpb24sXHJcbiAgICAgICAgcGVyc3BlY3RpdmU6ICgpID0+IHN3aXBlci5wYXJhbXMuY3JlYXRpdmVFZmZlY3QucGVyc3BlY3RpdmUsXHJcbiAgICAgICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xyXG4gICAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcclxuICAgICAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBFZmZlY3RDYXJkcyhfcmVmKSB7XHJcbiAgICAgIGxldCB7XHJcbiAgICAgICAgc3dpcGVyLFxyXG4gICAgICAgIGV4dGVuZFBhcmFtcyxcclxuICAgICAgICBvblxyXG4gICAgICB9ID0gX3JlZjtcclxuICAgICAgZXh0ZW5kUGFyYW1zKHtcclxuICAgICAgICBjYXJkc0VmZmVjdDoge1xyXG4gICAgICAgICAgc2xpZGVTaGFkb3dzOiB0cnVlLFxyXG4gICAgICAgICAgdHJhbnNmb3JtRWw6IG51bGwsXHJcbiAgICAgICAgICByb3RhdGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgc2V0VHJhbnNsYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHNsaWRlcyxcclxuICAgICAgICAgIGFjdGl2ZUluZGV4XHJcbiAgICAgICAgfSA9IHN3aXBlcjtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBzd2lwZXIucGFyYW1zLmNhcmRzRWZmZWN0O1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHN0YXJ0VHJhbnNsYXRlLFxyXG4gICAgICAgICAgaXNUb3VjaGVkXHJcbiAgICAgICAgfSA9IHN3aXBlci50b3VjaEV2ZW50c0RhdGE7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFRyYW5zbGF0ZSA9IHN3aXBlci50cmFuc2xhdGU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICBjb25zdCAkc2xpZGVFbCA9IHNsaWRlcy5lcShpKTtcclxuICAgICAgICAgIGNvbnN0IHNsaWRlUHJvZ3Jlc3MgPSAkc2xpZGVFbFswXS5wcm9ncmVzcztcclxuICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4oTWF0aC5tYXgoc2xpZGVQcm9ncmVzcywgLTQpLCA0KTtcclxuICAgICAgICAgIGxldCBvZmZzZXQgPSAkc2xpZGVFbFswXS5zd2lwZXJTbGlkZU9mZnNldDtcclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiAhc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSB7XHJcbiAgICAgICAgICAgIHN3aXBlci4kd3JhcHBlckVsLnRyYW5zZm9ybShgdHJhbnNsYXRlWCgke3N3aXBlci5taW5UcmFuc2xhdGUoKX1weClgKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoc3dpcGVyLnBhcmFtcy5jZW50ZXJlZFNsaWRlcyAmJiBzd2lwZXIucGFyYW1zLmNzc01vZGUpIHtcclxuICAgICAgICAgICAgb2Zmc2V0IC09IHNsaWRlc1swXS5zd2lwZXJTbGlkZU9mZnNldDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgdFggPSBzd2lwZXIucGFyYW1zLmNzc01vZGUgPyAtb2Zmc2V0IC0gc3dpcGVyLnRyYW5zbGF0ZSA6IC1vZmZzZXQ7XHJcbiAgICAgICAgICBsZXQgdFkgPSAwO1xyXG4gICAgICAgICAgY29uc3QgdFogPSAtMTAwICogTWF0aC5hYnMocHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgbGV0IHNjYWxlID0gMTtcclxuICAgICAgICAgIGxldCByb3RhdGUgPSAtMiAqIHByb2dyZXNzO1xyXG4gICAgICAgICAgbGV0IHRYQWRkID0gOCAtIE1hdGguYWJzKHByb2dyZXNzKSAqIDAuNzU7XHJcbiAgICAgICAgICBjb25zdCBzbGlkZUluZGV4ID0gc3dpcGVyLnZpcnR1YWwgJiYgc3dpcGVyLnBhcmFtcy52aXJ0dWFsLmVuYWJsZWQgPyBzd2lwZXIudmlydHVhbC5mcm9tICsgaSA6IGk7XHJcbiAgICAgICAgICBjb25zdCBpc1N3aXBlVG9OZXh0ID0gKHNsaWRlSW5kZXggPT09IGFjdGl2ZUluZGV4IHx8IHNsaWRlSW5kZXggPT09IGFjdGl2ZUluZGV4IC0gMSkgJiYgcHJvZ3Jlc3MgPiAwICYmIHByb2dyZXNzIDwgMSAmJiAoaXNUb3VjaGVkIHx8IHN3aXBlci5wYXJhbXMuY3NzTW9kZSkgJiYgY3VycmVudFRyYW5zbGF0ZSA8IHN0YXJ0VHJhbnNsYXRlO1xyXG4gICAgICAgICAgY29uc3QgaXNTd2lwZVRvUHJldiA9IChzbGlkZUluZGV4ID09PSBhY3RpdmVJbmRleCB8fCBzbGlkZUluZGV4ID09PSBhY3RpdmVJbmRleCArIDEpICYmIHByb2dyZXNzIDwgMCAmJiBwcm9ncmVzcyA+IC0xICYmIChpc1RvdWNoZWQgfHwgc3dpcGVyLnBhcmFtcy5jc3NNb2RlKSAmJiBjdXJyZW50VHJhbnNsYXRlID4gc3RhcnRUcmFuc2xhdGU7XHJcblxyXG4gICAgICAgICAgaWYgKGlzU3dpcGVUb05leHQgfHwgaXNTd2lwZVRvUHJldikge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJQcm9ncmVzcyA9ICgxIC0gTWF0aC5hYnMoKE1hdGguYWJzKHByb2dyZXNzKSAtIDAuNSkgLyAwLjUpKSAqKiAwLjU7XHJcbiAgICAgICAgICAgIHJvdGF0ZSArPSAtMjggKiBwcm9ncmVzcyAqIHN1YlByb2dyZXNzO1xyXG4gICAgICAgICAgICBzY2FsZSArPSAtMC41ICogc3ViUHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgIHRYQWRkICs9IDk2ICogc3ViUHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgIHRZID0gYCR7LTI1ICogc3ViUHJvZ3Jlc3MgKiBNYXRoLmFicyhwcm9ncmVzcyl9JWA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHByb2dyZXNzIDwgMCkge1xyXG4gICAgICAgICAgICAvLyBuZXh0XHJcbiAgICAgICAgICAgIHRYID0gYGNhbGMoJHt0WH1weCArICgke3RYQWRkICogTWF0aC5hYnMocHJvZ3Jlc3MpfSUpKWA7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHByb2dyZXNzID4gMCkge1xyXG4gICAgICAgICAgICAvLyBwcmV2XHJcbiAgICAgICAgICAgIHRYID0gYGNhbGMoJHt0WH1weCArICgtJHt0WEFkZCAqIE1hdGguYWJzKHByb2dyZXNzKX0lKSlgO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdFggPSBgJHt0WH1weGA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCFzd2lwZXIuaXNIb3Jpem9udGFsKCkpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJldlkgPSB0WTtcclxuICAgICAgICAgICAgdFkgPSB0WDtcclxuICAgICAgICAgICAgdFggPSBwcmV2WTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBzY2FsZVN0cmluZyA9IHByb2dyZXNzIDwgMCA/IGAkezEgKyAoMSAtIHNjYWxlKSAqIHByb2dyZXNzfWAgOiBgJHsxIC0gKDEgLSBzY2FsZSkgKiBwcm9ncmVzc31gO1xyXG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYFxyXG4gICAgICAgIHRyYW5zbGF0ZTNkKCR7dFh9LCAke3RZfSwgJHt0Wn1weClcclxuICAgICAgICByb3RhdGVaKCR7cGFyYW1zLnJvdGF0ZSA/IHJvdGF0ZSA6IDB9ZGVnKVxyXG4gICAgICAgIHNjYWxlKCR7c2NhbGVTdHJpbmd9KVxyXG4gICAgICBgO1xyXG5cclxuICAgICAgICAgIGlmIChwYXJhbXMuc2xpZGVTaGFkb3dzKSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBzaGFkb3dzXHJcbiAgICAgICAgICAgIGxldCAkc2hhZG93RWwgPSAkc2xpZGVFbC5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzaGFkb3dFbC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAkc2hhZG93RWwgPSBjcmVhdGVTaGFkb3cocGFyYW1zLCAkc2xpZGVFbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkc2hhZG93RWwubGVuZ3RoKSAkc2hhZG93RWxbMF0uc3R5bGUub3BhY2l0eSA9IE1hdGgubWluKE1hdGgubWF4KChNYXRoLmFicyhwcm9ncmVzcykgLSAwLjUpIC8gMC41LCAwKSwgMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJHNsaWRlRWxbMF0uc3R5bGUuekluZGV4ID0gLU1hdGguYWJzKE1hdGgucm91bmQoc2xpZGVQcm9ncmVzcykpICsgc2xpZGVzLmxlbmd0aDtcclxuICAgICAgICAgIGNvbnN0ICR0YXJnZXRFbCA9IGVmZmVjdFRhcmdldChwYXJhbXMsICRzbGlkZUVsKTtcclxuICAgICAgICAgICR0YXJnZXRFbC50cmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzZXRUcmFuc2l0aW9uID0gZHVyYXRpb24gPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgIHRyYW5zZm9ybUVsXHJcbiAgICAgICAgfSA9IHN3aXBlci5wYXJhbXMuY2FyZHNFZmZlY3Q7XHJcbiAgICAgICAgY29uc3QgJHRyYW5zaXRpb25FbGVtZW50cyA9IHRyYW5zZm9ybUVsID8gc3dpcGVyLnNsaWRlcy5maW5kKHRyYW5zZm9ybUVsKSA6IHN3aXBlci5zbGlkZXM7XHJcbiAgICAgICAgJHRyYW5zaXRpb25FbGVtZW50cy50cmFuc2l0aW9uKGR1cmF0aW9uKS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdycpLnRyYW5zaXRpb24oZHVyYXRpb24pO1xyXG4gICAgICAgIGVmZmVjdFZpcnR1YWxUcmFuc2l0aW9uRW5kKHtcclxuICAgICAgICAgIHN3aXBlcixcclxuICAgICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgICAgdHJhbnNmb3JtRWxcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGVmZmVjdEluaXQoe1xyXG4gICAgICAgIGVmZmVjdDogJ2NhcmRzJyxcclxuICAgICAgICBzd2lwZXIsXHJcbiAgICAgICAgb24sXHJcbiAgICAgICAgc2V0VHJhbnNsYXRlLFxyXG4gICAgICAgIHNldFRyYW5zaXRpb24sXHJcbiAgICAgICAgcGVyc3BlY3RpdmU6ICgpID0+IHRydWUsXHJcbiAgICAgICAgb3ZlcndyaXRlUGFyYW1zOiAoKSA9PiAoe1xyXG4gICAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcclxuICAgICAgICAgIHZpcnR1YWxUcmFuc2xhdGU6ICFzd2lwZXIucGFyYW1zLmNzc01vZGVcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTd2lwZXIgQ2xhc3NcclxuICAgIGNvbnN0IG1vZHVsZXMgPSBbVmlydHVhbCwgS2V5Ym9hcmQsIE1vdXNld2hlZWwsIE5hdmlnYXRpb24sIFBhZ2luYXRpb24sIFNjcm9sbGJhciwgUGFyYWxsYXgsIFpvb20sIExhenksIENvbnRyb2xsZXIsIEExMXksIEhpc3RvcnksIEhhc2hOYXZpZ2F0aW9uLCBBdXRvcGxheSwgVGh1bWIsIGZyZWVNb2RlLCBHcmlkLCBNYW5pcHVsYXRpb24sIEVmZmVjdEZhZGUsIEVmZmVjdEN1YmUsIEVmZmVjdEZsaXAsIEVmZmVjdENvdmVyZmxvdywgRWZmZWN0Q3JlYXRpdmUsIEVmZmVjdENhcmRzXTtcclxuICAgIFN3aXBlci51c2UobW9kdWxlcyk7XHJcblxyXG4gICAgcmV0dXJuIFN3aXBlcjtcclxuXHJcbn0pKTtcclxuXHJcbiJdLCJmaWxlIjoic3dpcGVyLWJ1bmRsZS5qcyJ9
