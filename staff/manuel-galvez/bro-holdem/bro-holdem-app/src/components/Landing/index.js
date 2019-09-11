import React from 'react'
import { Link } from 'react-router-dom'

function Landing() {

    return <>
        <section>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </section>
    </>
}

export default Landing
