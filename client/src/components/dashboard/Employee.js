import React, { useEffect, useState } from "react";
import EmployeeCard from "./components/EmployeeCard";
import axios from "axios";
import {config} from './../../config'
import * as helper from './../../api/helper'
import AddEmployee from "./components/AddEmployee";

const Employee = () => {
  const [employees, setEmployees] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [editEmployee, setEditEmployee] = useState({name: '', phone: '', addrss: ''})
  const [password, setPassword] = useState(null)
  const generatePassword = () => {
      var genePass = Math.random().toString(36).slice(-6).toUpperCase();
      setPassword('CE-'+genePass)
  }


  useEffect(() => {
    setEditEmployee({
      name: employee ? employee.name : '', 
      phone: employee ? employee.phone : '', 
      address: employee ? employee.address : ''
    })
  }, [employee])
  
  const user = helper.getCookie()
  useEffect(() => {
    axios.get(`${config.URL}/employee`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    }).then(result => {
        setEmployees(result.data.employees)
    }).catch(error => console.log(error))
  }, []);

  const deleteEmployee = () => {
    axios.delete(`${config.URL}/employee/delete/${employee._id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    }).then(result => {
      const employeeFromServer = result.data.employee
      const newResult = employees.filter(employee => {
        return employeeFromServer._id !== employee._id
      })
      setEmployees(newResult)
      // alert(result.data.message)
    }).catch(error => console.log(error))
  }

  const submitEditFormHandler = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget);
    let formObject = Object.fromEntries(data.entries())
    axios({
      method: 'put',
      url: `${config.URL}/employee/edit/${employee._id}`, 
      data: formObject,
      headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${user.token}`
      }
    }).then(async(result) => {
      const employeeFromServer = result.data.employee
      const resultEmployees = await employees.map(employee => {
        if(employee._id === employeeFromServer._id){
          return employeeFromServer
        }else {
          return employee
        }
      })
      setEmployees(resultEmployees)
    }).catch(error => console.log('error__', error))
  }


  return (
    <div>
      <div className="row g-2 mb-5">
        <div className="col-2 col-md-3 d-flex align-items-end p-0">
          <button className="btn" data-bs-toggle="modal" data-bs-target="#add_employee_modal">Add Employee</button>
          {/* Add Employee Modal */}
          <AddEmployee employees={employees} setEmployees={setEmployees}/>
        </div>

        <div className="col-md-6">
          <h5 className="text-center">Search The Employee</h5>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter the employee's name or ID"
            />
            
        </div>

        <div className="col-md-3 d-flex align-items-end p-0">
            <select className="form-select form-select-lg w-75 ms-auto" aria-label="Default select example">
              <option value="1">All</option>
              <option value="1">Admin</option>
              <option value="2">Data Entry</option>
              <option value="3">Chef</option>
              <option value="3">Waiter</option>
            </select>
        </div>
      </div>

      {
        employees ?
        <div className="row g-2">
          {
            employees.map((employee, index) => (
               <EmployeeCard key={index} 
                info={employee}
                changeEmployee={setEmployee}
              />
            ))
          }
        </div> :
        <div className="text-danger text-center text-muted fs-3 my-5">........ loading ........</div>
      }




      {/* View Employee Modal */}
      <div className="modal fade" id="view_employee_modal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-center">
                <h5 className="modal-title text-center" id="exampleModalLabel">Employee InFormation</h5>
              </div>
              <div className="modal-body">

                <div className="employee_information">
                  <div className="img text-center mb-3">
                    {
                      employee ? <img src={config.URL+employee.profile} alt=""/> : null
                    }
                  </div>
                  <div className="d-flex justify-content-between px-3">
                    <p className="mb-0">Name</p><p className="mb-0">{employee ? employee.name : null}</p>
                  </div>
                  <hr/>
                  <div className="d-flex justify-content-between mt-2 px-3">
                    <p className="mb-0">Phone number</p><p className="mb-0">{employee ? employee.phone : null}</p>
                  </div>
                  <hr/>
                  <div className="d-flex justify-content-between mt-2 px-3">
                    <p className="mb-0">Role</p><p className="mb-0">{employee ? employee.role_name : null}</p>
                  </div>
                  <hr/>
                  <div className="d-flex justify-content-between mt-2 px-3">
                    <p className="mb-0">Address</p><p className="mb-0">{employee ? employee.address : null}</p>
                  </div>
                  <hr/>

                  <div className="mt-3">
                    <div className="card border-0 p-3 mb-2"  data-bs-toggle="modal" href="#edit_employee">
                      <div className="d-flex justify-content-between">
                        <div className="mb-0">Edit Employee</div>
                        <div className="mb-0"><i className="fa-regular fa-pen-to-square"></i></div>
                      </div>
                    </div>
                    <div className="card border-0 p-3" data-bs-toggle="modal" href="#delete_employee">
                      <div className="d-flex justify-content-between">
                        <div className="mb-0">Delete Employee</div>
                        <div className="mb-0"><i className="fa-solid fa-trash"></i></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
      </div>

      <div className="modal fade" id="edit_employee" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
          <div className="modal-header d-flex justify-content-center">
                <h5 className="modal-title text-center" id="exampleModalLabel">Edit Employee</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={submitEditFormHandler}>
                  <div>
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">Employee Role</label>
                      <select className="form-select" name='role' id="role" aria-label="Default select example">
                        <option value={4} selected={employee ? (employee.role == 4 ? 'true' : '') : ''}>Waiter</option>
                        <option value={3} selected={employee ? (employee.role == 3 ? 'true' : '') : ''}>Chef</option>
                        <option value={2} selected={employee ? (employee.role == 2 ? 'true' : '') : ''}>Data Entry</option>
                        <option value={1} selected={employee ? (employee.role == 1 ? 'true' : '') : ''}>Admin</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="profile" className="form-label">Profile</label>
                      <input type="file" className="form-control" name='profile' id="profile"  />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" name="name" value={editEmployee.name}
                        onChange={e => {
                          setEditEmployee({name: e.target.value})
                        }}
                        className="form-control" id="name" placeholder="Enter name " 
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input type="text" value={editEmployee.phone}
                        onChange={e => {
                          setEditEmployee({phone: e.target.value})
                        }}
                        name='phone'
                        className="form-control" id="phone" placeholder="Enter phone number " 
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea value={editEmployee.address}
                        onChange={e => {
                          setEditEmployee({phone: e.target.address})
                        }} 
                        name='address'
                        className="form-control" id="address" 
                        rows={3} defaultValue={""} 
                      />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password (optional)</label>
                        <div className='input-group'>
                            <input type='text' value={password}
                                className="form-control" id="password" 
                                name='password' placeholder='Generate password' readonly
                            />
                            <span className='btn' onClick={generatePassword}>Generate</span>
                        </div>
                        {password ? <div className='text-danger mt-1'>Remember pass code.</div> : ''}
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="reset" className="btn btn-lg me-3" data-bs-target="#view_employee_modal" data-bs-toggle="modal">Back</button>
                        {/* <button className="btn btn-lg" id='close_edit_form_modal' data-bs-dismiss="modal" aria-label="Close" hidden>Update</button> */}
                        <button className="btn btn-lg">Update</button>
                    </div>
                    
                  </div>
                </form>
              </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="delete_employee" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            
            <div className="modal-body text-center">
              <div className="mb-3 ">
                <img className="comfirm_msg_icon" src="/images/warning_message.svg" alt=""/>
              </div>
              <h4>Are you sure you want to delete?</h4>
              <div className="d-flex justify-content-center mt-3" >
                <button className="btn me-3" data-bs-target="#view_employee_modal" data-bs-toggle="modal">Back</button>
                <button className="btn" onClick={deleteEmployee}
                  data-bs-dismiss="modal" aria-label="Close">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
};

export default Employee;
