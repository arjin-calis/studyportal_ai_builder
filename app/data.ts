// data.ts

export type Course = {
  id: string;
  name: string;
  category: "Core" | "Math" | "Elective";
  credits: number;
};

export type MasterRequirements = {
  [key: string]: {
    requiredCourses: string[];
    description: string;
  };
};

export const TUE_COURSES: Course[] = [
  // Math & Logic
  { id: "2WBB0", name: "Calculus", category: "Math", credits: 5 },
  { id: "2WAB0", name: "Linear Algebra", category: "Math", credits: 5 },
  { id: "2IT60", name: "Logic and Set Theory", category: "Math", credits: 5 },
  
  // CS Core - Fundamentals
  { id: "2IPC0", name: "Programming Methods", category: "Core", credits: 5 },
  { id: "JBI010", name: "Algorithms and Data Structures", category: "Core", credits: 5 },
  { id: "2ILC0", name: "Automata, Language Theory and Complexity", category: "Core", credits: 5 },
  
  // CS Core - Systems & Data
  { id: "2INC0", name: "Operating Systems", category: "Core", credits: 5 },
  { id: "2DB15", name: "Database Technology", category: "Core", credits: 5 },
  { id: "2IC00", name: "Computer Networks and Security", category: "Core", credits: 5 },
  { id: "2OBL0", name: "Software Engineering and Design", category: "Core", credits: 5 },
  
  // Advanced / Electives
  { id: "2AMM10", name: "Machine Learning", category: "Elective", credits: 5 },
  { id: "JBI050", name: "Data Management for Data Analytics", category: "Elective", credits: 5 },
  { id: "2ID50", name: "Datamodeling and Databases", category: "Elective", credits: 5 },
  { id: "2IMI00", name: "Artificial Intelligence", category: "Elective", credits: 5 }
];

export const MASTER_REQUIREMENTS: MasterRequirements = {
  "Embedded Systems": {
    requiredCourses: ["2INC0", "JBI010", "2WBB0"],
    description: "Requires strong foundations in OS, algorithms, and calculus."
  },
  "Cybersecurity": {
    requiredCourses: ["2IC00", "2INC0", "2IT60"],
    description: "Focuses on network security, operating systems, and discrete logic."
  },
  "Artificial Intelligence": {
    requiredCourses: ["2AMM10", "2WAB0", "JBI010"],
    description: "Requires linear algebra, algorithms, and basic machine learning knowledge."
  },
  "Data Science in Engineering": {
    requiredCourses: ["2DB15", "JBI050", "2WAB0"],
    description: "Requires advanced database knowledge and linear algebra."
  }
};