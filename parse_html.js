(function (root) {
  var dollabill = root.dollabill;
  var HTMLParser = dollabill.HTMLParser;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  HTMLParser.TAGCAPTURE = /<(.+)>/;

  HTMLParser.parseSelector = function (selector) {
    var match, closingTag, snippet, tagIdx, tagParts, innerHTML;

    if (match = selector.match(/<\/\w+>$/)) {
      closingTag = match[0];
      snippet = selector.slice(1, -closingTag.length);
      tagIdx = snippet.indexOf(">");

      tagParts = HTMLParser.splitTag(snippet.slice(0, tagIdx));
      innerHTML = snippet.slice(tagIdx + 1);
    } else {
      snippet = selector.match(HTMLParser.TAGCAPTURE)[1];
      tagParts = HTMLParser.splitTag(snippet);
    }

    return {
      tag: tagParts.tag,
      attrs: tagParts.attrs,
      innerHTML: innerHTML
    };
  };

  HTMLParser.splitTag = function (snippet) {
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

  HTMLParser.prototype.createEl = function () {
    var tagParts = HTMLParser.parseSelector(this.selector);
    var element = document.createElement(tagParts.tag);

    this.el = new DOMNodeCollection([element]);
    this.el.attr(tagParts.attrs);
    if (tagParts.innerHTML) this.el.html(tagParts.innerHTML);
  };

  HTMLParser.prototype.getEl = function () {
    var els = document.querySelectorAll(this.selector);
    var elsArr = Array.prototype.slice.call(els);
    this.el = new DOMNodeCollection(elsArr);
  };
})(this);
