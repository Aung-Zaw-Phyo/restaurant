import axios from 'axios'
import React, { useState } from 'react'
import { config } from '../../../config'
import * as helper from './../../../api/helper'


const AddEmployee = (props) => {
    const setEmployees = props.setEmployees
    const employees = props.employees
    const [error, setError] = useState(false)
    const [password, setPassword] = useState('')

    const generatePassword = () => {
        var genePass = Math.random().toString(36).slice(-6).toUpperCase();
        setPassword('CE-'+genePass)
    }

    const onsubmitHandler = (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);
        let formObject = Object.fromEntries(data.entries())
        console.log(formObject.password)
        if(formObject.role === '' || formObject.name === '' || formObject.password === '' || 
        formObject.phone === '' || formObject.address === '' || formObject.profile.name === ''){
            setError(true)
            setTimeout(() => setError(false), 3000)
            return
        }
        const user = helper.getCookie()
        axios({
            method: 'post',
            url: `${config.URL}/employee/create`, 
            data: formObject,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${user.token}`
            }
        }).then(result => {
            const employeeFromServer = result.data.employee
            console.log(employeeFromServer)
            setEmployees([employeeFromServer, ...employees])
        }).catch(error => console.log(error.response.data.message))
    } 
    return (
        <div>
            <div className="modal fade" id="add_employee_modal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header d-flex justify-content-center">
                    <h5 className="modal-title text-center" id="exampleModalLabel">Create Employee</h5>
                </div>
                <div className="modal-body">
                    {error ? <div className='alert alert-danger text-center'>All fields are needed to fill!</div> : ''}
                    <form onSubmit={onsubmitHandler} enctype='multipart/form-data'>
                        <div>
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Employee Role</label>
                                <select className="form-select" name='role' id="role" aria-label="Default select example">
                                    <option value={4}>Waiter</option>
                                    <option value={3}>Chef</option>
                                    <option value={2}>Data Entry</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="profile" className="form-label">Profile</label>
                                <input type="file" name='profile'
                                    className="form-control" id="profile"  
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" name='name'
                                    className="form-control" id="name" placeholder="Enter name " 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input type="text" name='phone'
                                    className="form-control" id="phone" placeholder="Enter phone number " 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea className="form-control" id="address" rows={3} name='address' ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className='input-group'>
                                    <input type='text' value={password}
                                        className="form-control" id="password" 
                                        name='password' placeholder='Generate password' readonly
                                    />
                                    <span className='btn' onClick={generatePassword}>Generate</span>
                                </div>
                                {password !== '' ? <div className='text-danger mt-1'>Remember pass code.</div> : ''}
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-lg" type="submit">SAVE</button>
                            </div>
                        </div>

                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default AddEmployee
