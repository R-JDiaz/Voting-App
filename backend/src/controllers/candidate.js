import CandidateService from "../services/candidate.js";

const CandidateController = {
    async getAllByPositionId(req, res) {
        const { position_id } = req.params;

        const candidates = await CandidateService.getAllByPositionId(position_id);

        res.status(200).json(candidates);
    },

    async getById(req, res) {
        const { id } = req.params;

        const candidate = await CandidateService.getById(id);

        res.status(200).json(candidate);
    },

    async create(req, res) {
        const data = req.body;

        const newCandidate = await CandidateService.create(data);

        res.status(201).json(newCandidate);
    },

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        const result = await CandidateService.update(id, data);

        res.status(200).json({
            message: "Candidate updated successfully",
            affectedRows: result
        });
    },

    async delete(req, res) {
        const { id } = req.params;

        const result = await CandidateService.delete(id);

        res.status(200).json({
            message: "Candidate deleted successfully",
            affectedRows: result
        });
    }
};

export default CandidateController;