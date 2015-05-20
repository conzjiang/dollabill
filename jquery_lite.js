(function (root) {
  var $$ = root.$$ = function (selector) {
    if (typeof selector === "string") {
      var els = document.querySelectorAll(selector);
      var elsArr = Array.prototype.slice.call(els);
      return new DOMNodeCollection(elsArr);
    } else if (selector instanceof HTMLElement) {
      return new DOMNodeCollection([selector]);
    } else {
      return new DOMNodeCollection([]);
    }
  };

  var DOMNodeCollection = function (els) {
    this.els = els;
    this.length = this.els.length;
  };

  DOMNodeCollection.prototype.addClass = function (className) {
    this.each(function () {
      this.classList.add(className);
    });

    return this;
  };

  DOMNodeCollection.prototype.append = function (selector) {
    if (selector instanceof DOMNodeCollection) {
      var that = this;

      selector.each(function () {
        that.append(this.cloneNode(true));
        this.parentElement.removeChild(this);
      });
    } else {
      this.each(function () {
        if (selector instanceof HTMLElement) {
          this.appendChild(selector.cloneNode(true));
        } else if (typeof selector === "string") {
          this.innerHTML += selector;
        }
      });
    }

    return this;
  };

  DOMNodeCollection.prototype.attr = function (attr, value) {
    if (value) {
      this.each(function () {
        this.setAttribute(attr, value);
      });

      return this;
    } else {
      return this.els[0].getAttribute(attr);
    }
  };

  DOMNodeCollection.prototype.children = function () {
    var allChildren = [];
    var queue = this.els.slice();

    while (queue.length) {
      var el = queue.shift();
      var children = el.children;
      var length = children.length;

      for (var i = 0; i < length; i++) {
        allChildren.push(children[i]);
        queue.push(children[i]);
      }
    }

    return new DOMNodeCollection(allChildren);
  };

  DOMNodeCollection.prototype.each = function (callback) {
    this.els.forEach(function (el, i) {
      callback.call(el, i);
    });
  };

  DOMNodeCollection.prototype.empty = function () {
    this.each(function () {
      this.innerHTML = "";
    });

    return this;
  };

  DOMNodeCollection.prototype.first = function () {
    return $$(this.els[0]);
  };

  DOMNodeCollection.prototype.html = function (html) {
    if (html) {
      this.each(function () {
        this.innerHTML = html;
      });

      return this;
    } else {
      return this.els[0].innerHTML;
    }
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    if (className) {
      this.each(function () {
        this.classList.remove(className);
      });
    } else {
      this.each(function () {
        this.className = "";
      });
    }

    return this;
  };
})(this);
