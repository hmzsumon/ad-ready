import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddCardIcon from '@mui/icons-material/AddCard';
import CloseIcon from '@mui/icons-material/Close';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LogoutIcon from '@mui/icons-material/Logout';
import PublishIcon from '@mui/icons-material/Publish';
import ShareIcon from '@mui/icons-material/Share';
import StorageIcon from '@mui/icons-material/Storage';
import Avatar from '@mui/material/Avatar';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../actions/userAction';
import './Sidebar.css';

const navMenu = [
  {
    icon: <EqualizerIcon />,
    label: 'Dashboard',
    ref: '/dashboard',
  },
  {
    icon: <StorageIcon />,
    label: 'Tasks',
    ref: '/user/tasks',
  },

  {
    icon: <AddCardIcon />,
    label: 'Deposit',
    ref: '/user/deposit',
  },
  {
    icon: <PublishIcon />,
    label: 'Withdraw',
    ref: '/user/withdraw',
  },
  {
    icon: <AccountBoxIcon />,
    label: 'My Profile',
    ref: '/account',
  },
  {
    icon: <ShareIcon />,
    label: 'Referral',
    ref: '/referral',
  },
  {
    icon: <LogoutIcon />,
    label: 'Logout',
  },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar('Logout Successfully', { variant: 'success' });
    navigate('/');
  };

  return (
    <aside className=' z-10 sm:z-0 block min-h-screen fixed left-0 pb-14 max-h-screen w-3/4 sm:w-1/5 bg-gray-800 text-white overflow-x-hidden border-r'>
      <div className='flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5'>
        <Avatar alt='Avatar' src='../images/pro.jpg' />
        <div className='flex flex-col gap-0'>
          <span className='font-medium text-lg'>{user.name}</span>
          <span className='text-gray-300 text-sm'>{user.email}</span>
          <span
            className={` text-sm capitalize ${
              user.status === 'active' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {user.status}
          </span>
        </div>
        <button
          onClick={() => setToggleSidebar(false)}
          className='sm:hidden bg-gray-800 ml-auto rounded-full w-10 h-10 flex items-center justify-center'
        >
          <CloseIcon />
        </button>
      </div>

      <div className='flex flex-col w-full gap-0 my-8'>
        {navMenu.map((item, index) => {
          const { icon, label, ref } = item;
          return (
            <div key={index}>
              {label === 'Logout' ? (
                <button
                  onClick={handleLogout}
                  className='hover:bg-gray-700 flex gap-3 items-center py-3 px-4 font-medium'
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ) : (
                <Link
                  to={ref}
                  className={`${
                    activeTab === index ? 'bg-gray-700' : 'hover:bg-gray-700'
                  } flex gap-3 items-center py-3 px-4 font-medium`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
