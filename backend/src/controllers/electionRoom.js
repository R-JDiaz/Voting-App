import ElectionRoomService from "../services/electionRoom.js";
import {
    toElectionRoomResponseDTO,
    toGetAllElectionRoomResponseDTO
} from "../DTOs/electionRoom.dto.js";

const ElectionRoomController = {
    async getAll(req, res) {
        const rooms = await ElectionRoomService.getAll();

        res.status(200).json(
            toGetAllElectionRoomResponseDTO(
                rooms,
                "Election rooms retrieved successfully"
            )
        );
    },

    async getById(req, res) {
        const { id } = req.params;

        const room = await ElectionRoomService.getById(id);

        res.status(200).json(
            toElectionRoomResponseDTO(
                room,
                "Election room retrieved successfully"
            )
        );
    },

    async getByElectionId(req, res) {
        const { electionId } = req.params;

        const rooms = await ElectionRoomService.getByElectionId(electionId);

        res.status(200).json(
            toGetAllElectionRoomResponseDTO(
                rooms,
                "Election rooms retrieved successfully"
            )
        );
    },

    async create(req, res) {
        const room = await ElectionRoomService.create(req.body);

        res.status(201).json(
            toElectionRoomResponseDTO(
                room,
                "Election room created successfully"
            )
        );
    },

    async update(req, res) {
        const { id } = req.params;

        await ElectionRoomService.update(id, req.body);

        res.status(200).json(
            toElectionRoomResponseDTO(
                null,
                "Election room updated successfully"
            )
        );
    },

    async delete(req, res) {
        const { id } = req.params;

        await ElectionRoomService.delete(id);

        res.status(200).json(
            toElectionRoomResponseDTO(
                null,
                "Election room deleted successfully"
            )
        );
    }
};

export default ElectionRoomController;