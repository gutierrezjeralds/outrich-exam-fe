import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import EditProfile from './views/Edit-Profile'
import { MDBBox } from 'mdbreact'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuthenticated: false,
            pages: [
                {
                    id: 1,
                    render: <Login />,
                    wrapper: "login",
                    path: "/login"
                },
                {
                    id: 2,
                    render: <Dashboard />,
                    wrapper: "dashboard",
                    path: "/"
                },
                {
                    id: 2.1,
                    render: <Dashboard />,
                    wrapper: "dashboard",
                    path: "/dashboard"
                },
                {
                    id: 3,
                    render: <EditProfile />,
                    wrapper: "edit-profile",
                    path: "/edit-profile"
                }
                // {
                //     id: 0,
                //     render: <NotFound />,
                //     wrapper: "notFound",
                //     path: "*"
                // }
            ]
        }
    }

    UNSAFE_componentWillMount() {
        const auth = this.getCookie("authenticate")
        this.setState({
            isAuthenticated: auth !== "" ? auth : "false"
        })
    }

    // Get Cookie
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    render() {
        const { isAuthenticated } = this.state;
        return (
            <React.Fragment>
                <MDBBox tag="div" className="exam-app">
                    <Router>
                        { isAuthenticated === "true" ? <Header name={this.getCookie("MName")} /> : "" }
                            {/* Body */}
                            <Switch >
                                {
                                    this.state.pages.map(items => (
                                        <Route exact path={items.path} key={items.id}
                                            render = {
                                                () => (
                                                    <MDBBox tag="main" className="py-5">
                                                        {
                                                            items.wrapper !== "login" ?
                                                                isAuthenticated === "true" ? items.render : <Redirect to="/login" />
                                                            :
                                                                isAuthenticated === "false" ? items.render : <Redirect to="/dashboard" />
                                                        }
                                                    </MDBBox>
                                                )
                                            }
                                        />
                                    ))
                                }
                            </Switch>
                            {/* Body */}
                        { isAuthenticated === "true" ? <Footer /> : "" }
                    </Router>
                </MDBBox>
            </React.Fragment>
        )
    }
}

export default Main