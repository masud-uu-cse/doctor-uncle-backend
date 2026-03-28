import OpenAI from 'openai';

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
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateQuestions(symptoms: string): Promise<QuestionSchema[]> {
    const prompt = `You are an expert medical AI assistant.
A user reported the following overall symptoms: "${symptoms}".
Please generate 4 to 6 relevant follow-up questions to understand their condition better.
For each question, provide 4 to 6 realistic options the user can choose from.

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

    const completion = await this.openai.chat.completions.create({
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

  async generateDiagnosis(symptoms: string, answers: Answer[]): Promise<DiagnosisSchema> {
    const formattedAnswers = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n');
    const prompt = `You are an expert medical AI assistant.
A user reported the following overall symptoms: "${symptoms}".
They also provided the following additional context from follow-up questions:
${formattedAnswers}

Please generate structured, safe medical advice based on this information. 
Respond ONLY with valid JSON in the exact following structure, adapting the realistic medical possibilities:
{
  "summary": "You may be experiencing a moderate level health issue based on your symptoms.",
  "severity": {
    "level": "Moderate",
    "message": "Your condition is not critical but should be monitored. Consider visiting a doctor if it continues."
  },
  "possibleConditions": [
    {
      "name": "Migraine",
      "description": "A type of headache often causing pain on one side of the head, sometimes with nausea."
    }
  ],
  "whatYouCanDoNow": {
    "medicines": [
      {
        "name": "Paracetamol",
        "usage": "Take for pain relief if needed (follow dosage instructions)."
      }
    ],
    "homeCare": [
      "Take rest in a quiet and dark room",
      "Drink plenty of water",
      "Avoid screen time and loud noise"
    ]
  },
  "whenToTakeAction": {
    "nextSteps": [
      "Monitor your symptoms for the next 24 hours",
      "If symptoms do not improve, consult a doctor"
    ],
    "seeDoctorType": "Neurologist or General Physician"
  },
  "emergencyAlert": {
    "isEmergency": false,
    "warningSigns": [
      "Severe vomiting",
      "Blurred vision",
      "High fever above 102°F"
    ],
    "message": "If you notice any of these symptoms, seek medical help immediately."
  },
  "disclaimer": "This is only a basic health suggestion and not a confirmed diagnosis. Please consult a licensed doctor for proper treatment."
}`;

    const completion = await this.openai.chat.completions.create({
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
