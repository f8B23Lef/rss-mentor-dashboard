import { parseTasksJson, parseScoreJson } from '../src/jsonGenerator/tasksParser';

const tasksJson = [
  {
    task: 'Code Jam "CV"',
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/codejam-cv.md',
    Status: 'Checked',
  },
  {
    task: 'Markup #1',
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/markup-2018q3.md',
    Status: 'Checking',
  },
  {
    task: 'YouTube',
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/youtube.md',
    Status: 'Checking',
  },
  {
    task: 'Game',
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/game.md',
    Status: 'In Progress',
  },
  {
    task: 'Course work',
    Status: 'ToDo',
  },
];

const expectedTasks = {
  'codejam"cv"': {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/codejam-cv.md',
    status: 'checked',
  },
  'markup#1': {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/markup-2018q3.md',
    status: 'checking',
  },
  youtube: {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/youtube.md',
    status: 'checking',
  },
  game: {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/game.md',
    status: 'inprogress',
  },
  coursework: {
    link: undefined,
    status: 'todo',
  },
};

const scoreJson = [
  {
    'Ссылка на GitHub ментора в формате: https://github.com/nickname': 'https://github.com/sulemanof',
    'Ссылка на GitHub студента в формате: https://github.com/nickname': 'https://github.com/heaveek',
    Таск: 'Code Jam "CV"',
  },
  {
    'Ссылка на GitHub ментора в формате: https://github.com/nickname': 'https://github.com/Pristavka',
    'Ссылка на GitHub студента в формате: https://github.com/nickname': 'https://github.com/dzhudzhi',
    Таск: 'Presentation',
  },
];

const expectedMergedTasks = {
  'codejam"cv"': {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/codejam-cv.md',
    status: 'checked',
  },
  'markup#1': {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/markup-2018q3.md',
    status: 'checking',
  },
  youtube: {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/youtube.md',
    status: 'checking',
  },
  game: {
    link: 'https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/game.md',
    status: 'inprogress',
  },
  coursework: {
    link: undefined,
    status: 'todo',
  },
  presentation: {
    link: undefined,
    status: 'checked',
  },
};

describe('parse tasks json', () => {
  const actualTasks = parseTasksJson(tasksJson);
  const mergedActualTasks = parseScoreJson(scoreJson, actualTasks);

  it('parse tasks', () => {
    expect(actualTasks).toEqual(expectedTasks);
  });

  it('merge tasks', () => {
    expect(mergedActualTasks).toEqual(expectedMergedTasks);
  });
});
