import prisma from "../prisma/prisma";

type SeedOptions = {
    usersCount?: number;
    boardsPerUser?: number;
    listsPerBoard?: number;
    cardsPerList?: number;
};

type EffectiveSeedOptions = {
    usersCount: number;
    boardsPerUser: number;
    listsPerBoard: number;
    cardsPerList: number;
};

class TestDataService {
    private sanitizeCount(value: number | undefined, fallback: number): number {
        if (typeof value !== "number" || Number.isNaN(value)) {
            return fallback;
        }

        return Math.min(Math.max(Math.floor(value), 1), 10);
    }

    private normalizeOptions(options?: SeedOptions): EffectiveSeedOptions {
        return {
            usersCount: this.sanitizeCount(options?.usersCount, 2),
            boardsPerUser: this.sanitizeCount(options?.boardsPerUser, 2),
            listsPerBoard: this.sanitizeCount(options?.listsPerBoard, 3),
            cardsPerList: this.sanitizeCount(options?.cardsPerList, 4),
        };
    }

    generatePreviewData(options?: SeedOptions) {
        const config = this.normalizeOptions(options);
        const users = [];

        for (let userIndex = 1; userIndex <= config.usersCount; userIndex += 1) {
            const boards = [];

            for (let boardIndex = 1; boardIndex <= config.boardsPerUser; boardIndex += 1) {
                const lists = [];

                for (let listIndex = 1; listIndex <= config.listsPerBoard; listIndex += 1) {
                    const cards = [];

                    for (let cardIndex = 1; cardIndex <= config.cardsPerList; cardIndex += 1) {
                        cards.push({
                            title: `Task ${cardIndex}`,
                            description: `Sample card ${cardIndex} for list ${listIndex}`,
                            position: cardIndex,
                        });
                    }

                    lists.push({
                        title: `List ${listIndex}`,
                        position: listIndex,
                        cards,
                    });
                }

                boards.push({
                    title: `Board ${boardIndex}`,
                    description: `Sample board ${boardIndex} for user ${userIndex}`,
                    lists,
                });
            }

            users.push({
                name: `Test User ${userIndex}`,
                email: `test.user.${userIndex}@example.com`,
                password: "test1234",
                boards,
            });
        }

        return {
            config,
            users,
        };
    }

    async seedTestData(options?: SeedOptions) {
        const config = this.normalizeOptions(options);
        const runStamp = Date.now();
        const createdUsers = [];

        for (let userIndex = 1; userIndex <= config.usersCount; userIndex += 1) {
            const boardCreates = [];

            for (let boardIndex = 1; boardIndex <= config.boardsPerUser; boardIndex += 1) {
                const listCreates = [];

                for (let listIndex = 1; listIndex <= config.listsPerBoard; listIndex += 1) {
                    const cardCreates = [];

                    for (let cardIndex = 1; cardIndex <= config.cardsPerList; cardIndex += 1) {
                        cardCreates.push({
                            title: `Task ${cardIndex}`,
                            description: `Seeded card ${cardIndex} for list ${listIndex}`,
                            position: cardIndex,
                        });
                    }

                    listCreates.push({
                        title: `List ${listIndex}`,
                        position: listIndex,
                        cards: {
                            create: cardCreates,
                        },
                    });
                }

                boardCreates.push({
                    title: `Board ${boardIndex}`,
                    description: `Seeded board ${boardIndex} for user ${userIndex}`,
                    lists: {
                        create: listCreates,
                    },
                });
            }

            const user = await prisma.users.create({
                data: {
                    name: `Test User ${userIndex}`,
                    email: `test.user.${runStamp}.${userIndex}@example.com`,
                    password: "test1234",
                    boards: {
                        create: boardCreates,
                    },
                },
                include: {
                    boards: {
                        include: {
                            lists: {
                                include: {
                                    cards: true,
                                },
                            },
                        },
                    },
                },
            });

            createdUsers.push(user);
        }

        return {
            message: "Fake data seeded successfully",
            config,
            totalUsers: createdUsers.length,
            data: createdUsers,
        };
    }
}

export default TestDataService;
