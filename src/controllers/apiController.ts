import { Request, Response } from 'express';
import User from '../models/User';
import JWT from 'jsonwebtoken';
import qs from 'qs';

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true })
}

export const register = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let newUser = await User.create({
        email,
        password
    })
    let token = JWT.sign(
        { id: newUser.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1h' }
    )


    res.status(201);
    res.json({ token });
}

export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    console.log(req.body)

    try {
        let hasUser = await User.findOne({
            email,
            password
        });
    
        if(hasUser) {
            let token = JWT.sign(
                { id: hasUser.id },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '1h' }
            )
    
            res.json({ status: true, token });
        }

        res.json({ status: false , errorMessage: 'Usuário ou senha inválidos.'})
    }catch(err) {
        console.log(err);
        res.json({ status: false });
    }    
}

export const getPublicInfos = async (req: Request, res:Response) => {
    let query = qs.stringify(req.query);
    let [key, token]  = query.split('=');
    
    console.log(token);

    let userId = JWT.verify(token, process.env.JWT_SECRET_KEY as string);

    let user = await User.findOne({
        id: userId
    })

    console.log(user);

    res.json({ msg: 'foi' });
}