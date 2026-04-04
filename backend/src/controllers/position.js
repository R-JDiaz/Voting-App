import PositionService from "../services/position.js";

const PositionController = {
    async getAllByElectionId(req, res) {
        const { election_id } = req.params;

        const positions = await PositionService.getAllByElectionId(election_id);

        res.status(200).json(positions);
    },

    async getByPositionId(req, res) {
        const { id } = req.params;

        const position = await PositionService.getByPositionId(id);

        res.status(200).json(position);
    },

    async create(req, res) {
        const data = req.body;

        const newPosition = await PositionService.create(data);

        res.status(201).json(newPosition);
    },

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        const result = await PositionService.update(id, data);

        res.status(200).json(result);
    },

    async delete(req, res) {
        const { id } = req.params;

        const result = await PositionService.delete(id);

        res.status(200).json({
            message: "Position deleted successfully",
            ...result
        });
    }
};

export default PositionController;