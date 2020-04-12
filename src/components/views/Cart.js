import React from 'react'
import Snackbar from "../views/includes/Snackbar"
import $ from 'jquery'
import {
    MDBContainer, MDBRow, MDBCol, MDBBox, MDBIcon, MDBCard, MDBCardBody, MDBMedia
} from "mdbreact";

class Cart extends React.Component {
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
            in_total: 0,
            dataCheckout: []
        }
    }

    // Init get all cart list
    UNSAFE_componentWillMount() {
        this.getCarts()
    }

    // Default img src
    thisDefaultSrc(event){
        event.target.src = "/assets/img/background/bg-item-1.png"
    }

    // Handle change for checkbox
    handleCheckChange(event) {
        const productId = event.target.getAttribute('dataproductid')
        const productPrice = event.target.getAttribute('dataproductprice')
        const cartId = event.target.getAttribute('datacartid')

        if ( event.target.checked ) {
            this.setState( prevState => ({
                in_total: parseInt(productPrice) + parseInt(prevState.in_total)
            }))

            // Add Json data for checkout
            this.setState({
                dataCheckout: [...this.state.dataCheckout, {
                    id: Date.now(),
                    user_id: this.getCookie("MTrack"),
                    product_id: productId,
                    cart_id: cartId
                }]
            })
        } else {
            this.setState( prevState => ({
                in_total: parseInt(prevState.in_total) - parseInt(productPrice)
            }))

            // Delete Json data for checkout
            this.setState({
                dataCheckout: this.state.dataCheckout.filter(item => {
                    if ( item.product_id !== productId ) {
                        return item
                    }

                    return false
                })
            })
        }
    }

    handleCheckoutSubmit() {
        this.setState({
            isLoaded: false,
            isHideLoadingStr: false,
            in_submit: true,
            isNotif: false,
            notifCat: "default",
        })

        if ( Object.keys(this.state.dataCheckout).length !== 0 ) {
            // This will be send Json (dataCheckout) into api to save it in checkout db

        } else {
            this.setState({
                isLoaded: true,
                isHideLoadingStr: false,
                in_submit: false,
                isNotif: true,
                notifCat: "warning",
                notifStr: "Please add item to Checkout!",
            })
        }
    }

    // Ajax getCarts for get all cart
    getCarts() {
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-get-cart",
            dataType: "json",
            data: {
                userId: this.getCookie("MTrack")
            },
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
        document.title = "Carts | Jerald Gutierrez"
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
                    <MDBRow className="justify-content-between align-items-center">
                        <MDBCol lg="2" className="mb-3">
                            <MDBBox tag="span" className="font-size-1rem">
                                <strong>Total:</strong> <MDBBox tag="span" className="d-inline-block total-checkout">{this.state.in_total}</MDBBox>
                            </MDBBox>
                        </MDBCol>
                        <MDBCol lg="2" className="mb-3">
                            <button className="btn btn-default btn-block waves-effect px-2" onClick={this.handleCheckoutSubmit.bind(this)}>
                                <MDBIcon icon="shopping-bag" className="mr-1" />
                                Checkout
                            </button>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        {
                            Object.keys(this.state.items).length !== 0 ? (
                                this.state.items.map(items => (
                                    <MDBCol lg="12" key={items.cart_id}>
                                        <MDBCard>
                                            <MDBCardBody>
                                                {/* <MDBInput containerClass="md-form mt-0 checkbox-mdb-custom transparent-label" label="Checkout" type="checkbox" id="isCheckout-checkbox" dataproductid={items.product_id} onChange={this.handleCheckChange.bind(this)} /> */}
                                                <MDBBox className="form-check md-form mt-0 checkbox-mdb-custom transparent-label">
                                                    <input type="checkbox" className="form-control" id="isCheckout-checkbox" value="" 
                                                        dataproductid={items.product_id}
                                                        dataproductprice={items.product_price}
                                                        datacartid={items.cart_id}
                                                        onChange={this.handleCheckChange.bind(this)} />
                                                    <label className="form-check-label" htmlFor="isCheckout-checkbox">
                                                        Checkout
                                                    </label>
                                                </MDBBox>
                                                <MDBMedia>
                                                    <MDBMedia left className="mr-3">
                                                        <MDBMedia object src="/assets/img/background/bg-item-1.png" alt="Product" width="80" onError={this.thisDefaultSrc} />
                                                    </MDBMedia>
                                                    <MDBMedia body>
                                                        <MDBMedia heading>{items.product_name}</MDBMedia>
                                                        Price: {items.product_price}
                                                    </MDBMedia>
                                                </MDBMedia>
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

            </React.Fragment>
        )
    }
}

export default Cart