import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '../../../lib/mongodb';
import { Comment } from '../../../models/Comment';

// List of words to filter out
const badWords = ['fuck', 'shit', 'bitch', 'nigger', 'ass', 'asshole', 'bastard', 'cunt', 'damn', 'dick', 'douche', 'fag', 'faggot', 'piss', 'pussy', 'slut', 'whore', 'cock', 'retard', '']; // Add your list of bad words here

// Helper function to filter bad words
const filterBadWords = (text) => {
  let filteredText = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  return filteredText;
};

export async function GET(request) {
  try {
    await connectToDatabase();
    const comments = await Comment.find().sort({ timestamp: -1 });

    revalidatePath('/');

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, comment } = await request.json();

    if (!name || !comment) {
      return NextResponse.json(
        { error: 'Name and comment are required' },
        { status: 400 }
      );
    }

    // Filter bad words from name and comment
    const filteredName = filterBadWords(name);
    const filteredComment = filterBadWords(comment);

    const newComment = await Comment.create({
      name: filteredName,
      comment: filteredComment,
      timestamp: new Date()
    });

    revalidatePath('/');

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
