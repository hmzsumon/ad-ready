import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { TbCurrencyTaka } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import {
  clearErrors,
  getUserDetails,
  userActivate,
} from '../../actions/userAction';
import MetaData from '../Layouts/MetaData';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const MainData = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const { isActivated, message, error } = useSelector(
    (state) => state.userActivate
  );

  // for dilog
  const [open, setOpen] = useState(false);
  const [taskLimit, setTaskLimit] = useState(0);
  const [loading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // handle confirm
  const handleConfirm = () => {
    if (user.mainBalance <= 2999) {
      enqueueSnackbar('Insufficient balance to activate your account!', {
        variant: 'warning',
      });
      return;
    }
    const myForm = new FormData();
    myForm.set('taskLimit', taskLimit);
    dispatch(userActivate(myForm));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isActivated) {
      enqueueSnackbar(message, { variant: 'success' });
      handleClose();
    }
  }, [isActivated, message, enqueueSnackbar, error, dispatch]);

  useEffect(() => {
    dispatch(getUserDetails(user._id));
  }, [dispatch, user._id]);

  // const date = new Date();

  return (
    <>
      <MetaData title=' Dashboard | Ad Ready' />

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6'>
        {/* Active Section */}
        {user.isActive === false && (
          <div className='flex flex-col bg-yellow-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
            <h4 className='text-gray-100 text-center font-medium'>
              Your Account Inactive
            </h4>
            <small>Deposit a minimum of BDT 3000 to activate the account</small>
            <div className='  text-center'>
              <div className=' mx-auto'>
                <Button
                  variant='contained'
                  onClick={handleClickOpen}
                  disabled={user.mainBalance <= 2999}
                >
                  Active
                </Button>
              </div>
            </div>
          </div>
        )}
        {/*End Active Section */}

        <div className='flex flex-col bg-purple-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>Main Balance</h4>
          <div className=' flex items-center'>
            <span>
              <TbCurrencyTaka className=' text-2xl' />
            </span>
            <h2 className='text-2xl font-bold'>{user && user.mainBalance} </h2>
          </div>
        </div>
        <div className='flex flex-col bg-red-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>
            Active Balance <sup>3%+</sup>
          </h4>
          <div className=' flex items-center'>
            <span>
              <TbCurrencyTaka className=' text-2xl' />
            </span>
            <h2 className='text-2xl font-bold'>
              {user &&
                user.activeBalance &&
                Number(user.activeBalance).toFixed(2)}{' '}
            </h2>
          </div>
        </div>
        <div className='flex flex-col bg-yellow-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>
            Withdraw Balance <sup>10%</sup>{' '}
          </h4>
          <div className=' flex items-center'>
            <span>
              <TbCurrencyTaka className=' text-2xl' />
            </span>
            <h2 className='text-2xl font-bold'>
              {user &&
                user.withdrawBalance &&
                Number(user.withdrawBalance).toFixed(2)}{' '}
            </h2>
          </div>
        </div>
        <div className='flex flex-col bg-green-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>Your Total Profit</h4>

          <div className=' flex items-center'>
            <span>
              <TbCurrencyTaka className=' text-2xl' />
            </span>
            <h2 className='text-2xl font-bold'>
              {user && user.profit && Number(user.profit).toFixed(2)}{' '}
            </h2>
          </div>
        </div>

        {/* Start Daily vew */}
        <div className='flex flex-col bg-green-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>Each Day Profit</h4>

          <div className=' flex items-center'>
            <span>
              <TbCurrencyTaka className=' text-2xl' />
            </span>
            <h2 className='text-2xl font-bold'>
              {user && user.dailyProfit && Number(user.dailyProfit).toFixed(2)}{' '}
            </h2>
          </div>
        </div>
        {/* End Daily vew */}

        {/* Start Daily vew */}
        <div className='flex flex-col bg-blue-700 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>Each Day Task</h4>

          <div className=' flex items-center'>
            <h2 className='text-2xl font-bold'>
              {user && user.taskLimit}{' '}
              <sup>
                {user && user.taskValue && Number(user.taskValue).toFixed(2)}
              </sup>{' '}
            </h2>
          </div>
        </div>
        {/* End Daily vew */}

        {/* Start Daily Profit */}
        <div className='flex flex-col bg-yellow-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6'>
          <h4 className='text-gray-100 font-medium'>To Day Profit</h4>

          <div className=' flex items-center'>
            <span>
              <TbCurrencyTaka className=' text-2xl' />
            </span>
            <h2 className='text-2xl font-bold'>
              {user && Number(user.toDayProfit).toFixed(2)}{' '}
            </h2>
          </div>
        </div>
        {/* End Daily Profit */}
      </div>
      {/* Model Section */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <small>আপনি প্রতিদিন কতগুলি কাজ সম্পূর্ণ করতে চান?</small>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            মনে রাখবেন আপনাকে কমপক্ষে পাঁচটি কাজ করতে হবে এবং সর্বোচ্চটি আপনার
            উপর নির্ভর করে
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label=''
            type='number'
            fullWidth
            variant='standard'
            onChange={(e) => setTaskLimit(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>
            {loading ? <PulseLoader color='#2B80D5' size={10} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MainData;

// setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setOpen(false);
//     }, 2000);
