import { Schema, model, connection } from 'mongoose';

interface UserType {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    avatarURL?: string;
    birthDay?: string;
    phone?: string;
    address?: string;
    state?: string;
    city?: string;
}

const schema = new Schema<UserType>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    avatarURL: { type: String, required: false },
    birthDay: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false } 
})

const modelName: string = 'User';

export default (connection && connection.models[modelName]) ? connection.models[modelName] : model<UserType>(modelName, schema);