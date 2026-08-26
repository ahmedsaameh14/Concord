import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/contact-message.model';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard-contact-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, LoadingSpinnerComponent],
  templateUrl: './contact-messages.component.html',
})
export class DashboardContactMessagesComponent implements OnInit {
  private readonly contactApi = inject(ContactService);
  private readonly notify = inject(NotificationService);

  messages = signal<ContactMessage[]>([]);
  loading = signal(false);
  error = signal('');
  search = '';

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading.set(true);
    this.error.set('');
    this.contactApi.getMessages(this.search).subscribe({
      next: (response) => {
        this.messages.set(response.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        const message = err?.error?.message || 'Failed to load contact messages.';
        this.error.set(message);
        this.notify.error(message);
        this.loading.set(false);
      },
    });
  }

  onSearchChange(): void {
    this.loadMessages();
  }

  deleteMessage(message: ContactMessage): void {
    if (!confirm(`Delete the message from ${message.firstName} ${message.lastName}?`)) return;

    this.contactApi.delete(message._id).subscribe({
      next: () => {
        this.messages.update((messages) => messages.filter((item) => item._id !== message._id));
        this.notify.success('Contact message deleted successfully.');
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to delete contact message.'),
    });
  }
}
