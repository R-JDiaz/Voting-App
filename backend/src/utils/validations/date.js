export const validateElectionDates = (start_date, end_date) => {
    let start, end;
    const now = new Date();

    if (start_date) {
        start = new Date(start_date);

        if (start < now) {
            throw new AppError('Start date cannot be in the past', 400);
        }
    }

    if (end_date) {
        end = new Date(end_date);
    }

    if (start && end && start > end) {
        throw new AppError('Start date must be before end date', 400);
    }
};