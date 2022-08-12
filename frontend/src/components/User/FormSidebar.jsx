import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const FormSidebar = ({ title, tag }) => {
  return (
    <div className='loginSidebar bg-primary-blue px-9 py-10 hidden sm:flex flex-col gap-4 w-2/5'>
      <h1 className='font-medium text-white text-xl md:text-3xl'>{title}</h1>
      <p className='text-gray-200 text-sm md:text-lg pr-2'>{tag}</p>
      <Link to='/condition' className='text-white text-sm md:text-lg'>
        <Button variant='contained' color='success'>
          Trams & conditions{' '}
        </Button>
      </Link>
    </div>
  );
};

export default FormSidebar;
