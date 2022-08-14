import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { TbCurrencyTaka } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getDepositHistory } from '../../../actions/depositAction';

import { formatDate } from '../../../utils/functions';
import BackdropLoader from '../../Layouts/BackdropLoader';
import MetaData from '../../Layouts/MetaData';

const Deposits = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const { loading, deposits, length, error } = useSelector(
    (state) => state.allDeposit
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }

    dispatch(getDepositHistory());
  }, [dispatch, enqueueSnackbar, error]);

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      minWidth: 200,
      flex: 0.2,
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
          <div className='mx-auto'>
            <span className=' flex items-center'>
              <TbCurrencyTaka /> {params.row.amount.toLocaleString()}
            </span>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      minWidth: 200,
      flex: 0.2,
      renderCell: (params) => {
        return (
          <div className='mx-auto'>
            <span
              className={`${
                params.row.status === 'SUCCESS'
                  ? 'text-green-500'
                  : 'text-gray-700'
              }`}
            >
              {params.row.status.toLocaleString()}
            </span>
          </div>
        );
      },
    },
    {
      field: 'approvedAt',
      headerName: 'Approved At',
      headerAlign: 'center',
      minWidth: 200,
      flex: 0.2,
      renderCell: (params) => {
        return (
          <div className='mx-auto'>
            {params.row.status === 'SUCCESS' ? (
              <span className='text-gray-700'>
                {formatDate(params.row.approvedAt)}
              </span>
            ) : (
              '- - -'
            )}
          </div>
        );
      },
    },
  ];

  const rows = [];

  deposits &&
    deposits.forEach((deposit) => {
      rows.unshift({
        id: deposit._id,
        createdAt: formatDate(deposit.createdAt),
        amount: deposit.amount,
        status: deposit.status,
        transactionType: deposit.transactionType,
        approvedAt: formatDate(deposit.updatedAt),
      });
    });

  return (
    <>
      <MetaData title={` ${user.name} | Deposits  `} />

      {loading && <BackdropLoader />}

      <h1 className='text-lg font-medium uppercase'>transactions: {length}</h1>
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

export default Deposits;
