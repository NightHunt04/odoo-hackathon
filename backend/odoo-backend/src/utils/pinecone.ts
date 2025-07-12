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
    const index = pc.index('questions')
    await index.namespace('stackit').upsert(questions)
}
  
export async function searchQuestions(queryText: string, topK = 5) {
    const index = pc.index('questions')
    const namespace = index.namespace('stackit')
    const results = await namespace.searchRecords({
            query: {
                topK,
                inputs: { text: queryText },

            }
        })
    
    return results
}

export const index = pc.index('questions')