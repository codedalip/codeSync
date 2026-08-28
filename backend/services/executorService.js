const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

const EXEC_TIMEOUT = 5000; // 5 seconds maximum execution time

/**
 * Piston API language mapping
 */
const PISTON_LANG_MAP = {
  javascript: 'javascript',
  js: 'javascript',
  python: 'python',
  py: 'python',
  c: 'c',
  cpp: 'c++',
  'c++': 'c++',
  java: 'java'
};

/**
 * Execute code via public Piston API
 */
const executeCodeViaPiston = async (language, sourceCode, input = '') => {
  const startTime = Date.now();
  const langKey = (language || 'javascript').toLowerCase();
  const pistonLang = PISTON_LANG_MAP[langKey] || langKey;

  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: pistonLang,
      version: '*',
      files: [{ content: sourceCode }],
      stdin: input
    })
  });

  if (!response.ok) {
    throw new Error(`Piston API returned status ${response.status}`);
  }

  const data = await response.json();
  const duration = Date.now() - startTime;

  // Handle compilation errors for compiled languages
  if (data.compile && data.compile.code !== 0 && data.compile.code !== null) {
    return {
      status: 'COMPILE_ERROR',
      output: data.compile.stdout || '',
      error: data.compile.stderr || data.compile.output || 'Compilation failed',
      executionTime: duration,
      memoryUsage: '~16 MB'
    };
  }

  const run = data.run || {};

  if (run.code !== 0 && run.code !== null && run.stderr) {
    return {
      status: 'RUNTIME_ERROR',
      output: run.stdout || '',
      error: run.stderr || run.output || 'Runtime error',
      executionTime: duration,
      memoryUsage: '~18 MB'
    };
  }

  return {
    status: 'SUCCESS',
    output: run.output || run.stdout || 'Program executed successfully with no output.',
    error: run.stderr || null,
    executionTime: duration,
    memoryUsage: '~16 MB'
  };
};

/**
 * Fallback: Execute code locally via child_process
 */
const executeCodeLocally = async (language, sourceCode, input = '') => {
  const startTime = Date.now();
  const tempDir = path.join(os.tmpdir(), `codesync_exec_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const lang = (language || 'javascript').toLowerCase();
    let filename;
    let command;
    let args = [];
    let isCompiled = false;
    let compileCmd = null;

    switch (lang) {
      case 'javascript':
      case 'js':
        filename = 'script.js';
        command = 'node';
        args = [filename];
        break;

      case 'python':
      case 'py':
        filename = 'script.py';
        command = process.platform === 'win32' ? 'python' : 'python3';
        args = [filename];
        break;

      case 'c':
        filename = 'main.c';
        isCompiled = true;
        const cOut = process.platform === 'win32' ? 'main.exe' : './main';
        compileCmd = `gcc ${filename} -o ${cOut}`;
        command = process.platform === 'win32' ? path.join(tempDir, 'main.exe') : path.join(tempDir, 'main');
        break;

      case 'cpp':
      case 'c++':
        filename = 'main.cpp';
        isCompiled = true;
        const cppOut = process.platform === 'win32' ? 'main.exe' : './main';
        compileCmd = `g++ ${filename} -o ${cppOut}`;
        command = process.platform === 'win32' ? path.join(tempDir, 'main.exe') : path.join(tempDir, 'main');
        break;

      case 'java':
        const classMatch = sourceCode.match(/public\s+class\s+([A-Za-z0-9_]+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        filename = `${className}.java`;
        isCompiled = true;
        compileCmd = `javac ${filename}`;
        command = 'java';
        args = ['-cp', tempDir, className];
        break;

      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, sourceCode, 'utf8');

    if (isCompiled && compileCmd) {
      const compileResult = await new Promise((resolve) => {
        exec(compileCmd, { cwd: tempDir, timeout: 10000 }, (error, stdout, stderr) => {
          if (error) {
            resolve({
              success: false,
              error: stderr || stdout || error.message
            });
          } else {
            resolve({ success: true, error: null });
          }
        });
      });

      if (!compileResult.success) {
        cleanTemp(tempDir);
        return {
          status: 'COMPILE_ERROR',
          output: '',
          error: compileResult.error,
          executionTime: Date.now() - startTime,
          memoryUsage: 'N/A'
        };
      }
    }

    return await new Promise((resolve) => {
      const child = spawn(command, args, { cwd: tempDir, shell: true });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, EXEC_TIMEOUT);

      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      } else {
        child.stdin.end();
      }

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        const duration = Date.now() - startTime;
        cleanTemp(tempDir);

        if (timedOut) {
          return resolve({
            status: 'TIMEOUT',
            output: stdout,
            error: `Execution timed out after ${EXEC_TIMEOUT / 1000} seconds.`,
            executionTime: duration,
            memoryUsage: 'N/A'
          });
        }

        if (code !== 0 && stderr) {
          return resolve({
            status: 'RUNTIME_ERROR',
            output: stdout,
            error: stderr,
            executionTime: duration,
            memoryUsage: '~12 MB'
          });
        }

        return resolve({
          status: 'SUCCESS',
          output: stdout || (stderr ? stderr : 'Program executed successfully with no output.'),
          error: stderr || null,
          executionTime: duration,
          memoryUsage: '~14 MB'
        });
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        cleanTemp(tempDir);
        return resolve({
          status: 'EXEC_ERROR',
          output: '',
          error: `Failed to execute: ${err.message}. Ensure runtime tools (${language}) are installed.`,
          executionTime: Date.now() - startTime,
          memoryUsage: 'N/A'
        });
      });
    });
  } catch (err) {
    cleanTemp(tempDir);
    return {
      status: 'SYSTEM_ERROR',
      output: '',
      error: err.message,
      executionTime: Date.now() - startTime,
      memoryUsage: 'N/A'
    };
  }
};

/**
 * Primary code execution handler (Tries Piston API first, falls back to local execution)
 */
const executeCode = async (language, sourceCode, input = '') => {
  try {
    return await executeCodeViaPiston(language, sourceCode, input);
  } catch (pistonErr) {
    console.warn('[ExecutorService] Piston API unavailable, falling back to local runner:', pistonErr.message);
    return await executeCodeLocally(language, sourceCode, input);
  }
};

const cleanTemp = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch (e) {
    // Ignore cleanup error
  }
};

module.exports = { executeCode };
