import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly contactApi = inject(ContactService);

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
