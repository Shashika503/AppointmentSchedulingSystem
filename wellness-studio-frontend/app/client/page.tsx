'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  getClientAvailableSlots, 
  clientBookAppointment, 
  getMyAppointments, 
  type TimeSlot, 
  type Appointment
} from '@/lib/api';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Loader2 } from 'lucide-react';

export default function ClientDashboard() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingForm, setBookingForm] = useState({
    clientName: localStorage.getItem('username') || '',
    clientEmail: '', // You might want to prefill this too
    notes: ''
  });

  const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    if (role !== 'Client') {
      window.location.href = role === 'Admin' ? '/admin' : '/login';
    } else {
      loadData();
    }
    // eslint-disable-next-line
  }, [role, userId]);

  useEffect(() => {
  let timeout: NodeJS.Timeout;
  if (success || error) {
    timeout = setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  }
  return () => clearTimeout(timeout);
}, [success, error]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [slotsData, appointmentsData] = await Promise.all([
        getClientAvailableSlots(),
        userId ? getMyAppointments(Number(userId)) : Promise.resolve([])
      ]);
      setTimeSlots(slotsData.filter(slot => slot.isAvailable));
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !userId) return;
    setError('');
    setSuccess('');

    try {
      await clientBookAppointment({
        userId: Number(userId),
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        timeSlotId: selectedSlot.timeSlotId,
        appointmentDate: selectedSlot.startTime, // use startTime as the appointment date
        status: 'Booked' // Assuming you want to set the status to 'Booked'
      });

      setSuccess('Appointment booked successfully!');
      await loadData();
      setShowBookingDialog(false);
      setSelectedSlot(null);
      setBookingForm(prev => ({
        clientName: prev.clientName,
        clientEmail: prev.clientEmail,
        notes: ''
      }));
    } catch (err) {
      setError('Failed to book appointment');
    }
  };

  const openBookingDialog = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString();
  }

  return (
    <ProtectedRoute requiredRole="Client">
      <div className="min-h-screen bg-gray-50">
        <Navigation title="Client Dashboard" role="Client" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {localStorage.getItem('username')}!
            </h1>
            <p className="text-gray-600">Book appointments and manage your schedule.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{timeSlots.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>Choose from available appointment slots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {timeSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No available time slots at the moment.</p>
                    </div>
                  ) : (
                    timeSlots.map((slot) => (
                      <div key={slot.timeSlotId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                          <div className="text-sm text-gray-600">{formatDate(slot.date)}</div>
                          <Badge variant="default" className="mt-1">
                            Available
                          </Badge>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => openBookingDialog(slot)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Book
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View your booked appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments booked yet.</p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.appointmentId} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {formatDate(appointment.appointmentDate)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatTime(appointment.appointmentDate)}
                            </div>
                            <Badge 
                              variant={appointment.status === 'Booked' ? "default" : "destructive"}
                              className="mt-2"
                            >
                              {appointment.status === 'Booked' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Dialog */}
          <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogDescription>
                  Confirm your appointment details for {selectedSlot ? formatDate(selectedSlot.date) : ''} at {selectedSlot ? formatTime(selectedSlot.startTime) : ''} - {selectedSlot ? formatTime(selectedSlot.endTime) : ''}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Full Name</Label>
                  <Input
                    id="clientName"
                    value={bookingForm.clientName}
                    onChange={(e) => setBookingForm({...bookingForm, clientName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={bookingForm.clientEmail}
                    onChange={(e) => setBookingForm({...bookingForm, clientEmail: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or special requests"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowBookingDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Book Appointment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ProtectedRoute>
  );
}
