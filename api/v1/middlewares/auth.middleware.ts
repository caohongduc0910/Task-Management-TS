import { Request, Response, NextFunction } from 'express'
import User from '../models/user.model'

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    const user = await User.findOne({
      tokenUser: token,
      deleted: false,
      status: "active"
    }).select("-password")

    if (!user) {
      res.status(400).json({
        msg: "Token không hợp lệ"
      })
      return
    }

    (req as any)["user"] = user
    next()
  }
  else {
    res.status(400).json({
      msg: "Vui lòng gửi kèm token"
    })
    return
  }
}

export default authMiddleware