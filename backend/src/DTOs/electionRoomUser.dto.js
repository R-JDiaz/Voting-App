export const publicElectionRoomUserDTO = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        electionId: row.election_id, 
        userId: row.user_id,
        isBlocked: row.is_blocked,
        joinedAt: row.joined_at
    };
};

export const toRoomUserResponseDTO = (data, message = "Success") => {
    return {
        success: true,
        message,
        data: publicElectionRoomUserDTO(data)
    };
};

export const toGetAllRoomUserResponseDTO = (data, message = "Success") => {
    return {
        success: true,
        message,
        data: data?.map(publicElectionRoomUserDTO) || []
    };
};