import { Collection } from "mongoose";
import mongoose,{Schema}  from "mongoose";

const schema = Schema;
var dispatchDetailsFormSchema = new schema(
  {
    serialStart: { type: Number, required: true },
    serialEnd: { type: Number, required: true },
    missingInventory: { type: Number, required: true },
    company: { type: String, required: true },
    plant: { type: String, required: true },
    dateDispatched: { type: Date, required: true },
    dispatchedVia: { type: String, required: true },
    hasValidated: {type: Boolean, required: true},
    dispatchedBy:{ type:String, required:true}
  },
  { collection: "dispatch-details-form" }
);

dispatchDetailsFormSchema.pre(['save','insert','validate','put'],function(next){
  if(this.serialStart>this.serialEnd)
    return new(new Error('End Date must be greater than Start Date'));
  else{
    next();
  }    
});
var Form = mongoose.model("dispatchForm",dispatchDetailsFormSchema);

var userLoginSchema = new schema({
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: {type:String , required:true , unique:true },
  role: {
    admin: { type: Boolean, default: false },
    operationManager: { type: Boolean, default: false }
  }
}, {collection:'User'});

var Users = mongoose.model("User", userLoginSchema);

export default {"Form":Form,"Users":Users};
