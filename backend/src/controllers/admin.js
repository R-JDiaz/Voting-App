import AdminService from "../services/admin.js";

const AdminController = {
    async getAll(req, res) {
        const admins = await AdminService.getAll();

        res.status(200).json(admins);
    },

    async getById(req, res) {
        const { id } = req.params;

        const admin = await AdminService.getById(id);

        res.status(200).json(admin);
    },

    async getByUsername(req, res) {
        const { username } = req.params;

        const admin = await AdminService.getByUsername(username);

        res.status(200).json(admin);
    },

    async create(req, res) {
        const data = req.body;

        const newAdmin = await AdminService.create(data);

        res.status(201).json(newAdmin);
    },

    async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        const result = await AdminService.update(id, data);

        res.status(200).json(result);
    },

    async updatePassword(req, res) {
        const { id } = req.params;
        const { password_hash } = req.body;

        const result = await AdminService.updatePassword(id, password_hash);

        res.status(200).json(result);
    },

    async delete(req, res) {
        const { id } = req.params;

        const result = await AdminService.delete(id);

        res.status(200).json(result);
    },

    async updateUserCanCreatePermission(req, res) {
        const { user_id } = req.params;
        const { status } = req.body;

        const result = await AdminService.updateUserCanCreatePermission(user_id, status);

        res.status(200).json(result);
    }
};

export default AdminController;