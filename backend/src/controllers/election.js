import ElectionService from "../services/election.js";
import {
    toFullElectionResponseDTO,
    toElectionResponseDTO,
    toGetAllElectionResponseDTO,
    toGetElectionByCodeResponseDTO
} from "../DTOs/election.dto.js";

const ElectionController = {
    async getAll(req, res, next) {
        const elections = await ElectionService.getAll();
        
        res.status(200).json(
            toGetAllElectionResponseDTO(
                elections,
                "Election successfully returned"
            )
        );
    },

    async getById(req, res, next) {
        const { id } = req.params;

        const election = await ElectionService.getById(id);

        res.status(200).json(
            toElectionResponseDTO(
                election,
                "Election successfully returned"
            )
        );
    },

    async getByCode(req, res, next) {
        const { code } = req.params;

        const election = await ElectionService.getByCode(code);

        res.status(200).json(
            toGetElectionByCodeResponseDTO(
                election,
                "Election successfully returned"
            )
        );
    },

    async getFullById(req, res, next) {
        const { id } = req.params;
        const user_id = req.user.id;

        const election = await ElectionService.getFullById(id, user_id);

        res.status(200).json(
            toFullElectionResponseDTO(
                election,
                "Election successfully returned"
            )
        );
    },

    async create(req, res, next) {
        const election = await ElectionService.create(req.body);
        
        console.log(election);
        res.status(201).json(
            toElectionResponseDTO(
                election,
                "Election created successfully"
            )
        );
    },

    async update(req, res, next) {
        const { id } = req.params;

        await ElectionService.update(id, req.body);

        res.status(200).json(
            toElectionResponseDTO(
                null,
                "Election updated successfully"
            )
        );
    },

    async delete(req, res, next) {
        const { id } = req.params;

        await ElectionService.delete(id);

        res.status(200).json(
            toElectionResponseDTO(
                null,
                "Election deleted successfully"
            )
        );
    }
};

export default ElectionController;