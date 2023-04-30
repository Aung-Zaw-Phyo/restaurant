import React from 'react'
import {Navigate} from 'react-router-dom'
import * as helper from './../api/helper'

const Private = ({children}) => {
    if (!helper.getCookie()) {
        return <Navigate to='/login' replace></Navigate>
    }
    return children
}

export default Private
