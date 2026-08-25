import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardService } from '../../../core/services/award.service';
import { Award } from '../../../core/models/news.model';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './awards.component.html',
})
export class AwardsComponent implements OnInit {
  private readonly awardsApi = inject(AwardService);

  awards = signal<Award[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.awardsApi.getAwards({ limit: 50 }).subscribe({
      next: (res) => {
        this.awards.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Unable to load awards.');
      },
    });
  }
}
