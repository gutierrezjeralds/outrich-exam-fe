import React from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBBox } from "mdbreact";

class NotFound extends React.Component {
    render() {
        document.title = "404 Not found | Jerald Gutierrez"
        return (
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="12" className="text-center">
                        <MDBBox tag="span" className="font-size-1pt5rem">Page Not Found!</MDBBox>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

export default NotFound