import React from 'react'
import Snackbar from "../views/includes/Snackbar"
import $ from 'jquery'
import {
    MDBContainer, MDBRow, MDBCol, MDBBox, MDBIcon, MDBCard, MDBCardBody, MDBMedia
} from "mdbreact";

class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            isHideLoadingStr: false,
            isNotif: false,
            notifCat: "default",
            notifStr: "",
            items: [],
            in_total: 0,
        }
    }

    // Init get all checkout list
    UNSAFE_componentWillMount() {
        this.getCheckouts()
    }

    // Default img src
    thisDefaultSrc(event){
        event.target.src = "/assets/img/background/bg-item-1.png"
    }

    handleBuySubmit() {
        this.setState({
            isLoaded: false,
            isHideLoadingStr: false,
            isNotif: false,
            notifCat: "default",
        })

        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-product-buy",
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
                    isNotif: true
                })

                if ( result.response === 'success' ) {
                    this.setState({
                        notifCat: "success",
                        notifStr: "Buy product successfully!"
                    })

                    setTimeout(
                        function() {
                            window.location.href = "/product"
                        } , 100
                    )
                } else {
                    this.setState({
                        notifCat: "warning",
                        notifStr: "Something went wrong!",
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

    // Ajax fucntion for get all checkout
    getCheckouts() {
        $.ajax({
            url: "https://gutierrez-jerald-cv-be.herokuapp.com/api/exam-get-checkout",
            dataType: "json",
            data: {
                userId: this.getCookie("MTrack")
            },
            cache: false
        })
        .then(
            (result) => {
                this.setState({
                    isLoaded: true
                })
                
                if ( result.response === 'fail' || result.response === 'empty' ) {
                    // Do Nothing
                } else {
                    this.setState({
                        items: result
                    })
    
                    // Display Total
                    this.getTotalProducts(result)
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

    // Display total amount of products
    getTotalProducts(data) {
        if ( Object.keys(data).length !== 0 ) {
            data.map(items => (
                this.setState( prevState => ({
                    in_total: parseInt(items.product_price) + parseInt(prevState.in_total)
                }))
            ))
        }
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
                    {
                        Object.keys(this.state.items).length !== 0 ? (
                            <React.Fragment>
                                <MDBRow className="justify-content-between align-items-center">
                                    <MDBCol lg="2" className="mb-3">
                                        <MDBBox tag="span" className="font-size-1rem">
                                            <strong>Total:</strong> <MDBBox tag="span" className="d-inline-block total-checkout">{this.state.in_total}</MDBBox>
                                        </MDBBox>
                                    </MDBCol>
                                    <MDBCol lg="2" className="mb-3">
                                        <button className="btn btn-default btn-block waves-effect px-2" onClick={this.handleBuySubmit.bind(this)}>
                                            <MDBIcon icon="shopping-bag" className="mr-1" />
                                            Buy
                                        </button>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    {
                                        this.state.items.map(items => (
                                            <MDBCol lg="12" key={items.checkout_id}>
                                                <MDBCard>
                                                    <MDBCardBody>
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
                                    }
                                </MDBRow>
                            </React.Fragment>
                        ) : (
                            <MDBRow>
                                <MDBCol lg="12" className="text-center">
                                    <MDBBox tag="p" className="font-size-1pt5rem">No data found!</MDBBox>
                                </MDBCol>
                            </MDBRow>
                        )
                    }
                </MDBContainer>

            </React.Fragment>
        )
    }
}

export default Checkout