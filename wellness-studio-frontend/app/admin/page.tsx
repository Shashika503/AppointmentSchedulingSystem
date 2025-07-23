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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  getTimeSlots, 
  createTimeSlot, 
  updateTimeSlot, 
  deleteTimeSlot,
  getAppointments,
  cancelAppointment,
  type TimeSlot,
  type Appointment
} from '@/lib/api';
import { Plus, Edit, Trash2, Calendar, Clock, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Time slot form state
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [showSlotDialog, setShowSlotDialog] = useState(false);
  const [slotForm, setSlotForm] = useState({
    startTime: '',
    endTime: '',
    date: '',
    isAvailable: true
  });

  const [confirmDialog, setConfirmDialog] = useState<{
  open: boolean,
  action: null | (() => Promise<void>),
  message: string
}>({
  open: false,
  action: null,
  message: ''
});

const showConfirm = (message: string, onConfirm: () => Promise<void>) => {
  setConfirmDialog({ open: true, action: onConfirm, message });
};


  useEffect(() => {
    loadData();
  }, []);

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
        getTimeSlots(),
        getAppointments()
      ]);
      setTimeSlots(slotsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Convert date, startTime, and endTime to Date objects before sending to the API
  const formattedSlotForm = {
    ...slotForm,
    date: slotForm.date, // Convert string to Date object
    startTime: `${slotForm.date}T${slotForm.startTime}`, // Combine date and time for startTime
    endTime: `${slotForm.date}T${slotForm.endTime}`, // Combine date and time for endTime
  };

 

  // // Duplicate check: prevent adding same date + startTime + endTime
 const exists = timeSlots.some(slot => {
  const [slotDate, slotTime] = slot.startTime.split('T');
  return (
    slotDate === slotForm.date &&
    slotTime.startsWith(slotForm.startTime)
  );
});

if (!editingSlot && exists) {
  setError('A time slot with the same date and start time already exists!');
  return;
}




  try {
    if (editingSlot) {
      await updateTimeSlot(editingSlot.timeSlotId, formattedSlotForm);
      setSuccess('Time slot updated successfully');
    } else {
      await createTimeSlot(formattedSlotForm);
      setSuccess('Time slot created successfully');
    }
    
    await loadData();
    resetSlotForm();
  } catch (err) {
    setError('Failed to save time slot');
  }
};


  const handleDeleteSlot = async (id: number) => {
  showConfirm('Are you sure you want to delete this time slot?', async () => {
    try {
      await deleteTimeSlot(id);
      setSuccess('Time slot deleted successfully');
      await loadData();
    } catch (err) {
      setError('Failed to delete time slot');
    }
  });
};

const handleCancelAppointment = async (id: number) => {
  showConfirm('Are you sure you want to cancel this appointment?', async () => {
    try {
      await cancelAppointment(id);
      setSuccess('Appointment cancelled successfully');
      await loadData();
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  });
};


  const resetSlotForm = () => {
    setSlotForm({ startTime: '', endTime: '', date: '', isAvailable: true });
    setEditingSlot(null);
    setShowSlotDialog(false);
  };

  function extractTimeFromISO(iso: string) {
  // Works with or without seconds: 'T12:18' or 'T12:18:00'
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : '';
}

function extractDateFromISO(iso: string) {
  // Returns YYYY-MM-DD
  return iso.slice(0, 10);
}

const openEditDialog = (slot: TimeSlot) => {
  try {
    // slot.startTime and slot.endTime are ISO strings like "2025-07-23T13:52:00"
    // slot.date is also "2025-07-23T00:00:00" or similar

    // Use substring to extract 'HH:mm' part from ISO string
    const extractTime = (dt: string) => {
      const date = new Date(dt);
      // This gives 'HH:MM', 24-hour format, zero padded
      return date.toISOString().substr(11, 5);
    };

    // For date, extract only the date part (YYYY-MM-DD)
    const extractDate = (dt: string) => {
      return new Date(dt).toISOString().split('T')[0];
    };

    setEditingSlot(slot);
    setSlotForm({
    startTime: extractTimeFromISO(slot.startTime),   // e.g. "12:18"
    endTime: extractTimeFromISO(slot.endTime),       // e.g. "14:20"
    date: extractDateFromISO(slot.date),             // e.g. "2025-07-23"
    isAvailable: slot.isAvailable,
  });
    setShowSlotDialog(true);
  } catch (error) {
    console.error('Error formatting time or date:', error);
    setError('Invalid date or time format');
  }
};




  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="min-h-screen bg-gray-50">
        <Navigation title="Admin Dashboard" role="Admin" />
        
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Time Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{timeSlots.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {timeSlots.filter(slot => slot.isAvailable).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Time Slots Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Time Slots Management</CardTitle>
                  <CardDescription>Create and manage available time slots</CardDescription>
                </div>
                <Dialog open={showSlotDialog} onOpenChange={setShowSlotDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetSlotForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Slot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSlot ? 'Edit Time Slot' : 'Create Time Slot'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSlot ? 'Update the time slot details' : 'Add a new time slot to the schedule'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSlotSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={slotForm.startTime}
                            onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={slotForm.endTime}
                            onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={slotForm.date}
                          onChange={(e) => setSlotForm({...slotForm, date: e.target.value})}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isAvailable"
                          checked={slotForm.isAvailable}
                          onCheckedChange={(checked) => setSlotForm({...slotForm, isAvailable: checked})}
                        />
                        <Label htmlFor="isAvailable">Available</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={resetSlotForm}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingSlot ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <div key={slot.timeSlotId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm text-gray-600">{new Date(slot.date).toLocaleDateString()}</div>
                        <Badge variant={slot.isAvailable ? "default" : "secondary"}>
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(slot)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSlot(slot.timeSlotId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
                      {/* Appointments Management */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>View and manage all appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <div key={appointment.appointmentId} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{appointment.clientName}</div>
                          <div className="text-sm text-gray-600">{appointment.clientEmail}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        {appointment.status === 'Booked' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelAppointment(appointment.appointmentId)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Dialog open={confirmDialog.open} onOpenChange={open => setConfirmDialog(s => ({ ...s, open }))}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>{confirmDialog.message}</DialogDescription>
    </DialogHeader>
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline"
        onClick={() => setConfirmDialog(s => ({ ...s, open: false }))}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={async () => {
          setConfirmDialog(s => ({ ...s, open: false }));
          if (confirmDialog.action) await confirmDialog.action();
        }}
      >
        Yes, Confirm
      </Button>
    </div>
  </DialogContent>
</Dialog>

        </main>
      </div>
    </ProtectedRoute>
  );
}
