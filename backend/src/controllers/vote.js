import VoteService from "../services/vote.js";

const VoteController = {
    async getAllByElectionId(req, res) {
        const { election_id } = req.params;

        const votes = await VoteService.getAllByElectionId(election_id);

        res.status(200).json(votes);
    },

    async getById(req, res) {
        const { id } = req.params;

        const vote = await VoteService.getById(id);

        res.status(200).json(vote);
    },

    async getByVoterId(req, res) {
        const { voter_id } = req.params;

        const votes = await VoteService.getByVoterId(voter_id);

        res.status(200).json(votes);
    },

    async create(req, res) {
        const data = req.body;

        const newVote = await VoteService.create(data);

        res.status(201).json(newVote);
    },

    async delete(req, res) {
        const { id } = req.params;

        const result = await VoteService.delete(id);

        res.status(200).json(result);
    }
};

export default VoteController;