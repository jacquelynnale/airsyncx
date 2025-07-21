// Enhanced Dynamic Social Proof Container for Cart - Credible Sales Encouragement
class SocialProofManager {
  constructor() {
    this.container = document.getElementById('social-proof-container');
    this.items = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.isVisible = false;
    this.rotationInterval = 8000; // 8 seconds between messages - less intrusive
    this.displayDuration = 5000; // 5 seconds display time - more readable
    this.pauseBetweenMessages = 3000; // 3 seconds pause between messages
    this.language = document.documentElement.lang === 'he' ? 'he' : 'en';
    
    this.realisticData = this.initializeRealisticData();
    this.lastShownTime = 0;
    this.minTimeBetweenMessages = 10000; // Minimum 10 seconds between messages
    
    this.init();
  }

  // Initialize realistic data pools for rotation
  initializeRealisticData() {
    return {
      customerNames: {
        he: ['דני ר.', 'שרה מ.', 'אבי כ.', 'מירי ל.', 'יוסי ח.', 'רחל ש.', 'עמית ב.', 'נועה ג.', 'רון ד.', 'טל ק.'],
        en: ['David R.', 'Sarah M.', 'Mike K.', 'Lisa L.', 'Tom H.', 'Anna S.', 'Ben B.', 'Emma G.', 'Ron D.', 'Kate Q.']
      },
      reviews: {
        he: [
          'מוצר מעולה! משלוח מהיר מאוד',
          'איכות מדהימה, בדיוק מה שחיפשתי',
          'שירות לקוחות מעולה, ממליץ בחום',
          'מוצר איכותי, הגיע במהירות',
          'מושלם! עבד מהיום הראשון',
          'כל הכבוד, חוויית קנייה מצוינת'
        ],
        en: [
          'Amazing product! Super fast delivery',
          'Excellent quality, exactly what I needed',
          'Outstanding customer service, highly recommend',
          'Quality product, arrived quickly',
          'Perfect! Worked from day one',
          'Well done, excellent shopping experience'
        ]
      },
      timeFrames: {
        he: ['השעה האחרונה', 'השעתיים האחרונות', 'ב-24 השעות האחרונות', 'היום', 'השעות האחרונות'],
        en: ['in the last hour', 'in the last 2 hours', 'in the last 24 hours', 'today', 'recently']
      },
      locations: {
        he: ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'פתח תקווה', 'נתניה', 'אשדוד', 'ראשון לציון'],
        en: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Be\'er Sheva', 'Petah Tikva', 'Netanya', 'Ashdod', 'Rishon LeZion']
      }
    };
  }

  init() {
    if (!this.container) return;
    
    this.items = this.container.querySelectorAll('.social-proof-item');
    if (this.items.length === 0) return;
    
    // Wait longer before starting to show messages (less intrusive)
    setTimeout(() => {
      this.startRotation();
    }, 5000);
    
    // Update numbers periodically with realistic intervals
    this.updateDynamicNumbers();
    setInterval(() => this.updateDynamicNumbers(), 45000); // Update every 45 seconds
    
    // Pause messages when user is actively interacting
    this.addInteractionListeners();
  }

  addInteractionListeners() {
    // Pause messages when user is actively interacting with cart
    const interactiveElements = document.querySelectorAll('.airsyncx-quantity-input, .airsyncx-checkout-button, .airsyncx-quantity-button');
    
    interactiveElements.forEach(element => {
      element.addEventListener('focus', () => this.pauseTemporarily());
      element.addEventListener('click', () => this.pauseTemporarily());
    });
    
    // Also pause on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      this.pauseTemporarily();
      scrollTimeout = setTimeout(() => this.resume(), 3000);
    });
  }
  
  pauseTemporarily() {
    this.pause();
    this.hideCurrentItem();
    setTimeout(() => this.resume(), 5000); // Resume after 5 seconds
  }

  startRotation() {
    if (this.items.length === 0) return;
    
    this.intervalId = setInterval(() => {
      const now = Date.now();
      if (now - this.lastShownTime < this.minTimeBetweenMessages) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * this.items.length);
      this.currentIndex = randomIndex;
      this.showCurrentItem();
      
    }, this.rotationInterval);
  }

  showCurrentItem() {
    if (!this.items[this.currentIndex]) return;
    
    // Hide all items
    this.items.forEach(item => {
      item.classList.remove('active');
    });
    
    // Show current item
    this.items[this.currentIndex].classList.add('active');
    
    // Show container
    this.container.classList.add('show');
    this.isVisible = true;
    this.lastShownTime = Date.now();
    
    // Update dynamic content for current item
    this.updateItemContent(this.items[this.currentIndex]);
    
    // Hide after display duration
    setTimeout(() => {
      this.hideCurrentItem();
    }, this.displayDuration);
  }

  hideCurrentItem() {
    this.container.classList.remove('show');
    this.isVisible = false;
  }

  updateItemContent(item) {
    const type = item.dataset.type;
    
    switch (type) {
      case 'recent-purchase':
        this.updateRecentPurchase(item);
        break;
      case 'limited-stock':
        this.updateStockWarning(item);
        break;
      case 'review':
        this.updateCustomerReview(item);
        break;
      case 'fast-shipping':
        this.updateFastShipping(item);
        break;
      case 'trending':
        this.updateTrending(item);
        break;
      case 'special-offer':
        this.updateSpecialOffer(item);
        break;
    }
  }

  updateRecentPurchase(item) {
    const countElement = item.querySelector('.customer-count');
    const timeElement = item.querySelector('.time-frame');
    const locationElement = item.querySelector('.location');
    
    if (countElement) {
      // More realistic recent purchase numbers (2-15)
      const count = Math.floor(Math.random() * 14) + 2;
      countElement.textContent = count;
    }
    
    if (timeElement) {
      const timeFrames = this.realisticData.timeFrames[this.language];
      const randomTime = timeFrames[Math.floor(Math.random() * timeFrames.length)];
      timeElement.textContent = randomTime;
    }
    
    if (locationElement) {
      const locations = this.realisticData.locations[this.language];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      locationElement.textContent = randomLocation;
    }
  }

  updateStockWarning(item) {
    const countElement = item.querySelector('.stock-count');
    if (countElement) {
      // More realistic low stock numbers (2-7)
      const count = Math.floor(Math.random() * 6) + 2;
      countElement.textContent = count;
    }
  }

  updateCustomerReview(item) {
    const reviewTextElement = item.querySelector('.review-text');
    const reviewerNameElement = item.querySelector('.reviewer-name');
    const ratingElement = item.querySelector('.review-rating');
    
    if (reviewTextElement) {
      const reviews = this.realisticData.reviews[this.language];
      const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
      reviewTextElement.textContent = `"${randomReview}"`;
    }
    
    if (reviewerNameElement) {
      const names = this.realisticData.customerNames[this.language];
      const randomName = names[Math.floor(Math.random() * names.length)];
      reviewerNameElement.textContent = randomName;
    }
    
    if (ratingElement) {
      // More realistic rating distribution (4.3-5.0)
      const rating = (Math.random() * 0.7 + 4.3).toFixed(1);
      ratingElement.textContent = rating;
    }
  }

  updateFastShipping(item) {
    const timeElement = item.querySelector('.time-left');
    if (timeElement) {
      // More realistic shipping times (1-4 hours)
      const hours = Math.floor(Math.random() * 4) + 1;
      timeElement.textContent = hours;
    }
  }

  updateTrending(item) {
    const countElement = item.querySelector('.view-count');
    if (countElement) {
      // More realistic trending numbers (8-35)
      const count = Math.floor(Math.random() * 28) + 8;
      countElement.textContent = count;
    }
  }

  updateSpecialOffer(item) {
    const timeElement = item.querySelector('.countdown');
    if (timeElement) {
      // Create more realistic countdown timer
      this.startRealisticCountdown(timeElement);
    }
  }

  startRealisticCountdown(element) {
    // Create a more realistic countdown from 45 minutes to 3 hours
    const minMinutes = 45;
    const maxMinutes = 180;
    const totalMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
    let totalSeconds = totalMinutes * 60;
    
    const updateCountdown = () => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      if (hours > 0) {
        element.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      
      if (totalSeconds > 0) {
        totalSeconds--;
        setTimeout(updateCountdown, 1000);
      } else {
        // Reset countdown when it reaches zero
        const newMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
        totalSeconds = newMinutes * 60;
        updateCountdown();
      }
    };
    
    updateCountdown();
  }

  startCountdown(element) {
    // Backward compatibility - use the new realistic countdown
    this.startRealisticCountdown(element);
  }

  updateDynamicNumbers() {
    // Update all visible dynamic numbers
    this.items.forEach(item => {
      if (item.classList.contains('active')) {
        this.updateItemContent(item);
      }
    });
  }

  // Public method to pause/resume rotation
  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume() {
    if (!this.intervalId) {
      this.startRotation();
    }
  }

  // Show specific message type
  showMessageType(type) {
    const item = this.container.querySelector(`[data-type="${type}"]`);
    if (item) {
      const index = Array.from(this.items).indexOf(item);
      if (index !== -1) {
        this.currentIndex = index;
        this.showCurrentItem();
      }
    }
  }

  // Clean up when component is destroyed
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Clear any pending timeouts
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    
    // Remove event listeners
    const interactiveElements = document.querySelectorAll('.airsyncx-quantity-input, .airsyncx-checkout-button, .airsyncx-quantity-button');
    interactiveElements.forEach(element => {
      element.removeEventListener('focus', this.pauseTemporarily);
      element.removeEventListener('click', this.pauseTemporarily);
    });
    
    // Remove scroll listener
    window.removeEventListener('scroll', this.handleScroll);
    
    // Hide container
    if (this.container) {
      this.container.classList.remove('show');
    }
  }
}

// Cart-specific triggers for social proof
class CartSocialProofTriggers {
  constructor(socialProofManager) {
    this.socialProof = socialProofManager;
    this.init();
  }

  init() {
    // Show stock warning when items are low
    this.checkStockLevels();
    
    // Show recent purchase messages when cart is updated
    this.monitorCartUpdates();
    
    // Show special offers based on cart total
    this.monitorCartTotal();
    
    // Show trending messages for popular items
    this.checkTrendingItems();
  }

  checkStockLevels() {
    const quantityInputs = document.querySelectorAll('.airsyncx-quantity-input');
    quantityInputs.forEach(input => {
      input.addEventListener('change', () => {
        const quantity = parseInt(input.value);
        if (quantity >= 3) {
          // Show stock warning if user tries to buy 3+ items
          setTimeout(() => {
            this.socialProof.showMessageType('stock-warning');
          }, 1000);
        }
      });
    });
  }

  monitorCartUpdates() {
    // Listen for cart updates via Shopify's cart API
    document.addEventListener('cart:updated', () => {
      // Show recent purchase message after cart update
      setTimeout(() => {
        this.socialProof.showMessageType('recent-purchase');
      }, 2000);
    });
  }

  monitorCartTotal() {
    const checkoutButton = document.querySelector('.airsyncx-checkout-button');
    if (checkoutButton) {
      checkoutButton.addEventListener('mouseenter', () => {
        // Show special offer when hovering over checkout
        this.socialProof.showMessageType('special-offer');
      });
    }
  }

  checkTrendingItems() {
    // Show trending message for items that appear to be popular
    const productCards = document.querySelectorAll('.airsyncx-product-card');
    if (productCards.length >= 2) {
      setTimeout(() => {
        this.socialProof.showMessageType('trending');
      }, 5000);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const socialProofContainer = document.querySelector('.social-proof-container');
  if (socialProofContainer) {
    const socialProofManager = new SocialProofManager();
    const cartTriggers = new CartSocialProofTriggers(socialProofManager);
    
    // Global access for debugging and cleanup
    window.socialProofManager = socialProofManager;
    window.cartTriggers = cartTriggers;
  }
});

// Handle page visibility changes to pause/resume when page is hidden/visible
document.addEventListener('visibilitychange', () => {
  if (window.socialProofManager) {
    if (document.hidden) {
      window.socialProofManager.pause();
    } else {
      // Resume with a slight delay to avoid immediate messages when returning to page
      setTimeout(() => {
        window.socialProofManager.resume();
      }, 2000);
    }
  }
});

// Clean up when page is about to unload
window.addEventListener('beforeunload', () => {
  if (window.socialProofManager) {
    window.socialProofManager.destroy();
  }
});

// Handle navigation changes in SPAs
window.addEventListener('popstate', () => {
  if (window.socialProofManager) {
    window.socialProofManager.pause();
    setTimeout(() => {
      window.socialProofManager.resume();
    }, 1000);
  }
});