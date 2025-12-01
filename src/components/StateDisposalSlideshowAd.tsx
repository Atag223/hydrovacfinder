'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './StateDisposalSlideshowAd.module.css';

interface StateDisposalSlideshowAdProps {
  stateName: string;
}

export default function StateDisposalSlideshowAd({ stateName }: StateDisposalSlideshowAdProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [description, setDescription] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target?.result as string);
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className={styles.adSection}>
      <div className={styles.container}>
        <div className={styles.adCard}>
          {/* Advertisement Header */}
          <div className={styles.adHeader}>
            <h2 className={styles.adTitle}>Featured Disposal Facility in {stateName}</h2>
          </div>

          {/* Slideshow Section */}
          <div className={styles.slideshowSection}>
            {images.length > 0 ? (
              <div className={styles.slideshow}>
                <div className={styles.slideContainer}>
                  <Image
                    src={images[currentSlide]}
                    alt={`Disposal Facility Image ${currentSlide + 1}`}
                    fill
                    className={styles.slideImage}
                  />
                </div>
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      className={`${styles.navBtn} ${styles.prevBtn}`}
                      onClick={prevSlide}
                      aria-label="Previous slide"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.navBtn} ${styles.nextBtn}`}
                      onClick={nextSlide}
                      aria-label="Next slide"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Slide Indicators */}
                {images.length > 1 && (
                  <div className={styles.indicators}>
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Slide Counter */}
                <div className={styles.slideCounter}>
                  {currentSlide + 1} / {images.length}
                </div>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p>Image Slideshow</p>
                <span>Upload multiple images to create a slideshow</span>
                <label className={styles.uploadBtn}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  Choose Images
                </label>
              </div>
            )}

            {/* Add More Images Button */}
            {images.length > 0 && (
              <div className={styles.addMoreSection}>
                <label className={styles.addMoreBtn}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  + Add More Images
                </label>
              </div>
            )}
          </div>

          {/* Description / Text Area */}
          <div className={styles.textSection}>
            {description ? (
              <div className={styles.descriptionDisplay}>
                <p>{description}</p>
              </div>
            ) : (
              <div className={styles.textPlaceholder}>
                <textarea
                  className={styles.textInput}
                  placeholder="Enter facility description or advertisement text here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Default Placeholder Advertisement */}
          <div className={styles.placeholderAd}>
            <div className={styles.placeholderContent}>
              <h3 className={styles.placeholderTitle}>
                This Disposal Facility Spotlight Is Available — $1,750 per year.
              </h3>
              <p className={styles.placeholderText}>
                Be the featured disposal site for this state. Click below to purchase.
              </p>
              <Link href="/checkout/state-disposal" className={styles.purchaseBtn}>
                Purchase Disposal Feature – $1750
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
