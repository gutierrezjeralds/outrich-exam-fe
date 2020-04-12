import React from 'react'
import Snackbar from "../views/includes/Snackbar"
import $ from 'jquery'
import {
    MDBContainer, MDBRow, MDBCol, MDBBox, MDBInput, MDBIcon,
    MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,
    MDBModalBody
} from "mdbreact";
import Modal from 'react-bootstrap/Modal'

class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            isHideLoadingStr: false,
            in_submit: false,
            isNotif: false,
            notifCat: "default",
            notifStr: "",
            items: [],
            in_key: 0,
            in_name: "",
            in_price: "",
            in_thumbnail: "",
            modalAddEditShow: false,
            modalDeleteShow: false
        }
    }

    // Init get all product list
    UNSAFE_componentWillMount() {
        this.getProducts()
    }

    // Default img src
    thisDefaultSrc(event){
        event.target.src = "/assets/img/background/bg-item-1.png"
    }
    
    // Handle for show modal
    handleModalShow(modal, key, method) {
        if ( modal === "modalAddEditShow" ) {
            this.productInfo(modal, key, method)

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

    // Handle for input change
    handleInputChange(fid, event) {
        this.setState({
            [fid]: event.target.value
        })
    }

    // Handle for add edit and delete submit
    handleAddEditDelSubmit(event) {
        event.preventDefault();
        this.sendCommandProducts(this.state.in_method)
    }

    // Handle for add to cart button
    handleAddCartSubmit(id, event) {
        this.setCart(id)
    }

    // GLobal for reload page
    reloadPage = () => {
        setTimeout(
            function() {
                window.location.reload()
            } , 2000
        )
    }

    // Ajax function for get all products
    getProducts() {
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-get-product",
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

    // Ajax function for get product info by id and open modal
    productInfo(modal, key, method) {
        if ( method === "add" ) {
            this.setState({
                isLoaded: true,
                in_method: method,
                in_name: "",
                in_price: 0,
                in_thumbnail: "",
                in_addEditModalStr: "Add New Product",
                [modal]: true
            })
        }
    }

    sendCommandProducts = (method) => {
        const { in_key, in_name, in_price, in_thumbnail } = this.state

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
            price: in_price,
            thumbnail: in_thumbnail
        }

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-set-product",
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

    setCart = (productId) => {
        this.setState({
            isLoaded: false,
            isHideLoadingStr: false,
            isNotif: false,
            notifCat: "default",
        })

        const data = {
            userId: this.getCookie("MTrack"),
            productId: productId
        }

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-set-cart",
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
                    this.setState({
                        notifCat: "success",
                        notifStr: "Added successfully!"
                    })
                    //Reload page
                    this.reloadPage()

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
                        notifStr: "Product already added in Cart!",
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
                            <MDBInput onChange={this.handleInputChange.bind(this, "in_price")} icon="dollar-sign" label="Price" iconClass="grey-text" type="number" min="0" value={this.state.in_price} id="in_price" required />
                        </MDBBox>
                        <MDBBox tag="div" className="text-center">
                            {this.renderAddEditSubmitElement()}
                        </MDBBox>
                    </form>
                </MDBModalBody>
            </Modal>
        )
    }

    render() {
        document.title = "Products | Jerald Gutierrez"
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
                    <MDBRow className="justify-content-end">
                        {
                            this.getCookie("MRole") === "Administrator" ?
                                <MDBCol lg="2" className="mb-3">
                                    <button className="btn btn-primary btn-block waves-effect px-2" onClick={this.handleModalShow.bind(this, "modalAddEditShow", 0, "add")}>
                                        <MDBIcon icon="plus" className="mr-1" />
                                        Add Product
                                    </button>
                                </MDBCol>
                            : null
                        }
                    </MDBRow>
                    <MDBRow>
                        {
                            Object.keys(this.state.items).length !== 0 ? (
                                this.state.items.map(items => (
                                    <MDBCol lg="4" key={items.id}>
                                        <MDBCard>
                                            <img src="/assets/img/background/bg-item-1.png" alt="Product" className="img-fluid" onError={this.thisDefaultSrc} />
                                            {/* <MDBCardImage className="img-fluid" src="" waves /> */}
                                            <MDBCardBody>
                                                <MDBCardTitle>{items.name}</MDBCardTitle>
                                                <MDBCardText>Price: {items.price}</MDBCardText>
                                                <button type="button" className="btn btn-default" onClick={this.handleAddCartSubmit.bind(this, items.id)}>
                                                    <MDBIcon icon="plus" className="mr-2" />
                                                    Add to Cart
                                                </button>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                ))
                            ) : (
                                <MDBCol lg="12" className="text-center">
                                    <MDBBox tag="p" className="font-size-1pt5rem">No data found!</MDBBox>
                                </MDBCol>
                            )
                        }
                    </MDBRow>
                </MDBContainer>
                {this.renderAddEditModal()}
            </React.Fragment>
        )
    }
}

export default Product