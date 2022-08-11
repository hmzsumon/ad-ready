import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../actions/userAction';

const PrimaryDropDownMenu = ({ setTogglePrimaryDropDown, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    enqueueSnackbar('Logout Successfully', { variant: 'success' });
    setTogglePrimaryDropDown(false);
  };

  const navs = [
    {
      title: 'Tasks',
      icon: <ShoppingBagIcon sx={{ fontSize: '18px' }} />,
      redirect: '/orders',
    },

    {
      title: 'My Income',
      icon: <ChatIcon sx={{ fontSize: '18px' }} />,
      redirect: '/',
    },

    {
      title: 'Notifications',
      icon: <NotificationsIcon sx={{ fontSize: '18px' }} />,
      redirect: '/',
    },
  ];

  return (
    <div className='absolute w-60 -left-24 ml-2 top-9 bg-white shadow-2xl rounded flex-col text-sm'>
      {user.role === 'admin' && (
        <Link
          className='pl-3 py-3.5 border-b flex gap-3 items-center hover:bg-gray-50 rounded-t'
          to='/dashboard'
        >
          <span className='text-primary-blue'>
            <DashboardIcon sx={{ fontSize: '18px' }} />
          </span>
          Dashboard
        </Link>
      )}

      <Link
        className='pl-3 py-3.5 border-b flex gap-3 items-center hover:bg-gray-50 rounded-t'
        to='/account'
      >
        <span className='text-primary-blue'>
          <AccountCircleIcon sx={{ fontSize: '18px' }} />
        </span>
        My Profile
      </Link>

      {navs.map((item, i) => {
        const { title, icon, redirect } = item;

        return (
          <div key={i}>
            <Link
              className='pl-3 py-3.5 border-b flex gap-3 items-center hover:bg-gray-50'
              to={redirect}
            >
              <span className='text-primary-blue'>{icon}</span>
              {title}
            </Link>
          </div>
        );
      })}

      <div
        className='pl-3 py-3.5 flex gap-3 items-center hover:bg-gray-50 rounded-b cursor-pointer'
        onClick={handleLogout}
      >
        <span className='text-primary-blue'>
          <PowerSettingsNewIcon sx={{ fontSize: '18px' }} />
        </span>
        Logout
      </div>

      <div className='absolute right-1/2 -top-2.5'>
        <div className='arrow_down'></div>
      </div>
    </div>
  );
};

export default PrimaryDropDownMenu;
