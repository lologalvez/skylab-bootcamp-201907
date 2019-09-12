import React, { useContext } from 'react'
import Context from '../Context'
import logic from '../../logic'

function ActionButtons({ hand }) {

    return <>
        <button>Call</button>
        <button>Check</button>
        <button>Raise</button>
        <button>Fold</button>
    </>
}

export default ActionButtons
