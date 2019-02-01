import React, { Component } from 'react'

class LoginForm extends Component {
    render() {
        return (
            <div className="column text-align-center">
                <h2 className="ui teal image header">
                <div className="content">
                    Log-in to your account
                </div>
                </h2>
                <form className="ui large form  error">
                <div className="ui stacked segment">
                    <div className="field error">
                    <div className="ui left icon input">
                        <i className="user icon"></i>
                        <input type="text" name="email" placeholder="E-mail address" />
                    </div>
                    </div>
                    <div className="field">
                    <div className="ui left icon input">
                        <i className="lock icon"></i>
                        <input type="password" name="password" placeholder="Password" />
                    </div>
                    </div>
                    <div className="ui fluid large teal submit button">Login</div>
                </div>
                <div className="ui error message">
                        <ul className="list">
                            <li>Please enter your e-mail</li>
                            <li>Please enter a valid e-mail</li>
                            <li>Please enter your password</li>
                            <li>Your password must be at least 6 characters</li>
                        </ul>
                    </div>
                </form>
            </div>
        )
    }
}

export default LoginForm