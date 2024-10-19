import { Metadata } from 'next';

const TITLE = 'Mediumcart';
const DESCRIPTION =
  'Welcome to Mediumcart, your one-stop destination for unique products from a variety of sellers. Explore our curated selection, shop with ease, and support independent businesses. Join our community today and discover a world of shopping possibilities!';

const PREVIEW_IMAGE_URL = 'https://app.100xdevs/banner-img.jpeg';
const ALT_TITLE = 'Sell online with minimal charges';
const BASE_URL = 'http://localhost:3000';

export const siteConfig: Metadata = {
  title: {
    default: 'Thribute | Admin Panel',
    template: '%s | Thribute Admin Panel',
  },
  description: DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
  applicationName: 'Thribute',
  creator: 'Deepak Sharma',
  twitter: {
    creator: '@uddisharma',
    title: TITLE,
    description: DESCRIPTION,
    card: 'summary_large_image',
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'mediumcart',
    url: BASE_URL,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  category: 'Ecommerce',
  alternates: {
    canonical: BASE_URL,
  },
  keywords: ['Ecommerce', 'Sell online', 'Mediumcart'],
  metadataBase: new URL(BASE_URL),
};
