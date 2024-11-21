import { OPENAI_API_KEY } from '../../assets/config.js' // Ensure your API key is correctly set
import fetch from 'node-fetch'
async function generateResponse (req, res) {
  try {
    const { titulo, autor } = req.body // Destructure the data from the request body

    // Validate input
    if (!titulo || !autor) {
      return res.status(400).json({ error: 'Both "titulo" and "autor" are required.' })
    }

    // Create the prompt
    const prompt = `Crear descripción de "${titulo}" de ${autor}`

    // Call OpenAI API (use the chat endpoint for GPT-3.5 turbo)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}` // Ensure API key is passed correctly
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un generador de descripciones automáticas.' }, // System message for context
          { role: 'user', content: prompt } // User's prompt
        ],
        max_tokens: 200, // Maximum token limit for the response
        temperature: 0.7 // Adjust the creativity of the response
      })
    })

    // Parse the response
    const data = await response.json()

    // Check for errors in the OpenAI API response
    if (response.ok) {
      res.json({ description: data.choices[0].message.content }) // Respond with generated description
    } else {
      throw new Error(data.error.message || 'Error generating description')
    }
  } catch (error) {
    console.error('Error:', error.message || error)
    res.status(500).json({ error: error.message || error })
  }
}

export { generateResponse }