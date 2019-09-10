import React from 'react';

export default () => (
    <footer id="footer">
        <a 
            target="_blank"
            rel="noopener noreferrer"
            href="https://iota.org/"
        >
            <img
            src="/static/logotypes/logo-footer.png"
            srcSet="/static/logotypes/logo-footer@2x.png 2x"
            alt="IOTA logotype"
            />
        </a>
        <div className="footer-links">
            <a 
                target="_blank"
                rel="noopener noreferrer"
                href="https://iota.org/"
            >
              iota.org
            </a>
            <a 
                target="_blank"
                rel="noopener noreferrer"
                href="https://blog.iota.org/"
            >
              blog.iota.org
            </a>
            <a 
                target="_blank"
                rel="noopener noreferrer"
                href="https://ecosystem.iota.org/"
            >
              ecosystem.iota.org
            </a>
            <a 
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.iota.org/"
            >
              docs.iota.org
            </a>
        </div>
        <p>
            Disclaimer: This IOTA Industry Marketplace runs on the IOTA devnet.
            Participants can choose to make their data available for free to other marketplace
            participants or to offer it for fictional "sales" in IOTA devnet tokens. No real world
            payments or other real world financial consequences will result from this experiment.
            All data being contributed to this proof of concept is either non-sensitive data of
            which the participants are the authorized owners and/or is publicly available data which
            the participants may freely choose to share. Participation in the IOTA Industry Marketplace
            takes place on a voluntary, non-contractual basis. Participants may choose to
            discontinue their participation at any time.
        </p>
        <p className="copy">© 2019 IOTA Foundation. All rights reserved.</p>
    </footer>
);
