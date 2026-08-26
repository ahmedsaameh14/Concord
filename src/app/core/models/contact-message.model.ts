export interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ContactMessageResponse {
  message: string;
  data: ContactMessage;
}

export interface ContactMessageListResponse {
  message: string;
  data: ContactMessage[];
}
