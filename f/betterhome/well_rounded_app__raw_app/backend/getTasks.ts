export async function main() {
  // Return sample tasks to seed the app
  return [
    { id: '1', title: 'Design new landing page', description: 'Create wireframes and mockups for the new marketing landing page.', status: 'in-progress', priority: 'high', category: 'Design', dueDate: '2025-07-15', createdAt: '2025-06-01' },
    { id: '2', title: 'Fix login bug', description: 'Users are unable to log in with Google OAuth on mobile devices.', status: 'todo', priority: 'high', category: 'Engineering', dueDate: '2025-07-10', createdAt: '2025-06-03' },
    { id: '3', title: 'Write Q3 report', description: 'Compile quarterly metrics and write the executive summary.', status: 'todo', priority: 'medium', category: 'Management', dueDate: '2025-07-20', createdAt: '2025-06-05' },
    { id: '4', title: 'Onboard new engineer', description: 'Set up accounts, schedule intro meetings, and prepare onboarding docs.', status: 'done', priority: 'medium', category: 'HR', dueDate: '2025-06-30', createdAt: '2025-06-10' },
    { id: '5', title: 'Update API documentation', description: 'Reflect recent endpoint changes in the public API docs.', status: 'in-progress', priority: 'low', category: 'Engineering', dueDate: '2025-07-25', createdAt: '2025-06-12' },
    { id: '6', title: 'Plan team offsite', description: 'Book venue, arrange travel, and create agenda for the Q3 team offsite.', status: 'todo', priority: 'low', category: 'Management', dueDate: '2025-08-01', createdAt: '2025-06-15' }
  ];
}
