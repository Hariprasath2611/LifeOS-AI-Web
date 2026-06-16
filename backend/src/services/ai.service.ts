// import { GoogleGenAI } from '@google/genai'; 
import dotenv from 'dotenv';

dotenv.config();

export class AiService {
  private static geminiKey = process.env.GEMINI_API_KEY || '';

  /**
   * Generates conversational response for coaching
   */
  public static async generateCoachingResponse(message: string, context: string): Promise<string> {
    if (this.geminiKey) {
      try {
        // Future/Integration step:
        // const ai = new GoogleGenAI({ apiKey: this.geminiKey });
        // const response = await ai.models.generateContent({
        //   model: 'gemini-2.5-flash',
        //   contents: `Context: ${context}\nUser: ${message}\nResponse:`,
        // });
        // return response.text;
      } catch (err) {
        console.error("Gemini API Error:", err);
      }
    }

    // Elegant fallback logic
    await new Promise((resolve) => setTimeout(resolve, 800));
    const query = message.toLowerCase();
    
    if (query.includes('marathon') || query.includes('run') || query.includes('cardio')) {
      return "🏃 Cardio pacing is key. I recommend a 12-week incremental build. Increase your weekend long runs by 1.5K each week while focusing on calorie loading and muscle recovery.";
    }
    if (query.includes('task') || query.includes('prioritize') || query.includes('workload')) {
      return "⚡ To optimize your tasks: delegate or reschedule lower-priority items. I suggest starting a 25-minute Pomodoro block for your high-priority focus task first thing in the morning.";
    }
    if (query.includes('habit') || query.includes('streak') || query.includes('consistency')) {
      return "🔥 Streaks create psychological momentum. By checking off habits early, you build dopamine triggers that make subsequent execution feel much easier.";
    }
    if (query.includes('study') || query.includes('learn') || query.includes('skills')) {
      return "🧠 A focused study block is recommended. Space out learning sessions to leverage active recall and spatial memory storage.";
    }

    return "🤖 [AI Coach]: That sounds like an excellent strategy! Let me analyze your patterns and update your productivity logs. Consistency is key.";
  }

  /**
   * Generates milestones action plan for a goal
   */
  public static async generateMilestones(goalTitle: string, goalDescription: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      `🛡️ PHASE 1: Establish Core foundations for "${goalTitle}"`,
      `⚡ PHASE 2: Create incremental sprint checkpoints & build proof-of-concepts`,
      `📈 PHASE 3: Onboard users, gather feedback, and fix optimization gaps`,
      `🚀 PHASE 4: Final launch, tracking parameters adjustments, and scalability audit`
    ];
  }

  /**
   * Summarizes notes content
   */
  public static async generateNoteSummary(noteTitle: string, noteContent: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const snippet = noteContent.substring(0, 100).replace(/[#\*\_]/g, '').trim();
    return `🤖 [AI Summarizer]: The note focuses on "${noteTitle}", outlining key principles: "${snippet}...". Suggests immediate action items.`;
  }
}
