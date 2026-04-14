import group from "../service/group.service";
import { type Request,type Response } from "express";

export const createGroup = async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = (req as any).user.id;
    const groups = new group(name);
    try {
        const newGroup = await groups.createGroup(userId as string, name);
        res.status(201).json(newGroup);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export const getGroups = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const groups = new group("");
    try {
        const foundGroups = await groups.getGroupsByUserId(userId as string);
        if (!foundGroups) {
            res.status(404).json({ message: "No Groups Found" });
        } else {
            res.status(200).json(foundGroups);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export const deleteGroup = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const groups = new group("");
    try {
        const deletedGroup = await groups.deleteGroup(groupId as string);
        if (!deletedGroup) {
            res.status(404).json({ message: "No Group Found" });
        } else {
            res.status(200).json({ message: "Group Deleted Successfully" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const invitePeople = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    const groups = new group("");
    try {
        const updatedGroup = await groups.invitePeople(userId as string, groupId as string);
        if (!updatedGroup) {
            res.status(404).json({ message: "No Group Found" });
        } else {
            res.status(200).json({ message: "User Invited Successfully" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const removePeople = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    const groups = new group("");
    try {
        const updatedGroup = await groups.removePeople(userId as string, groupId as string);
        if (!updatedGroup) {
            res.status(404).json({ message: "No Group Found" });
        } else {
            res.status(200).json({ message: "User Removed Successfully" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export const getGroupById = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const groups = new group("");
    try {
        const foundGroup = await groups.getGroupById(groupId as string);
        if (!foundGroup) {
            res.status(404).json({ message: "No Group Found" });
        } else {
            res.status(200).json(foundGroup);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }

}

export const acceptInvitation = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = (req as any).user.id;
    const groups = new group("");
    try {
        const updatedGroup = await groups.acceptInvitation(userId as string, groupId as string);
        if (!updatedGroup) {
            res.status(404).json({ message: "No Group Found" });
        } else {
            res.status(200).json({ message: "Invitation Accepted Successfully" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// export const deleteGroupById = async (req: Request, res: Response) => {
//     const { groupId } = req.params;
//     const groups = new group("");
//     try {
//         const deletedGroup = await groups.deleteGroupById(groupId as string);
//         if (!deletedGroup) {
//             res.status(404).json({ message: "No Group Found"
//                 });
//         } else {            res.status(200).json({ message: "Group Deleted Successfully" });
//         }    } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// }

export const leaveGroup = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = (req as any).user.id;
    const groups = new group("");
    try {
        const deletedGroup = await groups.leaveGroup(userId as string, groupId as string);
        if (!deletedGroup) {
            res.status(404).json({ message: "No Group Found" });
        } else {
            res.status(200).json({ message: "Left Group Successfully" });
        }
    }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

