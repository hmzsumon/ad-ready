import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getUserDetails } from '../../../actions/userAction';
import BackdropLoader from '../../Layouts/BackdropLoader';

const Task = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetcher = async (...args) => await axios.get(...args);
  const { data } = useSWR('/api/v1/dailyWorks', fetcher);

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { user: details } = useSelector((state) => state.userDetails);

  useEffect(() => {
    dispatch(getUserDetails(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    if (details.dailyTaskLimit === 0 || user.isActive === false) {
      navigate(`/no-task`);
    } else if (data) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(true);
    }
  }, [data, details, navigate, user.isActive]);

  return (
    <>
      {loading ? (
        <BackdropLoader />
      ) : (
        <div>
          <h1>Remaining Task: {user && details.dailyTaskLimit} </h1>
          <div className='grid gap-4'>
            {data &&
              data.data.works.map((work) => (
                <div key={work._id} className=' relative flex flex-col'>
                  <ReactPlayer
                    style={{ width: '100%', height: '100%', padding: '10px' }}
                    width={'100%'}
                    url={work.url}
                    controls
                    playing
                    loop
                    muted
                  />
                  <Link
                    to={`/submit/task/${work._id}`}
                    className=' top-[50%] left-[25%] text-center absolute mx-auto w-7/12 md:w-4/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                  >
                    Vew
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Task;
