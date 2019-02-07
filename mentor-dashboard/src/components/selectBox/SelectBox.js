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
      // selectedOption: 'maximuk',
      options: [],
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    fetch('./data.json')
      .then(response => response.json())
      .then((data) => {
        const options = _.sortBy(Object.keys(data.mentors).map(githubNick => ({
          value: githubNick,
          label: githubNick,
        })), 'value');
        this.setState({ options });
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log('Option selected:', selectedOption);

    // localStorage.setItem('lastSelectedMentor', selectedOption.value);
  }

  render() {
    const { selectedOption, options } = this.state;
    console.log('selectedOption:', selectedOption, options.length);

    let table = null;
    if (selectedOption) {
      console.log('true = ', selectedOption.value);
      table = <Table mentorGithubNick={selectedOption.value} />;
    }

    const filterConfig = {
      matchFrom: 'start',
    };

    return (
      <div>
        <Select
          autoFocus
          // defaultInputValue="maximuk"
          className="selectBox"
          placeholder="Input mentor github nick"
          isClearable
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          filterOption={createFilter(filterConfig)}
        />
        {table}
      </div>
    );
  }
}

export default SelectBox;
