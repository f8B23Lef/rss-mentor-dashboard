const XLSX = require('xlsx');
const _ = require('lodash');
const constants = require('./constants');

const formGithubNick = (link) => {
  if (link.endsWith('/')) {
    const tmpLink = link.slice(0, -1);
    return tmpLink.slice(tmpLink.lastIndexOf('/') + 1).toLowerCase();
  }

  return link.slice(link.lastIndexOf('/') + 1).toLowerCase();
};

const formGithubLink = link => 'https://github.com/'.concat(formGithubNick(link));

const formName = str => str.trim().toLowerCase().replace(/[\s]*/g, '');

const buildMentorsJson = () => {
  const mentorsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
  const mentorsSheet = mentorsWorkbook.Sheets[constants.MENTORS_SHEET];
  const mentorsJson = XLSX.utils.sheet_to_json(mentorsSheet);

  return mentorsJson;
};

const parseMentorsJson = (mentorsJson) => {
  const mentors = {};

  mentorsJson.forEach((element) => {
    const firstName = formName(element[constants.MENTORS_A]);
    const lastName = formName(element[constants.MENTORS_B]);

    const name = firstName.concat(lastName);
    const githubLink = formGithubLink(String(element[constants.MENTORS_E]));
    const githubNick = formGithubNick(String(element[constants.MENTORS_E]));
    mentors[githubNick] = {
      githubLink,
      name,
    };
  });

  return mentors;
};

const buildPairsJson = () => {
  const mentorsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
  const pairsSheet = mentorsWorkbook.Sheets[constants.PAIRS_SHEET];
  const pairsJson = XLSX.utils.sheet_to_json(pairsSheet);

  return pairsJson;
};

const parsePairsJson = (pairsJson, mentors) => {
  const mergedMentors = _.cloneDeep(mentors);

  Object.keys(mergedMentors).forEach((githubNick) => {
    mergedMentors[githubNick].students = [];
    pairsJson.forEach((element) => {
      if (mergedMentors[githubNick].name === formName(element[constants.PAIRS_A])) {
        mergedMentors[githubNick].students.push(element[constants.PAIRS_B]);
      }
    });
  });

  return mergedMentors;
};

const buildMentorsData = () => {
  const mentors = parseMentorsJson(buildMentorsJson());
  const mergedMentors = parsePairsJson(buildPairsJson(), mentors);

  return mergedMentors;
};

module.exports = {
  buildMentorsData,
  // export for tests
  parseMentorsJson,
  parsePairsJson,
};
