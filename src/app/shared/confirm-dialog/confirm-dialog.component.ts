import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#16283d]/60 p-4"
        role="presentation"
        (click)="cancel()"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-[#e6ebf2] bg-white p-5 shadow-[0_20px_60px_rgba(22,40,61,0.2)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-message"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-start gap-4">
            <div class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fef3f2] text-concord-danger">
              <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            </div>
            <div>
              <h2 id="confirm-dialog-title" class="m-0 text-lg font-semibold text-concord-navy">{{ title }}</h2>
              <p id="confirm-dialog-message" class="mt-2 mb-0 whitespace-pre-wrap text-sm leading-6 text-concord-muted">{{ message }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-concord-border bg-white px-4 py-2 text-sm font-semibold text-concord-ink transition hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c5fd]"
              (click)="cancel()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-lg border-0 bg-concord-danger px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fda29b]"
              (click)="confirm()"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirm deletion';
  @Input() message = 'Are you sure you want to delete this item?';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  closeWithEscape(): void {
    if (this.open) this.cancel();
  }

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
