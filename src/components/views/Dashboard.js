import React from 'react'
import Snackbar from "../views/includes/Snackbar"
import Pagination from "../views/includes/Pagination"
import $ from 'jquery'
import { 
    MDBContainer, MDBRow, MDBCol, MDBBox, MDBBtn,
    MDBTable, MDBTableBody, MDBTableHead,
    MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon
} from "mdbreact";

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            error: false,
            items: [],
            in_method: "",
            in_key: 0,
            in_name: "",
            in_email: "",
            in_role: "",
            pageOfItems: [],
            isNotif: false,
            notifCat: "default",
            notifStr: "",
            modalLocOpen: false
        }
    }

    UNSAFE_componentWillMount() {
        this.getUsers()
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    modalLocToggle = () => {
        this.setState({
            modalLocOpen: !this.state.modalLocOpen
        });
    }

    reloadPage = () => {
        setTimeout(
            function() {
                window.location.reload()
            } , 2000
        )
    }

    getUsers(){
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-users",
            dataType: "json",
            cache: false
        })
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    items: result
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

    sendCommandUsers = (method) => {
        const { in_key, in_name, in_email, in_role } = this.state
        
        this.setState({
            isLoaded: false,
            isNotif: false,
            notifCat: "default",
        })

        const data = {
            method: method,
            key: in_key,
            name: in_name,
            email: in_email,
            role: in_role,
        }

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-command-users",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            cache: false
        }).then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    isNotif: true
                })

                // Conditional alert message
                if ( result.response ) {
                    if ( this.state.in_method === "add" ) {
                        this.setState({
                            isLoaded: false,
                            notifCat: "success",
                            notifStr: "Added successfully!"
                        })
                        //Reload page
                        this.reloadPage()

                    } else if ( this.state.in_method === "edit" ) {
                        this.setState({
                            prev_title: this.state.title,
                            notifCat: "success",
                            notifStr: "Successfully update!"
                        })
                        //Reload page
                        this.reloadPage()

                    } else if ( this.state.in_method === "delete" ) {
                        this.setState({
                            isLoaded: false,
                            notifCat: "success",
                            notifStr: "Successfully deleted!"
                        })
                        //Reload page
                        this.reloadPage()

                    } else {
                        this.setState({
                            notifCat: "warning",
                            notifStr: "Something went wrong!",
                        })
                    }
                } else if ( !result.response ) {
                    this.setState({
                        notifCat: "warning",
                        notifStr: "Something went wrong!",
                    })
                } else if ( result.response === "duplicate" ) {
                    this.setState({
                        notifCat: "warning",
                        notifStr: "Duplicate record!",
                    })
                } else {
                    this.setState({
                        notifCat: "error",
                        notifStr: "Unexpected error, please reload the page!",
                        error: true
                    })
                }
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                // Handle errors here
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
                // Handle errors here
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

    renderLocationModal() {
        return (
            <MDBModal isOpen={this.state.modalLocOpen} toggle={this.modalLocToggle}>
                <MDBModalHeader toggle={this.modalLocToggle}>MDBModal title</MDBModalHeader>
                <MDBModalBody>
                    Here...
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.modalLocToggle}>Close</MDBBtn>
                    <MDBBtn color="primary">Save changes</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        )
    }

    renderData(data) {
        if ( Object.keys(this.state.items).length !== 0 ) {
            return (
                data.map(item => (
                    item.id.toString() !== this.getCookie("MTrack") ? (
                        item.role !== "Administrator" ? (
                            // Render all users
                            <tr key={item.id}>
                                <td data-th="Name">{item.name}</td>
                                <td data-th="Email">{item.email}</td>
                                <td data-th="Active">{item.is_active}</td>
                                <td data-th="Location">
                                    <MDBBox tag="span">See more...</MDBBox>
                                </td>
                                <td data-th="Created">{item.created_at}</td>
                                <td data-th="" className="text-center actions">
                                    {
                                        this.getCookie("MRole") === "Administrator" ? (
                                            <React.Fragment>
                                                <MDBIcon icon="edit" className="mr-1 cursor-pointer" />
                                                <MDBIcon icon="trash" className="cursor-pointer" />
                                            </React.Fragment>
                                        ) : ("")
                                    }
                                </td>
                            </tr>
                        ) : ("")
                    ) : ("")
                ))
            )
        } else {
            return (
                <tr>
                    <td data-th="" colSpan="7" className="text-center no-data">No data available!</td>
                </tr>
            )
        }
    }

    render() {
        document.title = "Dashboard | Jerald Gutierrez"
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

                <MDBContainer className="py-5">
                    <MDBRow className="justify-content-end">
                        {
                            this.getCookie("MRole") === "Administrator" ?
                                <MDBCol lg="2" className="mb-3">
                                    <button className="btn btn-info btn-block waves-effect px-2">
                                        <MDBIcon icon="plus" className="mr-1" />
                                        Add User
                                    </button>
                                </MDBCol>
                            : ""
                        }

                        <MDBCol lg="12">
                            <MDBTable striped bordered hover responsive className="users-table table-responsive-cs">
                                <MDBTableHead color="primary-color" textWhite>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Active</th>
                                        <th>Location</th>
                                        <th>Created</th>
                                        <th></th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {this.renderData(this.state.pageOfItems)}
                                </MDBTableBody>
                            </MDBTable>

                            {
                                Object.keys(this.state.items).length !== 0 ? (
                                    <Pagination items={this.state.items} onChangePage={this.onChangePage.bind(this)} />
                                ) : ("")
                            }
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                {this.renderLocationModal()}
            </React.Fragment>
        )
    }
}

export default Dashboard