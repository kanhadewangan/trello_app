import { type Request, type Response } from "express";
import TestDataService from "../service/test-data.service";

const testDataService = new TestDataService();

export const getTestDataPreview = async (req: Request, res: Response) => {
    try {
        const options = {
            usersCount: Number(req.query.usersCount),
            boardsPerUser: Number(req.query.boardsPerUser),
            listsPerBoard: Number(req.query.listsPerBoard),
            cardsPerList: Number(req.query.cardsPerList),
        };

        const preview = testDataService.generatePreviewData(options);
        res.status(200).json(preview);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const seedTestData = async (req: Request, res: Response) => {
    try {
        const { usersCount, boardsPerUser, listsPerBoard, cardsPerList } = req.body;
        const result = await testDataService.seedTestData({
            usersCount,
            boardsPerUser,
            listsPerBoard,
            cardsPerList,
        });

        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
