import React from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import proptype from 'prop-types';
import Radium from 'radium'
import NotificationSystem from 'react-notification-system';

class DispatchDetailsForm extends React.Component {
  constructor() {
    super();

    this.state = {
      company_data: [],
      plant_data: [],
      submitButtonDisable: false
    }

    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*"
      }
    }

    this.alertObject = {
      autoDismiss: 4,
      position: 'tr'
    }

    this.addNotification = this._addNotification.bind(this);
    this.sendDataToVerify = this.sendDataToVerify.bind(this);
    this.request = this.sendDispatchDetails.bind(this);
    this.changeFormat = this.changeFormatDateFormat.bind(this);
    this.onCompanySelect = this.onCompanySelect.bind(this);
  }

  sendDataToVerify(e) {
    e.preventDefault();
    //console.log(this.company.heading.value.split("-")[0]);
   //console.log(this.refs.companySelect.value + " " + this.refs.plantSelect.value + " " + this.refs.selectedDate.value)
    if (this.company.companySelect.value.split("-")[0] != '-select company-' && this.plant.plantSelect.value.split("-")[0] != '-select plant location-' && this.refs.selectedDate.value != 'dd/mm/yyyy') {
      var DispatchedDetails = {
        serialStart: this.refs.serialStart.value,
        serialEnd: this.refs.serialEnd.value,
        missingInventory: this.refs.mInv.value,
        company: this.company.companySelect.value.split("-")[0],
        plant: this.plant.plantSelect.value.split("-")[0],  
        dateDispatched: this.refs.selectedDate.value,
        dispatchedVia: this.refs.dispatchVia.value
      }
      this.request(DispatchedDetails);
    }
  }

  componentDidMount() {
    if (window.initialData) {
      this.setState({ company_data: window.initialData });
      delete window.initialData;
    }
    else {
      axios.get('/api/company/companies-list').then((res) => {
        this.setState({ company_data: res.data })
      }).catch((err) => {
        console.log("Error : " + err);
      })
    }

    if (window.initialData) {
      delete window.initialData
    }
  }

  changeFormatDateFormat(date) {
    var dateArray = date.toString().split('-');
    return dateArray[1] + "-" + dateArray[2] + "-" + dateArray["0"];
  }

  sendDispatchDetails(data) {
    this.toggleSpinner('block', 'none');
    data.dateDispatched = this.changeFormat(data.dateDispatched);
    axios.post('/form/dispatchDetails', data, this.axiosConfig).then((response) => {
      this.toggleSpinner('none', 'block');
      this.addNotification(response.data.message, "info")
      this.refs.dispatchFormRef.reset();
    }).catch((error) => {
      this.toggleSpinner('none', 'block');
      this.addNotification(response.data.message, "error")
      console.log("Server not listening for this request : ", error)
    })
  }

  _addNotification(message, level) {
    this.alertObject.message = message;
    this.alertObject.level = level;
    this.refs.notificationSystem.addNotification(this.alertObject);
  }

  toggleSpinner(val1, val2) {
    this.refs.spinner.style.display = val1;
    this.refs.submitBtn.style.display = val2;
    if (val1 == "block") {
      this.setState({ submitButtonDisable: true });
    } else {
      this.setState({ submitButtonDisable: false });
    }
  }

  onCompanySelect(e){
    let id = e.target.value.split("-")[1] 
    axios("/api/company/"+id+"/plantsList")
    .then((response)=>{
      this.setState({plant_data : response.data})
    }).catch((err)=>{
      console.log("plant request ERR : "+err)
    })
    
    //axios.get
  }

  render() {

    var styles = {
      formStyle: {
        margin: "15px,0,15px,0"
      },
      submitButtonStyle: {
        color: "#000000",
        backgroundColor: "#993399",
        marginBottom: "3px",
        ':hover': {
          backgroundColor: '#6E7FCC',
          transitionDuration: '.2s',
          transitionTimingFunction: 'ease-out'
        }
      },
      fieldStyle: {
        marginBottom: "10px"
      },
      labelStyle: {
        color: "black"
      },
      iTagForSpinnerStyle: {
        fontSize: 24 + "px",
        display: 'none'
      }
    }

    return (<div className="card">
      <NotificationSystem ref="notificationSystem" />
      <div style={styles.formStyle}>
        <form ref="dispatchFormRef" onSubmit={this.sendDataToVerify} >
          <div className="row">
            <div className="form-group col-lg-4 offset-lg-4">
              <label htmlFor="serialStart" style={styles.labelStyle}>Serial Start :
            </label><input type="number" className="form-control input" style={styles.fieldStyle} ref="serialStart" required="required" />

              <label htmlFor="serialEnd" style={styles.labelStyle}>Serial End :
            </label><input type="number" className="form-control" ref="serialEnd" required="required" />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-lg-4 offset-lg-4">
              <label htmlFor="missingInv" style={styles.labelStyle}>Missing Inventory :
            </label>
              <input type="number" className="form-control" style={styles.fieldStyle} ref="mInv" required="required" />
            </div>
          </div>
          <div className="row">
            <div className="form-inline offset-lg-4" >
              <div className="form-group">
                <label htmlFor="company" style={styles.labelStyle}>Company :
              </label>&nbsp;&nbsp;
                <CompanySelect data={this.state.company_data} handler={this.onCompanySelect} ref={(node) => {this.company = node} }/>
              </div>
              &emsp;&emsp;&emsp;&emsp;
            <div className="form-group">
                <label htmlFor="plant" style={styles.labelStyle}>Plant :
              </label>&nbsp;&nbsp;
              <PlantSelect data={this.state.plant_data} ref={(node) => {this.plant = node} }/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-lg-4 offset-lg-4" >
              <label htmlFor="pwd" style={styles.labelStyle}>Date:</label>&nbsp;&nbsp;
            <input className="form-control" style={styles.fieldStyle} type="date" ref="selectedDate" />
            </div>
          </div>
          <div className="row">
            <div className="form-group shadow-textarea col-lg-4 offset-lg-4">
              <label htmlFor="exampleFormControlTextarea6" style={styles.labelStyle}>Dispatch Via :
            </label>
              <textarea className="form-control z-depth-1" style={styles.fieldStyle} ref="dispatchVia" rows="3" placeholder="How did you dispatch the packet...."></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 offset-lg-4">
              <button type="submit" className="btn btn-default" disabled={this.state.submitButtonDisable} style={styles.submitButtonStyle}
                ref="submitBtn"><i className="fas fa-spinner fa-spin" ref="spinner" style={styles.iTagForSpinnerStyle}></i>Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>);
  }
}

DispatchDetailsForm = Radium(DispatchDetailsForm)

export default DispatchDetailsForm;
// <Navbar links={this.state.links}/>

class CompanySelect extends React.Component {

  render() {
    return (
      <select className="form-control mb-2 mr-sm-2" ref={(node) => { this.companySelect = node; }} onChange={this.props.handler}>
        <option defaultValue="defaultValue">-select company-</option>
        {
          this.props.data.map((content, i) => {
            return <option key={i} value={content.name+"-"+content.id}>{content.name}</option>
          })
        }
      </select>
    )
  }
}

class PlantSelect extends React.Component {

  render() {
    var disable = true
    if(this.props.data.length > 0){ 
      disable = false
    }
    return (
      <select disabled={disable} className="form-control mb-2 mr-sm-2" ref={(node) => { this.plantSelect = node; }} >
        <option defaultValue="defaultValue">-select plant location-</option>
        {
          this.props.data.map((content, i) => {
          return <option key={i} value={content.name+"-"+content.id}>{content.name}</option>
        })
        }
      </select>
    )
  }
}