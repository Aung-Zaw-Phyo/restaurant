import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import '../../css/backside.css'
import NotFound from '../../NotFound'
import Header from './components/Header'
import Home from './Home'

const Backside = () => {
    const [takedOrders, setTakedOrders] = useState([]) // taken orders
    const [orders, setOrders] = useState(null) // all active orders
    return (
        <div className='backside'>
            <Routes>
                <Route path="/" 
                    element={<Header 
                        takedOrders={takedOrders} 
                        setTakedOrders={setTakedOrders} 
                        orders={orders}
                        setOrders={setOrders}
                    />}>
                    <Route index element={<Home 
                        takedOrders={takedOrders} 
                        setTakedOrders={setTakedOrders} 
                        orders={orders}
                        setOrders={setOrders}
                    />}/>
                </Route>
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        </div>
    )
}

export default Backside
