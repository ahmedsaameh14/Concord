import { Component, Input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-3 px-4 font-cairo"
      [class.py-10]="padded"
      [class.py-16]="padded && size === 'lg'"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        class="animate-spin rounded-full border-[3px] border-concord-border border-t-concord-navy"
        [class.h-8]="size === 'sm'"
        [class.w-8]="size === 'sm'"
        [class.h-12]="size === 'md'"
        [class.w-12]="size === 'md'"
        [class.h-14]="size === 'lg'"
        [class.w-14]="size === 'lg'"
      ></div>
      @if (message) {
        <p class="m-0 text-sm text-concord-muted">{{ message }}</p>
      }
      <span class="sr-only">{{ message || 'Loading' }}</span>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() size: SpinnerSize = 'md';
  @Input() padded = true;
}
