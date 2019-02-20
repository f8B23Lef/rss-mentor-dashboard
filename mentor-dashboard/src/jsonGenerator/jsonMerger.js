/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["data"] }] */
const XLSX = require('xlsx');
const constants = require('./constants');

const { buildTasksData } = require('./tasksParser');
const { buildStudentsData } = require('./studentsParser');
const { buildMentorsData } = require('./mentorsParser');

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

const buildScoreJson = () => {
  const scoreWorkbook = XLSX.readFile(`${constants.RESOURCES_PATH}${constants.SCORE_FILE}`);
  const scoreSheet = scoreWorkbook.Sheets[constants.SCORE_SHEET];
  const scoreJson = XLSX.utils.sheet_to_json(scoreSheet);

  return scoreJson;
};

const parseInaccurateData = (row, data) => {
  const potentialMentorGithubNick = formGithubNick(row[constants.SCORE_B]);
  const potentialMentorGithubLink = formGithubLink(row[constants.SCORE_B]);
  const potentialStudentGithubNick = formGithubNick(row[constants.SCORE_C]);
  const potentialStudentGithubLink = formGithubLink(row[constants.SCORE_C]);
  const task = formTaskName(row[constants.SCORE_D]);

  const studentsHaveMentor = Object.keys(data.students).includes(potentialMentorGithubNick);
  const studentsHaveStudent = Object.keys(data.students).includes(potentialStudentGithubNick);
  const mentorsHaveStudent = Object.keys(data.mentors).includes(potentialStudentGithubNick);

  /**
   * [1] does this mentor among all students (mentor and student mixed up)
   * [2] doesn't this task among checked student tasks
   * [3] does this mentor among all mentors
   * [4] does this mentor hasn't this student
   * [5] new mentor and existing student
   * [6] does this student among all students
   * [7] does this student among all mentors (student and mentor mixed up)
   * [8] new student and new mentor
   */

  if (studentsHaveMentor) { // 1
    const mentorGithubNick = potentialStudentGithubNick;
    const mentorGithubLink = potentialStudentGithubLink;
    const studentGithubNick = potentialMentorGithubNick;

    if (!data.students[studentGithubNick].tasks.includes(task)) { // 2
      data.students[studentGithubNick].tasks.push(task);
    }

    const mentorsHaveMentor = Object.keys(data.mentors).includes(mentorGithubNick);

    if (mentorsHaveMentor) { // 3
      if (!data.mentors[mentorGithubNick].students.includes(studentGithubNick)) { // 4
        data.mentors[mentorGithubNick].students.push(studentGithubNick);
      }
    } else { // 5
      data.mentors[mentorGithubNick] = {
        githubLink: mentorGithubLink,
        students: [],
      };

      data.mentors[mentorGithubNick].students.push(studentGithubNick);
    }
  } else if (studentsHaveStudent) { // 6
    if (!data.students[potentialStudentGithubNick].tasks.includes(task)) { // 2
      data.students[potentialStudentGithubNick].tasks.push(task);
    }

    data.mentors[potentialMentorGithubNick] = {
      githubLink: potentialMentorGithubLink,
      students: [potentialStudentGithubNick],
    };
  } else if (mentorsHaveStudent) { // 7
    const mentorGithubNick = potentialStudentGithubNick;
    const studentGithubNick = potentialMentorGithubNick;
    const studentGithubLink = potentialMentorGithubLink;

    data.students[studentGithubNick] = {
      githubLink: studentGithubLink,
      tasks: [task],
    };

    data.mentors[mentorGithubNick].students.push(studentGithubNick);
  } else { // 8
    data.students[potentialStudentGithubNick] = {
      githubLink: potentialStudentGithubLink,
      tasks: [task],
    };

    data.mentors[potentialMentorGithubNick] = {
      githubLink: potentialMentorGithubLink,
      students: [potentialStudentGithubNick],
    };
  }
};

const parseAccurateData = (row, data) => {
  const potentialMentorGithubNick = formGithubNick(row[constants.SCORE_B]);
  const potentialStudentGithubNick = formGithubNick(row[constants.SCORE_C]);
  const potentialStudentGithubLink = formGithubLink(row[constants.SCORE_C]);
  const task = formTaskName(row[constants.SCORE_D]);

  const mentorStudents = data.mentors[potentialMentorGithubNick].students;

  const mentorHasStudent = mentorStudents.includes(potentialStudentGithubNick);
  const studentsHaveStudent = Object.keys(data.students).includes(potentialStudentGithubNick);

  /**
   * [1] does this mentor has this student
   * [2] doesn't this task among checked student tasks
   * [3] new student
   */
  if (mentorHasStudent) { // 1
    if (!data.students[potentialStudentGithubNick].tasks.includes(task)) { // 2
      data.students[potentialStudentGithubNick].tasks.push(task);
    }
  } else if (studentsHaveStudent) {
    if (!data.students[potentialStudentGithubNick].tasks.includes(task)) { // 2
      data.students[potentialStudentGithubNick].tasks.push(task);
    }
    mentorStudents.push(potentialStudentGithubNick);
  } else { // 3
    data.students[potentialStudentGithubNick] = {
      githubLink: potentialStudentGithubLink,
      tasks: [task],
    };
    mentorStudents.push(potentialStudentGithubNick);
  }
};

const parseScoreJson = (scoreJson, data) => {
  scoreJson.forEach((row) => {
    const potentialMentorGithubNick = formGithubNick(row[constants.SCORE_B]);

    if (Object.keys(data.mentors).includes(potentialMentorGithubNick)) {
      parseAccurateData(row, data);
    } else {
      parseInaccurateData(row, data);
    }
  });
};

const mergeData = () => {
  const data = {
    tasks: buildTasksData(),
    students: buildStudentsData(),
    mentors: buildMentorsData(),
  };

  parseScoreJson(buildScoreJson(), data);

  return data;
};

module.exports = {
  mergeData,
  // export for tests
  parseScoreJson,
};
