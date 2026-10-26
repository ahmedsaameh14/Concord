export interface SocialLink {
  name: string;
  icon: string;
  url: string;
  label: string;
}

export const socialMediaLinks: SocialLink[] = [
  {
    name: 'Facebook',
    icon: '/images/facebook.png',
    url: 'https://www.facebook.com/concord4eng/',
    label: 'Visit Concord on Facebook',
  },
  {
    name: 'Instagram',
    icon: '/images/instagram.png',
    url: 'https://www.instagram.com/concord_ec/',
    label: 'Visit Concord on Instagram',
  },
  {
    name: 'LinkedIn',
    icon: '/images/linkedin.png',
    url: 'https://www.linkedin.com/company/concordec/',
    label: 'Visit Concord on LinkedIn',
  },
];
