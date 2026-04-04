import ElectionService from "../services/election.js";

const ElectionController = {
    async getAll(req, res, next) {
        try {
            const elections = await ElectionService.getAll();
            res.status(200).json(elections);
        } catch (err) {
            next(err);
        }
    },

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const election = await ElectionService.getById(id);

            res.status(200).json(election);
        } catch (err) {
            next(err);
        }
    },

    async create(req, res, next) {
        try {
            const election = await ElectionService.create(req.body);

            res.status(201).json({
                message: "Election created successfully",
                data: election
            });
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const result = await ElectionService.update(id, req.body);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const result = await ElectionService.delete(id);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
};

export default ElectionController;