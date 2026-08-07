// ======================================================
// OUR STORY V4
// viewer.js
// Handles the fullscreen photo viewer
// ======================================================

class PhotoViewer {

    constructor() {

        this.viewer =
            document.getElementById("photoViewer");

        this.image =
            document.getElementById("viewerImage");

        this.startY = 0;

        this.currentY = 0;

        this.dragging = false;

    }

    // ==================================================
    // Initialize
    // ==================================================

    initialize() {

        if (!this.viewer || !this.image) return;

        this.bindEvents();

    }

    // ==================================================
    // Open
    // ==================================================

    open(source) {

        if (!source) return;

        Object.assign(this.image, {

            src: source.src,

            alt: source.alt || "Memory"

        });

        // Photo open sound
        const sound =
            document.getElementById("photoOpenSound");

        if (sound) {

            sound.currentTime = 0;
            sound.volume = CONFIG.sounds.volume;

            sound.play().catch(() => {});

        }

        this.viewer.classList.remove("hidden");

        requestAnimationFrame(() => {

            this.viewer.classList.add("active");

        });

    }

    // ==================================================
    // Events
    // ==================================================

    bindEvents() {

        // Click outside image

        this.viewer.addEventListener("click", (event) => {

            if (event.target === this.viewer) {

                this.close();

            }

        });

        // ESC key

        document.addEventListener("keydown", (event) => {

            if (

                event.key === "Escape" &&

                this.viewer.classList.contains("active")

            ) {

                this.close();

            }

        });

        // Mobile gestures

        this.bindTouchEvents();

    }

    // ==================================================
    // Touch Gestures
    // ==================================================

    bindTouchEvents() {

        this.viewer.addEventListener("touchstart", (event) => {

            this.dragging = true;

            this.startY = event.touches[0].clientY;

            this.currentY = this.startY;

        });

        this.viewer.addEventListener("touchmove", (event) => {

            if (!this.dragging) return;

            this.currentY = event.touches[0].clientY;

            const distance = this.currentY - this.startY;

            if (distance > 0) {

                this.image.style.transform =
                    `translateY(${distance}px) scale(${CONFIG.viewer.swipeScale})`;

            }

        });

        this.viewer.addEventListener("touchend", () => {

            if (!this.dragging) return;

            this.dragging = false;

            const distance = this.currentY - this.startY;

            if (distance >= CONFIG.viewer.swipeCloseDistance) {

                this.close();

            } else {

                this.image.style.transition =
                    `transform ${CONFIG.viewer.resetAnimation}ms ease`

                this.image.style.transform =
                    "translateY(0) scale(1)";

                setTimeout(() => {

                    this.image.style.transition = "";

                }, CONFIG.viewer.resetAnimation);

            }

        });

    }

    // ==================================================
    // Close
    // ==================================================

    close() {

        this.viewer.classList.remove("active");

        this.image.style.transition = "";

        this.image.style.transform = "";

        this.dragging = false;

        setTimeout(() => {

            this.viewer.classList.add("hidden");

            this.image.removeAttribute("src");

            this.image.removeAttribute("alt");

        }, CONFIG.viewer.animationTime);

    }

    // ==================================================
    // Reset
    // ==================================================

    reset() {

        this.dragging = false;

        this.startY = 0;

        this.currentY = 0;

        this.image.style.transition = "";

        this.image.style.transform = "";

    }

    // ==================================================
    // Destroy
    // ==================================================

    destroy() {

        this.reset();

    }

}

// ======================================================
// Global Viewer Instance
// ======================================================

const viewer = new PhotoViewer();

window.viewer = viewer;

// ======================================================
// Public Initializer
// ======================================================

function initializeViewer() {

    viewer.initialize();

}