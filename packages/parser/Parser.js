import chroma from "chroma-js";
import { fromPairs, kebabCase, pickBy } from "lodash";
import yaml from "yaml";

function adjustLightness(value) {
  return 1 - (1 - value) ** 0.66;
}

const DEFAULT_SCALE_MODE = "hcl";

export default class Parser {
  stringify(items) {
    let obj = {};
    items.forEach(({ key, ...item }) => {
      console.log({ key, ...item });
      if (!item.value && typeof item.shades !== "object") {
        return;
      }
      if (!key) {
        key = key = item.name || item.label;
      }
      if (!key) {
        return;
      }
      if (item.label === key || item.label === "") {
        delete item.label;
      }
      if (item.name === key || item.name === "") {
        delete item.name;
      }

      if (Object.keys(item).filter((key) => key !== "value").length === 0) {
        obj[key] = item.value;
        return;
      }
      obj[key] = {
        ...item,
      };
    });
    let str = yaml.stringify(obj);
    return str.replace(/"(#[0-9a-fA-F]{3,8})"/g, "$1");
  }

  normalize(
    items,
    {
      autoShadeLevels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      autoShadeScaleMode = DEFAULT_SCALE_MODE,
    } = {},
  ) {
    return items.map((item) => {
      let { key, value, shades = true } = item;
      let color = chroma.valid(value) && chroma(value);
      if (shades === false) {
        shades = {};
      } else {
        let scale;
        if (shades === true) {
          shades = pickBy(item, (value, key) => !isNaN(key));
          item = pickBy(item, (value, key) => isNaN(key));
        } else if (Array.isArray(shades)) {
          shades = fromPairs(
            shades.map((shade) => {
              return [
                Math.round(
                  1000 -
                    adjustLightness(chroma(shade).get("hcl.l") / 100) * 1000,
                ),
                shade,
              ];
            }),
          );
        } else if (typeof shades !== "object") {
          shades = {};
        }
        if (!Object.values(shades).length && color) {
          shades[Math.round(1000 - color.get("hcl.l") * 10)] = value;
          scale = chroma
            .scale(["white", ...Object.values(shades), "black"])
            .mode(autoShadeScaleMode)
            .domain([0, ...Object.keys(shades).map(Number), 1000]);
          shades = fromPairs(
            [100, 200, 300, 400, 500, 600, 700, 800].map((level) => {
              let shade = scale(level)
                .set("hcl.c", color.get("hcl.c"))
                .hex("rgb");
              return [
                Math.round(
                  1000 -
                    adjustLightness(chroma(shade).get("hcl.l") / 100) * 1000,
                ),
                shade,
              ];
            }),
          );
        }
        if (Object.values(shades).length) {
          scale = chroma
            .scale(["white", ...Object.values(shades), "black"])
            .mode(autoShadeScaleMode)
            // .correctLightness()
            .domain([0, ...Object.keys(shades).map(Number), 1000]);
          shades = fromPairs(
            autoShadeLevels.map((level) => [level, scale(level).hex("rgb")]),
          );
        }
      }
      return {
        label: key,
        name: kebabCase(key),
        ...item,
        shades,
      };
    });
  }

  parse(input) {
    try {
      if (typeof input === "string") {
        input = input.replace(/(?<!")#[0-9a-fA-F]{3,8}\b(?!")/g, '"$&"');
        input = yaml.parse(input);
      }
    } catch {
      // Do nothing
    }

    if (Array.isArray(input)) {
      input.map((item) => {
        if (typeof item === "string") {
          item = { value: item };
        }
        return item;
      });
    } else {
      input = Object.entries(input || {}).map(([key, item]) => {
        if (typeof item === "string") {
          item = { value: item };
        }
        return {
          ...item,
          key,
        };
      });
    }

    return input;
  }
}
