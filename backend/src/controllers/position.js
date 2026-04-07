import PositionService from "../services/position.js";
import {
    toPositionResponseDTO,
    toGetAllPositionsResponseDTO
} from "../DTOs/position.dto.js";

const PositionController = {
    async getAllByElectionId(req, res) {
        const { election_id } = req.params;

        const positions = await PositionService.getAllByElectionId(election_id);

        res.status(200).json(
            toGetAllPositionsResponseDTO(
                positions,
                'Positions successfully returned'
            )
        );
    },

    async getByPositionId(req, res) {
        const { id } = req.params;

        const position = await PositionService.getByPositionId(id);

        res.status(200).json(
            toPositionResponseDTO(
                position,
                "Position successfully returned"
            )
        );
    },

    async create(req, res) {
        const data = req.body;

        const position = await PositionService.create(data);

        res.status(201).json(
            toPositionResponseDTO(
                position,
                "Position successfully created"
            )
        );
    },

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        await PositionService.update(id, data);

        res.status(200).json(
            toPositionResponseDTO(
                null,
                'Position updated successfully'
            )
        );
    },

    async delete(req, res) {
        const { id } = req.params;

        await PositionService.delete(id);

        res.status(200).json(
            toPositionResponseDTO(
                null,
                "Position deleted successfully"
            )
        );
    }
};

export default PositionController;