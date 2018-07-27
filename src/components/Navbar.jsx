import React from 'react';
import proptype from 'prop-types';
import NavBarLinks from './NavBarLinks';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactDOM from 'react-dom'
import Radium from 'radium'
var NotificationSystem = require('react-notification-system');

var navLinkArr = ["Dashboard", "Form", "Notifications", "History"] // Array contains all links name

class Navbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      link_s: [],
      theme: ["bg-dark navbar-dark"]
    }

    this.logout = this.logoutFromDashboard.bind(this);
    this.otherclick = this.otherLinksFromDashboardClicked.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.changeNavbarState = this.highlightSelectedLink.bind(this);
    this.changeActiveProp = this.changeActiveProp.bind(this);
    this.filterValuesAccordingTheRole = this.filterValuesAccordingTheRole.bind(this);
  }


  componentDidMount() {
    let path = window.location.pathname;
    if (path == "/login") {
      this.setState({
        link_s: [
          {
            "name": "Login",
            "path": "/login"
          }
        ]
      });
    } else {
      if (path == '/dashboard') {
        this.changeActiveProp("set", navLinkArr[0]);
      } else if (path == '/form') {
        this.changeActiveProp("set", navLinkArr[1]);
      } else if (path == '/notifications') {
        this.changeActiveProp("set", navLinkArr[2]);
      } else if (path == '/history') {
        this.changeActiveProp("set", navLinkArr[3]);
      }

    }
  }

  logoutFromDashboard(e) {
    var decision = confirm("Do you want to logout ? ");
    if (decision == false) {
      e.preventDefault();
    }
    if (decision == true) {
      axios.post('/logout').then((res) => {
        window.location.replace("/login");
      }).catch((err) => {
        console.log("error :" + err);
      });

    }
  }

  filterValuesAccordingTheRole(values) {
    if (window.role == "admin") {
      return values;
    } else {
      values = values.filter(e => {
        if (e.name != navLinkArr[2] && e.name != navLinkArr[0]) {
          return e;
        }
      })
      return values;
    }
  }

  changeActiveProp(condition, activeLink) {
    this.nav.style.display = "block"    ////// To show navbar in these routes and to hide it while login
    let values = "";
    if (condition == "set") {
      values = this.filterValuesAccordingTheRole(this.props.links);
    } else if (condition == "update") {
      values = this.state.link_s;
    }

    values.forEach((element) => {
      if (element.name == activeLink) {
        element.active = true;
      } else {
        element.active = false;
      }
    });

    this.setState({ link_s: values })
  }

  highlightSelectedLink(e) {
    let text = e.target.innerText;
    this.changeActiveProp("update", text);
  }

  otherLinksFromDashboardClicked(e) {

    this.changeNavbarState(e);
    let innerText = e.target.innerText;

    switch (innerText) {
      case navLinkArr[0]:
        axios.get('/dashboard').then((res) => {
          window.dashboardData = res.data;
        }).catch((err) => {
          console.log("Error : " + err);
        })
        break;
      case navLinkArr[1]:
        axios.get('/api/company/companies-list').then((res) => {
          window.formData = res.data
        }).catch((err) => {
          console.log("Error : " + err);
        })
        break;

      case navLinkArr[2]:
        axios.get('/notifications').then((res) => {
          console.log("done");
        }).catch((err) => {
          console.log("Error : " + err);
        })
        break;

      case navLinkArr[3]:
        axios.get('/history').then((res) => {
          console.log("done");
        }).catch((err) => {
          console.log("Error : " + err);
        })
        break;

      default:
        break;
    }
  }

  changeTheme(e) {
    if (this.state.theme[0] == "bg-light navbar-light") {
      this.setState({ theme: ["bg-dark navbar-dark"] });
      this.props.changeTheme(1)
    } else {
      this.setState({ theme: ["bg-light navbar-light"] });
      this.props.changeTheme(2)
    }
  }

  render() {
    var themeValue = "navbar navbar-expand-sm " + this.state.theme[0];
    var styles = {
      navbarStyle: {
        marginBottom: "20px",
        display : "none"
      },
      o4sStyle: {
        backgroundColor: "#1014C0AD",
        paddingLeft: "10px",
        ':hover': {
          backgroundColor: '#067ACC',
          transitionDuration: '.2s',
          transitionTimingFunction: 'ease-out'
        }
      },
      textColorOnHover: {
        ':hover': {
          color: '#4BCC7F'
        }
      },
      themeSelection: {
        cursor: "pointer"
      }
    }
    return (
      <div className=".col-xs-6 .col-md-4" style={styles.navbarStyle} ref={(node)=>{this.nav = node}}>
        <nav className={themeValue}>
          <ul className="navbar-nav mr-auto" >
            <li className="nav-item card" key="1" style={styles.o4sStyle}>
              <a className="navbar-brand" key="2" style={styles.textColorOnHover} href="https://www.original4sure.com/" target="_blank" >Original4Sure</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" style={styles.themeSelection} onClick={this.changeTheme}><i className="fas fa-exchange-alt"></i> Theme</a>
            </li>
            <ul className="navbar-nav ml-auto" >
              {
                this.state.link_s.map((content, i) => {
                  if (content.name == "Logout") {
                    return <NavBarLinks key={i} link={content} onClick={this.logout} />
                  }
                  return <NavBarLinks key={i} link={content} onClick={this.otherclick} />

                })
              }
            </ul>
          </ul>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  links: proptype.array.isRequired
}

Navbar = Radium(Navbar)

export default Navbar;


