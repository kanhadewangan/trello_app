import {type Request, type Response} from 'express';
import lists from '../service/list.service';

export const createList = async (req : Request, res : Response) => {
    const {title} = req.body;
    const {boardId} = req.params;
    const list = new lists(title, 0);
    try {
        const newList = await list.createList(boardId as string);
        res.status(201).json(newList);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}


export const getLists = async (req : Request, res : Response) => {
    const {boardId} = req.params;
    const list = new lists("", 0);
    try {
        const foundLists = await list.getLists(boardId as string);
        if(!foundLists) {
            res.status(404).json({message: "No Lists Found"});
        } else {
            res.status(200).json(foundLists);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const updateList = async (req : Request, res : Response) => {
    const {listId} = req.params;
    const {newTitle} = req.body;
    const list = new lists("", 0);
    try {
        const updatedList = await list.updateList(listId as string, newTitle);
        if(updatedList === "No List Found") {
            res.status(404).json({message: "No List Found"});
        } else {
            res.status(200).json(updatedList);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const updatePosition = async (req : Request, res : Response) => {
    const {listId} = req.params;
    const {newPosition} = req.body;
    const list = new lists("", 0);
    try {
        const updatedList = await list.updatePosition(listId as string, newPosition);
        if(updatedList === "No List Found") {
            res.status(404).json({message: "No List Found"});
        } else {
            res.status(200).json(updatedList);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const deleteList = async (req : Request, res : Response) => {
    const {listId} = req.params;
    const list = new lists("", 0);
    try {
        const deletedList = await list.deleteList(listId as string);
        if(deletedList === "No List Found") {
            res.status(404).json({message: "No List Found"});
        }
        else {
            res.status(200).json({message: "List Deleted Successfully"});
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const getListsByBoardId = async (req : Request, res : Response) => {
    const {boardId} = req.params;
    const list = new lists("", 0);
    try {
        const foundLists = await list.getListsByBoardId(boardId as string);
        if(!foundLists) {
            res.status(404).json({message: "No Lists Found"});
        } else {
            res.status(200).json(foundLists);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const getListById = async (req : Request, res : Response) => {
    const {listId} = req.params;
    const list = new lists("", 0);
    try {
        const foundList = await list.getListById(listId as string);
        if(!foundList) {
            res.status(404).json({message: "No List Found"});
        } else {
            res.status(200).json(foundList);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}


export const getAllList = async (req : Request, res : Response) => {
    const list = new lists("", 0);
    try {
        const userId = (req as any).user.id;
        const foundLists = await list.getAllList(userId);
        if(!foundLists) {
            res.status(404).json({message: "No Lists Found"});
        } else {
            res.status(200).json(foundLists);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}
