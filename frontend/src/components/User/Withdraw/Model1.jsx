import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';

const Model1 = ({
  open,
  handleDisAgree,
  confirmHandler,
  method,
  userNumber,
  setMethod,
  setUserNumber,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <span className='text-red-500'>আপনার কাজের দিন ৩০ দিনের কম!</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span className=' text-xm font-bold text-gray-800'>
              আপনি যদি এখনই উত্তোলন করতে চান তবে আপনি শুধুমাত্র মুনাফা ব্যালেন্স
              উত্তোলন পারবেন এই ক্ষেত্রে ১০% চার্জ প্রযোজ্য সর্বনিম্ন ৫০০ টাকা
              উত্তোলন করতে পারবেন। যদি ৩০ দিনের আগে সম্পূর্ণ ব্যালেন্স উত্তোলন
              করতে চান মুনাফা বেতিত শুদু মাত্র মেইন ব্যালেন্স উত্তোলন করতে
              পারবেন। এই ক্ষেত্রে ১০% চার্জ প্রযোজ্য এবং আপনার একাউন্ট সাসপেন্ড
              করা হবে। ২৪ ঘণ্টার মধ্যে আপনার টাকা আপনার প্রদত্ত পেমেন্ট মেথড আর
              মাধমে প্রদান করা হবে।
            </span>
            <TextField
              autoFocus
              margin='dense'
              label='Method Number'
              type='text'
              value={method}
              fullWidth
              variant='standard'
              onChange={(e) => setMethod(e.target.value)}
            />

            <TextField
              autoFocus
              margin='dense'
              label='Method Number'
              type='text'
              value={userNumber}
              fullWidth
              variant='standard'
              onChange={(e) => setUserNumber(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisAgree}>Disagree</Button>
          <Button onClick={confirmHandler} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Model1;
