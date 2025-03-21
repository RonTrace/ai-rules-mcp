# Model Context Protocol (MCP) Server

A server that provides global rules for AI agents from a centralized GitHub repository.

## API Endpoints

- `GET /`: Server status
- `GET /api/rules`: Fetch the latest global rules from https://github.com/RonTrace/ron-ai-global-rules/

## Integration with AI Agents

To integrate with your AI coding agent, make an HTTP request to `https://ai-code-agent-rules-production.up.railway.app/api/rules` at the beginning of each conversation.

Example integration code:
```javascript
async function loadGlobalRules() {
  try {
    const response = await fetch('https://ai-code-agent-rules-production.up.railway.app/api/rules');
    const data = await response.json();
    if (data.success) {
      return data.data; // This contains the global rules content
    }
    return null;
  } catch (error) {
    console.error('Failed to load global rules:', error);
    return null;
  }
}