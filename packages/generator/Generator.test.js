const Generator = require("./Generator");

let generator = new Generator();

describe("Generator", () => {
  describe("normalizeScale", () => {
    it("Handles string input", () => {
      let items = generator.normalizeScale("blue");
      expect(items).toEqual({ 677: "#0000ff" });
    });
    it("Handles array input", () => {
      let items = generator.normalizeScale(["blue", "navy"]);
      expect(items).toEqual({ 677: "#0000ff", 870: "#000080" });
    });
    it("Handles object input", () => {
      let items = generator.normalizeScale({
        main: "blue",
        700: "blue",
        900: "navy",
      });
      expect(items).toEqual({ 700: "#0000ff", 900: "#000080" });
    });
    it("Removes transparency", () => {
      let items = generator.normalizeScale("#0000ff80");
      expect(Object.values(items)[0]).toEqual("#8080ff");
    });
    it("Throws on invalid color", () => {
      expect(() => generator.normalizeScale("rainbow")).toThrow();
    });
  });
  describe("scaleColor", () => {
    it("Scales color according to scale", () => {
      let color = generator.scaleColor("blue", 677);
      expect(color).toEqual("#0000ff");
      color = generator.scaleColor("blue", 0);
      expect(color).toEqual("#ffffff");
      color = generator.scaleColor("blue", 1000);
      expect(color).toEqual("#000000");
    });
    it("Throws on empty scale", () => {
      expect(() => generator.scaleColor([])).toThrow();
      expect(() => generator.scaleColor({})).toThrow();
    });
  });
});
