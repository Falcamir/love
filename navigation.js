// ======================================================
// OUR STORY V4
// navigation.js
// Handles page navigation only
// ======================================================

const NAVIGATION = {

    USER: "user",

    AUTO: "auto"

};

class BookNavigation {

    constructor() {

        this.currentPage = 0;

        this.book =
            document.getElementById("book");

        this.pageContainer =
            document.getElementById("pageContainer");

        this.startX = 0;

        this.currentX = 0;

        this.dragging = false;

        this.secretAttempts = 0;

        this.secretUnlockAttempts =
            CONFIG.navigation.secretUnlockAttempts;

        this.turning = false;

        this.revealingSecret = false;

        this.enabled = false;

        this.bookmarkNavigation = false;

        this.activePageSounds = 0;

        this.secretUnlocked = false;

        this.secretBookmarkAnimated = false;

    }

    // ==================================================
    // Initialize
    // ==================================================

    initialize() {

        this.bindKeyboard();

        this.bindSwipe();

        this.bindTapZones();

        this.updateBookmarks();

    }

    // ==================================================
    // Render
    // ==================================================

    async renderCurrentPage(direction = "next") {

        await renderer.render(

            STORY[this.currentPage],

            this.currentPage,

            direction

        );

        this.updateBookmarks();

        this.updateChapterMusic();

    }

    async turn(direction = "next") {

        if (this.turning) {
            return "busy";
        }

        this.turning = true;

        if (direction === "next") {

            if (this.currentPage >= STORY.length - 1) {

                this.turning = false;
                return "edge";

            }

            this.currentPage++;

        } else {

            if (this.currentPage <= 0) {

                this.turning = false;
                return "edge";

            }

            this.currentPage--;

        }

        // Play the page sound immediately when the turn begins.
        this.playPageSound();

        await this.renderCurrentPage(direction);

        effects.flashPageGlow();

        this.turning = false;

        return "success";

    }

    // ==================================================
    // Navigation
    // ==================================================

    playEdgeSound() {

        const sound =
            document.getElementById("edgeSound");

        if (!sound) return;

        sound.currentTime = 0;
        sound.volume = CONFIG.sounds.volume;

        sound.play().catch(() => {});

    }

    // ==================================================
    // Secret Ending
    // ==================================================

    isAtVisibleEnding() {

        return (
            this.currentPage === STORY.findIndex(page =>
                page.id === "ending"
            )
        );

    }

    isAtSecretEnding() {

        return (
            this.currentPage === STORY.length - 1 &&
            STORY[this.currentPage]?.hidden
        );

    }

    // ==================================================
    // Secret Chapter Detection
    // ==================================================

    isInSecretChapter() {

        let index = this.currentPage;

        // Find the chapter this page belongs to
        while (index >= 0) {

            if (STORY[index].type === "chapter") {

                return STORY[index].hidden === true;

            }

            index--;

        }

        return false;

    }

    // ==================================================
    // Music Crossfade
    // ==================================================

    async crossfadeMusic(from, to, targetVolume) {

        if (!from || !to) return;

        // Stop any previous fade running on these tracks
        if (from._fadeInterval) {
            clearInterval(from._fadeInterval);
            from._fadeInterval = null;
        }

        if (to._fadeInterval) {
            clearInterval(to._fadeInterval);
            to._fadeInterval = null;
        }

        const duration =
            CONFIG.music.fadeDuration;

        const interval =
            CONFIG.music.fadeInterval;

        const steps =
            Math.max(1, Math.floor(duration / interval));

        const startVolume =
            from.volume;

        // Make sure the destination is ready
        to.volume = 0;

        to.currentTime = 0;

        to.play().catch(() => {});

        let step = 0;

        return new Promise(resolve => {

            const fade = setInterval(() => {

                step++;

                const progress =
                    Math.min(step / steps, 1);

                // Smooth ease
                const eased =
                    progress * progress *
                    (3 - 2 * progress);

                from.volume =
                    Math.max(
                        0,
                        startVolume * (1 - eased)
                    );

                to.volume =
                    Math.min(
                        targetVolume,
                        targetVolume * eased
                    );

                if (progress >= 1) {

                    clearInterval(fade);

                    from.pause();

                    from.currentTime = 0;

                    from.volume = 0;

                    to.volume = targetVolume;

                    resolve();

                }

            }, interval);

            from._fadeInterval = fade;

        });

    }

    // ==================================================
    // Chapter Music
    // ==================================================

    async updateChapterMusic() {

        const mainMusic =
            document.getElementById("backgroundMusic");

        const proposalMusic =
            document.getElementById("proposalMusic");

        if (!mainMusic || !proposalMusic) return;

        const inSecretChapter =
            this.isInSecretChapter();

        // ==============================================
        // SECRET / PROPOSAL CHAPTER
        // ==============================================

        if (inSecretChapter) {

            // Already using proposal music
            if (!proposalMusic.paused) {
                return;
            }

            await this.crossfadeMusic(
                mainMusic,
                proposalMusic,
                CONFIG.music.proposalVolume
            );

            return;

        }

        // ==============================================
        // NORMAL STORY
        // ==============================================

        // Already using main music
        if (!mainMusic.paused) {
            return;
        }

        await this.crossfadeMusic(
            proposalMusic,
            mainMusic,
            CONFIG.music.volume
        );

    }
    // ==================================================
    // Secret Unlock Sequence
    // ==================================================

    async revealSecretChapter() {

        if (this.revealingSecret) return;

        this.revealingSecret = true;

        // Prevent spamming
        this.secretAttempts = 0;

        // Small dramatic pause
        await new Promise(resolve =>
            setTimeout(
                resolve,
                CONFIG.secret.startDelay
            )
        );

        // Lower music
        const music =
            document.getElementById("backgroundMusic");

        if (music) {

            music.dataset.previousVolume = music.volume;

            music.volume *=
                CONFIG.music.duckMultiplier;

        }

        // Play unlock sound
        const unlock =
            document.getElementById("secretUnlockSound");

        if (unlock) {

            unlock.currentTime = 0;

            unlock.volume = CONFIG.sounds.volume;

            unlock.play().catch(() => {});

        }

        // Small pause before page turns
        await new Promise(resolve =>
            setTimeout(
                resolve,
                CONFIG.secret.soundDelay
            )
        );

        this.book.classList.add("secretReveal");

        await new Promise(resolve =>
            setTimeout(
                resolve,
                CONFIG.secret.revealDuration
            )
        );

        this.book.classList.remove("secretReveal");

        // Go to first hidden page
        this.secretUnlocked = true;
        this.currentPage++;

        await this.renderCurrentPage("next");

        this.revealingSecret = false;

    }

    async performNext(mode = NAVIGATION.USER) {

        // ==========================================
        // Secret already unlocked
        // Allow bookmark navigation to pass through
        // the visible ending normally.
        // ==========================================

        if (
            mode === NAVIGATION.AUTO &&
            this.isAtVisibleEnding() &&
            this.secretUnlocked
        ) {

            const result = await this.turn("next");

            return result;

        }

        // ==========================================
        // Secret not unlocked
        // The visible ending remains a dead end
        // during automatic bookmark navigation.
        // ==========================================

        if (
            mode === NAVIGATION.AUTO &&
            this.isAtVisibleEnding()
        ) {

            this.edgeBounce();

            this.playEdgeSound();

            return "edge";

        }

        // ==========================================
        // Normal navigation
        // ==========================================

        const result = await this.turn("next");

        if (result === "edge") {

            this.edgeBounce();

            this.playEdgeSound();

        }

        return result;

    }

    async performPrevious() {

        const result = await this.turn("prev");

        if (result === "edge") {

            this.edgeBounce();

            this.playEdgeSound();

        }

    }

    async next() {

        if (!this.enabled) return;

        // Secret ending is the true end of the book.
        if (this.isAtSecretEnding()) {
            return;
        }

        // ==========================================
        // Secret ending logic
        // ==========================================

        if (this.isAtVisibleEnding()) {

            // Already unlocked?
            if (this.secretUnlocked) {

                await this.performNext(NAVIGATION.USER);

                return;

            }

            this.secretAttempts++;

            if (this.secretAttempts === 3) {

                effects.flashPageGlow();

            }

            if (this.secretAttempts < this.secretUnlockAttempts) {

                this.playSecretAttemptAnimation();

                this.playEdgeSound();

                return;

            }

            await this.revealSecretChapter();

            return;

        }

        this.secretAttempts = 0;

        await this.performNext(NAVIGATION.USER);

    }

    async previous() {

        if (!this.enabled) return;

        this.secretAttempts = 0;

        await this.performPrevious();

    }


    async goTo(index) {

        if (

            index < 0 ||

            index >= STORY.length

        ) {

            return;

        }

        const direction =

            index > this.currentPage

            ?
            "next"

            :
            "prev";

        this.currentPage = index;

        this.secretAttempts = 0;

        await this.renderCurrentPage(direction);

    }

    // ==================================================
    // Animated Chapter Jump
    // ==================================================

    async goToAnimated(targetPage) {

        if (!this.enabled) return;

        if (
            targetPage < 0 ||
            targetPage >= STORY.length ||
            targetPage === this.currentPage
        ) {
            return;
        }

        if (this.bookmarkNavigation) return;

        this.bookmarkNavigation = true;

        const bookmarks =
            document.getElementById("chapterBookmarks");

        if (bookmarks) {
            bookmarks.style.pointerEvents = "none";
        }

        try {

            const direction =
                targetPage > this.currentPage ?
                "next" :
                "prev";

            const skippingLockedEnding =
                this.secretUnlocked &&
                targetPage > this.currentPage &&
                STORY[targetPage]?.hidden;

            while (this.currentPage !== targetPage) {

                if (direction === "next") {

                    await this.performNext(NAVIGATION.AUTO);

                } else {

                    await this.performPrevious();

                }

                await new Promise(resolve =>
                    setTimeout(resolve, 40)
                );

            }

        } finally {

            this.bookmarkNavigation = false;

            if (bookmarks) {
                bookmarks.style.pointerEvents = "";
            }

        }

    }

    // ==================================================
    // Keyboard
    // ==================================================

    bindKeyboard() {

        document.addEventListener("keydown", (event) => {

            if (event.repeat) return;

            switch (event.key) {

                case "ArrowRight":
                    this.next();
                    break;

                case "ArrowLeft":
                    this.previous();
                    break;

            }

        });

    }

    // ==================================================
    // Swipe Navigation
    // ==================================================

    bindSwipe() {

        this.book.addEventListener("touchstart", (event) => {

            this.dragging = true;

            this.startX = event.touches[0].clientX;

            this.currentX = this.startX;

        });

        this.book.addEventListener("touchmove", (event) => {

            if (!this.dragging) return;

            this.currentX = event.touches[0].clientX;

        });

        this.book.addEventListener("touchend", () => {

            if (!this.dragging) return;

            this.dragging = false;

            const distance =

                this.currentX - this.startX;

            if (

                Math.abs(distance)

                <
                CONFIG.book.swipeThreshold

            ) {

                return;

            }

            if (distance < 0) {

                this.next();

            } else {

                this.previous();

            }

        });

    }

    // ==================================================
    // Tap Zones
    // ==================================================

    bindTapZones() {

        this.pageContainer.addEventListener("click", (event) => {

            if (

                event.target.closest(".memoryImage")

            ) {

                return;

            }

            const width =

                window.innerWidth;

            if (

                event.clientX < width * CONFIG.navigation.tapZoneLeft

            ) {

                this.previous();

            } else if (

                event.clientX > width * CONFIG.navigation.tapZoneRight

            ) {

                this.next();

            }

        });

    }

    // ==================================================
    // Edge Bounce
    // ==================================================

    edgeBounce() {

        const wrapper =
            document.getElementById("bookWrapper");

        if (!wrapper) return;

        wrapper.classList.remove("edgeBounce");

        void wrapper.offsetWidth;

        wrapper.classList.add("edgeBounce");

    }

    // ==================================================
    // Secret Failed Attempt Animation
    // ==================================================

    playSecretAttemptAnimation() {

        const book =
            document.getElementById("bookWrapper");

        if (!book) return;

        const animations = {

            1: "secretShake1",

            2: "secretShake2",

            3: "edgeBounce",

            4: "secretShake4"

        };

        const animation =
            animations[this.secretAttempts];

        if (!animation) return;

        book.classList.remove(

            "secretShake1",

            "secretShake2",

            "edgeBounce",

            "secretShake4"

        );

        void book.offsetWidth;

        book.classList.add(animation);

    }

    // ==================================================
    // Page Turn Sound
    // ==================================================

    playPageSound() {

        const base = document.getElementById("pageTurnSound");

        if (!base) return;

        if (this.activePageSounds >= CONFIG.sounds.maxSimultaneous) {
            return;
        }

        const sound = new Audio(base.currentSrc || base.src);

        sound.volume = CONFIG.sounds.volume;

        this.activePageSounds++;

        sound.onended = () => {
            this.activePageSounds--;
        };

        sound.play().catch(() => {
            this.activePageSounds--;
        });

    }

    // ==================================================
    // Chapter Bookmarks
    // ==================================================

    updateBookmarks() {

        const container =
            document.getElementById("chapterBookmarks");

        if (!container) return;

        container.classList.remove("hiddenBookmarks");

        container.innerHTML = "";

        let currentChapter = null;

        for (let i = this.currentPage; i >= 0; i--) {

            if (
                STORY[i].type === "chapter" ||
                STORY[i].id === "proposalIntro"
            ) {

                currentChapter =
                    STORY[i].id === "proposalIntro" ?
                    "proposal" :
                    STORY[i].id;

                break;

            }

        }

        const chapters = STORY.filter(page =>

            page.type === "chapter" &&
            (!page.hidden || this.secretUnlocked)

        );

        chapters.forEach(chapter => {

            const ribbon =
                document.createElement("div");

            ribbon.className = "chapterBookmark";

            if (chapter.hidden) {

                ribbon.classList.add("secretBookmark");

            }

            ribbon.textContent = chapter.icon;

            ribbon.dataset.chapter = chapter.id;

            ribbon.addEventListener("click", () => {

                const index = STORY.findIndex(page =>
                    page.id === chapter.id
                );

                if (index !== -1) {

                    const sound =
                        document.getElementById("bookmarkSound");

                    if (sound) {

                        sound.currentTime = 0;
                        sound.volume = CONFIG.sounds.volume;

                        sound.play().catch(() => {});

                    }

                    this.goToAnimated(index);

                }

            });

            if (chapter.id === currentChapter) {

                ribbon.classList.add("active");

            }

            container.appendChild(ribbon);

            if (
                this.secretUnlocked &&
                chapter.hidden &&
                !this.secretBookmarkAnimated
            ) {

                this.secretBookmarkAnimated = true;

                requestAnimationFrame(() => {

                    effects.revealBookmark(ribbon);

                });

            }

        });

    }

    // ==================================================
    // Current Chapter Info
    // ==================================================

    getCurrentChapterInfo() {

        // If we're on a hidden page,
        // pretend we're still on the last visible page.
        let currentIndex = this.currentPage;

        while (
            currentIndex > 0 &&
            STORY[currentIndex].hidden
        ) {
            currentIndex--;
        }

        // Find the current chapter.
        let chapterIndex = 0;

        for (let i = currentIndex; i >= 0; i--) {

            if (STORY[i].type === "chapter") {

                chapterIndex = i;
                break;

            }

        }

        const chapter = STORY[chapterIndex];

        // Count visible pages only.
        let totalPages = 1;

        for (let i = chapterIndex + 1; i < STORY.length; i++) {

            if (STORY[i].type === "chapter") break;

            if (STORY[i].hidden) continue;

            totalPages++;

        }

        // Current page inside chapter (visible pages only).
        let pageInChapter = 1;

        for (let i = chapterIndex + 1; i <= currentIndex; i++) {

            if (STORY[i].hidden) continue;

            pageInChapter++;

        }

        return {

            icon: chapter.icon,

            title: chapter.subtitle,

            page: pageInChapter,

            total: totalPages

        };

    }

    // ==================================================
    // Cleanup
    // ==================================================

    destroy() {

        this.dragging = false;
        this.turning = false;

    }

}

// ======================================================
// Global Navigation Instance
// ======================================================

const navigation = new BookNavigation();

// ======================================================
// Public Initializer
// ======================================================

function initializeNavigation() {

    navigation.initialize();

}