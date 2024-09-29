import type { AstPath, Printer, Doc } from "prettier";

const { parsers: tsParsers } = require("prettier/parser-typescript");
const { concat, group, hardline, softline, join, indent } =
  require("prettier").doc.builders;

const printers = require("prettier/plugins/estree");
const estreePrinter = printers.printers.estree.print;
const estreePrintComment = printers.printers.estree.printComment;
const esTreeCanAttachComment = printers.printers.estree.canAttachComment;

module.exports = {
  parsers: {
    typescript: {
      ...tsParsers.typescript,
      astFormat: "custom-ts", // Custom AST format for TypeScript
    },
  },
  printers: {
    "custom-ts": {
      ...printers.printers.estree,
      print(path: AstPath<any>, options: any, print: any): Doc {
        const node = path.getValue();

        // Safely handle 'on(...).do(...)' CallExpression chain
        if (
          node.type === "CallExpression" &&
          node.callee &&
          node.callee.type === "MemberExpression" &&
          node.callee.object &&
          node.callee.object.type === "CallExpression" &&
          node.callee.object.callee &&
          node.callee.object.callee.name === "on" &&
          node.callee.property &&
          node.callee.property.name === "do"
        ) {
          // Safely handle 'on(...)' arguments using path.map to avoid recursion
          const onArguments = path.map(print, "callee", "object", "arguments");

          // Safely handle 'do(...)' arguments using path.map to avoid recursion
          const doArguments = path.map(print, "arguments");

          return group(
            concat([
              "on(",
              indent(
                concat([softline, join(concat([",", softline]), onArguments)]),
              ),
              softline,
              ").do(",
              concat(join(", ", doArguments)),
              ")",
            ]),
          );
        }

        // For other nodes, fallback to the default behavior by calling Prettier's provided print function
        return estreePrinter(path, options, print);
      },
    },
  },
};
