import React from 'react';
import './styles.css';

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Info',
    fields: ['firstName', 'lastName', 'email'],
  },
  {
    id: 'address',
    title: 'Address',
    fields: ['street', 'city', 'zipCode'],
  },
  {
    id: 'account',
    title: 'Account Setup',
    fields: ['username', 'password', 'confirmPassword'],
  },
];

const App = () => {
  // TODO: Implement state management for:
  // - Current step
  // - Form data
  // - Validation
  // - Progress tracking

  return (
    <div className="wizard-container" data-testid="wizard-container">
      {/* Progress Bar */}
      <div className="wizard-progress" data-testid="wizard-progress">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className="step-indicator"
            data-testid={`step-${index}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="wizard-content" data-testid="wizard-content">
        {/* TODO: Implement step content */}
      </div>

      {/* Navigation */}
      <div className="wizard-navigation" data-testid="wizard-navigation">
        <button data-testid="prev-button">Previous</button>
        <button data-testid="next-button">Next</button>
      </div>
    </div>
  );
};

export default App;
