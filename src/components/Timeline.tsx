import React from 'react';

interface TimelineItem {
  type: 'education' | 'experience';
  title: string;
  organization: string;
  date: string;
  location?: string;
  description?: string;
  skills?: string[];
}

const educationItems: TimelineItem[] = [
  {
    type: 'education',
    title: 'Associate\'s degree, Computer Science',
    organization: 'University of the People',
    date: 'Mar 2024 - May 2026',
    description: 'Comprehensive associate\'s program in Computer Science focusing on software development and computer systems. Maintained a GPA of 3.52 while gaining proficiency in web development and core CS fundamentals.',
    skills: ['JavaScript', 'React', 'Python', 'SQL', 'Algebra']
  },
  {
    type: 'education',
    title: 'Diploma in Data Science',
    organization: 'ExploreAI Academy',
    date: 'May 2023 - Jul 2024',
    description:
        'In-depth data science training focused on data visualization, Python programming, machine learning, and professional development. Emphasizes both technical and soft skills to prepare for real-world data roles and interviews.',
    skills: [
      'Python',
      'Statistics',
      'Power BI',
      'Excel',
      'Tableau',
      'Problem Solving',
      'Mind Mapping',
      'Skill Development'
    ]
  },
  {
    type: 'education',
    title: 'AI Programming with Python Nanodegree',
    organization: 'Udacity',
    date: 'Oct 2023 - Feb 2024',
    description: 'Specialized program in Artificial Intelligence focused on foundational Python programming, NumPy, pandas, and building simple neural networks.',
    skills: ['Python']
  },
  {
    type: 'education',
    title: 'Diploma in Graphic Design',
    organization: 'Ecole Privée',
    date: 'Oct 2013 - Jul 2015',
    description:
        'Formal training in graphic design and branding. Focused on creative software tools and visual communication principles.',
    skills: ['Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Branding']
  },
  {
    type: 'education',
    title: 'McKinsey Forward Program',
    organization: 'McKinsey & Company',
    date: 'Issued Dec 2024',
    description: 'Leadership and problem-solving skills for young professionals in the digital age.',
    skills: []
  },
  {
    type: 'education',
    title: 'Machine Learning Fundamentals',
    organization: 'Udacity',
    date: 'Issued Apr 2024',
    description: 'Explored ML, NLP, deep learning, and AWS Lambda.',
    skills: ['Machine Learning', 'Natural Language Processing (NLP)', 'Deep Learning', 'AWS Lambda']
  },
  {
    type: 'education',
    title: 'AWS Machine Learning Fundamentals Nanodegree',
    organization: 'Udacity',
    date: 'Issued Apr 2024',
    description: 'Completed AWS ML Nanodegree through scholarship program.',
    skills: ['Amazon Web Services (AWS)', 'Artificial Intelligence (AI)', 'Python', 'Machine Learning', 'Artificial Neural Networks', 'Computer Vision', 'CNNs', 'AWS SageMaker']
  },
  {
    type: 'education',
    title: 'AI Programming with Python',
    organization: 'Udacity',
    date: 'Issued Nov 2023',
    description: 'Python, data analysis, visualization, wrangling, and neural networks.',
    skills: ['Python', 'Data Analysis', 'Data Visualization', 'Data Wrangling', 'Neural Networks']
  },
  {
    type: 'education',
    title: 'Data Strategy',
    organization: '365 Data Science',
    date: 'Issued Nov 2022',
    description: 'Understanding of strategic roles and planning in data-driven organizations.',
    skills: []
  },
  {
    type: 'education',
    title: 'Google Business Intelligence Certificate',
    organization: 'Coursera',
    date: 'Issued Sep 2023 - Expired Nov 2023',
    description: 'Training in BI using Excel, Tableau, and analytics fundamentals.',
    skills: ['Microsoft Excel', 'Data Analysis', 'Tableau', 'Business Analysis', 'Business Analytics']
  }

];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Data Scientist',
    organization: 'Yma Digital',
    date: 'Jan 2022 - Present · 3 years 5 months',
    location: 'Casablanca-Settat, Morocco · Remote',
    description: 'Constructed algorithms using statistical methods to analyze large datasets and deliver business insights using Python and Power BI.',
    skills: ['Python', 'Power BI', 'SQL', 'Analytics', 'Business Analysis', 'Market Research', 'NLP', 'TensorFlow', 'Machine Learning']
  },
  {
    type: 'experience',
    title: 'Software Engineer (Internship)',
    organization: 'alx_africa',
    date: 'Jun 2023 - Jun 2024 · 1 year 1 month',
    location: 'Casablanca-Settat, Morocco · Hybrid',
    description: 'Completed intensive software engineering training covering front-end, back-end, DevOps, and mobile development roles, with 70 hours/week.',
    skills: ['React.js', 'Flask', 'Python', 'JavaScript', 'SQL', 'Git', 'C', 'Emacs', 'GitHub']
  },
  {
    type: 'experience',
    title: 'Data Analyst Intern',
    organization: 'MeriSKILL',
    date: 'Sep 2023 - Oct 2023 · 2 months',
    location: 'Noida, India · Remote',
    description: 'Performed data analysis and visualization using Power BI and Excel. Applied strategic thinking to draw insights.',
    skills: ['Power BI', 'Excel', 'Python', 'Strategic Thinking']
  },
  {
    type: 'experience',
    title: 'WordPress Developer',
    organization: 'Virtually MC',
    date: 'May 2022 - Aug 2023 · 1 year 4 months',
    location: 'Monaco · Remote',
    description: 'Developed WordPress websites using HTML5, CSS3, JS, and PHP. Implemented SEO strategies and ensured cross-browser compatibility.',
    skills: ['WordPress', 'HTML', 'CSS', 'PHP', 'SEO', 'CRM', 'UX/UI']
  },
  {
    type: 'experience',
    title: 'Senior Graphic Designer',
    organization: 'Ennova Group Inc',
    date: 'May 2024 - Sep 2024 · 5 months',
    location: 'Casablanca-Settat, Morocco · On-site',
    description: 'Contributed to B2B marketing strategy and brand awareness through visual content creation and social media materials.',
    skills: ['Adobe InDesign', 'Photoshop', 'Illustrator', 'Premiere Pro', 'SEO', 'Agile Methodologies']
  },
  {
    type: 'experience',
    title: 'Senior Graphic Designer',
    organization: 'BTOBExchange',
    date: 'May 2024 - Sep 2024 · 5 months',
    location: 'Casablanca-Settat, Morocco · On-site',
    description: 'Created multimedia content for branding and marketing initiatives, contributed to SEO and video production strategies.',
    skills: ['Video Editing', 'SEO', 'Strategic Communication', 'Social Media', 'Illustrator', 'Premiere Pro']
  },
  {
    type: 'experience',
    title: 'Senior Graphic Designer',
    organization: 'COCOFIELD',
    date: 'Aug 2021 - Nov 2021 · 4 months',
    location: 'Casablanca, Morocco',
    description: 'Led a design team and increased online engagement by 15% through compelling visual content.',
    skills: ['Design', 'Branding', 'Adobe Creative Suite', 'Video Production', 'Web Design']
  },
  {
    type: 'experience',
    title: 'Social Media Designer',
    organization: 'Hello',
    date: 'May 2021 - Nov 2021 · 7 months',
    location: 'Casablanca, Morocco',
    description: 'Created social media content, increasing engagement by 30%. Analyzed trends and adapted visuals accordingly.',
    skills: ['Social Media', 'Branding', 'Photoshop', 'Graphic Design']
  },
  {
    type: 'experience',
    title: 'Art Director',
    organization: 'Premium Prestige Tours',
    date: 'Jan 2020 - Apr 2021 · 1 year 4 months',
    location: 'Casablanca, Morocco',
    description: 'Oversaw visual identity, branding, and digital campaigns using analytics and creative tools.',
    skills: ['Google Analytics', 'Branding', 'Design', 'Photoshop']
  }
];
const TimelineItem: React.FC<{ item: TimelineItem }> = ({ item }) => (
  <div className="mb-8 relative">
    <div className="absolute top-0 left-0 w-2 h-full bg-gray-200 dark:bg-gray-700" />
    <div className="ml-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="absolute left-0 top-4 w-6 h-6 bg-orange-500 rounded-full border-4 border-white dark:border-gray-800" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{item.organization}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{item.date}</p>
      {item.location && (
        <p className="text-sm text-gray-500 dark:text-gray-500">{item.location}</p>
      )}
      {item.description && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
      )}
      {item.skills && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Timeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Experience</h2>
          {experienceItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Education</h2>
          {educationItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;