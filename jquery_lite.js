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

  $$.extend = function (object) {
    var toMerge = Array.prototype.slice.call(arguments, 1);

    toMerge.forEach(function (options) {
      for (var attr in options) {
        object[attr] = options[attr];
      }
    });

    return object;
  };

  var DOMNodeCollection = $$.DOMNodeCollection = function (els) {
    this.els = els;
    this.length = this.els.length;
  };
})(this);
