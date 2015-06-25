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

    var getArray = function (selector) {
      var childEls = document.querySelectorAll(selector);
      childEls = Array.prototype.slice.call(childEls);
      return childEls;
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
      var $el;

      itIsChainable("children");

      beforeEach(function () {
        $el = new DOMNodeCollection([]);
      });

      it("finds only the matching children if selector given", function () {
        var findMatchingChildren = chai.spy.on($el, "_findMatchingChildren");
        $el.children(".title");

        expect(findMatchingChildren).to.be.called.with(".title");
      });

      it("finds all the children if none given", function () {
        var findAllChildren = chai.spy.on($el, "_findAllChildren");
        $el.children();

        expect(findAllChildren).to.be.called();
      });
    });

    describe("#_findMatchingChildren", function () {
      it("collects only the children that match selector", function () {
        testNode1.innerHTML = "<section><h1>hi</h1></section>";
        testNode2.innerHTML = "<h1>fun</h1><h2>so fun</h2>";

        var $el = new DOMNodeCollection([testNode1, testNode2]);
        var children = $el._findMatchingChildren("h1");

        expect(children.length).to.eql(2);
        expect(children.every(function (child) {
          return child.tagName === "H1";
        })).to.be.true;
      });
    });

    describe("#_findAllChildren", function () {
      var $el, children;

      it("collects every element's children in a new collection", function () {
        testNode1.innerHTML = "<h1>hi</h1>";
        testNode2.innerHTML = "<h1>hello</h1><h1>hola</h1>";

        $el = new DOMNodeCollection([testNode1, testNode2]);
        children = $el._findAllChildren();

        expect(children.length).to.eql(3);
        expect(children.every(function (child) {
          return child.tagName === "H1";
        })).to.be.true;
      });

      it("collects nested children", function () {
        testNode1.innerHTML = "<ul><li></li><li></li></ul>";

        $el = new DOMNodeCollection([testNode1]);
        children = $el._findAllChildren();

        expect(children.length).to.eql(3);
        expect(children.map(function (child) {
          return child.tagName;
        })).to.eql(["UL", "LI", "LI"]);
      });
    });

    describe("#closest", function () {
      var $el;

      itIsChainable("closest", "a");

      beforeEach(function () {
        $el = new DOMNodeCollection(getArray(".child"));
      });

      it("returns an empty collection if no matching elements", function () {
        expect($el.closest("#bob").length).to.eql(0);
      });

      it("looks for a match within itself first", function () {
        var $strong = $el.closest("strong");
        expect($strong[0]).to.eql($el[0]);
      });

      it("finds a match within its ancestors", function () {
        var $test = $el.closest("#test-palette");
        expect($test.length).to.eql(1);
      });
    });

    describe("#css", function () {
      var $el;

      itIsChainable("css", {});

      beforeEach(function () {
        $el = new DOMNodeCollection([testNode1]);
      });

      it("handles string input", function () {
        $el.css("color", "red");
        expect(testNode1.style.color).to.eql("red");
      });

      it("handles object input", function () {
        $el.css({ color: "blue", background: "red" });
        expect(testNode1.style.color).to.eql("blue");
        expect(testNode1.style.background).to.eql("red");
      });
    });

    describe("#data", function () {
      var $el;

      itIsChainable("data", {});

      beforeEach(function () {
        $el = new DOMNodeCollection(getArray("#puppies"));
      });

      it("acts as a getter when passed a string", function () {
        expect($el.data("name")).to.eql("schnauzer");
      });

      it("can set attributes by passing two values", function () {
        $el.data("color", "brown");
        expect($el._data.color).to.eql("brown");
      });

      it("can set multiple attributes by passing object", function () {
        $el.data({ color: "black", mood: "happy" });
        expect($el._data.color).to.eql("black");
        expect($el._data.mood).to.eql("happy");
      });

      it("newly set data-attr also accessible as attr", function () {
        $el.data("age", 3);
        expect($el.attr("data-age")).to.eql("3");
      });
    });

    describe("#each", function () {
      var $el;

      itIsChainable("each", function(){});

      it("iterates over each inner element", function () {
        var counter = 0;

        $el = new DOMNodeCollection([1, 2, 3, 4]);

        $el.each(function () {
          counter++;
        });

        expect(counter).to.eql(4);
      });

      it("callback is called in the context of each element", function () {
        var store = [];

        $el = new DOMNodeCollection([
          { name: "sennacy" },
          { name: "rocky" }
        ]);

        $el.each(function () {
          store.push(this);
        });

        expect(store).to.eql([
          { name: "sennacy" },
          { name: "rocky" }
        ]);
      });

      it("passes the current index into the callback", function () {
        var indices = [];

        $el = new DOMNodeCollection([1, 2, 3, 4]);

        $el.each(function (i) {
          indices.push(i);
        });

        expect(indices).to.eql([0, 1, 2, 3]);
      });
    });

    describe("#filter", function () {
      var $el, filtered;

      itIsChainable("filter", ".cool");

      beforeEach(function () {
        var els = getArray(".title").concat(getArray(".child"));
        $el = new DOMNodeCollection(els);
      })

      it("handles string input", function () {
        filtered = $el.filter(".title");

        expect(filtered.length).to.eql(2);
        expect(filtered.els.every(function (el) {
          return el.innerHTML === "hi";
        })).to.be.true;
      });

      it("handles function", function () {
        filtered = $el.filter(function () {
          return this.tagName === "H2";
        });

        expect(filtered.length).to.eql(1);
        expect(filtered[0].innerHTML).to.eql("hi");
      });

      it("returns an empty collection if bad input", function () {
        expect($el.filter(1).length).to.eql(0);
      });
    });

    describe("#hasClass", function () {
      var $el;

      beforeEach(function () {
        testNode1.className = "cat"
        testNode2.className = "dog"

        $el = new DOMNodeCollection([testNode1, testNode2]);
      });

      it("returns true if any element has given class", function () {
        expect($el.hasClass("dog")).to.be.true;
      });

      it("returns false if no element has given class", function () {
        expect($el.hasClass("dfdg")).to.be.false;
      });
    });

    describe("#is", function () {
      var $el;

      beforeEach(function () {
        $el = new DOMNodeCollection([]);
      });

      it("handles class selectors", function () {
        var hasClass = chai.spy.on($el, "hasClass");
        $el.is(".funny");

        expect(hasClass).to.be.called.with("funny");
      });

      it("handles id selectors", function () {
        var hasId = chai.spy.on($el, "_hasId");
        $el.is("#cool");

        expect(hasId).to.be.called.with("cool");
      });

      it("handles tag names", function () {
        var isTag = chai.spy.on($el, "_isTag");
        $el.is("p");

        expect(isTag).to.be.called.with("p");
      });
    });

    describe("#_hasId", function () {
      var $el;

      beforeEach(function () {
        testNode1.id = "cat"
        testNode2.id = "dog"

        $el = new DOMNodeCollection([testNode1, testNode2]);
      });

      it("returns true if any element has given id", function () {
        expect($el._hasId("dog")).to.be.true;
      });

      it("returns false if no element has given id", function () {
        expect($el._hasId("asdf")).to.be.false;
      });
    });

    describe("#_isTag", function () {
      var $el;

      beforeEach(function () {
        $el = new DOMNodeCollection([testNode1, testNode2]);
      });

      it("returns true if any element has given tag name", function () {
        expect($el._isTag("div")).to.be.true;
      });

      it("returns false if no element has given tag name", function () {
        expect($el._isTag("h1")).to.be.false;
      });
    });

    describe("#parent", function () {
      var $el, parents;

      itIsChainable("parent");

      it("returns direct parent for every element in collection", function () {
        $el = new DOMNodeCollection(getArray(".child"));
        parents = $el.parent();

        expect(parents.length).to.eql(3);
        expect(parents.els.every(function (parent) {
          return parent.className === "parent";
        })).to.be.true;
      });

      it("doesn't duplicate parents if same parents", function () {
        $el = new DOMNodeCollection(getArray(".parent"));
        parents = $el.parent();

        expect(parents.length).to.eql(1);
        expect(parents[0].tagName).to.eql("UL");
      });
    });
  });
})();
