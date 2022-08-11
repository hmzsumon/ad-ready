import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearErrors, loginUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const { loading, isAuthenticated, error, user } = useSelector(
    (state) => state.user
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(username, password));
  };

  const redirect = location.search
    ? location.search.split('=')[1]
    : 'dashboard';

  // check user is verified or not
  useEffect(() => {
    if (user && user.isVerified === false) {
      navigate(`/user/verify`);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(`/${redirect}`);
    }
  }, [dispatch, error, isAuthenticated, redirect, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title='Login | Ad Ready' />

      {loading && <BackdropLoader />}
      <main className='w-full mt-12 sm:pt-20 sm:mt-0'>
        {/* <!-- row --> */}
        <div className='flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg'>
          {/* <!-- sidebar column  --> */}
          <div className='loginSidebar bg-primary-blue p-10 pr-12 hidden sm:flex flex-col gap-4 w-2/5'>
            <h1 className='font-medium text-white text-3xl'>Login</h1>
            <p className='text-gray-200 text-lg'>
              Get access to your Details, Start Work, and Earn Money.
            </p>
          </div>
          {/* <!-- sidebar column  --> */}

          {/* <!-- login column --> */}
          <div className='flex-1 overflow-hidden'>
            {/* <!-- edit info container --> */}
            <div className='text-center py-10 px-4 sm:px-14'>
              {/* <!-- input container --> */}
              <form onSubmit={handleLogin}>
                <div className='flex flex-col w-full gap-4'>
                  <TextField
                    fullWidth
                    id='user-name'
                    label='User Name'
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <TextField
                    fullWidth
                    id='password'
                    label='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {/* <span className="text-xxs text-red-500 font-medium text-left mt-0.5">Please enter valid Email ID/Mobile number</span> */}

                  {/* <!-- button container --> */}
                  <div className='flex flex-col gap-2.5 mt-2 mb-32'>
                    <p className='text-xs text-primary-grey text-left'>
                      By continuing, you agree to Ad Ready's{' '}
                      <a
                        href='https://www.Ad Ready.com/pages/terms'
                        className='text-primary-blue'
                      >
                        {' '}
                        Terms of Use
                      </a>{' '}
                      and{' '}
                      <a
                        href='https://www.Ad Ready.com/pages/privacypolicy'
                        className='text-primary-blue'
                      >
                        {' '}
                        Privacy Policy.
                      </a>
                    </p>
                    <button
                      type='submit'
                      className='text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium'
                    >
                      Login
                    </button>
                    <Link
                      to='/password/forgot'
                      className='hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium'
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  {/* <!-- button container --> */}
                </div>
              </form>
              {/* <!-- input container --> */}

              <Link
                to='/register'
                className='font-medium text-sm text-primary-blue'
              >
                New to Ad Ready? Create an account
              </Link>
            </div>
            {/* <!-- edit info container --> */}
          </div>
          {/* <!-- login column --> */}
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Login;
