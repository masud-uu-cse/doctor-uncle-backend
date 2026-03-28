# Doctor Uncle AI (Backend)

The backend API for Doctor Uncle AI powers the dynamic question generation and structured medical diagnoses features using OpenAI's robust GPT models. It is built strictly utilizing the Controller-Service-Repository architecture pattern for high scalability and separation of concerns.

## Tech Stack
- **Environment**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI Integration**: OpenAI SDK

## Running the Application

### 1. Configure Environments
Create a `.env` file at the root of the backend folder with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<your-cluster-details>
OPENAI_API_KEY=sk-<your-openai-api-key>
```
*(Make sure to replace the dummy strings with your actual database and OpenAI credentials!)*

### 2. Install & Start
```sh
# Install dependencies
npm install

# Start the development server using nodemon
npm run dev

# Or build for production
npm run build
npm start
```

## API Highlights
- **`POST /api/v1/symptom-checker/questions`** -> Generates 4-6 intelligent follow-up questions from the LLM based on the user's initial symptoms.
- **`POST /api/v1/symptom-checker/diagnosis`** -> Accepts the base symptoms and formatted questions/answers to generate a highly structured medical assessment json mapping into the frontend!
