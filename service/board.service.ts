import prisma from "../prisma/prisma";
class boards{
    private title : string;
    private description : string

  constructor(title : string, description : string) {
    this.title = title;
    this.description = description;
  }
   async createBoard(userId:string) {

    const createBoard = await prisma.board.create({
        data: {
            title: this.title,
            description: this.description,
            userId: userId
        }
    })
    return createBoard;
   }
    async getBoards(userId:string) {
        const boards = await prisma.board.findMany({
            where: {
                userId: userId
            }
        })
        return boards;
    }
}


export default boards;