import { Schema, model, connection } from 'mongoose';

interface UserType {
    email: string;
    password: string;
}

const schema = new Schema<UserType>({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const modelName: string = 'User';

export default (connection && connection.models[modelName]) ? connection.models[modelName] : model<UserType>(modelName, schema);