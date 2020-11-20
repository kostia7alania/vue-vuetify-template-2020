const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  extends: [ 'airbnb-base', 'plugin:vue/recommended', '@vue/prettier', ],
  // extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    // https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    // sourceType: 'script',
  },
  settings: {
    'import/resolver': {
      'alias': {
        modules: ['node_modules'],
        extensions: ['.js', '.vue'],
        map: [
          ['@', './src'],
          ['~', './']
          // your aliases go here.
        ],
      }
    },
  },
  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  // https://eslint.org/docs/user-guide/configuring#specifying-globals
  globals: {
    process: true,
  },
  // https://eslint.org/docs/user-guide/configuring#configuring-plugins
  // https://github.com/vuejs/eslint-plugin-vue
  plugins: [
    'vue', // required to lint *.vue files
  ],
  // add your custom rules here
  rules: {
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
          'el',
          'obj',
        ],
      },
    ],

    // for vuex modules
    'no-shadow': [
      'error',
      {
        allow: ['state', 'getters'],
      },
    ],
    'import/extensions': [
      1,
      'always',
      {
        js: 'never',
        vue: 'never',
        json: 'never'
      }
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    // allow async-await
    'generator-star-spacing': 'off',
    'space-before-function-paren': 'off',
    'no-mixed-operators': 'off',
    // allow debugger during development
    'no-debugger': isProduction ? 'error' : 'off',
    'no-console': 0, // isProduction ? 2 : 0,
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: [],
      },
    ],
    'array-callback-return': 'off',
    'handle-callback-err': 'off',
    'no-return-assign': 'off',
    'vue/no-v-html': 'off',
    'vue/return-in-computed-property': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'default-case': 0,
    'no-plusplus': 0
    /* 'no-unused-expressions': [2, { allowTernary: true }],
    'no-unused-vars': 0,
    'vue/require-valid-default-prop': 0,
    eqeqeq: 0,
    'import/extensions': 0,
    camelcase: 0,
    'vue/require-prop-types': 0,
    'vue/order-in-components': 0,
    'vue/require-prop-type-constructor': 0,
    'no-bitwise': 0,
    */
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'max-len': [
          'error',
          120,
          2,
          {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
          },
        ],
      },
    },
  ],
}
