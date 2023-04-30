import React from 'react'
import {Navigate} from 'react-router-dom'
import * as helper from '../api/helper'

const RoleFour = ({children}) => {
    if (helper.getCookie() && helper.getCookie().role === 4) {
        return children
    }
    return <Navigate to='/login' replace></Navigate>
}

export default RoleFour
