import { authResponseDTO } from "../DTOs/auth.dto.js";
import AuthService from "../services/auth.js";

const AuthController = {
    async register(req, res) {
        const data = req.body;

        const result = await AuthService.register(data);
        res.status(201).json(
            authResponseDTO({
                user: result.user, 
                token: result.token, 
                message: "Registration successful"
            })
        );
    },

    async login(req, res) {
        const { identifier, password } = req.body;

        const result = await AuthService.login(identifier, password);
        console.log(result.user);
        res.status(200).json(
            authResponseDTO({ 
                user: result.user, 
                token: result.token,
                message: "Login successful" 
            })
        );
    }
}

export default AuthController;
