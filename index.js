/**
 * Creates a new object which is the result of merging the two given objects.
 * The objects are deeply merged unless the `option.overwrite` is specified.
 * It differes from a usual deep merge, by automatically creating an array if
 * the property is defined on both objects, and they aren't both objects or
 * arrays themselves.
 * For example: mergeObjects({ a: 1 }, { a: 2 }) === { a: [1, 2] }
 * Most configs accept both, an item directly and an array of items. This makes
 * it easier to combine them. It can be disabled by setting `option.createArray`
 * to `false`.
 * This behaviour is also disabled when `option.shallow` is `true`.
 *
 * @param {Object} base The base config.
 * @param {Object} extension The config that extends the base config.
 * @param {Object} [options = {}]
 * @param {Boolean} [options.createArray = true] Create an array when a property
 * is defined in both objects, and they aren't both objects.
 * @param {Boolean} [options.shallow = false] Create a shallow merge instead of
 * a deep merge.
 * @returns {Object} The result of merging the base and extension config.
 */
function mergeObjects(base, extension, options = { createArray: true }) {
  if (options.shallow) {
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
      if (options.createArray) {
        merged[key] = [merged[key], extension[key]];
      } else {
        merged[key] = extension[key];
      }
    }
  }
  return merged;
}

/**
 * Creates a config by merging the `common` config and the config(s) that match
 * the current CONFIG_BY_ENV (if set) or NODE_ENV. If neither CONFIG_BY_ENV nor
 * NODE_ENV is set, it defaults to `development`.
 *
 * @param {Object} config Each property is a config (object) which will be
 * merged into the final config when the key matches the environment.
 * Additionally the `common` property can be used, which will always be used,
 * regardless of the current environment.
 *
 * @param {Object} [options = {}]
 * @param {Boolean} [options.createArray = true] Create an array when a property
 * is defined in both objects, and they aren't both objects.
 * @param {Boolean} [options.shallow = false] Create a shallow merge instead of
 * a deep merge.
 * @param {Boolean} [options.skipCommon = false] Do not use the common config as
 * the base config.
 * @returns {Object} The config created by merging the common config with the
 * config(s) of the current NODE_ENV.
 */
function configByEnv(config, options = { createArray: true }) {
  const env =
    process.env.CONFIG_BY_ENV || process.env.NODE_ENV || 'development';
  let finalConfig = {};

  if (!options.skipCommon && typeof config.common === 'object') {
    Object.assign(finalConfig, config.common);
  }
  for (const key of env.split(',')) {
    if (typeof config[key] === 'object') {
      finalConfig = mergeObjects(finalConfig, config[key], options);
    }
  }
  return finalConfig;
}

module.exports = configByEnv;
module.exports.default = configByEnv;
module.exports.mergeObjects = mergeObjects;
