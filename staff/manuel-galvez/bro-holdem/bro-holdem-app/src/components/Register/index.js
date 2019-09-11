import React, { useContext } from 'react'
import logic from '../../logic'
import Context from '../Context'
import { Link, withRouter } from 'react-router-dom'


function Register({ history }) {

    const { setSubmitRegister } = useContext(Context)

    function handleSubmit(event) {
        event.preventDefault()
        const { target: {
            username: { value: username },
            email: { value: email },
            password: { value: password },
            repassword: { value: repassword }
        } } = event
        handleRegister(username, email, password, repassword)
    }

    async function handleRegister(username, email, password, repassword) {

        try {
            await logic.registerUser(username, email, password, repassword)
            setSubmitRegister(true)
            history.push('/register-success')
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username..." />
            <input type="text" name="email" placeholder="Email..." />
            <input type="password" name="password" placeholder="Password..." />
            <input type="password" name="repassword" placeholder="Repeat password..." />
            <button>Submit</button>
        </form>
        <Link to="/">Go back</Link>
    </>


}

export default withRouter(Register)