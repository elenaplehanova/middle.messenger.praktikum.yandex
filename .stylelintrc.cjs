module.exports = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
  plugins: ["stylelint-scss", "stylelint-order"],
  rules: {
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "scss/operator-no-unspaced": true,
    "order/properties-order": ["position", "z-index"],
  },
  ignoreFiles: ["**/node_modules/**", "**/dist/**"],
};
