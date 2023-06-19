import React from 'react'
import { Route, Routes } from 'react-router-dom'
import '../../css/storage.css';
import NotFound from '../../NotFound';
import Header from './components/Header';
import Food from './Food';
import Table from './Table';


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