import axios from 'axios';




export const login = async (username: string, password: string): Promise<{ token: string; refreshToken: string; userId: string; role : string}> => {
  try {
    const response = await axios.post<{ accessToken: string; refreshToken: string; userId: string; role : string }>(
      'https://localhost:7264/api/auth/login', {
        username,
        password
      }
    );

    const { accessToken, refreshToken, userId , role } = response.data;

   

    // Store the token and refresh token
    setStoredToken(accessToken);

    return { token: accessToken, refreshToken: refreshToken, userId: userId , role: role};
  } catch (error) {
    console.error('Login failed', error);
    throw new Error('Login failed');
  }
};

// Save and manage JWT token in localStorage
export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

export const setUserRole = (role: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userRole', role);
};


export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
};
export const setStoredRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('refreshToken', token);
};



export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;
  try {
    const response = await axios.post('https://localhost:7264/api/auth/refresh-token', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setStoredToken(accessToken);
    setStoredRefreshToken(newRefreshToken);
    return accessToken;
  } catch (err) {
    logout();
    return null;
  }
};





export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  window.location.href = '/login';  // Redirect to login page
};

