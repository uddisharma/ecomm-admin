export const seller = {
  legal: {
    aadhar: {
      name: 'Aadhar Holder',
      address: 'Aadhar Address',
      careof: 'Care of Name',
      aadharnumber: '1234 5678 9012',
      signed: true,
    },
    pan: {
      name: 'PAN Holder',
      type: 'Individual',
      pannumber: 'ABCDE1234F',
      signed: true,
    },
    bank: {
      name: 'Bank Name',
      branch: 'Branch Name',
      account: '1234567890',
      ifsc: 'ABCD1234567',
      signed: false,
    },
    gst: 'GST123456789',
    taxid: 'TaxID123',
    certificate: [
      'https://res.cloudinary.com/drchnavue/image/upload/v1697650326/cld-sample-4.jpg',
      'https://res.cloudinary.com/drchnavue/image/upload/v1697650326/cld-sample-4.jpg',
      'https://utfs.io/f/3889fd04-5374-4112-bd17-df7a636ef100-1mnzkx.pdf',
    ],
  },
  shopaddress: {
    pincode: '126102',
    address1: 'Shop Address Line 1',
    address2: 'Shop Address Line 2',
    landmark: 'Near Landmark',
    city: 'City Name',
    state: 'State Name',
  },
  deliverypartner: {
    personal: {
      have: true,
      name: 'Delivery Partner',
      rate: '50',
    },
    partner: {
      email: 'uddibhardwaj08+943@gmail.com',
      password: 'C1G2Z33fVX',
      warehouses: [
        {
          warehouse_name: 'Warehouse Name',
          name: 'My Shop Name',
          address: '140, MG Road',
          address_2: 'Near metro station',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001',
          phone: '9999999999',
          default: true,
          _id: '658900adcf229a290d97e060',
          id: '658900adcf229a290d97e060',
        },
        {
          warehouse_name: 'Warehouse Name 2',
          name: 'My Shop Name',
          address: '140, MG Road',
          address_2: 'Near metro station',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001',
          phone: '9999999999',
          default: false,
          _id: '658900adcf229a290d97e060',
          id: '658900adcf229a290d97e060',
        },
      ],
    },
  },
  rating: {
    rate: '4.2',
    total: '92',
  },
  socialLinks: {
    instagram: 'instagram_url',
    facebook: 'facebook_url',
    youtube: 'youtube_url',
  },
  resetPasswordLink: {
    code: 'reset_code',
    expireTime: '2023-12-31T23:59:59.999Z',
  },
  owner: {
    personal: {
      name: 'Owner Name',
      phone: '9876543210',
      email: 'owner@email.com',
    },
    address: {
      pincode: '654321',
      address1: 'Owner Address Line 1',
      address2: 'Owner Address Line 2',
      landmark: 'Owner Landmark',
      city: 'Owner City',
      state: 'Owner State',
    },
  },
  shopname: 'Shop 3',
  username: 'shop_3',
  cover:
    'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1697650326/cld-sample-3.jpg',
  email: 'sample@email.com',
  mobileNo: '1234567890',
  alternatemobileNo: '9876543210',
  description: 'This is a sample shop description',
  charge: '2.5',
  sellingCategory: [
    {
      category: {
        _id: '657dbe515fa71e5ed0e4fc61',
        name: 'T-Shirt',
        parentCategoryId: {
          _id: '657dbd585fa71e5ed0e4fc20',
          name: 'Top',
          parentCategoryId: {
            _id: '657dbccf5fa71e5ed0e4fc18',
            name: 'Men',
            createdAt: '2023-12-16T15:05:51.895Z',
            updatedAt: '2023-12-16T15:05:51.895Z',
            __v: 0,
            id: '657dbccf5fa71e5ed0e4fc18',
          },
          createdAt: '2023-12-16T15:08:08.837Z',
          updatedAt: '2023-12-16T15:08:08.837Z',
          __v: 0,
          id: '657dbd585fa71e5ed0e4fc20',
        },
        createdAt: '2023-12-16T15:12:17.912Z',
        updatedAt: '2023-12-16T15:12:17.912Z',
        __v: 0,
        id: '657dbe515fa71e5ed0e4fc61',
      },
      photo:
        'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065500/men_tshirt_omodg7.webp',
      _id: '6582baa498f7bc9013510200',
    },
    {
      category: {
        _id: '657dbe9d5fa71e5ed0e4fc67',
        name: 'Jeans',
        parentCategoryId: {
          _id: '657dbd585fa71e5ed0e4fc21',
          name: 'Bottom',
          parentCategoryId: {
            _id: '657dbccf5fa71e5ed0e4fc18',
            name: 'Men',
            createdAt: '2023-12-16T15:05:51.895Z',
            updatedAt: '2023-12-16T15:05:51.895Z',
            __v: 0,
            id: '657dbccf5fa71e5ed0e4fc18',
          },
          createdAt: '2023-12-16T15:08:08.839Z',
          updatedAt: '2023-12-16T15:08:08.839Z',
          __v: 0,
          id: '657dbd585fa71e5ed0e4fc21',
        },
        createdAt: '2023-12-16T15:13:33.471Z',
        updatedAt: '2023-12-16T15:13:33.471Z',
        __v: 0,
        id: '657dbe9d5fa71e5ed0e4fc67',
      },
      photo:
        'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065766/men_jeans_cjm7hw.webp',
      _id: '6582baa498f7bc9013510201',
    },
    {
      category: {
        _id: '657dc03c5fa71e5ed0e4fc9f',
        name: 'Kurta',
        parentCategoryId: {
          _id: '657dbd855fa71e5ed0e4fc2c',
          name: 'Top',
          parentCategoryId: {
            _id: '657dbccf5fa71e5ed0e4fc19',
            name: 'Women',
            createdAt: '2023-12-16T15:05:51.895Z',
            updatedAt: '2023-12-16T15:05:51.895Z',
            __v: 0,
            id: '657dbccf5fa71e5ed0e4fc19',
          },
          createdAt: '2023-12-16T15:08:53.927Z',
          updatedAt: '2023-12-16T15:08:53.927Z',
          __v: 0,
          id: '657dbd855fa71e5ed0e4fc2c',
        },
        createdAt: '2023-12-16T15:20:28.259Z',
        updatedAt: '2023-12-16T15:20:28.259Z',
        __v: 0,
        id: '657dc03c5fa71e5ed0e4fc9f',
      },
      photo:
        'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065886/women_kurta_y9y6n2.webp',
      _id: '6582baa498f7bc9013510202',
    },
    {
      category: {
        _id: '657dc0b95fa71e5ed0e4fcb6',
        name: 'Trousers',
        parentCategoryId: {
          _id: '657dbd855fa71e5ed0e4fc2d',
          name: 'Bottom',
          parentCategoryId: {
            _id: '657dbccf5fa71e5ed0e4fc19',
            name: 'Women',
            createdAt: '2023-12-16T15:05:51.895Z',
            updatedAt: '2023-12-16T15:05:51.895Z',
            __v: 0,
            id: '657dbccf5fa71e5ed0e4fc19',
          },
          createdAt: '2023-12-16T15:08:53.928Z',
          updatedAt: '2023-12-16T15:08:53.928Z',
          __v: 0,
          id: '657dbd855fa71e5ed0e4fc2d',
        },
        createdAt: '2023-12-16T15:22:33.520Z',
        updatedAt: '2023-12-16T15:22:33.520Z',
        __v: 0,
        id: '657dc0b95fa71e5ed0e4fcb6',
      },
      photo:
        'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065999/women_trouser_w0mloi.webp',
      _id: '6582baa498f7bc9013510203',
    },
    {
      category: {
        _id: '657dc18f5fa71e5ed0e4fcdc',
        name: 'Sports',
        parentCategoryId: {
          _id: '657dbd855fa71e5ed0e4fc2f',
          name: 'Shoes',
          parentCategoryId: {
            _id: '657dbccf5fa71e5ed0e4fc19',
            name: 'Women',
            createdAt: '2023-12-16T15:05:51.895Z',
            updatedAt: '2023-12-16T15:05:51.895Z',
            __v: 0,
            id: '657dbccf5fa71e5ed0e4fc19',
          },
          createdAt: '2023-12-16T15:08:53.932Z',
          updatedAt: '2023-12-16T15:08:53.932Z',
          __v: 0,
          id: '657dbd855fa71e5ed0e4fc2f',
        },
        createdAt: '2023-12-16T15:26:07.429Z',
        updatedAt: '2023-12-16T15:26:07.429Z',
        __v: 0,
        id: '657dc18f5fa71e5ed0e4fcdc',
      },
      photo:
        'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703066158/women_shoes_wavheu.webp',
      _id: '6582baa498f7bc9013510204',
    },
    {
      category: {
        _id: '657dbf7a5fa71e5ed0e4fc85',
        name: 'Sports',
        parentCategoryId: {
          _id: '657dbd585fa71e5ed0e4fc23',
          name: 'Shoes',
          parentCategoryId: {
            _id: '657dbccf5fa71e5ed0e4fc18',
            name: 'Men',
            createdAt: '2023-12-16T15:05:51.895Z',
            updatedAt: '2023-12-16T15:05:51.895Z',
            __v: 0,
            id: '657dbccf5fa71e5ed0e4fc18',
          },
          createdAt: '2023-12-16T15:08:08.843Z',
          updatedAt: '2023-12-16T15:08:08.843Z',
          __v: 0,
          id: '657dbd585fa71e5ed0e4fc23',
        },
        createdAt: '2023-12-16T15:17:14.772Z',
        updatedAt: '2023-12-16T15:17:14.772Z',
        __v: 0,
        id: '657dbf7a5fa71e5ed0e4fc85',
      },
      photo:
        'https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703066123/men_shoes_seynus.webp',
      _id: '6582baa498f7bc9013510205',
    },
  ],
  discount: '12%',
  isActive: true,
  createdAt: '2023-12-20T12:45:34.178Z',
  updatedAt: '2023-12-25T04:10:21.253Z',
  id: '6582e1ee9b927756759a544a',
};
