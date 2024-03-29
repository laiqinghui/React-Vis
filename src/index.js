import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import graphReducer from './store/reducers/graphReducer';
import filterReducer from './store/reducers/filterReducer';

import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const rootReducer = combineReducers({
    graph: graphReducer,
    filter: filterReducer
});

const logger = store => {
    
    return next => {
        return action => {
            // console.log('[Middleware] Dispatching', action);
            const result = next(action);
            // console.log('[Middleware] next state', store.getState());
            return result;
        }
    }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger)));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
