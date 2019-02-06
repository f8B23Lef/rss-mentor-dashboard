const fs = require('fs');
const mkdirp = require('mkdirp');
const XLSX = require('xlsx');
const constants = require('./constants');

const parseTasks = require('./tasksParser');
const parseStudents = require('./studentsParser');
const parseMentors = require('./mentorsParser');

const data = {
  tasks: parseTasks(),
  students: parseStudents(),
  mentors: parseMentors(),
};

console.log('---json generate---', Object.keys(data.tasks).length, Object.keys(data.students).length, Object.keys(data.mentors).length);

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

const formTaskName = taskName => taskName.trim().toLowerCase().replace(/[\s|-]*/g, '');

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

const createMentor = (githubNick, githubLink) => {
  data.mentors[githubNick] = {
    githubLink,
    students: [],
  };
};

const parseInaccurateData = (inaccurateData) => {
  inaccurateData.forEach((element, index) => {
    console.log(index, ': ', element);
    if (Object.keys(data.students).includes(element.potentialMentorGithubNick)) { // есть ли данный ментор среди всех студентов (ментор <-> студент)
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
      addTaskToStudentCheckedTasks(element.task, element.potentialStudentGithubNick);
      createMentor(element.potentialMentorGithubNick, element.potentialMentorGithubLink);
      addStudentToMentor(element.potentialStudentGithubNick, element.potentialMentorGithubNick);
    } else if (Object.keys(data.mentors).includes(element.potentialStudentGithubNick)) { // есть ли данный студент среди всех менторов (ментор <-> студент)
      createStudent(element.potentialMentorGithubNick, element.potentialMentorGithubLink);
      addTaskToStudentCheckedTasks(element.task, element.potentialMentorGithubNick);
      addStudentToMentor(element.potentialMentorGithubNick, element.potentialStudentGithubNick);
    } else { // новый ментор, новый студент
      createStudent(element.potentialStudentGithubNick, element.potentialStudentGithubLink);
      addTaskToStudentCheckedTasks(element.task, element.potentialStudentGithubNick);
      createMentor(element.potentialMentorGithubNick, element.potentialMentorGithubLink);
      addStudentToMentor(element.potentialStudentGithubNick, element.potentialMentorGithubNick);
    }
  });
};

const parseDataFromScoreFile = () => {
  const unparsedData = [];

  const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
  const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
  const scoreSheetJson = XLSX.utils.sheet_to_json(scoreSheet);

  scoreSheetJson.forEach((element) => {
    const potentialMentorGithubNick = formGithubNick(element[constants.SCORE_B]);
    const potentialMentorGithubLink = formGithubLink(element[constants.SCORE_B]);
    const potentialStudentGithubNick = formGithubNick(element[constants.SCORE_C]);
    const potentialStudentGithubLink = formGithubLink(element[constants.SCORE_C]);
    const task = formTaskName(element[constants.SCORE_D]);

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

  parseInaccurateData(unparsedData);
  console.log('---json generate3---', Object.keys(data.tasks).length, Object.keys(data.students).length, Object.keys(data.mentors).length);
};

const generateJson = () => {
  parseDataFromScoreFile();
};

const writeJsonToFile = (str) => {
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

generateJson();
writeJsonToFile(data);
