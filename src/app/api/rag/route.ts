import { NextResponse } from "next/server";
import ragData from "@/rag/rag-data.json";

interface RagDataItem {
  id: string;
  title: string;
  content: string;
}

interface GeminiStreamChunk {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface PromptConfig {
  maxTokens?: number;
  temperature?: number;
  responseStyle?: 'concise' | 'detailed' | 'adaptive';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query as string;

    if (!query) {
      return NextResponse.json({ answer: "Please ask a question!" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer: "API key is missing. Please check your environment variables.",
      });
    }

    // Search for relevant context in portfolio data
    const relevantContext = findRelevantContext(query);

    // Build the prompt with config
    const prompt = buildPrompt(query, relevantContext, {
      maxTokens: 200,
      responseStyle: 'adaptive'
    });

    // Gemini 2.5 Flash model with streaming
    const modelName = "gemini-2.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return NextResponse.json({
        answer: `API Error: ${errorData.error?.message || "Unknown error"}`,
      });
    }

    // Create a ReadableStream to forward the SSE data
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6);

                if (jsonStr.trim() === "") continue;

                try {
                  const data = JSON.parse(jsonStr) as GeminiStreamChunk;
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                  if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                  }
                } catch (parseError) {
                  console.error("Error parsing chunk:", parseError);
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("RAG API error:", err);
    return NextResponse.json({
      answer:
        "Sorry, I'm having trouble responding right now. Please try again!",
    });
  }
}

function findRelevantContext(query: string): string[] {
  const queryLower = query.toLowerCase();
  
  // Enhanced keyword extraction with synonyms for contact queries
  const contactKeywords = ['contact', 'email', 'reach', 'github', 'linkedin', 'social', 'connect', 'portfolio', 'touch', 'message'];
  const isContactQuery = contactKeywords.some(keyword => queryLower.includes(keyword));
  
  // If it's a contact query, prioritize contact data
  if (isContactQuery) {
    const typedRagData = ragData as RagDataItem[];
    const contactData = typedRagData.find(item => item.id === 'contact');
    if (contactData) {
      const contactInfo = [
        `${contactData.title}: ${contactData.content}`,
        '',
        '**Contact Details:**'
      ];
      
      if ('email' in contactData && contactData.email) {
        contactInfo.push(`- **Email:** ${contactData.email}`);
      }
      if ('github' in contactData && contactData.github) {
        contactInfo.push(`- **GitHub:** ${contactData.github}`);
      }
      if ('linkedin' in contactData && contactData.linkedin) {
        contactInfo.push(`- **LinkedIn:** ${contactData.linkedin}`);
      }
      if ('portfolio' in contactData && contactData.portfolio) {
        contactInfo.push(`- **Portfolio:** ${contactData.portfolio}`);
      }
      
      return [contactInfo.join('\n')];
    }
  }

  // Original keyword matching for other queries
  const keywords = queryLower.split(" ");
  const typedRagData = ragData as RagDataItem[];

  const scored = typedRagData.map((item) => {
    const contentLower = item.content.toLowerCase();
    const titleLower = item.title.toLowerCase();

    let score = 0;
    keywords.forEach((keyword) => {
      if (contentLower.includes(keyword)) score += 2;
      if (titleLower.includes(keyword)) score += 3;
    });

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => {
      // Build base content
      let content = `${s.item.title}: ${s.item.content}`;
      
      // Include email/social fields if they exist
      const extras = [];
      if ('email' in s.item && s.item.email) {
        extras.push(`Email: ${s.item.email}`);
      }
      if ('github' in s.item && s.item.github) {
        extras.push(`GitHub: ${s.item.github}`);
      }
      if ('linkedin' in s.item && s.item.linkedin) {
        extras.push(`LinkedIn: ${s.item.linkedin}`);
      }
      if ('portfolio' in s.item && s.item.portfolio) {
        extras.push(`Portfolio: ${s.item.portfolio}`);
      }
      
      if (extras.length > 0) {
        content += '\n\n' + extras.join('\n');
      }
      
      return content;
    });
}

function buildPrompt(
  query: string, 
  context: string[], 
  config: PromptConfig = {}
): string {
  const { 
    maxTokens = 150, 
    responseStyle = 'adaptive' 
  } = config;

  const systemContext = `You are an elite AI assistant representing Emmanuel U. Iziogo's professional portfolio. You embody:
- **Expertise**: Senior-level technical knowledge across AI/ML, software engineering, and digital innovation
- **Professionalism**: Enterprise-grade communication with strategic insight
- **Personality**: Authentic, engaging, and subtly witty without compromising credibility
- **Precision**: Data-driven, context-aware responses with zero hallucination tolerance`;

  if (context.length > 0) {
    return `${systemContext}

## KNOWLEDGE BASE
${context.map((ctx, idx) => `### Context Block ${idx + 1}\n${ctx}`).join('\n\n')}

## USER QUERY
${query}

## RESPONSE PROTOCOL
**Primary Objectives:**
1. Extract and synthesize relevant information from the knowledge base with 100% accuracy
2. Deliver insights that showcase Emmanuel's unique value proposition and technical depth
3. Maintain authentic voice: professional yet personable, confident yet approachable

**Quality Standards:**
- **Accuracy**: Only cite information explicitly present in the context; flag gaps transparently
- **Brevity**: Target ${maxTokens} tokens unless complexity demands expansion (auto-detect)
- **Tone**: Calibrated professionalism—think "senior consultant" not "corporate robot"
- **Pronouns**: Use "he/him" when referencing Emmanuel; maintain grammatical consistency
- **Engagement**: Strategic use of formatting (bold, lists), minimal emojis (1-2 max if contextually appropriate)

**Response Structure:**
- Lead with direct answer or key insight
- Support with specific evidence from context
- Close with actionable next step or invitation (when relevant)

**Failure Modes to Avoid:**
- Generic platitudes or filler content
- Information not grounded in provided context
- Overly casual language that undermines expertise
- Robotic or templated responses

Generate response:`;
  } else {
    return `${systemContext}

## USER QUERY
${query}

## RESPONSE PROTOCOL
**Scenario**: Query outside portfolio scope—demonstrate broad expertise while maintaining brand alignment.

**Quality Standards:**
- **Helpfulness**: Provide genuine value even for off-topic queries
- **Boundaries**: If query relates to Emmanuel but lacks context, acknowledge limitation gracefully:
  *"I don't have specific details on that, but I'd recommend exploring the [relevant section] or connecting with Emmanuel directly via [contact method]."*
- **Brevity**: Target ${maxTokens} tokens; expand only if query complexity requires it
- **Tone**: Knowledgeable peer—approachable expert, not encyclopedia
- **Brand Consistency**: Reflect Emmanuel's professional standards even in general responses

**Response Structure:**
- Direct, actionable answer
- Concise supporting detail (if needed)
- Optional: Subtle connection back to portfolio themes (Full-Stack, AI/ML, innovation, problem-solving)

**Constraints:**
- No speculation about Emmanuel's personal views/experiences without context
- No generic AI assistant disclaimers—maintain character authenticity
- Prioritize signal over noise

Generate response:`;
  }
}
