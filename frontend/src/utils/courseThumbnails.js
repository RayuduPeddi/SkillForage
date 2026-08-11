// Curated, ultra-sharp high resolution thumbnails for course categories and topics
export const COURSE_THUMBNAILS = {
  'data structures & algorithms': 'https://images.unsplash.com/photo-1516116211227-bbc13c749b5c?w=800&auto=format&fit=crop&q=80',
  'system design': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'fullstack web development': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
  'ai & machine learning': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
  'python': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
  'javascript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
  'cloud & devops': 'https://images.unsplash.com/photo-1484417894907-623942c8ec29?w=800&auto=format&fit=crop&q=80',
  'cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
  'database & backend': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
};

export function getAutoCourseThumbnail(category = '', title = '') {
  const query = `${category} ${title}`.toLowerCase();
  
  if (query.includes('algorithm') || query.includes('data structure') || query.includes('dsa') || query.includes('array') || query.includes('tree')) {
    return COURSE_THUMBNAILS['data structures & algorithms'];
  }
  if (query.includes('system design') || query.includes('distributed') || query.includes('scale') || query.includes('architecture') || query.includes('microservice')) {
    return COURSE_THUMBNAILS['system design'];
  }
  if (query.includes('react') || query.includes('fullstack') || query.includes('node') || query.includes('web') || query.includes('frontend')) {
    return COURSE_THUMBNAILS['fullstack web development'];
  }
  if (query.includes('ai') || query.includes('machine learning') || query.includes('llm') || query.includes('deep learning') || query.includes('neural')) {
    return COURSE_THUMBNAILS['ai & machine learning'];
  }
  if (query.includes('python')) {
    return COURSE_THUMBNAILS['python'];
  }
  if (query.includes('cloud') || query.includes('devops') || query.includes('docker') || query.includes('kubernetes') || query.includes('aws')) {
    return COURSE_THUMBNAILS['cloud & devops'];
  }
  if (query.includes('security') || query.includes('cyber') || query.includes('cryptography')) {
    return COURSE_THUMBNAILS['cybersecurity'];
  }
  if (query.includes('database') || query.includes('sql') || query.includes('mongo') || query.includes('redis')) {
    return COURSE_THUMBNAILS['database & backend'];
  }

  return COURSE_THUMBNAILS.default;
}
