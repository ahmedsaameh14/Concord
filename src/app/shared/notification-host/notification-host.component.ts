import { Component, inject } from '@angular/core';
import { NotificationService, NotificationType } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-host',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 top-4 z-[2000] flex flex-col items-end gap-2 px-4 sm:top-6 sm:px-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      @for (item of notifications.items(); track item.id) {
        <div
          class="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_12px_32px_rgba(15,28,44,0.14)] font-cairo text-[0.92rem] animate-[toast-in_0.25s_ease]"
          [class]="toneClass(item.type)"
          role="status"
        >
          <span class="mt-[0.1rem] shrink-0" aria-hidden="true">
            <i [class]="iconClass(item.type)"></i>
          </span>
          <p class="m-0 flex-1 leading-snug">{{ item.message }}</p>
          <button
            type="button"
            class="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent opacity-70 transition hover:opacity-100"
            [attr.aria-label]="'Dismiss notification'"
            (click)="notifications.dismiss(item.id)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class NotificationHostComponent {
  readonly notifications = inject(NotificationService);

  toneClass(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'border-[#abefc6] bg-[#ecfdf3] text-concord-success';
      case 'error':
        return 'border-[#fecdca] bg-[#fef3f2] text-concord-danger';
      case 'warning':
        return 'border-[#fedf89] bg-[#fffaeb] text-[#b54708]';
      default:
        return 'border-[#b2ddff] bg-[#eff8ff] text-[#175cd3]';
    }
  }

  iconClass(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-circle-check';
      case 'error':
        return 'fa-solid fa-circle-exclamation';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      default:
        return 'fa-solid fa-circle-info';
    }
  }
}
