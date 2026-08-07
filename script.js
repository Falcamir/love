// ======================================================
// OUR STORY V4
// script.js
// Main Application
// ======================================================

class StoryApp {

    constructor() {

        // Screens

        this.loadingScreen =
            document.getElementById("loadingScreen");

        this.coverScreen =
            document.getElementById("coverScreen");

        this.storybook =
            document.getElementById("storybook");

        // Cover

        this.bookCover =
            document.getElementById("bookCover");

        this.openButton =
            document.getElementById("openBookButton");

        // Music

        this.music =
            document.getElementById("backgroundMusic");

        this.paperOpenSound =
            document.getElementById("paperOpenSound");

    }

    // ==================================================
    // Initialize
    // ==================================================

    initialize() {

        initializeEffects();

        initializeViewer();

        initializeNavigation();

        this.startLoading();

        this.bindEvents();

    }

    // ==================================================
    // Events
    // ==================================================

    bindEvents() {

        this.openButton?.addEventListener(

            "click",

            () => this.openBook()

        );

    }

    // ==================================================
    // Loading
    // ==================================================

    startLoading() {

        setTimeout(() => {

            this.loadingScreen.classList.remove("active");

            this.loadingScreen.classList.add("hidden");

            this.coverScreen.classList.remove("hidden");

            this.coverScreen.classList.add("active");

        }, CONFIG.loading.duration);

    }

    // ==================================================
    // Open Book
    // ==================================================

    openBook() {

        this.openButton.disabled = true;

        this.openButton.style.pointerEvents = "none";

        navigation.enabled = true;

        // Paper opening sound
        if (this.paperOpenSound) {

            this.paperOpenSound.currentTime = 0;

            this.paperOpenSound.volume =
                CONFIG.sounds.volume;

            this.paperOpenSound.play().catch(() => {});

        }

        this.startMusic();

        this.bookCover.classList.add("openAnimation");

        setTimeout(() => {

            this.storybook.classList.remove("hidden");

            requestAnimationFrame(() => {

                this.storybook.classList.add("active");

            });

        }, CONFIG.book.showStoryDelay);

        setTimeout(() => {

            navigation.goTo(0);

        }, CONFIG.book.firstPageDelay);

        setTimeout(() => {

            this.coverScreen.classList.remove("active");
            this.coverScreen.classList.add("hidden");

        }, CONFIG.book.openSpeed);

    }

    // ==================================================
    // Background Music
    // ==================================================

    startMusic() {

        if (!this.music) return;

        // Prevent multiple fade intervals
        if (this.musicFadeInterval) {
            clearInterval(this.musicFadeInterval);
        }

        let volume = 0;

        this.music.volume = volume;
        this.music.currentTime = 0;

        this.music.play().catch(() => {});

        this.musicFadeInterval = setInterval(() => {

            volume += CONFIG.music.fadeStep;

            if (volume >= CONFIG.music.volume) {

                volume = CONFIG.music.volume;

                clearInterval(this.musicFadeInterval);
                this.musicFadeInterval = null;

            }

            // Safety clamp
            this.music.volume = Math.max(0, Math.min(1, volume));

        }, CONFIG.music.fadeInterval);

    }

    // ==================================================
    // Stop Music (future use)
    // ==================================================

    stopMusic() {

        if (!this.music) return;

        this.music.pause();

        this.music.currentTime = 0;

    }

    // ==================================================
    // Startup Check
    // ==================================================

    verifyElements() {

        const required = [

            this.loadingScreen,

            this.coverScreen,

            this.storybook,

            this.bookCover,

            this.openButton,

            this.music

        ];

        return required.every(Boolean);

    }

}

// ======================================================
// Global App Instance
// ======================================================

const app = new StoryApp();

// ======================================================
// Start Application
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    if (!app.verifyElements()) {

        console.error("Our Story: Missing required HTML elements.");

        return;

    }

    app.initialize();

});

// ======================================================
// Debug (development only)
// ======================================================

window.app = app;
window.renderer = renderer;
window.navigation = navigation;
window.effects = effects;