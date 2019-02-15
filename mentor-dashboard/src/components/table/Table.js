import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Table.css';

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      mentorGithubNick: props.mentorGithubNick,
    };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.mentorGithubNick !== nextProps.mentorGithubNick) {
      return {
        mentorGithubNick: nextProps.mentorGithubNick,
      };
    }

    return null;
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then((data) => {
        this.setState({ data });
      })
      .catch(error => error);
  }

  formTableHeaders = () => {
    const { data, mentorGithubNick } = this.state;

    return (
      <tr>
        <th />
        {data.mentors[mentorGithubNick].students.map(studentGuhubNick => (
          <th key={studentGuhubNick}><a className="link" target="_blank" rel="noopener noreferrer" href={data.students[studentGuhubNick].githubLink}>{studentGuhubNick}</a></th>
        ))}
      </tr>
    );
  };

  calculteTaskStatus = (defaultStatus, isDone) => {
    let taskStatus = '';

    if (isDone) {
      taskStatus = 'checked';
    } else {
      switch (defaultStatus) {
        case 'todo':
          taskStatus = 'todo';
          break;

        case 'inprogress':
          taskStatus = 'inprogress';
          break;

        case 'checking':
          taskStatus = 'checking';
          break;

        case 'checked':
          taskStatus = 'nomark';
          break;

        default:
          break;
      }
    }

    return taskStatus;
  };

  formTableContent = (() => {
    const { data, mentorGithubNick } = this.state;

    return (Object.keys(data.tasks).map(task => (
      <tr key={task}>
        <th><a className="link" target="_blank" rel="noopener noreferrer" href={data.tasks[task].link}>{task}</a></th>
        {data.mentors[mentorGithubNick].students.map(studentGuhubNick => (
          // eslint-disable-next-line max-len
          <td className={this.calculteTaskStatus(data.tasks[task].status, data.students[studentGuhubNick].tasks.includes(task))} key={studentGuhubNick} />
        ))}
      </tr>
    )));
  });

  render() {
    const { data, mentorGithubNick } = this.state;

    if (data && Object.keys(data.mentors).includes(mentorGithubNick)) {
      return (
        <section className="table__wrapper">
          <table>
            <tbody>
              {this.formTableHeaders()}
              {this.formTableContent()}
            </tbody>
          </table>
        </section>
      );
    }

    if (data && !Object.keys(data.mentors).includes(mentorGithubNick)) {
      return (<p className="message">You do not have students</p>);
    }

    return (<></>);
  }
}

Table.propTypes = {
  mentorGithubNick: PropTypes.string,
};

Table.defaultProps = {
  mentorGithubNick: null,
};

export default Table;
