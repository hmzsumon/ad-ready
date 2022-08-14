import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import WebFont from 'webfontloader';
import { loadUser } from './actions/userAction';
import Header from './components/Layouts/Header/Header';
import NotFound from './components/NotFound';
import Account from './components/User/Account';
import Condition from './components/User/Condition';
import Dashboard from './components/User/Dashboard';
import Deposit from './components/User/Deposit/Deposit';
import Deposits from './components/User/Deposit/DepositHistory';
import Login from './components/User/Login';
import MainData from './components/User/MainData';
import Referral from './components/User/Referral';
import Register from './components/User/Register';
import NoTask from './components/User/Task/NoTask';
import Submit from './components/User/Task/Submit';
import Task from './components/User/Task/Task';
import Transactions from './components/User/Tnx';
import UpdatePassword from './components/User/UpdatePassword';
import UpdateProfile from './components/User/UpdateProfile';
import Verify from './components/User/Verifi';
import Withdraw from './components/User/Withdraw/Withdraw';
import ProtectedRoute from './Routes/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(loadUser());
    // getStripeApiKey();
  }, [dispatch]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto:300,400,500,600,700'],
      },
    });
  });

  // always scroll to top on route/path change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  // disable right click
  // window.addEventListener('contextmenu', (e) => e.preventDefault());
  // window.addEventListener('keydown', (e) => {
  //   if (e.keyCode === 123) e.preventDefault();
  //   if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault();
  //   if (e.ctrlKey && e.shiftKey && e.keyCode === 74) e.preventDefault();
  // });
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/condition' element={<Condition />} />
        <Route path='/user/verify' element={<Verify />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={0}>
                <MainData />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/user/tasks'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={1}>
                <Task />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/submit/task/:id'
          element={
            <ProtectedRoute>
              <Dashboard>
                <Submit />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/user/deposit'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={2}>
                <Deposit />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/user/withdraw'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={3}>
                <Withdraw />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={4}>
                <Account />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/account/update'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={5}>
                <UpdateProfile />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/password/update'
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/transactions'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={5}>
                <Transactions />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/deposit/history'
          element={
            <ProtectedRoute>
              <Dashboard>
                <Deposits />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/referral'
          element={
            <ProtectedRoute>
              <Dashboard activeTab={6}>
                <Referral />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/no-task'
          element={
            <ProtectedRoute>
              <Dashboard>
                <NoTask />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
