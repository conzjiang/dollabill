(function () {
  var expect = chai.expect;

  describe("HTMLParser", function () {
    var HTMLParser = dollabill.HTMLParser;
    var parser;

    describe("constructor", function () {
      it("sets the given selector as the selector", function () {
        parser = new HTMLParser("div");
        expect(parser.selector).to.eql("div");
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

    describe("#generateEl", function () {
      describe("selector with angle brackets", function () {
        beforeEach(function () {
          parser = new HTMLParser("<div>");
        });

        it("calls #createEl", function () {
          var createEl = chai.spy.on(parser, "createEl");
          sinon.stub(parser, "applyAttrs");
          parser.generateEl();

          expect(createEl).to.have.been.called();
        });

        it("calls #applyAttrs", function () {
          var originalApplyAttrs, applyAttrs;

          originalApplyAttrs = parser.applyAttrs.bind(parser);
          parser.applyAttrs = function(){};

          applyAttrs = chai.spy.on(parser, "applyAttrs");
          sinon.stub(parser, "createEl");
          parser.generateEl();

          expect(applyAttrs).to.have.been.called();
          parser.applyAttrs = originalApplyAttrs;
        });
      });

      it("calls #getEl if no angle brackets", function () {
        var getEl;

        parser = new HTMLParser("div");
        getEl = chai.spy.on(parser, "getEl");

        parser.generateEl();

        expect(getEl).to.have.been.called();
      });
    });

    describe("#parseSelector", function () {
      it("parses selector w/ closing tag with #extractInnerHTML", function () {
        var extractInnerHTML;

        parser = new HTMLParser("<div id=grid>fun timez</div>");
        extractInnerHTML = chai.spy.on(parser, "extractInnerHTML");
        parser.parseSelector();

        expect(extractInnerHTML).to.have.been.called.with("</div>");
      });

      it("parses angle brackets with #splitTag", function () {
        var splitTag;

        parser = new HTMLParser("<div id=\"grid\">");
        splitTag = chai.spy.on(parser, "splitTag");
        parser.parseSelector();

        expect(splitTag).to.have.been.called.with("div id=\"grid\"");
      });
    });

    describe("#splitTag", function () {
      it("splits an HTML tag snippet to set its tag and attrs", function () {
        parser = new HTMLParser();
        parser.splitTag("div id='main'");

        expect(parser.tag).to.eql("div");
        expect(parser.attrs).to.eql({ id: "main" });
      });
    });

    describe("#extractInnerHTML", function () {
      var splitTag;

      beforeEach(function () {
        parser = new HTMLParser("<div id='main'>fun timez</div>");
      });

      it("receives a closing tag to split selector correctly", function () {
        splitTag = chai.spy.on(parser, "splitTag");
        parser.extractInnerHTML("</div>");

        expect(splitTag).to.have.been.called.with("div id='main'");
      });

      it("sets innerHTML", function () {
        splitTag = parser.splitTag.bind(parser);
        parser.splitTag = function () {};
        parser.extractInnerHTML("</div>");

        expect(parser.innerHTML).to.eql("fun timez");
        parser.splitTag = splitTag;
      });
    });

    describe("#createEl", function () {
      beforeEach(function () {
        parser = new HTMLParser("<div>");
      });

      it("parses its selector", function () {
        var parseSelector = chai.spy.on(parser, "parseSelector");
        parser.createEl();

        expect(parseSelector).to.have.been.called();
      });

      it("creates a new HTML element with the correct tag", function () {
        var createElement = chai.spy.on(document, "createElement");
        parser.createEl();

        expect(createElement).to.have.been.called.with("div");
      });

      it("sets its el to a new DOMNodeCollection", function () {
        var DOMNodeCollection = dollabill.DOMNodeCollection;
        parser.createEl();

        expect(parser.el).to.be.instanceof(DOMNodeCollection);
      });
    });

    describe("#applyAttrs", function () {
      beforeEach(function () {
        parser = new HTMLParser();
        parser.el = { attr: function(){}, html: function(){} };
      });

      describe("attributes", function () {
        it("sets its attrs to its el if it has attrs", function () {
          var attr = chai.spy.on(parser.el, "attr");
          parser.attrs = { title: "fun" };
          parser.applyAttrs();

          expect(attr).to.have.been.called.with({ title: "fun" });
        });

        it("doesn't set attrs if no attrs", function () {
          var attr = chai.spy.on(parser.el, "attr");
          parser.applyAttrs();

          expect(attr).not.to.have.been.called();
        });
      });

      describe("innerHTML", function () {
        it("sets innerHTML if it has innerHTML", function () {
          var html = chai.spy.on(parser.el, "html");
          parser.innerHTML = "cool";
          sinon.stub(parser.el, "attr");
          parser.applyAttrs();

          expect(html).to.have.been.called.with("cool");
        });

        it("doesn't set innerHTML if no innerHTML", function () {
          var html = chai.spy.on(parser.el, "html");
          sinon.stub(parser.el, "attr");
          parser.applyAttrs();

          expect(html).not.to.have.been.called();
        });
      });
    });

    describe("#getEl", function () {
      beforeEach(function () {
        parser = new HTMLParser("div");
      });

      it("finds the HTML elements with the matching selector", function () {
        var querySelectorAll = chai.spy.on(document, "querySelectorAll");
        parser.getEl();

        expect(querySelectorAll).to.have.been.called.with("div");
      });

      it("sets its el to a new DOMNodeCollection", function () {
        var DOMNodeCollection = dollabill.DOMNodeCollection;
        parser.getEl();

        expect(parser.el).to.be.instanceof(DOMNodeCollection);
      });
    });
  });
})();
