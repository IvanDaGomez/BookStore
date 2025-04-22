import fetch from 'node-fetch'
import express from 'express'
async function chatbotResponse (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const prompt = req.body.prompt as string | undefined// Destructure the data from the request body

    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: 'Es necesario un prompt para poder responder' })
    }
    // const userHistory = [
    //   { title: "Harry Potter and the Sorcerer's Stone", date: "2025-03-15" },
    //   { title: "The Catcher in the Rye", date: "2025-03-20" }
    // ];
    // const shippingStatus = "Enviado: 2025-04-21, Estimación de entrega: 2025-04-24";
    
    // const prompt = `
    // Eres un chatbot de una tienda de libros. El historial de compras del usuario es el siguiente:
    // ${userHistory.map(item => `- ${item.title} (Comprado el ${item.date})`).join("\n")}
    // El estado actual del envío es: ${shippingStatus}.
    
    // El usuario me ha preguntado sobre sus compras anteriores y el estado de su envío. ¿Qué puedo responderle?
    // `;
    // Call OpenAI API (use the chat endpoint for GPT-3.5 turbo)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}` // Ensure API key is passed correctly
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un chatbot de una tienda de libros.' }, // System message for context
          { role: 'user', content: prompt } // User's prompt
        ],
        max_tokens: 200, // Maximum token limit for the response
        temperature: 0.7 // Adjust the creativity of the response
      })
    })

    // Parse the response
    const data = await response.json()

    // Check for errors in the OpenAI API response
    if (!response.ok) {
      throw new Error(data.error.message || 'Error generating description')
    }
    return res.json({ description: data.choices[0].message.content }) // Respond with generated description
  } catch (err) {
    next(err)
  }
}

export { chatbotResponse }
