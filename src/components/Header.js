import React, { Component } from "react";
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBox, MDBContainer
} from "mdbreact";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
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

        setTimeout(
            function() {
                window.location.href = "/login"
            } , 100
        )
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
                            <li className="nav-item active">
                                <a className="nav-link waves-effect waves-light" href="/dashboard">Dashboard</a>
                            </li>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
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