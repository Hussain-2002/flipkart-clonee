
import { useState } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

const loginSchema = z.object({
  emailOrMobile: z.string().min(3, { message: "Please enter a valid email or mobile number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrMobile: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!showOtpForm) {
        setShowOtpForm(true);
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-sm shadow-lg overflow-hidden w-full max-w-3xl mx-4 flex h-[500px]">
        {/* Blue Section */}
        <div className="bg-[#2874f0] text-white p-10 w-2/5 flex flex-col">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">Login</h2>
            <p className="text-lg">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          
          <div className="mt-auto">
            <img 
              src="https://static-assets-web.flixcart.com/fk-p/images/login_img_c4a81e.png" 
              alt="Login illustration" 
              className="w-full"
            />
          </div>
        </div>
        
        {/* Form Section */}
        <div className="w-3/5 p-10 flex flex-col">
          <button 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-5">
              {!showOtpForm ? (
                <FormField
                  control={form.control}
                  name="emailOrMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Enter Email/Mobile number" 
                          className="h-12 text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2">
                        By continuing, you agree to ShopEase's Terms of Use and Privacy Policy.
                      </p>
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter Password" 
                          className="h-12 text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          By continuing, you agree to ShopEase's Terms of Use and Privacy Policy.
                        </p>
                        <a href="#" className="text-xs text-[#2874f0]">
                          Forgot?
                        </a>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#fb641b] hover:bg-[#fa580b] text-white text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : showOtpForm ? "Login" : "Request OTP"}
              </Button>
              
              {!showOtpForm && (
                <div className="text-center">
                  <span className="text-sm text-gray-500">OR</span>
                </div>
              )}
              
              {!showOtpForm && (
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full h-12 text-[#2874f0] border-[#2874f0] hover:bg-[#f5faff] text-base font-medium"
                >
                  Request OTP
                </Button>
              )}
            </form>
          </Form>
          
          <div className="mt-auto text-center">
            <Button 
              variant="link" 
              className="text-[#2874f0] text-base font-medium"
              onClick={onSwitchToSignup}
            >
              New to ShopEase? Create an account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
