import React, { useState } from 'react';
import questions from './data';
import './styles.css';

export const Accordion = ({ question }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { id, title, info } = question;
  //TODO: Implement the solution here
  return (
    <>
      <div className="accordion">
        <div className="accordion-title">
          <h3>{title}</h3>
          <button
            data-testid="toogle-button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="accordion-icon"
          >
            {isExpanded ? '-' : '+'}
          </button>
        </div>
        {isExpanded && <p className="accordion-info">{info}</p>}
      </div>
    </>
  );
};

export default function App() {
  console.log(questions);
  return (
    <div className="App">
      <h1>Accordion</h1>
      {questions.map(question => {
        return <Accordion question={question} key={question.id} />;
      })}
    </div>
  );
}
