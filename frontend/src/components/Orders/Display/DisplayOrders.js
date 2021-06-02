import React, { Component } from 'react'
import axios from 'axios'

import './DisplayOrder.css'
import { BACKEND_URL } from '../../Config/BackendConfig'
import { BACKEND_PORT } from '../../Config/BackendConfig'
import Refresh_Logo from '../../../Images/refresh.svg'
import Delete_Logo from '../../../Images/trash.svg'

export default class DisplayOrders extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            headings: [ "Region-region", "Country-country", "Item Type-unit", "Sales Channel-channel", "Order Priority-priority", "Order ID-id", "Order Date-order_date", "Ship Date-shipping_date", "Units Sold-units_sold", "Unit Price-price", "Unit Cost-unit_cost", "Total Revenue-revenue", "Total Cost-cost", "Total Profit-profit" ],
            sortOrder: "A",
            search: "",
            orders: [],
            displayedOrders: []
        }
    }

    componentDidMount () {
        axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/orders" )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    this.setState( {
                        orders: res.data,
                        displayedOrders: res.data
                    } )
                }
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( err.response.message )
                }
            } )
    }

    sort = ( sortBy ) => {
        console.log( sortBy )
        if ( this.state.sortOrder === "A" ) {
            this.setState( {
                displayedOrders: this.state.orders.sort( ( a, b ) => {
                    return a[ sortBy ] > b[ sortBy ] ? 1 : -1
                } ),
                sortOrder: "D"
            } )
        } else if ( this.state.sortOrder === "D" ) {
            this.setState( {
                displayedOrders: this.state.orders.sort( ( a, b ) => {
                    return a[ sortBy ] < b[ sortBy ] ? 1 : -1
                } ),
                sortOrder: "A"
            } )
        }
    }

    updateDisplayedOrders = ( e ) => {
        if ( e.target.value ) {
            this.setState( {
                displayedOrders: this.state.orders.filter( ( order ) => order.country.toUpperCase().startsWith( e.target.value.toUpperCase() ) )
            } )
        } else {
            this.setState( {
                displayedOrders: this.state.orders
            } )
        }
    }

    updateDetails = ( data ) => {
        this.props.history.push( {
            pathname: '/create',
            orderDetails: data // your data array of objects
        } )
    }

    deleteDetails = ( data ) => {

        axios.defaults.withCredentials = true;
        axios.delete( BACKEND_URL + ":" + BACKEND_PORT + "/orders?id=" + data.id )
            .then( ( res ) => {
                if ( res.status === 204 ) {
                    alert( "Order Deleted" )
                    window.location.reload()
                }
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( err.response )
                }
            } )
    }

    render () {
        return (
            <div className="display-container">
                <h2 className="text-center">Order Details</h2>
                <input type="text" class="form-control search-input" id="search" placeholder="Search by country..." onChange={ this.updateDisplayedOrders }></input>
                <table className="table table-striped table-bordered table-sm" cellSpacing="0">
                    <thead>
                        <tr>
                            <th className="heading-logo">Update</th>
                            <th className="heading-logo">Delete</th>
                            { this.state.headings.map( heading => {
                                return <th key={ Math.random() } className="heading" onClick={ () => this.sort( heading.split( "-" )[ 1 ] ) }>{ heading.split( "-" )[ 0 ] }</th>
                            } ) }
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.displayedOrders.map( order => {
                            return <tr key={ Math.random() }>
                                <td className="logo" onClick={ () => this.updateDetails( order ) }><img src={ Refresh_Logo } alt="refresh_logo" className="logo-image" /></td>
                                <td className="logo" onClick={ () => this.deleteDetails( order ) }><img src={ Delete_Logo } alt="refresh_logo" className="logo-image" /></td>
                                <td>{ order.region }</td>
                                <td>{ order.country }</td>
                                <td>{ order.unit }</td>
                                <td>{ order.channel }</td>
                                <td>{ order.priority }</td>
                                <td>{ order.id }</td>
                                <td>{ order.order_date }</td>
                                <td>{ order.shipping_date }</td>
                                <td>{ order.units_sold }</td>
                                <td>{ order.price }</td>
                                <td>{ order.unit_cost }</td>
                                <td>{ order.revenue }</td>
                                <td>{ order.cost }</td>
                                <td>{ order.profit }</td>
                            </tr>
                        } ) }

                    </tbody>
                </table>
            </div>
        )
    }
}
