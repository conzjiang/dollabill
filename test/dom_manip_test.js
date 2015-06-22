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
      itIsChainable("addClass", "fun");

      it("adds class to every element in collection", function () {
        var $el = new DOMNodeCollection([testNode1, testNode2]);
        $el.addClass("fun");

        [testNode1, testNode2].forEach(function (node) {
          expect(node.className).to.eql("fun");
        });
      });

      it("doesn't overwrite classes", function () {
        var $el = new DOMNodeCollection([testNode1]);
        $el.addClass("cool");
        $el.addClass("great");

        expect(testNode1.className).to.eql("cool great");
      });
    });

    describe("#append", function () {
      itIsChainable("append", "hi");

      it("injects the given HTML to the end of every element", function () {
        var $el = new DOMNodeCollection([testNode1, testNode2]);

        [testNode1, testNode2].forEach(function (node) {
          node.innerHTML = "welcome";
        });

        $el.append("<h1>cool</h1>");

        [testNode1, testNode2].forEach(function (node) {
          expect(node.innerHTML).to.eql("welcome<h1>cool</h1>");
        });
      });

      it("appends other DNC instances", function () {
        var $el = new DOMNodeCollection([testNode1]);
        var $toAppend = new DOMNodeCollection([testNode2]);

        testNode1.innerHTML = "<h1>hi</h1>";
        testNode2.innerHTML = "fun fun";

        $el.append($toAppend);

        expect(testNode1.innerHTML).to.eql("<h1>hi</h1><div>fun fun</div>");
      });

      it("appends HTML elements", function () {
        var $el = new DOMNodeCollection([testNode1]);

        testNode1.innerHTML = "<h1>hi</h1>";
        testNode2.innerHTML = "fun fun";

        $el.append(testNode2);

        expect(testNode1.innerHTML).to.eql("<h1>hi</h1><div>fun fun</div>");
      });

      it("removes HTML elements to append from original spot", function () {
        var test = document.getElementById("test-palette");
        var originalHTML = test.innerHTML;

        var $el = new DOMNodeCollection([testNode1]);
        var puppies = document.getElementById("puppies");
        $el.append(puppies);

        expect(test.innerHTML).not.to.contain("puppies");
        test.innerHTML = originalHTML;
      });

      it("appends HTML element's html to every element", function () {
        var element = document.createElement("h1");
        element.innerHTML = "hi";

        var $el = new DOMNodeCollection([testNode1, testNode2]);
        $el.append(element);

        [testNode1, testNode2].forEach(function (node) {
          expect(node.innerHTML).to.eql("<h1>hi</h1>");
        });
      });
    });

    describe("#attr", function () {
      itIsChainable("attr", "title", "fun");

      it("acts as a getter", function () {
        var puppies = document.getElementById("puppies");
        var $el = new DOMNodeCollection([puppies]);

        expect($el.attr("title")).to.eql("cute");
      });

      describe("acts as a setter", function () {
        it("sets attribute for every element in collection", function () {
          var $el = new DOMNodeCollection([testNode1, testNode2]);
          $el.attr("color", "blue");

          [testNode1, testNode2].forEach(function (node) {
            expect(node.getAttribute("color")).to.eql("blue");
          });
        });

        it("handles an object as input", function () {
          var $el = new DOMNodeCollection([testNode1]);
          $el.attr({ size: "large", color: "pink" });

          expect(testNode1.getAttribute("size")).to.eql("large");
          expect(testNode1.getAttribute("color")).to.eql("pink");
        });

        it("updates data object if collection has only one node", function () {
          var $el = new DOMNodeCollection([testNode1]);
          var setData = chai.spy.on($el, "setData");
          $el.attr("data-id", 4);

          expect(setData).to.be.called.with("data-id", 4);
        });

        it("doesn't update data object if more than one node", function () {
          var $el = new DOMNodeCollection([testNode1, testNode2]);
          var setData = chai.spy.on($el, "setData");
          $el.attr("data-id", 4);

          expect(setData).not.to.be.called();
        });
      });
    });
  });
})();
