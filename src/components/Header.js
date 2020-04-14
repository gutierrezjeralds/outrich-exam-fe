import React, { Component } from "react";
import $ from 'jquery'
import Moment from 'react-moment';
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBox, MDBContainer, MDBIcon, MDBBadge
} from "mdbreact";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            in_userId: 0,
            itemCart: 0,
            itemNotif: [],
            itemNotifCount: 0
        }
    }

    // Init get all cart count
    UNSAFE_componentWillMount() {
        this.setState({
            in_userId: this.getCookie("MTrack")
        })

        this.getCartCount()

        if ( this.getCookie("MRole") === "Administrator" ) {
            // Get user notification
            this.getNotif()
        }
    }
    
    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleNotifClick() {
        // Update dummy date in cookie // Remove notifcation count
        this.setCookie("MNotifDate", new Date().toUTCString(), 30)
        this.setState({
            itemNotifCount: 0
        })
    }

    handleLogout() {
        //Set authenticate to false
        var d = new Date();
        d.setTime(d.getTime() + (1*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "authenticate=false;" + expires + ";path=/";

        // Logout ajax
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-logout",
            dataType: "json",
            data: {
                userId: arguments[0]
            },
            cache: false
        })
        .then(
            setTimeout(
                function() {
                    window.location.href = "/login"
                } , 100
            )
        )
        .catch(
            (err) => {
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', err)
            }
        )
    }

     // Ajax function for get all carts
     getCartCount() {
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-get-cart-count",
            dataType: "json",
            data: {
                userId: this.getCookie("MTrack")
            },
            cache: false
        })
        .then(
            (result) => {
                this.setState({
                    itemCart: result
                })
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', error)
            }
        )
        .catch(
            (err) => {
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', err)
            }
        )
    }

    // Ajax for user notifcation
    getNotif() {
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-user-notif",
            dataType: "json",
            data: {
                userId: this.getCookie("MTrack"),
                date: this.getCookie("MNotifDate")
            },
            cache: false
        })
        .then(
            (result) => {
                if ( result.response !== "fail" ) {
                    this.setState({
                        itemNotif: result.response
                    })
                    
                    let counter = 0
                    result.response.map(item => (
                        item.new === 1 ? (
                            this.setState( prevState => ({
                                itemNotifCount: parseInt(counter+= 1) + parseInt(prevState.itemNotifCount)
                            }))
                        ) : null
                    ))
                }
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', error)
            }
        )
        .catch(
            (err) => {
                console.error('Oh well, you failed. Here some thoughts on the error that occured:', err)
            }
        )
    }

    // Set Cookie
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
        return (
            <MDBNavbar color="indigo" dark expand="md" fixed="top">
                <MDBContainer>
                    <MDBNavbarBrand>
                        <strong className="white-text">Navbar</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            {/* <MDBNavItem active>
                                <MDBNavLink to="dashboard">Dashboard</MDBNavLink>
                            </MDBNavItem> */}
                            <MDBNavItem active>
                                <a className="nav-link waves-effect waves-light" href="/dashboard">Dashboard</a>
                            </MDBNavItem>
                            <MDBNavItem>
                                <a className="nav-link waves-effect waves-light" href="/product">Product</a>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            {
                                this.getCookie("MRole") === "Administrator" ? (
                                    <MDBNavItem>
                                        <MDBDropdown>
                                            <MDBDropdownToggle nav caret onClick={this.handleNotifClick.bind(this)}>
                                                <MDBIcon icon="bell" />
                                                <MDBBadge color="" className="ml-2 white-text badge-info">{this.state.itemNotifCount}</MDBBadge>
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu className="dropdown-default notif-content">
                                                {
                                                    this.state.itemNotif.map(item => (
                                                        <MDBBox tag="div" className="d-block w-100 p-2" key={item.user_id}>
                                                            <MDBBox tag="div" className={
                                                                    item.new === 1 ? (
                                                                        "new d-block w-100 border border-dark p-1"
                                                                    ) : (
                                                                        "d-block w-100 border border-dark p-1"
                                                                    )
                                                                }
                                                            >
                                                                <MDBBox tag="span" className="d-block"><strong>{item.name}</strong> Update the profile.</MDBBox>
                                                                <MDBBox tag="span" className="d-block font-size-pt7rem"><Moment fromNow>{item.updated_at}</Moment></MDBBox>
                                                            </MDBBox>
                                                        </MDBBox>
                                                    ))
                                                }
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </MDBNavItem>
                                ) : null
                            }
                            <MDBNavItem>
                                <a className="nav-link waves-effect waves-light" href="/cart">
                                    <MDBIcon icon="shopping-cart" />
                                    <MDBBadge color="" className="ml-2 white-text badge-info">{this.state.itemCart}</MDBBadge>
                                </a>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBBox tag="span" className="nav-usr-name">{this.props.name}</MDBBox>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default">
                                        <MDBDropdownItem href="/edit-profile" className="px-4">Edit Profile</MDBDropdownItem>
                                        <MDBDropdownItem onClick={this.handleLogout.bind(this, this.state.in_userId)}>Logout</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        )
    }
}

export default Header;