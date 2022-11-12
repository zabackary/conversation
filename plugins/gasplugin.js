/**
 * From https://npmjs.com/package/gas-webpack-plugin
 */

// eslint-disable-next-line max-classes-per-file
import { generate } from "gas-entry-generator";
import minimatch from "minimatch";
import { isAbsolute, resolve } from "path";
import slash from "slash";
import webpackSources from "webpack-sources";
// eslint-disable-next-line import/extensions
import Dependency from "webpack/lib/Dependency.js";

const { RawSource, SourceMapSource } = webpackSources;

const defaultOptions = {
  comment: true,
  autoGlobalExportsFiles: [],
  include: ["**/*"],
};

function GasPlugin(options) {
  this.options = { ...defaultOptions, ...(options || {}) };
}

function gasify(compilation, chunk, filename, entryFunctions) {
  const asset = compilation.assets[filename];
  let source;
  let map;
  if (asset.sourceAndMap) {
    const sourceAndMap = asset.sourceAndMap();
    source = sourceAndMap.source;
    map = sourceAndMap.map;
  } else {
    source = asset.source();
    map = typeof asset.map === "function" ? asset.map() : null;
  }

  const entries = compilation.chunkGraph
    .getChunkModules(chunk)
    .filter((module) => !!entryFunctions.get(module.rootModule || module))
    .map(
      (module) =>
        entryFunctions.get(module.rootModule || module).entryPointFunctions
    )
    .filter((entry) => !!entry)
    .join("\n");

  const needsGlobalObject = compilation.chunkGraph
    .getChunkModules(chunk)
    .filter((module) => !!entryFunctions.get(module.rootModule || module))
    .some(
      (module) =>
        !!entryFunctions.get(module.rootModule || module).globalAssignments
    );

  const gasified =
    (needsGlobalObject ? "var global = this;\n" : "") + entries + source;
  // eslint-disable-next-line no-param-reassign
  compilation.assets[filename] = map
    ? new SourceMapSource(gasified, filename, map)
    : new RawSource(gasified);
}

class GasDependency extends Dependency {
  constructor(m) {
    super();
    this.m = m;
  }
}

GasDependency.Template = class GasDependencyTemplate {
  constructor(options) {
    this.comment = options.comment;
    this.autoGlobalExportsFilePatterns = options.autoGlobalExportsFilePatterns;
    this.includePatterns = options.includePatterns;
    this.entryFunctions = new Map();
  }

  // eslint-disable-next-line class-methods-use-this
  match(target, pattern) {
    return minimatch(slash(target), slash(pattern));
  }

  apply(dep, source) {
    const module = dep.m;
    if (
      !this.includePatterns.some((file) => this.match(module.resource, file)) ||
      module.resource.split(".").at(-1) === "ejs" // Ignore ejs files (change from source)
    ) {
      return;
    }
    const options = {
      comment: this.comment,
      autoGlobalExports:
        module.resource &&
        this.autoGlobalExportsFilePatterns.some((file) =>
          this.match(module.resource, file)
        ),
    };

    const originalSource =
      typeof source.original === "function"
        ? source.original().source()
        : source.source();

    const output = generate(originalSource, options);
    this.entryFunctions.set(module, output);
    if (output.globalAssignments) {
      source.insert(originalSource.length, output.globalAssignments);
    }
  }
};

GasPlugin.prototype.apply = (compiler) => {
  const { context } = compiler.options;
  const autoGlobalExportsFilePatterns = this.options.autoGlobalExportsFiles.map(
    (file) => (isAbsolute(file) ? file : resolve(context, file))
  );
  const includePatterns = this.options.include.map((file) =>
    isAbsolute(file) ? file : resolve(context, file)
  );

  const plugin = { name: "GasPlugin" };
  const compilationHook = (compilation, { normalModuleFactory }) => {
    const gasDependencyTemplate = new GasDependency.Template({
      comment: this.options.comment,
      autoGlobalExportsFilePatterns,
      includePatterns,
    });

    compilation.dependencyTemplates.set(GasDependency, gasDependencyTemplate);

    const handler = (parser) => {
      parser.hooks.program.tap(plugin, () => {
        parser.state.current.addDependency(
          new GasDependency(parser.state.current)
        );
      });
    };

    normalModuleFactory.hooks.parser
      .for("javascript/auto")
      .tap("GasPlugin", handler);
    normalModuleFactory.hooks.parser
      .for("javascript/dynamic")
      .tap("GasPlugin", handler);
    normalModuleFactory.hooks.parser
      .for("javascript/esm")
      .tap("GasPlugin", handler);

    compilation.hooks.chunkAsset.tap(plugin, (chunk, filename) => {
      gasify(
        compilation,
        chunk,
        filename,
        gasDependencyTemplate.entryFunctions
      );
    });
  };

  compiler.hooks.compilation.tap(plugin, compilationHook);
};

export default GasPlugin;
