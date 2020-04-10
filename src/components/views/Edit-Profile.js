import React from 'react'
import Snackbar from "./includes/Snackbar"
import $ from 'jquery'
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon, MDBInput, MDBContainer, MDBBox } from "mdbreact"

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            in_name: "",
            in_password: "",
            in_submit: false,
            isNotif: false,
            notifCat: "default",
            notifStr: ""
        }
    }

    UNSAFE_componentWillMount() {
        this.getUsers()
    }

    handleChange(fid, event) {
        this.setState({
            [fid]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.sendUpdate()
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

    getUsers(){
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-user-info",
            dataType: "json",
            data: {
                key: this.getCookie("MTrack")
            },
            cache: false
        })
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    in_name: result[0].name
                })
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    isNotif: true,
                    notifCat: "error",
                    notifStr: "Unexpected error, please reload the page!",
                    error: true
                })
                    
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', error)
            }
        )
        .catch(
            (err) => {
                this.setState({
                    isLoaded: true,
                    isNotif: true,
                    notifCat: "error",
                    notifStr: "Unexpected error, please reload the page!",
                    error: true
                })
                    
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', err)
            }
        )
    }

    sendUpdate = () => {
        const data = {
            method: "edit",
            key: this.getCookie("MTrack"),
            name: this.state.in_name,
            pass: this.state.in_password,
        }

        this.setState({
            in_submit: true,
            isNotif: false,
        })

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-command-users",
            type: 'POST',
            data: data,
            cache: false
        })
        .then(
            (result) => {
                if ( result.response ) {
                    // Success
                    this.setState({
                        isNotif: true,
                        notifCat: "success",
                        notifStr: "Update Successfully!"
                    })
    
                    setTimeout(
                        function() {
                            window.location.reload()
                        } , 100
                    )
                } else {
                    this.setState({
                        in_submit: false,
                        err_unexpected: true
                    })
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
                    Update
                </button>
            )
        }
    }

    render() {
        document.title = "Edit Profile | Jerald Gutierrez"
        return (
            <React.Fragment>
                {
                    !this.state.isLoaded ? (
                        // Loading
                        <MDBBox tag="div" className="loader-section">
                            <MDBBox tag="div" className="position-fixed z-index-9999 l-0 t-0 r-0 b-0 m-auto overflow-visible flex-center">
                                <MDBBox tag="span" className="loader-spin-dual-ring"></MDBBox>
                                <MDBBox tag="span" className="ml-2 font-size-1rem white-text">Loading, please wait...</MDBBox>
                            </MDBBox>
                            <MDBBox tag="div" className="loader-backdrop position-fixed z-index-1040 l-0 t-0 r-0 b-0 black"></MDBBox>
                        </MDBBox>
                    ) : ("")
                }
                
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
                                    <h4 className="card-title">Edit Profile</h4>
                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                        <MDBBox tag="div" className="md-form">
                                            <MDBInput onChange={this.handleChange.bind(this, "in_name")} icon="user" label="Name" iconClass="grey-text" type="text" value={this.state.in_name} id="in_name" required />
                                        </MDBBox>
                                        <MDBBox tag="div" className="md-form">
                                            <MDBInput onChange={this.handleChange.bind(this, "in_password")} icon="lock" label="Password" iconClass="grey-text" type="password" id="in_password" required />
                                        </MDBBox>
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

export default EditProfile