const XLSX = require('xlsx');
const _ = require('lodash');
const constants = require('./constants');

const formTaskName = taskName => taskName.trim().toLowerCase().replace(/[\s|-]*/g, '');

const formTaskStatus = taskStatus => taskStatus.trim().toLowerCase().replace(/[\s]*/g, '');

const buildTasksJson = () => {
  const tasksWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.TASKS_FILE}`);
  const tasksSheet = tasksWorkbook.Sheets[constants.TASKS_SHEET];
  const tasksJson = XLSX.utils.sheet_to_json(tasksSheet);

  return tasksJson;
};

const parseTasksJson = (tasksJson) => {
  const tasks = {};

  tasksJson.forEach((element) => {
    const taskName = formTaskName(element[constants.TASKS_A]);
    const taskLink = element[constants.TASKS_B];
    const taskStatus = formTaskStatus(element[constants.TASKS_C]);
    tasks[taskName] = {
      link: taskLink,
      status: taskStatus,
    };
  });

  return tasks;
};

const buildScoreJson = () => {
  const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
  const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
  const scoreJson = XLSX.utils.sheet_to_json(scoreSheet);

  return scoreJson;
};

const parseScoreJson = (scoreJson, tasks) => {
  const mergedTasks = _.cloneDeep(tasks);

  scoreJson.forEach((element) => {
    const taskName = formTaskName(element[constants.SCORE_D]);
    if (!Object.keys(tasks).includes(taskName)) {
      mergedTasks[taskName] = {
        link: undefined,
        status: 'checked',
      };
    }
  });

  return mergedTasks;
};

const buildTasksData = () => {
  const tasks = parseTasksJson(buildTasksJson());
  const mergedTasks = parseScoreJson(buildScoreJson(), tasks);

  return mergedTasks;
};

module.exports = {
  buildTasksData,
  // export for tests
  parseTasksJson,
  parseScoreJson,
};
