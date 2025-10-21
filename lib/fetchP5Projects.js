// Utility function to fetch p5js projects from Heroku
export async function fetchP5Projects() {
  try {
    const response = await fetch('https://p5-heroku-ea7d718a9c54.herokuapp.com/p5jsProjects.json', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch p5 projects:', response.statusText);
      return [];
    }

    
    return await response.json();
  } catch (error) {
    console.error('Error fetching p5 projects:', error);
    return [];
  }
}

