(function (root) {
  var dollabill = root.dollabill;
  var HTMLParser = dollabill.HTMLParser;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  HTMLParser.TAGCAPTURE = /<(.+)>/;

  HTMLParser.getAttrs = function (snippet) {
    var attrs = {};

    snippet.forEach(function (attr) {
      var parts = attr.split("=");
      attrs[parts[0]] = /^(\"|\')?(\w+)(\"|\')?$/.exec(parts[1])[2];
    });

    return attrs;
  };

  HTMLParser.prototype.generateEl = function () {
    if (this.selector.match(HTMLParser.TAGCAPTURE)) {
      this.createEl();
      this.applyAttrs();
    } else {
      this.getEl();
    }
  };

  HTMLParser.prototype.createEl = function () {
    var element;

    this.parseSelector();
    element = document.createElement(this.tag);
    this.el = new DOMNodeCollection([element]);
  };

  HTMLParser.prototype.parseSelector = function () {
    var match, snippet;

    if (match = this.selector.match(/<\/\w+>$/)) {
      this.extractInnerHTML(match[0]);
    } else {
      snippet = this.selector.match(HTMLParser.TAGCAPTURE)[1];
      this.splitTag(snippet);
    }
  };

  HTMLParser.prototype.extractInnerHTML = function (closingTag) {
    var snippet, tagIdx;

    snippet = this.selector.slice(1, -closingTag.length);
    tagIdx = snippet.indexOf(">");

    this.splitTag(snippet.slice(0, tagIdx));
    this.innerHTML = snippet.slice(tagIdx + 1);
  };

  HTMLParser.prototype.splitTag = function (snippet) {
    var tagParts = snippet.split(" ");

    this.tag = tagParts.shift();
    this.attrs = HTMLParser.getAttrs(tagParts);
  };

  var isEmpty = function (obj) {
    for (var prop in obj) {
      return false;
    }

    return true;
  };

  HTMLParser.prototype.applyAttrs = function () {
    if (!isEmpty(this.attrs)) this.el.attr(this.attrs);
    if (this.innerHTML) this.el.html(this.innerHTML);
  };

  HTMLParser.prototype.getEl = function () {
    var els = document.querySelectorAll(this.selector);
    var elsArr = Array.prototype.slice.call(els);
    this.el = new DOMNodeCollection(elsArr);
  };
})(this);
