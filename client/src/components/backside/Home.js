import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { config } from '../../config'
import * as helper from './../../api/helper'
import io from 'socket.io-client'

import noti from '../../assets/noti.mp3'
let notisound = new Audio(noti)
let socket;



const Home = (props) => {
    const {takedOrders, setTakedOrders, orders, setOrders} = props 
    const ENDPT = 'http://localhost:5000';

    useEffect(() => {
        socket = io(ENDPT)
    }, [ENDPT])
    
    useEffect(() => {
        socket.on('send_created_order', data => {
            setOrders([...orders, data])
            notisound.play()
            console.log('send_created_order')
        })
        socket.on('send_update_order', (data) => { // get all active orders
            setOrders(data)
            notisound.play()
            console.log('send_update_order')
        })
        socket.on('send_done', (data) => { // get all active orders
            setOrders(data)
            notisound.play()
            console.log('send_done')
        })
    }, [ENDPT, orders])

    useEffect(() => {
        axios.get(`${config.URL}/order`, {
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(result => {
            console.log(result.data)
            setOrders(result.data.orders)
        }).catch(error => {
            console.log(error.response)
        })
        
    }, [])

    const takeTableOrder = (order_id) => {
        axios({
            method: 'post',
            url: `${config.URL}/order/take/${order_id}`, 
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(async(result) => {
            const data = result.data
            console.log(data)
            setOrders(data.orders)
            setTakedOrders([...takedOrders, data.takedOrder])
        }).catch(error => console.log('error__', error))
    }


    return (
        <div className='container py-5 chef'>


            <div className='row g-2'>
                {
                    orders ?
                    orders.map((order, index) => (
                        <div key={index} className='col-lg-4 p-2'>
                            <div className='card border-0 shadow-lg p-3  h-100'>
                                <div className='d-flex justify-content-center mb-3 fw-bold'>
                                    <div>{order.table_id.code}</div>
                                </div>
                                <table className='table table-bordered mb-3'>
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Add Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            order.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.add_quantity}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    
                                </table>

                                <div className='mb-2 fw-bold'>Message - </div>
                                <p>{order.message ? order.message : '-'}</p>
                                <div>
                                    {
                                        order.chef  ?
                                        <button className='btn w-100 selected-order-btn'
                                            onClick={() => takeTableOrder(order.id)} disabled
                                        >Pending</button> :
                                        <button className='btn w-100'
                                            onClick={() => takeTableOrder(order.id)}
                                        >Take This Table</button> 
                                    }
                                </div>
                            </div>
                        </div>
                    )) 
                    : <div className='alert alert-danger text-center'>There is no order.</div>
                }
            </div>
        </div>
    )
}

export default Home
