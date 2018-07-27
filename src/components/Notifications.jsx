import React from 'react';
import { Switch, Route } from 'react-router-dom';
import proptypes from 'prop-types';
import axios from 'axios';
import Radium from 'radium';

class Notifications extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            initial_data: [{ "message": "No notifications yet" }]
        }

        this.goToHistory = this.goToHistory.bind(this);
    }

    goToHistory(e) {
        console.log(e.target.getAttribute("value"))
        window.location.assign('/history?id=' + e.target.getAttribute('value'))
    }

    componentDidMount() {
        if (window && window.initialData) {
            this.setState({ initial_data: window.initialData.data });
            delete window.initialData
        } else {
            axios.get('/notifications').then((res) => {
                this.setState({ initial_data: res.data.data })
            }).catch((err) => {
                console.log("Error : " + err);
            })
        }


        if (window.initialData) {
            delete window.initialData
        }
    }

    render() {
        return (
            <div>
                    <NotificationDocument initial_data = {this.state.initial_data} goToHistory = {this.goToHistory}/>
            </div>
        );
    }
}


Notifications = Radium(Notifications)
export default Notifications;
// <Navbar links={this.state.links} />


export class NotificationDocument extends React.Component {

    render() {

        var textAlignmentStyle = {
            paddingTop: '14px',
            backgroundColor: '#00A2E5',
            marginTop: '6px',
            cursor: 'pointer',
        }

        var scrollStyle = {
            overflowY: "scroll",
            height: "500px"
        }

       

        var textColorValue = { color: "black", cursor: "pointer" };

        return (
            <div className="column" style={scrollStyle}>
                {this.props.initial_data.map((content, i) => {
                    if (content._id == "undefined") {
                        <div key={i} className="card" style={textAlignmentStyle}>
                            <div key={i}><i className="fas fa-envelope"></i>{content.message}</div>
                            <br />
                        </div>
                    } else {
                        return (
                            <div key={i} className="card" style={textAlignmentStyle} value={content._id}   onClick={this.props.goToHistory}>
                                <div key={i} style={textColorValue} value={content._id} >
                                    <i className="fas fa-envelope" style={{ marginLeft: '10px', marginRight: '10px' }}></i>
                                    Packet delivered by user to company at plant plantname
                                </div>
                                <br />
                            </div>
                        )
                    }
                }
                )}
            </div>
        );
    }
}
