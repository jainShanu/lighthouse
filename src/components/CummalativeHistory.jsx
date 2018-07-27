import React from 'react';
import { Switch, Route } from 'react-router-dom';
import proptypes from 'prop-types';
import axios from 'axios';

var requestedDocumentId = "";

export default class CummalativeHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initial_data: [],
        }

        this.checkForRequestedDocumentToHighlight = this.checkForRequestedDocumentToHighlight.bind(this)
    }

    componentDidMount() {
        if (window && window.initialData) {
            this.setState({ initial_data: window.initialData.data });
            delete window.initialData
        } else {
            axios.get('/history').then((res) => {
                this.setState({ initial_data: res.data.data })
            }).catch((err) => {
                console.log("Error : " + err);
            })
        }

        //to highlight the requested document using id provided in url
        this.checkForRequestedDocumentToHighlight()


        if (window.initialData) {
            delete window.initialData
        }
    }

    checkForRequestedDocumentToHighlight() {
        requestedDocumentId = window.location.search.split('=')[1]
    }

    render() {
        var color = "";
        return (
            <div>
                <ContentHeaders />
                <div style={documentStyle}>
                    {this.state.initial_data.map((content, i) => {
                        if (requestedDocumentId === content._id) {
                            color = "#75BECC"
                        } else {
                            color = "white"
                        }

                        return (
                            <div key={i} style={{ marginTop: "3px", border : ".8px solid orange"}}>
                                <HistoryDocument content={content} style={color} />
                            </div>
                        );
                    }
                    )}
                </div>
            </div>
        );
    }
}

// <Navbar links={this.state.links} />

class ContentHeaders extends React.Component {
    render() {
        return (
            <div style={headerStyle} className="container-fluid card">
                <div className="row">
                    <div className="col-md-8">
                        <div className="row" style={alignCenter}>
                            <div className="col-md-2">Company</div>
                            <div className="col-md-2">Plant</div>
                            <div className="col-md-6">
                                <div className="row" style={alignCenter}>
                                    <div className="col-md-4">Serial Start</div>
                                    <div className="col-md-4">Serial End</div>
                                    <div className="col-md-4">Missing Inventory</div>
                                </div>
                            </div>
                            <div className="col-md-2">Date<p style={{ fontSize: "12px" }}>YYYY-MM-DD</p></div>
                        </div>
                    </div>


                    <div className="col-md-4">
                        <div className="row" style={alignCenter}>
                            <div className="col-md-4">Dispatched By</div>
                            <div className="col-md-4">Dispatch Via</div>
                            <div className="col-md-4">Validated</div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

class HistoryDocument extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            content: this.props.content,
            color: this.props.style
        }
    }

    showContent(e) {
        e.target.style.display = "none"
        e.target.nextSibling.style.display = "block"
        e.target.previousSibling.style.display = "block"
    }


    hideContent(e) {
        e.target.style.display = "none"
        e.target.previousSibling.previousSibling.style.display = "none"
        e.target.previousSibling.style.display = "block"
    }


    render() {
        var content = this.state.content;
        var highlightStyle = {
            backgroundColor: this.state.color
        }
        return (
            <div>
                <div className="container-fluid card" style={highlightStyle}>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row" style={alignCenter}>
                                <div className="col-md-2" >{content.company}</div>
                                <div className="col-md-2">{content.plant}</div>
                                <div className="col-md-6">
                                    <div className="row" style={alignCenter}>
                                        <div className="col-md-4">{content.serialStart}</div>
                                        <div className="col-md-4">{content.serialEnd}</div>
                                        <div className="col-md-4">{content.missingInventory}</div>
                                    </div>
                                </div>
                                <div className="col-md-2">{content.dateDispatched.slice(0, 10)}</div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="row" style={alignCenter}>
                                <div className="col-md-4">{content.dispatchedBy}</div>
                                <div className="col-md-4">
                                    <p ref="dispatchViaContent" style={contentDisable}>{content.dispatchedVia}</p>
                                    <p ref="show" style={{ color: "blue", cursor: "pointer" }} onClick={this.showContent.bind(this)}>show</p>
                                    <p ref="hide" style={{ color: "blue", cursor: "pointer", display: "none" }} onClick={this.hideContent.bind(this)}>..hide</p>
                                </div>
                                <div className="col-md-4">{content.hasValidated ? "true" : "false"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

//styling objects
const contentDisable = {
    display: 'none'
}

const textColorValue = {
    color: "white"
},
    documentStyle = {
        marginTop: "20px",
        overflowY: "scroll",
        height: "500px",
        paddingLeft: "8px"
    },
    alignCenter = {
        textAlign: "center"
    },
    headerStyle = {
        color: "white",
        backgroundColor: "#0CA5CC"
    },
    fieldStyle = {
        backgroundColor: "#20000000"
    }


