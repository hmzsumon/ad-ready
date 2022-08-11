import React from 'react';

const Condition = () => {
  // handle go back
  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div className='pt-20 px-20'>
      <p>
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
