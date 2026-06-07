/* ===== PARTICLE BACKGROUND (cyan soul fire particles) ===== */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#00e5ff','#00b8cc','#7ee8fa','#0891b2','#22d3ee','#38bdf8'];

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = -(Math.random() * 0.5 + 0.1);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.45 + 0.08;
    this.life = 0;
    this.maxLife = Math.random() * 350 + 180;
  };
  Particle.prototype.update = function () {
    this.x += this.speedX; this.y += this.speedY; this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  };
  Particle.prototype.draw = function () {
    const fade = Math.min(this.life / 25, (this.maxLife - this.life) / 25, 1);
    ctx.globalAlpha = this.alpha * fade;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  for (let i = 0; i < 100; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== IP TAB SWITCHER ===== */
function switchTab(tab, btn) {
  document.querySelectorAll('.ip-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ip-panel').forEach(p => p.classList.add('hidden'));
  btn.classList.add('active');
  document.getElementById('panel-' + tab).classList.remove('hidden');
}

/* ===== COPY IP ===== */
function copyIP(ip) {
  navigator.clipboard.writeText(ip).then(() => {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      const span = btn.querySelector('span') || btn;
      const orig = span.textContent;
      btn.classList.add('copied');
      if (btn.querySelector('span')) btn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (btn.querySelector('span')) btn.querySelector('span').textContent = orig;
      }, 2000);
    });
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = ip; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  });
}

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix) {
  suffix = suffix || '';
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}

/* ===== INTERSECTION OBSERVER ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      if (entry.target.classList.contains('stats-bar')) {
        animateCounter(document.getElementById('stat1'), 1247);
        animateCounter(document.getElementById('stat2'), 84200);
        animateCounter(document.getElementById('stat3'), 99, '%');
        animateCounter(document.getElementById('stat4'), 6);
        observer.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.mode-card, .news-card, .crate-box, .vote-text, .connect-card').forEach(el => {
  el.style.cssText += 'opacity:0; transform:translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease;';
  observer.observe(el);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 60 ? '0 4px 40px rgba(0,229,255,0.07)' : 'none';
});

/* ===== ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });
sections.forEach(s => sectionObs.observe(s));

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  const open = mobileMenu.classList.contains('open');
  bars[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  bars[1].style.opacity = open ? '0' : '1';
  bars[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
  });
});

/* ===== CRATE POPUP ===== */
const crateData = {
  common: {
    title: "Common",
    image: "common.png",
    description: "The armor can give you more protection which makes it easier to survive while the tools can help you mine blocks faster.",
    items: ["Enchanted Diamond Helmet", "Enchanted Diamond Chestplate", "Enchanted Diamond Leggings", "Enchanted Diamond Boots", "Enchanted Diamond Sword", "Enchanted Diamond Pickaxe", "Enchanted Diamond Shovel"]
  },
  spawner: {
    title: "Spawner",
    image: "spawner.png",
    description: "Spawner crate gives you useful mob spawners for farms and money making.",
    items: ["Cow Spawner", "Spider Spawner", "Zombie Spawner", "Skeleton Spawner", "Blaze Spawner", "Creeper Spawner", "Iron Golem Spawner"]
  },
  crimson: {
    title: "Crimson",
    image: "crimson.png",
    description: "Crimson crate gives strong PvP and survival rewards.",
    items: ["Enchanted Netherite Helmet", "Enchanted Netherite Chestplate", "Enchanted Netherite Leggings", "Enchanted Netherite Boots", "Enchanted Netherite Sword", "Enchanted Netherite Axe", "Enchanted Netherite Pickaxe"]
  },
  soul: {
    title: "Soul",
    image: "soul.png",
    description: "Soul crate contains premium rewards and exclusive Soul SMP items.",
    items: ["Enchanted Netherite Helmet", "Enchanted Netherite Chestplate", "Enchanted Netherite Leggings", "Enchanted Netherite Boots", "Enchanted Crossbow"]
  },
  amethyst: {
    title: "Amethyst",
    image: "amethyst.png",
    description: "Amethyst crate contains legendary Tools.",
    items: ["1 Amethyst Tree Chopper (Breaks Trees Instantly) (self destructs after 3 days)", "1 Amethyst Drill (Breaks 9 Blocks At Once) (self destructs after 3 days)", "1 Amethyst Multitool (Converts into tool you need 3 in 1) (self destructs after 3 days)"]
  }
};

function openCrate(crateName){
  const crate = crateData[crateName];
  document.getElementById("modalTitle").innerText = crate.title;
  document.getElementById("modalDescription").innerText = crate.description;
  document.getElementById("modalImage").src = crate.image;
  
  const list = document.getElementById("modalItems");
  list.innerHTML = "";
  crate.items.forEach(item => {
    list.innerHTML += `<li>${item}</li>`;
  });
  document.getElementById("crateModal").classList.add("active");
}

function closeCrate(){
  document.getElementById("crateModal").classList.remove("active");
}

/* ===== LEGAL POPUPS (PRIVACY & TOS) ===== */
const legalData = {
  privacy: {
    title: "Privacy Policy",
    content: `
       <h3>Privacy Policy</h3>
       <p>At SoulSMP, we respect your privacy and only collect information necessary to provide and improve our services.</p>
       <h3>Information We Collect</h3>
       <p>We may collect your Minecraft username, Discord username, email address (if provided), and basic website usage data.</p>
       <h3>How We Use Your Information</h3>
       <p>Your information is used to manage your account, provide support, process purchases, and improve the SoulSMP experience.</p>
       <h3>Cookies & Analytics</h3>
       <p>Our website may use cookies and analytics tools to understand visitor activity and enhance website performance.</p>
       <h3>Third-Party Services</h3>
       <p>We may use trusted third-party services such as Discord, GitHub, Netlify, and payment providers to operate our platform.</p>
       <h3>Data Security</h3>
       <p>We take reasonable measures to protect your information, but no online service can guarantee complete security.</p>
       <h3>Children's Privacy</h3>
       <p>Users under the age required by their local laws should obtain parental permission before using our services.</p>
       <h3>Changes to This Policy</h3>
       <p>We may update this Privacy Policy from time to time. Continued use of our services indicates acceptance of any changes.</p>
       <h3>Contact Us</h3>
       <p>If you have questions regarding this Privacy Policy, please contact us through our official Discord server.</p>
    `
  },
  tos: {
    title: "Terms of Service",
    content: `
       <h3>Terms of Service</h3>
       <p>By accessing SoulSMP, you agree to follow these Terms of Service and all applicable server rules.</p>
       <h3>Account Responsibility</h3>
       <p>You are responsible for maintaining the security of your Minecraft and Discord accounts.</p>
       <h3>Server Rules</h3>
       <p>Players must follow all server rules. Violations may result in warnings, temporary suspensions, or permanent bans.</p>
       <h3>Purchases & Donations</h3>
       <p>All purchases, ranks, and crate keys are final and non-refundable unless required by applicable law.</p>
       <h3>Fair Gameplay</h3>
       <p>Cheating, exploiting bugs, using unauthorized modifications, or attempting to gain unfair advantages is prohibited.</p>
       <h3>Content Ownership</h3>
       <p>All SoulSMP branding, website content, and server assets remain the property of SoulSMP unless otherwise stated.</p>
       <h3>Service Availability</h3>
       <p>We may modify, suspend, or discontinue any part of the server or website at any time without notice.</p>
       <h3>Limitation of Liability</h3>
       <p>SoulSMP is provided "as is" and we are not liable for data loss, interruptions, or damages arising from its use.</p>
       <h3>Termination</h3>
       <p>We reserve the right to restrict or terminate access to our services for any user who violates these terms.</p>
       <h3>Changes to Terms</h3>
       <p>These Terms of Service may be updated periodically. Continued use of SoulSMP constitutes acceptance of the revised terms.</p>
    `
  }
};

function openLegalModal(type) {
  document.getElementById("legalModalTitle").innerText = legalData[type].title;
  document.getElementById("legalModalContent").innerHTML = legalData[type].content;
  document.getElementById("legalModal").classList.add("active");
}

function closeLegalModal() {
  document.getElementById("legalModal").classList.remove("active");
}
document.addEventListener('DOMContentLoaded', () => {
    // Target the elements using their IDs
    const copyBtn = document.getElementById('copy-ip-btn');
    const statusText = document.getElementById('copy-status');

    // Add a modern event listener
    copyBtn.addEventListener('click', async () => {
        // Retrieve the IP from the data attribute
        const ipToCopy = copyBtn.getAttribute('data-ip');

        try {
            // Use the modern, secure Clipboard API
            await navigator.clipboard.writeText(ipToCopy);

            // Update UI to show success
            statusText.innerText = "COPIED!";
            statusText.style.color = "#4ade80"; // Optional: changes text to green

            // Revert back to original state after 2000 milliseconds (2 seconds)
            setTimeout(() => {
                statusText.innerText = "CLICK TO COPY";
                statusText.style.color = ""; // Resets to default CSS color
            }, 2000);

        } catch (err) {
            // Always handle potential errors (e.g., if the user denies clipboard permissions)
            console.error('Failed to copy text: ', err);
            statusText.innerText = "FAILED TO COPY";
            statusText.style.color = "red";
        }
    });
});
