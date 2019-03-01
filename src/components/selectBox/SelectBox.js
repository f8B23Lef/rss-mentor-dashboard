import _ from 'lodash';
import React, { Component } from 'react';
import Select, { createFilter } from 'react-select';
import Table from '../table/Table';

import './SelectBox.css';

class SelectBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      options: [],
    };
  }

  componentDidMount = () => {
    fetch('./data.json')
      .then(response => response.json())
      .then((data) => {
        const options = _.sortBy(Object.keys(data.mentors).map(githubNick => ({
          value: githubNick,
          label: githubNick,
        })), 'value');
        this.setState({ options });
      })
      .catch(error => error);

    const lastSelectedMentor = localStorage.getItem('lastSelectedMentor');
    if (lastSelectedMentor) {
      this.setState({
        selectedOption: {
          value: lastSelectedMentor,
          label: lastSelectedMentor,
        },
      });
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (prevState.user !== nextProps.user) {
      if (nextProps.user) {
        localStorage.setItem('lastSelectedMentor', nextProps.user);
      }

      const lastSelectedMentor = localStorage.getItem('lastSelectedMentor');
      if (lastSelectedMentor) {
        return {
          user: nextProps.user,
          selectedOption: {
            value: lastSelectedMentor,
            label: lastSelectedMentor,
          },
        };
      }
    }

    return null;
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });

    if (selectedOption) {
      localStorage.setItem('lastSelectedMentor', selectedOption.value);
    } else {
      localStorage.setItem('lastSelectedMentor', '');
    }
  }

  render() {
    const { selectedOption, options } = this.state;

    return (
      <>
        <section className="select__wrapper">
          <Select
            autoFocus
            className="selectBox"
            placeholder="Input mentor github nick"
            isClearable
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
            filterOption={createFilter({ matchFrom: 'start' })}
          />
        </section>
        {selectedOption && <Table mentorGithubNick={selectedOption.value} />}
      </>
    );
  }
}

export default SelectBox;
