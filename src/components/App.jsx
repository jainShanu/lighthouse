import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '../routes.js';
import proptypes from 'prop-types';
import Navbar from './Navbar';

class App extends React.Component {
    constructor(props){
      super(props);

      this.state = {
          links: [
            { "name": "Dashboard", "path": "/dashboard"},
            { "name": "Form", "path": "/form"},
            { "name": "History", "path": "/history"},
            { "name": "Notifications", "path": "/notifications"},
            { "name": "Logout", "path": "" }
          ]
      }

      this.changeTheme = this.changeTheme.bind(this);
    }

    componentDidMount(){
      this.app.parentNode.parentNode.style.backgroundColor = "#E4E6EA"
    }

    changeTheme(num){
      if(num == 1)
        this.app.parentNode.parentNode.style.backgroundColor = "#E4E6EA";
      else
        this.app.parentNode.parentNode.style.backgroundColor = "#3C3A43";
    }

    render() {
        return (
            <div ref={(re)=>this.app = re}>
                <Navbar links={this.state.links} changeTheme={this.changeTheme} ref={(re)=>this.Nav = re}/>
                <Switch>
                    {
                        routes.map((route, i) => {
                            return <Route key={i} {...route} />
                            }
                        )
                    }
                </Switch>
            </div>
        );
    }
}



export default App;
