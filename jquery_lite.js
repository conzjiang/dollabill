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

  DOMNodeCollection.prototype.empty = function () {
    this.each(function () {
      this.innerHTML = "";
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

  DOMNodeCollection.prototype.each = function (callback) {
    this.els.forEach(function (el, i) {
      callback.call(el, i);
    });
  };
})(this);
