import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AwardService } from '../../core/services/award.service';
import { FormDraftService } from '../../core/services/form-draft.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

interface AwardFormDraft {
  title: string;
  subtitle: string;
  sortOrder: number;
  isActive: boolean;
}

@Component({
  selector: 'app-dashboard-award-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './award-form.component.html',
})
export class DashboardAwardFormComponent implements OnInit {
  private readonly awardsApi = inject(AwardService);
  private readonly drafts = inject(FormDraftService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEdit = false;
  awardId = '';
  draftKey = 'award_create';
  loading = signal(false);
  saving = signal(false);
  draftRestored = signal(false);

  form: AwardFormDraft = {
    title: '',
    subtitle: '',
    sortOrder: 0,
    isActive: true,
  };

  existingImage = '';
  imageFile: File | null = null;
  imagePreview = '';
  private draftTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.awardId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = Boolean(this.awardId);
    this.draftKey = this.isEdit ? `award_edit_${this.awardId}` : 'award_create';

    if (this.isEdit) {
      this.loadAward();
    } else {
      this.restoreDraft();
    }
  }

  onFormChange(): void {
    if (this.draftTimer) clearTimeout(this.draftTimer);
    this.draftTimer = setTimeout(() => this.persistDraft(), 400);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
    this.imageFile = file;
    this.imagePreview = file ? URL.createObjectURL(file) : '';
    this.onFormChange();
  }

  clearDraft(): void {
    this.drafts.clear(this.draftKey);
    this.draftRestored.set(false);
    this.notify.info('Draft cleared.');
  }

  submit(): void {
    if (!this.form.title.trim() || !this.form.subtitle.trim()) {
      this.notify.warning('Title and subtitle are required.');
      return;
    }
    if (!this.isEdit && !this.imageFile) {
      this.notify.warning('Award image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.title.trim());
    formData.append('subtitle', this.form.subtitle.trim());
    formData.append('sortOrder', String(this.form.sortOrder || 0));
    formData.append('isActive', String(this.form.isActive));
    if (this.imageFile) formData.append('image', this.imageFile);

    this.saving.set(true);
    const request$ = this.isEdit
      ? this.awardsApi.update(this.awardId, formData)
      : this.awardsApi.create(formData);

    request$.subscribe({
      next: (res) => {
        this.saving.set(false);
        this.notify.success(res.message || 'Saved successfully.');
        this.drafts.clear(this.draftKey);
        this.draftRestored.set(false);
        const id = res.data?._id;
        if (!this.isEdit && id) {
          this.router.navigate(['/dashboard/awards', id, 'edit']);
        } else if (res.data) {
          this.existingImage = res.data.image;
          this.imageFile = null;
          if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
          this.imagePreview = '';
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.notify.error(err?.error?.message || 'Failed to save award.');
      },
    });
  }

  private loadAward(): void {
    this.loading.set(true);
    this.awardsApi.getBySlugOrId(this.awardId, true).subscribe({
      next: (res) => {
        const award = res.data;
        this.form = {
          title: award.title || '',
          subtitle: award.subtitle || '',
          sortOrder: award.sortOrder || 0,
          isActive: award.isActive !== false,
        };
        this.existingImage = award.image || '';
        this.restoreDraft();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notify.error(err?.error?.message || 'Failed to load award.');
      },
    });
  }

  private restoreDraft(): void {
    const draft = this.drafts.load<AwardFormDraft>(this.draftKey);
    if (!draft) return;
    this.form = { ...this.form, ...draft };
    this.draftRestored.set(true);
  }

  private persistDraft(): void {
    this.drafts.save(this.draftKey, { ...this.form });
  }
}
