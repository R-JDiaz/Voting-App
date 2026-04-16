import ElectionRoomService from "../services/electionRoom.js";

const ElectionRoomController = {
    async getAll(req, res) {
        const rooms = await ElectionRoomService.getAll();

        res.status(200).json({
            success: true,
            message: "Election rooms retrieved successfully",
            data: rooms
        });
    },

    async getById(req, res) {
        const { id } = req.params;

        const room = await ElectionRoomService.getById(id);

        res.status(200).json({
            success: true,
            message: "Election room retrieved successfully",
            data: room
        });
    },

    async getByElectionId(req, res) {
        const { electionId } = req.params;

        const rooms = await ElectionRoomService.getByElectionId(electionId);

        res.status(200).json({
            success: true,
            message: "Election rooms retrieved successfully",
            data: rooms
        });
    },

    async create(req, res) {
        const room = await ElectionRoomService.create(req.body);

        res.status(201).json({
            success: true,
            message: "Election room created successfully",
            data: room
        });
    },

    async update(req, res) {
        const { id } = req.params;

        await ElectionRoomService.update(id, req.body);

        res.status(200).json({
            success: true,
            message: "Election room updated successfully",
            data: null
        });
    },

    async delete(req, res) {
        const { id } = req.params;

        await ElectionRoomService.delete(id);

        res.status(200).json({
            success: true,
            message: "Election room deleted successfully",
            data: null
        });
    }
};

export default ElectionRoomController;