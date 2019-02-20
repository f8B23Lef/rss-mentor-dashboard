module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb"],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
  },
  rules: {
    "linebreak-style": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/prefer-stateless-function": [0, { "ignorePureComponents": true }]
  },
};
