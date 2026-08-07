// ======================================================
// OUR STORY V4
// effects.js
// Handles all ambient visual effects
// ======================================================

class EffectsManager {

    constructor() {

        this.heartContainer =
            document.getElementById("floatingHearts");

        this.heartInterval = null;

    }

    // ==================================================
    // Initialize
    // ==================================================

    initialize() {

        this.startFloatingHearts();

    }

    // ==================================================
    // Floating Hearts
    // ==================================================

    startFloatingHearts() {

        if (!this.heartContainer) return;

        if (this.heartInterval) {

            clearInterval(this.heartInterval);

        }

        this.heartInterval = setInterval(() => {

            this.createHeart();

        }, CONFIG.hearts.interval);

    }

    stopFloatingHearts() {

        if (this.heartInterval) {

            clearInterval(this.heartInterval);

            this.heartInterval = null;

        }

    }

    createHeart() {

        const heart = document.createElement("div");

        heart.className = "heartParticle";

        heart.textContent =
            CONFIG.hearts.emoji;

        // Random horizontal position

        heart.style.left =

            Math.random() * 100 + "%";

        // Random size

        const size =

            CONFIG.hearts.minSize +

            Math.random() *

            (CONFIG.hearts.maxSize - CONFIG.hearts.minSize);

        heart.style.fontSize =

            size + "px";

        // Random speed

        const speed =

            CONFIG.hearts.minSpeed +

            Math.random() *

            (CONFIG.hearts.maxSpeed - CONFIG.hearts.minSpeed);

        heart.style.animationDuration =

            speed + "s";

        // Slight transparency

        const opacity =

            CONFIG.hearts.minOpacity +

            Math.random() *

            (

                CONFIG.hearts.maxOpacity -

                CONFIG.hearts.minOpacity

            );

        heart.style.opacity =
            opacity.toFixed(2);

        // Small rotation

        heart.style.transform =

            `rotate(${Math.random() * 30 - 15}deg)`;

        // Add to page

        this.heartContainer.appendChild(heart);

        // Remove after animation

        heart.addEventListener("animationend", () => {

            heart.remove();

        });

    }

    // ==================================================
    // Sparkles
    // ==================================================

    createSparkle(x, y) {

        const sparkle = document.createElement("div");

        sparkle.className = "sparkle";

        sparkle.textContent = "✨";

        sparkle.style.left = `${x}px`;

        sparkle.style.top = `${y}px`;

        sparkle.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(sparkle);

        sparkle.addEventListener("animationend", () => {

            sparkle.remove();

        });

    }

    // ==================================================
    // Book Glow
    // ==================================================

    flashPageGlow() {

        const glow =
            document.getElementById("pageGlow");

        if (!glow) return;

        glow.classList.remove("pageGlowActive");

        void glow.offsetWidth;

        glow.classList.add("pageGlowActive");

    }

    // ==================================================
    // Bookmark Animation
    // ==================================================

    pulseBookmark() {

        const bookmark =
            document.getElementById("bookmark");

        if (!bookmark) return;

        bookmark.classList.remove("bookmarkPulse");

        void bookmark.offsetWidth;

        bookmark.classList.add("bookmarkPulse");

    }

    revealBookmark(bookmark) {

    if (!bookmark) return;

    const rect = bookmark.getBoundingClientRect();

    // Pop animation
    bookmark.classList.remove("secretBookmarkReveal");
    void bookmark.offsetWidth;
    bookmark.classList.add("secretBookmarkReveal");

    // Sparkles
    for (let i = 0; i < 8; i++) {

        const x =
            rect.left + rect.width / 2 +
            (Math.random() - .5) * 40;

        const y =
            rect.top + rect.height / 2 +
            (Math.random() - .5) * 40;

        this.createSparkle(x, y);

    }

}

    // ==================================================
    // Cleanup
    // ==================================================

    destroy() {

        this.stopFloatingHearts();

    }

}

// ======================================================
// Global Effects Instance
// ======================================================

const effects = new EffectsManager();

// ======================================================
// Public Initializer
// ======================================================

function initializeEffects() {

    effects.initialize();

}