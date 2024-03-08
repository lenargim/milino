import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.sass'
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from "react-router-dom";
import {store} from "./store/store";
import {Provider} from 'react-redux';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App/>
            </Router>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();