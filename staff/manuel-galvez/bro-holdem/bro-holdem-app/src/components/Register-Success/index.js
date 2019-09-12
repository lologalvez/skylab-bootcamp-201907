import React, { useContext } from 'react'
import Context from '../Context'
import { Link } from 'react-router-dom'


function RegisterSuccess() {

    const { submitRegister } = useContext(Context)

    return <>
        <section>
            <h3>
                <span>Thanks for joining </span>
                <span>Bro Holdem.</span>
                <span>Please, proceed to </span>
                <span><Link to="/login">Login</Link></span>
            </h3>
        </section>
    </>
}

export default RegisterSuccess
