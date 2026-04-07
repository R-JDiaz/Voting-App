import { publicUserDTO } from "./user.dto.js";

export const authResponseDTO = ({ user, token, message = "Success" }) => {
    return {
        success: true,
        message,
        data: {
            user: publicUserDTO(user),
            token
        }
    }
}
