import axios from 'axios'
import React from 'react'
import {config} from './../../../config'

const Employee_card = (props) => {
  const employee = props.info
  const setEmployee = props.changeEmployee
  const image = config.URL+employee.profile
  const setEmp = () => {
    setEmployee(employee)
  }
  return (
    <div className='col-lg-3'>
        <div onClick={setEmp} className='card border-0 employee-card' data-bs-toggle="modal" data-bs-target="#view_employee_modal">
          <div className='employee-card-profile text-center mb-3'>
              <img src={config.URL+employee.profile} alt=''/>
          </div>
          <div className='info text-center'>
              <p className='mb-0'>{employee.name}</p>
              <p className='mb-0'>{employee.phone}</p>
              <p className='mb-0'>{employee.role_name}</p>
          </div>
        </div>
    </div>
  )
}

export default Employee_card
