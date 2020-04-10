import React from 'react'
import { MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow } from "mdbreact";

class Pagination extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initialPage: 1,
            itemSize: 20,
            paging: 5,
            pager: {}
        }
    }

    UNSAFE_componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.state.initialPage)
        }
    }

    setPage(page) {
        const items = this.props.items
        let pager = this.state.pager
        
        if (page < 1 || page > pager.totalPages) {
            return
        }

        // get new pager object for specified page
        pager = this.getPager(items.length, page)

        // get new page of items from items array
        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1)

        // update state
        this.setState({ pager: pager })

        // call change page function in parent component
        this.props.onChangePage(pageOfItems)
    }

    getPager(totalItems, currentPage) {
        const { itemSize, paging } = this.state

        // calculate total pages
        const totalPages = Math.ceil(totalItems / itemSize)

        let startPage, endPage
        if (totalPages <= paging) {
            // less than "paging" total pages so show all
            startPage = 1
            endPage = totalPages
        } else {
            // more than "paging" total pages so calculate start and end pages
            const pagingStart = paging - 1
            if (currentPage <= pagingStart) {
                startPage = 1
                endPage = paging
            } else if (currentPage + pagingStart >= totalPages) {
                startPage = totalPages - pagingStart
                endPage = totalPages;
            } else {
                startPage = currentPage
                endPage = currentPage + pagingStart
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * itemSize;
        const endIndex = Math.min(startIndex + itemSize - 1, totalItems - 1)

        // create an array of pages to repeat in the pager control
        const pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i)

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            itemSize: itemSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        }
    }

    render() {
        const pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            // return null
        }

        return (
            <React.Fragment>
                <MDBRow className="justify-content-end">
                    <MDBCol lg="4">
                        <MDBPagination className="mt-3 float-right">
                            <MDBPageItem className={pager.currentPage === 1 ? 'disabled cursor-not-allowed' : ''}>
                                <MDBPageNav aria-label="Previous" onClick={() => this.setPage(pager.currentPage - 1)}>
                                    <span aria-hidden="true">Previous</span>
                                </MDBPageNav>
                            </MDBPageItem>
                            {pager.pages.map((page, index) =>
                                <MDBPageItem key={index} className={pager.currentPage === page ? 'active' : ''}>
                                    <MDBPageNav onClick={() => this.setPage(page)}>
                                        {page}
                                    </MDBPageNav>
                                </MDBPageItem>
                            )}
                            <MDBPageItem className={pager.currentPage === pager.totalPages ? 'disabled cursor-not-allowed' : ''}>
                                <MDBPageNav aria-label="Next" onClick={() => this.setPage(pager.currentPage + 1)}>
                                    <span aria-hidden="true">Next</span>
                                </MDBPageNav>
                            </MDBPageItem>
                        </MDBPagination>
                    </MDBCol>
                </MDBRow>
            </React.Fragment>
        )
    }
}

export default Pagination