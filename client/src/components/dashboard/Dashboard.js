import React from 'react'
import { Route, Routes } from 'react-router-dom'
import '../../css/dashboard.css'
import Employee from './Employee'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

const Dashboard = () => {
  return (
    <div>

      <Header/>
      <div className=''>
          <div className="page-wrapper chiller-theme ">
            <Sidebar/>
            <main className="page-content">
              <Routes>
                <Route path='/' >
                  <Route index element={<Employee/>}/>
                </Route>
              </Routes>
            </main>
          </div>
      </div>


    </div>
  )
}

export default Dashboard