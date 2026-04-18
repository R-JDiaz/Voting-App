export const publicFullElectionDTO = (election) => {
    if (!election) return null;

    return {
        id: election.id,
        title: election.title,
        description: election.description,
        startDate: election.start_date,
        endDate: election.end_date,
        status: election.status,
        positions: election.positions?.map(position => ({
            id: position.id,
            title: position.title,
            candidates: position.candidates?.map(candidate => ({
                id: candidate.id,
                name: candidate.name
            }))
        })) || []
    };
}

export const publicElectionDTO = (election) => {
    if (!election) return null;

    return {
        id: election.id ?? null,
        title: election.title ?? null,
        description: election.description ?? null,
        startDate: election.start_date ?? null,
        endDate: election.end_date ?? null,
        status: election.status ?? null
    }
}

export const toFullElectionResponseDTO = ( election, message = "Success") => {
        return {
        success: true,
        message,
        data: publicFullElectionDTO(election)|| null
    }        
}

export const toGetAllElectionResponseDTO = ( election, message = "Success") => {
        return {
        success: true,
        message,
        data: election || null
    }        
}

export const toElectionResponseDTO = (election, message = "Success") => {
        return {
        success: true,
        message,
        data: publicElectionDTO(election) || null
    }        
}

export const toGetElectionByCodeResponseDTO = (election, message = "Success") => {
        return {
        success: true,
        message,
        data: {
            id: election.id,
            requiredPassword: Boolean(election.password_hash)
        }
    }        
}