const { executeCode } = require('../services/executorService');

// @desc    Run code
// @route   POST /api/execute
const runCode = async (req, res) => {
  try {
    const { language, sourceCode, input } = req.body;

    if (!sourceCode && sourceCode !== '') {
      return res.status(400).json({ message: 'Source code is required' });
    }

    const result = await executeCode(language || 'javascript', sourceCode, input || '');
    return res.json(result);
  } catch (error) {
    console.error('[Execution Controller Error]', error);
    return res.status(500).json({
      status: 'SYSTEM_ERROR',
      output: '',
      error: error.message || 'Failed to execute code',
      executionTime: 0,
      memoryUsage: 'N/A'
    });
  }
};

module.exports = { runCode };
