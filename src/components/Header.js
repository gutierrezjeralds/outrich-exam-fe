import React, { Component } from "react";
import $ from 'jquery'
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBox, MDBContainer, MDBIcon, MDBBadge
} from "mdbreact";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            items: 0
        }
    }

    // Init get all cart count
    UNSAFE_componentWillMount() {
        this.getCartCount()
    }
    
    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
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
                userId: this.getCookie("MTrack")
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
                    items: result
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
                        <MDBNavItem>
                            <a className="nav-link waves-effect waves-light" href="/cart">
                                <MDBIcon icon="shopping-cart" />
                                <MDBBadge color="" className="ml-2 white-text badge-info">{this.state.items}</MDBBadge>
                            </a>
                        </MDBNavItem>
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBBox tag="span" className="nav-usr-name">{this.props.name}</MDBBox>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default">
                                        <MDBDropdownItem href="/edit-profile" className="px-4">Edit Profile</MDBDropdownItem>
                                        <MDBDropdownItem onClick={this.handleLogout.bind()}>Logout</MDBDropdownItem>
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