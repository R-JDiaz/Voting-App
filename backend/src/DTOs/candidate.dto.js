export const publicCandidateDTO = (candidate) => {
    if (!candidate) return null;

    return {
        id: candidate.id,
        name: candidate.name,
        positionId: candidate.position_id
    };
};

export const toCandidateResponseDTO = ( candidate, message = "Success" ) => {
    return {
        success: true,
        message,
        data: publicCandidateDTO(candidate) || null
    };
};

export const toGetAllCandidatesResponseDTO = ( candidates, message = "Success" ) => {
    return {
        success: true,
        message,
        data: candidates || []
    };
};