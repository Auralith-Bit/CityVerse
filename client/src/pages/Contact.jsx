import { useState } from 'react';

const info = [
  { icon: 'bx bx-map', title: 'Our Location', lines: ['Butwal, Rupandehi', 'Nepal'] },
  { icon: 'bx bx-phone', title: 'Phone Number', lines: ['+977-71-520000', '+977-9800000000'] },
  { icon: 'bx bx-envelope', title: 'Email Address', lines: ['info@cityverse.com.np', 'support@cityverse.com.np'] },
  { icon: 'bx bx-time', title: 'Business Hours', lines: ['Sun — Fri: 7:00 AM — 8:00 PM', 'Saturday: 8:00 AM — 5:00 PM'] },
];

const faqs = [
  {
    q: 'How far is Butwal from Bhairahawa?',
    a: 'Butwal and Bhairahawa are approximately 25 km apart. The drive takes around 30–40 minutes by car or bus.',
  },
  {
    q: 'What are the must-visit spots in Butwal?',
    a: 'Manimukunda Park, Butwal Hill Park, Siddhartha Chowk and the nearby heritage site of Devdaha are among the most popular.',
  },
  {
    q: 'What can I do in Bhairahawa?',
    a: 'Visit Buddha Park, explore the local markets, try the street food and use the city as a base for regional travel via Gautam Buddha International Airport.',
  },
  {
    q: 'Do I need an account to browse attractions?',
    a: 'No. Browsing and searching attractions is completely free. Accounts are only used by administrators to manage content.',
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
    window.showToast?.('Thank you! Your message has been received.', 'success');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>Have a question about exploring Butwal &amp; Bhairahawa? We are here to help.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <div className="contact-info-cards">
                {info.map((item) => (
                  <div className="contact-info-card" key={item.title}>
                    <div className="contact-info-icon">
                      <i className={item.icon} />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      {item.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h3>Send Us a Message</h3>
              <p>We'll get back to you within 24 hours.</p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactName">
                      Full Name
                    </label>
                    <input type="text" className="form-input" id="contactName" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactEmail">
                      Email
                    </label>
                    <input type="email" className="form-input" id="contactEmail" placeholder="you@email.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactSubject">
                    Subject
                  </label>
                  <input type="text" className="form-input" id="contactSubject" placeholder="How can we help?" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactMessage">
                    Message
                  </label>
                  <textarea
                    className="form-input"
                    id="contactMessage"
                    placeholder="Tell us about your travel plans in Butwal & Bhairahawa…"
                    rows="5"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <i className="bx bx-send" /> Send Message
                </button>
                {submitted && (
                  <p className="admin-hint" style={{ marginTop: 'var(--space-3)' }}>
                    Message sent. This demo form does not store submissions.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gap: 'var(--space-3)' }}>
            {faqs.map((item) => (
              <details
                key={item.q}
                className="admin-panel"
                style={{ padding: 'var(--space-5)', cursor: 'pointer' }}
              >
                <summary style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.q}</summary>
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
