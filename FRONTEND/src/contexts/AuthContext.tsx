
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserLogin, UserRegister } from '@/service/auth/auth.service'

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface Register {
  id: string;
  email: string;
  password: string,
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (fields: {
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    email: string;
    password: string;
  }) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  navigate: NavigateFunction;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();



  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    const req = { Email: email, Password: password }
    await UserLogin(req)
      .then((res) => {
        if (res?.status) {
          const newUser: User = {
            id: res?.user?._id,
            email: res?.user?.email,
            displayName: res?.user?.Username,
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(res.user));
          toast({
            title: res.message,
            description: `Welcome back, ${newUser.displayName}!`,
            variant: "success",
            duration: 1000,
          });
          setLoading(false);
          navigate('/user/dashboard');
        }
        else {
          setLoading(false);
          localStorage.removeItem('user');
          toast({
            title: res.message,
            description: "enter valid user cridential",
            variant: "destructive",
            duration: 1000,
          })

        }

      })
      .catch((err) => {
        console.log("Error in login api", err)
      })
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);

    try {
      const googleUser: User = {
        id: 'google123',
        email: 'cpp@gmail.com',
        displayName: 'Chandra Prakash',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user',
      };

      setUser(googleUser);
      localStorage.setItem('user', JSON.stringify(googleUser));
      localStorage.setItem('displayName', googleUser.displayName);

      toast({
        title: "Google login successful",
        description: `Welcome, ${googleUser.displayName}!`,
        variant: "success",
        duration: 1000,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Could not sign in with Google",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "success",
      duration: 1000,
    });
    navigate('/login');
  };

  const register = async (fields: { firstName: string, lastName: string, email: string, password: string, userName: string, phoneNumber: string }): Promise<void> => {
    setLoading(true);
    if (fields.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const req = {
      FirstName: fields.firstName,
      LastName: fields.lastName,
      Username: fields.userName,
      Email: fields.email,
      PhoneNo: fields.phoneNumber,
      Password: fields.password
    }
    await UserRegister(req)
      .then((res) => {
        if (res?.status) {
          toast({
            title: "Registration successful",
            description: res.message,
            variant: "success",
            duration: 1000,
          });
          setLoading(false);
          navigate('/login');
        }
        else {
          localStorage.removeItem('user');
          toast({
            title: res.message,
            description: "enter valid user cridential",
            variant: "destructive",
            duration: 1000,
          })
        }
      })
      .catch((err) => {
        toast({
          title: "Registration failed",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
          duration: 1000,
        });
      })
  };

  const value = {
    user,
    loading,
    loginWithEmail,
    loginWithGoogle,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
