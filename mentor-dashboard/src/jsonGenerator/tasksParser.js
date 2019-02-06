const XLSX = require('xlsx');
const constants = require('./constants');

const formTaskName = taskName => taskName.trim().toLowerCase().replace(/[\s|-]*/g, '');

const formTaskStatus = taskStatus => taskStatus.trim().toLowerCase();

module.exports = () => {
  const tasks = {};

  const tasksWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.TASKS_FILE}`);
  const tasksSheet = tasksWorkbook.Sheets[constants.TASKS_SHEET];
  const tasksSheetJson = XLSX.utils.sheet_to_json(tasksSheet);

  tasksSheetJson.forEach((element) => {
    const taskName = formTaskName(element[constants.TASKS_A]);
    const taskLink = element[constants.TASKS_B];
    const taskStatus = formTaskStatus(element[constants.TASKS_C]);
    tasks[taskName] = {
      link: taskLink,
      status: taskStatus,
    };
  });

  const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
  const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
  const scoreSheetJson = XLSX.utils.sheet_to_json(scoreSheet);

  scoreSheetJson.forEach((element) => {
    const taskName = formTaskName(element[constants.SCORE_D]);
    if (!Object.keys(tasks).includes(taskName)) {
      tasks[taskName] = {
        link: undefined,
        status: 'checked',
      };
    }
  });

  return tasks;
};
