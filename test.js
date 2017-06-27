const test = require('jest-t-assert').default;
const configByEnv = require('./');
const { mergeObjects } = configByEnv;

test('returns an empty object when no appropriate key exists', t => {
  const config = { something: { x: 1 }, other: { a: 99 } };
  const result = configByEnv(config);
  t.deepEqual(result, {});
});

test('returns the common configuration if it exists', t => {
  const config = { common: { x: 1, y: 2 } };
  const result = configByEnv(config);
  t.deepEqual(result, config.common);
});

test('returns the config from the key matching NODE_ENV with no common', t => {
  const old_env = process.env.NODE_ENV;
  process.env.NODE_ENV = 'special';
  const config = { special: { x: 1, y: 2 } };
  const result = configByEnv(config);
  t.deepEqual(result, config.special);
  process.env.NODE_ENV = old_env;
});

test('uses the development config if no NODE_ENV is set', t => {
  const old_env = process.env.NODE_ENV;
  delete process.env.NODE_ENV;
  const config = { special: { x: 1, y: 2 }, development: { a: 99 } };
  const result = configByEnv(config);
  t.deepEqual(result, config.development);
  process.env.NODE_ENV = old_env;
});

test('combines the common and the specified config', t => {
  const old_env = process.env.NODE_ENV;
  process.env.NODE_ENV = 'special';
  const config = { common: { x: 1 }, special: { y: 2 } };
  const result = configByEnv(config);
  t.deepEqual(result, { x: 1, y: 2 });
  process.env.NODE_ENV = old_env;
});

test('combines the common and multiple specified configs', t => {
  const old_env = process.env.NODE_ENV;
  process.env.NODE_ENV = 'special,other,last';
  const config = {
    common: { x: 1 },
    special: { y: 2 },
    other: { z: 3 },
    last: { xyz: 123 }
  };
  const result = configByEnv(config);
  t.deepEqual(result, { x: 1, y: 2, z: 3, xyz: 123 });
  process.env.NODE_ENV = old_env;
});

test('overwrites the base properties when the overwrite option is used', t => {
  const base = { a: 1, b: 2 };
  const extension = { a: 99, c: 33 };
  const result = mergeObjects(base, extension, { overwrite: true });
  t.deepEqual(result, { a: 99, b: 2, c: 33 });
});

test('combines the properties into an array', t => {
  const base = { a: 1, b: [2, 3], c: 4, d: [5, 6] };
  const extension = { a: 99, b: 87, c: [42, 12], d: [22, 33] };
  const result = mergeObjects(base, extension);
  const expected = {
    a: [1, 99],
    b: [2, 3, 87],
    c: [4, 42, 12],
    d: [5, 6, 22, 33]
  };
  t.deepEqual(result, expected);
});

test('merges properties deeply when both are an object', t => {
  const base = {
    obj: { a: 1, b: [2, 3], c: 4, d: [5, 6] },
    x: 7,
    y: { e: 8 }
  };
  const extension = {
    obj: { a: 99, b: 87, c: [42, 12], d: [22, 33] },
    x: { e: 60 },
    y: 70
  };
  const result = mergeObjects(base, extension);
  const expected = {
    obj: {
      a: [1, 99],
      b: [2, 3, 87],
      c: [4, 42, 12],
      d: [5, 6, 22, 33]
    },
    x: [7, { e: 60 }],
    y: [{ e: 8 }, 70]
  };
  t.deepEqual(result, expected);
});
