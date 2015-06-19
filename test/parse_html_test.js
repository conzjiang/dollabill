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
  });
})();
