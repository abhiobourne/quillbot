import * as use from '@tensorflow-models/universal-sentence-encoder'; // Importing the sentence transformer model
import { PineconeClient } from '@pinecone-database/pinecone';

// Function to generate embeddings from text
export const generateEmbeddings = async (text: string) => {
  try {
    const model = await use.load();
    const textArray = text.split('\n'); // Split text into lines for separate embeddings
    const embeddings = await Promise.all(
      textArray.map(async (line) => {
        const embedding = await model.embed(line);
        return Array.from(embedding.dataSync()); // Convert to regular array
      })
    );
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Embedding generation failed.");
  }
};

// Function to upsert vectors to Pinecone
// Function to upsert vectors to Pinecone
export const upsertVectorsToPinecone = async (client: PineconeClient, fileId: string, embeddings: number[][]) => {
    const pineconeIndex = client.Index('your-index-name'); // Use your actual index name
    
    const vectors = embeddings.map((embedding, index) => ({
      id: `${fileId}-page-${index + 1}`,
      values: embedding,
      metadata: {
        pageNumber: index + 1,
      },
    }));
  
    const upsertRequest = {
      upsertRequest: {
        vectors, // Vector array for upsert
        namespace: 'Default', // Your namespace
      },
    };
  
    await pineconeIndex.upsert(upsertRequest); // Upsert the vectors
  };
  