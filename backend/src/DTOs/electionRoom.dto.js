export const publicElectionRoomDTO = (room) => {
    if (!room) return null;

    return {
        id: room.id,
        electionId: room.election_id,
        creatorId: room.creator_id,
        isPublic: room.is_public,
        roomCode: room.room_code,
        createdAt: room.created_at,
        updatedAt: room.updated_at
    };
};

export const toElectionRoomResponseDTO = (room, message = "Success") => {
    return {
        success: true,
        message,
        data: publicElectionRoomDTO(room)
    };
};

export const toGetAllElectionRoomResponseDTO = (rooms, message = "Success") => {
    return {
        success: true,
        message,
        data: rooms?.map(publicElectionRoomDTO) || []
    };
};