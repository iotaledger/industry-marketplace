const mailgun = require('mailgun-js');
const { getEmailSettings } = require('./firebase');
// const { checkRecaptcha } = require('./helpers');

const getDoubleOptIn = (packet, emailSettings) => {
    const { emailRecepient } = emailSettings;
    const { newsletter } = packet;
    if (newsletter.toString() === 'true') {
        //Add to pending list and send out confirmation email 
        axios.post('https://newsletter-api.iota.org/api/signup',
            {
                email: emailRecepient,
                projectID: 'IMP'
            },
            (error) => {
                if (error) {
                    console.log('DoubleOptIn error', error);
                }
            });
    }
};

const mailgunSendEmail = async (packet: any, emailSettings: any) => {
    const {
        apiKey, domain, emailRecipient, emailBcc, emailReplyTo, emailSender, emailList,
    } = emailSettings;
    const mg = mailgun({ apiKey, domain });
    const result: any = {}; 

    const messapeP = new Promise((resolve, reject) => {
        mg.messages().send({
            from: `Industry Marketplace <${emailSender}>`,
            to: emailRecipient,
            bcc: emailBcc,
            'h:Reply-To': packet.email,
            subject: 'Industry Marketplace Form Inquiry',
            html: `<div>
                <p><strong>Name: </strong>   ${packet.name}</p>
                </div>
                <div>
                <p><strong>Email: </strong>   ${packet.email}</p>
                </div>
                <div>
                <p><strong>Message:</strong></p><p>${packet.message}</p>
                </div>
                <div>
                <p><strong>Newsletter: </strong>   ${packet.newsletter}</p>
                </div>`,
        }, (error: any, response: any) => {
            if (error) {
                console.error('Email callback error', error);
                result.emailError = error;
                reject(error);
            }
            result.email = response;
            resolve(response);
        });
    });

    let messapeListP;
    if (packet.newsletter.toString() === 'true') {

        //Get opt-in 
        getDoubleOptIn(packet, emailSettings)

        const list = mg.lists(emailList);
        const user = {
            subscribed: true,
            address: packet.email,
            name: packet.name
        };

        messapeListP = new Promise((resolve) => {
            list.members().create(user, (error: any, response: any) => {
                if (error) {
                    console.error('Email members callback error', error);
                    result.emailListError = error;
                    resolve(error);
                }
                result.emailList = response;
                resolve(response);
            });
        });
    } else {
        messapeListP = Promise.resolve();
    }

    const replyP = new Promise((resolve, reject) => {
        if (packet.newsletter.toString() === 'false') {
            mg.messages().send({
                from: `Industry Marketplace <${emailSender}>`,
                to: packet.email,
                'h:Reply-To': emailReplyTo,
                subject: 'Message Received - Industry Marketplace',
                html: `Hi
                <br/>
                <br/>
                Many thanks for your interest in the IOTA Industry Marketplace.
                <br/>
                <br/>

                We do our best to review all messages and get in touch with prioritized use cases and organizations based on their ability to contribute and impact the development of this proof of concept.
                <br/>
                <br/>

                The whole IOTA team thanks you again for your interest and is looking forward to collaborating with you.
                <br/>
                <br/>

                IOTA Foundation
                <br/>
                www.iota.org`,
            }, (error: any, response: any) => {
                if (error) {
                    console.error('Email automatic reply error', error);
                    result.emailReplyError = error;
                    reject(error);
                }
                result.emailReply = response;
                resolve(response);
            });
        } else {
            resolve();
        }
    });
    return Promise.all([messapeP, messapeListP, replyP]).then(() => result);
};

exports.sendEmail = async (packet: any) => {
    const emailSettings = await getEmailSettings();
    // Check Recaptcha
        //   const recaptcha = await checkRecaptcha(packet.captcha, emailSettings);
        //   if (!recaptcha || !recaptcha.success) {
        //     console.log('sendEmail failed. Recaptcha is incorrect. ', recaptcha['error-codes']);
        //     return 'Malformed Request';
        //   }

    // Send message
    const result = await mailgunSendEmail(packet, emailSettings);
    return result;
};
