import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from './../_actions/user.actions';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        avatar: null,
      },
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    const { user } = this.state;

    if (name === 'avatar') {
      let reader = new FileReader();
      let file = event.target.files[0];
      reader.onloadend = () => {
        this.setState({
          user: {
            ...user,
            [name]: file
          }
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({
        user: {
          ...user,
          [name]: value
        }
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    if (user.firstname && user.lastname && user.email && user.password) {
      this.props.register(user);
    }
  }

  render() {
    const { registering } = this.props;
    const { user, submitted } = this.state;
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#EEEEEE' }}>
        <div className="jumbotron">
          <div className="container">
            <div className="col-sm-8 col-sm-offset-2">
              <div className="col-md-6 col-md-offset-3">
                <h2>Register</h2>

                <form name="form" onSubmit={this.handleSubmit}>

                  <div className={'form-group' + (submitted && !user.firstname ? ' has-error' : '')}>
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" className="form-control" name="firstname" value={user.firstname} onChange={this.handleChange} />
                    {submitted && !user.firstname &&
                      <div className="help-block">First Name is required</div>
                    }
                  </div>

                  <div className={'form-group' + (submitted && !user.lastname ? ' has-error' : '')}>
                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" className="form-control" name="lastname" value={user.lastname} onChange={this.handleChange} />
                    {submitted && !user.lastname &&
                      <div className="help-block">Last Name is required</div>
                    }
                  </div>

                  <div className={'form-group' + (submitted && !user.email ? ' has-error' : '')}>
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" name="email" value={user.email} onChange={this.handleChange} />
                    {submitted && !user.email &&
                      <div className="help-block">Email is required</div>
                    }
                  </div>

                  <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" name="password" value={user.password} onChange={this.handleChange} />
                    {submitted && !user.password &&
                      <div className="help-block">Password is required</div>
                    }
                  </div>

                  <div className={'form-group' + (submitted && !user.avatar ? ' has-error' : '')}>
                    <label htmlFor="avatar">Avatar</label>
                    <input type="file" className="form-control" name="avatar" accept="image/*" onChange={this.handleChange}/>
                    {submitted && !user.avatar &&
                      <div className="help-block">Avatar is required</div>
                    }
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary">Register</button>
                    {registering &&
                      <img alt='waiting' src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                    <Link to="/login" className="btn btn-link">Cancel</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  register: userActions.register
}

const connectedRegisterPage = connect(mapStateToProps, actionCreators)(RegisterPage);
export { connectedRegisterPage as RegisterPage };