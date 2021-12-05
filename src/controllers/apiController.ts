import { Request, Response } from 'express';
import User from '../models/User';
import JWT from 'jsonwebtoken';
import qs from 'qs';
import sharp from 'sharp';
import { unlink } from 'fs';
import bcrypt from 'bcrypt';

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true })
}

export const register = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log('senha em hash: ' + hashedPassword);

    let newUser = await User.create({
        email,
        password: hashedPassword,
        firstName: '',
        lastName: '',
        avatarURL: ''
    })
    
    if(newUser) {
        let token = JWT.sign(
            { id: newUser.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1h' }
        )

        res.status(201);
        res.json({ status: true, token });
    }
    res.json({ status: false , errorMessage: 'Erro ao cadastrar.'})
}

export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    
    try {
        let hasUser = await User.findOne({
            email
        });
        if(hasUser) {
            let decodedPassword = await bcrypt.compare(password, hasUser.password)

            if (decodedPassword) {
                let token = JWT.sign(
                    { id: hasUser.id },
                    process.env.JWT_SECRET_KEY as string,
                    { expiresIn: '1h' }
                )
        
                res.json({ status: true, token });
            }

        }

        res.json({ status: false , errorMessage: 'Usuário ou senha inválidos.'})
    }catch(err) {
        console.log(err);
        res.json({ status: false });
    }    
}

interface UserType {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatarURL: string;
    birthDay: string;
    phone: string;
    address: string;
    state: string;
    city: string;
}

export const getPublicInfos = async (req: Request, res:Response) => {
    try{
        let query = qs.stringify(req.query);
        let [key, token]  = query.split('=');
        
        let userId: any = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
        let id = userId.id;
        
        let user: UserType = await User.findById(id);

        let publicInfos = {
            firstName: user.firstName,
            lastName: user.lastName,
            avatarURL: user.avatarURL,
            birthDay: user.birthDay,
            phone: user.phone,
            address: user.address,
            state: user.state,
            city: user.city
        }

        res.json(publicInfos);
    

    }catch(err) {
        console.log(err)
        res.status(401)
    }
}

export const uploadAvatarImage = async (req: Request, res: Response) => {
    try {
        if(req.file) {
            let authReq: string = req.headers.authorization ? req.headers.authorization : '';
            let [key, token] = authReq.split(' ');
            let userId: any = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
            let id = userId.id;
            let user = await User.findById(id)
                        
            const filename = `${req.file.filename}.jpg`;
            
            await sharp(req.file.path).resize({ width: 200, height: 200, fit: sharp.fit.cover }).toFormat('jpeg').toFile(`./public/media/avatar/${filename}`)
            
            unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log(`temp/${filename} was deleted`);
            })
            
            const fileURL = `http://localhost:4000/media/avatar/${filename}`;

            let x = await User.updateOne(user, {
                avatarURL: fileURL
            })

            res.json({ message: 'Image successfully added!', fileURL: fileURL });
        }
    }catch(err) {
        console.log(err);
    }
}

export const uploadInfos = async (req: Request, res: Response) => {
    try {
        const authReq = req.headers.authorization ? req.headers.authorization : '';
        const [key, token] = authReq.split(' ');
        const idByToken: any = JWT.verify(token, process.env.JWT_SECRET_KEY as string);

        const id = idByToken.id;

        const user = await User.findById(id);

        await User.updateOne(user, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDay: req.body.bday,
            phone: req.body.phoneNum,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city
        });

        res.status(201)
    }catch(err) {

    }
}