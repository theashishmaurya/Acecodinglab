import questions from './data';
import './styles.css';

export const Accordion = () => {
  //TODO: Implement the solution here
  return (
    <>
      <div className="accordion" data-testid="accordion">
        <div className="accordion-title" data-testid="accordion-title">
          <h3>Title</h3>
          <button className="accordion-icon">-</button>
        </div>
        <p className="accordion-info" data-testid="accordion-info">
          This is an Accordion
        </p>
      </div>
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>Accordion</h1>
      <Accordion />;
    </div>
  );
}
