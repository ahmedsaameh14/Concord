import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CareerService } from '../../core/services/career.service';
import { Career } from '../../core/models/career.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({ selector: 'app-careers', standalone: true, imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent], templateUrl: './careers.component.html', styleUrl: './careers.component.css' })
export class CareersComponent implements OnInit {
  private readonly api = inject(CareerService);
  careers = signal<Career[]>([]); loading = signal(true); error = signal('');
  search = ''; page = 1; totalPages = 0; total = 0;
  ngOnInit(): void { this.load(); }
  load(): void { this.loading.set(true); this.api.list(this.search, this.page).subscribe({ next: (r) => { this.careers.set(r.data || []); this.total = r.meta.total; this.totalPages = r.meta.totalPages; this.loading.set(false); }, error: (e) => { this.error.set(e?.error?.message || 'Unable to load careers.'); this.loading.set(false); } }); }
  searchChanged(): void { this.page = 1; this.load(); }
  go(page: number): void { if (page >= 1 && page <= this.totalPages) { this.page = page; this.load(); } }
}
