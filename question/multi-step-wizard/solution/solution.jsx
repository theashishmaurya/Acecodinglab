import React, { useState, useEffect } from 'react';

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Info',
    fields: ['firstName', 'lastName', 'email']
  },
  {
    id: 'address',
    title: 'Address',
    fields: ['street', 'city', 'zipCode']
  },
  {
    id: 'account',
    title: 'Account Setup',
    fields: ['username', 'password', 'confirmPassword']
  }
];

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  zipCode: '',
  username: '',
  password: '',
  confirmPassword: ''
};

const MultiStepWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? '' 
          : 'Invalid email format';
      case 'password':
        return value.length >= 8 
          ? '' 
          : 'Password must be at least 8 characters';
      case 'confirmPassword':
        return value === formData.password 
          ? '' 
          : 'Passwords do not match';
      case 'zipCode':
        return /^\d{5}(-\d{4})?$/.test(value) 
          ? '' 
          : 'Invalid ZIP code';
      default:
        return value.trim() 
          ? '' 
          : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
  };

  // Validate current step
  const validateStep = () => {
    const currentFields = STEPS[currentStep].fields;
    const stepErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        stepErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(stepErrors);
    return isValid;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep()) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Handle form submission
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  // Render form fields for current step
  const renderFields = () => {
    const currentFields = STEPS[currentStep].fields;
    
    return (
      <div className="form-step active">
        {currentFields.map(field => (
          <div key={field} className="form-group">
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field.includes('password') ? 'password' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={errors[field] ? 'error' : ''}
              data-testid={`input-${field}`}
            />
            {errors[field] && (
              <div className="error-message" data-testid={`error-${field}`}>
                {errors[field]}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="wizard-container" data-testid="wizard-container">
      <div className="wizard-progress" data-testid="wizard-progress">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`step-indicator ${
              index === currentStep ? 'active' : ''
            } ${completedSteps.includes(index) ? 'completed' : ''}`}
            data-testid={`step-${index}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="wizard-content" data-testid="wizard-content">
        {renderFields()}
      </div>

      <div className="wizard-navigation" data-testid="wizard-navigation">
        <button
          data-testid="prev-button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        
        <button
          data-testid="next-button"
          onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
        >
          {currentStep === STEPS.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default MultiStepWizard;
