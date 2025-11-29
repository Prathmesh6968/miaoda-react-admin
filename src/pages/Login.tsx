import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Validate confirm password
        if (password !== confirmPassword) {
          toast({
            title: 'Error',
            description: 'Passwords do not match',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        // Create account - store in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (existingUsers.some((u: any) => u.email === email)) {
          toast({
            title: 'Error',
            description: 'This email is already registered',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        existingUsers.push({ email, password, id: Date.now().toString() });
        localStorage.setItem('users', JSON.stringify(existingUsers));
        localStorage.setItem('userAuth', JSON.stringify({ email, id: existingUsers[existingUsers.length - 1].id }));

        toast({
          title: 'Success',
          description: 'Account created successfully!'
        });
        
        navigate(from);
      } else {
        // Login - check localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = existingUsers.find((u: any) => u.email === email && u.password === password);

        if (!user) {
          toast({
            title: 'Login Failed',
            description: 'Invalid email or password',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        localStorage.setItem('userAuth', JSON.stringify({ email, id: user.id }));

        toast({
          title: 'Success',
          description: 'Logged in successfully!'
        });

        navigate(from);
      }
      
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl gradient-text mb-2">
            AnimeStream Hub
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account' : 'Sign in to access your watchlist'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <Button
                variant="link"
                className="ml-1 p-0 h-auto"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setConfirmPassword('');
                }}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </Button>
            </p>
            
            {!isSignUp && (
              <p className="text-sm text-muted-foreground">
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => {
                    toast({
                      title: 'Reset Password',
                      description: 'Please contact admin for password reset'
                    });
                  }}
                >
                  Forgot Password?
                </Button>
              </p>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
