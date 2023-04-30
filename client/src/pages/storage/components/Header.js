import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <div className='shadow'>
        <div className="container d-flex justify-content-between align-items-center">
            <div>

            </div>
            <div>
              <img className="logo" src="./../logo.svg" alt="logo" />
            </div>
            <div>
              <Link to={'/storage'} className='me-4'>Food</Link>
              <Link to={'/storage/table'}>Table</Link>
            </div>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}

export default Header