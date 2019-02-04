// const _ = require('lodash');
const XLSX = require('xlsx');

const constants = require('./constants/constants');

const formGithubNick = (link) => {
  if (link.endsWith('/')) {
    const tmpLink = link.slice(0, -1);
    return tmpLink.slice(tmpLink.lastIndexOf('/') + 1).toLowerCase();
  }

  return link.slice(link.lastIndexOf('/') + 1).toLowerCase();
};

const formGithubLink = link => 'https://github.com/'.concat(formGithubNick(link));

const formName = str => str.trim().toLowerCase().replace(/[\s]*/g, '');

// const removeDuplicateByKey = (mentors, key) => _.uniqBy(mentors, key);
// -------------------------------------------------------------------------
const mentorsWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.MENTOR_STUDENTS_FILE}`);
const mentorsSheet = mentorsWorkbook.Sheets[constants.MENTORS_SHEET];
const mentorsSheetJson = XLSX.utils.sheet_to_json(mentorsSheet);

const mentors = {};

mentorsSheetJson.forEach((element) => {
  const name = formName(element[constants.MENTORS_A]).concat(formName(element[constants.MENTORS_B]));
  const githubLink = formGithubLink(String(element[constants.MENTORS_E]));
  const githubNick = formGithubNick(String(element[constants.MENTORS_E]));
  mentors[githubNick] = {
    githubLink,
    name,
  };
});

console.log('mentors: ', mentors, Object.keys(mentors).length);
// -------------------------------------------------------------------------
const pairsSheet = mentorsWorkbook.Sheets[constants.PAIRS_SHEET];
const pairsSheetJson = XLSX.utils.sheet_to_json(pairsSheet);

// const mentors2 = { ...mentors };

Object.keys(mentors).forEach((githubNick) => {
  mentors[githubNick].students = [];
  pairsSheetJson.forEach((element) => {
    if (mentors[githubNick].name === formName(element[constants.PAIRS_A])) {
      mentors[githubNick].students.push(element[constants.PAIRS_B]);
    }
  });
});


console.log('mentors2: ', mentors, Object.keys(mentors).length);

module.exports = Object.freeze(mentors);
// -------------------------------------------------------------------------
// const existMentor = (githubNick, potentialGithubNick) => githubNick === potentialGithubNick;
// const existStudent = (students, potentialStudent) => students.includes(potentialStudent);

// const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
// const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
// const scoreSheetJson = XLSX.utils.sheet_to_json(scoreSheet);

// const mentors3 = { ...mentors2 };
// // const students = {};

// scoreSheetJson.forEach((element) => {
//   // Object.keys(mentors3).forEach((mentorGithubNick) => {
//   const potentialMentorGithubNick = formGithubNick(element[constants.SCORE_B]);
//   const potentialStudentGithubNick = formGithubNick(element[constants.SCORE_C]);
//   const task = element[constants.SCORE_D].trim().toLowerCase().replace(/[\s|-]*/g, '');
//   if (Object.keys(mentors3).includes(potentialMentorGithubNick)) {
//     if (!mentors3[potentialMentorGithubNick].students.includes(potentialStudentGithubNick)) {
//       mentors3[potentialMentorGithubNick].students.push(potentialStudentGithubNick);
//     }
//   } else {

//   }
// });
// if (existMentor(mentorGithubNick, potentialMentorGithubNick)) {
//   if (!existStudent(mentors3[mentorGithubNick].students, potentialStudentGithubNick)) {
//     mentors3[mentorGithubNick].students.push();
//   }
//   // element[constants.SCORE_C];
// //   mentors2[key].students.push(element[constants.PAIRS_B]);
// // console.log('>> ', formGithubNick(element[constants.SCORE_B]));
// } else {
// }

// students[potentialStudentGithubNick] = {
//   githubLink: formGithubLink();
// }
// });


// console.log('mentors3: ', mentors3, Object.keys(mentors3).length);

// const mentors3 = {};

// scoreSheetJson.forEach((element) => {
//   const githubLink = formGithubLink(String(element[constants.SCORE_B]));
//   const githubNick = formGithubNickname(String(element[constants.SCORE_B]));
//   mentors3[githubNick] = {
//     githubLink,
//   };
// });

// console.log('mentors3: ', mentors3, Object.keys(mentors3).length);
// -------------------------------------------------------------------------
// // console.log('intersection: ', _.intersectionBy(mentors, mentors3, 'githubLink'), _.intersectionBy(mentors, mentors3, 'githubLink').length);

// // console.log('difference: ', _.differenceBy(mentors3, mentors, 'githubLink'), _.differenceBy(mentors3, mentors, 'githubLink').length);

// // console.log('union: ', _.unionBy(mentors3, mentors, mentors2, 'githubLink'), _.unionBy(mentors3, mentors, mentors2, 'githubLink').length);


// // console.log('difference: ', _.intersectionBy(mentors3, _.unionBy(mentors, mentors2, 'githubLink'), 'githubLink'), _.intersectionBy(mentors3, _.unionBy(mentors, mentors2, 'githubLink'), 'githubLink').length);

// console.log('union: ', _.unionBy(_.unionBy(mentors, mentors2, 'name'), mentors3, 'githubLink'), '1:', mentors.length, '2:', mentors2.length, '3:', mentors3.length, _.unionBy(_.unionBy(mentors, mentors2, 'name'), mentors3, 'githubLink').length);
// console.log('difference: ', _.differenceBy(mentors2, mentors, 'name'), _.differenceBy(mentors2, mentors, 'name').length);

// console.log('union: ', _.unionBy(mentors, mentors3, 'githubLink'), '1:', mentors.length, '2:', mentors3.length, _.unionBy(mentors, mentors3, 'githubLink').length);
// console.log('difference: ', _.differenceBy(mentors3, mentors, 'githubLink'), '1:', mentors.length, '2:', mentors3.length, _.differenceBy(mentors3, mentors, 'githubLink').length);

// // const mentorsJson = JSON.stringify(_.sortBy(mentors, ['name']), 0, 2);

// // fs.writeFile("mentorsJson.json", mentorsJson, "utf8", () => {
// //   console.log("writing is done!");
// // });

// // const mentorsJson2 = JSON.stringify(_.sortBy(mentors2, ['name']), 0, 2);

// // fs.writeFile("mentorsJson2.json", mentorsJson2, "utf8", () => {
// //   console.log("writing is done!");
// // });
