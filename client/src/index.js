import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

import reducers from './reducers';

import App from './App';
import './index.css'

const store = configureStore({
  reducer: reducers,  // Reducers go here
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Adding thunk middleware
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
