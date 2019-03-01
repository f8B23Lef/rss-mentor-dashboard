import { parseStudentsJson } from '../src/jsonGenerator/studentsParser';

const studentsJson = [
  {
    interviewer: 'Akiaksandr Zahorski',
    'student github': 'bananovblu',
  },
  {
    interviewer: 'Akiaksandr Zahorski',
    'student github': 'bmvmarc',
  },
  {
    interviewer: 'Akiaksandr Zahorski',
    'student github': 'bmvmarc',
  },
  {
    interviewer: 'Aliaksandr Rudzin',
    'student github': 'psevkin',
  },
  {
    interviewer: 'Aliaksandr Tachko',
    'student github': '19alexandr90',
  },
];

const expectedStudents = {
  bananovblu: {
    githubLink: 'https://github.com/bananovblu',
    tasks: [],
  },
  bmvmarc: {
    githubLink: 'https://github.com/bmvmarc',
    tasks: [],
  },
  psevkin: {
    githubLink: 'https://github.com/psevkin',
    tasks: [],
  },
  '19alexandr90': {
    githubLink: 'https://github.com/19alexandr90',
    tasks: [],
  },
};

describe('parse students json', () => {
  const actualStudents = parseStudentsJson(studentsJson);

  it('parse students', () => {
    expect(actualStudents).toEqual(expectedStudents);
  });
});
