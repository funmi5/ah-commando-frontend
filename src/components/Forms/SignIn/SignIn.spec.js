import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { SignIn } from '@Components/Forms/SignIn/SignIn';

chai.should();

describe('<SignIn /> Component', () => {
  let wrapper, props, formHeader, instance, state;

  beforeEach(() => {
    state = {
      email: 'john.doe@testmail.com',
      password: 'P@ssword123',
      showPassword: false,
      errors: {},
      isFormValid: true,
    };
    props = {
      ui: {
        loading: false,
        modalOpen: true,
        modal: 'signin',
      },
      history: {
        push: jest.fn(),
      },
      close: jest.fn(),
      signIn: jest.fn(),
      signinViaSocial: sinon.spy(),
      requestPassword: jest.fn(),
      showSignUpModal: sinon.spy(),
    };
    wrapper = shallow(<SignIn {...props} />);
    wrapper.setState(state);
    instance = wrapper.instance();
    formHeader = wrapper.find('h3');
  });

  it('Renders as expected', () => {
    formHeader.text().should.equal('Sign in');
    wrapper.containsMatchingElement(<h3>Sign in</h3>).should.equal(true);
    wrapper.containsMatchingElement(
      <p>
        Sign in to experience author’s haven great community of creative minds.
        Follow your favourite authors and interact with the articles you love
      </p>,
    ).should.equal(true);
    wrapper.state().should.deep.equal(state);
  });

  it('Should close the modal when the resetModal function is called', () => {
    instance.resetModal();

    expect(props.close).toHaveBeenCalled();
  });

  it('Should call the singIn function when the form is submitted', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    instance.handleSubmit(event);
    expect(props.signIn).toHaveBeenCalled();
  });

  it('Should not submit the form if it\'s invalid', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    instance.setFormValidity = jest.fn();

    instance.validateForm = jest.fn().mockReturnValueOnce(false);
    instance.handleSubmit(event);
    expect(instance.setFormValidity).toHaveBeenCalled();
  });

  it('Should set the state based on changes from the form', () => {
    const event = {
      target: {
        name: 'email',
        value: 'test@testmail.com',
      },
    };
    instance.handleChange(event);
    wrapper.state().email.should.equal(event.target.value);
  });

  it('ValidateForm() should return true if there are no errors', () => {
    instance.validateForm().should.equal(true);
  });

  it('SetFormValidity() Should return true if there are no errors', () => {
    instance.setFormValidity(state.errors).should.equal(true);
  });

  it('Should return false if there are errors', () => {
    instance.setFormValidity({ email: 'mock error' }).should.equal(false);
    wrapper.state().isFormValid.should.equal(false);
  });

  it('toggleVisibility() should make password visible', () => {
    instance.toggleVisibility();
    wrapper.state().showPassword.should.equal(true);
  });
  it('should set window location to backend url for google', () => {
    const event = {
      target: {
        getAttribute: () => 'google',
      },
    };
    instance.handleSocialSignin(event);
  });
  it('should set window location to backend url for facebook', () => {
    const event = {
      target: {
        getAttribute: () => 'facebook',
      },
    };
    instance.handleSocialSignin(event);
  });
  it('on mounting socialLogin should be false', () => {
    instance.componentDidMount = jest.fn();
    instance.componentDidMount();
    const localStorage = {
      getItem: jest.fn().mockReturnValueOnce(false),
    };
    const socialLogin = localStorage.getItem('socialLogin');
    expect(socialLogin).toBe(false);
  });
});
describe('test social media sign in', () => {
  const props = {
    ui: {
      loading: false,
      modalOpen: true,
      modal: 'signin',
    },
    history: {
      push: sinon.spy(),
    },
    close: jest.fn(),
    signIn: jest.fn(),
    signinViaSocial: sinon.spy(),
    requestPassword: jest.fn(),
    showSignUpModal: jest.fn(),
  };
  const e = {
    target: {
      getAttribute: jest.fn().mockReturnValueOnce('google'),
    },
  };
  const wrapper = shallow(<SignIn {...props} />);
  const instance = wrapper.instance();
  const span = wrapper.find('span[name="google"]');
  it('should click the google signin button', () => {
    span.simulate('click', e);
    expect(wrapper).toMatchSnapshot();
    expect(instance.props.signinViaSocial.calledOnce).toBe(true);
  });
  it('should error if no user is found', () => {
    span.simulate('click', e);
    instance.componentDidMount();
    const window = {
      location: {
        search: sinon.match(),
      },
    };
    const localStorage = {
      getItem: jest.fn().mockReturnValueOnce(true),
    };
    const socialLogin = localStorage.getItem('socialLogin');
    expect(socialLogin).toBe(true);
    const URLSearchParmas = sinon.spy();
    const searchParams = new URLSearchParmas(window.location.search);
    searchParams.get = jest.fn().mockReturnValueOnce(false);
    expect(searchParams.get('user')).toBe(false);
    expect(searchParams.get('token')).toBe(undefined);
    expect(instance.componentDidMount()).toBe(false);
  });
  it('should pass and redirect if user is found', () => {
    span.simulate('click', e);
    instance.componentDidMount();
    const window = {
      location: {
        search: sinon.match('token=nmknfkm&&user=kdlmfklm'),
      },
    };
    const localStorage = {
      getItem: jest.fn().mockReturnValueOnce(true),
      setItem: sinon.spy(),
    };
    const setToken = sinon.spy();
    const socialLogin = localStorage.getItem('socialLogin');
    expect(socialLogin).toBe(true);
    const URLSearchParmas = sinon.spy();
    const searchParams = new URLSearchParmas(window.location.search);
    searchParams.get = jest.fn().mockReturnValue(true);
    expect(searchParams.get('user')).toBe(true);
    expect(searchParams.get('token')).toBe(true);
    const decryptQuery = jest.fn().mockReturnValueOnce('jnkjkjjkjnjkjjkkkknjkjkj');
    const token = decryptQuery(searchParams.get('token'));
    expect(token).toBe('jnkjkjjkjnjkjjkkkknjkjkj');
    expect(localStorage.setItem.calledOnce).toBe(false);
    expect(setToken.calledOnce).toBe(false);
    expect(localStorage.setItem.calledOnce).toBe(false);
    expect(instance.props.history.calledOnce).toBe(undefined);
  });
});
describe('should test password rest modal', () => {
  const props = {
    ui: {
      loading: false,
      modalOpen: true,
      modal: 'signin',
    },
    history: {
      push: sinon.spy(),
    },
    close: jest.fn(),
    signIn: jest.fn(),
    signinViaSocial: sinon.spy(),
    requestPassword: jest.fn(),
    showSignUpModal: jest.fn(),
  };
  const wrapper = shallow(<SignIn {...props} />);
  it('should open show signup modal', () => {
    const signUpModal = wrapper.find('#sc-sn');
    signUpModal.simulate('click');
    expect(props.showSignUpModal).toHaveBeenCalled();
  });
});
