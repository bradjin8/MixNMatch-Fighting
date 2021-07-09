module.exports = {
  env: {
    es6: true,
    node: true,
    node: true,
    jest: true,
    browser: true,
  },
  globals: {
    require: true,
    global: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  extends: [
    'prettier',
    'prettier/react',
    'plugin:react/recommended',
    'eslint-config-prettier',
    'idiomatic',
    'eslint:recommended',
  ],
  parser: 'babel-eslint',
  rules: {
    'import/no-unresolved': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-labels': 0,
    'brace-style': [2, 'stroustrup'],
    'jsx-quotes': [2, 'prefer-single'],
    'react/jsx-boolean-value': [2, 'always'],
    'react/jsx-closing-bracket-location': [
      2,
      {
        selfClosing: 'after-props',
        nonEmpty: 'after-props',
      },
    ],
    'react/jsx-curly-spacing': [
      2,
      'never',
      {
        allowMultiline: false,
      },
    ],
    'react/jsx-max-props-per-line': [
      2,
      {
        maximum: 3,
      },
    ],
    'react/jsx-no-literals': 0,
    'react/prop-types': [
      2,
      {
        ignore: ['dispatch'],
      },
    ],
    'react/self-closing-comp': 2,
    'react/sort-comp': 2,
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 0,
    'react-native/no-color-literals': 0,
    semi: [2, 'always'],
    'space-in-parens': [2, 'never'],
    'array-bracket-spacing': [2, 'never'],
    'one-var': 0,
    'func-names': 0,
    'computed-property-spacing': 0,
    'no-useless-escape': 0,
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'ignore',
      },
    ],
    'valid-jsdoc': [
      'error',
      {
        prefer: {
          arg: 'param',
          argument: 'param',
          return: 'returns',
        },
        preferType: {
          object: 'Object',
          array: 'Array',
          string: 'String',
          number: 'Number',
          boolean: 'Boolean',
          promise: 'Promise',
        },
        requireReturn: false,
        requireReturnType: true,
        requireParamDescription: false,
        requireReturnDescription: false,
        matchDescription: '.+',
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'directive',
        next: 'directive',
      },
      {
        blankLine: 'always',
        prev: 'import',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'import',
        next: 'import',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: 'export',
      },
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export',
      },
      {
        blankLine: 'always',
        prev: 'function',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'function',
      },
      {
        blankLine: 'always',
        prev: 'block-like',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'block-like',
      },
      {
        blankLine: 'always',
        prev: 'class',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'class',
      },
    ],
  },
  plugins: ['react', 'react-native'],
};
