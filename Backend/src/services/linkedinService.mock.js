const mockProfiles = {
  'meenajigaurav9589@gmail.com': {
    name: 'Gaurav Meena',
    headline: 'Full Stack Developer | MERN Stack Specialist',
    company: 'Tech Innovations Pvt Ltd',
    location: 'Bangalore, India',
    about: 'Passionate software engineer with 3+ years of experience building scalable web applications. Specialized in React, Node.js, and MongoDB.',
    experience: [
      {
        title: 'Senior Full Stack Developer',
        companyName: 'Tech Innovations Pvt Ltd',
        duration: '2023 - Present',
        description: 'Leading development of enterprise web applications'
      },
      {
        title: 'Software Engineer',
        companyName: 'StartupXYZ',
        duration: '2021 - 2023',
        description: 'Built and maintained multiple client projects'
      }
    ]
  }
};

const fetchLinkedInProfile = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (mockProfiles[email]) {
    return { success: true, profile: mockProfiles[email] };
  }

  const username = email.split('@')[0];
  const name = username.replace(/[0-9_.-]/g, ' ').trim().split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const genericProfile = {
    name: name || 'Professional',
    headline: 'Professional',
    company: 'Company Name',
    location: 'Location',
    about: 'Professional with experience in their field.',
    experience: [
      {
        title: 'Current Role',
        companyName: 'Company Name',
        duration: 'Present',
        description: 'Working in their current role'
      }
    ]
  };

  return { success: true, profile: genericProfile };
};

module.exports = { fetchLinkedInProfile };
