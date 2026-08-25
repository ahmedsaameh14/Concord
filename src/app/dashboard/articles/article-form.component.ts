import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { FormDraftService } from '../../core/services/form-draft.service';
import { NotificationService } from '../../core/services/notification.service';
import { ARTICLE_TAGS } from '../../core/config/api.config';
import { ArticleSocialLinks } from '../../core/models/news.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

interface ArticleFormDraft {
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  isTopArticle: boolean;
  isActive: boolean;
  socialLinks: ArticleSocialLinks;
}

@Component({
  selector: 'app-dashboard-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './article-form.component.html',
  styles: [
    `
      .rich-editor :is(h2, h3) {
        margin: 0.85rem 0 0.45rem;
        font-size: 1.2rem;
        font-weight: 700;
        color: #16283d;
      }
      .rich-editor ul,
      .rich-editor ol {
        margin: 0.5rem 0;
        padding-left: 1.25rem;
      }
      .rich-editor a {
        color: #175cd3;
        font-weight: 600;
        text-decoration: underline;
      }
      .rich-editor strong,
      .rich-editor b {
        font-weight: 700;
      }
    `,
  ],
})
export class DashboardArticleFormComponent implements OnInit, OnDestroy {
  private readonly articlesApi = inject(ArticleService);
  private readonly drafts = inject(FormDraftService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tags = ARTICLE_TAGS;

  isEdit = false;
  articleId = '';
  draftKey = 'article_create';
  loading = signal(false);
  saving = signal(false);
  draftRestored = signal(false);

  form: ArticleFormDraft = {
    title: '',
    description: '',
    tags: [],
    publishedAt: new Date().toISOString().slice(0, 10),
    isTopArticle: false,
    isActive: true,
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
  };

  existingImage = '';
  imageFile: File | null = null;
  imagePreview = '';

  private draftTimer: ReturnType<typeof setTimeout> | null = null;
  private editorEl: HTMLDivElement | null = null;
  private skipNextEditorPersist = false;

  @ViewChild('editor')
  set editor(ref: ElementRef<HTMLDivElement> | undefined) {
    this.editorEl = ref?.nativeElement || null;
    if (this.editorEl) {
      this.syncEditorFromForm(true);
    }
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = Boolean(this.articleId);
    this.draftKey = this.isEdit ? `article_edit_${this.articleId}` : 'article_create';

    if (this.isEdit) {
      this.loadArticle();
    } else {
      this.restoreDraft(false);
    }
  }

  ngOnDestroy(): void {
    if (this.draftTimer) clearTimeout(this.draftTimer);
  }

  onFormChange(): void {
    if (this.draftTimer) clearTimeout(this.draftTimer);
    this.draftTimer = setTimeout(() => this.persistDraft(), 400);
  }

  onEditorInput(): void {
    if (!this.editorEl) return;
    if (this.skipNextEditorPersist) {
      this.skipNextEditorPersist = false;
      return;
    }
    this.form.description = this.normalizeEditorHtml(this.editorEl.innerHTML);
    this.onFormChange();
  }

  applyFormat(command: 'bold' | 'insertUnorderedList' | 'insertOrderedList'): void {
    this.runEditorCommand(command);
  }

  applyHeading(): void {
    this.focusEditor();
    const ok = document.execCommand('formatBlock', false, 'h2');
    if (!ok) document.execCommand('formatBlock', false, '<h2>');
    this.onEditorInput();
  }

  applyParagraph(): void {
    this.focusEditor();
    const ok = document.execCommand('formatBlock', false, 'p');
    if (!ok) document.execCommand('formatBlock', false, '<p>');
    this.onEditorInput();
  }

  applyLink(): void {
    this.focusEditor();
    const url = window.prompt('Enter link URL (https://...)');
    if (!url?.trim()) return;
    document.execCommand('createLink', false, url.trim());
    this.onEditorInput();
  }

  toggleTag(tag: string): void {
    if (this.form.tags.includes(tag)) {
      this.form.tags = this.form.tags.filter((item) => item !== tag);
    } else {
      this.form.tags = [...this.form.tags, tag];
    }
    this.onFormChange();
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
    if (this.editorEl) {
      this.form.description = this.normalizeEditorHtml(this.editorEl.innerHTML);
    }

    if (!this.form.title.trim() || this.isEmptyHtml(this.form.description)) {
      this.notify.warning('Title and description are required.');
      return;
    }
    if (!this.isEdit && !this.imageFile) {
      this.notify.warning('Article image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.title.trim());
    formData.append('description', this.form.description.trim());
    formData.append('tags', JSON.stringify(this.form.tags));
    formData.append(
      'socialLinks',
      JSON.stringify({
        facebook: this.form.socialLinks.facebook?.trim() || '',
        instagram: this.form.socialLinks.instagram?.trim() || '',
        twitter: this.form.socialLinks.twitter?.trim() || '',
      })
    );
    formData.append('publishedAt', this.form.publishedAt);
    formData.append('isTopArticle', String(this.form.isTopArticle));
    formData.append('isActive', String(this.form.isActive));
    if (this.imageFile) formData.append('image', this.imageFile);

    this.saving.set(true);
    const request$ = this.isEdit
      ? this.articlesApi.update(this.articleId, formData)
      : this.articlesApi.create(formData);

    request$.subscribe({
      next: (res) => {
        this.saving.set(false);
        this.notify.success(res.message || 'Saved successfully.');
        this.drafts.clear(this.draftKey);
        this.draftRestored.set(false);
        const id = res.data?._id;
        if (!this.isEdit && id) {
          this.router.navigate(['/dashboard/articles', id, 'edit']);
        } else if (res.data) {
          this.existingImage = res.data.image;
          this.form.description = res.data.description || this.form.description;
          this.form.socialLinks = {
            facebook: res.data.socialLinks?.facebook || '',
            instagram: res.data.socialLinks?.instagram || '',
            twitter: res.data.socialLinks?.twitter || '',
          };
          this.syncEditorFromForm(true);
          this.imageFile = null;
          if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
          this.imagePreview = '';
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.notify.error(err?.error?.message || 'Failed to save article.');
      },
    });
  }

  private loadArticle(): void {
    this.loading.set(true);
    this.articlesApi.getBySlugOrId(this.articleId, true).subscribe({
      next: (res) => {
        const article = res.data;
        this.form = {
          title: article.title || '',
          description: article.description || '',
          tags: [...(article.tags || [])],
          publishedAt: (article.publishedAt || article.createdAt || '').slice(0, 10),
          isTopArticle: !!article.isTopArticle,
          isActive: article.isActive !== false,
          socialLinks: {
            facebook: article.socialLinks?.facebook || '',
            instagram: article.socialLinks?.instagram || '',
            twitter: article.socialLinks?.twitter || '',
          },
        };
        this.existingImage = article.image || '';
        this.restoreDraft(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notify.error(err?.error?.message || 'Failed to load article.');
      },
    });
  }

  /** @param preferServer On edit: never let an empty draft wipe loaded description */
  private restoreDraft(preferServer: boolean): void {
    const draft = this.drafts.load<ArticleFormDraft>(this.draftKey);
    if (!draft) return;

    const draftDescription = draft.description || '';
    const keepServerDescription =
      preferServer &&
      !this.isEmptyHtml(this.form.description) &&
      this.isEmptyHtml(draftDescription);

    this.form = {
      ...this.form,
      ...draft,
      description: keepServerDescription ? this.form.description : draftDescription || this.form.description,
      tags: draft.tags?.length ? draft.tags : this.form.tags,
      socialLinks: {
        facebook: draft.socialLinks?.facebook || this.form.socialLinks.facebook || '',
        instagram: draft.socialLinks?.instagram || this.form.socialLinks.instagram || '',
        twitter: draft.socialLinks?.twitter || this.form.socialLinks.twitter || '',
      },
    };

    if (!keepServerDescription && !this.isEmptyHtml(draftDescription)) {
      this.draftRestored.set(true);
    }
  }

  private persistDraft(): void {
    this.drafts.save(this.draftKey, {
      ...this.form,
      tags: [...this.form.tags],
      socialLinks: { ...this.form.socialLinks },
    });
  }

  private syncEditorFromForm(force = false): void {
    if (!this.editorEl) return;
    const next = this.form.description || '';
    if (force || this.normalizeEditorHtml(this.editorEl.innerHTML) !== this.normalizeEditorHtml(next)) {
      this.skipNextEditorPersist = true;
      this.editorEl.innerHTML = next;
    }
  }

  private runEditorCommand(command: string): void {
    this.focusEditor();
    document.execCommand(command, false);
    this.onEditorInput();
  }

  private focusEditor(): void {
    this.editorEl?.focus();
  }

  private normalizeEditorHtml(html: string): string {
    const value = String(html || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<div><br><\/div>/gi, '')
      .replace(/^(<br\s*\/?>)+$/i, '')
      .trim();
    return value === '<br>' ? '' : value;
  }

  private isEmptyHtml(html: string): boolean {
    const text = String(html || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
    return !text;
  }
}
