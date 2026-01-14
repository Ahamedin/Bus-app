import { useEffect, useRef } from "react";
import "../components/Highway.css";

const About = () => {
  const textRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    textRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section">
      <div className="highway-container">
        <div className="hero-text-vertical-wrapper">

          <div ref={(el) => (textRef.current[0] = el)} className="hero-text-vertical">
            <h1>About This Project</h1>
          </div>

          <div ref={(el) => (textRef.current[1] = el)} className="hero-text-vertical">
            <p>
              This project is designed for students of Kalasalingam Academy of
              Research and Education, providing a smart and reliable college
              bus tracking experience.
            </p>
          </div>

          <div ref={(el) => (textRef.current[2] = el)} className="hero-text-vertical">
            <p>
              The system tracks the college bus in real‑time and alerts students
              before their destination arrives, ensuring safe and stress‑free travel.
            </p>
          </div>

          <div ref={(el) => (textRef.current[3] = el)} className="hero-text-vertical">
            <h1>College Bus Service</h1>
          </div>

          <div ref={(el) => (textRef.current[4] = el)} className="hero-text-vertical">
            <p>
              The evening college bus departs from Kalasalingam campus at 5:15 PM
              daily and covers major student residential routes.
            </p>
          </div>

          <div ref={(el) => (textRef.current[5] = el)} className="hero-text-vertical">
            <h1>Transport Office</h1>
          </div>

          <div ref={(el) => (textRef.current[6] = el)} className="hero-text-vertical">
            <p>
              For transport‑related queries, students can contact the
              Kalasalingam University Transport Office during working hours.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
