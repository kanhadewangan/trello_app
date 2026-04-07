import prisma from "../prisma/prisma";
class boards {
    private title: string;
    private description: string

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
    async createBoard(userId: string) {

        const createBoard = await prisma.board.create({
            data: {
                title: this.title,
                description: this.description,
                userId: userId
            }
        })
        return createBoard;
    }
    async getBoards(userId: string) {
        const boards = await prisma.board.findMany({
            where: {
                userId: userId
            }
        })
        return boards;
    }
    async deleteBoard(boardId: string) {
        const deletedBoard = await prisma.board.delete({
            where: {
                id: boardId
            }
        })
        return deletedBoard;
    }
    async getboardById(boardId: string) {
        try {
            const board = await prisma.board.findUnique({
                where: {
                    id: boardId
                }
            })
            return board;
        } catch (error) {
            throw new Error(`Error fetching board with ID ${boardId}: ${(error as Error).message}`);
        }
    }
    async getAllBoard() {
        const boards = await prisma.board.findMany();
        return boards;
    }
}


export default boards;