import { useState } from "react";
import Login from "./Login";
import { SignUp } from "./SignUp";

type AuthStep = 'login' | 'signup';

export function AuthFlow() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');

  const handleBackToLogin = () => {
    setCurrentStep('login');
  };

  const handleGoToSignUp = () => {
    setCurrentStep('signup');
  };

  switch (currentStep) {
    case 'login':
      return (
        <Login 
          onSwitchToSignUp={handleGoToSignUp}
        />
      );
    
    case 'signup':
      return (
        <SignUp 
          onBackToLogin={handleBackToLogin}
        />
      );
    
    default:
      return (
        <Login 
          onSwitchToSignUp={handleGoToSignUp}
        />
      );
  }
}