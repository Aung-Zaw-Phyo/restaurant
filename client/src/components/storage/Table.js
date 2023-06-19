import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getCookie } from '../../api/helper';
import { config } from '../../config';

const Table = () => {
    const [tables, setTables] = useState(null)
    const [table, setTable] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        axios.get(`${config.URL}/table`, {
            headers: {
                'Authorization': `Bearer ${getCookie().token}`
            }
        }).then(result =>  {
            const tables = result.data.tables
            console.log(tables)
            setTables(tables)
        }).catch(error => {
            console.log(error.response)
        })
    }, []);

    const createFormSubmitHandler = (e) => {
        e.preventDefault()
        axios({
            method: 'post',
            url: `${config.URL}/table/create`, 
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${getCookie().token}`
            }
        }).then(result =>  {
            const table = result.data.table
            console.log(table)
            setTables([...tables, table])
            setMessage(result.data.message)
            setTimeout(() => setMessage(null), 3000)
        }).catch(error => {
            console.log(error.response)
        })
    }

    const deleteTable = (e) => {
        e.preventDefault()
        axios.delete(`${config.URL}/table/delete/${table._id}`, {
            headers: {
              'Authorization': `Bearer ${getCookie().token}`
            }
          }).then(result => {
            const tableFromServer = result.data.table
            const newResult = tables.filter(table => {
              return tableFromServer._id !== table._id
            })
            setTables(newResult)
            console.log(result.data.message)
          }).catch(error => console.log(error))
    }

    return (
        <div>
                <div className="container">

                    <div className='quick'>
                        <div className="bar">

                            <div className='quick-link quick-link-2'>
                            <div className="table m-auto"><i className="fa-solid fa-message"></i></div>
                            </div>
                            <div className='quick-link quick-link-3'>
                            <div className="checkout"  data-bs-target="#view_profile" data-bs-toggle="modal"><i className="fa-solid fa-address-card"></i></div>
                            </div>

                            <div className='bar-menu'>
                            <i className="fa-solid fa-house"></i>
                            </div>
                        </div>



                    </div>
                    {/* View Employee Modal */}
                    <div className="modal fade" id="view_profile" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header d-flex justify-content-center">
                                <h5 className="modal-title text-center" id="exampleModalLabel">Profile InFormation</h5>
                                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" /> */}
                            </div>
                            <div className="modal-body">

                                <div className="employee_information">
                                <div className="img text-center mb-3">
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ0PXAKWuSbrI4zS9-5Nx14XBPJaqOw3gcyA&usqp=CAU' alt=""/>
                                </div>
                                <div className="d-flex justify-content-between px-3">
                                    <p className="mb-0">Name</p><p className="mb-0">Rose</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Phone number</p><p className="mb-0">09985856558</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Role</p><p className="mb-0">Data Entry</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Employee ID</p><p className="mb-0">CED-127</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Address</p><p className="mb-0">Shwe Linban, Hlaing Tharyar in Yangon</p>
                                </div>
                                <hr/>

                                <div className="mt-3">
                                    <div className="card border-0 p-3" data-bs-toggle="modal" href="#profile_logout">
                                    <div className="d-flex justify-content-between">
                                        <div className="mb-0">Logout</div>
                                        <div className="mb-0"><i className="fa-solid fa-right-from-bracket"></i></div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="profile_logout" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                
                                <div className="modal-body text-center">
                                <div className="mb-3 ">
                                    <img className='comfirm_msg_icon' src="/images/warning_message.svg" alt=""/>
                                </div>
                                <h4>Are you sure you want to logout?</h4>
                                <div className="d-flex justify-content-center mt-3" >
                                    <button className="btn me-3" data-bs-target="#view_profile" data-bs-toggle="modal">Cancel</button>
                                    <button className="btn" data-bs-dismiss="modal" aria-label="Close">Logout</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>



                <div className=' mt-5'> 
                    <div className='row g-2 mb-4'>
                    <div className='col-md-3 d-flex align-items-end p-0'>
                        <button className="btn" data-bs-toggle="modal" data-bs-target="#add_table">Add Table</button>
                    </div>

                    {/* Add Food Modal */}
                    <div className="modal fade" id="add_table" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-center">
                            <h5 className="modal-title text-center" id="exampleModalLabel">Create Table</h5>
                            </div>
                            <div className="modal-body">
                                {message ? <div className='alert text-center alert-success'>{message}</div> : null}
                            <form onSubmit={createFormSubmitHandler}>
                                <div>
                                    
                                    <h5 className='text-center'>
                                    Create A New Table
                                    </h5>
                                    <div className="d-flex justify-content-end">
                                    <button className="btn btn-lg" type="submit">SAVE</button>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                        </div>
                    </div>


                    <div className='col-md-6 p-0'>
                        <h5 className='text-center'>Search The Table</h5>
                        <input type="text" className='form-control form-control-lg' placeholder='Enter the table name' />
                    </div>
                    <div className='col-md-3'></div>
                    </div> 

                    {
                        tables ? 
                            <div className="table-responsive mb-5">
                                    <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th scope="col">No</th>
                                            <th scope="col">Table Code</th>
                                            <th scope="col">Creator</th>
                                            <th scope="col">Created Time</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            tables.map((table, index) => (
                                                <tr key={index}>
                                                    <th scope="row" className='py-3'>{index + 1}</th>
                                                    <td>{table.code}</td>
                                                    <td>{table.employee_id ? table.employee_id.name : '-'}</td>
                                                    <td>3 days ago</td>
                                                    <td>
                                                        <i onClick={() => setTable(table)} 
                                                            data-bs-toggle="modal" data-bs-target="#delete_table"
                                                            className='fas fa-trash edit-food-icon shadow'
                                                        >
                                                        </i>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>
                            </div>
                        : <div className="text-danger text-center text-muted fs-3 my-5">........ loading ........</div>

                    }

                </div>
                <div className="modal fade" id="delete_table" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            
                            <div className="modal-body text-center">
                            <div className="mb-3 ">
                                <img className="comfirm_msg_icon" src="/images/warning_message.svg" alt=""/>
                            </div>
                            <h4>Are you sure you want to delete?</h4>
                            <div className="d-flex justify-content-center mt-3" >
                                <button className="btn me-3" data-bs-target="#view_employee_modal" data-bs-toggle="modal">Back</button>
                                <button className="btn" onClick={deleteTable}
                                data-bs-dismiss="modal" aria-label="Close">Delete</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Table
