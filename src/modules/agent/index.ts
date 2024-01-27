import { ChatOpenAI } from "@langchain/openai"
import { OpenAIEmbeddings } from "@langchain/openai"
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph"
import initAgent from "./agent"

export async function call(input: string, sessionId: string): Promise<string> {
  // TODO: Singletons
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  })
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  })
  const graph = new Neo4jGraph({
    url: process.env.NEO4J_URI as string,
    username: process.env.NEO4J_USERNAME as string,
    password: process.env.NEO4J_PASSWORD as string,
    database: process.env.NEO4J_DATABASE as string | undefined,
  });

  const agent = await initAgent(llm, embeddings, graph)
  const res = await agent.invoke({ input }, { configurable: { sessionId }})

  return res
}