// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  '.', // Look for files in the current directory
  true, // useSubdirectories
  /_[\w-]+\.vue$/, // Only include "_base-" prefixed .vue files
  'sync' // mode
)
// For each matching file name...
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName) // Get the component config
  const componentName = fileName // Get the PascalCase version of the component name
    .replace(/^.*\/_/, '') // Remove the "./_" from the beginning
    .replace(/\.\w+$/, '') // Remove the file extension from the end
    .split('-') // Split up kebabs
    .map(kebab => kebab.charAt(0).toUpperCase() + kebab.slice(1)) // Upper case
    .join('') // Concatenated
  Vue.component(componentName, componentConfig.default || componentConfig) // Globally register the component
})
