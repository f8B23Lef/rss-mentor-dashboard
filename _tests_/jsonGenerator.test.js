import { parseScoreJson } from '../src/jsonGenerator/jsonMerger';

const scoreJson = [
  {
    'Ссылка на GitHub ментора в формате: https://github.com/nickname': 'https://github.com/Artsiom-Zhuk',
    'Ссылка на GitHub студента в формате: https://github.com/nickname': 'https://github.com/mkinitcpio',
    Таск: 'Code Jam "CV"',
  },
  {
    'Ссылка на GitHub ментора в формате: https://github.com/nickname': 'https://github.com/Anik188',
    'Ссылка на GitHub студента в формате: https://github.com/nickname': 'https://github.com/Pulya10c',
    Таск: 'Code Jam "CV"',
  },
  {
    'Ссылка на GitHub ментора в формате: https://github.com/nickname': 'https://github.com/Anik188',
    'Ссылка на GitHub студента в формате: https://github.com/nickname': 'https://github.com/zurzur',
    Таск: 'Presentation',
  },
  {
    'Ссылка на GitHub ментора в формате: https://github.com/nickname': 'https://github.com/Anik188',
    'Ссылка на GitHub студента в формате: https://github.com/nickname': 'https://github.com/zurzur',
    Таск: 'Markup #1',
  },
];

const data = {
  students: {
    'artsiom-zhuk': {
      githubLink: 'https://github.com/artsiom-zhuk',
      tasks: [
        'codejam"corejs"',
        'codejam"dom,domevents"',
      ],
    },
  },
  mentors: {
    mkinitcpio: {
      githubLink: 'https://github.com/mkinitcpio',
      name: 'aliaksandrkazhamiaka',
      students: [
        'artsiom-zhuk',
      ],
    },
  },
};

const expectedData = {
  students: {
    'artsiom-zhuk': {
      githubLink: 'https://github.com/artsiom-zhuk',
      tasks: [
        'codejam"corejs"',
        'codejam"dom,domevents"',
        'codejam"cv"',
      ],
    },
    pulya10c: {
      githubLink: 'https://github.com/pulya10c',
      tasks: [
        'codejam"cv"',
      ],
    },
    zurzur: {
      githubLink: 'https://github.com/zurzur',
      tasks: [
        'presentation',
        'markup#1',
      ],
    },
  },
  mentors: {
    mkinitcpio: {
      githubLink: 'https://github.com/mkinitcpio',
      name: 'aliaksandrkazhamiaka',
      students: [
        'artsiom-zhuk',
      ],
    },
    anik188: {
      githubLink: 'https://github.com/anik188',
      students: [
        'pulya10c',
        'zurzur',
      ],
    },
  },
};

describe('parse score json', () => {
  parseScoreJson(scoreJson, data);

  it('merge data', () => {
    expect(data).toEqual(expectedData);
  });
});
