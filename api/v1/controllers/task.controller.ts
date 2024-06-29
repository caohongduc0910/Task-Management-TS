import { Request, Response } from "express"
import Task from '../models/task.model'
import paginationHelper from '../../../helpers/pagination.helper'
import searchHelper from '../../../helpers/search.helper'

//[GET] /tasks
export const getAll = async (req: Request, res: Response): Promise<void> => {
  //Find
  interface FindClause {
    deleted: boolean,
    status?: string,
    title?: RegExp
  }

  const findClause: FindClause = {
    deleted: false
  }

  if (req.query.status) {
    findClause.status = req.query.status.toString()
  }

  //Sort
  const sortClause: { [key: string]: any } = {}

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString()
    sortClause[sortKey] = req.query.sortValue
  }
  else {
    sortClause['title'] = 'asc'
  }

  //Search
  const searchObject = searchHelper(req.query)
  if (searchObject.regex) {
    findClause.title = searchObject.regex
  }

  //Pagination
  const count = await Task.countDocuments(findClause)
  const objectPagination = paginationHelper(req.query, count)

  const tasks = await Task
    .find(findClause)
    .sort(sortClause)
    .limit(objectPagination.limit)
    .skip(objectPagination.skipItem)

  res.status(200).json({
    msg: "Danh sách nhiệm vụ",
    tasks: tasks
  })
}


// [GET] /tasks/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const task = await Task.findOne({
    _id: req.params.id,
    deleted: false
  })
  
  if(task) {
    res.status(200).json({
      msg: "Chi tiết nhiệm vụ",
      task: task
    })
  }
  else {
    res.status(404).json({
      msg: "Không tồn tại nhiệm vụ",
    })
  }
}


// [PATCH] /tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id
    const status = req.body.status
    await Task.updateOne(
      {
        _id: id
      }, {
      status: status
    })

    res.status(200).json({
      id: id,
      msg: "Đổi trạng thái thành công"
    })
  }
  catch (error) {
    res.status(400).json({
      msg: "Đổi trạng thái thất bại"
    })
  }
}


// [PATCH] /tasks/change-multi
export const changeMulti = async (req: Request, res: Response): Promise<void> => {

  const ids: string[] = req.body.ids
  const key: string = req.body.key
  const value: string = req.body.value

  enum choices {
    STATUS = "status",
    DELETE = "delete"
  }

  switch (key) {
    case choices.STATUS:
      await Task.updateMany(
        {
          _id: { $in: ids }
        }, {
        status: value
        }
      )
      res.status(200).json({
        msg: "Đổi trạng thái thành công"
      })
      break
    case choices.DELETE:
      await Task.updateMany(
        {
          _id: { $in: ids }
        },
        {
          deleted: true,
          deletedAt: new Date()
        }
      )
      res.status(200).json({
        msg: "Xóa tài khoản thành công"
      })
      break
    default:
      res.status(400).json({
        msg: "Thất bại"
      })
  }
}


// [POST] /tasks
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.body.createdBy = req.user.id
    const task = new Task(req.body)
    await task.save()
    res.status(200).json({
      msg: "Tạo thành công",
      newTask: task
    })
  }
  catch (error) {
    res.status(404).json({
      msg: "Tạo thất bại"
    })
  }
}


// [PATCH] /tasks/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    await Task.updateOne({ _id: req.params.id }, req.body)
    res.status(200).json({
      msg: "Cập nhật thành công"
    })
  }
  catch (error) {
    res.status(400).json({
      msg: "Cập nhật thất bại"
    })
  }
}


// [DELETE] /tasks/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    await Task.updateOne({ _id: req.params.id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    )
    res.status(200).json({
      msg: "Xóa thành công"
    })
  }
  catch (error) {
    res.status(400).json({
      msg: "Xóa thất bại"
    })
  }
}