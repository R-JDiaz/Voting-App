import { publicUserDTO } from "./user.dto.js";
import { publicElectionsDTO } from "./elections.dto.js";

export const authResponseDTO = ({ user, token, message = "Success" }) => {
    return {
        success: true,
        message,
        data: {
            user: publicUserDTO(user),
            token
        }
    };
};

export const electionResponseDTO = ({ election, message = "Success"}) => {
        return {
        success: true,
        message,
        data: {
            user: publicElectionsDTO(election)
        }
    }        
}