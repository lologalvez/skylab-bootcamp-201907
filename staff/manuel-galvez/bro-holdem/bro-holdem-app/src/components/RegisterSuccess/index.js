import React  from 'react'
import { Link } from 'react-router-dom'


function RegisterSuccess() {


    return <>
      <div className="landing">
            <div className="landing__split">
                <section className="card">
                    <div className="welcome">
                        <h2>Thanks for joining Bro Holdem. Please, proceed to <span><Link className="welcome__link" to="/login">Login</Link></span></h2>
                    </div>
                </section>
            </div>
            <div className="landing__split">
            </div>
        </div>
        <section>
            <h3>
                <span>Thanks for joining </span>
                <span>Bro Holdem.</span>
                <span>Please, proceed to </span>
            </h3>
        </section>
    </>
}

export default RegisterSuccess
