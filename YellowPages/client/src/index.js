import { RouterScrollTop } from 'iota-react-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './index.scss';

ReactDOM.render(
    <BrowserRouter>
        <React.Fragment>
            <RouterScrollTop />
            <App />
        </React.Fragment>
    </BrowserRouter>,
    document.getElementById('root')
);
