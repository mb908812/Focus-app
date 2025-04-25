import React, { useState, useEffect } from 'react';

const App = () => {
  // Main states
  const [page, setPage] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [thoughts, setThoughts] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [priority, setPriority] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [distractions, setDistractions] = useState([]);
  const [distraction, setDistraction] = useState('');
  
  // Timer states
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  
  // Brain dump states
  const [prompts, setPrompts] = useState([
    "What's been on your mind lately?",
    "Any tasks you're avoiding?",
    "What deadlines are approaching?",
    "Any people you need to follow up with?"
  ]);
  const [promptIndex, setPromptIndex] = useState(0);
  
  // Focus profiles
  const [focusProfiles, setFocusProfiles] = useState([
    { id: 1, name: 'Deep Work', minutes: 50 },
    { id: 2, name: 'Quick Task', minutes: 15 },
    { id: 3, name: 'Creative', minutes: 30 }
  ]);
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (selectedPriority !== null) {
        const completed = window.confirm(`Did you complete: ${priorities[selectedPriority]}?`);
        if (completed) {
          // Move to achievements
          const today = new Date().toLocaleDateString();
          setAchievements([...achievements, {
            text: priorities[selectedPriority],
            date: today
          }]);
          
          // Remove from priorities
          const newPriorities = [...priorities];
          newPriorities.splice(selectedPriority, 1);
          setPriorities(newPriorities);
          setSelectedPriority(null);
        }
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  
  // Functions
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(focusMinutes * 60);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const nextPrompt = () => {
    setPromptIndex((promptIndex + 1) % prompts.length);
  };
  
  const applyProfile = (profileId) => {
    const profile = focusProfiles.find(p => p.id === profileId);
    if (profile) {
      setFocusMinutes(profile.minutes);
      setTimeLeft(profile.minutes * 60);
    }
  };
  
  // Priority Management
  const handleAddPriority = () => {
    if (priority.trim()) {
      setPriorities([...priorities, priority]);
      setPriority('');
    }
  };
  
  const handleRemovePriority = (index) => {
    const newPriorities = [...priorities];
    newPriorities.splice(index, 1);
    setPriorities(newPriorities);
    
    if (selectedPriority === index) {
      setSelectedPriority(null);
    } else if (selectedPriority > index) {
      setSelectedPriority(selectedPriority - 1);
    }
  };
  
  // Achievement Management
  const handleRemoveAchievement = (index) => {
    const newAchievements = [...achievements];
    newAchievements.splice(index, 1);
    setAchievements(newAchievements);
  };
  
  const handleCompleteTask = () => {
    if (selectedPriority !== null) {
      // Add to achievements
      const today = new Date().toLocaleDateString();
      setAchievements([...achievements, {
        text: priorities[selectedPriority],
        date: today
      }]);
      
      // Remove from priorities
      const newPriorities = [...priorities];
      newPriorities.splice(selectedPriority, 1);
      setPriorities(newPriorities);
      
      // Reset timer and clear selection
      resetTimer();
      setSelectedPriority(null);
    }
  };
  
  // Distraction Management
  const handleAddDistraction = () => {
    if (distraction.trim()) {
      setDistractions([...distractions, distraction]);
      setDistraction('');
    }
  };
  
  const handleRemoveDistraction = (index) => {
    const newDistractions = [...distractions];
    newDistractions.splice(index, 1);
    setDistractions(newDistractions);
  };
  
  // Styling constants
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-blue-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const subtleText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const buttonPrimaryBg = 'bg-blue-600 hover:bg-blue-700';
  const buttonSecondaryBg = isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const itemBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  
  // Landing page
  if (page === 'landing') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300 flex flex-col items-center`}>
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className="max-w-lg w-full p-6 mt-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Clarity & Focus</h1>
            <p className={`mb-8 ${subtleText}`}>
              Clear your mind, set your intention, and focus on what matters.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-8">
            <button
              onClick={() => setPage('clarity')}
              className={`p-6 rounded-lg text-left ${cardBg} shadow-md transition-all hover:shadow-lg`}
            >
              <h2 className="text-xl font-semibold">🧠 Brain Dump</h2>
              <p className={`mt-1 ${subtleText}`}>
                Get mental clarity by dumping all your thoughts
              </p>
            </button>
            
            <button
              onClick={() => setPage('focus')}
              className={`p-6 rounded-lg text-left ${cardBg} shadow-md transition-all hover:shadow-lg`}
            >
              <h2 className="text-xl font-semibold">⏱️ Focus Mode</h2>
              <p className={`mt-1 ${subtleText}`}>
                Deep work timer with distraction capturing
              </p>
            </button>
            
            <button
              onClick={() => setPage('insights')}
              className={`p-6 rounded-lg text-left ${cardBg} shadow-md transition-all hover:shadow-lg`}
            >
              <h2 className="text-xl font-semibold">📊 Insights</h2>
              <p className={`mt-1 ${subtleText}`}>
                Track progress and analyze your focus patterns
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Clarity page (brain dump)
  if (page === 'clarity') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300 flex flex-col items-center`}>
        <div className="absolute top-4 right-4 flex">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 mr-2">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setPage('landing')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            ✕
          </button>
        </div>
        
        <div className="max-w-2xl w-full p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6 text-center">Mental Clarity Session</h1>
          
          {/* Brain Dump */}
          <div className={`p-6 rounded-lg shadow-md mb-6 ${cardBg}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Brain Dump</h2>
              <button 
                onClick={nextPrompt} 
                className={`px-2 py-1 rounded text-sm ${buttonSecondaryBg}`}
              >
                New prompt
              </button>
            </div>
            <p className={`mb-4 ${subtleText}`}>
              <em>{prompts[promptIndex]}</em>
            </p>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className={`w-full h-60 p-4 rounded-md ${inputBg} ${textColor} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Type all your thoughts here..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Distractions */}
            <div className={`p-6 rounded-lg shadow-md ${cardBg}`}>
              <h2 className="text-xl font-semibold mb-4">Distractions</h2>
              <p className={`mb-4 ${subtleText}`}>
                Capture things you need to do later but aren't important now.
              </p>
              
              <div className="mb-4 flex">
                <input
                  type="text"
                  value={distraction}
                  onChange={(e) => setDistraction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && distraction.trim()) {
                      handleAddDistraction();
                      e.preventDefault();
                    }
                  }}
                  className={`flex-grow p-2 rounded-l-md ${inputBg} ${textColor} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Add a distraction..."
                />
                <button 
                  type="button"
                  onClick={handleAddDistraction}
                  className={`px-4 py-2 ${buttonPrimaryBg} text-white rounded-r-md`}
                >
                  +
                </button>
              </div>
              
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {distractions.map((item, index) => (
                  <li key={index} className={`p-2 rounded-md flex justify-between items-center ${itemBg}`}>
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveDistraction(index)}
                      className="p-1 rounded-full hover:bg-gray-600"
                    >
                      ✕
                    </button>
                  </li>
                ))}
                {distractions.length === 0 && (
                  <li className={`p-2 italic text-center ${subtleText}`}>
                    No distractions added yet
                  </li>
                )}
              </ul>
            </div>
            
            {/* Key Priorities */}
            <div className={`p-6 rounded-lg shadow-md ${cardBg}`}>
              <h2 className="text-xl font-semibold mb-4">Key Priorities</h2>
              <p className={`mb-4 ${subtleText}`}>
                What are the 1-3 most important things to focus on?
              </p>
              
              <div className="mb-4 flex">
                <input
                  type="text"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && priority.trim()) {
                      handleAddPriority();
                      e.preventDefault();
                    }
                  }}
                  className={`flex-grow p-2 rounded-l-md ${inputBg} ${textColor} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Add a priority..."
                />
                <button 
                  type="button"
                  onClick={handleAddPriority}
                  className={`px-4 py-2 ${buttonPrimaryBg} text-white rounded-r-md`}
                >
                  +
                </button>
              </div>
              
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {priorities.map((item, index) => (
                  <li key={index} className={`p-2 rounded-md flex justify-between items-center ${itemBg}`}>
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemovePriority(index)}
                      className="p-1 rounded-full hover:bg-gray-600"
                    >
                      ✕
                    </button>
                  </li>
                ))}
                {priorities.length === 0 && (
                  <li className={`p-2 italic text-center ${subtleText}`}>
                    No priorities added yet
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Achievements */}
          <div className={`p-6 rounded-lg shadow-md mb-6 ${cardBg}`}>
            <h2 className="text-xl font-semibold mb-4">
              🏆 My Achievements
            </h2>
            
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {achievements.map((achievement, index) => (
                <li key={index} className={`p-3 rounded-md ${itemBg}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{achievement.text}</span>
                    <div className="flex items-center">
                      <span className={`mr-2 ${subtleText}`}>
                        {achievement.date}
                      </span>
                      <button
                        onClick={() => handleRemoveAchievement(index)}
                        className="p-1 rounded-full hover:bg-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {achievements.length === 0 && (
                <li className={`p-2 italic text-center ${subtleText}`}>
                  No achievements yet. Complete a priority to add it here!
                </li>
              )}
            </ul>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setPage('landing')}
              className={`px-6 py-3 rounded-md ${buttonSecondaryBg}`}
            >
              Back
            </button>
            <button
              onClick={() => setPage('focus')}
              className={`px-6 py-3 ${buttonPrimaryBg} text-white rounded-md`}
            >
              Continue to Focus
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Focus page
  if (page === 'focus') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300 flex flex-col items-center`}>
        <div className="absolute top-4 right-4 flex">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 mr-2">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setPage('landing')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            ✕
          </button>
        </div>
        
        <div className="max-w-2xl w-full p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6 text-center">Focus Session</h1>
          
          {/* Timer */}
          <div className={`p-6 rounded-lg shadow-md mb-6 ${cardBg}`}>
            {selectedPriority !== null && (
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">
                  {priorities[selectedPriority]}
                </h3>
                <button
                  onClick={handleCompleteTask}
                  className={`mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md`}
                >
                  ✓ I accomplished this task
                </button>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-5xl font-mono mb-6">{formatTime(timeLeft)}</div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={toggleTimer}
                  className={`p-4 rounded-full ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {isRunning ? '⏸' : '▶️'}
                </button>
                <button
                  onClick={resetTimer}
                  className={`p-4 rounded-full ${buttonSecondaryBg}`}
                >
                  🔄
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center space-x-2 mb-2">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={focusMinutes}
                    onChange={(e) => {
                      setFocusMinutes(parseInt(e.target.value));
                      setTimeLeft(parseInt(e.target.value) * 60);
                    }}
                    disabled={isRunning}
                    className="w-32"
                  />
                  <span>{focusMinutes} min</span>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  {focusProfiles.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => applyProfile(profile.id)}
                      className={`px-3 py-1 rounded ${buttonSecondaryBg}`}
                    >
                      {profile.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Focus Intention */}
            <div className={`p-6 rounded-lg shadow-md ${cardBg}`}>
              <h2 className="text-xl font-semibold mb-4">Focus Intention</h2>
              
              {priorities.length > 0 ? (
                <div>
                  <p className={`mb-2 ${subtleText}`}>Your priorities:</p>
                  <ul className="space-y-2">
                    {priorities.map((item, index) => (
                      <li key={index} 
                          className={`p-2 rounded-md flex items-center justify-between ${itemBg} ${selectedPriority === index ? 'border-2 border-blue-500' : ''}`}>
                        <span>{item}</span>
                        <button
                          onClick={() => setSelectedPriority(index)}
                          className={`px-2 py-1 text-xs rounded ${selectedPriority === index ? buttonPrimaryBg + ' text-white' : buttonSecondaryBg}`}
                        >
                          {selectedPriority === index ? 'Selected' : 'Select'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className={`p-4 rounded-md ${itemBg} flex items-center`}>
                  <p>⚠️ No priorities set. Consider setting some in the Clarity section.</p>
                </div>
              )}
            </div>
            
            {/* Capture Distractions */}
            <div className={`p-6 rounded-lg shadow-md ${cardBg}`}>
              <h2 className="text-xl font-semibold mb-4">Capture Distractions</h2>
              <p className={`mb-4 ${subtleText}`}>
                When your mind wanders, capture it here and return to focus.
              </p>
              
              <div className="mb-4 flex">
                <input
                  type="text"
                  value={distraction}
                  onChange={(e) => setDistraction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && distraction.trim()) {
                      handleAddDistraction();
                      e.preventDefault();
                    }
                  }}
                  className={`flex-grow p-2 rounded-l-md ${inputBg} ${textColor} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Add a distraction..."
                />
                <button 
                  type="button"
                  onClick={handleAddDistraction}
                  className={`px-4 py-2 ${buttonPrimaryBg} text-white rounded-r-md`}
                >
                  +
                </button>
              </div>
              
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {distractions.map((item, index) => (
                  <li key={index} className={`p-2 rounded-md flex justify-between items-center ${itemBg}`}>
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveDistraction(index)}
                      className="p-1 rounded-full hover:bg-gray-600"
                    >
                      ✕
                    </button>
                  </li>
                ))}
                {distractions.length === 0 && (
                  <li className={`p-2 italic text-center ${subtleText}`}>
                    No distractions captured
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setPage('clarity')}
              className={`px-6 py-3 rounded-md ${buttonSecondaryBg}`}
            >
              Back to Clarity
            </button>
            <button
              onClick={() => setPage('insights')}
              className={`px-6 py-3 ${buttonPrimaryBg} text-white rounded-md`}
            >
              View Insights
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Insights page
  if (page === 'insights') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300 flex flex-col items-center`}>
        <div className="absolute top-4 right-4 flex">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 mr-2">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setPage('landing')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            ✕
          </button>
        </div>
        
        <div className="max-w-2xl w-full p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6 text-center">Focus Insights</h1>
          
          {/* Achievements */}
          <div className={`p-6 rounded-lg shadow-md mb-6 ${cardBg}`}>
            <h2 className="text-xl font-semibold mb-4">
              🏆 My Achievements
            </h2>
            
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {achievements.map((achievement, index) => (
                <li key={index} className={`p-3 rounded-md ${itemBg}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{achievement.text}</span>
                    <div className="flex items-center">
                      <span className={`mr-2 ${subtleText}`}>
                        {achievement.date}
                      </span>
                      <button
                        onClick={() => handleRemoveAchievement(index)}
                        className="p-1 rounded-full hover:bg-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {achievements.length === 0 && (
                <li className={`p-2 italic text-center ${subtleText}`}>
                  No achievements yet. Complete a priority to add it here!
                </li>
              )}
            </ul>
          </div>
          
          {/* Distractions Summary */}
          <div className={`p-6 rounded-lg shadow-md mb-6 ${cardBg}`}>
            <h2 className="text-xl font-semibold mb-4">
              📋 Current Distractions
            </h2>
            
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {distractions.map((item, index) => (
                <li key={index} className={`p-3 rounded-md ${itemBg}`}>
                  <div className="flex justify-between items-center">
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveDistraction(index)}
                      className="p-1 rounded-full hover:bg-gray-600"
                    >
                      ✓ Done
                    </button>
                  </div>
                </li>
              ))}
              {distractions.length === 0 && (
                <li className={`p-2 italic text-center ${subtleText}`}>
                  No distractions currently captured.
                </li>
              )}
            </ul>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setPage('landing')}
              className={`px-6 py-3 rounded-md ${buttonSecondaryBg}`}
            >
              Back to Home
            </button>
            <button
              onClick={() => setPage('focus')}
              className={`px-6 py-3 ${buttonPrimaryBg} text-white rounded-md`}
            >
              Start Focus Session
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default App;
