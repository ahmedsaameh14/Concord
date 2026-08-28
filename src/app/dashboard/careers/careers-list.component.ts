import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; import { FormsModule } from '@angular/forms'; import { RouterLink } from '@angular/router';
import { CareerService } from '../../core/services/career.service'; import { Career } from '../../core/models/career.model'; import { NotificationService } from '../../core/services/notification.service'; import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
@Component({ selector: 'app-dashboard-careers-list', standalone: true, imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent], templateUrl: './careers-list.component.html' })
export class DashboardCareersListComponent implements OnInit {
	private readonly api = inject(CareerService);
	private readonly notify = inject(NotificationService);

	careers = signal<Career[]>([]);
	loading = signal(false);
	error = signal('');
	search = '';
	page = 1;
	totalPages = 0;
	total = 0;

	ngOnInit(): void { this.load(); }

	load(): void {
		this.loading.set(true);
		this.api.list(this.search, this.page, 10, true).subscribe({
			next: (response) => {
				this.careers.set(response.data || []);
				this.total = response.meta.total;
				this.totalPages = response.meta.totalPages;
				this.loading.set(false);
			},
			error: (error) => {
				this.error.set(error?.error?.message || 'Failed to load careers.');
				this.loading.set(false);
			},
		});
	}

	apply(): void { this.page = 1; this.load(); }

	go(page: number): void {
		if (page >= 1 && page <= this.totalPages) {
			this.page = page;
			this.load();
		}
	}

	toggleStatus(career: Career): void {
		this.api.toggleStatus(career._id, !career.isActive).subscribe({
			next: (response) => {
				career.isActive = response.data.isActive;
				this.careers.update((careers) => [...careers]);
				this.notify.success(response.message);
			},
			error: (error) => this.notify.error(error?.error?.message || 'Failed to update career status.'),
		});
	}

	remove(career: Career): void {
		if (!confirm(`Delete career "${career.title}" and its applications?`)) return;
		this.api.delete(career._id).subscribe({
			next: () => { this.notify.success('Career deleted successfully.'); this.load(); },
			error: (error) => this.notify.error(error?.error?.message || 'Failed to delete career.'),
		});
	}
}
