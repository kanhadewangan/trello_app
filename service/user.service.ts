import prisma from "../prisma/prisma";
import jwt from "jsonwebtoken";
class users {
     private name : string;
     private email : string;
     private password : string;
 
    constructor(name : string, email : string, password : string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async createUser() {
        try {
            const users = await prisma.users.findFirst({
                where: {
                    email: this.email
                }
            })
            if(users) {
                return "User already exists"
            }
            const user = await prisma.users.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }
            })
            return user;
        } catch (error) {
            console.log(error);
            throw new Error("Error creating user");
        }
    }
    async getUserDetails(userId : string) {
        try{
            const user = await prisma.users.findUnique({
                where: {
                    id: userId
                },
                select:{
                    name: true,
                    email: true,
                    boards: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                        }

                }
                
            }})
            return user;
        }
        catch(error){
            throw new Error("Error fetching user details");
        }
    }
    async login() {
        try {
            const user = await prisma.users.findFirst({
                where: {
                    email: this.email,
                    password: this.password
                },
                select: {id: true}
            })
            if(!user) {
                return "Invalid email or password";
            }
              return user;
        }
        catch (error) {
            throw new Error("Error logging in");
        }
    }

    async getUserByEmail() {
        try {
            const user = await prisma.users.findFirst({
                where: {
                    email: this.email
                }
            })
            return user;
        } catch (error) {
            throw new Error("Error getting user");
        }
    }

    async changeName (id : string, newName : string) {
        try{
            const existingUser = await prisma.users.findFirst({
                where:{
                    id:  id 
                }
                
            })
            if(!existingUser){
            return "No User Found";
            }
            const user = await prisma.users.update({
                where:{
                    id: id
                },
                select: {name: true, email: true},
                data:{
                    name: newName
                }
            })
            return user;

        }
        catch(error){
            throw new Error("Internal Server Error");
        }
    }

    async forgetPassword(newPassword : string) {
        try {
            const user = await prisma.users.update({
                where: {
                    email: this.email
                },
                data: {
                    password: newPassword
                }
            })
            return user;
        } catch (error) {
            throw new Error("Error updating password");
        }
    }

}


export default users;