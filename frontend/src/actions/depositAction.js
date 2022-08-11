import axios from 'axios';
import {
  CLEAR_ERRORS,
  DEPOSIT_FAIL,
  DEPOSIT_REQUEST,
  DEPOSIT_RESET,
  DEPOSIT_SUCCESS,
} from '../constants/depositConstants';

// new deposit request action
export const depositRequest = (deposit) => async (dispatch) => {
  dispatch({ type: DEPOSIT_REQUEST });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.post('/api/v1/deposit/new', deposit, config);
    dispatch({
      type: DEPOSIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DEPOSIT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// reset deposit action
export const resetDeposit = () => async (dispatch) => {
  dispatch({ type: DEPOSIT_RESET });
};

// clear errors action
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
