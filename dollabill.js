(function (root) {
  var dollabill = root.dollabill = function (selector) {
    if (typeof selector === "string") {
      var parser = new HTMLParser(selector);
      parser.generateEl();
      return parser.el;
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

  var HTMLParser = dollabill.HTMLParser = function (selector) {
    this.selector = selector;
  };

  var DOMNodeCollection = dollabill.DOMNodeCollection = function (els) {
    this.els = els;
    this.length = this.els.length;
    this._data = {};

    if (this.length === 1) { this.parseData(); }
  };

  DOMNodeCollection.prototype.parseData = function () {
    var el = this.els[0];
    var attrs = el.attributes;
    var attrsLength = attrs.length;
    var key;

    for (var i = 0; i < attrsLength; i++) {
      key = attrs[i].nodeName;
      this.setData(key, el.getAttribute(key));
    }
  };

  var BRACKETS = /^\[.*\]$|^\{.*\}$/;

  var isANumber = function (value) {
    return !isNaN(parseInt(value));
  };

  var parseValue = function (value) {
    if (value.match(BRACKETS)) {
      return JSON.parse(value);
    } else if (isANumber(value)) {
      return parseInt(value);
    } else {
      return value;
    }
  };

  DOMNodeCollection.prototype.setData = function (key, val) {
    var match, attr;
    match = key.match(/^data-(\w+)/);

    if (match) {
      attr = match[1];
      this._data[attr] = parseValue(val);
    }
  };

  dollabill.extend = function (object) {
    var toMerge = Array.prototype.slice.call(arguments, 1);

    toMerge.forEach(function (options) {
      for (var attr in options) {
        object[attr] = options[attr];
      }
    });

    return object;
  };
})(this);
