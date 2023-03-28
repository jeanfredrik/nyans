const Parser = require("./Parser");

const parser = new Parser();

module.exports = parser;

exports.normalize = parser.normalize.bind(parser);
exports.parse = parser.parse.bind(parser);
exports.stringify = parser.stringify.bind(parser);
