
const BABEL_ENV = process.env.BABEL_ENV

const npmPackage = require('./package');

const productName = npmPackage.name;

const customBabelMap = npmPackage.customBabelMap;

const base = customBabelMap.base;
const overrides = customBabelMap.overrides;
const additions = customBabelMap.additions;

let presets = base.presets;
let plugins = base.plugins;

function getShared(section, env, type) {
  const shared = section.shared;
  const results = [];
  if (shared !== undefined) {
    for (let aShared of shared) {
      if (aShared.envs.indexOf(env) !== -1 && aShared[type] !== undefined) {
        results.push(aShared[type]);
      }
    }
  }
  return results;
}

function getSingle(section, env, type) {
  const single = section[env];
  let result = null;
  if (single !== undefined) {
    if (single[type] !== undefined) {
      result = single[type];
    }
  }
  return result;
}

function getOne(section, env, type) {
  const shared = getShared(section, env, type);
  const single = getSingle(section, env, type);
  if (single !== null) {
    if (shared.length > 0) {
      throw new Error('Multiple ' + section + ' found for ' + env + ' ' + type);
    }
    return single;
  }
  else {
    if (shared.length > 1) {
      throw new Error('Multiple ' + section + ' found for ' + env + ' ' + type);
    }
    return shared.length === 1 ? shared[0] : null;
  }
}

function getAll(section, env, type) {
  let results = [];
  const shared = getShared(section, env, type);
  for (let aShared of shared) {
    results = results.concat(aShared);
  }
  const single = getSingle(section, env, type);
  if (single !== null) {
    results = results.concat(single);
  }
  return results;
}

if (overrides !== undefined) {
  const overridePresets = getOne(overrides, BABEL_ENV, 'presets');
  if (overridePresets !== null) {
    presets = overridePresets;
  }
  const overridePlugins = getOne(overrides, BABEL_ENV, 'presets');
  if (overridePresets !== null) {
    presets = overridePresets;
  }
}

if (additions !== undefined) {
  presets = presets.concat(getAll(additions, BABEL_ENV, 'presets'));
  plugins = plugins.concat(getAll(additions, BABEL_ENV, 'plugins'));
}

const babelConfig = {
  presets: presets,
  plugins: plugins
};

console.log(productName + ' using babel config:\n----');
console.log(JSON.stringify(babelConfig, null, '\t'));
console.log('----');

module.exports = babelConfig;

