(function (root) {
  var $$ = root.$$;
  var DOMNodeCollection = $$.DOMNodeCollection;

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

  DOMNodeCollection.prototype.find = function (selector) {
    var found = [];

    this.each(function () {
      var match = this.querySelectorAll(selector);
      var length = match.length;

      for (var i = 0; i < length; i++) {
        found.push(match[i]);
      }
    });

    return new DOMNodeCollection(found);
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

  DOMNodeCollection.prototype.parent = function () {
    var parents = [];

    this.each(function () {
      if (parents.indexOf(this.parentElement) === -1) {
        parents.push(this.parentElement);
      }
    });

    return new DOMNodeCollection(parents);
  };

  DOMNodeCollection.prototype.remove = function () {
    this.each(function () {
      this.parentElement.removeChild(this);
    });
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
