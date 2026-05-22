import { Link } from "react-router-dom";
import "./Footer.css";

const GlobeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 4 5.8 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.8-4-9s1.5-6.4 4-9Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M6.94 6.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.5 9h3v12h-3V9Zm5 0h2.88v1.64h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V21h-3v-6.18c0-1.47-.03-3.36-2.04-3.36-2.04 0-2.35 1.59-2.35 3.25V21h-3V9Z" />
  </svg>
);

const MemberCard = ({ label, name, profileHref, linkedinHref }) => (
  <div className="footer-column">
    <p className="footer-eyebrow">{label}</p>

    <p className="footer-name-single">{name}</p>

    <div className="footer-links">
      <a href={profileHref} target="_blank" rel="noreferrer" aria-label={`${label} portfolio`}>
        <GlobeIcon className="footer-icon" />
        <span>Portfolio</span>
      </a>
      <a href={linkedinHref} target="_blank" rel="noreferrer" aria-label={`${label} LinkedIn`}>
        <LinkedinIcon className="footer-icon" />
        <span>LinkedIn</span>
      </a>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <section className="footer-section">
    <p className="footer-section-title">{title}</p>
    <div className="footer-section-body">{children}</div>
  </section>
);

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-title">
            Bus App
          </Link>
          <p className="site-footer-copy">Smart college bus tracking for students and admins.</p>
        </div>

        <div className="site-footer-grid">
          <SectionCard title="Hardware">
            <MemberCard
              label="Hardware Member"
              name="JEGATHEESAN"
              profileHref="#"
              linkedinHref="https://www.linkedin.com/in/j-baskar8055?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            />
          </SectionCard>

          <SectionCard title="Software">
            <div className="footer-software-grid">
              <MemberCard
                label="Frontend"
                name="Iklash Ahamed"
                profileHref="https://iklashahamed.dev"
                linkedinHref="https://www.linkedin.com/in/iklash"
              />
              <MemberCard
                label="Backend"
                name="Vikneshwaran"
                profileHref="#"
                linkedinHref="https://www.linkedin.com/in/viknesh-waran/?skipRedirect=true"
              />
            </div>
          </SectionCard>
        </div>

        <p className="site-footer-meta">© {new Date().getFullYear()} Bus App</p>
      </div>
    </footer>
  );
};

export default Footer;