import {
  CLEAT_ERRORS,
  PAYMENT_METHOD_FAILURE_ALL,
  PAYMENT_METHOD_REQUEST_ALL,
  PAYMENT_METHOD_SUCCESS_ALL,
} from '../constants/payMentMehtod';

export const payMethodReducer = (
  state = { paymentMethods: [], loading: false, error: null },
  { type, payload }
) => {
  switch (type) {
    case PAYMENT_METHOD_REQUEST_ALL:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case PAYMENT_METHOD_SUCCESS_ALL:
      return {
        ...state,
        paymentMethods: payload.payMethods,
        loading: false,
        error: null,
      };
    case PAYMENT_METHOD_FAILURE_ALL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAT_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
