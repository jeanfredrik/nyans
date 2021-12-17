import Parser from "./Parser";

let nyans = new Parser();

describe("Parser", () => {
  describe("parse", () => {
    it("Parses Yaml string", () => {
      let items = nyans.parse(`Blue: blue`);
      expect(items).toEqual([{ key: "Blue", value: "blue" }]);

      let normalizedItems = nyans.normalize(items);
      expect(normalizedItems).toMatchObject([
        { key: "Blue", label: "Blue", value: "#0000ff", name: "blue" },
      ]);
    });

    it("Parses array of objects", () => {
      let items = nyans.parse([{ label: "Blue", value: "blue" }]);
      expect(items).toEqual([{ key: "Blue", label: "Blue", value: "blue" }]);

      let normalizedItems = nyans.normalize(items);
      expect(normalizedItems).toMatchObject([
        { key: "Blue", label: "Blue", value: "#0000ff", name: "blue" },
      ]);
    });

    it("Parses array of strings", () => {
      let items = nyans.parse(["blue", "#333"]);
      expect(items).toEqual([
        { key: "0", value: "blue" },
        { key: "1", value: "#333" },
      ]);

      let normalizedItems = nyans.normalize(items);
      expect(normalizedItems).toMatchObject([
        { key: "0", value: "#0000ff" },
        { key: "1", value: "#333333" },
      ]);
    });

    it("Parses object", () => {
      let items = nyans.parse({ Blue: "blue" });
      expect(items).toEqual([{ key: "Blue", value: "blue" }]);

      let normalizedItems = nyans.normalize(items);
      expect(normalizedItems).toMatchObject([
        { key: "Blue", label: "Blue", value: "#0000ff", name: "blue" },
      ]);
    });

    it("Ignores explicit `key`", () => {
      let items = nyans.parse([{ label: "Blue", value: "blue", key: "red" }]);
      expect(items).toMatchObject([{ key: "Blue" }]);
    });

    it("Handles label+value", () => {
      let items = nyans.parse([{ label: "Blå", value: "blue" }]);
      expect(items).toEqual([{ label: "Blå", value: "blue", key: "Blå" }]);

      let normalizedItems = nyans.normalize(items);
      expect(normalizedItems).toMatchObject([
        { key: "Blå", label: "Blå", value: "#0000ff", name: "bla" },
      ]);
    });

    it("Handles name+value", () => {
      let items = nyans.parse([{ name: "blue", value: "#00f" }]);
      expect(items).toEqual([{ name: "blue", value: "#00f", key: "blue" }]);

      let normalizedItems = nyans.normalize(items);
      expect(normalizedItems).toMatchObject([
        { key: "blue", label: "blue", value: "#0000ff", name: "blue" },
      ]);
    });
  });
});
