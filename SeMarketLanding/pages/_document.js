import Document, { Head, Main, NextScript } from 'next/document'

import { GA_TRACKING_ID } from '../lib/gtag'

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <meta
                        name="description"
                        content="Industry Marketplace. Discover how the Sematic Marketplace acts as an integrated hub to enable the Industry 4.0 vision."
                    />
                    <meta name="twitter:card" value="summary" />
                    <meta
                        property="og:title"
                        content="Industry Marketplace. Discover how the Sematic Marketplace acts as an integrated hub to enable the Industry 4.0 vision."
                    />
                    <meta property="og:type" content="video.other" />
                    <meta property="og:url" content="https://coordicide.iota.org" />
                    <meta
                        property="og:image"
                        content="https://coordicide.iota.org/static/coordicide.png"
                    />
                    <meta
                        property="og:description"
                        content="Industry Marketplace. Discover how the Sematic Marketplace acts as an integrated hub to enable the Industry 4.0 vision."
                    />
                    <link rel="stylesheet" href="/_next/static/style.css" />
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                    />
                    {/* <script src="https://www.google.com/recaptcha/api.js" async defer></script> */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}');
`
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
