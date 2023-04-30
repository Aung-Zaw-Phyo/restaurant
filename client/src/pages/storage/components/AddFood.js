import axios from 'axios';
import React, { useState } from 'react'
import { getCookie } from '../../../api/helper';
import { config } from '../../../config';

const AddFood = (props) => {
    const foods = props.foods
    const setFoods = props.setFoods
    const [error, setError] = useState(false);
    const addFoodFormSubmitHandler = (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);
        let formObject = Object.fromEntries(data.entries())
        if(formObject.name === '' || formObject.price === '' || 
        formObject.quantity === '' ){
            setError(true)
            setTimeout(() => setError(false), 3000)
            return
        }
        const user = getCookie()
        axios({
            method: 'post',
            url: `${config.URL}/food/create`, 
            data: formObject,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${user.token}`
            }
        }).then(result => {
            const foodFromServer = result.data.food
            console.log(foodFromServer)
            setFoods([foodFromServer, ...foods])
        }).catch(error => console.log(error.response.data.message))
    }
    return (
        <div>
            <div className="modal fade" id="add_food" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                            <h5 className="modal-title text-center" id="exampleModalLabel">Create Food</h5>
                        </div>
                        <div className="modal-body">
                            {error ? <div className='alert alert-danger text-center'>All fields are needed to fill!</div> : ''}
                            <form onSubmit={addFoodFormSubmitHandler}>
                                    
                                <div className="mb-3">
                                    <label htmlFor="profile" className="form-label">Image</label>
                                    <input type="file" name='image' className="form-control" id="profile"  />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" name='name' className="form-control" id="name" placeholder="Enter name " />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input type="text" name='price' className="form-control" id="price" placeholder="Enter price " />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                    <input type="number" name='quantity' className="form-control" id="quantity" placeholder="Enter quantity " />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-lg" type="submit">SAVE</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddFood
