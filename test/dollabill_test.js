var expect = chai.expect;

describe("dollabill", function () {
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