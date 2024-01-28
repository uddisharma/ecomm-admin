'use client';
import { UserContext } from '@/store/user/context';
import React, { useContext, useRef, useState } from 'react';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { Button } from 'rizzui';
import { useRouter } from 'next/navigation';
import { FiDownloadCloud } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
const Bill = ({ data }: any) => {
  const {
    customerId,
    addressId,
    orderItems,
    totalAmount,
    shipping,
    discount,
    courior,
    order_id,
    payment,
    date,
  } = data;
  const shippingAddress = customerId.shippingAddress.find(
    (address: any) => address.id === addressId
  );
  const { state } = useContext(UserContext);
  const seller = state?.user;
  const labelRef = useRef(null);
  const router = useRouter();

  const handleDownloadPDF = () => {
    const input = labelRef.current;
    if (input) {
      const pdfOptions = {
        margin: 10,
        filename: `${order_id}-bill.pdf`,
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
            <h2>Tax Invoice</h2>
          </div>
          <div className="address-section">
            <div className="address-box">
              <h4>BILL TO</h4>
              <p>{shippingAddress.name}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.pincode}
              </p>
              <p>Email: {shippingAddress.email}</p>
            </div>
            {/* Assume shipping details are same as billing for simplicity */}
            <div className="address-box">
              <h4>SHIP TO</h4>
              <p>{shippingAddress.name}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.pincode}
              </p>
              <p>Email: {shippingAddress.email}</p>
            </div>
            {/* Assuming seller details are not available in the provided data */}
            <div className="address-box">
              <h4>SELL BY</h4>
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
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Color</th>
                <th>Size</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((e: any, i: any) => (
                <tr key={i}>
                  <td>{e.productId.name}</td>
                  <td>{e.quantity}</td>
                  <td>{e.color.name}</td>
                  <td>{e.size}</td>
                  <td>{e.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right' }}>
                  <strong>Discount</strong>
                </td>
                <td>{discount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right' }}>
                  <strong>Shipping</strong>
                </td>
                <td>{shipping.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right' }}>
                  <strong>Total</strong>
                </td>
                <td>{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <br />
          <br />
          <div className="bottom">
            <div className="bottom-content">
              <div className="payment-details">
                <p>
                  <strong>Invoice Number:</strong> {order_id}
                </p>
                <p>
                  <strong>Invoice Date:</strong> {date}
                </p>
                <p>
                  <strong>Order ID:</strong> {order_id}
                </p>
                <p>
                  <strong>Payment ID:</strong> {payment ? 'PAID' : 'NOT PAID'}
                </p>
                <p>
                  <strong>Payment Method:</strong>{' '}
                  {/* Payment method is not available in the provided data */}
                </p>
                <p>
                  <strong>Courior: </strong>
                  {courior == 'Local'
                    ? seller?.deliverypartner?.personal?.name
                    : courior}
                </p>
                <p>
                  <strong>Payment Status:</strong>{' '}
                  {payment ? 'Paid' : 'Not Paid'}
                </p>
                <p>
                  Thank you for dropping by! Enjoy placing your order and have a
                  delightful experience!
                </p>
              </div>
            </div>
            <div className="signature-section">
              <div className="signature">
                {/* Placeholder for seller signature */}
                <img
                  src="https://p.kindpng.com/picc/s/26-264820_signatures-samples-png-ron-paul-signature-transparent-png.png"
                  alt="Signature"
                  style={{ width: '150px', height: 'auto' }}
                />
              </div>
              <p>
                _________________________
                <br />
                {seller?.shopname}
                <br />
                {date}
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
          Download Label
        </Button>
      </div>
    </>
  );
};

export default Bill;
