import ElectionService from "../services/election.js";

const ElectionController = {
    async getAll(req, res, next) {
        const elections = await ElectionService.getAll();
        res.status(200).json(elections);
    },

    async getById(req, res, next) {
        const { id } = req.params;

        const election = await ElectionService.getById(id);

        res.status(200).json(election);
    },

    async create(req, res, next) {
        const election = await ElectionService.create(req.body);

        res.status(201).json({
            message: "Election created successfully",
            data: election
        });
    },

    async update(req, res, next) {
        const { id } = req.params;

        const result = await ElectionService.update(id, req.body);

        res.status(200).json(result);
    },

    async delete(req, res, next) {
        const { id } = req.params;

        const result = await ElectionService.delete(id);

        res.status(200).json(result);
    }
};

export default ElectionController;