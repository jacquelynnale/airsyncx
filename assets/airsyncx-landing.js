document.addEventListener('DOMContentLoaded', function() {
  // ניהול תפריט נייד
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const header = document.querySelector('.header');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // סגירת התפריט בלחיצה על קישור בתפריט הנייד
  const mobileNavLinks = document.querySelectorAll('.main-nav a');
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      header.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    });
  });
  
  // הדבקת התפריט בעת גלילה
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });
  
  // אנימציות בעת גלילה
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  function checkIfInView() {
    animateElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // בדיקה אם האלמנט נמצא בתוך חלון הצפייה
      if (elementPosition.top < windowHeight * 0.9) {
        element.classList.add('animated');
      }
    });
  }
  
  // בדיקה ראשונית אם אלמנטים נמצאים בתוך חלון הצפייה
  checkIfInView();
  
  // בדיקה בעת גלילה
  window.addEventListener('scroll', checkIfInView);
  
  // חלקות גלילה לעוגנים
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      // אם זה לא קישור ריק
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - header.offsetHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}); 