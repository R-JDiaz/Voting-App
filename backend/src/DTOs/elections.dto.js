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
};

export const publicElectionDTO = (election) => {
    if (!election) return null;

    return {
        id: election.id,
        title: election.title,
        description: election.description,
        startDate: election.start_date,
        endDate: election.end_date,
        status: election.status
    };
};