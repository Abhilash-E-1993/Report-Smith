// src/services/aiClient.js
// Uses Groq's OpenAI-compatible API for text generation

const apiKey = import.meta.env.VITE_GROQ_API_KEY
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== "false"

if (!apiKey) {
  throw new Error("Groq API key is not configured in VITE_GROQ_API_KEY")
}

/**
 * Builds the big prompt string from the report meta + sections.
 */
function buildPrompt({
  projectTitle,
  projectDescription,
  technologies,
  features,
  ieeePapers,
  sections,
}) {
  return `
You are an assistant that generates UVCE 6th-sem mini-project report CONTENT only.

You will receive:
- projectTitle: ${projectTitle || "(not provided)"}
- projectDescription: ${projectDescription || "(not provided)"}
- technologies: ${
    technologies && technologies.length ? technologies.join(", ") : "(none specified)"
  }
- features: ${features && features.length ? features.join(", ") : "(none specified)"}
- ieeePapers: ${ieeePapers && ieeePapers.length ? ieeePapers.join(" | ") : "(none specified)"}

The user also provides a list of sections and subsections. For each subsection, you must return
clean, formal text content only (no markdown, no HTML). Do not change section or subsection titles.

Input sections (JSON):
${JSON.stringify(sections, null, 2)}

Return a single JSON object ONLY, with this exact shape:

{
  "abstract": "string",
  "sections": [
    {
      "title": "Section title as given",
      "subsections": [
        {
          "heading": "Subheading as given",
          "content": "Cleaned/generated content for this subsection"
        }
      ]
    }
  ],
  "bibliography": [
    "reference 1",
    "reference 2"
  ]
}

Rules:
- "abstract" should be a 1–2 paragraph summary of the entire project.
- For EACH subsection:
  - Generate at least 2–4 detailed paragraphs of long content in formal academic style.
  - Explain concepts step by step, including data flow, user flow, and technical reasoning.
  - If the user gave draft content, expand it significantly instead of shortening it.
  - Mention relevant technologies explicitly, but only from the provided technologies list.
- Do NOT invent or rename sections or subsections.
- "bibliography" should:
  - start with any ieeePapers given (if any),
  - then add a few generic textbook / documentation references relevant to the described technologies.
- Output MUST be valid JSON, no trailing commas, no extra text.
`
}

/**
 * Call Groq to generate abstract, section bodies and bibliography.
 * Input shape must match what StepAiInput passes.
 */
export async function generateBody({
  projectTitle,
  projectDescription,
  technologies,
  features,
  ieeePapers,
  sections,
}) {
  if (!AI_ENABLED) {
    throw new Error("AI generation is disabled. Enable it by setting VITE_AI_ENABLED=true.")
  }

  const prompt = buildPrompt({
    projectTitle,
    projectDescription,
    technologies,
    features,
    ieeePapers,
    sections,
  })

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that only returns valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      if (res.status === 401) {
        throw new Error("Invalid Groq API key. Check VITE_GROQ_API_KEY.")
      }
      if (res.status === 429) {
        throw new Error(
          "AI rate limit reached for Groq free tier. Try again in a minute or two."
        )
      }
      throw new Error(`Groq API error: ${res.status} ${errText}`)
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content?.trim() || ""

    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}")
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Model did not return JSON")
    }

    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1))

    return {
      abstract: parsed.abstract || "",
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      bibliography: Array.isArray(parsed.bibliography) ? parsed.bibliography : [],
    }
  } catch (err) {
    const message = err?.message || String(err)
    throw new Error("AI generation failed: " + message)
  }
}
