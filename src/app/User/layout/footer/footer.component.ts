import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Location {
  name: string;
  address: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  label: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  locations: Location[] = [
    {
      name: 'Head Quarter',
      address: 'Concord 2, Road 307, Ma\'adi, Cairo, Egypt'
    },
    {
      name: 'UAE',
      address: 'Office No. M15 Building Name: ARAB BANK BLDG'
    },
    {
      name: 'KSA',
      address: '2425 Ad Daw Al Lami St. An Nahda, Jeddah'
    },
    {
      name: 'Oman',
      address: 'Muscat Governorate, Oman'
    }
  ];

  companyLinks = [
    { label: 'Projects', route: '/projects' },
    { label: 'History', route: '/history' },
    { label: 'Vision', route: '/vision' }
  ];

  socialMedia: SocialLink[] = [
    {
      name: 'Facebook',
      icon: '/images/facebook.png',
      url: 'https://www.facebook.com/concord4eng/',
      label: 'Visit Concord on Facebook'
    },
    {
      name: 'Instagram',
      icon: '/images/instagram.png',
      url: 'https://www.instagram.com/concord_ec/',
      label: 'Visit Concord on Instagram'
    },
    {
      name: 'LinkedIn',
      icon: '/images/linkedin.png',
      url: 'https://www.linkedin.com/company/concordec/',
      label: 'Visit Concord on LinkedIn'
    }
  ];

  legalLinks = [
    { label: 'Terms and Conditions', route: '/legal/terms' },
    { label: 'Privacy Policy', route: '/legal/privacy' }
  ];
}
