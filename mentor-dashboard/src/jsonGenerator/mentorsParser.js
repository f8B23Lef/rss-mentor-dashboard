const XLSX = require('xlsx');
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

module.exports = () => {
  const mentors = {};

  const mentorsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
  const mentorsSheet = mentorsWorkbook.Sheets[constants.MENTORS_SHEET];
  const mentorsSheetJson = XLSX.utils.sheet_to_json(mentorsSheet);

  mentorsSheetJson.forEach((element) => {
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

  const pairsSheet = mentorsWorkbook.Sheets[constants.PAIRS_SHEET];
  const pairsSheetJson = XLSX.utils.sheet_to_json(pairsSheet);

  Object.keys(mentors).forEach((githubNick) => {
    mentors[githubNick].students = [];
    pairsSheetJson.forEach((element) => {
      if (mentors[githubNick].name === formName(element[constants.PAIRS_A])) {
        mentors[githubNick].students.push(element[constants.PAIRS_B]);
      }
    });
  });

  return mentors;
};
