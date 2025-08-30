// Mobile Navbar Debugging Script
// Add this to browser console to test mobile navbar functionality

(function() {
  console.log('🔍 Mobile Navbar Debug Script Started');
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  console.log('📱 Is Mobile:', isMobile);
  
  if (!isMobile) {
    console.log('❌ Not on mobile, script not needed');
    return;
  }
  
  // Find mobile navigation elements
  const mobileButton = document.querySelector('button[aria-label="Toggle mobile menu"]');
  const mobileMenu = document.querySelector('.fixed.top-0.right-0.z-50');
  const backdrop = document.querySelector('.fixed.inset-0.z-40');
  
  console.log('🔍 Mobile Elements Found:', {
    button: !!mobileButton,
    menu: !!mobileMenu,
    backdrop: !!backdrop
  });
  
  // Test button click
  if (mobileButton) {
    console.log('🖱️ Testing button click...');
    
    // Simulate click
    mobileButton.click();
    
    setTimeout(() => {
      const isOpen = document.body.classList.contains('menu-open');
      console.log('✅ Menu state after click:', isOpen ? 'OPEN' : 'CLOSED');
      
      // Test closing
      if (isOpen) {
        console.log('🖱️ Testing close...');
        mobileButton.click();
        
        setTimeout(() => {
          const isClosed = !document.body.classList.contains('menu-open');
          console.log('✅ Menu state after close:', isClosed ? 'CLOSED' : 'OPEN');
        }, 500);
      }
    }, 500);
  }
  
  // Check for potential conflicts
  const fixedElements = document.querySelectorAll('[class*="fixed"]');
  console.log('📍 Fixed elements found:', fixedElements.length);
  
  fixedElements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    const zIndex = styles.zIndex;
    const position = styles.position;
    
    if (zIndex && parseInt(zIndex) > 50) {
      console.log(`⚠️ High z-index element ${index}:`, {
        element: el.tagName,
        zIndex,
        position,
        classes: el.className
      });
    }
  });
  
  // Check for JavaScript errors
  const originalError = console.error;
  console.error = function(...args) {
    console.log('🚨 JavaScript Error:', args);
    originalError.apply(console, args);
  };
  
  console.log('✅ Debug script completed');
})();
