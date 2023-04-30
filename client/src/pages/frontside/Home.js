import React, { useContext, useEffect, useState } from 'react'
import { TableInfo } from './components/TableInfo'

import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/free-mode";
import 'swiper/css/pagination';

import { FreeMode, Pagination, Autoplay } from "swiper";
import * as helper from '../../api/helper'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {config} from './../../config'
import io from 'socket.io-client'

import noti from '../noti.mp3'
let notisound = new Audio(noti)
let socket;


const Home = (props) => {
    const navigate = useNavigate()
    const {showTableInfo, setShowTableInfo} = useContext(TableInfo)
    const [searchInput, setSearchInput] = useState(false)
    const [foods, setFoods] = useState(null)
    const [tables, setTables] = useState(null)
    const {currentTable, setCurrentTable} = props
    const [message, setMessage] = useState('')

    const [orders, setOrders] = useState([]) // orders of only table
    const [updateOrder, setUpdateOrder] = useState(null) // to take order's id especially!
    const [updateStatus, setUpdateStatus] = useState(false)
    const [totalCost, setTotalCost] = useState(0)

    const ENDPT = 'http://localhost:5000';
    useEffect(() => {
        socket = io(ENDPT)
        socket.on('send_finish_order', (data) => { // get tables
            console.log(data.tables, data.orders)
            setTables(data.tables)
            if(updateOrder){
                const order = data.orders.find(single => {
                    console.log(single._id, updateOrder._id)
                    return single._id == updateOrder._id
                })
                console.log('============= ',order)
                setUpdateOrder(order)
                setOrders(order.items)
            }
            notisound.play()
        })
    }, [updateOrder])

    useEffect(() => {
        axios.get(`${config.URL}/table`, {
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(result => {
            const tables = result.data.tables
            setTables(tables)
        }).catch(error => {
            console.log(error.response)
        })

        axios.get(`${config.URL}/food`, {
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(result => {
            const foods = result.data.foods
            setFoods(foods)
        }).catch(error => {
            console.log(error.response)
        })
    }, []);


    useEffect(() => {
        let toco = 0
        for (let i = 0; i < orders.length; i++) {
            toco += parseInt(orders[i].total_price);
        }
        setTotalCost(toco)
    }, [orders]);

    const createOrder = async(food) => {
        if(!currentTable) {
            helper.warning('Please choose the table before.')
            return
        }
        const isExist = orders.find(order => order.food_id === food._id)
        if(isExist) {
            helper.warning('This menu is already taken.')
            return
        }
        setUpdateStatus(true)
        
        const order = {
            food_id: food._id, 
            name: food.name, 
            price: food.price,
            quantity: 1, 
            total_price: food.price,
            add_quantity: 0
        }
        await setOrders([...orders, order])
    }

    const controlQuantity = (action, id, update = false) => {
        
        if(action === 'add') {
            const newOrders = orders.filter(order => {
                if(order.food_id === id) {

                    const limit_quantity = foods.find(food => food._id === id).quantity;
                    let reach_quantity = 0;
                    if(update) {
                        const original_limit_quantity = updateOrder.items.find(itm => itm._id === order._id)
                        reach_quantity = order.add_quantity - original_limit_quantity.add_quantity
                    }else {
                        reach_quantity = order.quantity + order.add_quantity
                    }

                    if(update) {
                        if(limit_quantity <= reach_quantity){
                            helper.warning('This menu is not enough!')
                            return order
                        }else {
                            order.add_quantity += 1;
                            order.total_price = (order.quantity + order.add_quantity) * order.price
                            setUpdateStatus(true)
                            return order
                        }
                    }else {
                        if(!(limit_quantity > reach_quantity)) {
                            helper.warning('This menu is not enough!')
                            return order
                        }else {
                            order.quantity += 1;
                            order.total_price = (order.quantity + order.add_quantity) * order.price
                            return order
                        }
                    }

                }else {
                    return order
                }
            })
            setOrders(newOrders)
            
        }else if(action === 'reduce') {
            const newOrders = orders.filter(order => {
                if(order.food_id === id) {
                    if(0 ==  order.quantity && !update && order.add_quantity == 0 ) {
                        
                    }else {
                        update ? order.add_quantity -= 1 : order.quantity -= 1;
                        order.total_price = (order.quantity + order.add_quantity) * order.price
                        if(0 !==  order.quantity) {
                            return order
                        }
                    }
                }else{
                    return order
                }
            })
            setOrders(newOrders)      
            if(updateOrder.items.length < newOrders.length){
                setUpdateStatus(true)
            }else if(update) {
                let status = false
                for (let i = 0; i < newOrders.length; i++) {
                    const order = newOrders[i];
                    const original_order = updateOrder.items.find(item => item._id == order._id)
                    order.add_quantity > original_order.add_quantity || status ? status = true : status = false
                }
                setUpdateStatus(status)
            }
        }


    }


    const getOriginalQuantity = (id) => { //order._id
        let originalItem = updateOrder.items.find(itm => itm._id === id)
        return originalItem.add_quantity;
    }

    const submitOrder = () => {
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i]
            const limit_quantity = foods.find(food => food._id === order.food_id).quantity;
            if(limit_quantity < order.quantity) {
                helper.warning('This menu is not enough!')
                return
            }
        }


        let table_id = tables.find(table => table.code === currentTable)._id
        axios({
            method: 'post',
            url: `${config.URL}/order/create`, 
            data: {items: orders, table_id: table_id},
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(async(result) => {
            const data = result.data
            console.log(data)
            setFoods(data.foods)
            setTables(data.tables)
            setOrders(data.orders.items)
            setUpdateOrder(data.updateOrder)
            setUpdateStatus(false)
            socket.emit('create_order', data.orders)
        }).catch(error => console.log('error__', error))
    }

    const submitUpdateOrder = () => {
        axios({
            method: 'put',
            url: `${config.URL}/order/update/`+updateOrder._id, 
            data: {items: orders},
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(async(result) => {
            const data = result.data
            console.log(data)
            setFoods(data.foods)
            setTables(data.tables)
            setOrders(data.orders.items)
            setUpdateOrder(data.updateOrder)
            setUpdateStatus(false)
            socket.emit('update_order', 'updated order!')
        }).catch(error => console.log('error__', error))
    }

    const showCurrentTable = (table, status) => {
        setCurrentTable(table.code)
        if(status === 'active'){
            axios({
                method: 'get',
                url: `${config.URL}/order/get_by_table_id/`+table._id, 
                headers: {
                    'Authorization': `Bearer ${helper.getCookie().token}`
                }
            }).then(async(result) => {
                const data = result.data
                setOrders(data.order.items)
                setUpdateOrder(data.updateOrder)
                console.log(data.updateOrder)
                setUpdateStatus(false)
            }).catch(error => console.log('error__', error))
        }else {
            console.log(status)
            setOrders([])
            setUpdateOrder(null)
        }
    }

    const done = () => {
        axios({
            method: 'post',
            url: `${config.URL}/order/done/`+updateOrder._id, 
            headers: {
                'Authorization': `Bearer ${helper.getCookie().token}`
            }
        }).then(async(result) => {
            const data = result.data
            console.log(data)
            setTables(result.data.tables)
            setOrders([])
            setUpdateOrder(null)
            socket.emit('done', 'already done!')
        }).catch(error => console.log('error__', error))
    }
    
    
    const logout = () => {
        helper.logout()
        navigate('/login')
    }

    return (
        <div>
            <div className="container py-5">
                <div className='quick'>
                    <div className="bar">

                        <div className='quick-link quick-link-1'>
                        <div className='search' onClick={() => searchInput ? setSearchInput(false) : setSearchInput(true)}><i className="fa-solid fa-magnifying-glass"></i></div>
                        </div>  
                        <div className='quick-link quick-link-2'>
                        <div className="table m-auto"><i className="fa-solid fa-message"></i></div>
                        </div>
                        <div className='quick-link quick-link-3'>
                        <div className="checkout"  data-bs-target="#view_profile" data-bs-toggle="modal"><i className="fa-solid fa-address-card"></i></div>
                        </div>

                        <div className='bar-menu'>
                        <i className="fa-solid fa-house"></i>
                        </div>
                    </div>



                </div>
                {/* View Employee Modal */}
                <div className="modal fade" id="view_profile" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                            <h5 className="modal-title text-center" id="exampleModalLabel">Profile Information</h5>
                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" /> */}
                        </div>
                        <div className="modal-body">

                            <div className="employee_information">
                            <div className="img text-center mb-3">
                                <img src={config.URL+helper.getCookie().profile} alt=""/>
                            </div>
                            <div className="d-flex justify-content-between px-3">
                                <p className="mb-0">Name</p><p className="mb-0">{helper.getCookie().name}</p>
                            </div>
                            <hr/>
                            <div className="d-flex justify-content-between mt-2 px-3">
                                <p className="mb-0">Phone number</p><p className="mb-0">{helper.getCookie().phone}</p>
                            </div>
                            <hr/>
                            <div className="d-flex justify-content-between mt-2 px-3">
                                <p className="mb-0">Role</p><p className="mb-0">{helper.getCookie().role_name}</p>
                            </div>
                            <hr/>
                            <div className="d-flex justify-content-between mt-2 px-3">
                                <p className="mb-0">Address</p><p className="mb-0">{helper.getCookie().address}</p>
                            </div>
                            <hr/>

                            <div className="mt-3">
                                <div className="card border-0 p-3" data-bs-toggle="modal" href="#profile_logout">
                                <div className="d-flex justify-content-between">
                                    <div className="mb-0">Logout</div>
                                    <div className="mb-0"><i className="fa-solid fa-right-from-bracket"></i></div>
                                </div>
                                </div>
                            </div>
                            </div>

                        </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="profile_logout" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            
                            <div className="modal-body text-center">
                            <div className="mb-3 ">
                                <img className='comfirm_msg_icon' src="/images/warning_message.svg" alt=""/>
                            </div>
                            <h4>Are you sure you want to logout?</h4>
                            <div className="d-flex justify-content-center mt-3" >
                                <button className="btn me-3" data-bs-target="#view_profile" data-bs-toggle="modal">Cancel</button>
                                <button className="btn" 
                                    data-bs-dismiss="modal" aria-label="Close" onClick={logout}
                                >Logout</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-info p-2" style={{ right: showTableInfo ? '0' : '-370px' }}>
                    {/* <div className='text-danger text-center mb-2'>Order created successfully.</div> */}
                    {
                        orders.length > 0 ? 
                        <div>
                            <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Price <small>(MMK)</small></th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Tol Price <small>(MMK)</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.name}</td>
                                    <td>{order.price}</td>
                                    <td>
                                        <div className='count-action'>
                                            {
                                                order._id ? 
                                                    order.add_quantity <= getOriginalQuantity(order._id) ? 
                                                        <span>
                                                            <i onClick={() =>helper.warning('This menu is not reduce!')} 
                                                                className="fa-solid fa-minus disabled"
                                                            ></i>
                                                        </span>
                                                    :
                                                        <span>
                                                            <i onClick={() => controlQuantity('reduce', order.food_id, true)} 
                                                                className="fa-solid fa-minus"
                                                            ></i>
                                                        </span>
                                                : <span>
                                                    <i onClick={() => controlQuantity('reduce', order.food_id)}
                                                        className="fa-solid fa-minus"
                                                    ></i>
                                                </span>
                                            }
                                            
                                            <span className='count'>{order.quantity + order.add_quantity}</span>
                                            <span>
                                                <i onClick={
                                                    () => order._id ? controlQuantity('add', order.food_id, true) : controlQuantity('add', order.food_id)
                                                }
                                                    className="fa-solid fa-plus"
                                                ></i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>{order.total_price}</td>
                                </tr>
                                ))
                            }
                                
                            <tr>
                                <td colSpan="2" className='fw-bold'>Total Cost</td>
                                <td colSpan="2" className='fw-bold'>{totalCost} <small>MMK</small></td>
                            </tr>
                        </tbody>
                        
                    </table>
                    <div className='mb-3'>
                        <textarea rows={'3'} onChange={e=> setMessage(e.target.value)} value={message}
                            className='from-control w-100 p-2'></textarea>
                    </div>
                        {
                            orders[0]._id ? 
                                <div>
                                    {updateStatus ? 
                                        <button className='btn w-100' onClick={submitUpdateOrder}>Update</button>
                                        :
                                        <button className='btn w-100' onClick={submitUpdateOrder} disabled>Update</button>
                                    }
                                    {
                                        updateOrder.table_id.status == 'finish' ? <button className='btn w-100 mt-3' onClick={done}>Done</button> : null
                                    }
                                    
                                </div>
                            : <button className='btn w-100' onClick={submitOrder}>Submit</button>
                        }
                    </div>
                    : null
                    }
                    
                </div>


                <div>
                    {
                        searchInput ? 
                        <div className='col-lg-6 mx-auto mb-3'>
                            <h5 className='text-center'>Search The Table</h5>
                            <input type="text" className='form-control form-control-lg' placeholder='Enter the table number ( 4 )' />
                        </div> : ''
                    }
                    {
                        tables ? 
                            <Swiper
                                // slidesPerView={8}
                                // spaceBetween={30}
                                freeMode={true}
                                grabCursor={true}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[FreeMode, Autoplay, Pagination]}
                                breakpoints= {{
                                    300: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                    400: {
                                        slidesPerView: 4,
                                        spaceBetween: 35,
                                    },
                                    768: {
                                        slidesPerView: 6,
                                        spaceBetween: 40,
                                    },
                                    992: {
                                        slidesPerView: 8,
                                        spaceBetween: 35,
                                    },
                
                                    1200: {
                                        slidesPerView: 10,
                                        spaceBetween: 35,
                                    },
                                }}
                                // autoplay={{
                                //     delay: 3000,
                                //     disableOnInteraction: false,
                                //     pauseOnMouseEnter: true,
                                // }}
                                // loop={true}
                                className="mySwiper"
                            >
                                {
                                    tables.map((table, index) => (
                                        
                                        <SwiperSlide className='res-table-container' key={index}>
                                            <div className={"res-table " + (table.status == 'active' ? 'active' : '') + (table.status == 'finish' ? 'finish-noti' : '')}
                                                onClick={() => table.status == 'active' || table.status == 'finish' ? showCurrentTable(table, 'active') : showCurrentTable(table, 'inactive')}
                                            >
                                                {table.code}
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        : <div className="text-danger text-center text-muted fs-3 my-5">........ loading ........</div>
                    }
                </div>


            <div className=' mt-5'> 
                {
                    searchInput ? 
                    <div className='col-lg-6 mx-auto mb-3'>
                        <h5 className='text-center'>Search The Menu</h5>
                        <input type="text" className='form-control form-control-lg' placeholder='Enter the menu name' />
                    </div> : ''
                }

                {
                    foods ? 
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Price (MMK)</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Order</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    foods.map((food, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{food.name}</td>
                                            <td><img className='menu-img' src={food.image? config.URL+food.image : null} alt="" /></td>
                                            <td>
                                                <div className='badge bg-danger'>{food.price}</div>
                                            </td>
                                            <td><div className='badge bg-dark'>{food.quantity}</div></td>
                                            <td>
                                                <i onClick={() => createOrder(food)}
                                                    className="fa-solid fa-cart-shopping cart">
                                                </i>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    : <div className="text-danger text-center text-muted fs-3 my-5">........ loading ........</div>

                }
            </div>

            </div>
        </div>
    )
}

export default Home