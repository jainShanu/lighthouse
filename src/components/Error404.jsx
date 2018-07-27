import React from 'react';

class Error404 extends React.Component {
  constructor(props) {
    super(props);

    this.btnTapped = this.btnTapped.bind(this);
  }

  btnTapped() {
    window.location.replace("/dashboard");
  }

  render() {
    return (
      <div ref="errorId">
      <div className="col-lg-4 offset-lg-4" style={{
          marginTop: 200 + 'px'
        }}>
        <h1 style={textStyle}>404</h1>
        <h4>Page not found!!!!</h4>
        <button type="button" className="btn btn-info" onClick={this.btnTapped} style={{
            width: 240 + "px"
          }}>
          <span style={{
              fontSize: 24 + "px",
              marginRight: 10 + "px"
            }}>Go home</span>
          <i className="fa fa-arrow-circle-up fa-2x"></i>
        </button>
      </div>
    </div>);
  }
}

export default Error404;

const textStyle = {
  fontSize: '100px'
}