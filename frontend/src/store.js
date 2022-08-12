import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { saveForLaterReducer } from './reducers/saveForLaterReducer';
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userActivateReducer,
  userDetailsReducer,
  userReducer,
  verifyUserReducer,
} from './reducers/userReducer';

import { withdrawReducer } from './reducers/withdrawReducer';

import { depositReducer } from './reducers/depositReducer';

import {
  allTransactionsReducer,
  transactionReducer,
} from './reducers/tnxReducer';

const reducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  saveForLater: saveForLaterReducer,
  users: allUsersReducer,
  userDetails: userDetailsReducer,
  verifyUser: verifyUserReducer,
  userActivate: userActivateReducer,

  deposit: depositReducer,

  withdraw: withdrawReducer,
  tnx: allTransactionsReducer,
  transaction: transactionReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
