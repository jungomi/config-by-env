# config-by-env

[![Build Status][travis-badge]][travis]
[![npm][npm-badge]][npm-link]

Create a config from an object of configs, based on the current environment. The
configs matching the environment will be merged together. A `common` config can
be defined, which will be used as the base config.

## Usage

```javascript
const configByEnv = require('config-by-env');

const configs = {
  common: {
    plugins: ['transform-async-to-generator', 'transform-jsx']
  },
  production: {
    plugins: ['transform-react-remove-prop-types']
  }
};

module.exports = configByEnv(configs);
```

The result depends on the value of `NODE_ENV`. In this case it will always use
the `common` config as a base, but running with `NODE_ENV=production` will merge
the `production` config with `common`.

```javascript
// Regular (any NODE_ENV except production)
{
  plugins: ['transform-async-to-generator', 'transform-jsx']
}

// NODE_ENV=production
{
  plugins: [
    'transform-async-to-generator',
    'transform-jsx',
    'transform-react-remove-prop-types'
  ]
}
```

The environment variable `CONFIG_BY_ENV` can also be used to define the
environment. It takes precedence over `NODE_ENV`. You might want to use
a different config from `NODE_ENV`, especially since multiple values are allowed
by separating them with commas and this could mess up anything else that depends
on it being a single value.

```sh
# Uses the production and the react config, could mess up tools building for production.
NODE_ENV=production,react

# Builds for production but only uses the react config.
NODE_ENV=production CONFIG_BY_ENV=react
```

When neither `CONFIG_BY_ENV` nor `NODE_ENV` is set, it defaults to
`development`.

## API

`configByEnv(configs, [options])`

Creates a config by merging the ones from `configs` that match the environment.

**options**

`createArray` (default: `true`)

When it's set to `true` any property that is defined on two configs, being
merged together, it will automatically combine the two into an array, unless
both are an object, in which case they are deeply merged as well. When it's set
to `false` it will overwrite the value.

```javascript
const configs = {
  common: { a: 1 },
  development: { a: 2 }
};
configByEnv(configs) // { a: [1, 2] }
configByEnv(configs, { createArray: false }) // { a: 2 }
```

`shallow` (default: `false`)

Use either a shallow or a deep merge.

`skipCommon` (default: `false`)

Do not use the `common` config as a base when set to `true`.

[npm-badge]: https://img.shields.io/npm/v/config-by-env.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/config-by-env
[travis]: https://travis-ci.org/jungomi/config-by-env
[travis-badge]: https://img.shields.io/travis/jungomi/config-by-env/master.svg?style=flat-square
