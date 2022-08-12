import React from 'react';
import { BiRadioCircleMarked } from 'react-icons/bi';
import { BsDot } from 'react-icons/bs';

const Condition = () => {
  // handle go back
  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div className='pt-20 px-4 md:px-20 space-y-4'>
      <h1 className='text-2xl font-medium text-gray-800'>Terms of Service</h1>
      <p className='text-gray-400 text-sm'>
        Ad Ready is a trusted company to earn money online in various ways.
        There are unlimited earning opportunities here.
      </p>
      <div>
        <h4 className=' flex items-center'>
          <span>
            <BiRadioCircleMarked />{' '}
          </span>
          Means of earning
        </h4>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          Earn 3% profit of active balance by completing daily tasks. The daily
          active balance will increase.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          You can earn unlimited by sponsoring here. You will get a 5% profit on
          the first deposit of sponsored person.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          You will get 1% profit as royalty bonus of the sponsored person
          working daily.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          Get 2% cashback on active balance instantly by activating account.
        </p>
      </div>

      <div>
        <h4 className=' flex items-center'>
          <span>
            <BiRadioCircleMarked />{' '}
          </span>
          Working rules
        </h4>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          You need to activate the account for it to work.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          Minimum 3000tk in your main balance to activate account
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          You decide when you activate the account how many tasks you want to do
          per day.
        </p>
        <p className=' ml-4 flex text-red-500 items-center'>
          <span>
            <BsDot />{' '}
          </span>
          If you don't have minimum active balance of 3000 BDT you will not get
          any job .
        </p>
      </div>

      <div>
        <h4 className=' flex items-center'>
          <span>
            <BiRadioCircleMarked />{' '}
          </span>
          Withdrawal Rules
        </h4>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          A 10% charge applies to withdrawals.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          You can withdraw your money anytime.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          If you want to withdraw before 30 working days, you can only withdraw
          your main balance and a 10% charge is applicable. Your account may be
          suspended.
        </p>
        <p className=' ml-4 flex items-center'>
          <span>
            <BsDot />{' '}
          </span>
          After 30 working days you can withdraw your money with profit
        </p>
        <p className=' ml-4 flex text-red-500 items-center'>
          <span>
            <BsDot />{' '}
          </span>
          If you don't have a minimum balance of BDT 3000 after your withdrawal
          then you will not be able to do anything.
        </p>
        <p className=' ml-4 flex  items-center'>
          <span>
            <BsDot />{' '}
          </span>
          You will get your money within 12 hours of withdrawal request
        </p>
      </div>
      <p className=' text-sm font-semibold text-gray-800 '>
        The Terms of Service constitutes a contract between us. The Terms
        include the provisions set forth in this document and in the Privacy
        Policy, User Guidelines and other terms or conditions that may be
        presented by us and accepted by you from time to time in connection with
        specific Service offerings (all of which we collectively refer to as the
        "Terms of Service" or "Terms"). If you do not agree to these Terms, you
        do not have the right to access or use our Service or purchase any
        products or services from the ClixBlue website. If you do register for
        or otherwise use our Service, or purchase any products or services, you
        shall be deemed to confirm your acceptance of the Terms and your
        agreement to be a party to this binding contract. By using the Service
        and purchasing any products in the ClixBlue website, you acknowledge,
        accept and agree with all provisions of the Privacy Policy, including,
        without limitation, the use and treatment of your Account Information
        and your Content in accordance with such Privacy Policy.
      </p>
      {/* Go back button */}
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={handleGoBack}
      >
        Go back
      </button>
    </div>
  );
};

export default Condition;
