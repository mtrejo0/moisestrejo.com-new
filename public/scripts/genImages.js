const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('Current working directory:', process.cwd());

const list = require('../../app/components/internalApps/data/choose_adventure.json');

// List of IDs to force regenerate
const forceRegenerateIds = [
  "bad_ending"
];

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'images');
if (!fs.existsSync(imagesDir)){
  fs.mkdirSync(imagesDir);
}

// Delay between image generations in milliseconds
const GENERATION_DELAY = 1000; 

function sanitizePrompt(text) {
  // List of words to filter out or replace
  const replacements = {
    'blood': 'red liquid',
    'gore': 'mess', 
    'violent': 'intense',
    'kill': 'defeat',
    'dead': 'motionless',
    'death': 'end',
    'murder': 'mystery',
    'knife': 'utensil',
    'inhuman': 'strange',
    'haunting': 'mysterious',
    'unspeakable': 'unusual',
    'twisted': 'unusual',
    'otherworldly': 'peculiar',
    'shrieks': 'sounds',
    'lunges': 'moves',
    'melting': 'changing',
    'deathly': 'completely',
    'fate': 'future'
  };

  let sanitized = text.toLowerCase();
  
  // Replace problematic words
  Object.entries(replacements).forEach(([word, replacement]) => {
    sanitized = sanitized.replace(new RegExp(word, 'gi'), replacement);
  });

  return sanitized;
}

async function generateImage(description, id) {
  const imagePath = path.join(imagesDir, `${id}.png`);
  
  // Skip if image already exists and not in forceRegenerateIds
  if (fs.existsSync(imagePath) && !forceRegenerateIds.includes(id)) {
    console.log(`Image for ${id} already exists, skipping...`);
    return;
  }

  try {
    // Sanitize the description
    const sanitizedDescription = sanitizePrompt(description);
    const basePrompt = "Using DALL-E 3, create a dark, atmospheric 1950s-style American diner at night. The scene should be photorealistic with cinematic lighting, deep shadows, and a sense of foreboding. Include flickering neon signs casting an eerie glow, chrome fixtures, and vinyl booths. Scene description: ";
    const response = await openai.images.generate({
      model: "dall-e-3", // Explicitly specify DALL-E 3
      prompt: basePrompt + description,
      n: 1,
      size: "1024x1024",
      quality: "hd", // Request highest quality
      style: "vivid" // More photorealistic results
    });

    const imageUrl = response.data[0].url;
    
    // Download image
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    // Save image
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    
    console.log(`Generated and saved image for ${id}`);
  } catch (error) {
    console.error(`Error generating image for ${id}:`, error);
  }
}

async function processItems(items) {
  for (const [key, value] of Object.entries(items)) {
    console.log(`Key: ${key}`);
    await generateImage(value.text, key);
    
    // Wait for the specified delay before next generation
    await new Promise(resolve => setTimeout(resolve, GENERATION_DELAY));
  }
}

// Call the function to process items
processItems(list).catch(console.error);
