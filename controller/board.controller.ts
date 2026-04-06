import {type Request, type Response} from 'express';
import boards from '../service/board.service';

export const createBoard = async (req : Request, res : Response) => {
    const {title, description} = req.body;
    const userId = req.params.userId;
    const board = new boards(title, description);
    try {
        const newBoard = await board.createBoard(userId as string);
        res.status(201).json(newBoard);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

export const getBoards = async (req : Request, res : Response) => {
    const userId = req.params.userId;
    const board = new boards("","");
    try {
        const foundBoards = await board.getBoards(userId as string);
        if(!foundBoards) {
            res.status(404).json({message: "No Boards Found"});
        } else {
            res.status(200).json(foundBoards);
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}
 export const deleteBoard = async (req : Request, res : Response) => {
    const {boardId} = req.params;
    const board = new boards("","");
    try {
        const deletedBoard = await board.deleteBoard(boardId as string);
        if(!deletedBoard) {
            res.status(404).json({message: "No Board Found"});
        } else {
            res.status(200).json({message: "Board Deleted Successfully"});
        }
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}