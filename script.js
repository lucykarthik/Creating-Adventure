
const key = document.querySelector(".little-key");
const openingLine = document.querySelector(".opening-line");
const unlockScreen = document.querySelector(".unlock-screen");
const nextScene = document.querySelector(".next-scene");
const goldenLight = document.querySelector(".golden-light");

key.addEventListener("click", () => {
    openingLine.classList.add("fade-out");
    key.classList.add("unlocking");

    setTimeout(() => unlockScreen.classList.add("active"), 700);
    setTimeout(() => goldenLight.classList.add("active"), 1800);

    setTimeout(() => {
        goldenLight.classList.add("fade-out");
        nextScene.classList.add("visible");
    }, 4800);
});

const continueHint = document.querySelector(".continue-hint");
const discoveryScene = document.querySelector(".discovery-scene");

continueHint.addEventListener("click", () => {
    nextScene.classList.remove("visible");
    nextScene.style.display = "none";
    discoveryScene.classList.add("visible");
});

const discoveryHint = document.querySelector(".discovery-hint");
const wishScene = document.querySelector(".wish-scene");
const wishCandle = document.querySelector(".wish-candle");
const wishHint = document.querySelector(".wish-hint");

discoveryHint.addEventListener("click", () => {
    discoveryScene.classList.remove("visible");
    discoveryScene.style.display = "none";
    wishScene.classList.add("visible");
});

function lightCandle() {
    if (wishScene.classList.contains("lit")) return;

    wishScene.classList.add("lit");
    wishHint.textContent = "Make a wish";
}

wishCandle.addEventListener("click", lightCandle);

wishCandle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        lightCandle();
    }
});

wishHint.addEventListener("click", () => {
    if (!wishScene.classList.contains("lit")) {
        lightCandle();
        return;
    }

    if (wishScene.classList.contains("released")) return;

    wishScene.classList.add("released");
    wishStarPosition();
    wishHint.textContent = "Wish released";

    setTimeout(() => {
        wishScene.classList.add("gathering");
    }, 1300);
});

function wishStarPosition() {
    const star = document.querySelector(".wish-star");
    const starRect = star.getBoundingClientRect();
    const sceneRect = wishScene.getBoundingClientRect();

    const centerX = starRect.left - sceneRect.left + starRect.width / 2;
    const centerY = starRect.top - sceneRect.top + starRect.height / 2;

    for (let i = 0; i < 16; i++) {
        const particle = document.createElement("span");

        particle.className = "wish-particle";
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
        particle.style.setProperty("--rise", `${-40 - Math.random() * 160}px`);
        particle.style.animationDelay = `${Math.random() * 0.5}s`;

        wishScene.appendChild(particle);

        particle.addEventListener("animationend", () => {
            particle.remove();
        });
    }

    const core = document.createElement("div");
    core.className = "wish-core";
    core.style.left = `${centerX}px`;
    core.style.top = `${centerY - 160}px`;
    wishScene.appendChild(core);

    setTimeout(() => {
        core.classList.add("gathered");
    }, 1300);
}
