import { LOGIN_URL } from "@/Constants/EndPoints";

const httpFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Check if the URL is for the login endpoint
    console.log("fetch");
    const isLoginEndpoint = url.includes(LOGIN_URL); // Adjust the endpoint as necessary
  
    // Retrieve the token from localStorage or any storage method you use
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
    // Add the authorization header to the existing headers if not the login endpoint
    const headers = {
      ...options.headers,
      ...(!isLoginEndpoint && token ? { Authorization: `Bearer ${token}` } : {}),
    };
  
    // Create a new options object with the updated headers
    const newOptions: RequestInit = {
      ...options,
      headers,
    };
  
    // Make the fetch call with the new options
    const response = await fetch(url, newOptions);
    
    // Optionally, handle the response (e.g., check for errors)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  
    return response;
  };
  
  export default httpFetch;

  