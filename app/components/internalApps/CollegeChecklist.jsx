"use client"

import React, { useState, useEffect } from 'react';

const CollegeChecklist = () => {
  const checklistData = {
    freshman: {
      title: "Freshman Year",
      tasks: [
        { id: 1, text: "Work hard and maintain good grades", details: "Stay focused on grades and build strong study habits early on" },
        { id: 2, text: "Meet with counselor about AP/Pre-AP classes", details: "Ask counselor about taking AP or Pre-AP classes to challenge yourself" },
        { id: 3, text: "Join an academic club", details: "Join clubs like Robotics, Mathematics, Debate, Soccer to build a social network of hard workers. You are the average of who you spend time with. These clubs provide leadership opportunities and connections with others applying to college" },
        { id: 4, text: "Research summer STEM camps", details: "Search for camps at local universities to experience college life firsthand. Google 'engineering summer camps in [city]' or 'engineering summer camps at [university]'" },
        { id: 5, text: "Research potential college majors", details: "Review required university courses and career paths for majors you're interested in. Look up expected salaries and job opportunities" },
        { id: 6, text: "Start standardized test prep", details: "Begin familiarizing yourself with SAT/ACT format through practice tests and prep materials" },
        { id: 7, text: "Create a resume", details: "Start documenting your activities, awards, and volunteer work early to track your achievements" }
      ]
    },
    sophomore: {
      title: "Sophomore Year", 
      tasks: [
        { id: 1, text: "Maintain strong academic performance", details: "Keep your grades up and stay focused" },
        { id: 2, text: "Take leadership roles in clubs", details: "Start new initiatives and projects to gain valuable leadership experience" },
        { id: 3, text: "Enroll in AP courses", details: "Take AP courses and aim to do well on the exams for college credit" },
        { id: 4, text: "Take PSAT/PreACT", details: "Get experience with standardized testing and identify areas for improvement" },
        { id: 5, text: "Start college visits", details: "Visit local colleges to get a feel for different campus sizes and environments. Send an email to a professor in your local community college to understand what their college experience was like." },
        { id: 6, text: "Consider summer internships", details: "Look for opportunities at local companies or research labs to gain real-world experience" }
      ]
    },
    junior: {
      title: "Junior Year",
      tasks: [
        { id: 1, text: "Apply to summer college programs", details: "Research and apply to programs like SAMS CMU, MITES MIT, Code Longhorn" },
        { id: 2, text: "Begin college application essays", details: "Start writing essays about yourself, your accomplishments, and your goals. Focus on specific numbers and vivid details. Lookup the application prompts of the colleges you want to apply to. Find themes between the prompts" },
        { id: 3, text: "Take community college classes", details: "Some highschools offer ealy college programs that partner with collunity colleges. Earn early college credits to help graduate early, take advanced classes, or double major" },
        { id: 4, text: "Meet regularly with college counselor", details: "Your college councelor should be your best friend Junior and Senior year. Dont be afraid to introduce yourself sooner. Ask about pathways to target schools, available scholarships, and connections with alumni" },
        { id: 5, text: "Take SAT/ACT", details: "Take tests early to allow time for retakes if needed. Consider test-optional schools" },
        { id: 6, text: "Research financial aid", details: "Understand FAFSA, CSS Profile, and start searching for scholarships" },
        { id: 7, text: "Create college list", details: "Research and categorize schools into reach, target, and safety options" }
      ]
    },
    senior: {
      title: "Senior Year",
      tasks: [
        { id: 1, text: "Research fly-out programs", details: "Look for fly-out opportunities at schools like Caltech, Harvey Mudd, Carnegie Mellon, Rice, MIT" },
        { id: 2, text: "Submit college applications", details: "Start applications early and use AI tools like ChatGPT to help with planning" },
        { id: 3, text: "Request recommendation letters", details: "Ask two teachers before summer ends, ideally those who know you well" },
        { id: 4, text: "Finalize application essays", details: "Adapt summer program essays, include specific numbers, and add vivid details. Use AI tools to strengthen inspirational tone" },
        { id: 5, text: "Submit FAFSA/CSS Profile", details: "Complete financial aid forms as early as possible after October 1st" },
        { id: 6, text: "Apply for scholarships", details: "Use resources like FastWeb, Scholarships.com, and local community organizations" },
        { id: 7, text: "Compare financial aid packages", details: "Carefully review and compare offers before making final decision. Give a phone call to the finanical aid offices of universities to understand what options you have. It could mean work study or scholarship applications." }
      ]
    }
  };

  const [completedTasks, setCompletedTasks] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('collegeChecklist');
    console.log(saved)
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever completedTasks changes
  useEffect(() => {
    if (Object.keys(completedTasks).length > 0) {
      localStorage.setItem('collegeChecklist', JSON.stringify(completedTasks));
    }
  }, [completedTasks]);

  const toggleTask = (year, taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [`${year}-${taskId}`]: !prev[`${year}-${taskId}`]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">College Application Checklist</h1>
      
      {Object.entries(checklistData).map(([year, yearData]) => (
        <div key={year} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{yearData.title}</h2>
          <div className="space-y-3">
            {yearData.tasks.map(task => (
              <div key={task.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow">
                <input
                  type="checkbox"
                  checked={completedTasks[`${year}-${task.id}`] || false}
                  onChange={() => toggleTask(year, task.id)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{task.text}</p>
                  <p className="text-sm text-gray-600">{task.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollegeChecklist;
