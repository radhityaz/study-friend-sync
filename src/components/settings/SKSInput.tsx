
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Save, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the form schema with zod
const formSchema = z.object({
  totalSKS: z.string()
    .min(1, "Total SKS wajib diisi")
    .refine(val => !isNaN(parseInt(val)), {
      message: "Total SKS harus berupa angka",
    })
    .refine(val => parseInt(val) > 0, {
      message: "Total SKS harus lebih dari 0",
    }),
  completedSKS: z.string()
    .min(1, "SKS yang telah selesai wajib diisi")
    .refine(val => !isNaN(parseInt(val)), {
      message: "SKS yang telah selesai harus berupa angka",
    })
    .refine(val => parseInt(val) >= 0, {
      message: "SKS yang telah selesai tidak boleh negatif",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export function SKSInput() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Default values
  const defaultValues: FormValues = {
    totalSKS: '144',
    completedSKS: '0',
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const handleSubmit = (values: FormValues) => {
    // Validate that completedSKS is not greater than totalSKS
    const total = parseInt(values.totalSKS);
    const completed = parseInt(values.completedSKS);
    
    if (completed > total) {
      form.setError("completedSKS", {
        type: "manual",
        message: "SKS yang telah selesai tidak boleh lebih dari total SKS"
      });
      return;
    }
    
    // In a real app, save this to the database
    console.log('Saving SKS values:', values);
    
    // Show a success toast message
    toast({
      title: "Informasi SKS disimpan",
      description: `Total SKS: ${values.totalSKS}, SKS selesai: ${values.completedSKS}`,
    });
    
    setShowForm(false);
    setFormSubmitted(true);
  };
  
  // Calculate completion percentage
  const totalSKS = parseInt(form.watch('totalSKS') || '144');
  const completedSKS = parseInt(form.watch('completedSKS') || '0');
  const progressPercentage = totalSKS > 0 
    ? Math.min(100, Math.round((completedSKS / totalSKS) * 100)) 
    : 0;
  
  return (
    <AnimatedCard
      animation="fade"
      className="p-5 flex flex-col space-y-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">SKS Progress</h3>
          <p className="text-sm text-muted-foreground">Track your academic progress</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      
      {showForm ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalSKS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total SKS Required</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select total SKS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="144">144 SKS (S1 Standard)</SelectItem>
                          <SelectItem value="160">160 SKS (Extended Program)</SelectItem>
                          <SelectItem value="36">36 SKS (S2 Program)</SelectItem>
                          <SelectItem value="42">42 SKS (S2 Extended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Total credits required for your degree
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="completedSKS"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Completed SKS</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          const current = parseInt(field.value) || 0;
                          if (current > 0) {
                            field.onChange((current - 1).toString());
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            // Only allow numeric input or empty string
                            const value = e.target.value;
                            if (value === '' || /^[0-9]+$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          const current = parseInt(field.value) || 0;
                          const max = parseInt(form.watch('totalSKS')) || 0;
                          if (current < max) {
                            field.onChange((current + 1).toString());
                          } else {
                            toast({
                              title: "Batas maksimum",
                              description: "Nilai tidak boleh melebihi Total SKS",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Credits you've already completed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.formState.errors.totalSKS || form.formState.errors.completedSKS ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Mohon perbaiki kesalahan input sebelum menyimpan.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save SKS Information
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{completedSKS} SKS completed</span>
            <span>{totalSKS} SKS total</span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{progressPercentage}% completed</span>
            <span className="text-muted-foreground">
              {totalSKS - completedSKS} SKS remaining
            </span>
          </div>
          
          {/* Graduation estimate */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Estimated graduation:</span>{' '}
              {progressPercentage < 25 ? 'More than 3 years' : 
               progressPercentage < 50 ? 'About 2 years' : 
               progressPercentage < 75 ? 'About 1 year' : 
               progressPercentage < 100 ? 'Less than 1 year' : 
               'Congratulations! You have completed all requirements'}
            </p>
          </div>
          
          {formSubmitted && (
            <div className="mt-2 text-center text-xs text-muted-foreground">
              <p>Data terakhir disimpan</p>
            </div>
          )}
        </div>
      )}
    </AnimatedCard>
  );
}
