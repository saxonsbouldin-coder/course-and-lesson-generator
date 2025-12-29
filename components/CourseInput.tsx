
import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Loader2, Sparkles, Settings, Video, Download, Clock, BookOpen, Puzzle, FileQuestion, Trophy, FileJson, ImageIcon, LayoutTemplate, ListOrdered, ScrollText, Camera, X, Image as ImageIconLucide } from 'lucide-react';
import { GenerationConfig, CourseType, LessonDuration, ImagePart } from '../types';

interface CourseInputProps {
  onGenerate: (config: GenerationConfig) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const CourseInput: React.FC<CourseInputProps> = ({ onGenerate, onCancel, isGenerating }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [scannedImages, setScannedImages] = useState<{data: string, type: string}[]>([]);
  
  // Input Mode
  const [inputMode, setInputMode] = useState<'format' | 'manual' | 'existing'>('format');

  // Configuration State
  const [lessonCount, setLessonCount] = useState<number>(4);
  const [courseType, setCourseType] = useState<CourseType>('1_day_multi');
  const [weekCount, setWeekCount] = useState<number>(2);
  const [lessonDuration, setLessonDuration] = useState<LessonDuration>('60min');
  const [includeAssets, setIncludeAssets] = useState<boolean>(false);
  const [includeVideoScripts, setIncludeVideoScripts] = useState<boolean>(false);
  const [includeGraphics, setIncludeGraphics] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputMode === 'format') {
      switch (courseType) {
        case 'single_lesson': setLessonCount(1); break;
        case '1_day_multi': setLessonCount(4); break;
        case '1_week': setLessonCount(5); break;
        case '1_3_weeks': setLessonCount(weekCount * 5); break;
        case 'monthly': setLessonCount(4); break;
        case 'quarterly': setLessonCount(13); break;
        case 'yearly': setLessonCount(52); break;
        default: break;
      }
    }
  }, [courseType, weekCount, inputMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setScannedImages(prev => [...prev, { data: base64, type: file.type }]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setScannedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || scannedImages.length > 0) {
      let type: CourseType = courseType;
      if (inputMode === 'manual') type = 'custom';
      if (inputMode === 'existing') type = 'existing_structure';

      const imageParts: ImagePart[] = scannedImages.map(img => ({
        inlineData: {
          data: img.data,
          mimeType: img.type
        }
      }));

      onGenerate({
        content: text,
        lessonCount: inputMode === 'existing' ? 0 : lessonCount,
        courseType: type,
        weekCount: courseType === '1_3_weeks' ? weekCount : undefined,
        lessonDuration,
        includeAssets,
        includeVideoScripts,
        includeGraphics,
        imageParts
      });
    }
  };

  const totalActivities = inputMode === 'existing' ? "Auto" : lessonCount * 2;
  const totalWorksheets = inputMode === 'existing' ? "Auto" : lessonCount * 2;
  const totalScripts = includeVideoScripts ? (inputMode === 'existing' ? "Auto" : lessonCount) : 0;

  let totalCapstones: string | number = 1;
  const typeForCalc = inputMode === 'manual' ? 'custom' : courseType;

  if (inputMode === 'existing') {
    totalCapstones = "Auto";
  } else if (typeForCalc === '1_3_weeks') {
    totalCapstones = weekCount + 1;
  } else if (typeForCalc === 'monthly') {
    totalCapstones = 5;
  } else if (typeForCalc === 'quarterly') {
    totalCapstones = 16;
  } else if (typeForCalc === 'yearly') {
    totalCapstones = 65;
  } else if (typeForCalc === '1_week') {
    totalCapstones = 1; 
  } else if (typeForCalc === 'custom') {
    totalCapstones = 1;
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">CourseCraft AI</h1>
        <p className="text-lg text-slate-600">
          Transform your notes, images, or curriculum into a full course.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="flex justify-center">
              <div className="bg-slate-100 p-1.5 rounded-xl inline-flex shadow-inner">
                 <button
                  type="button"
                  onClick={() => setInputMode('format')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'format' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <LayoutTemplate className="w-4 h-4 mr-2" />
                   Smart Format
                 </button>
                 <button
                  type="button"
                  onClick={() => setInputMode('manual')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <ListOrdered className="w-4 h-4 mr-2" />
                   Lesson Count
                 </button>
                 <button
                  type="button"
                  onClick={() => setInputMode('existing')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'existing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <ScrollText className="w-4 h-4 mr-2" />
                   Pre-structured
                 </button>
              </div>
            </div>

            <div>
              <label htmlFor="course-content" className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                <span>
                  {inputMode === 'existing' ? "Paste Existing Curriculum / Outline or Scan Pages" : "Course Topic & Notes"}
                </span>
                {fileName && (
                  <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    File: {fileName}
                  </span>
                )}
              </label>
              
              <div className="relative group">
                <textarea
                  id="course-content"
                  rows={8}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors
                    ${inputMode === 'existing' 
                      ? 'bg-amber-50 border-amber-200 text-slate-900 placeholder-amber-400 focus:ring-amber-500 focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  placeholder={inputMode === 'existing' 
                    ? "Paste your full course outline here, or upload images of your curriculum pages below."
                    : "Paste your raw topic ideas, brain dump, or rough notes here..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                
                <div className="absolute bottom-3 right-3 flex space-x-2">
                   <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                  >
                    <Upload className="w-3 h-3 mr-1.5" />
                    Upload File / Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt,.md,.csv,.json,image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {scannedImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                   {scannedImages.map((img, idx) => (
                     <div key={idx} className="relative w-20 h-20 group">
                        <img src={`data:${img.type};base64,${img.data}`} className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm" alt="Scanned" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                     </div>
                   ))}
                   <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all"
                   >
                     <Camera className="w-5 h-5" />
                     <span className="text-[10px] mt-1 font-bold">Add More</span>
                   </button>
                </div>
              )}

              {inputMode === 'existing' && (
                <p className="text-xs text-amber-700 mt-2 flex items-center">
                  <ScrollText className="w-3 h-3 mr-1" />
                  Building from existing structure (Auto-OCR enabled for images).
                </p>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                <Settings className="w-5 h-5 mr-2 text-slate-500" /> 
                Refine Settings
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {inputMode === 'existing' ? (
                     <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm">
                        <h3 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wide">
                          Parser Settings
                        </h3>
                        <div className="space-y-4">
                           <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Target Duration per Lesson</label>
                             <select 
                                value={lessonDuration}
                                onChange={(e) => setLessonDuration(e.target.value as LessonDuration)}
                                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                              >
                                <option value="20min">20 Minutes</option>
                                <option value="40min">40 Minutes</option>
                                <option value="60min">60 Minutes</option>
                                <option value="90min">90 Minutes</option>
                                <option value="120min">2 Hours</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  ) : inputMode === 'format' ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Structure Template</label>
                      <select 
                        value={courseType}
                        onChange={(e) => setCourseType(e.target.value as CourseType)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="single_lesson">Single Lesson</option>
                        <option value="1_day_multi">1 Day Workshop</option>
                        <option value="1_week">1 Week Course</option>
                        <option value="1_3_weeks">1-3 Week Sprint</option>
                        <option value="monthly">Monthly Program</option>
                        <option value="quarterly">Quarterly Curriculum</option>
                        <option value="yearly">Yearly Curriculum</option>
                      </select>

                      {courseType === '1_3_weeks' && (
                        <div className="mt-4 bg-white p-3 border border-indigo-200 rounded-lg shadow-sm">
                          <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                             <span>Duration</span>
                             <span className="text-indigo-600 font-bold">{weekCount} Weeks</span>
                          </div>
                          <input 
                            type="range" min="1" max="3" step="1"
                            value={weekCount} 
                            onChange={(e) => setWeekCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      )}
                      
                      <div className="mt-4">
                         <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Duration</label>
                         <select 
                            value={lessonDuration}
                            onChange={(e) => setLessonDuration(e.target.value as LessonDuration)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          >
                            <option value="20min">20 Minutes</option>
                            <option value="40min">40 Minutes</option>
                            <option value="60min">60 Minutes</option>
                            <option value="90min">90 Minutes</option>
                            <option value="120min">2 Hours</option>
                          </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                        <span>Lesson Count</span>
                        <span className="text-indigo-600 font-bold">{lessonCount}</span>
                      </div>
                      <input 
                        type="range" min="1" max="52" 
                        value={lessonCount} 
                        onChange={(e) => setLessonCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1 mb-4">
                        <span>1</span>
                        <span>52</span>
                      </div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Duration</label>
                       <select 
                          value={lessonDuration}
                          onChange={(e) => setLessonDuration(e.target.value as LessonDuration)}
                          className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                          <option value="20min">20 Minutes</option>
                          <option value="40min">40 Minutes</option>
                          <option value="60min">60 Minutes</option>
                          <option value="90min">90 Minutes</option>
                          <option value="120min">2 Hours</option>
                        </select>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3 pt-2">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Included Assets</h4>
                     
                     <label className="flex items-center p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                       <input 
                        type="checkbox" 
                        checked={includeGraphics}
                        onChange={(e) => setIncludeGraphics(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                       />
                       <span className="ml-3 flex items-center text-sm font-medium text-slate-700">
                         <ImageIconLucide className="w-4 h-4 mr-2 text-slate-500" />
                         Generate Graphics
                       </span>
                     </label>

                     <label className="flex items-center p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                       <input 
                        type="checkbox" 
                        checked={includeAssets}
                        onChange={(e) => setIncludeAssets(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                       />
                       <span className="ml-3 flex items-center text-sm font-medium text-slate-700">
                         <Download className="w-4 h-4 mr-2 text-slate-500" />
                         Digital Assets (Emails/Social)
                       </span>
                     </label>

                     <label className="flex items-center p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                       <input 
                        type="checkbox" 
                        checked={includeVideoScripts}
                        onChange={(e) => setIncludeVideoScripts(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                       />
                       <span className="ml-3 flex items-center text-sm font-medium text-slate-700">
                         <Video className="w-4 h-4 mr-2 text-slate-500" />
                         Video Scripts
                       </span>
                     </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Total Assets Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-slate-900">{inputMode === 'existing' ? 'Auto' : lessonCount}</div>
                    <div className="text-xs text-slate-500">Lessons</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                    <Puzzle className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-slate-900">{totalActivities}</div>
                    <div className="text-xs text-slate-500">Activities</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                    <FileQuestion className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-slate-900">{totalWorksheets}</div>
                    <div className="text-xs text-slate-500">Worksheets</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                    <Trophy className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-slate-900">{totalCapstones}</div>
                    <div className="text-xs text-slate-500">Capstones</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center shadow-sm ${includeVideoScripts ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                    <Video className={`w-5 h-5 mx-auto mb-1 ${includeVideoScripts ? 'text-red-500' : 'text-slate-400'}`} />
                    <div className="text-xl font-bold text-slate-900">{totalScripts}</div>
                    <div className="text-xs text-slate-500">Scripts</div>
                  </div>
                   <div className={`p-3 rounded-lg border text-center shadow-sm ${includeAssets ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                    <FileJson className={`w-5 h-5 mx-auto mb-1 ${includeAssets ? 'text-sky-500' : 'text-slate-400'}`} />
                    <div className="text-xl font-bold text-slate-900">{includeAssets ? 'Pack' : '-'}</div>
                    <div className="text-xs text-slate-500">Assets</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
               <button
                type="button"
                onClick={onCancel}
                className="text-slate-500 hover:text-slate-700 font-medium text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={(!text.trim() && scannedImages.length === 0) || isGenerating}
                className={`flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all w-full sm:w-auto ${
                  (!text.trim() && scannedImages.length === 0) || isGenerating
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scanning & Building...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
