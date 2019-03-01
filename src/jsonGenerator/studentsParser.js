const XLSX = require('xlsx');
const constants = require('./constants');

const formGithubNick = nick => nick.trim().toLowerCase();

const formGithubLink = nick => 'https://github.com/'.concat(formGithubNick(nick));

const buildStudentsJson = () => {
  const studentsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
  const studentsSheet = studentsWorkbook.Sheets[constants.PAIRS_SHEET];
  const studentsJson = XLSX.utils.sheet_to_json(studentsSheet);

  return studentsJson;
};

const parseStudentsJson = (studentsJson) => {
  const students = {};

  studentsJson.forEach((element) => {
    const githubNick = formGithubNick(String(element[constants.PAIRS_B]));
    const githubLink = formGithubLink(String(element[constants.PAIRS_B]));
    students[githubNick] = {
      githubLink,
      tasks: [],
    };
  });

  return students;
};

const buildStudentsData = () => parseStudentsJson(buildStudentsJson());

module.exports = {
  buildStudentsData,
  // export for tests
  parseStudentsJson,
};
