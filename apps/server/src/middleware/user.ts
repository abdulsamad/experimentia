import { Request, Response, NextFunction } from 'express';

const user = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;

  if (user && user.email) {
    req.user = user;
    next();
    return;
  }

  return res.status(400).json({ success: false, err: 'User object is required' });
};

export default user;
