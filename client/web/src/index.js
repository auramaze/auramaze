import React from 'react';
import ReactDOM from 'react-dom';
import {CookiesProvider} from 'react-cookie';
import './index.css';
import App from './app';
import registerServiceWorker from './registerServiceWorker';
import {addLocaleData} from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_zh from 'react-intl/locale-data/zh';

addLocaleData([...locale_en, ...locale_zh]);

ReactDOM.render(<CookiesProvider><App/></CookiesProvider>, document.getElementById('root'));
registerServiceWorker();
