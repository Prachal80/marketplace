import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import DisplayOrders from './Orders/Display/DisplayOrders'
import CreateOrder from './Orders/Create/CreateOrder'
import Navbar from './Navbar/Navbar'

export default class Routes extends Component {
    render () {
        return (
            <div>
                <Route path="/" component={ Navbar } />
                <Route path="/display" component={ DisplayOrders } />
                <Route path="/create" component={ CreateOrder } />
            </div>
        )
    }
}
