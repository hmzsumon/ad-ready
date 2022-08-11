import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);

  return (
    <header className='bg-[#25374F] fixed top-0 py-3 w-full z-10'>
      {/* <!-- navbar container --> */}
      <div className='w-full sm:w-9/12 px-1 sm:px-4 m-auto flex justify-between items-center relative'>
        {/* <!-- logo & search container --> */}
        <div className='flex items-center flex-1'>
          <Link className='h-7 mr-1 sm:mr-4' to='/'>
            <img
              draggable='false'
              className='h-full w-full object-contain'
              src={logo}
              alt='Ad Ready Logo'
            />
          </Link>
        </div>
        {/* <!-- logo & search container --> */}

        {/* <!-- right navs --> */}
        <div className='flex items-center justify-between ml-1 sm:ml-0 gap-0.5 sm:gap-7 relative'>
          {isAuthenticated === false ? (
            <Link
              to='/'
              className='px-3 sm:px-9 py-0.5 text-primary-blue bg-white border font-medium rounded-sm cursor-pointer'
            >
              Login
            </Link>
          ) : (
            <span
              className='userDropDown flex items-center text-white font-medium gap-1 cursor-pointer'
              onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
            >
              {user.name && user.name.split(' ', 1)}
              <span>
                {togglePrimaryDropDown ? (
                  <ExpandLessIcon sx={{ fontSize: '16px' }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: '16px' }} />
                )}
              </span>
            </span>
          )}

          {togglePrimaryDropDown && (
            <PrimaryDropDownMenu
              setTogglePrimaryDropDown={setTogglePrimaryDropDown}
              user={user}
            />
          )}
        </div>
        {/* <!-- right navs --> */}
      </div>
      {/* <!-- navbar container --> */}
    </header>
  );
};

export default Header;
