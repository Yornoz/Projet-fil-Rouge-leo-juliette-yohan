import { Request, Response } from 'express';
import User from '../models/User';

export async function listUsers(req: Request, res: Response) {
  const users = await User.find();
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}