import UserService from "../services/user.js";

const UserController = {
    async getAll(req, res) {
        const users = await UserService.getAll();

        res.status(200).json(users);
    },

    async getById(req, res) {
        const { id } = req.params;

        const user = await UserService.getById(id);

        res.status(200).json(user);
    },

    async getByEmail(req, res) {
        const { email } = req.params;

        const user = await UserService.getByEmail(email);

        res.status(200).json(user);
    },

    async create(req, res) {
        const data = req.body;

        const newUser = await UserService.create(data);

        res.status(201).json(newUser);
    },

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        const result = await UserService.update(id, data);

        res.status(200).json(result);
    },

    async updatePassword(req, res) {
        const { id } = req.params;
        const { password_hash } = req.body;

        const result = await UserService.updatePassword(id, password_hash);

        res.status(200).json(result);
    },

    async delete(req, res) {
        const { id } = req.params;

        const result = await UserService.delete(id);

        res.status(200).json(result);
    }
};

export default UserController;