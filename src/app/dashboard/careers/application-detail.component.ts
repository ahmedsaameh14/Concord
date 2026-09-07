import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../core/services/career.service';
import { Application } from '../../core/models/career.model';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard-career-application-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, LoadingSpinnerComponent],
  templateUrl: './application-detail.component.html',
})
export class DashboardCareerApplicationDetailComponent implements OnInit {
  private readonly api = inject(CareerService);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);

  careerId = '';
  application = null as Application | null;
  loading = true;
  downloading = false;

  ngOnInit(): void {
    this.careerId = this.route.snapshot.paramMap.get('id') || '';
    const applicationId = this.route.snapshot.paramMap.get('applicationId') || '';
    this.api.application(this.careerId, applicationId).subscribe({
      next: (response) => { this.application = response.data; this.loading = false; },
      error: (error) => { this.notify.error(error?.error?.message || 'Failed to load application.'); this.loading = false; },
    });
  }

  async downloadPdf(): Promise<void> {
    if (!this.application || this.downloading) return;
    this.downloading = true;
    try {
      const response = await fetch(this.application.resumeDownloadUrl || this.application.resumeUrl);
      if (!response.ok) throw new Error('Resume download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = this.application.fullName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'resume';
      link.href = blobUrl;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      this.notify.error('Unable to download the resume PDF.');
    } finally {
      this.downloading = false;
    }
  }
}
