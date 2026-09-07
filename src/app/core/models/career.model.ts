export interface Career {
  _id: string;
  title: string;
  experience: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Application {
  _id: string;
  career: string;
  fullName: string;
  dateOfBirth: string;
  applicationDate: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  email: string;
  phone: string;
  alternatePhone?: string;
  positionAppliedFor: string;
  resumeUrl: string;
  resumeDownloadUrl?: string;
  address: string;
  country: string;
  city: string;
  educationalQualifications: { universityName: string; degree: string; graduationDate: string }[];
  courses: { courseName: string }[];
  workExperience: { jobTitle: string; placeOfWork: string; startDate: string; endDate?: string; currentlyWorking?: boolean; salary: string }[];
  expectedSalary: string;
  agreedToDataStorage: boolean;
  status: 'Waiting' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface CareerListResponse {
  message: string;
  data: Career[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface CareerResponse { message: string; data: Career; }
export interface ApplicationResponse { message: string; data: Application; }
export interface ApplicationListResponse {
  message: string;
  data: Application[];
  career: Career;
  meta: { page: number; limit: number; total: number; totalPages: number };
}
