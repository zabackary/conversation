/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import _generate from "@babel/generator";
import { parse, ParserOptions } from "@babel/parser";
import _traverse from "@babel/traverse";
import * as t from "@babel/types";
import { PluginOption } from "vite";

// @ts-expect-error See https://github.com/babel/babel/issues/13855
const traverse: typeof _traverse = _traverse.default;

// @ts-expect-error See https://github.com/babel/babel/issues/13855
const generate: typeof _generate = _generate.default;

const GLOBAL_IDENTIFIER_NAME = "__GAS_TOP_LEVEL__";

export interface GasTopLevelOptions {
  entry: RegExp;

  parserOptions: ParserOptions;
}

export default function gasTopLevel(
  userOptions: Partial<GasTopLevelOptions>
): PluginOption {
  const options: GasTopLevelOptions = {
    entry: /.^/,
    parserOptions: {},
    ...userOptions,
  };
  let banner = `const ${GLOBAL_IDENTIFIER_NAME} = this;`;
  let used = false;
  let entryId: string | undefined;
  return {
    name: "gas-top-level",
    renderChunk(source, chunk) {
      if (chunk.moduleIds.includes(entryId ?? "")) {
        console.log("banner:", banner);
        console.log(banner + source);
        return banner + source;
      }
      return source;
    },
    transform(source, id) {
      if (options.entry.test(id)) {
        if (used) {
          console.warn(
            `Only one entry is allowed per gas-top-level invocation. ` +
              `Create another plugin instance. Ignoring: ${id}`
          );
          return source;
        }
        used = true;
        entryId = id;
        const ast = parse(
          source,
          Object.assign<ParserOptions, ParserOptions>(options.parserOptions, {
            sourceType: "unambiguous",
          })
        );
        traverse(ast, {
          AssignmentExpression({ node }) {
            if (
              node.left.type === "MemberExpression" &&
              node.left.object.type === "Identifier" &&
              node.left.object.name === "topLevelFunction" &&
              node.left.property.type === "Identifier"
            ) {
              node.left.object = t.identifier(GLOBAL_IDENTIFIER_NAME);
              banner += `function ${node.left.property.name}(){}`;
            }
          },
        });
        const generated = generate(ast);
        console.log(generated);
        return generated;
      }
      return source;
    },
  };
}
