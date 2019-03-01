const fs = require('fs');
const mkdirp = require('mkdirp');
const constants = require('./constants');

const { mergeData } = require('./jsonMerger');

const writeJsonToFile = (data) => {
  /* eslint-disable no-console */
  mkdirp(constants.JSON_PATH, (errDir) => {
    if (!errDir) {
      fs.writeFile(`${constants.JSON_PATH}${constants.JSON_FILE}`, JSON.stringify(data, null, 2), 'utf8', (errFile) => {
        if (errFile) {
          console.error(`--- json is not written to file ${errFile} ---`);
        } else {
          console.log(`--- json is written to file: ${constants.JSON_PATH}${constants.JSON_FILE} ---`);
        }
      });
    } else {
      console.error(errDir);
    }
  });
};

writeJsonToFile(mergeData());
