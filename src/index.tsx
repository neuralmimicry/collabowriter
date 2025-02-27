import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Router';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

import { Amplify } from 'aws-amplify';
// import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import config from './aws-exports'
import {HashRouter} from "react-router-dom";
Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
      <HashRouter>
        <Main />
      </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.unregister();
