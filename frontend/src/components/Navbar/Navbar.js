import React, { Component } from 'react'

import './Navbar.css'

export default class Navbar extends Component {
    render () {
        return (
            <div>
                <nav className="navbar navbar-light bg-dark navbar-fixed-top navbar-expand-lg rounded">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item"><a className="nav-link" href="/display">Show Orders</a></li>
                        <li className="nav-item"><a className="nav-link" href="/create">Create Order</a></li>
                    </ul>
                </nav>
            </div>
        )
    }
}
