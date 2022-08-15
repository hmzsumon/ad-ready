import {
  ALL_DEPOSIT_FAIL,
  ALL_DEPOSIT_REQUEST,
  ALL_DEPOSIT_SUCCESS,
  CLEAR_ERRORS,
  DEPOSIT_FAIL,
  DEPOSIT_REQUEST,
  DEPOSIT_RESET,
  DEPOSIT_SUCCESS,
} from '../constants/depositConstants';

export const depositReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case DEPOSIT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DEPOSIT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeposit: payload.success,
        message: payload.message,
      };
    case DEPOSIT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DEPOSIT_RESET:
      return {
        ...state,
        isDeposit: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// get all deposits reducer
export const allDepositReducer = (
  state = { deposits: [] },
  { type, payload }
) => {
  switch (type) {
    case ALL_DEPOSIT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_DEPOSIT_SUCCESS:
      return {
        ...state,
        loading: false,
        deposits: payload.deposits,
        length: payload.length,
      };
    case ALL_DEPOSIT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
