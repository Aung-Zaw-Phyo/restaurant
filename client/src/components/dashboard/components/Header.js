import React from 'react'
import { Outlet } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <div className='shadow'>
        <div className="container d-flex justify-content-between align-items-center">
            <div>

            </div>
            <div>
              <img className="logo" src="./logo.svg" alt="logo" />
            </div>
            <div>

            </div>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}

export default Header