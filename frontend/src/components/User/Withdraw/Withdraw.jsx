import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearErrors, withdrawRequest } from '../../../actions/withdrawAction';

import { useSnackbar } from 'notistack';

import BackdropLoader from '../../Layouts/BackdropLoader';

import Model1 from './Model1';
const withdrawMethods = [
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
const Withdraw = () => {
  const { user } = useSelector((state) => state.user);

  const { loading, isCreated, error, message } = useSelector(
    (state) => state.withdraw
  );
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [method, setMethod] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [errors, setErrors] = React.useState({});

  const [userNumber, setUserNumber] = React.useState('');

  //==================Start Dialog Section =================
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleDisAgree = () => {
    setOpen(false);
    navigate('/dashboard');
  };
  //==================End Dialog Section =================

  //==================Start Dialog1 Section =================
  const [open1, setOpen1] = React.useState(false);

  const handleClose1 = () => {
    setOpen(false);
  };

  //==================End Dialog1 Section =================

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }

    if (isCreated) {
      enqueueSnackbar(message, { variant: 'success' });
      dispatch(clearErrors());
      navigate('/dashboard');
    }
  }, [error, isCreated, message, enqueueSnackbar, dispatch, navigate]);

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

    for (let key of myForm.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    dispatch(withdrawRequest(myForm));
  };

  // validate amount
  const validate = (values) => {
    const errors = {};
    if (!amount) {
      errors.amount = 'Amount Required';
    }
    return errors;
  };

  // check user workingdays
  useEffect(() => {
    if (user.totalWorkDays < 30) {
      console.log('user working days less than 30');
      setOpen(true);
      return;
    }
  }, [user.totalWorkDays]);

  return (
    <>
      {!method ? (
        <div>
          <div>
            <NavLink
              to='/withdraw/history'
              className=' my-6 bg-blue-500 text-white  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150'
              type='button'
            >
              Withdraw History
            </NavLink>

            <button
              className=' my-6 bg-blue-500 text-white  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150'
              type='button'
              onClick={() => setOpen1(true)}
            >
              Active Balance Withdraw
            </button>
            {/* Model Confirm */}
            <Model1
              open={open1}
              handleClose={handleClose1}
              handleDisAgree={handleDisAgree}
              userNumber={userNumber}
              setUserNumber={setUserNumber}
            />
          </div>

          <div className='w-full lg:w-6/12 '>
            <div className='relative w-full mb-3'>
              <label
                className='block uppercase text-gray-600 text-xs font-bold mb-2'
                htmlFor='grid-password'
              >
                Withdraw Amount{' '}
                <span className=' text-xm font-medium'>
                  (Your Withdraw Balance is: BDT
                  {user && Number(user.withdrawBalance).toFixed(2)} )
                </span>
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
            {withdrawMethods.map((method) => {
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
          {/* Start Dialog Section */}
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title'>
                <span className='text-red-500'>
                  আপনার কাজের দিন ৩০ দিনের কম!
                </span>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  আপনি যদি এখনই উত্তোলন করতে চান! তবে আপনি শুধুমাত্র মুনাফা
                  ব্যালেন্স উত্তোলন করতে পারবেন এই ক্ষেত্রে ১০% চার্জ প্রযোজ্য
                  সর্বনিম্ন ৫০০ টাকা উত্তোলন করতে পারবেন। যদি ৩০ দিনের আগে
                  সম্পূর্ণ ব্যালেন্স উত্তোলন করতে চান মুনাফা বেতিত শুদু মাত্র
                  মেইন ব্যালেন্স উত্তোলন করতে পারবেন। এই ক্ষেত্রে ১০% চার্জ
                  প্রযোজ্য এবং আপনার একাউন্ট সাসপেন্ড করা হবে। ২৪ ঘণ্টার মধ্যে
                  আপনার টাকা আপনার প্রদত্ত পেমেন্ট মেথড আর মাধমে প্রদান করা হবে।
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDisAgree}>Disagree</Button>
                <Button onClick={handleClose} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          {/* End Dialog Section */}
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
                <small
                  className={`text-center ${
                    user.withdrawBalance < 499
                      ? 'text-red-500'
                      : 'text-gray-800'
                  }`}
                >
                  Your Withdraw Balance: {user.withdrawBalance}
                </small>
              </div>
              <div className='py-4'>
                {/* user's method */}
                <div className='w-full lg:w-6/12 px-4'>
                  <div className='relative w-full mb-3'>
                    <label className='block  text-gray-600 text-sm font-semibold mb-2'>
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
              <div className='px-4 mt-6'>
                <button
                  type='submit'
                  className='bg-blue-500 flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-400  disabled:cursor-not-allowed'
                  disabled={!userNumber}
                  onClick={submitHandler}
                >
                  {loading ? <BackdropLoader /> : 'Submit'}
                </button>
              </div>
            </div>
          ) : (
            <div> This Method Not allowed For You Location</div>
          )}
        </>
      )}
    </>
  );
};

export default Withdraw;
