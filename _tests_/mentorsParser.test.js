import { parseMentorsJson, parsePairsJson } from '../src/jsonGenerator/mentorsParser';

const mentorsJson = [
  {
    Name: 'Denis',
    Surname: 'Kravchenko',
    City: 'Минск',
    Count: 3,
    GitHub: 'https://github.com/Shank111',
  },
  {
    Name: 'Vitali',
    Surname: 'Krasnou',
    City: 'Минск',
    Count: 2,
    GitHub: 'https://github.com/error404as/',
  },
];

const expectedMentors = {
  shank111: {
    githubLink: 'https://github.com/shank111',
    name: 'deniskravchenko',
  },
  error404as: {
    githubLink: 'https://github.com/error404as',
    name: 'vitalikrasnou',
  },
};

const pairsJson = [
  {
    interviewer: 'Denis Kravchenko',
    'student github': 'kirillfilipp',
  },
  {
    interviewer: 'Denis Kravchenko',
    'student github': 'gemsgame',
  },
  {
    interviewer: 'Denis Kravchenko',
    'student github': 'axissixa57',
  },
  {
    interviewer: 'Denis Kravchenko',
    'student github': 'maxstarovoitov',
  },
  {
    interviewer: 'Denis Kravchenko',
    'student github': 'nemkev',
  },
  {
    interviewer: 'Vitali Krasnou',
    'student github': 'robertiqk',
  },
  {
    interviewer: 'Vitali Krasnou',
    'student github': 'pozharitskiy',
  },
  {
    interviewer: 'Vitali Krasnou',
    'student github': 'aliakseik19',
  },
  {
    interviewer: 'Vitali Krasnou',
    'student github': 'tarsupon',
  },
];

const expectedMergedMentors = {
  shank111: {
    githubLink: 'https://github.com/shank111',
    name: 'deniskravchenko',
    students: [
      'kirillfilipp',
      'gemsgame',
      'axissixa57',
      'maxstarovoitov',
      'nemkev',
    ],
  },
  error404as: {
    githubLink: 'https://github.com/error404as',
    name: 'vitalikrasnou',
    students: [
      'robertiqk',
      'pozharitskiy',
      'aliakseik19',
      'tarsupon',
    ],
  },
};

describe('parse mentors json', () => {
  const actualMentors = parseMentorsJson(mentorsJson);
  const mergedActualMentors = parsePairsJson(pairsJson, actualMentors);

  it('parse mentors', () => {
    expect(actualMentors).toEqual(expectedMentors);
  });

  it('merge mentors', () => {
    expect(mergedActualMentors).toEqual(expectedMergedMentors);
  });
});
