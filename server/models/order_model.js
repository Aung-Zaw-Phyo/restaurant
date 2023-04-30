const mongoose = require("mongoose");
const { Schema } = mongoose;
const Table = require('./table_model')

const itm = new Schema({
  food_id: { type: Schema.Types.ObjectId, required: true, ref: "Food" },
  name: {type: String, required: true},
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total_price: {type: Number, required: true},
  add_quantity: {type: Number, required: true, default: 0}
});

const Order = new Schema(
  {
    items: [itm],
    order_id: { type: String, required: true },
    message: {type: String, required: false, default: null},
    table_id: {type: Schema.Types.ObjectId, required: true, ref: "Table"},

    uploader: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
    updater: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
    finisher: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
    
    chef: {type: Schema.Types.ObjectId, required: false, ref: 'Employee'},
    status: {type: Boolean, required: true, default: true} // true => active , false => already done
  },
  { timestamps: true },{
    strict: true,
    strictQuery: false // Turn off strict mode for query filters
  }
);

Order.virtual("noti").get(function () {
  let noti = false;
  this.items.forEach(item => {
    if(item.add_quantity > 0){
      noti = true
    }
  });
  return noti
});

Order.set('toObject', { virtuals: true });
Order.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Order", Order);
