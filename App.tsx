import React, { useState, useEffect } from 'react';
import { CourseInput } from './components/CourseInput';
import { CourseViewer } from './components/CourseViewer';
import { Dashboard } from './components/Dashboard';
import { generateCourse } from './services/geminiService';
import { AppView, CourseData, GenerationConfig } from './types';
import { BookOpen } from 'lucide-react';

const STORAGE_KEY = 'coursecraft_courses';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load courses from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved courses", e);
      }
    }
  }, []);

  // Save courses to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const handleGenerate = async (config: GenerationConfig) => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateCourse(config);
      setCourses(prev => [data, ...prev]);
      setActiveCourse(data);
      setView(AppView.COURSE);
    } catch (err) {
      setError("Failed to generate course. Please try again with different content or verify your API configuration.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      setCourses(prev => prev.filter(c => c.id !== id));
      if (activeCourse?.id === id) {
        setActiveCourse(null);
        setView(AppView.DASHBOARD);
      }
    }
  };

  const handleOpenCourse = (course: CourseData) => {
    setActiveCourse(course);
    setView(AppView.COURSE);
  };

  const handleBackToDashboard = () => {
    setView(AppView.DASHBOARD);
    setActiveCourse(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white shadow-sm py-4 no-print">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center cursor-pointer" onClick={handleBackToDashboard}>
            <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="text-xl font-bold text-slate-900">CourseCraft AI</span>
         </div>
      </header>

      {view === AppView.DASHBOARD && (
        <Dashboard 
          courses={courses} 
          onOpen={handleOpenCourse} 
          onDelete={handleDeleteCourse}
          onCreateNew={() => setView(AppView.INPUT)}
        />
      )}

      {view === AppView.INPUT && (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
          <main className="flex-grow flex flex-col items-center justify-center">
             <CourseInput 
              onGenerate={handleGenerate} 
              onCancel={handleBackToDashboard}
              isGenerating={isGenerating} 
            />
             {error && (
               <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md text-center">
                 {error}
               </div>
             )}
          </main>
        </div>
      )}

      {view === AppView.COURSE && activeCourse && (
        <CourseViewer data={activeCourse} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}
