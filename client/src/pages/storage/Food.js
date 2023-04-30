import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { dateTime, getCookie } from '../../api/helper';
import { config } from '../../config';
import AddFood from './components/AddFood';

const Food = () => {
    const [foods, setFoods] = useState(null)
    const [food, setFood] = useState(null)
    const [editFood, setEditFood] = useState({name: '', price: '', quantity: ''})
    const [error, setError] = useState(false)

    useEffect(() => {
        setEditFood({
            name: food ? food.name : '', 
            price: food ? food.price : '', 
            quantity: food ? food.quantity : ''
        })
    }, [food])

    const submitEditFormHandler = (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);
        let formObject = Object.fromEntries(data.entries())
        if(formObject.name === '' || formObject.price === '' || formObject.quantity === ''){
            setError(true)
            setTimeout(() => setError(false), 3000)
            return
        }
        axios({
            method: 'put',
            url: `${config.URL}/food/edit/${food._id}`, 
            data: formObject,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${getCookie().token}`
            }
        }).then(async(result) => {
            const foodFromServer = result.data.food
            console.log(foodFromServer)
            const resultFoods = await foods.map(food => {
                if(food._id === foodFromServer._id){
                return foodFromServer
                }else {
                return food
                }
            })
            setFoods(resultFoods)
        }).catch(error => console.log('error__', error))
    }

    const deleteFood = (e) => {
        e.preventDefault()
        axios.delete(`${config.URL}/food/delete/${food._id}`, {
            headers: {
              'Authorization': `Bearer ${getCookie().token}`
            }
          }).then(result => {
            const foodFromServer = result.data.food
            const newResult = foods.filter(food => {
              return foodFromServer._id !== food._id
            })
            setFoods(newResult)
            console.log(result.data.message)
          }).catch(error => console.log(error))
    }

    useEffect(() => {
        axios.get(`${config.URL}/food`, {
            headers: {
                'Authorization': `Bearer ${getCookie().token}`
            }
        }).then(result =>  {
            const foods = result.data.foods
            setFoods(foods)
            console.log(foods)
        }).catch(error => {
            console.log(error.response)
        })
    }, []);

    return (
        <div>
            <div>
                <div className="container">

                    <div className='quick'>
                        <div className="bar">

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
                                <h5 className="modal-title text-center" id="exampleModalLabel">Profile InFormation</h5>
                                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" /> */}
                            </div>
                            <div className="modal-body">

                                <div className="employee_information">
                                <div className="img text-center mb-3">
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ0PXAKWuSbrI4zS9-5Nx14XBPJaqOw3gcyA&usqp=CAU' alt=""/>
                                </div>
                                <div className="d-flex justify-content-between px-3">
                                    <p className="mb-0">Name</p><p className="mb-0">Rose</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Phone number</p><p className="mb-0">09985856558</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Role</p><p className="mb-0">Data Entry</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Employee ID</p><p className="mb-0">CED-127</p>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mt-2 px-3">
                                    <p className="mb-0">Address</p><p className="mb-0">Shwe Linban, Hlaing Tharyar in Yangon</p>
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
                                    <button className="btn" data-bs-dismiss="modal" aria-label="Close">Logout</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>



                <div className=' mt-5'> 
                    <div className='row g-2 mb-4'>
                    <div className='col-md-3 d-flex align-items-end p-0'>
                        <button className="btn" data-bs-toggle="modal" data-bs-target="#add_food">Add Food</button>
                        {/* Add Food Modal */}
                        <AddFood foods={foods} setFoods={setFoods}/>
                    </div>


                    <div className='col-md-6 p-0'>
                        <h5 className='text-center'>Search The Food</h5>
                        <input type="text" className='form-control form-control-lg' placeholder='Enter the food name' />
                    </div>
                    <div className='col-md-3'></div>
                    </div> 
                    {
                        foods ? 
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Creator</th>
                                    <th scope="col">Created Time</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                        {foods.map((food, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{food.name}</td>
                                                <td><img className='menu-img' src={food.image? config.URL+food.image : null} alt="" /></td>
                                                <td>{food.price} MMK</td>
                                                <td>{food.quantity}</td>
                                                <td>{food.employee_id.name}</td>
                                                <td>{dateTime(food.createdAt)}</td>
                                                <td>
                                                    <i onClick={() => setFood(food)} 
                                                        data-bs-toggle="modal" data-bs-target="#edit_food"
                                                        className='fas fa-edit edit-food-icon shadow'
                                                    >
                                                    </i>
                                                </td>
                                                <td>
                                                    <i onClick={() => setFood(food)} 
                                                    data-bs-toggle="modal" data-bs-target="#delete_food"
                                                    className='fas fa-trash edit-food-icon shadow'
                                                >
                                                </i>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    :   <div className="text-danger text-center text-muted fs-3 my-5">........ loading ........</div>
                }
                </div>
                </div>
            </div>


            <div className="modal fade" id="edit_food" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
                <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header d-flex justify-content-center">
                        <h5 className="modal-title text-center" id="exampleModalLabel">Edit Food</h5>
                    </div>
                    <div className="modal-body">
                    {error ? <div className='alert alert-danger text-center'>All fields are needed to fill!</div> : ''}
                        <form onSubmit={submitEditFormHandler}>
                        <div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input type="file" className="form-control" name='image' id="image"  />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" name="name" value={editFood.name}
                                    onChange={e => {
                                    setEditFood({name: e.target.value})
                                    }}
                                    className="form-control" id="name" placeholder="Enter food name " 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input type="text" name="price" value={editFood.price}
                                    onChange={e => {
                                    setEditFood({name: e.target.value})
                                    }}
                                    className="form-control" id="name" placeholder="Enter food price " 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="text" name="quantity" value={editFood.quantity}
                                    onChange={e => {
                                    setEditFood({quantity: e.target.value})
                                    }}
                                    className="form-control" id="name" placeholder="Enter food quantity " 
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="reset" className="btn btn-lg me-3" data-bs-target="#view_employee_modal" data-bs-toggle="modal">Back</button>
                                {/* <button className="btn btn-lg" id='close_edit_form_modal' data-bs-dismiss="modal" aria-label="Close" hidden>Update</button> */}
                                <button className="btn btn-lg">Update</button>
                            </div>
                            
                        </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>

            <div className="modal fade" id="delete_food" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    
                    <div className="modal-body text-center">
                    <div className="mb-3 ">
                        <img className="comfirm_msg_icon" src="/images/warning_message.svg" alt=""/>
                    </div>
                    <h4>Are you sure you want to delete?</h4>
                    <div className="d-flex justify-content-center mt-3" >
                        <button className="btn me-3" data-bs-target="#view_employee_modal" data-bs-toggle="modal">Back</button>
                        <button className="btn" onClick={deleteFood}
                        data-bs-dismiss="modal" aria-label="Close">Delete</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>




        </div>
    )
}

export default Food
