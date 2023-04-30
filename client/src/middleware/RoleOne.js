import React from 'react'
import {Navigate} from 'react-router-dom'
import * as helper from './../api/helper'

const RoleOne = ({children}) => {
    if (helper.getCookie() && helper.getCookie().role === 1) {
        return children
    }
    return <Navigate to='/login' replace></Navigate>
}

export default RoleOne
