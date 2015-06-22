(function () {
  var expect = chai.expect;
  var DOMNodeCollection = dollabill.DOMNodeCollection;

  describe("DOM manipulation", function () {
    var testNode1, testNode2;

    beforeEach(function () {
      testNode1 = document.createElement("div");
      testNode2 = document.createElement("div");
    });

    describe("#addClass", function () {
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
  });
})();