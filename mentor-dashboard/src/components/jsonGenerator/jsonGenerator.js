// const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const XLSX = require('xlsx');

const constants = require('./constants/constants');

const tasks = require('./tasks');
const students = require('./students');
const mentors = require('./mentors');

console.log('---json generate---', Object.keys(tasks).length, Object.keys(students).length, Object.keys(mentors).length);

const data = {
  tasks,
  students,
  mentors,
};

const writeFile = (str) => {
  /* eslint-disable no-console */
  mkdirp(constants.JSON_PATH, (errDir) => {
    if (errDir) {
      console.error(errDir);
    } else {
      fs.writeFile(`${constants.JSON_PATH}${constants.JSON_FILE}`, JSON.stringify(str, null, 2), 'utf8', (errFile) => {
        if (errFile) {
          console.error(errFile);
        } else {
          console.log(`--- json is generated: ${constants.JSON_PATH}${constants.JSON_FILE} ---`);
        }
      });
    }
  });
};

writeFile(data);
