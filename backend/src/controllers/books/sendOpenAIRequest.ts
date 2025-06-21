async function sendOpenAIRequest (imageUrl: string): Promise<object | null> {
  // Create the prompt
  if (!imageUrl) return null

  const GPTContext =
    'Eres un asistente de IA que extrae información de portadas de libros. Tu tarea es analizar la imagen y extraer información relevante sobre el libro. Proporciona la información en formato JSON.'
  const prompt = `
    Extrae la información de la portada del libro en la URL adjunta, aqui tambien está: ${imageUrl}. 
    Devuelve la información en formato JSON. 
    Incluye: 
    {
      titulo,
      autor,
      descripcion: string (max 300 tokens),
      genero,
      edicion,
      idioma,
      edad,
      keywords: string[] (max 5 palabras clave),
      precio: number (peso colombiano)
    }
  `
  const content = [
    {
      type: 'image_url',
      image_url: {
        url: imageUrl
      }
    },
    {
      type: 'text',
      text: prompt
    }
  ]
  // Call OpenAI API (use the chat endpoint for GPT-3.5 turbo)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}` // Ensure API key is passed correctly
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: GPTContext },
        { role: 'user', content }
      ],
      max_tokens: 800,
      temperature: 0.5
    })
  })
  // Parse the response
  const data = await response.json()
  // Check for errors in the OpenAI API response
  const cleanedData = data.choices[0].message.content
    .replace(/^[^\S\r\n]*```json[^\S\r\n]*/g, '') // Remove "```json" at the start
    .replace(/[^\S\r\n]*```[^\S\r\n]*$/g, '') // Remove "```" at the end
    .split('\n') // Split into lines
    .join('\n') // Join the lines back into a single string
  const jsonData = await JSON.parse(cleanedData)

  return jsonData
}

export { sendOpenAIRequest }
