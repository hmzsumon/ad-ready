import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import FormSidebar from './FormSidebar';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const referCode = useLocation().search.split('=')[1];

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    cpassword: '',
    tramsAndConditions: false,
    referId: referCode,
  });

  const {
    name,
    username,
    email,
    password,
    cpassword,
    phone,
    tramsAndConditions,
    referId,
  } = user;

  const handleRegister = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      enqueueSnackbar('Password length must be atleast 6 characters', {
        variant: 'warning',
      });
      return;
    }
    if (password !== cpassword) {
      enqueueSnackbar("Password Doesn't Match", { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.set('name', name);
    formData.set('username', username);
    formData.set('email', email);
    formData.set('phone', phone);
    formData.set('password', password);
    formData.set('tramsAndConditions', tramsAndConditions);
    formData.set('referId', referId);

    dispatch(registerUser(formData));
    // for (let key of formData.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
    // }
  };

  const handleDataChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(`/user/verify`);
    }
  }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar, email]);
  console.log('t&C', tramsAndConditions);
  return (
    <>
      <MetaData title='Register | Ad Ready' />

      {loading && <BackdropLoader />}
      <main className='w-full mt-12 sm:pt-20 sm:mt-0'>
        {/* <!-- row --> */}
        <div className='flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg'>
          <FormSidebar
            title="Looks like you're new here!"
            tag='Sign up with your mobile number to get started'
          />

          {/* <!-- signup column --> */}
          <div className='flex-1 overflow-hidden'>
            {/* <!-- personal info procedure container --> */}
            <form
              onSubmit={handleRegister}
              encType='multipart/form-data'
              className='p-5 sm:p-10'
            >
              <div className='flex flex-col gap-4 items-start'>
                {/* <!-- input container column --> */}
                <div className='flex flex-col w-full justify-between sm:flex-col gap-3 items-center'>
                  <TextField
                    fullWidth
                    id='full-name'
                    label='Full Name'
                    name='name'
                    value={name}
                    onChange={handleDataChange}
                    required
                  />

                  <TextField
                    fullWidth
                    id='user-name'
                    label='User Name'
                    name='username'
                    value={username}
                    onChange={handleDataChange}
                    required
                  />
                  <TextField
                    fullWidth
                    id='email'
                    label='Email'
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleDataChange}
                    required
                  />

                  <TextField
                    fullWidth
                    id='phone'
                    label='Phone Number'
                    type='phone'
                    name='phone'
                    value={phone}
                    onChange={handleDataChange}
                    required
                  />
                  <TextField
                    fullWidth
                    id='referId'
                    label='Refer Id'
                    type='text'
                    name='referCode'
                    value={referId}
                    onChange={handleDataChange}
                    required
                    disabled={true}
                  />
                </div>
                {/* <!-- input container column --> */}

                {/* <!-- input container column --> */}
                <div className='flex flex-col w-full justify-between sm:flex-row gap-3 items-center'>
                  <TextField
                    id='password'
                    label='Password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={handleDataChange}
                    required
                  />
                  <TextField
                    id='confirm-password'
                    label='Confirm Password'
                    type='password'
                    name='cpassword'
                    value={cpassword}
                    onChange={handleDataChange}
                    required
                  />
                </div>
                {/* <!-- input container column --> */}

                {/* <!-- trams and conditions input --> */}
                <div className='flex gap-4 items-center'>
                  <div className='flex items-center gap-4' id='checkboxInput'>
                    <Checkbox
                      checked={tramsAndConditions}
                      name='tramsAndConditions'
                      value={tramsAndConditions}
                      onChange={(e) =>
                        setUser({ ...user, [e.target.name]: e.target.checked })
                      }
                      required
                    />
                    <span className='text-sm text-gray-600'>
                      I accept the Privacy Policy and the{' '}
                      <Link to='/condition' className='text-blue-500'>
                        Terms of Service
                      </Link>
                    </span>
                  </div>
                </div>

                <button
                  type='submit'
                  className='text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium'
                >
                  Signup
                </button>
                <Link
                  to='/login'
                  className='hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium'
                >
                  Existing User? Log in
                </Link>
              </div>
            </form>
            {/* <!-- personal info procedure container --> */}
          </div>
          {/* <!-- signup column --> */}
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Register;
