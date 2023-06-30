import express, { Request, Response, Router } from 'express';
import { userRegistration, userlogin, getAllUser, refreshToken, logout } from '../Controller/usercontroller'
import { verifyToken } from '../util/service'
const router = Router();

router.post('/registerUser', async (req: Request, res: Response) => { res.status(200).send(await userRegistration(req, res)) })

router.post('/userlogin', async (req: Request, res: Response) => { res.status(200).send(await userlogin(req, res)) })

router.get('/getAllUser', verifyToken, async (req: Request, res: Response) => { res.status(200).send(await getAllUser(req, res)) })

router.post('/refreshToken', async (req: Request, res: Response) => { res.status(200).send(await refreshToken(req, res)) })

router.delete('/logout', async (req: Request, res: Response) => { res.status(200).send(await logout(req, res)) })


router.get('/registerPage', async (req: Request, res: Response) => { res.render('register.ejs', { pageName: "Register User" }) })

export default router