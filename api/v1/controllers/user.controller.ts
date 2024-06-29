import { Request, Response } from 'express'

import User from '../models/user.model'
import ForgotPassword from '../models/forgot-password.model'

import md5 from 'md5'
import sendMail from "../../../helpers/sendMail.helper"
import { generateRandomString, generateRandomNumber } from '../../../helpers/generate.helper'


// [POST] /users/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const existEmail = await User.findOne({
    deleted: false,
    status: "active",
    email: req.body.email
  })

  if (!existEmail) {
    req.body.password = md5(req.body.password)
    const token = generateRandomString(20)
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      tokenUser: token
    })
    await newUser.save()

    res.json({
      msg: "Tạo tài khoản thành công",
      user: newUser
    })
    return
  }
  res.json({
    msg: "Tạo tài khoản thất bại",
  })
  return
}


// [POST] /users/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const email = req.body.email
  const password = req.body.password

  console.log(email, password)

  const user = await User.findOne({
    status: "active",
    email: email
  })

  if (!user) {
    res.json({
      msg: "Sai email"
    })
    return
  }

  if (md5(password) != user.password) {
    res.json({
      msg: "Sai mật khẩu"
    })
    return
  }
  if (user.status == "inactive") {
    res.json({
      msg: "Tài khoản bị khóa"
    })
    return
  }

  res.cookie("tokenUser", user.tokenUser)
  res.json({
    msg: "Đăng nhập thành công",
    user: user
  })
  return
}


// [POST] /users/password/forgot
export const forgot = async (req: Request, res: Response): Promise<void> => {
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    status: "active",
    deleted: false
  })

  if (!user) {
    res.json({
      msg: "Email không tồn tại"
    })
    return
  }

  const forgotPasswordObject = {
    email: email,
    otp: generateRandomNumber(6),
    expireAt: new Date()
  }

  const newForgotPasswordObject = new ForgotPassword(forgotPasswordObject)
  newForgotPasswordObject.save()

  const subject = "Mã OTP của bạn"
  const text = `Mã xác minh lấy lại mật khẩu là <b>${newForgotPasswordObject.otp}</b>. Mã có hiệu lực trong vòng 3 phút.
  Lưu ý không được để lộ mã OTP!`
  sendMail(newForgotPasswordObject.email, subject, text)

  res.json({
    msg: "Lấy OTP thành công"
  })
}


// [POST] /users/password/otp
export const otp = async (req: Request, res: Response): Promise<void> => {
  const email = req.body.email
  const otp = req.body.otp

  const forgotPasswordObject = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  if (forgotPasswordObject) {
    const user = await User.findOne({
      email: email
    })

    res.cookie("tokenUser", user.tokenUser)

    res.json({
      msg: "OTP đúng nha"
    })
    return
  }
  else {
    res.json({
      msg: "Sai OTP"
    })
    return
  }
}


// [POST] /users/password/reset
export const reset = async (req: Request, res: Response): Promise<void> => {
  try {
    const password = req.body.password
    const passwordConfirm = req.body.passwordConfirm

    if (password != passwordConfirm) {
      res.json({
        msg: "Mật khẩu xác nhận không khớp"
      })
      return
    }
    else {
      await User.updateOne(
        {
          tokenUser: req.cookies.tokenUser,
        },
        {
          password: md5(req.body.password)
        }
      )

      res.json({
        msg: "Đổi mật khẩu thành công"
      })
      return
    }
  }
  catch (error) {
    console.log(error)
    res.json({
      msg: "Đổi mật khẩu thất bại"
    })
    return
  }
}


// [GET] /users/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any)["user"]

  console.log(user.id)
  console.log(req.params.id)

  if(user.id != req.params.id) {
    res.json({
      msg: "Không có quyền thực hiện hành động này"
    })
    return
  }

  if (user) {
    res.json({
      user: user,
      msg: "Lấy thông tin chi tiết thành công"
    })
    return
  }
  else {
    res.json({
      msg: "Người dùng không tồn tại"
    })
    return
  }
}


//[GET] /users
export const getAll = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({
    deleted: false,
    status: "active"
  }).select("fullName email")

  res.json({
    msg: "Lấy danh sách thành công",
    users: users
  })
  return
}