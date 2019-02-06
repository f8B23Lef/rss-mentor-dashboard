const XLSX = require('xlsx');
const constants = require('./constants');

const formGithubNick = nick => nick.trim().toLowerCase();

const formGithubLink = nick => 'https://github.com/'.concat(formGithubNick(nick));

module.exports = () => {
  const students = {};

  const studentsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
  const studentsSheet = studentsWorkbook.Sheets[constants.PAIRS_SHEET];
  const studentsSheetJson = XLSX.utils.sheet_to_json(studentsSheet);

  studentsSheetJson.forEach((element) => {
    const githubNick = formGithubNick(String(element[constants.PAIRS_B]));
    const githubLink = formGithubLink(String(element[constants.PAIRS_B]));
    students[githubNick] = {
      githubLink,
      tasks: [],
    };
  });

  return students;
};
