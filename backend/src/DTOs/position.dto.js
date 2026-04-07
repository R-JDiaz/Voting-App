export const publicPositionDTO = (position) => {
    if (!position) return null;

    return {
        id: position.id,
        title: position.title,
        electionId: position.election_id
    };
};

export const toPositionResponseDTO = ( position, message = "Success" ) => {
    return {
        success: true,
        message,
        data: publicPositionDTO(position) || null
    };
};

export const toGetAllPositionsResponseDTO = ( positions, message = "Success" ) => {
    return {
        success: true,
        message,
        data: positions || []
    };
};