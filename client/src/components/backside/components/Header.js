import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import * as helper from './../../../api/helper'
import axios from 'axios'
import { config } from '../../../config'
import io from 'socket.io-client'

import noti from '../../../assets/noti.mp3'
let notisound = new Audio(noti)
let socket;


const Header = (props) => {
  const {takedOrders, setTakedOrders, orders, setOrders} = props
  const [showOrderInfo, setShowOrderInfo] = useState(null)
  const ENDPT = 'http://localhost:5000';

    useEffect(() => {
        socket = io(ENDPT)
    }, [ENDPT])

    useEffect(() => {
        socket.on('send_update_order', (data) => { // get all active orders
            const orders = data
            const takedOrds = orders.filter(order => order.chef && order.chef._id == helper.getCookie()._id)
            setTakedOrders(takedOrds)
            if(showOrderInfo) {
                const show = takedOrds.find(order => order._id == showOrderInfo._id)
                setShowOrderInfo(show)
            }
            notisound.play()
        })
        socket.on('send_done', (data) => { // get all active orders
            const orders = data
            const takedOrds = orders.filter(order => order.chef && order.chef._id == helper.getCookie()._id)
            setTakedOrders(takedOrds)
            if(showOrderInfo) {
                const show = takedOrds.find(order => order._id == showOrderInfo._id)
                setShowOrderInfo(show)
                console.log(show)
            }
            notisound.play()
        })
    }, [takedOrders])

    useEffect(() => {
        axios.get(`${config.URL}/order/get_by_chef_id/${helper.getCookie()._id}`, {
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(result => {
            console.log(result.data.orders)
            setTakedOrders(result.data.orders)
        }).catch(error => {
            console.log(error.response)
        })
    }, [])

    
    const showOrder = (takedOrder) => {
        setShowOrderInfo(takedOrder)
    }

    const finish = () => {
        axios({
            method: 'post',
            url: `${config.URL}/order/chef_finish/${showOrderInfo._id}`, 
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(async(result) => {
            const data = result.data
            setOrders(data.orders)
            const updatedTakedOrders = data.orders.filter(order => order.chef && order.chef._id === helper.getCookie()._id)
            setTakedOrders(updatedTakedOrders)
            setShowOrderInfo(updatedTakedOrders.find(orderInfo => orderInfo._id == showOrderInfo._id))
            console.log(updatedTakedOrders.find(orderInfo => orderInfo._id == showOrderInfo._id))
            socket.emit('finish_order', 'finishing!')
        }).catch(error => console.log('error__', error))
    }

    const hideModal = (e) => {
        console.log()
    }


    return (
        <div className='chef'>
          <div className='shadow'>
            <div className="container d-flex justify-content-between align-items-center">
                <div>
    
                </div>
                <div>
                  <img className="logo" src="./logo.svg" alt="logo" />
                </div>
                <div className='d-flex'> 
                {
                    takedOrders.length > 0 ?
                    takedOrders.map((takedOrder, index) => (
                        <div key={index} onClick={() => showOrder(takedOrder)}
                            className={"selected-table " +( takedOrder.noti ? "noti" : "")}  
                            data-bs-target="#view_employee_modal" data-bs-toggle="modal"
                        >
                            {takedOrder.table_id.code}
                        </div>
                    )) : null
                }
                </div>
            </div>
          </div>

        {/* View Order Modal */}
        <div className="modal fade"
            id="view_employee_modal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-center">
                        <h5 className="modal-title text-center" id="exampleModalLabel"> <b>{showOrderInfo ? 'Orders Of '+showOrderInfo.table_id.code : 'This order is already done!'}</b></h5>
                    </div>
                    {
                        showOrderInfo ? 
                            <div className="modal-body">
                            <div>
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">New Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            showOrderInfo ? 
                                                showOrderInfo.items.map((order, index) => (
                                                    <tr key={index}>
                                                        <td>{order.name}</td>
                                                        <td>{order.quantity}</td>
                                                        <td>{order.add_quantity}</td>
                                                    </tr>
                                                ))
                                            : null
                                        }
                                        
                                    </tbody>
                                </table>
                                <p className='text-secondary'>
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout
                                </p>
                                <button type="button" className="btn btn-secondary hide-modal" hidden data-bs-dismiss="modal" onClick={hideModal}>Close</button>
                                {
                                    showOrderInfo.table_id.status == 'finish' ? 
                                        <button className='btn w-100 mt-3' disabled>Finish</button>
                                    : <button className='btn w-100 mt-3' onClick={finish}>Finish</button>
                                }
                                
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>

          <Outlet/>
        </div>
      )
}

export default Header
