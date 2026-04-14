import prisma from "../prisma/prisma"
class group {
    name:string;
    constructor(name:string){
        
        this.name = name;
    }
    createGroup = async (userId:string, groupName:string) => {
        try {
            const newGroup = await prisma.groups.create({
                data: {
                    name: groupName,
                    members: {
                        connect: { id: userId }
                    }
                }
            });
            return newGroup;
        } catch (error) {
            throw error;
        }
    }
    getGroupById = async (groupId:string) => {
        const group = await prisma.groups.findUnique({
            where: {
                id: groupId
            },
            include: {
                members: true
            }
        });
        return group;
    }



     getGroupsByUserId = async (userId:string) => {
        try {
            const groups = await prisma.groups.findMany({
                where: {
                    members: {
                        some: {
                            id: userId
                        }
                    }
                },
                include: {
                    members: true
                }
            });
            return groups;  
        } catch (error) {
            throw error;
        }
    }
    deleteGroup = async (groupId:string) => {
        try {
            const deletedGroup = await prisma.groups.delete({
                where: {
                    id: groupId
                }
            });
            return deletedGroup;
        }
        catch (error) {
            throw error;
        }
    }
  async  invitePeople(userId:string, groupId:string) {
        try {
            const group = prisma.groups.findUnique({
                where: {
                    id: groupId
                },
                include: {
                    members: true
                }
            });
            return group;
        } catch (error) {
            throw error;
        }
    }
    async  acceptInvitation(userId:string, groupId:string) {
        try {
            const updatedGroup = await prisma.groups.update({
                where: {
                    id: groupId
                },
                data: {
                    members: {
                        connect: { id: userId }
                    }
                },
                include: {
                    members: true
                }
            });
            return updatedGroup;    

        }
        catch (error) {
            throw error;
        }
    }
    async removePeople(userId:string, groupId:string){
        const group = await prisma.groups.findUnique({
            where:{
                id: groupId
            },
            include: {
                members: true
             }
        });
        if(!group) {
            throw new Error("Group not found");
        }
        const isMember = group.members.some(member => member.id === userId);
        if(!isMember) {
            throw new Error("User is not a member of the group");
        }
        try {
            const updatedGroup = await prisma.groups.update({
                where: {
                    id: groupId
                },
                data: {
                    members: {
                        disconnect: { id: userId }
                    }
                },
                include: {
                    members: true
                }
             });
             return updatedGroup;
            }
            catch (error) {
                throw error;
            }        
    }
    getAllGroup = async (userId:string) => {
        try {
            const groups = await prisma.groups.findMany({
                where: {
                    members: {
                        some: {
                            id: userId
                        }
                    }
                },
                include: {
                    members: true
                }
            });
            return groups;
        }
            catch (error) {
                throw error;
            }
    }

    getAllInvitation = async (userId:string) => {
        const invitations = await prisma.invitation.findMany({
            where: {
                userId: userId,
                groups: {
                    members: {
                        some: {
                            id: userId
                        }
                    }
                }
            },
            include: {
                groups: true,
                users: true
            }
        });
        return invitations;
    }

     async leaveGroup(userId:string, groupId:string) {
        const group = await prisma.groups.findUnique({
            where:{
                id: groupId
            },
            include: {
                members: true
             }
        });
        if(!group) {
            throw new Error("Group not found");
        }
        const isMember = group.members.some(member => member.id === userId);
        if(!isMember) {
            throw new Error("User is not a member of the group");
        }
        try {
            const updatedGroup = await prisma.groups.update({
                where: {
                    id: groupId
                },
                data: {
                    members: {
                        disconnect: { id: userId }
                    }
                },
                include: {
                    members: true
                }
             });
             return updatedGroup;
            }
            catch (error) {
                throw error;
            }        
    }
}



export default group;