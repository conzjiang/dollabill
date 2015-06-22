(function () {
  var expect = chai.expect;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  describe("dollabill", function () {
    describe("constructor", function () {
      var $el;

      describe("handles string input", function () {
        it("with angle brackets", function () {
          $el = dollabill("<div>");
          expect($el).to.be.an.instanceof(DOMNodeCollection);
          expect($el.els[0].tagName).to.eql("DIV");
        });

        it("with CSS selector", function () {
          $el = dollabill(".title");
          expect($el).to.be.an.instanceof(DOMNodeCollection);
          expect($el.els[0].className).to.eql("title");
        });
      });

      it("handles HTML elements", function () {
        var htmlEl = document.getElementById("test-palette");
        $el = dollabill(htmlEl);
        expect($el).to.be.an.instanceof(DOMNodeCollection);
        expect($el.els[0]).to.eql(htmlEl);
      });

      it("handles functions", function () {
        var holdover = function(){};
        document.onreadystatechange = holdover;

        dollabill(function () {
          console.log("hi");
        });

        expect(document.onreadystatechange).not.to.eql(holdover);
      });

      it("returns an empty DOMNodeCollection by default", function () {
        var $el = dollabill(1);
        expect($el).to.be.an.instanceof(DOMNodeCollection);
        expect($el.els).to.be.empty;
      });
    });

    describe("::extend", function () {
      it("adds properties of second object to first object", function () {
        var extended = dollabill.extend({ a: 1 }, { b: 2 });
        expect(extended).to.eql({ a: 1, b: 2 });
      });

      it("returns the original object", function () {
        var original = {};
        expect(dollabill.extend(original, { a: 1 })).to.eql(original);
      });

      it("handles multiple objects", function () {
        var multiple = dollabill.extend({ a: 1 }, { b: 2 }, { c: 3, d: 4 });
        expect(multiple).to.eql({
          a: 1,
          b: 2,
          c: 3,
          d: 4
        });
      });
    });
  });

  describe("DOMNodeCollection", function () {
    var nodes;

    describe("constructor", function () {
      beforeEach(function () {
        nodes = new DOMNodeCollection([1, 2, 3]);
      });

      it("initializes with an array of elements", function () {
        expect(nodes.els).to.eql([1, 2, 3]);
      });

      it("sets length property to the length of els", function () {
        expect(nodes.length).to.equal(3);
      });

      it("initializes with an empty _data object", function () {
        expect(nodes._data).to.eql({});
      });

      it("parses data if only one element passed in", function () {
        var node = {};
        var parseData = chai.spy.on(node, "parseData");

        DOMNodeCollection.call(node, [1]);

        expect(parseData).to.have.been.called();
      });
    });

    describe("#parseData", function () {
      it("stores the data attributes of the HTML element", function () {
        var el = document.createElement("div");
        el.setAttribute("data-id", 1);
        var node = new DOMNodeCollection([el]);

        expect(node._data).to.eql({ id: 1 });
      });
    });

    describe("#setData", function () {
      var node;

      beforeEach(function () {
        node = new DOMNodeCollection([1, 2]);
      });

      it("sets the key without the `data-` prefix", function () {
        node.setData("data-color", "orange");
        expect(node._data).to.eql({ color: "orange" });
      });

      it("does nothing if not a data attribute", function () {
        node.setData("title", "fun");
        expect(node._data).to.eql({});
      });

      it("casts integers", function () {
        node.setData("data-id", "14");
        expect(node._data).to.eql({ id: 14 });
      });

      it("casts 0 correctly", function () {
        node.setData("data-zero", "0");
        expect(node._data).to.eql({ zero: 0 });
      });

      it("casts arrays", function () {
        node.setData("data-pos", "[1, 2]");
        expect(node._data).to.eql({ pos: [1, 2] });
      });

      it("casts objects", function () {
        node.setData("data-cat", "{ \"name\": \"sennacy\" }");
        expect(node._data).to.eql({ cat: { name: "sennacy" } });
      });
    });
  });
})();
