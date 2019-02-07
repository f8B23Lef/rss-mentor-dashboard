import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Table.css';

// async getData() {
//   const res = await fetch('./data.json');
//   const data = await es.json();
//   return this.setState({ data });
// }

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      mentorGithubNick: props.mentorGithubNick,
    };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps: ', nextProps, prevState);
    if (prevState.mentorGithubNick !== nextProps.mentorGithubNick) {
      return {
        mentorGithubNick: nextProps.mentorGithubNick,
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  componentDidMount() {
    console.log('componentDidMount');
    fetch('./data.json')
      .then(response => response.json())
      .then((data) => {
        console.log('data: ', data);
        this.setState({ data });
      })
      .catch((error) => {
        console.log('error: ', error);
      });
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

  calculteTaskStatus = (defaultStatus, done) => {
    let taskStatus = '';

    if (done) {
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
          <td className={this.calculteTaskStatus(data.tasks[task].status, data.students[studentGuhubNick].tasks.includes(task))} key={studentGuhubNick}>{this.calculteTaskStatus(data.tasks[task].status, data.students[studentGuhubNick].tasks.includes(task))}</td>
        ))}
      </tr>
    )));
  });

  render() {
    const { data, mentorGithubNick } = this.state;
    console.log('data> ', data, 'mentorGithubNick> ', mentorGithubNick);

    if (data) {
      return (
        <table>
          <tbody>
            {this.formTableHeaders()}
            {this.formTableContent()}
          </tbody>
        </table>
      );
    }

    return (<p />);
  }
}

Table.propTypes = {
  mentorGithubNick: PropTypes.string.isRequired,
};

export default Table;
