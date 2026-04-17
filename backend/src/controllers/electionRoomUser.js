import ElectionRoomUserService from "../services/electionRoomUser.js";
import {
    toRoomUserResponseDTO,
    toGetAllRoomUserResponseDTO
} from "../DTOs/electionRoomUser.dto.js";

const ElectionRoomUserController = {
    async getAll(req, res) {
        const users = await ElectionRoomUserService.getAll();

        res.status(200).json(
            toGetAllRoomUserResponseDTO(
                users,
                "Room users retrieved successfully"
            )
        );
    },

    async getById(req, res) {
        const { id } = req.params;

        const user = await ElectionRoomUserService.getById(id);

        res.status(200).json(
            toRoomUserResponseDTO(
                user,
                "Room user retrieved successfully"
            )
        );
    },

    async getByRoomId(req, res) {
        const { roomId } = req.params;

        const users = await ElectionRoomUserService.getByRoomId(roomId);

        res.status(200).json(
            toGetAllRoomUserResponseDTO(
                users,
                "Room users retrieved successfully"
            )
        );
    },

    async getByUserId(req, res) {
        const { userId } = req.params;

        const users = await ElectionRoomUserService.getByUserId(userId);

        res.status(200).json(
            toGetAllRoomUserResponseDTO(
                users,
                "User rooms retrieved successfully"
            )
        );
    },

    async getByElectionId(req, res) {
        const { electionId } = req.params;

        const users = await ElectionRoomUserService.getByElectionId(electionId);

        res.status(200).json(
            toGetAllRoomUserResponseDTO(
                users,
                "User rooms retrieved successfully"
            )
        );
    },
    
    async join(req, res) {
        const user = await ElectionRoomUserService.join(req.body);

        res.status(201).json(
            toRoomUserResponseDTO(
                user,
                "Joined room successfully"
            )
        );
    },

    async update(req, res) {
        const { id } = req.params;

        await ElectionRoomUserService.update(id, req.body);

        res.status(200).json(
            toRoomUserResponseDTO(
                null,
                "Room user updated successfully"
            )
        );
    },

    async delete(req, res) {
        const { id } = req.params;

        await ElectionRoomUserService.delete(id);

        res.status(200).json(
            toRoomUserResponseDTO(
                null,
                "Room user removed successfully"
            )
        );
    }
};

export default ElectionRoomUserController;