const XLSX = require('xlsx');

const constants = require('./constants/constants');

// const unionObjects = (obj1, obj2) => {
//   const result = { ...obj1 };

//   Object.keys(obj2).forEach((key) => {
//     if (!{}.hasOwnProperty.call(result, key)) {
//       console.log(key, obj2[key]);
//       result[key] = obj2[key];
//     }
//   });

//   return result;
// };

const tasksWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.TASKS_FILE}`);
const tasksSheet = tasksWorkbook.Sheets[constants.TASKS_SHEET];
const tasksSheetJson = XLSX.utils.sheet_to_json(tasksSheet);

const tasks = {};

tasksSheetJson.forEach((element) => {
  const taskName = element[constants.TASKS_A].trim().toLowerCase().replace(/[\s|-]*/g, '');//.replace(/"/g, '\'')
  const taskLink = element[constants.TASKS_B];
  const taskStatus = element[constants.TASKS_C].trim().toLowerCase();
  tasks[taskName] = {
    link: taskLink,
    status: taskStatus,
  };
});

console.log('tasks: ', tasks);

const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
const scoreSheetJson = XLSX.utils.sheet_to_json(scoreSheet);

scoreSheetJson.forEach((element) => {
  const taskName = element[constants.SCORE_D].trim().toLowerCase().replace(/[\s|-]*/g, '');
  if (!Object.keys(tasks).includes(taskName)) {
    tasks[taskName] = {
      link: undefined,
      status: 'checked',
    };
  }
});

console.log('tasks2: ', tasks);

module.exports = Object.freeze(tasks);
