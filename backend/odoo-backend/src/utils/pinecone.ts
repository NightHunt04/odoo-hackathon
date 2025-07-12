import { Pinecone } from '@pinecone-database/pinecone'

interface Question {
    id: string
    chunk_text: string
    metadata: {
        tags: string[]
    }
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

export async function upsertQuestion(questions: Question[]) {
    const index = pc.index('stackit')
    await index.namespace('questions').upsert(questions)
}
  
export async function searchQuestions(queryText: string, topK = 5) {
    const index = pc.index('stackit')
    const namespace = index.namespace('questions')
    const results = await namespace.searchRecords({
            query: {
                topK,
                inputs: { text: queryText },

            }
        })
    
    return results
}

interface Answer {
    id: string
    chunk_text: string
    metadata: {
        questionId: string
    }
}

export async function upsertAnswer(answer: Answer[]) {
    const index = pc.index('stackit')
    await index.namespace('answers').upsert(answer)
}

export async function searchAnswers(queryText: string, topK = 5) {
    const index = pc.index('stackit')
    const namespace = index.namespace('answers')
    const results = await namespace.searchRecords({
            query: {
                topK,
                inputs: { text: queryText },
            }
        })
    
    return results
}

export const index = pc.index('stackit')