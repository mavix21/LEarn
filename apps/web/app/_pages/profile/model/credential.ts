export interface Certification {
  id: string;
  name: string;
  issuingCompany: string;
  skills: string[];
  credentialId?: string;
  credentialUrl?: string;
  mediaUrl?: string;
  mediaType?: string;
  issueDate?: string;
}
