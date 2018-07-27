import React from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import proptype from 'prop-types';
import NotificationSystem from 'react-notification-system';
import { relative } from 'path';
import Radium from 'radium';

class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      submitButtonDisable: false
    }

    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*"
      }
    };

    this.alertObject = {
      autoDismiss: 4,
      position: 'tr'
    }

    this.addNotification = this._addNotification.bind(this);
    this.onLogin = this.onLoginFormSubmission.bind(this);
    this.requestForLogin = this.sendRequestForLogin.bind(this);
    this.toggleSpinner = this.toggleSpinner.bind(this);
  }

  _addNotification(message, level) {
    this.alertObject.message = message;
    this.alertObject.level = level;
    this.refs.notificationSystem.addNotification(this.alertObject);
  }

  onLoginFormSubmission(event) {
    if (this.refs.emailEntered != '' && this.refs.passwordEntered != '') {
      event.preventDefault();
      var loginData = {
        email: this.refs.emailEntered.value,
        password: this.refs.passwordEntered.value
      }
      this.requestForLogin(loginData);
    }
  }

  toggleSpinner(val1, val2) {
    this.refs.spinner.style.display = val1;
    this.refs.loginBtn.style.display = val2;
    if (val1 == "block") {
      this.setState({ submitButtonDisable: true });
    } else {
      this.setState({ submitButtonDisable: false });
    }
  }

  sendRequestForLogin(data) {
    this.toggleSpinner('block', 'none');
    axios.post('/login/user', data, this.axiosConfig).then((response) => {
      if (response.data.Success) {
        this.addNotification('Welcome ' + response.data.username + "   !!!", 'info');
        if (response.data.role == "admin")
          setTimeout(() => { window.location.replace("/dashboard") }, 1000);
        else {
          setTimeout(() => { window.location.replace("/form") }, 1000);
        }
      } else {
        this.toggleSpinner('none', 'block');
        this.addNotification('Email or password is incorrect', 'error');
      }
    }).catch((error) => {
      this.toggleSpinner('none', 'block');
      this.addNotification("MongoDB Server is not responding!!", 'error');
      console.log("Server not listening for this request : ", error)
    })
  }

  render() {

    var styles = {
      textColorValue: {
        color: "black"
      },
      submitButtonStyle: {
        color: "#000000",
        backgroundColor: "#DCDCDC",
        ':hover': {
          backgroundColor: '#B5EDDC',
          transitionDuration: '.2s',
          transitionTimingFunction: 'ease-out'
        }
      },
      iTagForSpinnerStyle: {
        fontSize: '24px',
        display: 'none'
      }
    }

    return (<div style={{marginTop : "40px" , marginLeft : "500px" , minWidth : "700px"}}>
      <NotificationSystem ref="notificationSystem" />

      <div className="row">


        <div className="col-md-10 col-lg-8 col-xl-5 mb-4">

          <section className="form-elegant scrollbar-light-blue">


            <div className="card">

              <div className="card-body mx-4">


                <div className="text-center">
                  <h3 className="dark-grey-text mb-5"><strong>Login</strong></h3>
                </div>


                <form className="md-form" onSubmit={this.onLogin}>
                  <div className="md-form">
                    <label htmlFor="Form-email1">Your email</label>
                    <input type="text" className="form-control" ref="emailEntered" placeholder="original4sure email"/>
                  </div>

                  <div className="md-form pb-3" style={{marginTop : "20px"}}>
                    <label htmlFor="Form-pass1">Your password</label>
                    <input type="password" className="form-control" ref="passwordEntered" placeholder="password"/>
                  </div>

                  <div className="text-center mb-3">
                    <button type="submit" className="btn blue-gradient btn-block btn-rounded z-depth-1a"
                     disabled={this.state.submitButtonDisable} style={styles.submitButtonStyle} ref="submitBtn">
                    <i className="fas fa-spinner fa-spin" ref="spinner" style={styles.iTagForSpinnerStyle}></i>  
                    <span ref="loginBtn">Login</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);
  }
}

LoginForm = Radium(LoginForm)

export default LoginForm;

