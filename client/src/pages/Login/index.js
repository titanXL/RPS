import React from 'react'
import LoginForm from '../../components/LoginForm'
import './style.css'

const Login = props => {
    return (
        <div className="container">
            <div className="container__login-form ui middle aligned center aligned">
                <LoginForm />
            </div>
        </div>
    )
}

export default Login