import React, { useContext } from 'react'
import logic from '../../logic'
import Context from '../Context'
import { Link, withRouter } from 'react-router-dom'

function Login({ history }) {

    const { setSubmitRegister, setCredentials, setSubmitTable } = useContext(Context)

    setSubmitRegister(null)

    function handleSubmit(event) {
        event.preventDefault()
        const { target: { email: { value: email }, password: { value: password } } } = event
        handleLogin(email, password)
    }

    async function handleLogin(email, password) {
        try {
            await logic.authenticateUser(email, password)
            setCredentials(true)
            history.push('/home')
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email..." />
            <input type="password" name="password" placeholder="Password..." />
            <button>Submit</button>
        </form>
        <Link to="/">Go back</Link>
    </>
}

export default withRouter(Login)