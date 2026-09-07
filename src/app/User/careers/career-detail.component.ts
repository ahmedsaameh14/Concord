import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../core/services/career.service';

@Component({ selector: 'app-career-detail', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './career-detail.component.html', styleUrls: ['./career-detail.component.css'] })
export class CareerDetailComponent implements OnInit {
  private readonly api = inject(CareerService); private readonly route = inject(ActivatedRoute); private readonly titleService = inject(Title);
  career = signal<any>(null); loading = signal(true); success = signal(''); error = signal(''); submitting = signal(false); agreed = false;
  form = this.createForm();
  resume: File | null = null;

  private createForm() {
    return {
      fullName: '', dateOfBirth: '', applicationDate: new Date().toISOString().slice(0, 10), gender: '', email: '', phone: '', alternatePhone: '',
      positionAppliedFor: '', resumeUrl: '', address: '', country: '', city: '', expectedSalary: '',
      educationalQualifications: [{ universityName: '', degree: '', graduationDate: '' }],
      courses: [{ courseName: '' }],
      workExperience: [{ jobTitle: '', placeOfWork: '', startDate: '', endDate: '', currentlyWorking: false, salary: '' }],
    };
  }

  ngOnInit(): void { this.route.paramMap.subscribe(params => { this.loading.set(true); this.error.set(''); this.api.get(params.get('id') || '').subscribe({ next: r => { this.career.set(r.data); this.titleService.setTitle(`${r.data.title} | Concord`); this.loading.set(false); }, error: e => { this.error.set(e?.error?.message || 'Career not found.'); this.loading.set(false); } }); }); }
  addEducation(): void { this.form.educationalQualifications.push({ universityName: '', degree: '', graduationDate: '' }); }
  removeEducation(index: number): void { if (this.form.educationalQualifications.length > 1) this.form.educationalQualifications.splice(index, 1); }
  addCourse(): void { this.form.courses.push({ courseName: '' }); }
  removeCourse(index: number): void { if (this.form.courses.length > 1) this.form.courses.splice(index, 1); }
  addExperience(): void { this.form.workExperience.push({ jobTitle: '', placeOfWork: '', startDate: '', endDate: '', currentlyWorking: false, salary: '' }); }
  removeExperience(index: number): void { if (this.form.workExperience.length > 1) this.form.workExperience.splice(index, 1); }
  onResumeChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (!file) {
      this.resume = null;
      return;
    }
    if (file.type !== 'application/pdf') {
      this.resume = null;
      this.error.set('Resume must be a PDF file.');
      return;
    }
    if (file.size > 1024 * 1024) {
      this.resume = null;
      this.error.set('Resume must be 1 MB or smaller.');
      return;
    }
    this.error.set('');
    this.resume = file;
  }

  submit(): void {
    if (!this.agreed || !this.resume || !this.career()) return;
    this.submitting.set(true); this.error.set('');
    const data = new FormData();
    const payload = {
      ...this.form,
      courses: this.form.courses.filter((course) => course.courseName.trim()),
      workExperience: this.form.workExperience.filter((experience) => experience.jobTitle.trim() || experience.placeOfWork.trim() || experience.startDate || experience.endDate || experience.salary.trim()),
    };
    Object.entries(payload).forEach(([key, value]) => data.append(key, typeof value === 'string' ? value : JSON.stringify(value)));
    data.set('positionAppliedFor', this.career().title);
    data.append('agreedToDataStorage', 'true'); data.append('resume', this.resume);
    this.api.apply(this.career()._id, data).subscribe({ next: r => { this.success.set(r.message); this.submitting.set(false); this.form = this.createForm(); this.form.positionAppliedFor = this.career().title; this.resume = null; this.agreed = false; }, error: e => { this.error.set(e?.error?.message || 'Unable to submit application.'); this.submitting.set(false); } });
  }
}
