import React from 'react';
import '../assets/styles/Contact.scss';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import LinkedInBadge from './LinkedInBadge';

const EMAIL = 'chetanchandane.ai@gmail.com';

const CHANNELS = [
  {
    key: 'email',
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: <EmailIcon />,
    external: false,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: 'in/chetanchandane',
    href: 'https://www.linkedin.com/in/chetanchandane/',
    icon: <LinkedInIcon />,
    external: true,
  },
  {
    key: 'x',
    label: 'X / Twitter',
    value: '@ChetanCh1080',
    href: 'https://x.com/ChetanCh1080',
    icon: <FontAwesomeIcon icon={faXTwitter} />,
    external: true,
  },
];

function Contact() {
  return (
    <div id="contact">
      <div className="items-container contact-wrap">
        <div className="section-head">
          <span className="eyebrow">Get in touch</span>
          <h1>Let's build something</h1>
        </div>
        <p className="contact-intro">
          Have a project, a role, or just a good idea? The fastest way to reach me is below —
          I read everything and reply quickly.
        </p>

        <div className="contact-cards">
          {CHANNELS.map((c) => {
            const card = (
              <a
                className="contact-card"
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="cc-icon">{c.icon}</span>
                <span className="cc-text">
                  <span className="cc-label">{c.label}</span>
                  <span className="cc-value">{c.value}</span>
                </span>
                <NorthEastIcon className="cc-arrow" />
              </a>
            );
            return c.key === 'linkedin' ? (
              <LinkedInBadge key={c.key} block>{card}</LinkedInBadge>
            ) : (
              <React.Fragment key={c.key}>{card}</React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Contact;
