import { ClientBuilder } from '@iota/client';
import { provider } from '../config.json';

export const sendMessage = async (payload, tag) => {
    try {
        const message = encodeURI(JSON.stringify(payload));
        return await publish(message, tag); // previously: bundle[0].hash
    } catch (error) {
        console.error('sendMessage', error);
    }
    
};

const publish = async (data, tag) => {
    const client = new ClientBuilder()
        .node(provider)
        .build();

    try {
        const msgSender = client
            .message()
            .index(tag)
            .accountIndex(0)
            .data(data);

        const msg = await msgSender.submit();
        return msg.messageId;
    } catch (e) {
        throw new Error(`Could not establish a connection to the node ${e}`);
    }
};
