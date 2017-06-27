# config-by-env

Easily create configs for different environments by defining the parts that are
only used in a specific environment as the property with the name of the
environment. The matching environment(s) will be merged with the `common`
config (if it exists).

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
