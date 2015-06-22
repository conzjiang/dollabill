(function () {
  var expect = chai.expect;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  describe("DOM manipulation", function () {
    var testNode1, testNode2;

    var itIsChainable = function () {
      var method = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);

      it("is chainable", function () {
        var $el = new DOMNodeCollection([testNode1]);
        var methodCall = $el[method].apply($el, args);

        expect(methodCall).to.be.an.instanceof(DOMNodeCollection);
      });
    };

    beforeEach(function () {
      testNode1 = document.createElement("div");
      testNode2 = document.createElement("div");
    });

    describe("#addClass", function () {
      var $el;

      itIsChainable("addClass", "fun");

      it("adds class to every element in collection", function () {
        $el = new DOMNodeCollection([testNode1, testNode2]);
        $el.addClass("fun");

        [testNode1, testNode2].forEach(function (node) {
          expect(node.className).to.eql("fun");
        });
      });

      it("doesn't overwrite classes", function () {
        $el = new DOMNodeCollection([testNode1]);
        $el.addClass("cool");
        $el.addClass("great");

        expect(testNode1.className).to.eql("cool great");
      });
    });

    describe("#append", function () {
      var $el;

      itIsChainable("append", "hi");

      it("injects the given HTML to the end of every element", function () {
        [testNode1, testNode2].forEach(function (node) {
          node.innerHTML = "welcome";
        });

        $el = new DOMNodeCollection([testNode1, testNode2]);
        $el.append("<h1>cool</h1>");

        [testNode1, testNode2].forEach(function (node) {
          expect(node.innerHTML).to.eql("welcome<h1>cool</h1>");
        });
      });

      it("appends other DNC instances", function () {
        var $toAppend = new DOMNodeCollection([testNode2]);

        testNode1.innerHTML = "<h1>hi</h1>";
        testNode2.innerHTML = "fun fun";

        $el = new DOMNodeCollection([testNode1]);
        $el.append($toAppend);

        expect(testNode1.innerHTML).to.eql("<h1>hi</h1><div>fun fun</div>");
      });

      it("appends HTML elements", function () {
        testNode1.innerHTML = "<h1>hi</h1>";
        testNode2.innerHTML = "fun fun";

        $el = new DOMNodeCollection([testNode1]);
        $el.append(testNode2);

        expect(testNode1.innerHTML).to.eql("<h1>hi</h1><div>fun fun</div>");
      });

      it("removes HTML elements to append from original spot", function () {
        var test = document.getElementById("test-palette");
        var originalHTML = test.innerHTML;

        var puppies = document.getElementById("puppies");
        $el = new DOMNodeCollection([testNode1]);
        $el.append(puppies);

        expect(test.innerHTML).not.to.contain("puppies");
        test.innerHTML = originalHTML;
      });

      it("appends HTML element's html to every element", function () {
        var element = document.createElement("h1");
        element.innerHTML = "hi";

        $el = new DOMNodeCollection([testNode1, testNode2]);
        $el.append(element);

        [testNode1, testNode2].forEach(function (node) {
          expect(node.innerHTML).to.eql("<h1>hi</h1>");
        });
      });
    });

    describe("#attr", function () {
      var $el;

      itIsChainable("attr", "title", "fun");

      it("acts as a getter", function () {
        var puppies = document.getElementById("puppies");
        $el = new DOMNodeCollection([puppies]);

        expect($el.attr("title")).to.eql("cute");
      });

      describe("acts as a setter", function () {
        it("sets attribute for every element in collection", function () {
          $el = new DOMNodeCollection([testNode1, testNode2]);
          $el.attr("color", "blue");

          [testNode1, testNode2].forEach(function (node) {
            expect(node.getAttribute("color")).to.eql("blue");
          });
        });

        it("handles an object as input", function () {
          $el = new DOMNodeCollection([testNode1]);
          $el.attr({ size: "large", color: "pink" });

          expect(testNode1.getAttribute("size")).to.eql("large");
          expect(testNode1.getAttribute("color")).to.eql("pink");
        });

        it("updates data object if collection has only one node", function () {
          var setData;

          $el = new DOMNodeCollection([testNode1]);
          setData = chai.spy.on($el, "setData");
          $el.attr("data-id", 4);

          expect(setData).to.be.called.with("data-id", 4);
        });

        it("doesn't update data object if more than one node", function () {
          var setData;

          $el = new DOMNodeCollection([testNode1, testNode2]);
          setData = chai.spy.on($el, "setData");
          $el.attr("data-id", 4);

          expect(setData).not.to.be.called();
        });
      });
    });

    describe("#children", function () {
      var $el, $children;

      itIsChainable("children");

      it("collects every element's children in a new collection", function () {
        testNode1.innerHTML = "<h1>hi</h1>";
        testNode2.innerHTML = "<h1>hello</h1><h1>hola</h1>";

        $el = new DOMNodeCollection([testNode1, testNode2]);
        $children = $el.children();

        expect($children.length).to.eql(3);
        expect($children.els.every(function (child) {
          return child.tagName === "H1";
        })).to.be.true;
      });

      it("collects nested children", function () {
        testNode1.innerHTML = "<ul><li></li><li></li></ul>";

        $el = new DOMNodeCollection([testNode1]);
        $children = $el.children();

        expect($children.length).to.eql(3);
        expect($children.els.map(function (child) {
          return child.tagName;
        })).to.eql(["UL", "LI", "LI"]);
      });
    });
  });
})();
