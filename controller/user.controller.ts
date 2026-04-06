import {type Request, type Response} from 'express';
import users from '../service/user.service';


export const createUser = async (req : Request, res : Response) => {
    const {name, email, password} = req.body;
    const user = new users(name, email, password);
    try {
        const newUser = await user.createUser();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}


export const getUserByEmail = async (req : Request, res : Response) => {
    const {email} = req.params;
    const user = new users("", email as string, "");
    try {
        const foundUser = await user.getUserByEmail();
        if(!foundUser) {
            res.status(404).json({message: "User not found"});
        } else {
            res.status(200).json(foundUser);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const forgetPassword = async (req : Request, res : Response) => {
    const {email} = req.params;
    const {newPassword} = req.body;
    const user = new users("", email as string, "");
    try {
        const updatedUser = await user.forgetPassword(newPassword);
        if(!updatedUser) {
            res.status(404).json({message: "User not found"});
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const changeName = async (req : Request, res : Response) => {
    const user = new users("","","");
    const {id} = req.params;
    const {newName} = req.body;
    try{
        const updatedUser = await user.changeName(id as string, newName);
        if(updatedUser === "No User Found"){
            res.status(404).json({message: "User not found"});
        }
        else{
            res.status(200).json(updatedUser);
        }
    }
    catch(error : any){
        res.status(500).json({message: error.message});
     }
}