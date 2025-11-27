import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💧</span>
          <span className={styles.logoText}>Hydrovac Finder</span>
        </div>
        <nav className={styles.nav}>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Find Hydro-Excavation Services Near You</h1>
          <p>
            Safe, efficient, and non-destructive digging solutions. Connect with
            trusted hydrovac service providers in your area.
          </p>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Enter your city or zip code..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>Find Services</button>
          </div>
        </section>

        <section id="services" className={styles.services}>
          <h2>Our Services</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🔧</div>
              <h3>Utility Locating</h3>
              <p>
                Precise excavation around underground utilities without risk of
                damage.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏗️</div>
              <h3>Potholing</h3>
              <p>
                Expose buried utilities safely for verification and repair
                purposes.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🌊</div>
              <h3>Slot Trenching</h3>
              <p>
                Narrow trenches for cable, pipe, and utility installation with
                minimal disruption.
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🛡️</div>
              <h3>Safe Digging</h3>
              <p>
                Non-destructive excavation that protects existing infrastructure
                and the environment.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className={styles.about}>
          <h2>Why Choose Hydrovac?</h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>
                Hydro-excavation uses pressurized water and a powerful vacuum
                system to safely excavate soil. This method is significantly
                safer than traditional mechanical digging, especially around
                sensitive underground utilities.
              </p>
              <ul className={styles.benefitsList}>
                <li>✅ Non-destructive to underground utilities</li>
                <li>✅ Faster than manual excavation</li>
                <li>✅ Works in all weather conditions</li>
                <li>✅ Environmentally friendly</li>
                <li>✅ Reduces project costs and delays</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className={styles.contact}>
          <h2>Get a Free Quote</h2>
          <p>
            Ready to start your project? Contact us for a free estimate.
          </p>
          <form className={styles.contactForm}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Phone Number" />
            <textarea placeholder="Describe your project..." rows={4}></textarea>
            <button type="submit" className={styles.submitButton}>
              Request Quote
            </button>
          </form>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Hydrovac Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
