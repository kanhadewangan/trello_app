import prisma from "../prisma/prisma";

class list {
    title : string;
    postition: number;
    
    constructor(title : string, position : number) {
        this.title = title;
        this.postition = position;
    }
    createList = async (boardId : string) => {
        await prisma.list.create({
            data: {
                title: this.title,
                position: this.postition,
                boardId: boardId
            }
        })
        return "List created successfully";
    }
    getLists = async (boardId : string) => {
        const lists = await prisma.list.findMany({
            where: {
                boardId: boardId
            }
        })
        return lists;
    }

    updateList = async (listId : string, newTitle : string) => {
        const existingList = await prisma.list.findFirst({
            where: {
                id: listId
            }
        })
        if(!existingList) {
            return "No List Found";
        }
        const updatedList = await prisma.list.update({
            where: {
                id: listId
            },
            data: {
                title: newTitle
            }
        })
        return updatedList;
    }

    updatePosition = async (listId : string, newPosition : number) => {
        const existingList = await prisma.list.findFirst({
            where: {
                id: listId
            }
        })
        if(!existingList) {
            return "No List Found";
        }
        const updatedList = await prisma.list.update({
            where: {
                id: listId
            },
            data: {
                position: newPosition
            }
        })
        return updatedList;
    }
}

export default list;