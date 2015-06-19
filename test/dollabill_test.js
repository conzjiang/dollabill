var expect = chai.expect;

describe("dollabill", function () {
  describe("::extend", function () {
    it("extends objects", function () {
      expect(dollabill.extend({}, { a: 1 })).to.equal({ a: 1 });
    });
  });
});