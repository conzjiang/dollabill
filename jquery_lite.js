(function (root) {
  var $$ = root.$$ = function (selector) {
    if (typeof selector === "string") {
      var els = document.querySelectorAll(selector);
      var elsArr = Array.prototype.slice.call(els);
      return new DOMNodeCollection(elsArr);
    } else if (selector instanceof HTMLElement) {
      return new DOMNodeCollection([selector]);
    } else if (typeof selector === "function") {
      document.onreadystatechange = function () {
        if (document.readyState == "complete") {
          selector();
        }
      };
    } else {
      return new DOMNodeCollection([]);
    }
  };

  var DOMNodeCollection = $$.DOMNodeCollection = function (els) {
    this.els = els;
    this.length = this.els.length;
  };
})(this);
