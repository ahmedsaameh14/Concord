import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _items = signal<AppNotification[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly items = this._items.asReadonly();

  success(message: string, durationMs = 4000): void {
    this.push('success', message, durationMs);
  }

  error(message: string, durationMs = 5000): void {
    this.push('error', message, durationMs);
  }

  info(message: string, durationMs = 4000): void {
    this.push('info', message, durationMs);
  }

  warning(message: string, durationMs = 4500): void {
    this.push('warning', message, durationMs);
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._items.update((list) => list.filter((item) => item.id !== id));
  }

  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this._items.set([]);
  }

  private push(type: NotificationType, message: string, durationMs: number): void {
    const trimmed = message?.trim();
    if (!trimmed) return;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    this._items.update((list) => [...list, { id, type, message: trimmed }]);

    if (durationMs > 0) {
      const timer = setTimeout(() => this.dismiss(id), durationMs);
      this.timers.set(id, timer);
    }
  }
}
