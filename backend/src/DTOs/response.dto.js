import { publicUserDTO } from "./user.dto.js";
import { publicElectionDTO, publicFullElectionDTO } from "./elections.dto.js";

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

export const toFullElectionResponseDTO = ({ election, message = "Success"}) => {
        return {
        success: true,
        message,
        data: publicFullElectionDTO(election)|| null
    }        
}

export const toGetAllElectionResponseDTO = ({ election, message = "Success"}) => {
        return {
        success: true,
        message,
        data: election || null
    }        
}

export const toElectionResponseDTO = ({ election, message = "Success"}) => {
        return {
        success: true,
        message,
        data: publicElectionDTO(election) || null
    }        
}