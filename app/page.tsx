"use client";

import { useState } from "react";
import { TUE_COURSES, MASTER_REQUIREMENTS, Course } from "./data";

export default function Home() {
  const [bachelor, setBachelor] = useState<string>("Computer Science");
  const [master, setMaster] = useState<string>("Embedded Systems");
  
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
    setShowResult(false); 
    setAiAdvice(null);
  };

  const targetMasterReqs = MASTER_REQUIREMENTS[master]?.requiredCourses || [];
  
  const metCourses = targetMasterReqs
    .filter(id => selectedCourseIds.includes(id))
    .map(id => TUE_COURSES.find(c => c.id === id))
    .filter((course): course is Course => course !== undefined);
    
  const missingCourses = targetMasterReqs
    .filter(id => !selectedCourseIds.includes(id))
    .map(id => TUE_COURSES.find(c => c.id === id))
    .filter((course): course is Course => course !== undefined);

  const getAiAdvice = async () => {
    setIsAiLoading(true);
    setAiAdvice(null);

    try {
      const response = await fetch('/api/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          master,
          metCourses,
          missingCourses
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setAiAdvice(data.advice || "Unknown server.");
      } else {
        setAiAdvice(data.advice);
      }
    } catch (error) {
      console.error(error);
      setAiAdvice("Could not reach the server. Check the terminal.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl my-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
          TU/e Master Planner
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bachelor</label>
            <select 
              value={bachelor}
              onChange={(e) => setBachelor(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Master</label>
            <select
              value={master}
              onChange={(e) => {
                setMaster(e.target.value);
                setShowResult(false);
                setAiAdvice(null);
              }}
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.keys(MASTER_REQUIREMENTS).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Completed / Planned Courses
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {TUE_COURSES.map((course) => (
              <label key={course.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedCourseIds.includes(course.id)}
                  onChange={() => handleCourseToggle(course.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">
                  <span className="font-semibold text-gray-900">{course.id}</span><br/>
                  {course.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowResult(true)}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm"
        >
          Check my eligibility
        </button>

        {/* AI Advisor part */}
        {showResult && (
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Eligibility for {master}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                {metCourses.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-green-800 mb-2">Requirements Met:</h3>
                    <div className="space-y-1">
                      {metCourses.map(course => (
                        <div key={course.id} className="flex items-center text-green-700 text-sm">
                          <span className="mr-2">✓</span> {course.id} - {course.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                {missingCourses.length > 0 ? (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 h-full">
                    <h3 className="font-bold text-red-800 mb-2">Missing Prerequisites:</h3>
                    <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                      {missingCourses.map(course => (
                        <li key={course.id}>
                          <span className="font-semibold">{course.id}</span> - {course.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 h-full flex items-center">
                    <p className="font-bold text-green-800">
                      🎉 All predefined prerequisites are met!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI ADVISOR BUTTON */}
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                  <span className="text-2xl mr-2">🤖</span> AI Academic Advisor
                </h3>
                {!aiAdvice && !isAiLoading && (
                  <button 
                    onClick={getAiAdvice}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Get Advice
                  </button>
                )}
              </div>

              {isAiLoading && (
                <div className="flex space-x-2 animate-pulse p-4 bg-white rounded-lg border border-indigo-100">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                </div>
              )}

              {aiAdvice && (
                <div className="p-4 bg-white rounded-lg border border-indigo-100 text-gray-700 leading-relaxed text-sm shadow-sm">
                  {aiAdvice}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
