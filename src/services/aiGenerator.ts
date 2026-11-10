export interface AiGenerationConfig {
  apiKey?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
  language?: 'en' | 'fil';
  topicPrompt?: string;
}

const STORAGE_KEY = 'gemini_api_key';

export function getStoredApiKey(): string {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && local.trim().length > 0) return local.trim();
  } catch {}
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
}

export function setStoredApiKey(key: string): void {
  try {
    if (!key.trim()) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, key.trim());
    }
  } catch {}
}

export function hasAiApiKey(): boolean {
  return getStoredApiKey().length > 5;
}

/**
 * Tests an API key by making a lightweight request to Gemini.
 */
export async function testAiConnection(apiKey?: string): Promise<{ success: boolean; message: string }> {
  const key = (apiKey || getStoredApiKey()).trim();
  if (!key) {
    return { success: false, message: 'No Gemini API key provided. Please enter an API key.' };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'Respond with the word "pong" in JSON: {"status": "pong"}' }],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            max_output_tokens: 60,
          },
        }),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, message: `Connection failed: ${msg}` };
    }

    return { success: true, message: 'Connected to Gemini API successfully!' };
  } catch (err: any) {
    return { success: false, message: `Network error connecting to Gemini API: ${err?.message || err}` };
  }
}

/**
 * Low-level caller to Gemini with JSON structured response formatting.
 */
async function callGeminiJson<T>(prompt: string, apiKey?: string): Promise<T | null> {
  const key = (apiKey || getStoredApiKey()).trim();
  if (!key) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.8,
            max_output_tokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    return JSON.parse(candidateText) as T;
  } catch (err) {
    console.warn('Gemini generation error, will fall back to local procedural generator:', err);
    return null;
  }
}

/**
 * AI-assisted Trivia generator
 */
export async function generateAiTrivia(
  config: AiGenerationConfig
): Promise<Array<{
  id: string;
  category: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}> | null> {
  const langPrompt = config.language === 'fil'
    ? 'Questions and options must be in natural Filipino / Taglish, suitable for Filipino family gatherings.'
    : 'Questions must be in English, suitable for family game night.';

  const prompt = `Generate a JSON array of exactly ${config.count} family-friendly trivia questions.
Category: ${config.category || 'General Knowledge'}
Difficulty: ${config.difficulty || 'medium'}
${config.topicPrompt ? `Custom Topic/Theme: "${config.topicPrompt}"` : ''}
${langPrompt}

Return JSON with this EXACT structure:
{
  "questions": [
    {
      "prompt": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Brief explanation for the host why this is correct",
      "category": "${config.category || 'General Knowledge'}",
      "difficulty": "${config.difficulty || 'medium'}"
    }
  ]
}
Each question must have exactly 4 plausible options, with correctOptionIndex between 0 and 3.`;

  const parsed = await callGeminiJson<{ questions: any[] }>(prompt, config.apiKey);
  if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    return null;
  }

  return parsed.questions.map((q, idx) => ({
    id: `ai_triv_${Date.now()}_${idx}`,
    category: q.category || config.category || 'General Trivia',
    prompt: q.prompt,
    options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
    explanation: q.explanation || 'Verified answer.',
    difficulty: (q.difficulty as any) || 'medium',
  }));
}

/**
 * AI-assisted Charades prompt generator
 */
export async function generateAiCharades(
  config: AiGenerationConfig
): Promise<Array<{
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}> | null> {
  const prompt = `Generate a JSON array of exactly ${config.count} family party Charades prompts (actions, everyday mishaps, movie characters, animals, or funny situations to act out without speaking).
Category: ${config.category || 'Actions & Verbs'}
Difficulty: ${config.difficulty || 'medium'}
Language: ${config.language === 'fil' ? 'Filipino / Taglish culture relatable' : 'English family friendly'}
${config.topicPrompt ? `Custom Topic/Theme: "${config.topicPrompt}"` : ''}

Return JSON with this EXACT structure:
{
  "prompts": [
    {
      "word": "Prompt phrase to act out",
      "category": "${config.category || 'Actions & Verbs'}",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}`;

  const parsed = await callGeminiJson<{ prompts: any[] }>(prompt, config.apiKey);
  if (!parsed || !Array.isArray(parsed.prompts) || parsed.prompts.length === 0) {
    return null;
  }

  return parsed.prompts.map((p, idx) => {
    const diff = (p.difficulty as 'easy' | 'medium' | 'hard') || 'medium';
    const points = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
    return {
      id: `ai_ch_${Date.now()}_${idx}`,
      word: p.word,
      category: p.category || config.category || 'Charades',
      difficulty: diff,
      points,
    };
  });
}

/**
 * AI-assisted Pictionary prompt generator
 */
export async function generateAiPictionary(
  config: AiGenerationConfig
): Promise<Array<{
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}> | null> {
  const prompt = `Generate a JSON array of exactly ${config.count} clear, drawable Pictionary prompts (objects, scenes, animals, foods, or actions that someone can sketch on a whiteboard).
Category: ${config.category || 'Everyday Objects'}
Difficulty: ${config.difficulty || 'medium'}
${config.topicPrompt ? `Custom Topic/Theme: "${config.topicPrompt}"` : ''}
Must NOT be abstract or impossible to draw in 60 seconds.

Return JSON with this EXACT structure:
{
  "prompts": [
    {
      "word": "Drawable prompt (e.g., 'Campfire with Marshmallows', 'Lighthouse in a Storm')",
      "category": "${config.category || 'Everyday Objects'}",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}`;

  const parsed = await callGeminiJson<{ prompts: any[] }>(prompt, config.apiKey);
  if (!parsed || !Array.isArray(parsed.prompts) || parsed.prompts.length === 0) {
    return null;
  }

  return parsed.prompts.map((p, idx) => ({
    id: `ai_pic_${Date.now()}_${idx}`,
    word: p.word,
    category: p.category || config.category || 'Pictionary',
    difficulty: (p.difficulty as any) || 'medium',
  }));
}

/**
 * AI-assisted Guess the Word puzzle generator
 */
export async function generateAiGuessWord(
  config: AiGenerationConfig
): Promise<Array<{
  id: string;
  word: string;
  category: string;
  clues: [string, string, string, string];
  difficulty: 'easy' | 'medium' | 'hard';
}> | null> {
  const prompt = `Generate a JSON array of exactly ${config.count} "Guess the Word" puzzles.
Each puzzle must have a secret target word and EXACTLY 4 progressive clues:
- Clue 1: Atmospheric / abstract / subtle hint
- Clue 2: Functional / behavioral hint
- Clue 3: Distinct physical characteristic or usage hint
- Clue 4: Clear recognizable clue (WITHOUT saying the secret word directly)
Category: ${config.category || 'Everyday Objects'}
Difficulty: ${config.difficulty || 'medium'}
Language: ${config.language === 'fil' ? 'Filipino / Taglish relatable' : 'English'}
${config.topicPrompt ? `Custom Topic/Theme: "${config.topicPrompt}"` : ''}

Return JSON with this EXACT structure:
{
  "puzzles": [
    {
      "word": "Target Word",
      "category": "${config.category || 'Everyday Objects'}",
      "difficulty": "easy" | "medium" | "hard",
      "clues": [
        "First subtle clue",
        "Second progressive clue",
        "Third physical/usage clue",
        "Fourth direct clue"
      ]
    }
  ]
}`;

  const parsed = await callGeminiJson<{ puzzles: any[] }>(prompt, config.apiKey);
  if (!parsed || !Array.isArray(parsed.puzzles) || parsed.puzzles.length === 0) {
    return null;
  }

  return parsed.puzzles.map((p, idx) => ({
    id: `ai_gw_${Date.now()}_${idx}`,
    word: p.word,
    category: p.category || config.category || 'Word Clues',
    difficulty: (p.difficulty as any) || 'medium',
    clues: Array.isArray(p.clues) && p.clues.length >= 4
      ? [p.clues[0], p.clues[1], p.clues[2], p.clues[3]]
      : [
          p.clues?.[0] || 'I am a familiar thing.',
          p.clues?.[1] || 'You encounter me often in daily life.',
          p.clues?.[2] || 'I have a recognizable shape and function.',
          p.clues?.[3] || 'Look closely at my traits to guess my name.',
        ],
  }));
}
