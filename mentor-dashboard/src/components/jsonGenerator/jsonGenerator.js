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
  tasks: { ...tasks },
  students: { ...students },
  mentors: { ...mentors },
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

// writeFile(data);
// -------------------------------------------------------------------------------------
// const formGithubNick = (link) => {
//   if (link.endsWith('/')) {
//     const tmpLink = link.slice(0, -1);
//     return tmpLink.slice(tmpLink.lastIndexOf('/') + 1).toLowerCase();
//   }

//   return link.slice(link.lastIndexOf('/') + 1).toLowerCase();
// };

// const formGithubLink = link => 'https://github.com/'.concat(formGithubNick(link));

const removeSlashFromTheEnd = (link) => {
  if (link.endsWith('/')) {
    return link.slice(0, -1);
  }

  return link;
};

const formGithubNick = (link) => {
  const linkWithoutEndSlash = removeSlashFromTheEnd(link).trim().toLowerCase();

  const incorrectEnd = '-2018q3';

  if (linkWithoutEndSlash.endsWith(incorrectEnd)) {
    const linkWihoutIncorrectEnd = linkWithoutEndSlash.slice(0, -incorrectEnd.length);
    return linkWihoutIncorrectEnd.slice(linkWihoutIncorrectEnd.lastIndexOf('/') + 1);
  }

  return linkWithoutEndSlash.slice(linkWithoutEndSlash.lastIndexOf('/') + 1);
};

const formGithubLink = link => 'https://github.com/'.concat(formGithubNick(link));
// -------------------------------------------------------------------------------------
const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
const scoreSheetJson = XLSX.utils.sheet_to_json(scoreSheet);

const addTaskToStudentCheckedTasks = (task, student) => {
  if (!data.students[student].tasks.includes(task)) {
    data.students[student].tasks.push(task);
  }
};

const addStudentToMentor = (student, mentor) => {
  data.mentors[mentor].students.push(student);
};

const createStudent = (githubNick, githubLink) => {
  data.students[githubNick] = {
    githubLink,
    tasks: [],
  };
};

const unparsedData = [];

scoreSheetJson.forEach((element) => {
  const potentialMentorGithubNick = formGithubNick(element[constants.SCORE_B]);
  const potentialMentorGithubLink = formGithubLink(element[constants.SCORE_B]);
  const potentialStudentGithubNick = formGithubNick(element[constants.SCORE_C]);
  const potentialStudentGithubLink = formGithubLink(element[constants.SCORE_C]);
  const task = element[constants.SCORE_D].trim().toLowerCase().replace(/[\s|-]*/g, '');

  if (Object.keys(data.mentors).includes(potentialMentorGithubNick)) { // есть ли данный ментор среди всех менторов
    if (data.mentors[potentialMentorGithubNick].students.includes(potentialStudentGithubNick)) { // есть ли данный студент у данного ментора
      addTaskToStudentCheckedTasks(task, potentialStudentGithubNick);
    } else if (Object.keys(data.students).includes(potentialStudentGithubNick)) { // есть ли данный студент среди всех студентов
      addTaskToStudentCheckedTasks(task, potentialStudentGithubNick);
      addStudentToMentor(potentialStudentGithubNick, potentialMentorGithubNick);
    } else {
      console.log('stud:', potentialStudentGithubNick);
      createStudent(potentialStudentGithubNick, potentialStudentGithubLink);
      addTaskToStudentCheckedTasks(task, potentialStudentGithubNick);
      addStudentToMentor(potentialStudentGithubNick, potentialMentorGithubNick);
    }
  } else {
    unparsedData.push({
      potentialMentorGithubLink,
      potentialMentorGithubNick,
      potentialStudentGithubLink,
      potentialStudentGithubNick,
      task,
    });
  }
});

console.log('---json generate2---', Object.keys(data.tasks).length, Object.keys(data.students).length, Object.keys(data.mentors).length);
console.log('unparsedData: ', unparsedData.length);
console.log('1111111>', Object.keys(data.students).includes('shutya'));

const createMentor = (githubNick, githubLink) => {
  data.mentors[githubNick] = {
    githubLink,
    students: [],
  };
};

const parseAmbiguousData = (ambiguousData) => {
  // const parsedData = [];

  ambiguousData.forEach((element, index) => {
    console.log(index, ': ', element);
    if (Object.keys(data.students).includes(element.potentialMentorGithubNick)) { // есть ли данный ментор среди всех студентов
      // parsedData.push({
      //   potentialMentorGithubLink: element.potentialStudentGithubLink,
      //   potentialMentorGithubNick: element.potentialStudentGithubNick,
      //   potentialStudentGithubLink: element.potentialMentorGithubLink,
      //   potentialStudentGithubNick: element.potentialMentorGithubNick,
      //   task: element.task,
      // });

      addTaskToStudentCheckedTasks(element.task, element.potentialMentorGithubNick);
      if (Object.keys(data.mentors).includes(element.potentialStudentGithubNick)) {
        if (!Object.keys(data.mentors).includes(element.potentialMentorGithubNick)) {
          addStudentToMentor(element.potentialMentorGithubNick, element.potentialStudentGithubNick);
        }
      } else {
        createMentor(element.potentialStudentGithubNick, element.potentialStudentGithubLink);
        addStudentToMentor(element.potentialMentorGithubNick, element.potentialStudentGithubNick);
      }
    } else if (Object.keys(data.students).includes(element.potentialStudentGithubNick)) { // есть ли данный студент среди всех студентов
      // parsedData.push({
      //   potentialMentorGithubLink: element.potentialMentorGithubLink,
      //   potentialMentorGithubNick: element.potentialMentorGithubNick,
      //   potentialStudentGithubLink: element.potentialStudentGithubLink,
      //   potentialStudentGithubNick: element.potentialStudentGithubNick,
      //   task: element.task,
      // });

      addTaskToStudentCheckedTasks(element.task, element.potentialStudentGithubNick);
      createMentor(element.potentialMentorGithubNick, element.potentialMentorGithubLink);
      addStudentToMentor(element.potentialStudentGithubNick, element.potentialMentorGithubNick);
    } else if (Object.keys(data.mentors).includes(element.potentialStudentGithubNick)) { // есть ли данный студент среди всех менторов
      // parsedData.push({
      //   potentialMentorGithubLink: element.potentialStudentGithubLink,
      //   potentialMentorGithubNick: element.potentialStudentGithubNick,
      //   potentialStudentGithubLink: element.potentialMentorGithubLink,
      //   potentialStudentGithubNick: element.potentialMentorGithubNick,
      //   task: element.task,
      // });

      createStudent(element.potentialMentorGithubNick, element.potentialMentorGithubLink);
      addTaskToStudentCheckedTasks(element.task, element.potentialMentorGithubNick);
      addStudentToMentor(element.potentialMentorGithubNick, element.potentialStudentGithubNick);
    } else { // ????
      // parsedData.push({
      //   potentialMentorGithubLink: element.potentialMentorGithubLink,
      //   potentialMentorGithubNick: element.potentialMentorGithubNick,
      //   potentialStudentGithubLink: element.potentialStudentGithubLink,
      //   potentialStudentGithubNick: element.potentialStudentGithubNick,
      //   task: element.task,
      // });

      createStudent(element.potentialStudentGithubNick, element.potentialStudentGithubLink);
      addTaskToStudentCheckedTasks(element.task, element.potentialStudentGithubNick);
      createMentor(element.potentialMentorGithubNick, element.potentialMentorGithubLink);
      addStudentToMentor(element.potentialStudentGithubNick, element.potentialMentorGithubNick);
    }
  });
  // console.log('parsedData: ', parsedData, parsedData.length);

  // return parsedData;
};

parseAmbiguousData(unparsedData);
console.log('---json generate3---', Object.keys(data.tasks).length, Object.keys(data.students).length, Object.keys(data.mentors).length);
writeFile(data);
// const generateFinalJson = () => {
//   const parsedData = parseAmbiguousData(unparsedData);
//   console.log('---json generate3---', Object.keys(data.tasks).length, Object.keys(data.students).length, Object.keys(data.mentors).length);

//   parsedData.forEach((element) => {

//   });
// };

// generateFinalJson();
// console.log('---json generate4---', Object.keys(data.tasks).length, Object.keys(data.students).length, Object.keys(data.mentors).length);
