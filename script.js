const key = document.querySelector(".little-key");
const openingLine = document.querySelector(".opening-line");
const unlockScreen = document.querySelector(".unlock-screen");
const nextScene = document.querySelector(".next-scene");

key.addEventListener("click", () => {
    openingLine.classList.add("fade-out");
    key.classList.add("unlocking");

    setTimeout(() => {
        unlockScreen.classList.add("active");
    }, 700);

    setTimeout(() => {
        nextScene.classList.add("visible");
    }, 1800);
});