import React from 'react'
import Snackbar from "../views/includes/Snackbar"
import Pagination from "../views/includes/Pagination"
import $ from 'jquery'
import { 
    MDBContainer, MDBRow, MDBCol, MDBBox, MDBInput,
    MDBTable, MDBTableBody, MDBTableHead,
    MDBModalBody, MDBModalFooter, MDBIcon
} from "mdbreact";
import Modal from 'react-bootstrap/Modal'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            isHideLoadingStr: false,
            error: false,
            items: [],
            locItems: [],
            in_method: "",
            in_key: 0,
            in_name: "",
            in_email: "",
            in_password: "",
            in_locDate: "",
            in_locEmail: "",
            in_mapSrc: "",
            in_addEditModalStr: "",
            pageOfItems: [],
            isNotif: false,
            notifCat: "default",
            notifStr: "",
            modalLocShow: false,
            modalAddEditShow: false,
            modalDeleteShow: false,
            in_submit: false
        }
    }

    // Init get all users data
    UNSAFE_componentWillMount() {
        this.getUsers()
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    // Handle for show modal
    handleModalShow(modal, key, emailOrMethod) {
        if ( modal === "modalLocShow" ) {
            this.getUserLoc(modal, key, emailOrMethod) //Email parameter

        } else if ( modal === "modalAddEditShow" || modal === "modalDeleteShow" ) {
            this.userInfo(modal, key, emailOrMethod) //Method parameter

        } else {
            // Do Nothing
        }
    }

    // Handle for hide modal
    handleModalClose(modal) {
        this.setState({
            [modal]: false
        })
    }

    // Handle for location select box change and update google map src
    handleLocChange(event) {
        const target = event.target[event.target.selectedIndex]

        this.setState({
            in_locDate: event.target.value,
            in_mapSrc: "https://maps.google.com/maps?q=" + target.getAttribute('data-latitude') + ", " + target.getAttribute('data-longitude') + "&hl=en&z=14&output=embed",
        })
    }

    // Handle for input change
    handleInputChange(fid, event) {
        this.setState({
            [fid]: event.target.value
        })
    }

    // Handle for add edit and delete submit
    handleAddEditDelSubmit(event) {
        event.preventDefault();
        this.sendCommandUsers(this.state.in_method)
    }

    // GLobal for reload page
    reloadPage = () => {
        setTimeout(
            function() {
                window.location.reload()
            } , 2000
        )
    }

    // Ajax function for get all users
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

    // Ajax function for get all user location by id
    getUserLoc(modal, key, email){
        this.setState({
            isLoaded: false,
            isNotif: false,
            notifCat: "default",
        })

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-login-loc",
            dataType: "json",
            data: {
                key: key
            },
            cache: false
        })
        .then(
            (result) => {
                if ( Object.keys(result).length !== 0 ) {
                    this.setState({
                        isLoaded: true,
                        locItems: result,
                        in_locDate: result[0].created_at,
                        in_locEmail: email,
                        in_mapSrc: "https://maps.google.com/maps?q=" + result[0].latitude + ", " + result[0].longitude + "&hl=en&z=14&output=embed",
                        [modal]: true
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        isNotif: true,
                        notifCat: "info",
                        notifStr: "No location found!"
                    })
                }
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

    // Ajax function for get user info by id and open modal
    userInfo(modal, key, method) {
        if ( method === "add" ) {
            this.setState({
                isLoaded: true,
                in_method: method,
                in_name: "",
                in_email: "",
                in_addEditModalStr: "Add New User",
                [modal]: true
            })

        } else if ( method === "edit" ) {
            this.setState({
                isLoaded: false,
                isNotif: false,
                notifCat: "default",
            })

            $.ajax({
                url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-user-info",
                dataType: "json",
                data: {
                    key: key
                },
                cache: false
            })
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        in_method: method,
                        in_key: key,
                        in_name: result[0].name,
                        in_email: result[0].email,
                        in_addEditModalStr: "Edit User",
                        [modal]: true
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
        } else if ( method === "delete" ) {
            this.setState({
                isLoaded: true,
                in_method: method,
                in_key: key,
                [modal]: true
            })
        } else {
            // Do Nothing
        }

    }

    // Ajax function for send command the add, edit and delete user
    sendCommandUsers = (method) => {
        const { in_key, in_name, in_email, in_password } = this.state
        
        this.setState({
            isLoaded: false,
            isHideLoadingStr: method === "delete" ? false : true,
            in_submit: true,
            isNotif: false,
            notifCat: "default",
        })

        if ( method === "delete" ) {
            // Hide modal
            this.setState({
                modalDeleteShow: false,
            })
        }

        const data = {
            method: method,
            key: in_key,
            name: in_name,
            email: in_email,
            pass: in_password
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
                    isHideLoadingStr: true,
                    isNotif: true
                })

                // Conditional alert message
                if ( result.response === true || result.response === "true" ) {
                    if ( this.state.in_method === "add" ) {
                        this.setState({
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
                            notifCat: "success",
                            notifStr: "Successfully deleted!"
                        })
                        //Reload page
                        this.reloadPage()

                    } else {
                        this.setState({
                            in_submit: false,
                            notifCat: "warning",
                            notifStr: "Something went wrong!",
                        })
                    }
                } else if ( result.response === false || result.response === "false" ) {
                    this.setState({
                        in_submit: false,
                        notifCat: "warning",
                        notifStr: "Something went wrong!",
                    })
                } else if ( result.response === "duplicate" ) {
                    this.setState({
                        in_submit: false,
                        notifCat: "warning",
                        notifStr: "Duplicate record!",
                    })
                } else {
                    this.setState({
                        in_submit: false,
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
                    isHideLoadingStr: false,
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

    // Render modal for Location
    renderLocationModal() {
        return (
            <Modal show={this.state.modalLocShow} onHide={this.handleModalClose.bind(this, "modalLocShow")}>
                <Modal.Header closeButton>
                    <Modal.Title>Location</Modal.Title>
                </Modal.Header>
                <MDBModalBody>
                    <MDBInput label="Email" value={this.state.in_locEmail} readOnly />
                    <MDBBox tag="div" className="select-mdb-custom">
                        <MDBBox tag="select" className="select-mdb-content mb-3" value={this.state.in_locDate} onChange={this.handleLocChange.bind(this)}>
                            {
                                this.state.locItems.map((item) => (
                                    <MDBBox tag="option" key={item.id} value={item.created_at} data-latitude={item.latitude} data-longitude={item.longitude}>
                                        {item.created_at}
                                    </MDBBox>
                                ))
                            }
                        </MDBBox>
                        <MDBBox tag="span" className="select-mdb-bar"></MDBBox>
                        <MDBBox tag="label" className="col select-mdb-label">Date</MDBBox>
                        <iframe
                            width="100%" height="320" frameBorder="0"
                            title="Map"
                            src={this.state.in_mapSrc}>
                            Loading...
                        </iframe>
                    </MDBBox>
                </MDBModalBody>
            </Modal>
        )
    }

    // Render modal button submit for Add and Edit
    renderAddEditSubmitElement(){
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

    // Render modal for Add and Edit
    renderAddEditModal() {
        return (
            <Modal show={this.state.modalAddEditShow} onHide={this.handleModalClose.bind(this, "modalAddEditShow")}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.in_addEditModalStr}</Modal.Title>
                </Modal.Header>
                <MDBModalBody>
                    <form onSubmit={this.handleAddEditDelSubmit.bind(this)}>
                        <MDBBox tag="div" className="md-form">
                            <MDBInput onChange={this.handleInputChange.bind(this, "in_name")} icon="user" label="Name" iconClass="grey-text" type="text" value={this.state.in_name} id="in_name" required />
                        </MDBBox>
                        <MDBBox tag="div" className="md-form">
                            <MDBInput onChange={this.handleInputChange.bind(this, "in_email")} icon="envelope" label="Email" iconClass="grey-text" type="email" value={this.state.in_email} id="in_email" required readOnly={this.state.in_method === "edit" ? ("readOnly") : (null)} />
                        </MDBBox>
                        {
                            this.state.in_method === "add" ? (
                                <MDBBox tag="div" className="md-form">
                                    <MDBInput onChange={this.handleInputChange.bind(this, "in_password")} icon="lock" label="Password" iconClass="grey-text" type="password" id="in_password" required />
                                </MDBBox>
                            ) : (null)
                        }
                        <MDBBox tag="div" className="text-center">
                            {this.renderAddEditSubmitElement()}
                        </MDBBox>
                    </form>
                </MDBModalBody>
            </Modal>
        )
    }

    // Render modal for Delete
    renderDeleteModal() {
        return (
            <Modal size="sm" show={this.state.modalDeleteShow} onHide={this.handleModalClose.bind(this, "modalDeleteShow")}>
                <Modal.Header className="danger-bg white-text text-center">
                    <Modal.Title className="w-100">Are you sure?</Modal.Title>
                </Modal.Header>
                <MDBModalBody className="text-center">
                    <MDBIcon icon="times" size="4x" className="animated rotateIn" />
                </MDBModalBody>
                <MDBModalFooter className="justify-content-center">
                    <button className="btn btn-outline-danger waves-effect" onClick={this.handleAddEditDelSubmit.bind(this)}>Yes</button>
                    <button className="btn btn-danger waves-effect" onClick={this.handleModalClose.bind(this, "modalDeleteShow")}>No</button>
                </MDBModalFooter>
            </Modal>
        )
    }

    // Render data of all users in table
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
                                    <MDBBox tag="span" className="cursor-pointer info-dark opacity-hover" onClick={this.handleModalShow.bind(this, "modalLocShow", item.id, item.email)}>See more...</MDBBox>
                                </td>
                                <td data-th="Created">{item.created_at}</td>
                                <td data-th="" className="text-center actions">
                                    {
                                        this.getCookie("MRole") === "Administrator" ? (
                                            <React.Fragment>
                                                <MDBIcon icon="edit" className="mr-1 cursor-pointer opacity-hover" onClick={this.handleModalShow.bind(this, "modalAddEditShow", item.id, "edit")} />
                                                <MDBIcon icon="trash" className="cursor-pointer opacity-hover" onClick={this.handleModalShow.bind(this, "modalDeleteShow", item.id, "delete")} />
                                            </React.Fragment>
                                        ) : (null)
                                    }
                                </td>
                            </tr>
                        ) : (null)
                    ) : (null)
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
                                {
                                    !this.state.isHideLoadingStr ? (
                                        <React.Fragment>
                                            <MDBBox tag="span" className="loader-spin-dual-ring"></MDBBox>
                                            <MDBBox tag="span" className="ml-2 font-size-1rem white-text">Loading, please wait...</MDBBox>
                                        </React.Fragment>
                                    ) : (null)
                                }
                            </MDBBox>
                            <MDBBox tag="div" className="loader-backdrop position-fixed z-index-1040 l-0 t-0 r-0 b-0 black"></MDBBox>
                        </MDBBox>
                    ) : (null)
                }

                {
                    this.state.isNotif ? (
                        <Snackbar category={this.state.notifCat} string={this.state.notifStr} />
                    ) : (null)
                }

                <MDBContainer className="py-5">
                    <MDBRow className="justify-content-between">
                        <MDBCol lg="2" className="mb-4">
                            <button className="btn btn-info btn-block waves-effect px-2" onClick={this.handleModalShow.bind(this, "modalLocShow", this.getCookie("MTrack"), this.getCookie("MEmail"))}>
                                <MDBIcon icon="map-marker-alt" className="mr-1" />
                                View My Location
                            </button>
                        </MDBCol>
                        {
                            this.getCookie("MRole") === "Administrator" ?
                                <MDBCol lg="2" className="mb-3">
                                    <button className="btn btn-primary btn-block waves-effect px-2" onClick={this.handleModalShow.bind(this, "modalAddEditShow", 0, "add")}>
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
                                ) : (null)
                            }
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                {this.renderLocationModal()}
                {this.renderAddEditModal()}
                {this.renderDeleteModal()}
            </React.Fragment>
        )
    }
}

export default Dashboard