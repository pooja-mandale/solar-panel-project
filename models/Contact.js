const mongoose=require("mongoose")

const contactSchema=new mongoose.Schema({
   firstName:{type:String,required:true},
   lastName:{type:String,required:true},
    email:{type:String,required:true},
    adress:{type:String,required:true},
    phone:{type:Number,required:true},
    message:{type:String,required:true},
     role: { type: String, enum: ["contact"], default: "contact" },
    
},{timestamps:true})

module.exports=mongoose.model("contact",contactSchema)