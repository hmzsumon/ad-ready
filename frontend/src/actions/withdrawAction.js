import axios from 'axios';
import {
  ACTIVE_B_W_FAILURE,
  ACTIVE_B_W_REQUEST,
  ACTIVE_B_W_SUCCESS,
  CLEAR_ERRORS,
  WITHDRAW_CREATE_FAILURE,
  WITHDRAW_CREATE_REQUEST,
  WITHDRAW_CREATE_SUCCESS,
  WITHDRAW_LIST_FAILURE,
  WITHDRAW_LIST_REQUEST,
  WITHDRAW_LIST_SUCCESS,
} from '../constants/withdrawConstants';

export const withdrawRequest = (withdraw) => async (dispatch) => {
  try {
    dispatch({ type: WITHDRAW_CREATE_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/withdraw/request',
      withdraw,
      config
    );

    dispatch({
      type: WITHDRAW_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WITHDRAW_CREATE_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// get all withdraw
export const withdrawListRequest = () => async (dispatch) => {
  try {
    dispatch({ type: WITHDRAW_LIST_REQUEST });

    const { data } = await axios.get('/api/v1/user/withdraws');

    dispatch({
      type: WITHDRAW_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WITHDRAW_LIST_FAILURE,
      payload: error.response.data.message,
    });
  }
};

//active balance withdraw
export const activeBWRequest = (withdraw) => async (dispatch) => {
  try {
    dispatch({ type: ACTIVE_B_W_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/active/balance/withdraw',
      withdraw,
      config
    );

    dispatch({
      type: ACTIVE_B_W_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ACTIVE_B_W_FAILURE,
      payload: error.response.data.message,
    });
  }
};
