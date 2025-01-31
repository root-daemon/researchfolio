// Basic Types
interface LocaleData {
  [locale: string]: string;
}

export interface DateInfo {
  year: number;
  month: number;
  day: number;
}

interface Geo {
  country: string;
  city: string;
  full: string;
}

interface Education {
  start: DateInfo;
  end: DateInfo;
  fieldOfStudy: string;
  degree: string;
  grade: string;
  schoolName: string;
  description: string;
  activities: string;
  url: string;
  schoolId: string;
}

export interface Position {
  companyName?: string;
  companyUsername?: string;
  companyURL?: string;
  companyLogo?: string;
  companyIndustry?: string;
  companyStaffCountRange?: string;
  title?: string;
  multiLocaleTitle?: LocaleData;
  multiLocaleCompanyName?: LocaleData;
  location?: string;
  description?: string;
  employmentType?: string;
  start?: DateInfo;
  end?: DateInfo;
}

interface Project {
  total: number;
  items: Array<string> | null;
}

interface LocaleSupport {
  country: string;
  language: string;
}

export interface LinkedinProfile {
  urn: string;
  username: string;
  firstName: string;
  lastName: string;
  isCreator: boolean;
  isOpenToWork: boolean;
  isHiring: boolean;
  profilePicture: string;
  summary: string;
  headline: string;
  geo: Geo;
  languages: string | null;
  educations: Education[];
  position: Position[];
  fullPositions: Position[];
  skills: string[] | null;
  givenRecommendation: string[] | null;
  givenRecommendationCount: number;
  receivedRecommendation: string[] | null;
  receivedRecommendationCount: number;
  courses: string[] | null;
  certifications: string[] | null;
  honors: string[] | null;
  projects: Project;
  volunteering: string[] | null;
  supportedLocales: LocaleSupport[];
  multiLocaleFirstName: LocaleData;
  multiLocaleLastName: LocaleData;
  multiLocaleHeadline: LocaleData;
}
