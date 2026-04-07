import CandidateService from "../services/candidate.js";
import {
    toCandidateResponseDTO,
    toGetAllCandidatesResponseDTO
} from "../DTOs/candidate.dto.js";

const CandidateController = {
    async getAllByPositionId(req, res) {
        const { position_id } = req.params;

        const candidates = await CandidateService.getAllByPositionId(position_id);

        res.status(200).json(
            toGetAllCandidatesResponseDTO(
                candidates,
                "Candidates successfully returned"
            )
        );
    },

    async getById(req, res) {
        const { id } = req.params;

        const candidate = await CandidateService.getById(id);

        res.status(200).json(
            toCandidateResponseDTO(
                candidate,
                "Candidate successfully returned"
            )
        );
    },

    async create(req, res) {
        const data = req.body;

        const candidate = await CandidateService.create(data);

        res.status(201).json(
            toCandidateResponseDTO(
                candidate,
                "Candidate successfully created"
            )
        );
    },

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        await CandidateService.update(id, data);

        res.status(200).json(
            toCandidateResponseDTO(
                null,
                "Candidate successfully updated"
            )
        );
    },

    async delete(req, res) {
        const { id } = req.params;

        await CandidateService.delete(id);

        res.status(200).json(
            toCandidateResponseDTO(
                null,
                "Candidate successfully deleted"
            )
        );
    }
};

export default CandidateController;