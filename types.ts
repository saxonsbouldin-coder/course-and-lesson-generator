
export interface SOPStep {
  stepNumber: number;
  action: string;
  detail: string;
}

export interface WorksheetQuestion {
  question: string;
  type: 'short_answer' | 'multiple_choice' | 'checklist';
  options?: string[]; // For multiple choice
}

export interface Worksheet {
  title: string;
  difficulty: 'Basic' | 'Advanced';
  questions: WorksheetQuestion[];
}

export interface Activity {
  title: string;
  duration: string;
  objective: string;
  materialsNeeded: string[];
  instructions: string; // Detailed step-by-step
}

export interface Lesson {
  title: string;
  duration: string;
  content: string; // HTML or Markdown content
  imagePrompt: string; // Prompt to generate an image for this module
  activities: Activity[];
  worksheets: Worksheet[];
}

export interface Module {
  title: string;
  description: string;
  duration: string; // Total estimated time for the module
  lessons: Lesson[];
}

export interface CapstoneProject {
  title: string;
  description: string;
  scope: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Final';
  duration: string; // Estimated time to complete
  requirements: string[];
  steps: string[];
}

export interface DigitalAsset {
  title: string;
  type: 'email' | 'social_post' | 'prompt' | 'resource_list';
  content: string;
}

export interface VideoScript {
  title: string;
  type: 'module_intro' | 'lesson_summary' | 'activity_guide';
  script: string;
}

export interface SyllabusScheduleItem {
  timeframe: string; // e.g. "Week 1", "Module 1", "Day 1"
  topic: string;
  description: string;
  deadline: string; // e.g. "Submit Quiz", "Complete Reading"
}

export interface Slide {
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
}

export interface Syllabus {
  learningObjectives: string[];
  targetAudience: string;
  prerequisites: string[];
  courseStructureSummary: string;
  roadmap: string[]; // List of 4-6 major milestones for visual graph
  schedule: SyllabusScheduleItem[];
}

export interface CourseData {
  id: string; // Unique ID for storage
  createdAt: number;
  courseTitle: string;
  courseDescription: string;
  estimatedTotalDuration?: string; // Overall time commitment
  syllabus: Syllabus;
  modules: Module[]; // Replaces studyGuide, activities, worksheets (flat)
  checklist: string[];
  studentSop: {
    title: string;
    purpose: string;
    steps: SOPStep[];
  };
  teacherSop: {
    title: string;
    purpose: string;
    steps: SOPStep[];
  };
  capstoneProjects: CapstoneProject[];
  digitalAssets: DigitalAsset[];
  videoScripts: VideoScript[];
  slideDeck: Slide[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  COURSE = 'COURSE',
}

export enum CourseTab {
  OVERVIEW = 'OVERVIEW',
  SYLLABUS = 'SYLLABUS',
  MODULES = 'MODULES',
  SLIDES = 'SLIDES',
  ACTIVITIES = 'ACTIVITIES',
  VIDEO_SCRIPTS = 'VIDEO_SCRIPTS',
  ASSETS = 'ASSETS',
  CHECKLIST = 'CHECKLIST',
  SOP = 'SOP',
  WORKSHEET = 'WORKSHEET',
  CAPSTONE = 'CAPSTONE',
}

export type CourseType = 
  | 'custom'
  | 'existing_structure'
  | 'single_lesson' 
  | '1_day_multi' 
  | '1_week' 
  | '1_3_weeks' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly';

export type LessonDuration = '20min' | '40min' | '60min' | '90min' | '120min';

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface GenerationConfig {
  content: string;
  lessonCount: number;
  courseType: CourseType;
  weekCount?: number; // Only for 1_3_weeks
  lessonDuration: LessonDuration;
  includeAssets: boolean;
  includeVideoScripts: boolean;
  includeGraphics: boolean;
  imageParts?: ImagePart[];
}
