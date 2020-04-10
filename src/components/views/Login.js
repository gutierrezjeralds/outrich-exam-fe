import React from 'react'
import Snackbar from "./includes/Snackbar"
import $ from 'jquery'
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon, MDBInput, MDBContainer, MDBBox } from "mdbreact"

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            in_email: "",
            in_password: "",
            in_submit: false,
            loc_latitude: null,
            loc_longitude: null,
            isNotif: false,
            notifCat: "default",
            notifStr: "",
            err_incorrect: false,
            err_unexpected: false,
            form: [
                {
                    id: 1,
                    label: "Email Address",
                    icon: "envelope",
                    type: "email",
                    fid: "in_email"
                },
                {
                    id: 2,
                    label: "Password",
                    icon: "lock",
                    type: "password",
                    fid: "in_password"
                },
            ],
        }
    }

    // Set Cookie
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    handleChange(fid, event) {
        this.setState({
            [fid]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getLocLogin()
    }

    getLocLogin() {
        const location = window.navigator && window.navigator.geolocation

        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    loc_latitude: position.coords.latitude,
                    loc_longitude: position.coords.longitude,
                })
                // Send Login command
                this.sendLogin()

            }, (error) => {
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', error)
                // Send Login command
                this.sendLogin()
            })
        } else {
            // Send Login command
            this.sendLogin()
        }
    }

    sendLogin = () => {
        const data = {
            email: this.state.in_email,
            pass: this.state.in_password,
            latitude: this.state.loc_latitude,
            longitude: this.state.loc_longitude
        }

        this.setState({
            in_submit: true,
            isNotif: false,
            err_incorrect: false,
            err_unexpected: false,
        })

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-login",
            type: 'GET',
            data: data,
            cache: false
        })
        .then(
            (result) => {
                if ( result.response === "fail" ) {
                    this.setState({
                        in_submit: false,
                        err_unexpected: true
                    })
                } else if ( result.response === "incorrect" || result.response === "no-data" ) {
                    this.setState({
                        in_submit: false,
                        err_incorrect: true
                    })
                } else {
                    // Success
                    this.setState({
                        isNotif: true,
                        notifCat: "success",
                        notifStr: "Login Successfully!"
                    })
    
                    this.setCookie("authenticate", true, 1)
                    this.setCookie("MName", result.response.name, 1)
                    this.setCookie("MTrack", result.response.id, 1)
                    this.setCookie("MRole", result.response.role, 1)
    
                    setTimeout(
                        function() {
                            window.location.href = "/dashboard"
                        } , 100
                    )
                }
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                // Handle errors here
                this.setState({
                    in_submit: false,
                    isNotif: true,
                    notifCat: "error",
                    notifStr: "Unexpected error, please reload the page!"
                })

                console.error('Oh well, you failed. Here some thoughts on the error that occured:', error)
            }
        )
        .catch(
            (err) => {
                // Handle errors here
                this.setState({
                    in_submit: false,
                    isNotif: true,
                    notifCat: "error",
                    notifStr: "Unexpected error, please reload the page!"
                })
                
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', err)
            }
        )
    }

    renderErrorMsg() {
        if ( this.state.err_incorrect ) {
            return (
                <MDBBox tag="div" className="my-3 px-2 py-1 danger-bg font-size-1rem white-text">
                    Incorrect email or password.
                </MDBBox>
            )
        }

        if ( this.state.err_unexpected ) {
            return (
                <MDBBox tag="div" className="my-3 px-2 py-1 danger-bg font-size-1rem white-text">
                    Unexpected error, please reload the page!
                </MDBBox>
            )
        }
    }

    renderSubmitElement(){
        if ( this.state.in_submit ) {
            // Already clicked the submit button
            return (
                <button type="submit" className="btn btn-default" disabled>
                    <MDBIcon icon="spinner" className="fa-spin mr-2" />
                    Loading
                </button>
            )
        } else {
            // Onload element display
            return (
                <button type="submit" className="btn btn-default">
                    <MDBIcon icon="paper-plane" className="mr-2" />
                    Submit
                </button>
            )
        }
    }

    render() {
        document.title = "Login | Jerald Gutierrez"
        return (
            <React.Fragment>
                {
                    this.state.isNotif ? (
                        <Snackbar category={this.state.notifCat} string={this.state.notifStr} />
                    ) : ("")
                }
                
                <MDBContainer className="py-5 my-5 login-wrapper">
                    <MDBRow className="align-items-lg-center justify-content-lg-center">
                        <MDBCol lg="5">
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBBox tag="div" className="form-header ice-bg white-text login-form-header">
                                        <MDBBox tag="h4" className="mt-2">
                                            <MDBIcon icon="lock" /> Login
                                        </MDBBox>
                                    </MDBBox>
                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                        {
                                            this.state.form.map(items => (
                                                <MDBBox tag="div" className="md-form" key={items.id}>
                                                    <MDBInput onChange={this.handleChange.bind(this, items.fid)} icon={items.icon} label={items.label} iconClass={items.iconClass + " grey-text"} type={items.type} id={items.fid} required />
                                                </MDBBox>
                                            ))
                                        }
                                        {this.renderErrorMsg()}
                                        <MDBBox tag="div" className="text-center">
                                            {this.renderSubmitElement()}
                                        </MDBBox>
                                    </form>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </React.Fragment>
        )
    }
}

export default Login