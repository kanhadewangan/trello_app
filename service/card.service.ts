import prisma from "../prisma/prisma";
import notificationService from "./notification.service";


class cards {
    private title : string;
    private description : string
    private position : number
    constructor(title: string, description: string, position: number) {
        this.title= title;
        this.description= description;
        this.position= position;
    }

    createCard = async (listId : string) => {
        const card = await prisma.card.create({
            data: {
                title: this.title,
                description: this.description,
                position:this.position,
                listId: listId
            },
            include: {
                list: {
                    include: {
                        board: true
                    }
                }
            }
        })
        
        // TODO: Send notification to board members when card is created
        // await notificationService.notifyCardCreated(...)
        
        return card;
    }

    getCards = async (listId : string) => {
        const cards = await prisma.card.findMany({
            where: {
                listId: listId
            }
        })
        return cards;
    }
    
    updateCard = async (cardId : string, newTitle : string, newDescription : string) => {
        const existingCard = await prisma.card.findFirst({
            where: {
                id: cardId
            }
        })
        if(!existingCard) {
            return "No Card Found";
        }
        const updatedCard = await prisma.card.update({
            where: {
                id: cardId
            },
            data: {
                title: newTitle,
                description: newDescription
            }
        })
        return updatedCard;
    }
    deleteCard = async (cardId : string) => {
        const existingCard = await prisma.card.findFirst({
            where: {
                id: cardId
            }
        })
        if(!existingCard) {
            return "No Card Found";
        }
        await prisma.card.delete({
            where: {
                id: cardId
            }
        })
        return "Card deleted successfully";
    }   
}

export default cards;