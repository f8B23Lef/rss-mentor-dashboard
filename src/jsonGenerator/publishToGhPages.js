/* eslint-disable no-console */
const ghpages = require('gh-pages');
const constants = require('./constants');

ghpages.publish('dist', {
  repo: constants.PUBLISH_PATH,
  add: true,
}, (err) => {
  if (err) {
    console.log(`--- project failed to publish: ${err} ---`);
  } else {
    console.log(`--- project is published: ${constants.PUBLISH_PATH} ---`);
  }
});
