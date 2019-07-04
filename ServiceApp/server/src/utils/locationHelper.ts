export const getLocationFromMessage = message => {
    return message.frame && message.frame.location ? message.frame.location : null;
};
