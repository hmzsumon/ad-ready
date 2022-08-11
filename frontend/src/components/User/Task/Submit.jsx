import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import BackdropLoader from '../../Layouts/BackdropLoader';
const { useParams, useNavigate } = require('react-router-dom');

const Submit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetcher = async (...args) => await axios.get(...args);
  const { data } = useSWR(`/api/v1/dailyWork/${id}`, fetcher);

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.user);

  const submitHandler = async () => {
    setLoading(true);
    const res = await axios.put(`/api/v1/submit/work`);
    if (res.status === 200) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      navigate(`/user/tasks`);
    }
  };

  useEffect(() => {
    if (data) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(true);
    }
  }, [data, user, navigate]);

  return (
    <>
      {' '}
      {loading ? (
        <BackdropLoader />
      ) : (
        <>
          {data && (
            <ReactPlayer
              style={{ width: '100%', height: '100%', padding: '10px' }}
              width={'100%'}
              url={data.data.work.url}
              controls
              playing
              loop
              muted
            />
          )}
          <div className=' mx-auto'>
            <Button variant='contained' onClick={submitHandler}>
              Submit
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Submit;
