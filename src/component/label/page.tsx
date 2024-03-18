'use client';
import { UserContext } from '@/store/user/context';
import React, { useContext, useRef } from 'react';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { Button } from 'rizzui';
import { useRouter } from 'next/navigation';
import { FiDownloadCloud } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';

function SellerLabel({ data }: any) {
  const {
    customerId,
    addressId,
    orderItems,
    totalAmount,
    shipping,
    discount,
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
        filename: `${order_id}-label.pdf`,
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
        <div ref={labelRef} className="label-12">
          <h1 style={{ marginBottom: '5px' }} className="heading-12">
            {seller?.shopname}
          </h1>

          <div
            style={{ marginBottom: '10px' }}
            className="section-12 user-details-12"
          >
            <div className="details-12">
              <p>{shippingAddress.name}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.landmark},{' '}
                {shippingAddress.city}, {shippingAddress.state},{' '}
                {shippingAddress.pincode}
              </p>
              <p>Mobile No: {shippingAddress.phone}</p>
              <p>Order Date: {date}</p>
              <p>Order : #{order_id}</p>
              <p>payment : {payment ? 'PAID' : 'NOT PAID'}</p>
            </div>
          </div>
          <div className="section-12 product-details-12">
            <table className="table-12">
              <thead>
                <tr className="tr-12">
                  <th className="th-12">PRODUCT</th>
                  <th className="th-12">PRICE</th>
                  <th className="th-12">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="tbody-12">
                {orderItems?.map((e: any, i: any) => (
                  <tr key={i} className="tr-12">
                    <td className="td-12">
                      {e.productId.name?.split(0, 15) + '...'}
                    </td>
                    <td className="td-12">₹{e.productId.price}</td>
                    <td className="td-12">
                      ₹{e.amount} * {e.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-12 user-details-12 amount-details-12">
            <table className="table-12">
              <tbody className="tbody-12">
                <tr className="tr-12">
                  <td className="td-12">Shipping</td>
                  <td className="td-12">+ ₹{shipping}</td>
                </tr>
                <tr className="tr-12">
                  <td className="td-12">Discount</td>
                  <td className="td-12">- ₹{discount}</td>
                </tr>
                <tr className="tr-12">
                  <td className="td-12">Total</td>
                  <td className="td-12">₹{totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-12 user-details-12">
            {/* <h2>Pickup and Return Address:</h2> */}
            <div className="details-12">
              <p>{`${seller?.shopaddress?.address1}, ${seller?.shopaddress?.address2}, ${seller?.shopaddress?.city}, ${seller?.shopaddress?.state},  ${seller?.shopaddress?.pincode}`}</p>
              <p>Mobile No : {seller?.mobileNo}</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
}

export default SellerLabel;
