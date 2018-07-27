import React from 'react';
import { NavLink } from 'react-router-dom';
import proptype from 'prop-types';
import Radium from 'radium'

class NavBarLinks extends React.Component {

    render() {
        var styles = {
            navLinkStyle: {
                color: "#CC7B00",
                paddingLeft: "46px",
                paddingRight: "46px"
            },
            arrowStyle: {
                marginBottom: '-7px'
            },
            liLinkStyle: {
                marginLeft: '5px',
                backgroundColor: "#90000000",
                ':hover': {
                    backgroundColor: "#CCCCBC",
                    transitionDuration: '.2s',
                    transitionTimingFunction: 'ease-out'
                }
            }
        }

        var classActive = "nav-item card",
            upArrowIndicatorClass = "",
            textValue = this.props.link.name,
            hrefValue = this.props.link.path,
            styleValue = "#d3d3d3";
        if (this.props.link.active == true) {
            classActive = classActive + " active";
            upArrowIndicatorClass = "fas fa-sort-up arrowUp";
        }
        return (
            <ul className="navbar-nav" >
                <li className={classActive} style={styles.liLinkStyle}>
                    <NavLink className="nav-link" style={styles.navLinkStyle} onClick={this.props.onClick}
                        to={hrefValue}><b>{textValue}</b><i style={styles.arrowStyle}
                            className={upArrowIndicatorClass}></i>
                    </NavLink>
                </li>
            </ul>
        );
    }
}

NavBarLinks = Radium(NavBarLinks)

export default NavBarLinks;

{/* <span className="sr-only">(current)</span> */ }


