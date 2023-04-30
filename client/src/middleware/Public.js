import React from 'react'
import {Navigate} from 'react-router-dom'
import * as helper from './../api/helper'

const Public = ({children}) => {
    const user = helper.getCookie()
    if (user) {
        if(user.role === 1){
            return <Navigate to='/admin' replace></Navigate>
        }else if(user.role === 2) {
            return <Navigate to='/storage' replace></Navigate>
        }else if(user.role === 3) {
            return <Navigate to='/chef' replace></Navigate>
        }else if(user.role === 4) {
            return <Navigate to='/' replace></Navigate>
        }
    }
    return children
    
}

export default Public
