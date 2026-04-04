import AuthService from "../services/auth.js";

const AuthController = {
    async register(req, res) {
        const data = req.body;

        const result = await AuthService.register(data);
        res.status(201).json(result);
    },

    async login(req, res) {
        const { identifier, password } = req.body;

        const result = await AuthService.login(identifier, password);
        res.status(200).json(result);
    }
}

export default AuthController;
