import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({ 
    fullName: String,
    email: String,
    password: String,
    tokenUser: String,
    phone: String,
    status: {
      type: String,
      default: "active"
    },
    deleted: { 
        type: Boolean,
        default: false
    },
    deletedDate: Date
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema, 'users')

export default User