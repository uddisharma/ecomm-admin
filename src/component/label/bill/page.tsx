'use client';
import React, { useRef } from 'react';
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
    sellerId,
  } = data;
  const shippingAddress = customerId.shippingAddress.find(
    (address: any) => address.id === addressId
  );

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
              <p>{sellerId?.shopname}</p>
              <p>{sellerId?.shopaddress?.address1}</p>
              <p>
                {`${sellerId?.shopaddress?.city}, ${sellerId?.shopaddress?.state},  ${sellerId?.shopaddress?.pincode}`}{' '}
              </p>
              <p>Email: {sellerId?.email}</p>
            </div>
          </div>
          <table className="invoice-items">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Color</th>
                <th>Size</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((e: any, i: any) => (
                <tr key={i}>
                  <td>{e.productId.name}</td>
                  <td>
                    {e.productId.price} * {e.quantity}
                  </td>
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
                    ? sellerId?.deliverypartner?.personal?.name
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
                <img
                  src={sellerId?.owner?.signature}
                  alt={`${sellerId?.shopname}'s Signature`}
                />
              </div>
              <p>
                _________________________
                <br />
                {sellerId?.shopname}
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
          Download Bill
        </Button>
      </div>
    </>
  );
};

export default Bill;
