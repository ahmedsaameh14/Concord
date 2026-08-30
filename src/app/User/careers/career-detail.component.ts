import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../core/services/career.service';

@Component({ selector: 'app-career-detail', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './career-detail.component.html', styleUrls: ['./career-detail.component.css'] })
export class CareerDetailComponent implements OnInit {
  private readonly api = inject(CareerService); private readonly route = inject(ActivatedRoute);
  career = signal<any>(null); loading = signal(true); success = signal(''); error = signal(''); submitting = signal(false); agreed = false;
  form = { firstName: '', lastName: '', email: '', phone: '', coverLetter: '', cvLink: '' };
  ngOnInit(): void { this.api.get(this.route.snapshot.paramMap.get('id') || '').subscribe({ next: r => { this.career.set(r.data); this.loading.set(false); }, error: e => { this.error.set(e?.error?.message || 'Career not found.'); this.loading.set(false); } }); }
  submit(): void { if (!this.agreed) { this.error.set('Please agree to data storage before applying.'); return; } this.submitting.set(true); this.error.set(''); this.api.apply(this.career()._id, { ...this.form, agreedToDataStorage: true }).subscribe({ next: r => { this.success.set(r.message); this.submitting.set(false); this.form = { firstName: '', lastName: '', email: '', phone: '', coverLetter: '', cvLink: '' }; this.agreed = false; }, error: e => { this.error.set(e?.error?.message || 'Unable to submit application.'); this.submitting.set(false); } }); }
}
