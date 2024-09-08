import React from "react";
import "./styles.css";

export default function App() {
  return (
  <div className="container">
  <h1>Welcome</h1>
  <p className="tagline">Enhance your Frontend skills and achieve your goals!</p>
  
  <div className="features">
      <div className="feature">
          <div className="emoji">🚀</div>
          <h3>Fully working codelabs</h3>
          <p>We have inbuild full fledge coding environment so that you can code and test in one place</p>
      </div>
      <div className="feature">
          <div className="emoji">📚</div>
          <h3>Advance Machine coding rounds</h3>
          <p>New problems are comming every week, so that you never run out of practing</p>
      </div>
      <div className="feature">
          <div className="emoji">📈</div>
          <h3>Ace Any interview</h3>
          <p>Practice and Ace any interview Schedule Interviews in minutes.</p>
      </div>
  </div>
  
  <a href="#" className="cta-button">Get Started Now</a>
</div>
)
}
