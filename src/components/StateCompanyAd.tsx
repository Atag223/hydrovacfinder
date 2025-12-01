'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './StateCompanyAd.module.css';

interface StateCompanyAdProps {
  stateName: string;
}

export default function StateCompanyAd({ stateName }: StateCompanyAdProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className={styles.adSection}>
      <div className={styles.container}>
        <div className={styles.adCard}>
          {/* Advertisement Header */}
          <div className={styles.adHeader}>
            <h2 className={styles.adTitle}>Featured Hydro-Vac Company in {stateName}</h2>
          </div>

          {/* Image Placeholder / Upload Area */}
          <div className={styles.imageSection}>
            {uploadedImage ? (
              <div className={styles.uploadedImageWrapper}>
                <Image
                  src={uploadedImage}
                  alt="Company Advertisement"
                  fill
                  className={styles.uploadedImage}
                />
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p>Image Placeholder</p>
                <span>Upload a company logo, truck photo, or advertisement image</span>
                <label className={styles.uploadBtn}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  Choose Image
                </label>
              </div>
            )}
          </div>

          {/* Text Box Area */}
          <div className={styles.textSection}>
            {customText ? (
              <div className={styles.customTextDisplay}>
                <p>{customText}</p>
              </div>
            ) : (
              <div className={styles.textPlaceholder}>
                <textarea
                  className={styles.textInput}
                  placeholder="Enter custom advertisement text here..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Default Placeholder Advertisement */}
          <div className={styles.placeholderAd}>
            <div className={styles.placeholderContent}>
              <h3 className={styles.placeholderTitle}>
                This State Page Advertising Spot Is Available — $2,500 per year.
              </h3>
              <p className={styles.placeholderText}>
                Click below to purchase and secure your exclusive statewide placement.
              </p>
              <Link href="/checkout/state-company" className={styles.purchaseBtn}>
                Purchase State Page – $2500
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
