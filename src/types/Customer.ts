export interface Customer {
  id: string;
  country: string;
  companyName: string;
  website?: string;
  sector: string;
  interestStatus: 'yes' | 'no';
  priority: 'high' | 'medium' | 'low';
  actionNote: string;
  followUpStatus: 'first-follow' | 'second-follow' | 'none';
  createdAt: Date;
}

export interface CustomerFormData {
  country: string;
  companyName: string;
  website: string;
  sector: string;
  interestStatus: 'yes' | 'no';
  priority: 'high' | 'medium' | 'low';
  actionNote: string;
  followUpStatus: 'first-follow' | 'second-follow' | 'none';
}