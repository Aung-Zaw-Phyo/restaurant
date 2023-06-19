import React, { useState } from 'react'
import axios from 'axios';
import {Navigate} from 'react-router-dom'
import * as api_login from './api/login'
import * as helper from './api/helper'
import { config } from './config';
import logo from './assets/logo.png'

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [user, setUser] = useState(null)
    const onsubmitHandler = (e) => {
        e.preventDefault()
        if(!phone || !password){
            setError(true)
            setTimeout(() => setError(false), 3000)
            return 
        }
        axios.post(`${config.URL}/employee/login`, {
            phone,
            password
        }).then((result) => {
            const userFromServer = result.data.user
            api_login.setCookie(userFromServer)
            setUser(userFromServer)
            setPhone('')
            setPassword('')
        }).catch((error) => {
            setErrorMsg(error.response.data.message)
            setError(true)
            setTimeout(() => setError(false), 3000)
        })

    }

    return (
        <div className='login'>
            {
                user ? <Navigate to={'/'} replace/> : null
            }
            <div className='container'>
                <div className='col-lg-6'>
                    <div className='text-center mb-3'>
                        <img className='' src={logo} alt="" />
                    </div>
                    <div className='card border-0 shadow-lg p-3 py-4'>
                        <div className='mb-3'>
                            <h3 className='text-center'>Fill the form to login! </h3>
                        </div>
                        <form onSubmit={onsubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input type="tel" value={phone}
                                    name='phone' className="form-control form-control-lg" 
                                    id="phone" placeholder='Enter your phone number'
                                    onChange={e => setPhone(e.target.value)}
                                />
                                { 
                                    error 
                                    ? <div className='text-danger mt-2'>{errorMsg ? errorMsg : 'Please fill the all fields.'}</div> 
                                    : null
                                }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" value={password}
                                    name='password' className="form-control form-control-lg" 
                                    id="password"  placeholder='Enter your password'
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-lg w-100">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
