import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

const CopyBtn = ({ text, icon }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div>
      <CopyToClipboard text={text} onCopy={() => setCopied({ copied: true })}>
        <button
          className={`${
            copied ? 'text-blue-500 ' : ''
          }text-sm font-bold  border mx-auto  border-blue-500 rounded  transition`}
          onClick={copyToClipboard}
        >
          <span
            className={`text-2xl font-semibold  ${
              copied ? 'text-blue-500' : 'text-gray-800'
            }`}
          >
            {icon}
          </span>
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default CopyBtn;
