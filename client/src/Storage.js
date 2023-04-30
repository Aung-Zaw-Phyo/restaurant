import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './css/storage.css';
import NotFound from './NotFound';
import Header from './pages/storage/components/Header';
import Food from './pages/storage/Food';
import Table from './pages/storage/Table';


const Storage = () => {
  return (
    <div className='storage'>

      <Routes>
          <Route element={<Header/>}>
              <Route index element={<Food/>}/>
              <Route path="table" element={<Table/>}/>
          </Route>
          <Route path='*' element={<NotFound/>}/>
      </Routes>

    </div>  
  )
}

export default Storage