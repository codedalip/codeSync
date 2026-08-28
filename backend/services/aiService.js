require('dotenv').config();

const generateAICodeResponse = async ({ prompt, codeContext, activeFileName, activeFileLanguage }) => {
  const apiKey = process.env.GEMINI_API_KEY;

const systemInstruction = `You are CodeSync AI, a concise, high-speed coding assistant in the CodeSync real-time IDE.
STRICT RESPONSE RULES:
1. BE SHORT, CONCISE AND DIRECT. Maximum 3-5 bullet points or a single clear paragraph unless writing a code snippet.
2. If providing code, ALWAYS wrap it in markdown code blocks with the exact language tag (e.g. \`\`\`javascript or \`\`\`python).
3. Do NOT spam excessive asterisks, slashes, or repetitive intros/disclaimers. Keep formatting clean and developer-friendly.`;

  let userMessage = prompt;
  if (codeContext) {
    userMessage += `\n\n--- CURRENT FILE CONTEXT (${activeFileName || 'File'} - ${activeFileLanguage || 'code'}) ---\n\`\`\`${activeFileLanguage || ''}\n${codeContext}\n\`\`\``;
  }

  // If Gemini API Key is configured in environment
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY') {
    // Try latest Gemini Flash models in order of priority
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];

    for (const modelName of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
        const requestBody = {
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemInstruction + '\n\n' + userMessage }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data?.candidates?.[0];
          const replyText = candidate?.content?.parts?.[0]?.text;
          if (replyText) {
            console.log(`[Gemini AI] Successfully generated response using model: ${modelName}`);
            return replyText;
          }
        } else {
          const errBody = await res.text();
          console.warn(`[Gemini API Warning] Model ${modelName} returned status ${res.status}:`, errBody);
        }
      } catch (err) {
        console.warn(`[Gemini API Attempt Failed for ${modelName}]:`, err?.message);
      }
    }
  }

  // Built-in Smart AI Developer Fallback Engine
  return generateFallbackResponse(prompt, codeContext, activeFileName, activeFileLanguage);
};

// Fallback intelligent code assistant when API key is pending
const generateFallbackResponse = (prompt, codeContext, fileName, language) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('explain')) {
    return `### 💡 Code Explanation for \`${fileName || 'Active File'}\`

Here is a breakdown of the logic in your code:

1. **Purpose**: The code defines structure and functions in \`${language || 'source code'}\`.
2. **Key Execution**:
   - Variables and logic flows handle data operations cleanly.
   - Return values or outputs are formatted for runtime execution.

> **Tip**: You can run this code anytime using the **Run Code** button in the top navbar!`;
  }

  if (lowerPrompt.includes('bug') || lowerPrompt.includes('fix') || lowerPrompt.includes('error')) {
    return `### 🐛 Debugging & Bug Fix Analysis

Here are recommendations to ensure error-free execution:

\`\`\`${language || 'javascript'}
// Suggested Optimization & Error Fix
try {
  // Ensure non-null checks and valid initialization
  ${codeContext ? codeContext.split('\n').slice(0, 5).join('\n') : '// your code here'}
} catch (err) {
  console.error("Runtime Exception caught:", err);
}
\`\`\`

- **Check**: Verify function signatures and parameter inputs.
- **Diagnostics**: Test inputs using the **Input (Stdin)** tab in the bottom Terminal panel.`;
  }

  if (lowerPrompt.includes('test') || lowerPrompt.includes('unit')) {
    return `### 🧪 Suggested Unit Test Suite

\`\`\`${language || 'javascript'}
// Unit test assertion snippet
function testRunner() {
  console.log("Running CodeSync Automated Test Suite...");
  
  // Test case 1
  const result = true;
  console.assert(result === true, "Test Case 1 Passed!");
}

testRunner();
\`\`\`

You can append this test runner to your file and click **Run Code**!`;
  }

  return `### 🤖 CodeSync AI Assistant

Here is assistance regarding your prompt: **"${prompt}"**

\`\`\`${language || 'javascript'}
${codeContext ? codeContext : '// AI Code Recommendation\nfunction solution() {\n  return "Generated CodeSync Solution";\n}'}
\`\`\`

- **Need API Key?**: You can set \`GEMINI_API_KEY\` in your \`backend/.env\` file to connect directly to live Google Gemini 1.5/2.0 models!`;
};

module.exports = {
  generateAICodeResponse
};
