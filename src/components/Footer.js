import React from 'react'
import { MDBContainer, MDBFooter, MDBBox } from "mdbreact";

class Footer extends React.Component {
    render() {
        return (
            <MDBFooter color="" className="font-small fixed-bottom">
                <MDBBox className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright: Jerald Seña Gutierrez ® All Rights Reserved.
                    </MDBContainer>
                </MDBBox>
            </MDBFooter>
        )
    }
}

export default Footer