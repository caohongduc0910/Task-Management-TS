import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    status: String,
    createdBy: String,
    listUser: Array,
    parentId: String,
    startDate: {
      type: Date,
      default: new Date()
    },
    endDate: {
      type: Date,
      default: new Date()
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

const Task = mongoose.model('Task', taskSchema, "tasks")

export default Task