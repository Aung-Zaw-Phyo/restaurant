import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import { Component } from "react";  
import Swal from "sweetalert2";  

export const getCookie = () => {
    if(document.cookie && Cookies.get('user')){
        const user = JSON.parse(Cookies.get('user'))
        return user
    }else{
        return false
    }
}

export const getRole = (user) => {
    console.log(user)
}

export const logout = () => {
    let now = new Date();
    now.setTime(now.getTime() - 1 );
    document.cookie = `user=; expires=${now.toUTCString()}`
}

export const dateTime = (dateFromServevr) => {
    let date =  new Date(dateFromServevr)
    let format = date.getHours() + 'hr ' + date.getMinutes() + 'min ' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
    return format
}

export const warning = (message) => {
    Swal.fire({  
        title: message,  
        // text: message,  
        icon: 'warning',  
    });  
}

export const success = (message) => {
    Swal.fire({  
        title: message,  
        type: 'success',  
        icon: 'success',  
    });  
}