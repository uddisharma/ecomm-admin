'use client';
import { UserContext } from '@/store/user/context';
import React, { useContext, useRef } from 'react';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { Button } from 'rizzui';
import { useRouter } from 'next/navigation';
import { FiDownloadCloud } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { formatDate } from '@/utils/format-date';
const Recipet = ({ data }: any) => {
  const seller = data?.seller;
  const labelRef = useRef(null);
  const router = useRouter();

  const handleDownloadPDF = () => {
    const input = labelRef.current;
    if (input) {
      const pdfOptions = {
        margin: 10,
        filename: `${'order_id'}-bill.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf(input, pdfOptions);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          marginTop: '50px',
        }}
      >
        <div ref={labelRef} className="invoice">
          <div className="invoice-header">
            <h2>Payout Receipt</h2>
          </div>
          <div className="address-section">
            <div className="address-box">
              <h4>Paid From </h4>
              <p>The Medium Cart Pvt Ltd </p>
              <p>VPO Nidani</p>
              <p>Jind Haryana (126102)</p>
              <p>Email: payouts@mediumcart.com</p>
            </div>

            <div className="address-box">
              <h4>Paid To</h4>
              <p>{seller?.shopname}</p>
              <p>{seller?.shopaddress?.address1}</p>
              <p>
                {`${seller?.shopaddress?.city}, ${seller?.shopaddress?.state},  ${seller?.shopaddress?.pincode}`}{' '}
              </p>
              <p>Email: {seller?.email}</p>
            </div>
          </div>
          <table className="invoice-items">
            <thead>
              <tr>
                <th>Transaction Id</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Payment Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.transactionId.toUpperCase() ?? ''}</td>
                <td>{formatDate(data?.from, 'MMMM D, YYYY')}</td>
                <td>{formatDate(data?.to, 'MMMM D, YYYY')}</td>
                <td>{formatDate(data?.createdAt, 'MMMM D, YYYY')}</td>
                <td>₹{data?.amount}.00</td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
          <div className="bottom">
            <div className="bottom-content">
              <div className="payment-details">
                <p>
                  <strong>Receipt Date:</strong>{' '}
                  {formatDate(new Date(), 'MMMM D, YYYY')}
                </p>
                <p>
                  <strong>Transaction ID:</strong>{' '}
                  {data?.transactionId.toUpperCase()}
                </p>

                <p>
                  <strong>Payment Method:</strong> Bank Transfer
                </p>

                <p>
                  <strong>Payment Status:</strong> Paid
                </p>
                <p>
                  Thank you for being a seller on our platform! We appreciate
                  your partnership and look forward to growing together.
                </p>
              </div>
            </div>
            <div className="signature-section">
              <div className="signature">
                {/* Placeholder for seller signature */}
                <img
                  // src="https://p.kindpng.com/picc/s/26-264820_signatures-samples-png-ron-paul-signature-transparent-png.png"
                  src={seller?.owner?.signature}
                  alt={`${seller?.shopname}'s signature`}
                  style={{ width: '150px', height: 'auto' }}
                />
              </div>
              <p>
                _________________________
                <br />
                {seller?.shopname}
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '50px',
        }}
      >
        <Button
          onClick={() => {
            router.back();
          }}
          className="mt-5"
          variant="solid"
        >
          <IoIosArrowBack className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button className="mt-5" onClick={handleDownloadPDF} variant="solid">
          <FiDownloadCloud className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      </div>
    </>
  );
};

export default Recipet;
