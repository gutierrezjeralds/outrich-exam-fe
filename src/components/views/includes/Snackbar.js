import React from 'react'
import { MDBBox, MDBAnimation, MDBMedia, MDBIcon } from 'mdbreact'

class Snackbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: ""
        }
    }

    UNSAFE_componentWillMount() {
        this.runCommand()
    }

    runCommand() {
        this.setState({
            isShow: "fadeIn"
        })

        setTimeout(
            function() {
                this.setState({
                    isShow: "fadeOut"
                })
            }.bind(this) , 3000
        )
    }

    renderIcon() {
        if ( this.props.category === "info" ) {
            return (
                <MDBIcon icon="info-circle" className="fa-2x" />
            )

        } else if ( this.props.category === "success" ) {
            return (
                <MDBIcon icon="check" className="fa-2x" />
            )

        }  else if ( this.props.category === "error" ) {
            return (
                <MDBIcon icon="exclamation-triangle" className="fa-2x" />
            )

        }  else if ( this.props.category === "warning" ) {
            return (
                <MDBIcon icon="exclamation" className="fa-2x" />
            )
        }
    }

    render () {
        return (
            <React.Fragment>
                <MDBAnimation type={this.state.isShow} className="z-index-9999 position-relative">
                    <MDBBox tag="div" className={this.props.category + " snackbar-content position-fixed z-index-9999 white-text rounded p-3 w-300px"}>
                        <MDBMedia>
                            <MDBMedia left middle className="mr-2 pb-0">
                                {this.renderIcon()}
                            </MDBMedia>
                            <MDBMedia body>
                                <MDBBox tag="span">{this.props.string}</MDBBox>
                            </MDBMedia>
                        </MDBMedia>
                    </MDBBox>
                </MDBAnimation>
            </React.Fragment>
        )
    }
}

export default Snackbar