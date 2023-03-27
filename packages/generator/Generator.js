const chroma = require("chroma-js");
const { fromPairs, isArray, mapValues, pickBy } = require("lodash");

const DEFAULT_SCALE_MODE = "hcl";

function removeTransparency(color) {
  color = chroma(color);
  let alpha = color.alpha();
  if (alpha === 1) {
    return color;
  }
  return chroma.mix(color.alpha(1), "white", alpha, "rgb");
}

module.exports = class Generator {
  normalizeScale(scale) {
    if (typeof scale === "string") {
      let main = chroma.valid(scale) && removeTransparency(chroma(scale));
      if (!main) {
        throw new Error(`Invalid color: ${scale}`);
      }
      scale = [main];
    }
    if (isArray(scale)) {
      scale = fromPairs(
        scale.map((shade) => {
          shade = chroma(shade);
          return [Math.round(1000 - chroma(shade).get("hcl.l") * 10), shade];
        }),
      );
    } else if (typeof scale === "object") {
      scale = pickBy(scale, (value, key) => !isNaN(key));
    }
    scale = mapValues(scale, (value) => chroma(value).hex("rgb"));
    return scale;
  }
  /**
   *
   * @param {string|array|object} scale Either a string containing the main color, or an array of tints and shades, or an object containing tints and shades
   * @param {*} shade
   * @param {*} options
   * @returns
   */
  scaleColor(scale, shade, { autoShadeScaleMode = DEFAULT_SCALE_MODE } = {}) {
    scale = this.normalizeScale(scale);
    if (!Object.values(scale).length) {
      throw new Error("Scale is empty");
    }
    scale = chroma
      .scale(["white", ...Object.values(scale), "black"])
      .mode(autoShadeScaleMode)
      // .correctLightness()
      .domain([0, ...Object.keys(scale).map(Number), 1000]);
    return scale(shade).hex("rgb");
  }
};
