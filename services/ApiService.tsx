
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.openrouter.ai/api/v1';

export class ApiService {
  private static async getApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('openrouter_api_key');
    } catch (error) {
      console.error('Failed to get API key:', error);
      return null;
    }
  }

  public static async setApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem('openrouter_api_key', apiKey);
    } catch (error) {
      console.error('Failed to set API key:', error);
      throw error;
    }
  }

  public static async analyzeCV(cvText: string, jobDescription?: string): Promise<any> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not found. Please set your OpenRouter API key.');
    }

    const prompt = this.buildAnalysisPrompt(cvText, jobDescription);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'CvToai Mobile App',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAnalysisResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('CV Analysis failed:', error);
      throw error;
    }
  }

  private static buildAnalysisPrompt(cvText: string, jobDescription?: string): string {
    let prompt = `
Please analyze the following CV and provide a comprehensive evaluation:

CV Content:
${cvText}

${jobDescription ? `Job Description for comparison:\n${jobDescription}\n` : ''}

Please provide analysis in the following JSON format:
{
  "overall_score": number (0-100),
  "sections": {
    "contact_info": {"score": number, "feedback": "string"},
    "summary": {"score": number, "feedback": "string"},
    "experience": {"score": number, "feedback": "string"},
    "education": {"score": number, "feedback": "string"},
    "skills": {"score": number, "feedback": "string"}
  },
  "recommendations": ["string array of specific improvements"],
  "missing_skills": ["string array of skills that would strengthen the CV"],
  "ats_score": number (0-100),
  "keyword_matches": ["array of matched keywords from job description"]
}

Focus on:
1. Professional formatting and structure
2. Quantifiable achievements and results
3. Relevant skills and experience
4. ATS optimization
5. Alignment with job requirements (if provided)
`;

    return prompt;
  }

  private static parseAnalysisResponse(response: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      // Return mock data if parsing fails
      return {
        overall_score: 75,
        sections: {
          contact_info: { score: 90, feedback: "Contact information is complete" },
          summary: { score: 70, feedback: "Summary could be more impactful" },
          experience: { score: 80, feedback: "Good experience section" },
          education: { score: 85, feedback: "Education is relevant" },
          skills: { score: 75, feedback: "Skills section needs improvement" }
        },
        recommendations: [
          "Add more quantifiable achievements",
          "Improve keyword optimization",
          "Enhance professional summary"
        ],
        missing_skills: ["Cloud Computing", "Project Management"],
        ats_score: 70,
        keyword_matches: ["JavaScript", "React", "Node.js"]
      };
    }
  }

  public static async generateCoverLetter(cvText: string, jobDescription: string): Promise<string> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not found. Please set your OpenRouter API key.');
    }

    const prompt = `
Based on the following CV and job description, generate a professional cover letter:

CV:
${cvText}

Job Description:
${jobDescription}

Please write a personalized cover letter that:
1. Highlights relevant experience from the CV
2. Addresses key requirements from the job description
3. Shows enthusiasm for the role
4. Is professional yet engaging
5. Is approximately 3-4 paragraphs long

Format the response as plain text, ready to use.
`;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'CvToai Mobile App',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      throw error;
    }
  }

  public static async generateInterviewQuestions(cvText: string, jobDescription?: string): Promise<string[]> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not found. Please set your OpenRouter API key.');
    }

    const prompt = `
Based on the following CV${jobDescription ? ' and job description' : ''}, generate 10 potential interview questions:

CV:
${cvText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Generate questions that:
1. Focus on experience mentioned in the CV
2. Test technical and soft skills
3. Are relevant to the role${jobDescription ? ' described' : ''}
4. Include behavioral questions
5. Are realistic for an actual interview

Return the questions as a JSON array of strings.
`;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'CvToai Mobile App',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse interview questions:', parseError);
      }
      
      // Fallback questions if parsing fails
      return [
        "Tell me about yourself and your background.",
        "What interests you about this role?",
        "Describe a challenging project you've worked on.",
        "How do you handle working under pressure?",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in 5 years?",
        "Why are you looking to leave your current position?",
        "How do you stay updated with industry trends?",
        "Describe a time you had to work with a difficult team member.",
        "Do you have any questions for us?"
      ];
    } catch (error) {
      console.error('Interview questions generation failed:', error);
      throw error;
    }
  }
}
