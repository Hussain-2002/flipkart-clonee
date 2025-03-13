import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { User } from '@shared/schema';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: checkingAuth, loginMutation, registerMutation } = useAuth();
  
  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user && !checkingAuth) {
      navigate('/');
    }
  }, [user, checkingAuth, navigate]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
  });
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      }
    });
  };
  
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Your account has been created!",
        });
        navigate('/');
      }
    });
  };
  
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2 text-[#2874f0] italic">Flipkart</h1>
          <p className="text-gray-600 text-center mb-6">Plus members get <span className="text-[#f9cc16] font-medium">extra benefits</span> and rewards</p>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#fb641b] hover:bg-[#fa580b] text-white" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loginMutation.isPending ? "Signing In..." : "Login"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#fb641b] hover:bg-[#fa580b] text-white" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {registerMutation.isPending ? "Creating Account..." : "Register"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right Side - Hero Image & Text (Flipkart Style) */}
      <div className="hidden lg:flex flex-1 bg-[#2874f0] text-white p-8">
        <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
          <h2 className="text-3xl font-medium mb-6">Looks like you're new here!</h2>
          <p className="text-lg mb-8 opacity-90">
            Sign up with your mobile number or email to get started
          </p>
          
          <div className="mt-auto">
            <img 
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
              alt="Flipkart secure login" 
              className="max-w-xs"
            />
          </div>
          
          <div className="space-y-5 mt-8">
            <div className="flex items-start">
              <div className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-md font-medium mb-1">Access to Flipkart Plus</h3>
                <p className="text-sm opacity-80">Loyalty rewards and free delivery</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10H3"></path>
                  <path d="M21 6H3"></path>
                  <path d="M21 14H3"></path>
                  <path d="M21 18H3"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-md font-medium mb-1">Personalized Experience</h3>
                <p className="text-sm opacity-80">Recommendations based on your interests</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <line x1="3" x2="21" y1="9" y2="9"></line>
                  <line x1="9" x2="9" y1="21" y2="9"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-md font-medium mb-1">Order Tracking</h3>
                <p className="text-sm opacity-80">Real-time updates on your purchases</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}