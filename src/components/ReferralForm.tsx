'use client';

import { useState, FormEvent } from 'react';
import styles from './ReferralForm.module.css';

// Time to display success message before closing modal (in milliseconds)
const SUCCESS_MESSAGE_DISPLAY_MS = 2000;

interface ReferralFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralForm({ isOpen, onClose }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyPhone: '',
    companyContactPerson: '',
    referrerName: '',
    referrerEmail: '',
    referrerPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: result.message });
        // Reset form after successful submission
        setFormData({
          companyName: '',
          companyPhone: '',
          companyContactPerson: '',
          referrerName: '',
          referrerEmail: '',
          referrerPhone: '',
        });
        // Close the modal after a short delay
        setTimeout(() => {
          onClose();
          setSubmitMessage(null);
        }, SUCCESS_MESSAGE_DISPLAY_MS);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit referral' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Failed to submit referral. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.icon}>💰</div>
          <h2 className={styles.title}>Submit a Referral</h2>
          <p className={styles.subtitle}>
            Earn $150 when your referral signs up for a Featured or higher package!
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Company You&apos;re Referring</h3>
            
            <div className={styles.field}>
              <label htmlFor="companyName" className={styles.label}>Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter company name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="companyContactPerson" className={styles.label}>Contact Person *</label>
              <input
                type="text"
                id="companyContactPerson"
                name="companyContactPerson"
                value={formData.companyContactPerson}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Person we should contact"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="companyPhone" className={styles.label}>Company Phone *</label>
              <input
                type="tel"
                id="companyPhone"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Your Information</h3>
            
            <div className={styles.field}>
              <label htmlFor="referrerName" className={styles.label}>Your Name *</label>
              <input
                type="text"
                id="referrerName"
                name="referrerName"
                value={formData.referrerName}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="referrerEmail" className={styles.label}>Your Email *</label>
              <input
                type="email"
                id="referrerEmail"
                name="referrerEmail"
                value={formData.referrerEmail}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="referrerPhone" className={styles.label}>Your Phone *</label>
              <input
                type="tel"
                id="referrerPhone"
                name="referrerPhone"
                value={formData.referrerPhone}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {submitMessage && (
            <div className={`${styles.message} ${styles[submitMessage.type]}`}>
              {submitMessage.text}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Referral'}
          </button>
        </form>
      </div>
    </div>
  );
}
