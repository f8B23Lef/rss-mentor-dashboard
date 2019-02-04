// const _ = require('lodash');
const XLSX = require('xlsx');

const constants = require('./constants/constants');

const formGithubNick = nick => nick.trim().toLowerCase();

const formGithubLink = nick => 'https://github.com/'.concat(formGithubNick(nick));

// const removeDuplicateByKey = (students, key) => _.uniqBy(students, key);
// -------------------------------------------------------------------------
const studentsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
const studentsSheet = studentsWorkbook.Sheets[constants.PAIRS_SHEET];
const studentsSheetJson = XLSX.utils.sheet_to_json(studentsSheet);

const students = {};

studentsSheetJson.forEach((element) => {
  const githubNick = formGithubNick(String(element[constants.PAIRS_B]));
  const githubLink = formGithubLink(String(element[constants.PAIRS_B]));
  students[githubNick] = {
    githubLink,
  };
});

console.log('students: ', students);

module.exports = Object.freeze(students);
// -------------------------------------------------------------------------
// const removeSlashFromTheEnd = (link) => {
//   if (link.endsWith('/')) {
//     return link.slice(0, -1);
//   }

//   return link;
// };

// const formGithubNick2 = (link) => {
//   const linkWithoutEndSlash = removeSlashFromTheEnd(link).trim().toLowerCase();

//   const incorrectEnd = '-2018q3';

//   if (linkWithoutEndSlash.endsWith(incorrectEnd)) {
//     const linkWihoutIncorrectEnd = linkWithoutEndSlash.slice(0, -incorrectEnd.length);
//     return linkWihoutIncorrectEnd.slice(linkWihoutIncorrectEnd.lastIndexOf('/') + 1);
//   }

//   return linkWithoutEndSlash.slice(linkWithoutEndSlash.lastIndexOf('/') + 1);
// };

// const formGithubLink2 = link => 'https://github.com/'.concat(formGithubNick2(link));
// // -------------------------------------------------------------------------
// const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
// const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
// const scoreSheetJson = XLSX.utils.sheet_to_json(scoreSheet);

// const studentsTmp2 = [];

// scoreSheetJson.forEach((element) => {
//   studentsTmp2.push({
//     githubLink: formGithubLink2(element[constants.SCORE_C]),
//     githubNick: formGithubNick2(element[constants.SCORE_C]),
//   });
// });

// const students2 = removeDuplicateByKey(studentsTmp2, 'githubNick');

// console.log('students2: ', students2, students2.length);
// // -------------------------------------------------------------------------
// // console.log('union: ', _.unionBy(students, students2, 'githubNick'), '1:', students.length, '2:', students2.length, _.unionBy(students, students2, 'githubNick').length);
// console.log('difference: ', _.differenceBy(students2, students, 'githubNick'), '1:', students.length, '2:', students2.length, _.differenceBy(students2, students, 'githubNick').length);
