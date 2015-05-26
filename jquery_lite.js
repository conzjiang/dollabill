(function (root) {
  var $$ = root.$$ = function (selector) {
    if (typeof selector === "string") {
      return new HTMLParser(selector).el;
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

  var HTMLParser = $$.HTMLParser = function (selector) {
    this.selector = selector;

    if (this.selector.match(HTMLParser.TAGCAPTURE)) {
      this.createEl();
    } else {
      this.getEl();
    }
  };

  var DOMNodeCollection = $$.DOMNodeCollection = function (els) {
    this.els = els;
    this.length = this.els.length;
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
})(this);
