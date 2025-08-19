-- Add intermediate and advanced level quizzes for Programming
INSERT INTO skill_quizzes (skill_category, skill_level, questions, passing_score) VALUES 
('Programming', 'intermediate', '[
  {
    "question": "What is the main difference between REST and GraphQL APIs?",
    "options": ["REST uses HTTP, GraphQL uses WebSocket", "REST has multiple endpoints, GraphQL has a single endpoint", "REST is faster than GraphQL", "REST is newer than GraphQL"],
    "correct": 1
  },
  {
    "question": "In object-oriented programming, what does polymorphism allow you to do?",
    "options": ["Create multiple classes", "Use the same interface for different data types", "Inherit from multiple classes", "Access private variables"],
    "correct": 1
  },
  {
    "question": "Which design pattern is commonly used for managing application state?",
    "options": ["Singleton", "Observer", "Factory", "Strategy"],
    "correct": 1
  },
  {
    "question": "What is the purpose of database indexing?",
    "options": ["To encrypt data", "To improve query performance", "To backup data", "To compress tables"],
    "correct": 1
  },
  {
    "question": "In version control, what is the purpose of branching?",
    "options": ["To delete old code", "To work on features in isolation", "To compress files", "To backup code"],
    "correct": 1
  }
]', 75),

('Programming', 'advanced', '[
  {
    "question": "What is the time complexity of QuickSort in the average case?",
    "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    "correct": 1
  },
  {
    "question": "In microservices architecture, what is the purpose of an API Gateway?",
    "options": ["To store data", "To route requests and handle cross-cutting concerns", "To compile code", "To test applications"],
    "correct": 1
  },
  {
    "question": "What is the CAP theorem in distributed systems?",
    "options": ["A theorem about data consistency", "You can only guarantee 2 out of 3: Consistency, Availability, Partition tolerance", "A caching strategy", "A deployment pattern"],
    "correct": 1
  },
  {
    "question": "Which technique helps prevent SQL injection attacks?",
    "options": ["Using faster databases", "Parameterized queries/prepared statements", "Adding more servers", "Using NoSQL databases"],
    "correct": 1
  },
  {
    "question": "In system design, what is eventual consistency?",
    "options": ["Data is always consistent", "Data will become consistent over time", "Data is never consistent", "Data consistency is not important"],
    "correct": 1
  }
]', 80);

-- Add intermediate and advanced level quizzes for Design
INSERT INTO skill_quizzes (skill_category, skill_level, questions, passing_score) VALUES 
('Design', 'intermediate', '[
  {
    "question": "What is the purpose of a design system?",
    "options": ["To make designs colorful", "To ensure consistency across products", "To make designs complex", "To reduce file sizes"],
    "correct": 1
  },
  {
    "question": "In UX design, what does A/B testing help you determine?",
    "options": ["Color preferences", "Which version performs better", "Font sizes", "Loading speed"],
    "correct": 1
  },
  {
    "question": "What is the 60-30-10 rule in color theory?",
    "options": ["Font size ratios", "Color distribution in design", "Spacing measurements", "Image dimensions"],
    "correct": 1
  },
  {
    "question": "What is the purpose of user personas in design?",
    "options": ["To make designs pretty", "To understand target user needs and behaviors", "To choose colors", "To set deadlines"],
    "correct": 1
  },
  {
    "question": "In responsive design, what does mobile-first approach mean?",
    "options": ["Only design for mobile", "Design for mobile first, then scale up", "Mobile is most important", "Use mobile colors"],
    "correct": 1
  }
]', 75),

('Design', 'advanced', '[
  {
    "question": "What is the difference between UX and Service Design?",
    "options": ["No difference", "Service Design considers the entire service ecosystem including backend processes", "UX is only for websites", "Service Design is for mobile only"],
    "correct": 1
  },
  {
    "question": "In design thinking, what happens during the Define phase?",
    "options": ["Generate solutions", "Synthesize observations into a problem statement", "Test prototypes", "Implement the final design"],
    "correct": 1
  },
  {
    "question": "What is the purpose of information architecture in UX design?",
    "options": ["Choose colors", "Organize and structure content for usability", "Create animations", "Write code"],
    "correct": 1
  },
  {
    "question": "What is cognitive load in UX design?",
    "options": ["Physical weight of devices", "Mental effort required to use an interface", "Internet speed", "Screen brightness"],
    "correct": 1
  },
  {
    "question": "In accessibility design, what does WCAG stand for?",
    "options": ["Web Color Accessibility Guidelines", "Web Content Accessibility Guidelines", "Website Creation and Growth", "Web Compliance Assessment Guide"],
    "correct": 1
  }
]', 80);

-- Add quizzes for other categories at intermediate and advanced levels
INSERT INTO skill_quizzes (skill_category, skill_level, questions, passing_score) VALUES 
('Marketing', 'intermediate', '[
  {
    "question": "What is the customer acquisition cost (CAC)?",
    "options": ["Total revenue divided by customers", "Cost to acquire one new customer", "Average order value", "Monthly recurring revenue"],
    "correct": 1
  },
  {
    "question": "In digital marketing, what does CTR stand for?",
    "options": ["Customer Trust Rating", "Click-Through Rate", "Cost-Time Ratio", "Conversion Tracking Report"],
    "correct": 1
  },
  {
    "question": "What is A/B testing in marketing?",
    "options": ["Testing two products", "Comparing two versions to see which performs better", "Testing at different times", "Testing different prices"],
    "correct": 1
  },
  {
    "question": "What is the purpose of buyer personas?",
    "options": ["To set prices", "To understand ideal customer characteristics", "To design products", "To hire employees"],
    "correct": 1
  },
  {
    "question": "In content marketing, what is evergreen content?",
    "options": ["Green-themed content", "Content that remains relevant over time", "Seasonal content", "Video content only"],
    "correct": 1
  }
]', 75),

('Marketing', 'advanced', '[
  {
    "question": "What is marketing attribution modeling?",
    "options": ["Assigning credit to different touchpoints in the customer journey", "Creating marketing personas", "Setting marketing budgets", "Designing advertisements"],
    "correct": 0
  },
  {
    "question": "In growth hacking, what is a North Star Metric?",
    "options": ["Total revenue", "The single metric that best captures value delivered to customers", "Number of employees", "Marketing spend"],
    "correct": 1
  },
  {
    "question": "What is cohort analysis in marketing?",
    "options": ["Analyzing customer groups over time", "Testing different age groups", "Surveying customers", "Analyzing competitors"],
    "correct": 0
  },
  {
    "question": "What does LTV:CAC ratio measure?",
    "options": ["Customer satisfaction", "The relationship between lifetime value and acquisition cost", "Revenue growth", "Market share"],
    "correct": 1
  },
  {
    "question": "In omnichannel marketing, what is the main objective?",
    "options": ["Use all marketing channels", "Provide seamless customer experience across all touchpoints", "Increase marketing spend", "Target younger audiences"],
    "correct": 1
  }
]', 80);

-- Add Business category quizzes
INSERT INTO skill_quizzes (skill_category, skill_level, questions, passing_score) VALUES 
('Business', 'intermediate', '[
  {
    "question": "What is the primary purpose of a SWOT analysis?",
    "options": ["To calculate profits", "To assess Strengths, Weaknesses, Opportunities, and Threats", "To hire employees", "To set prices"],
    "correct": 1
  },
  {
    "question": "In project management, what is the critical path?",
    "options": ["The most expensive activities", "The longest sequence of dependent activities", "The shortest route", "The most important stakeholder"],
    "correct": 1
  },
  {
    "question": "What does ROI stand for in business?",
    "options": ["Return on Investment", "Rate of Interest", "Revenue over Income", "Risk of Investment"],
    "correct": 0
  },
  {
    "question": "What is the purpose of a business model canvas?",
    "options": ["To paint business ideas", "To visualize and develop business models", "To calculate taxes", "To design products"],
    "correct": 1
  },
  {
    "question": "In lean methodology, what is waste?",
    "options": ["Trash and garbage", "Any activity that doesnt add value to the customer", "Old equipment", "Unused office space"],
    "correct": 1
  }
]', 75),

('Business', 'advanced', '[
  {
    "question": "What is the difference between strategy and tactics in business?",
    "options": ["No difference", "Strategy is long-term direction, tactics are short-term actions", "Strategy is for small companies", "Tactics are more important"],
    "correct": 1
  },
  {
    "question": "In financial analysis, what does EBITDA represent?",
    "options": ["Total revenue", "Earnings before interest, taxes, depreciation, and amortization", "Employee benefits", "Equipment costs"],
    "correct": 1
  },
  {
    "question": "What is the purpose of scenario planning in business?",
    "options": ["To write scripts", "To prepare for different possible futures", "To plan events", "To design scenarios"],
    "correct": 1
  },
  {
    "question": "In change management, what is the first step in Kotters 8-step process?",
    "options": ["Form a coalition", "Create urgency", "Develop a vision", "Communicate the vision"],
    "correct": 1
  },
  {
    "question": "What is blue ocean strategy?",
    "options": ["Ocean conservation", "Creating uncontested market space", "Naval strategy", "Fishing business strategy"],
    "correct": 1
  }
]', 80);