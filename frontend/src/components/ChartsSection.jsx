import React from "react";

export default function ChartsSection({ darkMode }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
      <div className={`p-4 md:p-5 min-h-102.5 flex flex-col border shadow-2xs rounded-xl ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div>
            <h2 className={`text-sm ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Income</h2>
            <p className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>$126,238.49</p>
          </div>
          <div>
            <span className={`py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${
              darkMode ? 'bg-teal-500/10 text-teal-500' : 'bg-teal-100 text-teal-800'
            }`}>
              <svg className="inline-block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              25%
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end">
          <div className="relative h-48 flex items-end">
            <div className="absolute inset-x-0 top-0 grid grid-cols-12 w-full h-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`border-r ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}></div>
              ))}
            </div>
            
            <div className="z-10 w-full flex justify-between items-end space-x-2">
              {[
                { month: "Jan", height: 12, bgHeight: 20 },
                { month: "Feb", height: 24, bgHeight: 36 },
                { month: "Mar", height: 32, bgHeight: 40 },
                { month: "Apr", height: 36, bgHeight: 44 },
                { month: "May", height: 32, bgHeight: 40 },
                { month: "Jun", height: 36, bgHeight: 40 },
                { month: "Jul", height: 36, bgHeight: 44 },
                { month: "Aug", height: 40, bgHeight: 44 },
                { month: "Sep", height: 40, bgHeight: 36 },
                { month: "Oct", height: 20, bgHeight: 32 },
                { month: "Nov", height: 44, bgHeight: 32 },
                { month: "Dec", height: 32, bgHeight: 36 }
              ].map((data, index) => (
                <div key={index} className="w-1/12 flex flex-col items-center">
                  <div className="w-full">
                    <div className="relative w-5 mx-auto">
                      <div className="absolute bottom-0 w-5 h-12 bg-blue-600 rounded-t-sm" style={{ height: `${data.height}px` }}></div>
                      <div className={`absolute bottom-0 w-5 opacity-70 rounded-t-sm -z-10 ${
                        darkMode ? 'bg-neutral-700' : 'bg-gray-200'
                      }`} style={{ height: `${data.bgHeight}px` }}></div>
                    </div>
                  </div>
                  <span className={`mt-2 text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-4 md:p-5 min-h-102.5 flex flex-col border shadow-2xs rounded-xl ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div>
            <h2 className={`text-sm ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Visitors</h2>
            <p className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>80.3k</p>
          </div>
          <div>
            <span className={`py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${
              darkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-800'
            }`}>
              <svg className="inline-block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              2%
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-end">
          <div className="relative w-full h-48">
            <div className="absolute inset-0 flex flex-col justify-between">
              {["200", "150", "100", "50", "0"].map((value, index) => (
                <div key={index} className={`border-b text-xs text-right pr-2 ${
                  darkMode 
                    ? 'border-neutral-700 text-neutral-500' 
                    : 'border-gray-200 text-gray-400'
                }`}>{value}</div>
              ))}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-36">
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-500/20 to-blue-500/5"></div>
              
              <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 36" preserveAspectRatio="none">
                <path 
                  d="M0,5 L7,35 L14,20 L21,25 L28,15 L35,25 L42,30 L49,28 L56,10 L63,15 L70,18 L77,10 L84,20 L91,15 L100,20" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="1.5"
                />
              </svg>
              
              {[
                { bottom: 5, left: 0 },
                { bottom: 35, left: 7 },
                { bottom: 20, left: 14 },
                { bottom: 25, left: 21 },
                { bottom: 15, left: 28 },
                { bottom: 25, left: 35 },
                { bottom: 30, left: 42 },
                { bottom: 28, left: 49 },
                { bottom: 10, left: 56 },
                { bottom: 15, left: 63 },
                { bottom: 18, left: 70 },
                { bottom: 10, left: 77 },
                { bottom: 20, left: 84 },
                { bottom: 15, left: 91 },
                { bottom: 20, left: 100 }
              ].map((point, index) => (
                <div key={index} className="absolute w-2 h-2 bg-blue-500 rounded-full" style={{ 
                  bottom: `${point.bottom}px`, 
                  left: `${point.left}%`
                }}></div>
              ))}
            </div>
            
            <div className="absolute bottom-0 translate-y-6 left-0 w-full flex justify-between text-xs">
              {[
                "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "30 Jan", 
                "31 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb"
              ].map((date, index) => (
                <span key={index} className={darkMode ? 'text-neutral-500' : 'text-gray-500'}>{date}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 