import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import * as nyans from "@nyans/parser";
import chroma from "chroma-js";
import { kebabCase } from "lodash";
// import PropTypes from "prop-types";

Widget.propTypes = {
  // value,
  // onChange,
  // name,
  // inputProps,
};

const TextField = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #999;
  padding: 0.25rem;
  border-radius: 0.25rem;
  outline: 0;
  font: inherit;
  &:focus {
    border-color: #09f;
    box-shadow: 0 0 0 2px #09f8;
  }
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
`;

export default function Widget({
  value,
  onChange,
  name,
  inputProps,
  ...restProps
}) {
  let items = nyans.parse(value);

  items.push({
    label: `Color ${items.length + 1}`,
    key: `color-${items.length + 1}`,
  });

  if (!onChange) {
    onChange = () => {};
  }

  inputProps = {
    ...inputProps,
    name,
    value,
    onChange: (e) => onChange(e.target.value),
  };

  function setColorValue(key, value) {
    let item = items.find((item) => item.key === key);
    if (!item) {
      item = { key };
      items.push(item);
    }
    item.value = value;
    onChange(nyans.stringify(items));
  }

  function updateColor(key, modifier) {
    let item = items.find((item) => item.key === key);
    if (!item) {
      item = { key };
      items.push(item);
    }
    modifier(item);
    onChange(nyans.stringify(items));
  }

  return (
    <div {...restProps}>
      <textarea
        css={css`
          display: none;
        `}
        {...inputProps}
      />
      <ul
        css={css`
          padding: 0;
          list-style: none;
          display: grid;
          gap: 1rem;
        `}
      >
        {nyans.normalize(items).map((item, index) => {
          // console.log(
          //   item.key,
          //   items.find((rawItem) => rawItem.key === item.key),
          // );
          let rawItem = items.find((rawItem) => rawItem.key === item.key);
          return (
            <li
              key={index}
              css={css`
                display: grid;
                grid-template-columns: max-content 1fr;
                gap: 0.5rem;
              `}
            >
              <input
                css={css`
                  width: 5rem;
                  height: 5rem;
                  grid-row: 1 / span 2;
                `}
                type="color"
                value={
                  chroma.valid(item.value) && chroma(item.value).hex("rgb")
                }
                onChange={(e) => setColorValue(item.key, e.target.value)}
              />
              <div
                css={css`
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
                  gap: 0.5rem;
                `}
              >
                <div>
                  <Label htmlFor={`label-${item.key}`}>Label</Label>
                  <TextField
                    type="text"
                    id={`label-${item.key}`}
                    value={item.label}
                    onChange={(e) =>
                      updateColor(item.key, (item) => {
                        item.label = e.target.value;
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`name-${item.key}`}>Key</Label>
                  <TextField
                    type="text"
                    id={`name-${item.key}`}
                    value={rawItem.name}
                    placeholder={kebabCase(item.key)}
                    onChange={(e) =>
                      updateColor(
                        item.key,
                        (item) => (item.name = e.target.value),
                      )
                    }
                    onBlur={(e) =>
                      updateColor(
                        item.key,
                        (item) => (item.name = kebabCase(e.target.value)),
                      )
                    }
                  />
                </div>
              </div>
              <div
                css={css`
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
                  gap: 0.25rem;
                  align-items: stretch;
                  justify-items: stretch;
                  font-family: monospace;
                  font-weight: 400;
                  font-size: 0.75rem;
                  line-height: normal;
                  grid-column: 2 / -1;
                `}
              >
                {Object.entries(item.shades).map(([i, value]) => {
                  let color = chroma(value);
                  return (
                    <div
                      key={i}
                      css={css`
                        background-color: ${color.hex()};
                        color: ${chroma.contrast(color, "white") <
                        chroma.contrast(color, "black")
                          ? "black"
                          : "white"};
                        flex: 1 1 auto;
                        text-align: center;
                        display: grid;
                        align-items: center;
                        align-content: center;
                        min-height: 3rem;
                        padding: 0.25rem;
                      `}
                    >
                      <span
                        css={css`
                          font-size: 1.25;
                          font-weight: 600;
                        `}
                      >
                        {i}
                      </span>
                      <span>{color.hex()}</span>
                      {/* <span>{Math.round(color.get("hcl.l"))}</span>
                      <span>{Math.round(color.luminance() * 100) / 100}</span> */}
                      {/* <span>
                          {(chroma("white").luminance() + 0.05) /
                            (color.luminance() + 0.05)}
                        </span> */}
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
      <pre>
        <code>{value}</code>
      </pre>
      <pre>
        <code>{JSON.stringify({ items }, null, 2)}</code>
      </pre>
    </div>
  );
}
