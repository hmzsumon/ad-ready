import axios from 'axios';
import {
  CLEAR_ERRORS,
  WITHDRAW_CREATE_FAILURE,
  WITHDRAW_CREATE_REQUEST,
  WITHDRAW_CREATE_SUCCESS,
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
