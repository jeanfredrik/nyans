/** @jsx jsx */

import PropTypes from "prop-types";
import { css, jsx } from "@emotion/react";
import { Fragment } from "react";

Widget.propTypes = {
  className: PropTypes.string,
};

export default function Widget({ ...restProps }) {
  return <div {...restProps}>{/* contents */}</div>;
}
