import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import Container from '../src/components/container/Container';

configure({ adapter: new Adapter() });

describe('render', () => {
  const wrapper = shallow(<Container />);

  it('login section', () => {
    const loginSection = <section className="login__wrapper" />;
    expect(wrapper.contains(loginSection));
  });

  it('selectBox section', () => {
    const selectBoxSection = <section className="select__wrapper" />;
    expect(wrapper.contains(selectBoxSection));
  });
});
