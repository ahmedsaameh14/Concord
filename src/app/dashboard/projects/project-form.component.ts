import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { PROJECT_TYPES } from '../../core/config/api.config';
import { KeyFeatureSection } from '../../core/models/project.model';

interface FeatureSectionForm {
  title: string;
  value: string;
  itemsText: string;
}

interface PendingGalleryItem {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-dashboard-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
})
export class DashboardProjectFormComponent implements OnInit {
  private readonly projectsApi = inject(ProjectService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly projectTypes = PROJECT_TYPES;
  readonly currentYear = new Date().getFullYear();

  isEdit = false;
  projectId = '';
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  form = {
    name: '',
    overview: '',
    startYear: this.currentYear,
    endYear: this.currentYear,
    address: '',
    location: '',
    client: '',
    contractValue: '',
    type: 'construction',
    isActive: true,
  };

  existingMainImage = '';
  existingGallery: string[] = [];
  mainImageFile: File | null = null;
  pendingGallery: PendingGalleryItem[] = [];
  mainImagePreview = '';

  sections: FeatureSectionForm[] = [{ title: '', value: '', itemsText: '' }];

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = Boolean(this.projectId);

    if (this.isEdit) {
      this.loadProject();
    }
  }

  loadProject(): void {
    this.loading.set(true);
    this.projectsApi.getBySlugOrId(this.projectId, true).subscribe({
      next: (res) => {
        const project = res.data;
        this.form = {
          name: project.name || '',
          overview: project.overview || '',
          startYear: project.startYear || this.currentYear,
          endYear: project.endYear || project.startYear || this.currentYear,
          address: project.address || '',
          location: project.location || '',
          client: project.client || '',
          contractValue: project.contractValue || '',
          type: project.type || 'construction',
          isActive: project.isActive !== false,
        };

        this.existingMainImage = project.mainImage || '';
        this.existingGallery = [...(project.ProjectImages || [])];

        const sections = project.keyFeatures?.sections || [];
        this.sections = sections.length
          ? sections.map((section) => ({
              title: section.title || '',
              value: section.value || '',
              itemsText: (section.items || []).join('\n'),
            }))
          : [{ title: '', value: '', itemsText: '' }];

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load project.');
      },
    });
  }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.mainImageFile = file;
    this.mainImagePreview = file ? URL.createObjectURL(file) : '';
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    files.forEach((file) => {
      this.pendingGallery.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    input.value = '';
  }

  removeExistingGalleryImage(index: number): void {
    if (index < 0 || index >= this.existingGallery.length) return;
    this.existingGallery = this.existingGallery.filter((_, i) => i !== index);
  }

  removePendingGalleryImage(index: number): void {
    if (index < 0 || index >= this.pendingGallery.length) return;
    const [removed] = this.pendingGallery.splice(index, 1);
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }
  }

  addSection(): void {
    this.sections.push({ title: '', value: '', itemsText: '' });
  }

  removeSection(index: number): void {
    if (this.sections.length === 1) {
      this.sections[0] = { title: '', value: '', itemsText: '' };
      return;
    }
    this.sections.splice(index, 1);
  }

  submit(): void {
    this.error.set('');
    this.success.set('');

    if (!this.auth.isAuthenticated()) {
      this.error.set('Connect an admin session first to create or update projects.');
      return;
    }

    const formData = this.buildFormData();
    if (!formData) return;

    this.saving.set(true);

    const request$ = this.isEdit
      ? this.projectsApi.update(this.projectId, formData)
      : this.projectsApi.create(formData);

    request$.subscribe({
      next: (res) => {
        this.saving.set(false);
        this.success.set(res.message || 'Saved successfully.');
        const id = res.data?._id;
        if (!this.isEdit && id) {
          this.router.navigate(['/dashboard/projects', id, 'edit']);
        } else if (res.data) {
          this.existingMainImage = res.data.mainImage;
          this.existingGallery = [...(res.data.ProjectImages || [])];
          this.mainImageFile = null;
          this.pendingGallery.forEach((item) => URL.revokeObjectURL(item.preview));
          this.pendingGallery = [];
          this.mainImagePreview = '';
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to save project.');
      },
    });
  }

  private buildFormData(): FormData | null {
    const required: Array<[string, string | number]> = [
      ['name', this.form.name],
      ['overview', this.form.overview],
      ['startYear', this.form.startYear],
      ['endYear', this.form.endYear],
      ['address', this.form.address],
      ['location', this.form.location],
      ['client', this.form.client],
      ['contractValue', this.form.contractValue],
      ['type', this.form.type],
    ];

    const missing = required
      .filter(([, value]) => !String(value || '').trim())
      .map(([key]) => key);

    if (!this.isEdit && !this.mainImageFile) {
      missing.push('mainImage');
    }

    if (missing.length) {
      this.error.set(`Missing required fields: ${missing.join(', ')}`);
      return null;
    }

    if (Number(this.form.endYear) < Number(this.form.startYear)) {
      this.error.set('End year cannot be before start year.');
      return null;
    }

    const sections: KeyFeatureSection[] = this.sections
      .filter((section) => section.title.trim())
      .map((section) => {
        const items = section.itemsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        return {
          title: section.title.trim(),
          value: section.value.trim(),
          ...(items.length ? { items } : {}),
        };
      });

    const formData = new FormData();
    formData.append('name', this.form.name.trim());
    formData.append('overview', this.form.overview.trim());
    formData.append('startYear', String(this.form.startYear));
    formData.append('endYear', String(this.form.endYear));
    formData.append('address', this.form.address.trim());
    formData.append('location', this.form.location.trim().toLowerCase());
    formData.append('client', this.form.client.trim());
    formData.append('contractValue', this.form.contractValue.trim());
    formData.append('type', this.form.type);
    formData.append('isActive', String(this.form.isActive));
    formData.append('keyFeatures', JSON.stringify({ sections }));
    formData.append('existingProjectImages', JSON.stringify(this.existingGallery));

    if (this.mainImageFile) {
      formData.append('mainImage', this.mainImageFile);
    }

    this.pendingGallery.forEach((item) => {
      formData.append('ProjectImages', item.file);
    });

    return formData;
  }
}
