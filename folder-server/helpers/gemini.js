const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiHelper {
  static getClient() {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  static getModel(modelName = 'gemini-1.5-pro') {
    const genAI = this.getClient();
    return genAI.getGenerativeModel({ model: modelName });
  }

  static async generateContent(prompt, modelName = 'gemini-1.5-pro') {
    try {
      const model = this.getModel(modelName);
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      throw error;
    }
  }

  static async findPopularGameId(games, genre) {
    try {
      const prompt = `
        You are a gaming expert tasked with identifying the most globally popular ${genre} game from this list.
        
        List of games:
        ${games.map(g => `- ${g.title} (ID: ${g.id})`).join('\n')}
        
        IMPORTANT: Respond ONLY with the ID number of the most popular game. 
        Format your response as a single number without any additional text.
        Example correct response: 42
      `;
      
      const aiText = await this.generateContent(prompt);
      const match = aiText.match(/\d+/);
      
      if (!match) return null;
      
      return parseInt(match[0]);
    } catch (error) {
      console.error('Error finding popular game with Gemini:', error);
      return null;
    }
  }
}

module.exports = GeminiHelper;