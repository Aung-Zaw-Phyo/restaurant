import React from "react";
import { config } from "../../../config";
import Food from "./Food";

const Foods = (props) => {
  return (
    <div className="row">
      
          {props.foods.map((food, index) => (
            <Food
              key={food._id}
              food={food}
              count={index}
              onOrder={props.onCreateOrder}
            />
          ))}
        
    </div>
  );
};

export default Foods;
