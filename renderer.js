// ======================================================
// OUR STORY V4
// renderer.js
// Responsible ONLY for drawing pages
// ======================================================

class StoryRenderer {

    constructor(container) {

        this.container = container;

    }

    async render(pageData, pageIndex = 0, direction = "next") {

        if (!pageData) return;

        return new Promise((resolve) => {

            const oldPage =
                this.container.querySelector(".bookPage");

            if (!oldPage) {

                this.createPage(pageData, pageIndex, direction);

                requestAnimationFrame(resolve);

                return;

            }

            oldPage.classList.remove("pageIn");

            oldPage.classList.add(

                direction === "next"

                ?
                "pageExitNext" :
                "pageExitPrev"

            );

            oldPage.addEventListener("animationend", () => {

                oldPage.remove();

                this.createPage(
                    pageData,
                    pageIndex,
                    direction
                );

                const newPage =
                    this.container.querySelector(".bookPage");

                newPage.addEventListener("animationend", () => {

                    resolve();

                }, {
                    once: true
                });

            }, {
                once: true
            });

        });

    }

    createPage(pageData, pageIndex, direction) {

        const page = document.createElement("div");

        page.className = "bookPage";

        if (direction === "next") {

            page.classList.add("pageEnterNext");

        } else {

            page.classList.add("pageEnterPrev");

        }

        page.dataset.page = pageIndex;

        switch (pageData.type) {

            case "chapter":
                page.appendChild(this.renderChapter(pageData));
                break;

            case "memory":
                page.appendChild(this.renderMemory(pageData));
                break;

            case "blank":
                page.appendChild(this.renderBlank(pageData));
                break;

            case "letter":
                page.appendChild(this.renderLetter(pageData));
                break;

            case "dreams":
                page.appendChild(this.renderDreams(pageData));
                break;

            case "ending":
                page.appendChild(this.renderEnding(pageData));
                break;

        }

        this.addFooter(page, pageIndex);

        this.container.appendChild(page);

        this.bindEvents(page);

    }

    // ==================================================
    // Chapter Page
    // ==================================================

    renderChapter(data) {

        const wrapper = document.createElement("div");

        wrapper.className = "chapterPage pageContent";

        wrapper.innerHTML = `

            <div class="pageIcon">

                ${data.icon}

            </div>

            <div class="pageChapter">

                ${data.title}

            </div>

            <h1 class="pageTitle">

                ${data.subtitle}

            </h1>

            <p class="pageQuote">

                ${data.quote}

            </p>

        `;

        return wrapper;

    }

    // ==================================================
    // Memory Page
    // ==================================================

    renderMemory(data) {

        const wrapper = document.createElement("div");

        wrapper.className = "memoryPage pageContent";

        const rotation =
            Math.floor(
                Math.random() *
                (CONFIG.photo.rotation.max - CONFIG.photo.rotation.min + 1)
            ) + CONFIG.photo.rotation.min;

        const offsetX =
            Math.floor(
                Math.random() *
                (CONFIG.photo.offsetX.max - CONFIG.photo.offsetX.min + 1)
            ) + CONFIG.photo.offsetX.min;

        const offsetY =
            Math.floor(
                Math.random() *
                (CONFIG.photo.offsetY.max - CONFIG.photo.offsetY.min + 1)
            ) + CONFIG.photo.offsetY.min;

        wrapper.innerHTML = `

            <div class="polaroid"

                 style="
                    width:${CONFIG.photo.width}px;
                    height:${CONFIG.photo.height}px;
                    padding:${CONFIG.photo.padding}px;
                    transform:
                    rotate(${rotation}deg)
                    translate(${offsetX}px, ${offsetY}px);
                 ">

                <img
                    class="memoryImage"
                    src="${data.image}"
                    alt="${data.caption}">

            </div>

            <h2 class="memoryCaption">

                ${data.caption}

            </h2>

            <p class="memoryText">

                ${data.text}

            </p>

            ${data.note ? `

                <p class="memoryNote">

                    ${data.note}

                </p>

            ` : ""}

        `;

        return wrapper;

    }

    // ==================================================
    // Blank Future Page
    // ==================================================

    renderBlank(data) {

        const wrapper = document.createElement("div");

        wrapper.className = "blankPage pageContent";

        wrapper.innerHTML = `

            <h1 class="pageTitle">

                ${data.title}

            </h1>

            <p class="memoryText">

                ${data.text}

            </p>

        `;

        return wrapper;

    }

    // ==================================================
    // Letter Page
    // ==================================================

    renderLetter(data) {

        const wrapper = document.createElement("div");

        wrapper.className = "letterPage pageContent";

        wrapper.innerHTML = `

            <h1 class="letterTitle">

                ${data.title}

            </h1>

            <div class="letterContent">

                ${data.text.replace(/\n/g, "<br>")}

            </div>

        `;

        return wrapper;

    }

    // ==================================================
    // Dreams Page
    // ==================================================

    renderDreams(data) {

        const wrapper = document.createElement("div");

        wrapper.className = "dreamsPage pageContent";

        const dreams = (data.dreams || [])
            .map(dream => `
                <div class="dreamItem">
                    <span>${dream}</span>
                </div>
            `)
            .join("");

        wrapper.innerHTML = `

            <h1 class="pageTitle">

                ${data.title}

            </h1>

            <div class="dreamList">

                ${dreams}

            </div>

        `;

        return wrapper;

    }

    // ==================================================
    // Ending Page
    // ==================================================

    renderEnding(data) {

        const wrapper = document.createElement("div");

        wrapper.className = "endingPage pageContent";

        wrapper.innerHTML = `

            <div class="endingHeart">

                💛

            </div>

            <h1 class="pageTitle">

                ${data.title}

            </h1>

            <p class="memoryText">

                ${data.text}

            </p>

        `;

        return wrapper;

    }

    // ==================================================
    // Footer
    // ==================================================

    addFooter(page, pageIndex) {

        const footer = document.createElement("div");

        footer.className = "pageFooter";

        const chapter = navigation.getCurrentChapterInfo();

        footer.innerHTML = `

        <span class="footerLine"></span>

        <span class="footerChapter">

            ${chapter.icon}
            ${chapter.title}

        </span>

        <span class="footerDivider">

            •

        </span>

        <span class="footerNumber">

            ${chapter.page} / ${chapter.total}

        </span>

        <span class="footerLine"></span>

    `;

        if (STORY[pageIndex].hidden) {

            footer.style.display = "none";

        }

        page.appendChild(footer);

    }

    // ==================================================
    // Page Events
    // ==================================================

    bindEvents(page) {

        page
            .querySelectorAll(".memoryImage")
            .forEach(image => {

                image.addEventListener("click", () => {

                    if (window.viewer) {

                        window.viewer.open(image);

                    }

                });

            });

    }

    // ==================================================
    // Page Animations
    // ==================================================

    animateNext() {

        const page =
            this.container.querySelector(".bookPage");

        if (!page) return;

        page.classList.remove("pageIn");

        page.classList.add("pageOutLeft");

    }

    animatePrevious() {

        const page =
            this.container.querySelector(".bookPage");

        if (!page) return;

        page.classList.remove("pageIn");

        page.classList.add("pageOutRight");

    }

}

// ======================================================
// Renderer Instance
// ======================================================

const pageContainer =
    document.getElementById("pageContainer");

const renderer =
    new StoryRenderer(pageContainer);