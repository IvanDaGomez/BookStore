import { useState, useEffect } from "react";

export default function useFetchUser(url) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(url, {
                    method: 'GET', // Change to GET for fetching user session
                    credentials: 'include', // Ensure cookies are sent
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data); // Set the user in state
                } else {
                    console.error('Failed to fetch user data:', response);
                    setUser(null); // Set user to null if there's an error
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null); // Set user to null on error
            }
        }

        fetchUser(); // Call the function to get the user
    }, [url]); // Depend on url to refetch if it changes

    return user; // Return only the user state
}