/**
 * אפקט זרקור מבוסס גלילה
 * מוסיף זוהר רך לסקציה הנוכחית בצפייה
 */

class ScrollSpotlight {
  constructor() {
    this.sections = [];
    this.currentActiveSection = null;
    this.isInitialized = false;
    this.throttleTimer = null;
    
    // זיהוי מובייל
    this.isMobile = window.innerWidth <= 749;
    
    // הגדרות אופטימיזציה למובייל
    this.options = {
      threshold: this.isMobile ? 0.2 : 0.3, // רגישות גבוהה יותר במובייל
      rootMargin: this.isMobile ? '-5% 0px -5% 0px' : '-10% 0px -10% 0px', // מרווח קטן יותר במובייל
      throttleDelay: this.isMobile ? 80 : 100 // עדכונים מעט יותר תכופים במובייל
    };
    
    this.init();
    this.handleMobileChanges();
  }
  
  init() {
    if (this.isInitialized) return;
    
    // המתנה לטעינת הדף
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.findSections();
    this.setupIntersectionObserver();
    this.bindEvents();
    this.isInitialized = true;
    
    console.log('אפקט זרקור הגלילה הופעל עם', this.sections.length, 'סקציות');
  }
  
  findSections() {
    // חיפוש סקציות עיקריות לאפקט הזרקור - מקיף במיוחד למובייל
    const sectionSelectors = [
      // מזהי סקשנים ספציפיים
      'section[id*="hero"]',
      'section[id*="about"]', 
      'section[id*="why"]',
      'section[id*="features"]',
      'section[id*="comparison"]',
      'section[id*="tech"]',
      'section[id*="gallery"]',
      'section[id*="reviews"]',
      'section[id*="faq"]',
      'section[id*="cta"]',
      'section[id*="compatibility"]',
      'section[id*="installation"]',
      'section[id*="quick-compatibility"]',
      
      // מחלקות AirSyncX
      '.airsyncx-hero',
      '.airsyncx-about',
      '.airsyncx-why-us',
      '.airsyncx-features',
      '.airsyncx-comparison',
      '.airsyncx-tech-specs',
      '.airsyncx-gallery',
      '.airsyncx-reviews',
      '.airsyncx-faq',
      '.airsyncx-cta',
      '.airsyncx-compatibility',
      '.airsyncx-what-is',
      '.airsyncx-how-it-works',
      '.airsyncx-installation-guide',
      '.airsyncx-product-features',
      '.airsyncx-product-showcase',
      '.airsyncx-quick-compatibility',
      '.quick-compatibility-section',
      
      // חיפוש כללי לכל הסקשנים של Shopify
      '.shopify-section:not([id*="header"]):not([id*="footer"]):not([id*="announcement"])',
      'section.shopify-section',
      
      // סקשנים עם תכונות airsyncx
      '[class*="airsyncx-"]:not([class*="header"]):not([class*="footer"])',
      '[id*="airsyncx-"]:not([id*="header"]):not([id*="footer"])',
      
      // סקשנים של דף נחיתה
      'section[class*="thunderbolt"]',
      '[class*="thunderbolt-"]',
      
      // סקשנים כלליים
      'main section',
      '.section-wrapper',
      '[data-section-type]'
    ];
    
    this.sections = [];
    
    sectionSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!this.sections.includes(element) && this.shouldIncludeSection(element)) {
            this.sections.push(element);
            this.prepareSectionForSpotlight(element);
          }
        });
      } catch (e) {
        // תיעוד שגיאות ללא הפרעה לפעולה
        console.debug('Spotlight selector error:', selector, e);
      }
    });
    
    // מיון הסקציות לפי מיקום בדף
    this.sections.sort((a, b) => {
      const aTop = a.getBoundingClientRect().top + window.pageYOffset;
      const bTop = b.getBoundingClientRect().top + window.pageYOffset;
      return aTop - bTop;
    });
  }
  
  shouldIncludeSection(element) {
    // בדיקה אם הסקציה מתאימה לאפקט זרקור
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // אלמנטים שלא נכלולים באפקט
    const excludeSelectors = [
      '.header',
      '.footer', 
      '.modal',
      '.popup',
      '.cart-drawer',
      '.announcement-bar'
    ];
    
    const shouldExclude = excludeSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
    
    return (
      !shouldExclude &&
      rect.height > 150 && // גובה מינימלי מוגדל
      computedStyle.display !== 'none' &&
      computedStyle.visibility !== 'hidden' &&
      computedStyle.position !== 'fixed' && // לא אלמנטים קבועים
      !element.classList.contains('spotlight-disabled') && // אפשרות להוציא סקציות ידנית
      !element.hasAttribute('data-spotlight-disabled') // אפשרות נוספת להוציא סקציות
    );
  }
  
  prepareSectionForSpotlight(element) {
    // הוספת המחלקות הבסיסיות
    element.classList.add('scroll-spotlight');
    
    // זיהוי סוג הסקציה להוספת צבע מותאם
    const sectionType = this.identifySectionType(element);
    if (sectionType) {
      element.classList.add(`spotlight-${sectionType}`);
    }
  }
  
  identifySectionType(element) {
    const id = element.id?.toLowerCase() || '';
    const className = element.className?.toLowerCase() || '';
    const content = element.textContent?.toLowerCase() || '';
    
    // זיהוי סוג הסקציה לפי מזהים, מחלקות או תוכן
    if (id.includes('hero') || className.includes('hero') || className.includes('airsyncx-hero') || element.tagName === 'HEADER') {
      return 'hero';
    }
    if (id.includes('about') || className.includes('about') || className.includes('airsyncx-about') || content.includes('מה זה')) {
      return 'about';
    }
    if (id.includes('features') || id.includes('why') || className.includes('features') || className.includes('why') || 
        className.includes('airsyncx-features') || className.includes('airsyncx-why')) {
      return 'features';
    }
    if (id.includes('comparison') || className.includes('comparison') || className.includes('airsyncx-comparison') || 
        className.includes('quick-compatibility') || content.includes('השוואה') || content.includes('תאימות')) {
      return 'comparison';
    }
    if (id.includes('tech') || className.includes('tech') || className.includes('airsyncx-tech')) {
      return 'features'; // טכניקל ספקס יקבל צבע של פיצ'רים
    }
    if (id.includes('gallery') || className.includes('gallery') || className.includes('airsyncx-gallery')) {
      return 'about'; // גלריה יקבל צבע של about
    }
    if (id.includes('reviews') || className.includes('reviews') || className.includes('airsyncx-reviews')) {
      return 'features'; // ביקורות יקבלו צבע של פיצ'רים
    }
    if (id.includes('faq') || className.includes('faq') || className.includes('airsyncx-faq')) {
      return 'comparison'; // שאלות נפוצות יקבלו צבע של השוואה
    }
    if (id.includes('quick-compatibility') || className.includes('quick-compatibility-section')) {
      return 'comparison'; // quick compatibility יקבל צבע של השוואה
    }
    
    return null; // צבע ברירת מחדל
  }
  
  setupIntersectionObserver() {
    // יצירת Observer לזיהוי סקציות בצפייה
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );
    
    // הוספת כל הסקציות למעקב
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }
  
  handleIntersection(entries) {
    // עיבוד שינויים בצפייה
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.activateSection(entry.target);
      } else {
        this.deactivateSection(entry.target);
      }
    });
  }
  
  activateSection(section) {
    // הפעלת אפקט הזרקור
    if (this.currentActiveSection && this.currentActiveSection !== section) {
      this.deactivateSection(this.currentActiveSection);
    }
    
    section.classList.add('spotlight-active');
    this.currentActiveSection = section;
    
    // אירוע מותאם
    section.dispatchEvent(new CustomEvent('spotlight:activated', {
      detail: { section }
    }));
  }
  
  deactivateSection(section) {
    // ביטול אפקט הזרקור
    section.classList.remove('spotlight-active');
    
    if (this.currentActiveSection === section) {
      this.currentActiveSection = null;
    }
    
    // אירוע מותאם
    section.dispatchEvent(new CustomEvent('spotlight:deactivated', {
      detail: { section }
    }));
  }
  
  bindEvents() {
    // אירועים נוספים
    window.addEventListener('resize', 
      this.throttle(() => this.handleResize(), this.options.throttleDelay)
    );
    
    // עדכון כאשר תוכן דינמי נוסף
    const resizeObserver = new ResizeObserver(
      this.throttle(() => this.handleContentChange(), this.options.throttleDelay)
    );
    
    this.sections.forEach(section => resizeObserver.observe(section));
  }
  
  handleResize() {
    // עדכון מיקומים אחרי שינוי גודל המסך
    this.sections.sort((a, b) => a.offsetTop - b.offsetTop);
  }
  
  handleContentChange() {
    // חיפוש סקציות חדשות שנוספו דינמית
    const currentSectionCount = this.sections.length;
    this.findSections();
    
    if (this.sections.length > currentSectionCount) {
      // הוספת סקציות חדשות למעקב
      this.sections.slice(currentSectionCount).forEach(section => {
        this.observer.observe(section);
      });
    }
  }
  
  throttle(func, delay) {
    // הגבלת קריאות לפונקציה לשיפור ביצועים
    return (...args) => {
      if (this.throttleTimer) return;
      
      this.throttleTimer = setTimeout(() => {
        func.apply(this, args);
        this.throttleTimer = null;
      }, delay);
    };
  }
  
  handleMobileChanges() {
    // מעקב אחר שינויי גודל מסך והתאמה למובייל
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 749;
        
        // אם השתנה מצב המובייל - עדכן הגדרות
        if (wasMobile !== this.isMobile) {
          this.options.threshold = this.isMobile ? 0.2 : 0.3;
          this.options.rootMargin = this.isMobile ? '-5% 0px -5% 0px' : '-10% 0px -10% 0px';
          this.options.throttleDelay = this.isMobile ? 80 : 100;
          
          // אתחל מחדש עם ההגדרות החדשות
          if (this.isInitialized) {
            this.refresh();
          }
        }
      }, 250);
    });
    
    // אופטימיזציה למובייל - התמקדות בסקשנים הנראים
    if (this.isMobile) {
      this.optimizeForMobile();
    }
  }
  
  optimizeForMobile() {
    // אופטימיזציות נוספות למובייל
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // השהיית אפקט כשהטאב לא פעיל
        if (this.currentActiveSection) {
          this.currentActiveSection.style.transition = 'opacity 0.3s ease';
          this.currentActiveSection.style.opacity = '0.8';
        }
      } else {
        // חידוש אפקט כשהטאב פעיל
        if (this.currentActiveSection) {
          this.currentActiveSection.style.opacity = '';
        }
      }
    });
    
    // חיסכון בביצועים במובייל - הפחתת עדכונים
    this.mobileThrottle = true;
  }

  // API פומבי
  destroy() {
    // ניקוי וביטול האפקט
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.sections.forEach(section => {
      section.classList.remove('scroll-spotlight', 'spotlight-active');
      section.classList.remove('spotlight-hero', 'spotlight-about', 'spotlight-features', 'spotlight-comparison');
    });
    
    this.isInitialized = false;
    console.log('אפקט זרקור הגלילה הופסק');
  }
  
  refresh() {
    // רענון האפקט
    this.destroy();
    this.setup();
  }
  
  updateOptions(newOptions) {
    // עדכון הגדרות
    this.options = { ...this.options, ...newOptions };
    this.refresh();
  }
}

// התחלה אוטומטית
let scrollSpotlightInstance;

function initScrollSpotlight() {
  // הפעלת האפקט בכל הדפים - מקיף במיוחד למובייל
  const spotlightSections = document.querySelectorAll([
    '.scroll-spotlight',
    'section[class*="airsyncx-"]',
    '[class*="airsyncx-"]',
    'section[id*="comparison"]',
    'section[id*="hero"]',
    'section[id*="about"]',
    'section[id*="features"]',
    'section[id*="tech"]',
    'section[id*="gallery"]',
    'section[id*="reviews"]',
    'section[id*="faq"]',
    '.shopify-section',
    'section.shopify-section',
    'main section',
    '[data-section-type]',
    'section[class*="thunderbolt"]',
    '[class*="thunderbolt-"]'
  ].join(', '));
  
  // הפעלה תמיד - גם אם אין סקציות כרגע (לתוכן דינמי)
  const isMobile = window.innerWidth <= 749;
  if (spotlightSections.length > 0 || isMobile) {
    scrollSpotlightInstance = new ScrollSpotlight();
    console.log(`אפקט זרקור הופעל: מצאו ${spotlightSections.length} סקציות, מובייל: ${isMobile}`);
  }
}

// הפעלה כאשר הדף מוכן
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollSpotlight);
} else {
  initScrollSpotlight();
}

// ייצוא למשתמשים מתקדמים
window.ScrollSpotlight = ScrollSpotlight;

// API גלובלי
window.spotlightAPI = {
  refresh: () => scrollSpotlightInstance?.refresh(),
  destroy: () => scrollSpotlightInstance?.destroy(),
  updateOptions: (options) => scrollSpotlightInstance?.updateOptions(options)
}; 