import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  clearErrors,
  depositRequest,
  resetDeposit,
} from '../../../actions/depositAction';

import BackdropLoader from '../../Layouts/BackdropLoader';

import CopyBtn from '../../Reusable/CopyBtn';
const depositMethods = [
  {
    id: 1,
    name: 'Paypal',
    icon: '../images/payPal.svg',
    number: '#003087',
    value: 'paypal',
  },
  {
    id: 2,
    name: 'Visa',
    icon: '../images/visa.svg',
    number: '#003087',
    value: 'visa',
  },
  {
    id: 3,
    name: 'Mastercard',
    icon: '../images/mastercard.svg',
    number: '#003087',
    value: 'mastercard',
  },

  {
    id: 7,
    name: 'Bkash',
    icon: '../images/bKash.svg',
    number: '01847207766',
    value: 'bkash',
  },
  {
    id: 8,
    name: 'Rocket',
    icon: '../images/rocket.svg',
    number: '01798880080-3',
    value: 'rocket',
  },
  {
    id: 9,
    name: 'Nagad',
    icon: '../images/nagad.svg',
    number: '01847207766',
    value: 'nagad',
  },

  {
    id: 11,
    name: 'Bitcoin',
    icon: '../images/bitcoin.svg',
    number: '#003087',
    value: 'bitcoin',
  },

  {
    id: 13,
    name: 'Payoneer',
    icon: '../images/payoneer.svg',
    number: '#003087',
    value: 'payoneer',
  },
];
const Deposit = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [method, setMethod] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [errors, setErrors] = React.useState({});
  const [tnxId, setTnxId] = React.useState('');
  const [userNumber, setUserNumber] = React.useState('');

  const { loading, error, isDeposit, message } = useSelector(
    (state) => state.deposit
  );

  // handle select method
  const handleSelectMethod = (method) => {
    if (!amount) {
      setErrors(validate(amount));
    } else {
      setMethod(method);
      console.log(method);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('method', method.value);
    myForm.set('amount', amount);
    myForm.set('accountNumber', userNumber);
    myForm.set('transactionId', tnxId);

    for (let key of myForm.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    dispatch(depositRequest(myForm));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }

    if (isDeposit) {
      enqueueSnackbar(message, { variant: 'success' });
      dispatch(resetDeposit());
    }
  }, [isDeposit, message, enqueueSnackbar, error, dispatch]);

  // validate amount
  const validate = (values) => {
    const errors = {};
    if (!amount) {
      errors.amount = 'Amount Required';
    }
    // if (values.amount <= 10) {
    //   errors.amount = 'Amount must be greater than 10 or equal to 10';
    // }
    // if (!values.method) {
    //   errors.method = 'Method Required';
    // }
    // console.log(errors);
    return errors;
  };
  return (
    <>
      {!method ? (
        <div>
          <NavLink
            to='/deposit/history'
            className=' my-6 bg-blue-500 text-white  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150'
            type='button'
          >
            Deposit History
          </NavLink>
          <div className='w-full lg:w-6/12 '>
            <div className='relative w-full mb-3'>
              <label
                className='block uppercase text-gray-600 text-xs font-bold mb-2'
                htmlFor='grid-password'
              >
                Deposit Amount
              </label>
              <input
                type='number'
                name='amount'
                className={`px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow  focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                  errors.amount ? 'border border-red-500' : 'border-0'
                }`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {errors.amount && (
                <small className=' text-red-500'>{errors.amount}</small>
              )}
            </div>
          </div>
          <h1 className='my-2 text-xl text-gray-800'>Payment Methods</h1>
          <div className='grid md:grid-cols-3 gap-4 '>
            {depositMethods.map((method) => {
              return (
                <div
                  key={method.id}
                  className=' rounded-sm border-gray-300 border-2 cursor-pointer hover:bg-gray-300'
                  onClick={() => handleSelectMethod(method)}
                >
                  <img
                    src={method.icon}
                    alt={method.name}
                    className=' mx-auto w-20 h-20'
                  />
                  {/* <span>{method.name}</span> */}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <small
            className='font-semibold text-blue-800 cursor-pointer hover:text-blue-600'
            onClick={() => setMethod(null)}
          >
            &#8592; Go Back
          </small>
          {method.value === 'bkash' ||
          method.value === 'rocket' ||
          method.value === 'nagad' ? (
            <div>
              <h1 className='my-2 text-xl text-gray-800'>Selected Method:</h1>
              <div className=' md:w-5/12 mx-auto '>
                <div className=' rounded-sm border-gray-300 border-2 cursor-pointer hover:bg-gray-300'>
                  <img
                    src={method.icon}
                    alt={method.name}
                    className=' mx-auto w-20 h-20'
                  />
                </div>
                {/* <small className='text-center'>
                  {`${amount} * 85`} = {amount * 85} ($1 = 85.00 BDT){' '}
                </small> */}
              </div>
              <div className='py-4'>
                {/* Agent Section */}
                <div className='w-full lg:w-6/12 px-4'>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block  text-gray-600 text-sm font-semibold mb-2'
                      htmlFor='grid-password'
                    >
                      Please Send Money{' '}
                      <span className='text-green-500'>{amount}BDT</span> to
                      this{' '}
                      <span className='text-green-500'>{method.name} </span>{' '}
                      Personal Number:{' '}
                      <span className='text-orange-400'>{method.number}</span>{' '}
                    </label>
                    <div className='flex relative'>
                      <input
                        type='text'
                        name='confirmPassword'
                        className='border-0 disabled:cursor-not-allowed px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                        value={method.number}
                        readOnly
                        disabled
                      />
                      <span className=' absolute right-3 top-3'>
                        <CopyBtn text={method.number} icon={<FaRegCopy />} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className='w-full lg:w-6/12 px-4'>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block  text-gray-600 text-sm font-semibold mb-2'
                      htmlFor='grid-password'
                    >
                      Enter Transaction Number
                    </label>
                    <input
                      type='text'
                      name='transactionNumber'
                      className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                      value={tnxId}
                      onChange={(e) => setTnxId(e.target.value)}
                    />
                  </div>
                </div>

                {/* user's method */}
                <div className='w-full lg:w-6/12 px-4'>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block  text-gray-600 text-sm font-semibold mb-2'
                      htmlFor='grid-password'
                    >
                      Please enter Your{' '}
                      <span className='text-green-600'>{method.name}</span>{' '}
                      account number.
                    </label>
                    <input
                      type='text'
                      name='userNumber'
                      className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                      value={userNumber}
                      onChange={(e) => setUserNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <hr className='mt-6 border-b-1 border-gray-300' />
              {loading ? (
                <BackdropLoader />
              ) : (
                <div className='px-4 mt-6'>
                  <button
                    type='submit'
                    className='bg-blue-500 flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-400  disabled:cursor-not-allowed'
                    disabled={!userNumber || !tnxId}
                    onClick={submitHandler}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div> This Method Not allowed For You Location</div>
          )}
        </>
      )}
    </>
  );
};

export default Deposit;
