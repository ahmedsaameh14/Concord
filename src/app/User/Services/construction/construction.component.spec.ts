import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProjectService } from '../../../core/services/project.service';

import { ConstructionComponent } from './construction.component';

describe('ConstructionComponent', () => {
  let component: ConstructionComponent;
  let fixture: ComponentFixture<ConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructionComponent],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: { getProjects: () => of({ data: [] }) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
