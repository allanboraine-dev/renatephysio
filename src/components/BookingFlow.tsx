"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const bookingSchema = z.object({
  appointmentType: z.string().min(1, 'Please select an appointment type'),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, 'Please select a time'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Valid phone number is required'),
  medicalAidProvider: z.string().optional(),
  medicalAidNumber: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
  '13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM'
];

export function BookingFlow() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      appointmentType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      medicalAidProvider: '',
      medicalAidNumber: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: BookingValues) => {
    setIsSubmitting(true);
    try {
      // Here you would integrate with the Supabase API to insert into 'appointments' and 'patients' tables
      console.log('Submitting booking payload:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Appointment booked successfully!');
      setStep(4); // Success step
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(['appointmentType']);
    } else if (step === 2) {
      isValid = await form.trigger(['date', 'time']);
    }
    
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <Card className="w-full border-0 shadow-2xl shadow-blue-900/5 overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-8">
        <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
        <CardDescription className="text-slate-300">
          {step === 4 ? 'You are all set!' : `Step ${step} of 3: ${step === 1 ? 'Service' : step === 2 ? 'Date & Time' : 'Your Details'}`}
        </CardDescription>
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
            <motion.div 
              className="bg-blue-500 h-full rounded-full"
              initial={{ width: `${((step - 1) / 3) * 100}%` }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Service Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="appointmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">What do you need help with?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 text-lg">
                              <SelectValue placeholder="Select an appointment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="initial">Initial Assessment (45-60 min)</SelectItem>
                            <SelectItem value="followup">Follow-up Session (30 min)</SelectItem>
                            <SelectItem value="sports">Sports Massage (45 min)</SelectItem>
                            <SelectItem value="postop">Post-Op Rehab (45 min)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* STEP 2: Date & Time */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base">Select Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-14 pl-3 text-left font-normal text-lg",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date.getDay() === 0 || date.getDay() === 6
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('date') && (
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Available Times</FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {timeSlots.map((time) => (
                              <label
                                key={time}
                                className={cn(
                                  "flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors",
                                  field.value === time 
                                    ? "bg-blue-900 text-white border-blue-900 font-bold" 
                                    : "hover:bg-slate-50 border-slate-200 text-slate-700"
                                )}
                              >
                                <input
                                  type="radio"
                                  className="hidden"
                                  value={time}
                                  checked={field.value === time}
                                  onChange={(e) => field.onChange(e.target.value)}
                                />
                                {time}
                              </label>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </motion.div>
              )}

              {/* STEP 3: Patient Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name *</FormLabel><FormControl><Input className="h-12" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input className="h-12" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number *</FormLabel><FormControl><Input type="tel" className="h-12" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" className="h-12" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-semibold text-slate-900 mb-4">Medical Aid (Optional)</h4>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="medicalAidProvider" render={({ field }) => (
                        <FormItem><FormLabel>Provider</FormLabel><FormControl><Input placeholder="e.g. Discovery" className="h-12" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="medicalAidNumber" render={({ field }) => (
                        <FormItem><FormLabel>Medical Aid Number</FormLabel><FormControl><Input className="h-12" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-4">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Request Received!</h3>
                  <p className="text-lg text-slate-600 max-w-md mx-auto">
                    Thank you, {form.getValues('firstName')}. We have received your booking request for {form.getValues('date') && format(form.getValues('date'), 'PPP')} at {form.getValues('time')}. 
                    Our team will contact you shortly to confirm.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-8 h-12 px-8"
                    onClick={() => {
                      form.reset();
                      setStep(1);
                    }}
                  >
                    Book Another Session
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </CardContent>

      {/* Navigation Footer */}
      {step < 4 && (
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-8 flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={prevStep} className="h-12 px-6 gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : <div></div>}

          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="bg-blue-900 hover:bg-blue-800 text-white h-12 px-8 gap-2 rounded-full">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-800 text-white h-12 px-8 gap-2 rounded-full"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'} <CheckCircle2 className="w-4 h-4 ml-1" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
