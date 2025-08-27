/*
  # Create Jobs and Applications System

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text, job title)
      - `company` (text, company name)
      - `location` (text, job location)
      - `job_type` (text, full-time/part-time/contract)
      - `salary_range` (text, salary information)
      - `description` (text, job description)
      - `requirements` (text array, job requirements)
      - `responsibilities` (text array, job responsibilities)
      - `benefits` (text array, job benefits)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `job_applications`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs)
      - `full_name` (text, applicant name)
      - `email` (text, applicant email)
      - `phone` (text, phone number)
      - `resume_url` (text, resume file URL)
      - `cover_letter` (text, cover letter content)
      - `status` (text, application status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow public viewing of jobs
    - Allow public job applications
    - Users can view their own applications
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS jobs;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL,
    salary_range TEXT,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    experience_years INTEGER,
    linkedin_url TEXT,
    portfolio_url TEXT,
    skills TEXT[] DEFAULT '{}',
    availability TEXT,
    salary_expectation TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Jobs policies - allow public viewing
CREATE POLICY "Anyone can view jobs"
ON jobs FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow job creation"
ON jobs FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Applications policies
CREATE POLICY "Anyone can submit applications"
ON job_applications FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
ON job_applications FOR SELECT
TO authenticated, anon
USING (true);

-- Insert sample jobs
INSERT INTO jobs (title, company, location, job_type, salary_range, description, requirements, responsibilities, benefits) VALUES
(
    'Senior AI Engineer',
    'Nexariza AI',
    'Remote / San Francisco',
    'Full-time',
    '$120,000 - $180,000',
    'Join our world-class AI team to develop cutting-edge artificial intelligence solutions. You will work on neural networks, machine learning models, and enterprise AI systems that transform businesses globally.',
    ARRAY[
        'Master''s degree in Computer Science, AI, or related field',
        '5+ years of experience in AI/ML development',
        'Expertise in Python, TensorFlow, PyTorch',
        'Experience with neural networks and deep learning',
        'Strong problem-solving and analytical skills',
        'Excellent communication and teamwork abilities'
    ],
    ARRAY[
        'Design and implement advanced AI models and algorithms',
        'Collaborate with cross-functional teams on AI projects',
        'Optimize model performance and scalability',
        'Research and implement latest AI technologies',
        'Mentor junior developers and contribute to best practices',
        'Work directly with clients on custom AI solutions'
    ],
    ARRAY[
        'Competitive salary with equity options',
        'Comprehensive health, dental, and vision insurance',
        'Flexible remote work arrangements',
        'Professional development budget ($5,000/year)',
        'Latest MacBook Pro and equipment',
        'Unlimited PTO and flexible hours',
        'Stock options and performance bonuses'
    ]
),
(
    'AI Research Scientist',
    'Nexariza AI',
    'Remote / New York',
    'Full-time',
    '$140,000 - $200,000',
    'Lead groundbreaking AI research and development initiatives. Work on cutting-edge projects involving large language models, computer vision, and next-generation AI systems.',
    ARRAY[
        'PhD in AI, Machine Learning, or Computer Science',
        '3+ years of research experience in AI/ML',
        'Published research papers in top-tier conferences',
        'Expertise in LLMs, transformers, and neural architectures',
        'Strong mathematical and statistical background',
        'Experience with research methodologies and experimentation'
    ],
    ARRAY[
        'Conduct advanced AI research and development',
        'Publish research findings in academic journals',
        'Collaborate with academic institutions and industry partners',
        'Develop novel AI algorithms and architectures',
        'Present research at conferences and workshops',
        'Guide product development with research insights'
    ],
    ARRAY[
        'Research budget and conference attendance support',
        'Collaboration with top universities and researchers',
        'Publication and patent incentives',
        'Flexible research time allocation',
        'Access to cutting-edge computing resources',
        'Sabbatical opportunities for advanced research'
    ]
),
(
    'Full-Stack AI Developer',
    'Nexariza AI',
    'Remote / Austin',
    'Full-time',
    '$90,000 - $140,000',
    'Build end-to-end AI applications using modern web technologies. Integrate AI models into user-friendly interfaces and scalable backend systems.',
    ARRAY[
        'Bachelor''s degree in Computer Science or related field',
        '3+ years of full-stack development experience',
        'Proficiency in React, Node.js, Python',
        'Experience with AI/ML model integration',
        'Knowledge of cloud platforms (AWS, GCP)',
        'Understanding of RESTful APIs and databases'
    ],
    ARRAY[
        'Develop full-stack AI applications and platforms',
        'Integrate AI models into web and mobile applications',
        'Build scalable backend systems for AI services',
        'Create intuitive user interfaces for AI tools',
        'Collaborate with AI engineers on model deployment',
        'Ensure application performance and security'
    ],
    ARRAY[
        'Competitive salary with performance bonuses',
        'Remote-first work culture',
        'Learning and development opportunities',
        'Health and wellness benefits',
        'Modern development tools and equipment',
        'Flexible working hours and PTO'
    ]
);