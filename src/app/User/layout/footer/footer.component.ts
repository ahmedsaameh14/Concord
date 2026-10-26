import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocialLink, socialMediaLinks } from '../../../core/config/social-links';

interface Location {
  name: string;
  address: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  locations: Location[] = [
    {
      name: 'Head Quarter',
      address: "Concord 2, Road 307, Ma'adi, Cairo, Egypt",
    },
    {
      name: 'UAE',
      address: 'Office No. M15 Building Name: ARAB BANK BLDG',
    },
    {
      name: 'KSA',
      address: '2425 Ad Daw Al Lami St. An Nahda, Jeddah',
    },
    {
      name: 'Oman',
      address: 'Muscat Governorate, Oman',
    },
  ];

  companyLinks = [
    { label: 'Projects', route: '/projects' },
    { label: 'History', route: '/history' },
    { label: 'Vision', route: '/vision' },
  ];

  socialMedia: SocialLink[] = socialMediaLinks;

  legalLinks = [
    { label: 'Terms and Conditions', route: '/legal/terms' },
    { label: 'Privacy Policy', route: '/legal/privacy' },
  ];
}
