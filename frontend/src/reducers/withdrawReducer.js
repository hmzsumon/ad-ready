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

export const withdrawReducer = (
  state = { withdraws: [], length: 0 },
  { type, payload }
) => {
  switch (type) {
    case WITHDRAW_CREATE_REQUEST:
    case WITHDRAW_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case WITHDRAW_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        isCreated: payload.success,
        withdraw: payload.withdraw,
        message: payload.message,
      };
    case WITHDRAW_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: payload,
        withdraws: payload.withdraws,
        length: payload.length,
      };
    case WITHDRAW_CREATE_FAILURE:
    case WITHDRAW_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isCreated: false,
      };
    default:
      return state;
  }
};

export const activeBWReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case ACTIVE_B_W_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTIVE_B_W_SUCCESS:
      return {
        ...state,
        loading: false,
        isCreated: payload.success,
      };
    case ACTIVE_B_W_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        isCreated: false,
      };
    default:
      return state;
  }
};
