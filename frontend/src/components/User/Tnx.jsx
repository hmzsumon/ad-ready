import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { TbCurrencyTaka } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getAllTransactions } from '../../actions/tnxAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const Transactions = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const { transactions, error } = useSelector((state) => state.tnx);
  const {
    loading,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.transaction);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar('Deleted Successfully', { variant: 'success' });
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllTransactions());
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      minWidth: 200,
      flex: 0.2,
    },
    {
      field: 'transactionType',
      headerName: 'Transaction Type',
      headerAlign: 'center',
      minWidth: 200,
      flex: 0.2,
      renderCell: (params) => {
        return (
          <div className='mx-auto'>
            <span className=' text-green-500 '>
              {params.row.transactionType === 'cashIn' && 'Cash In'}
            </span>
            <span className=' text-red-500 text-center '>
              {params.row.transactionType === 'cashOut' && 'Cash Out'}
            </span>
          </div>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerAlign: 'center',
      type: 'number',
      minWidth: 200,
      flex: 0.2,
      renderCell: (params) => {
        return (
          <div className=' mx-auto'>
            {params.row.transactionType === 'cashIn' && (
              <span className=' flex items-center   text-green-500 '>
                + {params.row.amount.toLocaleString()} <TbCurrencyTaka />
              </span>
            )}

            {params.row.transactionType === 'cashOut' && (
              <span className=' flex items-center  text-red-500 '>
                - {params.row.amount.toLocaleString()} <TbCurrencyTaka />
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return <span className=' ml-5 '>{params.row.description}</span>;
      },
    },
  ];

  const rows = [];

  transactions &&
    transactions.forEach((tnx) => {
      rows.unshift({
        id: tnx._id,
        amount: tnx.amount,
        transactionType: tnx.transactionType,
        createdAt: formatDate(tnx.createdAt),
        description: tnx.description,
      });
    });

  return (
    <>
      <MetaData title={` ${user.name} | Transactions  `} />

      {loading && <BackdropLoader />}

      <h1 className='text-lg font-medium uppercase'>transactions</h1>
      <div
        className='bg-white rounded-xl shadow-lg w-full'
        style={{ height: 470 }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectIconOnClick
          sx={{
            boxShadow: 0,
            border: 0,
          }}
        />
      </div>
    </>
  );
};

export default Transactions;
