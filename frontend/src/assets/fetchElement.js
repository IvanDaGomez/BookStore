export async function fetchElement({ url, method, body, requirements = [] }) {
    // Check requirements
    if (requirements.length > 0) {
        for (const requirement of requirements) {
            if (!requirement) {
                console.error(requirement + ' is required');
                return { error: 'UserID is required' };
            }
        }
    }

    try {
        // Stringify body if it’s an object
        const requestBody = body && typeof body === 'object' ? JSON.stringify(body) : body;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: requestBody
        });

        // Check for network error
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return { error: `Request failed with status ${response.status}` };
        }

        const data = await response.json();

        // Check for API error in response
        if (data.error) {
            console.error(data.error);
            return { error: data.error };
        }

        return data;

    } catch (error) {
        console.error('Fetch error:', error);
        return { error: 'Fetch operation failed' };
    }
}
