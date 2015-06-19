(function (root) {
  var dollabill = root.dollabill;
  var HTMLParser = dollabill.HTMLParser;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  HTMLParser.TAGCAPTURE = /<(.+)>/;

  HTMLParser.prototype.createEl = function () {
    var tagParts = this.parseSelector();
    var element = document.createElement(tagParts.tag);

    this.el = new DOMNodeCollection([element]);
    this.el.attr(tagParts.attrs);
    if (tagParts.innerHTML) this.el.html(tagParts.innerHTML);
  };

  HTMLParser.prototype.parseSelector = function () {
    var match, closingTag, snippet, tagIdx, tagParts, innerHTML;

    if (match = this.selector.match(/<\/\w+>$/)) {
      closingTag = match[0];
      snippet = this.selector.slice(1, -closingTag.length);
      tagIdx = snippet.indexOf(">");

      tagParts = this.splitTag(snippet.slice(0, tagIdx));
      innerHTML = snippet.slice(tagIdx + 1);
    } else {
      tagParts = this.splitTag(this.selector.match(HTMLParser.TAGCAPTURE)[1]);
    }

    return {
      tag: tagParts.tag,
      attrs: tagParts.attrs,
      innerHTML: innerHTML
    };
  };

  HTMLParser.prototype.splitTag = function (snippet) {
    var tagParts = snippet.split(" ");
    return {
      tag: tagParts.shift(),
      attrs: HTMLParser.getAttrs(tagParts)
    };
  };

  HTMLParser.getAttrs = function (snippet) {
    var attrs = {};

    snippet.forEach(function (attr) {
      var parts = attr.split("=");
      attrs[parts[0]] = /^(\"|\')?(\w+)(\"|\')?$/.exec(parts[1])[2];
    });

    return attrs;
  };

  HTMLParser.prototype.getEl = function () {
    var els = document.querySelectorAll(this.selector);
    var elsArr = Array.prototype.slice.call(els);
    this.el = new DOMNodeCollection(elsArr);
  };
})(this);
