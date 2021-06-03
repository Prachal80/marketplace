import React, { Component } from 'react'
import axios from 'axios'

import './DisplayOrder.css'
import { BACKEND_URL } from '../../Config/BackendConfig'
import { BACKEND_PORT } from '../../Config/BackendConfig'
import Update_Logo from '../../../Images/edit.svg'
import Delete_Logo from '../../../Images/trash.svg'

export default class DisplayOrders extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            headings: [ "Region-region", "Country-country", "Item Type-unit", "Sales Channel-channel", "Order Priority-priority", "Order ID-id", "Order Date-order_date", "Ship Date-shipping_date", "Units Sold-units_sold", "Unit Price-price", "Unit Cost-unit_cost", "Total Revenue-revenue", "Total Cost-cost", "Total Profit-profit" ],
            decimalSet : new Set(["price", "unit_cost","revenue", "cost","profit"]),
            dateSet : new Set(["order_date", "shipping_date"]),
            sortOrder: "A",
            searchCriteria: "country",
            search: "",
            orders: [],
            displayedOrders: []
        }
    }

    componentDidMount () {
        axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/orders" )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    console.log(res.data)
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

    sortByField = ( sortBy ) => {
        console.log( sortBy )
        if(this.state.decimalSet.has(sortBy)){
            if ( this.state.sortOrder === "A" ) {
                this.setState( {
                    displayedOrders: this.state.orders.sort( ( a, b ) => {
                        return Number(a[ sortBy ]) > Number(b[ sortBy ]) ? 1 : -1
                    } ),
                    sortOrder: "D"
                } )
            } else if ( this.state.sortOrder === "D" ) {
                this.setState( {
                    displayedOrders: this.state.orders.sort( ( a, b ) => {
                        return Number(a[ sortBy ]) < Number(b[ sortBy ]) ? 1 : -1
                    } ),
                    sortOrder: "A"
                } )
            }

        }
        else if(this.state.dateSet.has(sortBy)){
            if ( this.state.sortOrder === "A" ) {
                this.setState( {
                    displayedOrders: this.state.orders.sort( ( a, b ) => {
                        var c = new Date(a[sortBy]);
                        var d = new Date(b[sortBy]);
                        return c-d;
                    } ),
                    sortOrder: "D"
                } )
            } else if ( this.state.sortOrder === "D" ) {
                this.setState( {
                    displayedOrders: this.state.orders.sort( ( a, b ) => {
                        var c = new Date(a[sortBy]);
                        var d = new Date(b[sortBy]);
                        return -1*(c-d);
                    } ),
                    sortOrder: "A"
                } )
            }
        }
        else{
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

    }

    updateDisplayedOrders = ( e ) => {
        if ( e.target.value ) {
            if(this.state.searchCriteria === "id"){
                this.setState( {
                    displayedOrders: this.state.orders.filter( ( order ) => JSON.stringify(order[this.state.searchCriteria]).startsWith( e.target.value) )
                } )
            }
            else{
                this.setState( {
                    displayedOrders: this.state.orders.filter( ( order ) => order[this.state.searchCriteria].toUpperCase().startsWith( e.target.value.toUpperCase() ) )
                } )

            }
        } 
        else {
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

    selectSearchCriteria = (e) => {
        this.setState({
          searchCriteria: e.target.value,
        });
      };

    render () {
        return (
            <div className="display-container">
                <h2 className="text-center">Order Details</h2>
                <select
                  id="inputState"
                  class="form-control"
                  onChange={this.selectSearchCriteria}
                >
                  <option value="country">Country</option>
                  <option value="unit">Item Type</option>
                  <option value="id">Order ID</option>
                  <option value="order_date">Order Date</option>
                  <option value="shipping_date">Ship Date</option>
                </select>
                <input type="text" class="form-control search-input" id="search" placeholder="Search by ... " onChange={ this.updateDisplayedOrders }></input>
                <table className="table table-striped table-bordered table-sm" cellSpacing="0">
                    <thead>
                        <tr>
                            <th className="heading-logo">Update</th>
                            <th className="heading-logo">Delete</th>
                            { this.state.headings.map( heading => {
                                return <th key={ Math.random() } className="heading" onClick={ () => this.sortByField( heading.split( "-" )[ 1 ] ) } >{ heading.split( "-" )[ 0 ] }</th>
                            } ) }
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.displayedOrders.map( order => {
                            return <tr key={ Math.random() }>
                                <td className="logo" onClick={ () => this.updateDetails( order ) }><img src={ Update_Logo } alt="refresh_logo" className="logo-image" /></td>
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
