(function () {
  var expect = chai.expect;

  describe("HTMLParser", function () {
    var HTMLParser = dollabill.HTMLParser;
    var parser;

    beforeEach(function () {
      parser = {};
    });

    describe("constructor", function () {
      it("creates an HTML element if passed angle brackets tag", function () {
        var createEl = chai.spy.on(parser, "createEl");
        HTMLParser.call(parser, "<div>");

        expect(createEl).to.have.been.called();
      });

      it("grabs an existing HTML element if no angle brackets", function () {
        var getEl = chai.spy.on(parser, "getEl");
        HTMLParser.call(parser, "div");

        expect(getEl).to.have.been.called();
      });
    });

    describe("::getAttrs", function () {
      var attrs;

      it("parses array of attributes and values into an object", function () {
        attrs = HTMLParser.getAttrs(["title=\"fun\"", "id=\"grid\""]);
        expect(attrs).to.eql({ title: "fun", id: "grid" });
      });

      it("parses attribute values not wrapped in quotes", function () {
        attrs = HTMLParser.getAttrs(["data-id=1"]);
        expect(attrs).to.eql({ "data-id": "1" });
      });

      it("parses attribute values wrapped in single quotes", function () {
        attrs = HTMLParser.getAttrs(["action='localhost'", "method='post'"]);
        expect(attrs).to.eql({ action: "localhost", method: "post" });
      });
    });
  });
})();
