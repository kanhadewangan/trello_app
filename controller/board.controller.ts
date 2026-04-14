import { request, type Request, type Response } from 'express';
import boards from '../service/board.service';

export const createBoard = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const userId = (req as any).user.id;
    const board = new boards(title, description);
    try {
        const newBoard = await board.createBoard(userId as string);
        res.status(201).json(newBoard);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getBoards = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const board = new boards("", "");
    try {
        const foundBoards = await board.getBoards(userId as string);
        if (!foundBoards) {
            res.status(404).json({ message: "No Boards Found" });
        } else {
            res.status(200).json(foundBoards);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export const deleteBoard = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const board = new boards("", "");
    try {
        const deletedBoard = await board.deleteBoard(boardId as string);
        if (!deletedBoard) {
            res.status(404).json({ message: "No Board Found" });
        } else {
            res.status(200).json({ message: "Board Deleted Successfully" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getBoardById = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const board = new boards("", "");
    try {
        const foundBoard = await board.getboardById(boardId as string);
        if (!foundBoard) {
            res.status(404).json({ message: "No Board Found" });
        } else {
            res.status(200).json(foundBoard);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }

}
export const getAllBoard = async (req: Request, res: Response) => {
    const board = new boards("", "");
    try {
        const userId = (req as any).user.id;
        const foundBoards = await board.getAllBoard(userId);
        if (!foundBoards) {
            res.status(404).json({ message: "No Boards Found" });
        } else {
            res.status(200).json(foundBoards);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}