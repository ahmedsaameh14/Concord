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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvLink: string;
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
