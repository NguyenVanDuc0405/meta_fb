import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/index';
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <Helmet>
      <meta name="image" content="https://cdn.pixabay.com/photo/2021/12/06/13/45/meta-6850393_960_720.png" />
    </Helmet>
    <App />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
