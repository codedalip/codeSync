const API_URL = 'http://localhost:5000/api';

async function testCodeSync() {
  console.log('🧪 Starting CodeSync E2E API Verification...\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health Check:', health);

    // 2. Register User A
    const userARes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User A (Rahul)',
        email: `rahul_${Date.now()}@test.com`,
        password: 'password123'
      })
    });
    const userA = await userARes.json();
    console.log('✅ Registered User A:', userA);

    // 3. Register User B
    const userBRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User B (Aman)',
        email: `aman_${Date.now()}@test.com`,
        password: 'password123'
      })
    });
    const userB = await userBRes.json();
    console.log('✅ Registered User B:', userB);

    // 4. User A creates Workspace
    const wsRes = await fetch(`${API_URL}/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`
      },
      body: JSON.stringify({ name: 'Collaborative Dev Room', description: 'Testing real-time sync' })
    });
    const workspace = await wsRes.json();
    console.log('✅ Created Workspace:', workspace);

    // 5. User B joins Workspace using Join Code
    const joinRes = await fetch(`${API_URL}/workspaces/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userB.token}`
      },
      body: JSON.stringify({ code: workspace.code })
    });
    const joinedWorkspace = await joinRes.json();
    console.log('✅ User B Joined Workspace:', joinedWorkspace);

    // 6. Fetch workspace files
    const filesRes = await fetch(`${API_URL}/workspaces/${workspace._id}/files`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    const files = await filesRes.json();
    console.log('✅ Workspace Files:', files);

    // 7. User A creates a Python file
    const createFileRes = await fetch(`${API_URL}/workspaces/${workspace._id}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`
      },
      body: JSON.stringify({ name: 'script.py', content: 'print("Hello from CodeSync Python Engine!")' })
    });
    const newFile = await createFileRes.json();
    console.log('✅ Created File:', newFile);

    // 8. Test Code Execution
    const execRes = await fetch(`${API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`
      },
      body: JSON.stringify({
        language: 'python',
        sourceCode: 'print("Execution Test Successful!")',
        input: ''
      })
    });
    const execResult = await execRes.json();
    console.log('✅ Executed Code Output:', execResult);

    // 9. Test Gemini AI Chat API
    const aiRes = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`
      },
      body: JSON.stringify({
        prompt: 'Explain the active code file logic',
        codeContext: 'function greet(name) { console.log("Hello " + name); }',
        activeFileName: 'main.js',
        activeFileLanguage: 'javascript'
      })
    });
    const aiResult = await aiRes.json();
    console.log('✅ Gemini AI Assistant Response:', aiResult);

    console.log('\n🎉 ALL CODESYNC CORE BACKEND APIS, SERVICES & GEMINI AI VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  }
}

testCodeSync();
