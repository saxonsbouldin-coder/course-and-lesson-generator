import React from 'react';
import { CourseData } from '../types';
import { Plus, Trash2, ArrowRight, Book, Calendar } from 'lucide-react';

interface DashboardProps {
  courses: CourseData[];
  onOpen: (course: CourseData) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ courses, onOpen, onDelete, onCreateNew }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Your Courses</h1>
           <p className="text-slate-600 mt-1">Manage and print your generated learning materials.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
           <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
             <Book className="w-8 h-8 text-slate-400" />
           </div>
           <h3 className="text-lg font-medium text-slate-900">No courses yet</h3>
           <p className="text-slate-500 mb-6">Start by generating your first AI-powered course.</p>
           <button
             onClick={onCreateNew}
             className="text-indigo-600 font-medium hover:text-indigo-700"
           >
             Create a Course &rarr;
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2" title={course.courseTitle}>
                  {course.courseTitle}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {course.courseDescription}
                </p>
                
                <div className="flex items-center text-xs text-slate-500 mb-4">
                   <Calendar className="w-3 h-3 mr-1" />
                   {new Date(course.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between rounded-b-xl">
                 <button
                  onClick={() => onDelete(course.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-2"
                  title="Delete Course"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
                 <button
                  onClick={() => onOpen(course)}
                  className="flex items-center text-indigo-600 font-medium hover:text-indigo-700 text-sm"
                 >
                   Open Course <ArrowRight className="w-4 h-4 ml-1" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
