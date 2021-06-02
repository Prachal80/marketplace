import React, { Component } from 'react'
import axios from 'axios'

import './CreateOrder.css'
import { BACKEND_URL } from '../../Config/BackendConfig'
import { BACKEND_PORT } from '../../Config/BackendConfig'

export default class CreateOrder extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            type: "",
            priority: "",
            channel: "",
            location: "",
            noOfUnits: "",
            shipDate: "",
            error: "",
            units: [],
            priorities: [],
            channels: [],
            locations: []
        }
    }

    componentDidMount () {
        let promises = []
        promises.push( axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/utility/units" )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    this.setState( {
                        units: res.data
                    } )
                }
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( err.response.message )
                }
            } ) )

        promises.push( axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/utility/priorities" )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    this.setState( {
                        priorities: res.data
                    } )
                }
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( err.response.message )
                }
            } ) )
        promises.push( axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/utility/channels" )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    this.setState( {
                        channels: res.data
                    } )
                }
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( err.response.message )
                }
            } ) )
        promises.push( axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/utility/locations" )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    this.setState( {
                        locations: res.data
                    } )
                }
            } )
            .catch( ( err ) => {
                if ( err.response ) {
                    console.log( err.response.message )
                }
            } ) )

        if ( this.props.location.orderDetails ) {
            Promise.all( promises )
                .then( () => {
                    let date = new Date( this.props.location.orderDetails.shipping_date )
                    let dateFormat = date.getFullYear() + "-" + ( ( date.getMonth() > 8 ) ? ( date.getMonth() + 1 ) : ( '0' + ( date.getMonth() + 1 ) ) ) + '-' + ( ( date.getDate() > 9 ) ? date.getDate() : ( '0' + date.getDate() ) )
                    this.setState( {
                        type: this.props.location.orderDetails.unit,
                        priority: this.state.priorities.filter( ( priority ) => priority.priority === this.props.location.orderDetails.priority )[ 0 ].priority,
                        channel: this.state.channels.filter( ( channel ) => channel.channel === this.props.location.orderDetails.channel )[ 0 ].channel,
                        location: this.props.location.orderDetails.country + " - " + this.props.location.orderDetails.region,
                        noOfUnits: this.props.location.orderDetails.units_sold,
                        shipDate: dateFormat,
                    } )
                } )
        }
    }

    onChange = ( item ) => {
        this.setState( {
            [ item.target.name ]: item.target.value
        } )
    }

    getPayload = () => {
        let priority = this.state.priorities.filter( ( priority ) => priority.priority === this.state.priority )[ 0 ].id
        let channel = this.state.channels.filter( ( channel ) => channel.channel === this.state.channel )[ 0 ].id
        let location = this.state.locations.filter( ( location ) => location.country === this.state.location.split( " - " )[ 0 ] )[ 0 ].id
        let shipDate = this.state.shipDate.split( "-" )[ 1 ] + "/" + this.state.shipDate.split( "-" )[ 2 ] + "/" + this.state.shipDate.split( "-" )[ 0 ]
        let payload = {
            priority,
            channel,
            location,
            shipDate,
            type: this.state.type,
            noOfUnits: parseInt( this.state.noOfUnits )
        }
        console.log( payload )
        return payload
    }

    createOrder = ( e ) => {
        e.preventDefault()

        if ( this.state.type && this.state.priority && this.state.channel && this.state.location && this.state.noOfUnits && this.state.shipDate ) {
            const orderData = this.getPayload()
            axios.defaults.withCredentials = true;
            axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/orders", orderData )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            error: ""
                        } )
                        window.location.assign( "/display" );
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.response )
                    }
                } )
        } else {
            this.setState( {
                error: "*Some required fields are empty"
            } )
        }
    }

    updateOrder = ( e ) => {
        e.preventDefault()

        if ( this.state.type && this.state.priority && this.state.channel && this.state.location && this.state.noOfUnits && this.state.shipDate ) {
            const updatedOrderData = this.getPayload()
            axios.defaults.withCredentials = true;
            axios.put( BACKEND_URL + ":" + BACKEND_PORT + "/orders?id=" + this.props.location.orderDetails.id, updatedOrderData )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            error: ""
                        } )
                        window.location.assign( "/display" );
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.response )
                    }
                } )
        } else {
            this.setState( {
                error: "*Some required fields are empty"
            } )
        }
    }

    render () {
        return (
            <div className="create-container">
                {
                    this.props.location.orderDetails ?
                        <h2 className="text-center">Update Order</h2> :
                        <h2 className="text-center">Create Order</h2>
                }

                <form className="createorder-form">
                    <div className="form-group row">
                        <label htmlFor="type" className="col-sm-2 col-form-label">Type*</label>
                        <div className="col-sm-10">
                            <select name="type" id="type" value={ this.state.type } onChange={ this.onChange }>
                                <option value="">--Select--</option>
                                { this.state.units.map( unit => {
                                    return <option key={ Math.random() } value={ unit.type }>{ unit.type }</option>
                                } ) }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="noOfUnits" className="col-sm-2 col-form-label">No of Units*</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" name="noOfUnits" id="noOfUnits" placeholder="No of units" onChange={ this.onChange } value={ this.state.noOfUnits } />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="shipDate" className="col-sm-2 col-form-label">Ship Date*</label>
                        <div className="col-sm-10">
                            <input type="date" className="form-control" name="shipDate" id="shipDate" placeholder="Ship Date" onChange={ this.onChange } value={ this.state.shipDate } />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="priority" className="col-sm-2 col-form-label">Priority*</label>
                        <div className="col-sm-10">
                            <select name="priority" id="priority" value={ this.state.priority } onChange={ this.onChange }>
                                <option value="">--Select--</option>
                                { this.state.priorities.map( priority => {
                                    return <option key={ priority.id } value={ priority.priority }>{ priority.priority }</option>
                                } ) }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="channel" className="col-sm-2 col-form-label">Channel*</label>
                        <div className="col-sm-10">
                            <select name="channel" id="channel" value={ this.state.channel } onChange={ this.onChange }>
                                <option value="">--Select--</option>
                                { this.state.channels.map( channel => {
                                    return <option key={ Math.random() } value={ channel.channel }>{ channel.channel }</option>
                                } ) }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="location" className="col-sm-2 col-form-label">Location*</label>
                        <div className="col-sm-10">
                            <select name="location" id="location" value={ this.state.location } onChange={ this.onChange }>
                                <option value="">--Select--</option>
                                { this.state.locations.map( location => {
                                    return <option key={ Math.random() } value={ location.country + " - " + location.region }>{ location.country + " - " + location.region }</option>
                                } ) }
                            </select>
                        </div>
                    </div>
                    {
                        this.props.location.orderDetails ?
                            <button type="submit" className="btn btn-primary" onClick={ this.updateOrder }>Update</button> :
                            <button type="submit" className="btn btn-primary" onClick={ this.createOrder }>Create</button>
                    }
                </form>
                <div className="error">
                    { this.state.error }
                </div>
            </div>
        )
    }
}
