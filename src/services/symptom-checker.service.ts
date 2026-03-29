import OpenAI from "openai";

export interface QuestionSchema {
  id: string;
  question: string;
  options: string[];
}

export interface Answer {
  question: string;
  answer: string;
}

export interface DiagnosisSchema {
  summary: string;
  severity: { level: string; message: string; };
  possibleConditions: { name: string; description: string; }[];
  whatYouCanDoNow: { medicines: { name: string; usage: string; }[]; homeCare: string[]; };
  whenToTakeAction: { nextSteps: string[]; seeDoctorType: string; };
  emergencyAlert: { isEmergency: boolean; warningSigns: string[]; message: string; };
  disclaimer: string;
}

export class SymptomCheckerService {
  private getOpenAIClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured in the backend environment.");
    }
    return new OpenAI({ apiKey });
  }

  async generateQuestions(symptoms: string, language: string = 'en'): Promise<QuestionSchema[]> {
    const langInstruction = language === 'bn' ? 'Please generate all realistic options and the question text in Bengali (Bangla).' : 'Please generate all realistic options and the question text in English.';
    const prompt = `You are an expert medical AI assistant.
A user reported the following overall symptoms: "${symptoms}".
Please generate 4 to 6 relevant follow-up questions to understand their condition better.
For each question, provide 4 to 6 realistic options the user can choose from.

${langInstruction}
Ensure that the JSON keys ("questions", "id", "question", "options") remain exactly as shown below in English.

Respond ONLY with valid JSON in the exact following structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "How long have you had the symptom?",
      "options": ["Less than a day", "1-3 days", "A week", "More than a week"]
    }
  ]
}`;

    const completion = await this.getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate questions from OpenAI.");
    }

    const parsed = JSON.parse(content);
    return parsed.questions || [];
  }

  async generateDiagnosis(symptoms: string, answers: Answer[], language: string = 'en'): Promise<DiagnosisSchema> {
    const langInstruction = language === 'bn' ? 'Please generate the detailed medical advice, summaries, descriptions, and all string values in Bengali (Bangla).' : 'Please generate the detailed medical advice, summaries, descriptions, and all string values in English.';
    const formattedAnswers = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n');
    const prompt = `You are an expert medical AI assistant.
A user reported the following overall symptoms: "${symptoms}".
They also provided the following additional context from follow-up questions:
${formattedAnswers}

Please generate structured, safe medical advice based on this information. 
${langInstruction}
Ensure the advice is relevant for someone in Bangladesh, taking into account common local OTC medications. 
Try to provide at least two+ relevant medicine suggestions if appropriate, along with clear instructions on when and how to take them.

Ensure that all JSON keys ("summary", "severity", "level", "message", "possibleConditions", "name", "description", etc.) MUST remain EXACTLY as specified in English, only translating the values.

Respond ONLY with valid JSON in the exact following structure, adapting the realistic medical possibilities:
{
  "summary": "You may be experiencing a moderate level health issue based on your symptoms.",
  "severity": {
    "level": "Moderate",
    "message": "Your condition is not critical but should be monitored. Consider visiting a doctor if it continues."
  },
  "possibleConditions": [
    {
      "name": "Common Cold / Seasonal Flu",
      "description": "A viral infection of your nose and throat, often involving cough and fever."
    }
  ],
  "whatYouCanDoNow": {
    "medicines": [
      {
        "name": "Paracetamol (e.g., Napa/Ace)",
        "usage": "Take 500mg-1g every 6 hours for fever or pain (maximum 4g per day)."
      },
      {
        "name": "Antihistamine (e.g., Fexo/Desloratadine)",
        "usage": "Take one tablet (120mg/5mg) once daily for runny nose or cold symptoms."
      }
    ],
    "homeCare": [
      "Gargle with warm salt water for throat relief",
      "Drink plenty of warm liquids (tea with ginger/honey)",
      "Get adequate rest and steam inhalation"
    ]
  },
  "whenToTakeAction": {
    "nextSteps": [
      "Monitor temperature every 4-6 hours",
      "If fever persists above 102°F or for more than 3 days, see a doctor"
    ],
    "seeDoctorType": "General Physician"
  },
  "emergencyAlert": {
    "isEmergency": false,
    "warningSigns": [
      "Difficulty breathing or chest pain",
      "High fever that does not respond to medication",
      "Severe persistent vomiting"
    ],
    "message": "Seek immediate medical help if any warning signs develop."
  },
  "disclaimer": "This is only a basic health suggestion and not a confirmed diagnosis. Please consult a licensed doctor for proper treatment."
}`;

    const completion = await this.getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate diagnosis from OpenAI.");
    }

    return JSON.parse(content) as DiagnosisSchema;
  }
}
