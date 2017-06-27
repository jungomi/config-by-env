function mergeObjects(base, extension, options = {}) {
  if (options.overwrite) {
    return Object.assign({}, base, extension);
  }

  const merged = Object.assign({}, base);
  for (const key of Object.keys(extension)) {
    if (typeof merged[key] === 'undefined') {
      merged[key] = extension[key];
    } else if (Array.isArray(merged[key])) {
      if (Array.isArray(extension[key])) {
        merged[key].push(...extension[key]);
      } else {
        merged[key].push(extension[key]);
      }
    } else if (Array.isArray(extension[key])) {
      merged[key] = [merged[key], ...extension[key]];
    } else if (
      typeof merged[key] === 'object' &&
      typeof extension[key] === 'object'
    ) {
      merged[key] = mergeObjects(merged[key], extension[key], options);
    } else {
      merged[key] = [merged[key], extension[key]];
    }
  }
  return merged;
}

function configByEnv(config) {
  const env = process.env.NODE_ENV || 'development';
  let finalConfig = {};

  if (typeof config.common === 'object') {
    Object.assign(finalConfig, config.common);
  }
  for (const key of env.split(',')) {
    if (typeof config[key] === 'object') {
      finalConfig = mergeObjects(finalConfig, config[key]);
    }
  }
  return finalConfig;
}

module.exports = configByEnv;
module.exports.default = configByEnv;
module.exports.mergeObjects = mergeObjects;
