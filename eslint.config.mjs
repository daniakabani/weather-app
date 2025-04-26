import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import vuePlugin from 'eslint-plugin-vue'
import * as vueParser from 'vue-eslint-parser'

/** @type {import("eslint").FlatConfig[]} */
const config = [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'vue': vuePlugin
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...vuePlugin.configs.base.rules,
      ...vuePlugin.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    rules: {
      ...prettier.rules
    }
  }
]

export default config
