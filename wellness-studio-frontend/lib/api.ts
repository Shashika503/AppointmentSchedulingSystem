import axios from 'axios';
import { getStoredToken, refreshAccessToken } from './auth';
import { jwtDecode } from 'jwt-decode';

// TimeSlot and Appointment interfaces from your DTOs
export interface TimeSlot {
  timeSlotId: number;
  date: string;        // ISO string, e.g., "2025-07-24T00:00:00"
  startTime: string;   // ISO string, e.g., "2025-07-24T09:00:00"
  endTime: string;     // ISO string, e.g., "2025-07-24T10:00:00"
  isAvailable: boolean;
}

export interface Appointment {
  appointmentId: number;
  userId: number;
  clientName: string;
  clientEmail: string;
  appointmentDate: string; // ISO string
  timeSlotId: number;
  status: 'Booked' | 'Cancelled';
}

// Utility to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

// Main API request handler (refreshes token if needed)
const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  let token = getStoredToken();

  // Attempt refresh if token missing or expired
  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
    if (!token) throw new Error('Session expired. Please log in again.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string> ?? {}),
  };

  try {
    const response = await axios({
      url,
      method: options.method,
      data: options.body,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

//////////////////////////////
// ADMIN CONTROLLER FUNCTIONS
//////////////////////////////

// Get all time slots (admin)
export const getTimeSlots = (): Promise<TimeSlot[]> =>
  apiRequest('https://localhost:7264/api/admin/available-slots', { method: 'GET' });

// Create a new time slot (admin)
export const createTimeSlot = (timeSlot: Omit<TimeSlot, 'timeSlotId'>): Promise<{ message: string, timeSlot: TimeSlot }> =>
  apiRequest('https://localhost:7264/api/admin/add-time-slot', {
    method: 'POST',
    body: JSON.stringify(timeSlot),
  });

// Update an existing time slot (admin)
export const updateTimeSlot = (id: number, timeSlot: Partial<TimeSlot>): Promise<string> =>
  apiRequest(`https://localhost:7264/api/admin/edit-time-slot/${id}`, {
    method: 'PUT',
    body: JSON.stringify(timeSlot),
  });

// Delete a time slot (admin)
export const deleteTimeSlot = (id: number): Promise<string> =>
  apiRequest(`https://localhost:7264/api/admin/delete-time-slot/${id}`, { method: 'DELETE' });

// Get all appointments (admin)
export const getAppointments = (): Promise<Appointment[]> =>
  apiRequest('https://localhost:7264/api/admin/booked-appointments', { method: 'GET' });

// Cancel an appointment (admin)
export const cancelAppointment = (id: number): Promise<string> =>
  apiRequest(`https://localhost:7264/api/admin/cancel-appointment/${id}`, { method: 'DELETE' });

//////////////////////////////
// CLIENT CONTROLLER FUNCTIONS
//////////////////////////////

// Get available time slots (client)
export const getClientAvailableSlots = (): Promise<TimeSlot[]> =>
  apiRequest('https://localhost:7264/api/client/available-slots', { method: 'GET' });

// Book an appointment (client)
export const clientBookAppointment = (appointment: {
  userId: number;
  clientName: string;
  clientEmail: string;
  timeSlotId: number;
  appointmentDate: string;
  status: string;
}): Promise<{ message: string; appointment: Appointment }> =>
  apiRequest('https://localhost:7264/api/client/book-appointment', {
    method: 'POST',
    body: JSON.stringify(appointment),
  });

// Get my appointments (client)
export const getMyAppointments = (userId: number): Promise<Appointment[]> =>
  apiRequest(`https://localhost:7264/api/client/my-appointments?userId=${userId}`, { method: 'GET' });

