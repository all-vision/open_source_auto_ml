import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from '../reducers/index';
import localforage from 'localforage';

const persistConfig = {
  key: 'root',
  storage: localforage,
};
 
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store);


// import { createStore } from 'redux';
// import rootReducer from '../reducers/index';

// export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// export default store;