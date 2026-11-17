import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContactService } from '../../core/services/contact.service';
import { SocialLink, socialMediaLinks } from '../../core/config/social-links';
import { HEAD_OFFICE_MAP_EMBED_URL } from '../../core/config/map.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly contactApi = inject(ContactService);
  readonly socialMedia: SocialLink[] = socialMediaLinks;
  readonly mapEmbedUrl: SafeResourceUrl = inject(DomSanitizer)
    .bypassSecurityTrustResourceUrl(HEAD_OFFICE_MAP_EMBED_URL);

  form = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  };
  submitting = signal(false);
  success = signal('');
  error = signal('');

  submit(): void {
    this.submitting.set(true);
    this.success.set('');
    this.error.set('');

    this.contactApi.create(this.form).subscribe({
      next: (response) => {
        this.success.set(response.message || 'Your message has been sent successfully.');
        this.form = { firstName: '', lastName: '', phone: '', email: '', message: '' };
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'We could not send your message. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}
