import axios from 'axios';
import {
  CLEAT_ERRORS,
  PAYMENT_METHOD_FAILURE_ALL,
  PAYMENT_METHOD_REQUEST_ALL,
  PAYMENT_METHOD_SUCCESS_ALL,
} from '../constants/payMentMehtod';

export const getAllPaymentMethods = () => async (dispatch) => {
  dispatch({ type: PAYMENT_METHOD_REQUEST_ALL });
  try {
    const res = await axios.get('/api/v1/all/pay-method');
    dispatch({ type: PAYMENT_METHOD_SUCCESS_ALL, payload: res.data });
  } catch (err) {
    dispatch({ type: PAYMENT_METHOD_FAILURE_ALL, payload: err.response.data });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAT_ERRORS });
};
