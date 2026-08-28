const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateAICodeResponse } = require('../services/aiService');

router.use(protect);

// @desc    Generate Gemini AI code assistant response
// @route   POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { prompt, codeContext, activeFileName, activeFileLanguage } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const aiReply = await generateAICodeResponse({
      prompt: prompt.trim(),
      codeContext: codeContext || '',
      activeFileName: activeFileName || '',
      activeFileLanguage: activeFileLanguage || ''
    });

    return res.json({ reply: aiReply });
  } catch (error) {
    console.error('[AI Chat Route Error]', error);
    return res.status(500).json({ message: error.message || 'AI generation failed' });
  }
});

module.exports = router;
