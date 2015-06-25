(function (root) {
  var dollabill = root.dollabill;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  DOMNodeCollection.prototype.addClass = function (className) {
    var classNames = className.split(" ");
    var numClasses = classNames.length;

    this.each(function () {
      for (var i = 0; i < numClasses; i++) {
        this.classList.add(classNames[i]);
      }
    });

    return this;
  };

  DOMNodeCollection.prototype.append = function (selector) {
    if (selector instanceof DOMNodeCollection) {
      var that = this;

      selector.each(function () {
        that.append(this);
      });
    } else {
      this.each(function () {
        var parentEl;

        if (selector instanceof HTMLElement) {
          dollabill(selector).remove();
          this.appendChild(selector.cloneNode(true));
        } else if (typeof selector === "string") {
          this.innerHTML += selector;
        }
      });
    }

    return this;
  };

  DOMNodeCollection.prototype.attr = function () {
    if (arguments.length === 1) {
      var attr = arguments[0];

      if (typeof attr === "object") {
        for (var key in attr) {
          this.attr(key, attr[key]);
        }

        return this;
      } else {
        return this[0].getAttribute(attr);
      }
    } else if (arguments.length === 2) {
      var attr = arguments[0];
      var value = arguments[1];

      this.each(function () {
        this.setAttribute(attr, value);
      });

      if (this.length === 1) {
        this.setData(attr, value);
      }

      return this;
    }
  };

  DOMNodeCollection.prototype.children = function (selector) {
    var children;

    if (selector) {
      children = this._findMatchingChildren(selector);
    } else {
      children = this._findAllChildren();
    }

    return new DOMNodeCollection(children);
  };

  DOMNodeCollection.prototype._findMatchingChildren = function (selector) {
    var children = [];

    this.each(function () {
      var matchingChildren = this.querySelectorAll(selector);
      matchingChildren = Array.prototype.slice.call(matchingChildren);

      children = children.concat(matchingChildren);
    });

    return children;
  };

  DOMNodeCollection.prototype._findAllChildren = function () {
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

    return allChildren;
  };

  DOMNodeCollection.prototype.closest = function (selector) {
    if (this.length === 0) {
      return this;
    } else if (this.is(selector)) {
      return this.filter(selector).first();
    } else {
      return this.parent().closest(selector);
    }
  };

  DOMNodeCollection.prototype.css = function () {
    if (arguments.length === 1) {
      var styles = arguments[0];

      for (var style in styles) {
        this.css(style, styles[style]);
      }
    } else if (arguments.length === 2) {
      var style = arguments[0];
      var value = arguments[1];

      this.each(function () {
        this.style[style] = value;
      });
    }

    return this;
  };

  DOMNodeCollection.prototype.data = function (attr, value) {
    if (value) {
      this.attr("data-" + attr, value);
      return this;
    } else if (typeof attr === "object") {
      for (var key in attr) {
        this.data(key, attr[key]);
      }

      return this;
    } else {
      return this._data[attr];
    }
  };

  DOMNodeCollection.prototype.each = function (callback) {
    this.els.forEach(function (el, i) {
      callback.call(el, i);
    });

    return this;
  };

  DOMNodeCollection.prototype.empty = function () {
    this.each(function () {
      this.innerHTML = "";
    });

    return this;
  };

  DOMNodeCollection.prototype.eq = function (index) {
    return dollabill(this[index]);
  };

  DOMNodeCollection.prototype.filter = function (selector) {
    var matches = [];
    var filter = selector;

    if (typeof selector === "string") {
      filter = function () {
        return dollabill(this).is(selector);
      };
    } else if (typeof selector !== "function") {
      return new DOMNodeCollection([]);
    }

    this.each(function () {
      if (filter.call(this)) {
        matches.push(this);
      }
    });

    return new DOMNodeCollection(matches);
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
    return dollabill(this[0]);
  };

  DOMNodeCollection.prototype.hasClass = function (className) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].classList.contains(className)) {
        return true;
      }
    }

    return false;
  };

  DOMNodeCollection.prototype.html = function (html) {
    if (typeof html !== 'undefined') {
      this.each(function () {
        this.innerHTML = html;
      });

      return this;
    } else {
      return this[0].innerHTML;
    }
  };

  DOMNodeCollection.prototype.is = function (selector) {
    if (selector[0] === ".") {
      var className = selector.slice(1);
      return this.hasClass(className);
    } else if (selector[0] === "#") {
      var id = selector.slice(1);
      return this._hasId(id);
    } else {
      return this._isTag(selector);
    }
  };

  DOMNodeCollection.prototype._hasId = function (id) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        return true;
      }
    }

    return false;
  };

  DOMNodeCollection.prototype._isTag = function (tag) {
    tag = tag.toUpperCase();

    for (var i = 0; i < this.length; i++) {
      if (this[i].tagName === tag) {
        return true;
      }
    }

    return false;
  };

  DOMNodeCollection.prototype.parent = function () {
    var parents = [];

    this.each(function () {
      if (this.parentElement && parents.indexOf(this.parentElement) === -1) {
        parents.push(this.parentElement);
      }
    });

    return new DOMNodeCollection(parents);
  };

  DOMNodeCollection.prototype.remove = function () {
    this.each(function () {
      this.parentElement && this.parentElement.removeChild(this);
    });

    return this;
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    if (className) {
      var classNames = className.split(" ");
      var numClasses = classNames.length;

      this.each(function () {
        for (var i = 0; i < numClasses; i++) {
          this.classList.remove(classNames[i]);
        }
      });
    } else {
      this.each(function () {
        this.className = "";
      });
    }

    return this;
  };

  DOMNodeCollection.prototype.toggleClass = function (className) {
    this.each(function () {
      this.classList.toggle(className);
    });

    return this;
  };
})(this);
