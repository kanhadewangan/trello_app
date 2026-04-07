import {type Request, type Response} from 'express';
import cards from '../service/card.service';

export const createCard = async (req : Request, res : Response) => {
    const {title, description} = req.body;
    const listId = req.params.listId;
    const card = new cards(title, description, 0);
    try {
        const newCard = await card.createCard(listId as string);
        res.status(201).json(newCard);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const getCards = async (req : Request, res : Response) => {
    const listId = req.params.listId;
    const card = new cards("","",0);
    try {
        const foundCards = await card.getCards(listId as string);           

        if(!foundCards) {
            res.status(404).json({message: "No Cards Found"});
        } else {
            res.status(200).json(foundCards);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const updateCard = async (req : Request, res : Response) => {
    const {cardId} = req.params;
    const {newTitle, newDescription} = req.body;
    const card = new cards("","",0);
    try {
        const updatedCard = await card.updateCard(cardId as string, newTitle, newDescription);
        if(updatedCard === "No Card Found") {
            res.status(404).json({message: "No Card Found"});
        } else {
            res.status(200).json(updatedCard);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const deleteCard = async (req : Request, res : Response) => {
    const {cardId} = req.params;
    const card = new cards("","",0);
    try {
        const deletedCard = await card.deleteCard(cardId as string);
        if(deletedCard === "No Card Found") {
            res.status(404).json({message: "No Card Found"});
        } else {
            res.status(200).json({message: "Card Deleted Successfully"});
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}