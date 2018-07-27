import LoginForm from './components/LoginForm.jsx';
import DashBoard from './components/Dashboard.jsx';
// import Navbar from './components/Navbar.jsx';
import DispatchDetailsForm from './components/DispatchDetailsForm.jsx';
import Notifications from './components/Notifications.jsx';
import CummalativeHistory from './components/CummalativeHistory.jsx';

const routes = [
    {
        path : "/login",
        component : LoginForm,
        exact : true
    },
    {
        path : "/dashboard",
        component : DashBoard,
        exact : true
    },
    {
        path : "/form",
        component : DispatchDetailsForm
    },
    {
        path : "/notifications",
        component : Notifications,
    },
    {
        path : "/history",
        component : CummalativeHistory,
    },
]

export default routes;
