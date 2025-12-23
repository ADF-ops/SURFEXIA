/* ===============================
   SURFEXIA - Premium JavaScript
   Style Safran Group
================================ */

// ===== CONFIGURATION =====
const CONFIG = {
  revealThreshold: 0.15,
  headerScrollThreshold: 50,
  smoothScrollOffset: 90
};

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector(".site-header");
let lastScrollY = window.scrollY;

function updateHeaderOnScroll() {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > CONFIG.headerScrollThreshold) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
  
  lastScrollY = currentScrollY;
}

// Throttle pour optimiser les performances
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeaderOnScroll();
      checkRevealElements();
      ticking = false;
    });
    ticking = true;
  }
});

// ===== BURGER MENU =====
const burger = document.getElementById("burger");
const navMobile = document.getElementById("navMobile");

if (burger && navMobile) {
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    navMobile.classList.toggle("open");
    burger.classList.toggle("active");
    
    if (navMobile.classList.contains("open")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  const mobileLinks = navMobile.querySelectorAll("a");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMobile.classList.remove("open");
      burger.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
  
  document.addEventListener("click", (e) => {
    if (navMobile.classList.contains("open") && 
        !navMobile.contains(e.target) && 
        !burger.contains(e.target)) {
      navMobile.classList.remove("open");
      burger.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll(".reveal");

function checkRevealElements() {
  const windowHeight = window.innerHeight;
  
  revealElements.forEach((element, index) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = CONFIG.revealThreshold * windowHeight;
    
    if (elementTop < windowHeight - elementVisible) {
      setTimeout(() => {
        element.classList.add("active");
      }, index * 100);
    }
  });
}

window.addEventListener("load", () => {
  checkRevealElements();
  updateHeaderOnScroll();
});

checkRevealElements();

// ===== SMOOTH SCROLL POUR LES ANCRES =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    
    if (targetId === "#" || targetId === "#!") {
      e.preventDefault();
      return;
    }
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      e.preventDefault();
      
      // Retirer la classe active de tous les liens
      document.querySelectorAll(".nav-desktop a, .nav-mobile a").forEach(link => {
        link.classList.remove("active");
      });
      
      // Ajouter la classe active au lien cliqué
      this.classList.add("active");
      
      if (navMobile && navMobile.classList.contains("open")) {
        navMobile.classList.remove("open");
        burger.classList.remove("active");
        document.body.style.overflow = "";
      }
      
      const targetPosition = targetElement.offsetTop - CONFIG.smoothScrollOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  });
});

// ===== PARALLAX HERO - CORRIGÉ =====
const heroSection = document.querySelector(".hero");
const heroImage = heroSection ? heroSection.querySelector("img") : null;

if (heroImage) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    // Limiter le parallax pour que l'image reste dans le cadre
    if (scrolled < heroHeight) {
      const parallaxSpeed = 0.3; // Réduit pour moins de mouvement
      const maxTransform = heroHeight * 0.15; // Limite le déplacement à 15% de la hauteur
      const transformY = Math.min(scrolled * parallaxSpeed, maxTransform);
      
      heroImage.style.transform = `translate(-50%, -50%) translateY(${transformY}px)`;
    }
  });
}

// ===== ACTIVE NAV LINK =====
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;
  const navLinks = document.querySelectorAll(".nav-desktop a, .nav-mobile a");
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    
    // Retirer d'abord toutes les classes active
    link.classList.remove("active");
    
    // Si on a un hash dans l'URL (ex: #contact)
    if (currentHash && linkHref === currentHash) {
      link.classList.add("active");
    }
    // Sinon vérifier la page
    else if (!currentHash && (linkHref === currentPage || 
        (currentPage === "" && linkHref === "index.html"))) {
      link.classList.add("active");
    }
  });
}

// Exécuter au chargement
setActiveNavLink();

// Exécuter à chaque changement de hash
window.addEventListener("hashchange", setActiveNavLink);

// ===== LAZY LOADING IMAGES =====
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          
          img.style.opacity = "0";
          img.style.transition = "opacity 0.6s ease";
          
          img.onload = () => {
            img.style.opacity = "1";
          };
        }
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: "50px"
  });

  document.querySelectorAll("img[data-src]").forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== CARD HOVER EFFECT =====
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  // Vérifier si ce n'est pas une card-step ou offer-card
  if (!card.classList.contains('card-step') && !card.classList.contains('offer-card')) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  }
});

// ===== PERFORMANCE =====
function checkConnectionSpeed() {
  if ("connection" in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection && (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g")) {
      console.log("Connexion lente détectée - Optimisation des animations");
      document.documentElement.style.setProperty("--transition-base", "none");
      document.documentElement.style.setProperty("--transition-slow", "none");
    }
  }
}

checkConnectionSpeed();

// ===== EASTER EGG =====
console.log(
  "%c💎 SURFEXIA %c- Ingénierie des surfaces",
  "font-size: 20px; font-weight: bold; color: #00b4d8; text-shadow: 2px 2px 0 #0b1d2d;",
  "font-size: 14px; color: #475569;"
);
console.log(
  "%cSite développé avec ❤️ pour l'excellence industrielle",
  "font-style: italic; color: #64748b;"
);

// ===== EXPORT =====
window.SURFEXIA = {
  version: "1.0.0",
  revealElements: revealElements.length,
  config: CONFIG
};