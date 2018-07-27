import React from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import proptype from 'prop-types';

class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        let initialData;
        if (initialData)
            initialData = this.props.staticContext.initialData.data;


        this.state = {
            initial_data: initialData
        }

    }

    componentDidMount() {
        if (window.initialData) {
            this.setState({ initial_data: window.initialData.data });
            delete window.initialData;
        } 
        else {
            axios.get('/dashboard').then((res) => {
                this.setState({initial_data : res.data.data})
              }).catch((err) => {
                console.log("Error : " + err);
              })
        }

        if(window.initialData){
          delete window.initialData
        }
    }

    // static requestInitialData() {
    //     return axios('http://127.0.0.1:3000/api/data')
    //         .then((response) => response)
    //         .catch((err) => console.log(err));
    // }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div style={textStyle}>{this.state.initial_data}</div>
                </div>
            </div>
        );
    }
}

export default DashBoard;

var textStyle = { color: "black" };    


// <Navbar links={this.state.links} />
// if (!this.state.initial_data) {
        //     // this.setState({initial_data : res.data.name}
        //     DashBoard.requestInitialData().then(res => console.log(res));
        // }

        // static requestInitialData(){
    //     return fetch('http://127.0.0.1:3000/api/data')
    //         .then((response)=>response.json())
    //         .catch((err)=>console.log(err));
    // }
