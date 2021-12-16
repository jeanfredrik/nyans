import Parser from "./Parser";

const parser = new Parser();

export default parser;

export const normalize = parser.normalize.bind(parser);
export const parse = parser.parse.bind(parser);
export const stringify = parser.stringify.bind(parser);
