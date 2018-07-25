import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom' // 2 - Swtich pra decidir quem aparece

import Home from './pages/Home';
import Login from './pages/Login';


class PrivateRoute extends Component {
    render() {
        const NossoComponente = this.props.component
        if(localStorage.getItem('TOKEN')) {
            return <Route path={this.props.path} component={NossoComponente} />
        } else {
            return <Redirect to="/login" />
        }
    }
}

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                <PrivateRoute path="/" exact component={Home} />
                <Route path="/login/" component={Login} />
                <Route component={ () => <div>Página 404</div> } />
            </Switch>
        )
    }
}