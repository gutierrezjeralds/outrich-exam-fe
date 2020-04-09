import React from 'react'
import { 
    MDBContainer, MDBRow, MDBCol, MDBDataTable, MDBBox, MDBBtn,
    MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter
} from "mdbreact";

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalLocOpen: false,
            in_data: {
                columns: [
                    {
                        label: 'Name',
                        field: 'name',
                        sort: 'asc'
                    },
                    {
                        label: 'Email',
                        field: 'email',
                        sort: 'asc'
                    },
                    {
                        label: 'Active',
                        field: 'is_active',
                        sort: 'asc'
                    },
                    {
                        label: 'Role',
                        field: 'role',
                        sort: 'asc'
                    },
                    {
                        label: 'Location',
                        field: 'location',
                        sort: 'asc'
                    },
                    {
                        label: 'Created',
                        field: 'created_at',
                        sort: 'asc'
                    }
                ],
                rows: [
                    {
                        name: 'Tiger Nixon',
                        email: 'System Architect',
                        is_active: 'Edinburgh',
                        role: '61',
                        location: 'See more...',
                        created_at: '$320'
                    },
                    {
                        name: 'Tiger Nixon',
                        email: 'System Architect',
                        is_active: 'Edinburgh',
                        role: '61',
                        location: <MDBBox tag="span" onClick={this.modalLocToggle()}>See more...</MDBBox>,
                        created_at: '$320'
                    }
                ]
            }
        }
    }

    modalLocToggle = () => {
        this.setState({
            modalLocOpen: !this.state.modalLocOpen
        });
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

    render() {
        return (
            <React.Fragment>
                <MDBContainer className="py-5">
                    <MDBRow>
                        <MDBCol lg="12">
                            <MDBDataTable
                                striped
                                bordered
                                hover
                                noBottomColumns="true"
                                data={this.state.in_data}
                            />
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                {this.renderLocationModal()}
            </React.Fragment>
        )
    }
}

export default Dashboard