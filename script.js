// --- Cinematic Soundtrack Audio Engine ---
const audioTracks = {
    track1: document.getElementById("audio-track-1"), // Track 1 - Possession
    track2: document.getElementById("audio-track-2"), // Track 2 - Time won't change
    soulmate: document.getElementById("audio-track-soulmate"), // Soulmate - Centerpiece Card
    track3: document.getElementById("audio-track-3"), // Track 3 - Lost letters (Envelope & Letter)
    track4: document.getElementById("audio-track-4")  // Track 4 - Enchanting (Credits)
};
if (audioTracks.track4) audioTracks.track4.loop = false;

const audioToggleBtn = document.getElementById("audio-toggle");
const TARGET_VOLUME = 0.65;

// --- Ambient Acoustic Foley Sound Engine (Web Audio API) ---
// Isolated master gain at -20dB: Subtle organic textures that NEVER disturb the music
class FoleyAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
    }

    init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.11; // Ultra-quiet background level
        this.masterGain.connect(this.ctx.destination);
    }

    resume() {
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    // 1. Gentle Key Turn (faint metallic lock tumbler click & harmonic ring)
    playKeyClick() {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(1150, now);
        osc1.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        gain1.gain.setValueAtTime(0.14, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 0.08);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1760, now + 0.02);
        gain2.gain.setValueAtTime(0.06, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.02);
        osc2.stop(now + 0.28);
    }

    // 2. Soft Match Strike & Flame Breath (warm friction + flame catch)
    playMatchStrike() {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1400;
        filter.Q.value = 1.8;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(now);

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.38);
        oscGain.gain.setValueAtTime(0.09, now + 0.04);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start(now + 0.04);
        osc.stop(now + 0.38);
    }

    // 3. Flame Breath / Lantern Catch
    playFlameCatch() {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.45);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
    }

    // 4. Wax Seal Break & Paper Slide (crisp snap & rustle)
    playSealSnap() {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);
        oscGain.gain.setValueAtTime(0.14, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.07);

        const bufferSize = this.ctx.sampleRate * 0.28;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / bufferSize));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 650;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now + 0.03);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(now + 0.03);
    }

    // 5. Birthday Party Popper & Streamer Blast (gentle tactile pop & silk whoosh)
    playStreamerBlast() {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
    }
}
const foleyAudio = new FoleyAudioEngine();

let currentTrackKey = null;
let isMuted = false;
let audioStarted = false;
let fadeRafId = null;

function setTrackVolume(track, vol) {
    if (!track) return;
    try {
        track.volume = Math.max(0, Math.min(1, vol));
    } catch (e) {}
}

function playTrackSafely(track) {
    if (!track) return Promise.resolve();
    track.muted = isMuted;
    try {
        const p = track.play();
        if (p !== undefined) {
            return p.catch((err) => {
                console.warn("Audio play deferred to next user gesture:", err);
                throw err;
            });
        }
    } catch (err) {
        return Promise.reject(err);
    }
    return Promise.resolve();
}

function stopAndResetTrack(track) {
    if (!track) return;
    try {
        track.pause();
        track.currentTime = 0;
        setTrackVolume(track, 0);
    } catch (e) {}
}

function stopAllOtherTracks(exceptKey) {
    Object.entries(audioTracks).forEach(([key, track]) => {
        if (key !== exceptKey && track) {
            stopAndResetTrack(track);
        }
    });
}

function primeAllTracks() {
    Object.values(audioTracks).forEach((t) => {
        if (!t) return;
        try {
            t.load();
        } catch (e) {}
    });
}

function primeUpcomingTracks(currentKey) {
    const nextOrder = {
        track1: ["track2", "soulmate"],
        track2: ["soulmate", "track3"],
        soulmate: ["track3", "track4"],
        track3: ["track4"],
        track4: []
    };
    const toPreload = nextOrder[currentKey] || [];
    toPreload.forEach((k) => {
        const tr = audioTracks[k];
        if (tr && tr.readyState < 2) {
            try {
                tr.load();
            } catch (e) {}
        }
    });
}

// Auto-recovery listeners on all audio tracks to prevent buffer stalls & crashes
Object.entries(audioTracks).forEach(([key, track]) => {
    if (!track) return;
    track.addEventListener("playing", () => {
        if (!isMuted && key === currentTrackKey && !fadeRafId) {
            setTrackVolume(track, TARGET_VOLUME);
        }
    });
    track.addEventListener("error", (e) => {
        console.warn(`Audio track ${key} error encountered, attempting recovery:`, e);
        try {
            track.load();
        } catch (err) {}
    });
});

function crossfadeTo(targetKey, duration = 1800) {
    const newTrack = audioTracks[targetKey];
    if (!newTrack) return;

    // Ahead-of-time buffer prime for upcoming tracks
    primeUpcomingTracks(targetKey);

    // If target track is already playing, ensure all other tracks are stopped
    if (targetKey === currentTrackKey && !newTrack.paused) {
        stopAllOtherTracks(targetKey);
        return;
    }

    // Cancel any in-flight crossfade RAF immediately
    if (fadeRafId) {
        cancelAnimationFrame(fadeRafId);
        fadeRafId = null;
    }

    const oldKey = currentTrackKey;
    const oldTrack = (oldKey && oldKey !== targetKey) ? audioTracks[oldKey] : null;
    currentTrackKey = targetKey;

    // Immediately stop and silence any stray tracks that are neither target nor oldTrack
    Object.entries(audioTracks).forEach(([key, track]) => {
        if (key !== targetKey && key !== oldKey && track) {
            stopAndResetTrack(track);
        }
    });

    const targetVol = isMuted ? 0 : TARGET_VOLUME;

    // Initial track startup: start immediately at target volume
    if (!oldTrack || oldTrack.paused) {
        if (oldTrack) stopAndResetTrack(oldTrack);
        setTrackVolume(newTrack, targetVol);
        audioStarted = true;
        removeUnlockListeners();
        playTrackSafely(newTrack).catch(() => {});
        return;
    }

    // Crossfading between an active old track and a new track
    setTrackVolume(newTrack, 0);

    let fadeStarted = false;
    const startFadeRamp = () => {
        if (fadeStarted) return;
        fadeStarted = true;

        const startTime = performance.now();
        const startOldVol = oldTrack.volume > 0 ? oldTrack.volume : targetVol;

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);

            if (oldTrack) {
                setTrackVolume(oldTrack, Math.max(0, startOldVol * (1 - progress)));
            }
            setTrackVolume(newTrack, Math.min(targetVol, targetVol * progress));

            if (progress < 1) {
                fadeRafId = requestAnimationFrame(tick);
            } else {
                fadeRafId = null;
                // Full crossfade completed: cleanly stop and reset old track
                stopAllOtherTracks(targetKey);
                setTrackVolume(newTrack, targetVol);
            }
        };
        fadeRafId = requestAnimationFrame(tick);
    };

    // Begin playing new track. When audio frames actually begin outputting, run the crossfade ramp!
    playTrackSafely(newTrack).then(() => {
        audioStarted = true;
        removeUnlockListeners();
        if (newTrack.currentTime > 0 || newTrack.readyState >= 3) {
            startFadeRamp();
        } else {
            const onPlayConfirmed = () => {
                newTrack.removeEventListener("playing", onPlayConfirmed);
                newTrack.removeEventListener("timeupdate", onPlayConfirmed);
                startFadeRamp();
            };
            newTrack.addEventListener("playing", onPlayConfirmed, { once: true });
            newTrack.addEventListener("timeupdate", onPlayConfirmed, { once: true });
            setTimeout(startFadeRamp, 500);
        }
    }).catch(() => {
        // If play deferred, keep oldTrack playing steadily at target volume
        if (oldTrack && !oldTrack.paused) {
            setTrackVolume(oldTrack, targetVol);
        }
    });
}

function removeUnlockListeners() {
    ["click", "touchend", "keydown"].forEach((evt) => {
        document.removeEventListener(evt, unlockInitialAudio, { passive: true });
    });
}

function startInitialAudio() {
    audioStarted = true;
    removeUnlockListeners();
    primeAllTracks();
    const t1 = audioTracks.track1;
    if (!t1) return;
    crossfadeTo("track1");
}

// User gestures on mobile: guaranteed to run at most ONCE on initial user interaction
function unlockInitialAudio() {
    if (audioStarted) {
        removeUnlockListeners();
        return;
    }
    audioStarted = true;
    removeUnlockListeners();
    primeAllTracks();
    startInitialAudio();
}

["click", "touchend", "keydown"].forEach((evt) => {
    document.addEventListener(evt, unlockInitialAudio, { passive: true });
});


// --- Mobile Tactile Haptic Vibration Engine ---
function triggerHaptic(type = "light") {
    if (typeof navigator === "undefined" || !navigator.vibrate) return;
    try {
        if (type === "light") {
            navigator.vibrate(20);
        } else if (type === "medium") {
            navigator.vibrate(45);
        } else if (type === "heavy") {
            navigator.vibrate([40, 50, 40]);
        } else if (type === "success") {
            navigator.vibrate([25, 40, 30, 45, 60]);
        }
    } catch (e) {
        // Silently continue on unsupported devices
    }
}

// --- Interactive Ambient Touch Stardust ---
let lastTouchSparkTime = 0;
function spawnTouchSpark(x, y) {
    const now = Date.now();
    if (now - lastTouchSparkTime < 70) return;
    lastTouchSparkTime = now;

    const spark = document.createElement("span");
    spark.className = "touch-spark";
    const colors = ["#ffd97a", "#ff2a8d", "#00d4ff", "#ffffff", "#ffeaa7"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 3 + Math.random() * 4;
    const driftX = (Math.random() - 0.5) * 36;
    const driftY = -25 - Math.random() * 35;

    spark.style.setProperty("--tx", `${x}px`);
    spark.style.setProperty("--ty", `${y}px`);
    spark.style.setProperty("--tdx", `${driftX}px`);
    spark.style.setProperty("--tdy", `${driftY}px`);
    spark.style.setProperty("--tc", color);
    spark.style.setProperty("--ts", `${size}px`);

    document.body.appendChild(spark);
    setTimeout(() => {
        spark.remove();
    }, 750);
}

document.addEventListener("pointerdown", (e) => {
    spawnTouchSpark(e.clientX, e.clientY);
}, { passive: true });

// Pointermove spark churn removed: only intentional taps generate sparks, saving 100% of GPU scroll performance

if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!audioStarted) {
            startInitialAudio();
        }
        isMuted = !isMuted;
        audioToggleBtn.classList.toggle("muted", isMuted);
        audioToggleBtn.setAttribute("aria-label", isMuted ? "Unmute background music" : "Mute background music");

        Object.values(audioTracks).forEach((t) => {
            if (t) {
                t.muted = isMuted;
                setTrackVolume(t, isMuted ? 0 : TARGET_VOLUME);
            }
        });
    });
}


const key = document.querySelector(".little-key");
const openingLine = document.querySelector(".opening-line");
const unlockScreen = document.querySelector(".unlock-screen");
const nextScene = document.querySelector(".next-scene");
const goldenLight = document.querySelector(".golden-light");

key.addEventListener("click", () => {
    triggerHaptic("medium");
    primeAllTracks();
    const lightHint = document.querySelector(".key-light-hint");
    if (lightHint) {
        lightHint.style.opacity = "0";
        lightHint.style.transition = "opacity 0.4s ease";
        setTimeout(() => lightHint.remove(), 400);
    }
    const keyCue = document.querySelector(".key-guidance-cue");
    if (keyCue) {
        keyCue.style.opacity = "0";
        setTimeout(() => keyCue.remove(), 400);
    }

    // Direct, guaranteed Track 1 - Possession playback on Golden Key user click
    audioStarted = true;
    currentTrackKey = "track1";
    removeUnlockListeners();
    if (audioTracks.track1) {
        audioTracks.track1.muted = isMuted;
        setTrackVolume(audioTracks.track1, isMuted ? 0 : TARGET_VOLUME);
        audioTracks.track1.play().catch((err) => {
            console.warn("Key click audio play deferred:", err);
        });
    } else {
        startInitialAudio();
    }
    openingLine.classList.add("fade-out");
    const audioCue = document.querySelector(".opening-audio-cue");
    if (audioCue) {
        audioCue.classList.add("fade-out");
        setTimeout(() => audioCue.remove(), 800);
    }
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
    triggerHaptic("light");
    if (!audioStarted) {
        startInitialAudio();
    }
    nextScene.classList.remove("visible");
    discoveryScene.classList.add("visible");
});

const discoveryHint = document.querySelector(".discovery-hint");
const wishScene = document.querySelector(".wish-scene");
const wishCandle = document.querySelector(".wish-candle");
const wishHint = document.querySelector(".wish-hint");
const wishPortal = document.querySelector(".wish-portal");
const memoryScene = document.querySelector(".memory-scene");

// Walk elements placed in global scope early to guarantee availability
const walkLantern = document.querySelector(".walk-lantern");
const vignetteCards = document.querySelectorAll(".vignette-card");
const stepDots = document.querySelectorAll(".step-dot");
const walkControls = document.querySelector(".walk-controls");
const walkStepBtn = document.querySelector(".walk-step-btn");
const walkFinishBtn = document.querySelector(".walk-finish-btn");
let currentLanternStep = 0;

// --- Stage 4: 6-Second Idle Wick Guidance Controller ---
let wishGuideTimeout = null;

function startWishGuideTimer() {
    clearTimeout(wishGuideTimeout);
    if (!wishScene || wishScene.classList.contains("lit") || wishScene.classList.contains("released") || wishScene.classList.contains("departed")) return;
    wishGuideTimeout = setTimeout(() => {
        if (wishScene && !wishScene.classList.contains("lit") && !wishScene.classList.contains("released") && !wishScene.classList.contains("departed")) {
            wishScene.classList.add("guide-active");
        }
    }, 6000); // Exact 6 seconds idle delay
}

function dismissWishGuide() {
    clearTimeout(wishGuideTimeout);
    wishGuideTimeout = null;
    if (wishScene && wishScene.classList.contains("guide-active")) {
        wishScene.classList.remove("guide-active");
    }
}

discoveryHint.addEventListener("click", () => {
    triggerHaptic("light");
    discoveryScene.style.opacity = "0";
    discoveryScene.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
        discoveryScene.classList.remove("visible");
        discoveryScene.style.opacity = "";
        discoveryScene.style.transition = "";
        wishScene.classList.add("visible");
        startWishGuideTimer();
    }, 400);
});


function spawnWickCatchSparks() {
    const flame = document.querySelector(".candle-flame");
    if (!flame) return;
    const rect = flame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height;

    const colors = ["#ffffff", "#ffe9a0", "#ffd27a", "#ff5500", "#ff8800"];
    for (let i = 0; i < 8; i++) {
        const spark = document.createElement("span");
        spark.className = "wick-catch-spark";
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const dist = 12 + Math.random() * 22;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const color = colors[Math.floor(Math.random() * colors.length)];

        spark.style.setProperty("--wx", `${cx}px`);
        spark.style.setProperty("--wy", `${cy}px`);
        spark.style.setProperty("--wdx", `${dx}px`);
        spark.style.setProperty("--wdy", `${dy}px`);
        spark.style.setProperty("--wc", color);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 450);
    }
}

let candleAutoTransitionTimeout = null;

function proceedToLantern() {
    clearTimeout(candleAutoTransitionTimeout);
    dismissWishGuide();
    if (!wishScene || wishScene.classList.contains("released") || wishScene.classList.contains("departed")) return;

    wishScene.classList.add("released");

    // Crossfade to Track 2 as the journey transitions
    try {
        crossfadeTo("track2");
    } catch (e) {}

    // Launch celestial spark flight from candle to lantern
    sendWishSparkToLantern(() => {
        // Lantern is now warmly lit! Clean up wish scene
        wishScene.classList.remove("visible");
        wishScene.classList.add("departed");

        // Reveal Chapter 1 card and begin typing
        setTimeout(() => {
            const firstCard = document.querySelector('.vignette-card[data-step="0"]');
            if (firstCard) {
                firstCard.classList.add("active");
                currentLanternStep = 0;
                prepareVignetteWords();
                typeVignetteCard(firstCard);
            }
            if (walkControls) {
                walkControls.classList.remove("hidden");
            }
        }, 500);
    });
}

function lightCandle() {
    dismissWishGuide();
    if (!wishScene || wishScene.classList.contains("lit")) return;

    triggerHaptic("medium");
    try {
        foleyAudio.playMatchStrike();
    } catch (e) {}

    // Flame catches and blooms warmly
    wishScene.classList.remove("igniting");
    wishScene.classList.add("lit");

    try {
        spawnWickCatchSparks();
    } catch (e) {}

    try {
        foleyAudio.playFlameCatch();
    } catch (e) {}

    if (wishHint) {
        wishHint.textContent = "Release into the Stars ✦";
    }

    // Auto-proceed to the lantern walk after 2.8s reverie (or user taps button/screen to proceed immediately)
    clearTimeout(candleAutoTransitionTimeout);
    candleAutoTransitionTimeout = setTimeout(() => {
        proceedToLantern();
    }, 2800);
}

function handleCandleActivation(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (!wishScene.classList.contains("lit")) {
        lightCandle();
    } else {
        proceedToLantern();
    }
}

wishCandle.addEventListener("click", handleCandleActivation);
wishCandle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        handleCandleActivation(event);
    }
});

function launchPortalFireworks(x, y) {
    const colors = [
        "#ffffff",
        "#fff8e7",
        "#ffd166",
        "#ffb703",
        "#ff2a8d", // Festive Rose / Neon Pink
        "#00d4ff", // Celestial Electric Cyan
        "#e056fd", // Violet Starlight
        "#ffd700", // Pure Gold
        "#ff7b00"  // Warm Amber Firecracker
    ];

    // Multi-burst celebratory firecracker splash
    const bursts = [
        { x: x, y: y, count: 26, distance: 180, delay: 0 },
        { x: x - 65, y: y + 20, count: 18, distance: 130, delay: 90 },
        { x: x + 70, y: y - 15, count: 18, distance: 140, delay: 170 },
        { x: x, y: y - 45, count: 16, distance: 130, delay: 240 }
    ];

    bursts.forEach((burst) => {
        setTimeout(() => {
            // Flash of illumination at burst center
            const flash = document.createElement("div");
            flash.className = "portal-flash";
            flash.style.setProperty("--flash-x", `${burst.x}px`);
            flash.style.setProperty("--flash-y", `${burst.y}px`);
            document.body.appendChild(flash);

            flash.addEventListener("animationend", () => {
                flash.remove();
            });

            triggerHaptic(burst.delay === 0 ? "heavy" : "medium");

            // Radial firecracker sparks
            for (let i = 0; i < burst.count; i++) {
                const spark = document.createElement("span");
                spark.className = "portal-spark";

                const angle = (Math.PI * 2 * i) / burst.count + (Math.random() - 0.5) * 0.25;
                const distance = burst.distance * (0.5 + Math.random() * 0.65);

                spark.style.setProperty("--spark-x", `${burst.x}px`);
                spark.style.setProperty("--spark-y", `${burst.y}px`);
                spark.style.setProperty("--spark-dx", `${Math.cos(angle) * distance}px`);
                spark.style.setProperty("--spark-dy", `${Math.sin(angle) * distance}px`);
                spark.style.setProperty("--spark-size", `${2.5 + Math.random() * 4.5}px`);
                spark.style.setProperty("--spark-color", colors[Math.floor(Math.random() * colors.length)]);
                spark.style.setProperty("--spark-duration", `${0.9 + Math.random() * 0.8}s`);

                document.body.appendChild(spark);

                spark.addEventListener("animationend", () => {
                    spark.remove();
                });
            }
        }, burst.delay);
    });
}

wishHint.addEventListener("click", (e) => {
    handleCandleActivation(e);
});

// Direct tap anywhere on wishScene when lit also proceeds smoothly
wishScene.addEventListener("click", () => {
    if (wishScene.classList.contains("lit") && !wishScene.classList.contains("released") && !wishScene.classList.contains("departed")) {
        proceedToLantern();
    }
});

// Celestial Wish Spark Flight: Travels from birthday candle to ignite the lantern
function sendWishSparkToLantern(onIgnite) {
    // 1. Origin coordinates: center of candle flame
    const candleFlame = document.querySelector(".candle-flame");
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight * 0.45;
    if (candleFlame) {
        const rect = candleFlame.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
        }
    }

    // 2. Prepare memory scene with lantern in unlit state
    const memoryScene = document.querySelector(".memory-scene");
    const cards = document.querySelectorAll(".vignette-card");

    if (memoryScene) {
        memoryScene.classList.add("visible");
        void memoryScene.offsetHeight; // Force layout calculation
    }
    if (walkLantern) {
        walkLantern.classList.remove("fade-out");
        walkLantern.classList.add("unlit");
        walkLantern.classList.remove("igniting");
        walkLantern.classList.remove("lit");
    }
    cards.forEach((c) => c.classList.remove("active"));
    if (walkControls) {
        walkControls.classList.add("hidden");
    }

    // Ensure layout reflow before computing coordinates
    if (memoryScene) void memoryScene.offsetHeight;

    // 3. Target coordinates: inside lantern glass chamber (accurate fallback to avoid (0,0) misdirection)
    const lanternGlass = document.querySelector(".lantern-glass") || document.querySelector(".walk-lantern");
    let targetX = window.innerWidth / 2;
    let targetY = 32;
    if (lanternGlass) {
        const lRect = lanternGlass.getBoundingClientRect();
        if (lRect.width > 0 && lRect.height > 0) {
            targetX = lRect.left + lRect.width / 2;
            targetY = lRect.top + lRect.height / 2;
        }
    }

    // 4. Create the traveling spark element
    const spark = document.createElement("div");
    spark.className = "wish-travel-spark";
    spark.innerHTML = '<span class="wish-travel-spark-star">✦</span>';
    spark.style.transform = `translate(${startX}px, ${startY}px)`;
    document.body.appendChild(spark);

    // Commit layout so initial transform is locked before transition
    void spark.offsetWidth;

    // Drop luminous stardust trail particles
    let trailTimer = setInterval(() => {
        try {
            const currentRect = spark.getBoundingClientRect();
            const cx = currentRect.left + currentRect.width / 2;
            const cy = currentRect.top + currentRect.height / 2;
            const trail = document.createElement("span");
            trail.className = "spark-trail-dot";
            trail.style.left = `${cx}px`;
            trail.style.top = `${cy}px`;
            document.body.appendChild(trail);
            setTimeout(() => { try { trail.remove(); } catch (e) {} }, 600);
        } catch (e) {}
    }, 55);

    // Trigger smooth CSS flight to the exact center of the lantern glass
    requestAnimationFrame(() => {
        spark.style.transform = `translate(${targetX}px, ${targetY}px)`;
    });

    // 5. On arrival at the lantern (2.2s gentle cinematic flight, matching CSS duration)
    setTimeout(() => {
        clearInterval(trailTimer);
        try { spark.remove(); } catch (e) {}

        // Ignition flash inside the lantern
        try {
            const flash = document.createElement("div");
            flash.className = "lantern-ignition-flash";
            flash.style.left = `${targetX}px`;
            flash.style.top = `${targetY}px`;
            document.body.appendChild(flash);
            setTimeout(() => { try { flash.remove(); } catch (e) {} }, 700);
        } catch (e) {}

        triggerHaptic("medium");
        try {
            foleyAudio.playFlameCatch();
        } catch (e) {}

        // Ignite the lantern
        if (walkLantern) {
            walkLantern.classList.remove("unlit");
            walkLantern.classList.add("igniting");
            setTimeout(() => {
                walkLantern.classList.remove("igniting");
                walkLantern.classList.add("lit");
            }, 700);
        }

        if (onIgnite) onIgnite();
    }, 2200);
}

// --- Celebratory Golden Birthday Streamer & Ribbon Blast Engine ---
class GoldenStreamerBlast {
    constructor(canvas) {
        this.canvas = canvas;
        if (!canvas) return;
        this.ctx = canvas.getContext("2d");
        this.streamers = [];
        this.confetti = [];
        this.sparks = [];
        this.active = false;
        this.frame = 0;
        this.maxFrames = 50; // ~1.4 seconds
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.w = window.innerWidth;
        this.h = window.innerHeight;
    }

    fire() {
        if (!this.canvas) return;
        this.streamers = [];
        this.confetti = [];
        this.sparks = [];
        this.frame = 0;
        this.startTime = performance.now();
        this.active = true;

        if (this.safetyTimer) clearTimeout(this.safetyTimer);
        this.safetyTimer = setTimeout(() => {
            this.active = false;
            if (this.ctx) this.ctx.clearRect(0, 0, this.w, this.h);
            this.running = false;
        }, 1400);

        const originX = 15;
        const originY = this.h * 0.72;

        const palette = [
            { front: "#ffd700", back: "#c89616", glow: "#ffeaa7" },
            { front: "#fff0a6", back: "#d4af37", glow: "#ffffff" },
            { front: "#f5c26b", back: "#b87d18", glow: "#ffd591" },
            { front: "#ffecd2", back: "#d4a373", glow: "#fff5ea" },
            { front: "#e6a836", back: "#996310", glow: "#f7cf7c" },
            { front: "#fff8eb", back: "#c49a45", glow: "#ffffff" }
        ];

        const ribbonCount = 6;
        for (let i = 0; i < ribbonCount; i++) {
            const angle = (-16 - (i / ribbonCount) * 36 + (Math.random() * 6 - 3)) * (Math.PI / 180);
            const speed = 44 + Math.random() * 26;

            this.streamers.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 0.18 + Math.random() * 0.12,
                drag: 0.978,
                points: [{ x: originX, y: originY }],
                ribbonLength: 26 + Math.floor(Math.random() * 12),
                tailReleaseFrame: 6 + Math.floor(Math.random() * 8),
                width: 4.5 + Math.random() * 3.5,
                twistSpeed: 0.22 + Math.random() * 0.14,
                twistPhase: Math.random() * Math.PI * 2,
                waveFreq: 0.14 + Math.random() * 0.08,
                waveAmp: 6 + Math.random() * 6,
                theme: palette[i % palette.length]
            });
        }

        for (let i = 0; i < 22; i++) {
            const angle = (-10 - Math.random() * 60) * (Math.PI / 180);
            const speed = 22 + Math.random() * 32;
            this.confetti.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 0.24 + Math.random() * 0.15,
                drag: 0.965,
                w: 4.5 + Math.random() * 5.5,
                h: 8 + Math.random() * 10,
                rx: Math.random() * Math.PI * 2,
                ry: Math.random() * Math.PI * 2,
                vrx: 0.14 + Math.random() * 0.22,
                vry: 0.1 + Math.random() * 0.18,
                color: palette[i % palette.length].front
            });
        }

        for (let i = 0; i < 12; i++) {
            const angle = (-8 - Math.random() * 75) * (Math.PI / 180);
            const speed = 24 + Math.random() * 28;
            this.sparks.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 1.6 + Math.random() * 2.4,
                alpha: 1,
                decay: 0.022 + Math.random() * 0.025
            });
        }

        const popper = document.getElementById("popper-launcher");
        if (popper) {
            popper.classList.add("firing");
            setTimeout(() => {
                popper.classList.remove("firing");
                popper.classList.add("fired");
                setTimeout(() => popper.classList.remove("fired"), 400);
            }, 250);
        }

        if (!this.running) {
            this.running = true;
            this.loop();
        }
    }

    loop() {
        if (!this.active) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.running = false;
            return;
        }

        this.frame++;
        const progress = Math.min(1, this.frame / this.maxFrames);
        this.ctx.clearRect(0, 0, this.w, this.h);

        let globalAlpha = 1;
        if (progress > 0.55) {
            globalAlpha = 1 - (progress - 0.55) / 0.45;
        }

        const ctx = this.ctx;

        if (this.frame < 12) {
            const bloomProgress = this.frame / 12;
            const bloomAlpha = (1 - bloomProgress) * globalAlpha;
            const originX = 15;
            const originY = this.h * 0.72;

            ctx.save();
            ctx.globalAlpha = bloomAlpha * 0.95;
            const grad = ctx.createRadialGradient(originX, originY, 0, originX, originY, 55 * (1 + bloomProgress));
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.4, "#ffd700");
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(originX, originY, 60 * (1 + bloomProgress), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        this.streamers.forEach(st => {
            st.vx *= st.drag;
            st.vy = st.vy * st.drag + st.gravity;

            const speed = Math.hypot(st.vx, st.vy);
            const perpX = speed > 0.1 ? -st.vy / speed : 0;
            const perpY = speed > 0.1 ? st.vx / speed : 0;

            const wave = Math.sin(this.frame * st.waveFreq) * st.waveAmp;
            st.x += st.vx + perpX * wave * 0.3;
            st.y += st.vy + perpY * wave * 0.3;

            st.points.unshift({ x: st.x, y: st.y });

            if (this.frame > st.tailReleaseFrame && st.points.length > st.ribbonLength) {
                st.points.pop();
            }

            if (st.points.length > 2) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, globalAlpha * 0.95);

                for (let j = 0; j < st.points.length - 1; j++) {
                    const p1 = st.points[j];
                    const p2 = st.points[j + 1];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 0.1) continue;

                    const nx = -dy / dist;
                    const ny = dx / dist;

                    const twist = Math.cos(this.frame * 0.15 + j * st.twistSpeed + st.twistPhase);
                    const currentWidth = Math.max(0.8, st.width * (1 - (j / st.points.length) * 0.4) * Math.abs(twist));
                    const isFront = twist >= 0;

                    ctx.beginPath();
                    ctx.moveTo(p1.x + nx * currentWidth, p1.y + ny * currentWidth);
                    ctx.lineTo(p1.x - nx * currentWidth, p1.y - ny * currentWidth);
                    ctx.lineTo(p2.x - nx * currentWidth, p2.y - ny * currentWidth);
                    ctx.lineTo(p2.x + nx * currentWidth, p2.y + ny * currentWidth);
                    ctx.closePath();

                    ctx.fillStyle = isFront ? st.theme.front : st.theme.back;
                    ctx.fill();
                }

                ctx.restore();
            }
        });

        this.confetti.forEach(cf => {
            cf.vx *= cf.drag;
            cf.vy = cf.vy * cf.drag + cf.gravity;
            cf.x += cf.vx;
            cf.y += cf.vy;

            cf.rx += cf.vrx;
            cf.ry += cf.vry;

            const sx = Math.cos(cf.rx);
            const sy = Math.sin(cf.ry);

            ctx.save();
            ctx.globalAlpha = Math.max(0, globalAlpha * 0.9);
            ctx.translate(cf.x, cf.y);
            ctx.scale(sx, sy);
            ctx.fillStyle = cf.color;
            ctx.fillRect(-cf.w / 2, -cf.h / 2, cf.w, cf.h);
            ctx.restore();
        });

        this.sparks.forEach(sp => {
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vx *= 0.94;
            sp.vy *= 0.94;
            sp.alpha -= sp.decay;

            if (sp.alpha > 0) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, sp.alpha * globalAlpha);
                ctx.fillStyle = "#fffdf7";
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        if (this.frame < this.maxFrames) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.active = false;
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.running = false;
        }
    }
}

// --- Stage 6: The Lantern Walk Controller with Custom Transitions & Typewriter ---
const streamerCanvas = document.getElementById("streamer-blast-canvas");
const streamerBlast = streamerCanvas ? new GoldenStreamerBlast(streamerCanvas) : null;
const totalVignettes = vignetteCards.length;
let vigTypingInterval = null;
let isVigTyping = false;
let currentVigWords = [];

// Prepare each vignette-text into word spans for smooth word-by-word typing
function prepareVignetteWords() {
    const textEls = document.querySelectorAll(".vignette-text");
    textEls.forEach((el) => {
        if (el.dataset.prepared) return;
        el.dataset.prepared = "true";
        const text = el.textContent.trim();
        el.textContent = "";
        const words = text.split(/\s+/).filter(Boolean);
        words.forEach((word) => {
            const span = document.createElement("span");
            span.className = "vig-word";
            span.textContent = word;
            el.appendChild(span);
        });
    });
}

function typeVignetteCard(card) {
    clearInterval(vigTypingInterval);
    if (!card) return;
    const words = Array.from(card.querySelectorAll(".vig-word"));
    if (words.length === 0) {
        isVigTyping = false;
        return;
    }

    words.forEach((w) => w.classList.remove("revealed"));
    isVigTyping = true;
    currentVigWords = words;

    let index = 0;
    vigTypingInterval = setInterval(() => {
        if (index < words.length) {
            words[index].classList.add("revealed");
            index++;
        } else {
            clearInterval(vigTypingInterval);
            vigTypingInterval = null;
            isVigTyping = false;
        }
    }, 75);
}

function fastForwardVignette() {
    if (isVigTyping) {
        clearInterval(vigTypingInterval);
        vigTypingInterval = null;
        currentVigWords.forEach((w) => w.classList.add("revealed"));
        isVigTyping = false;
        return true;
    }
    return false;
}

function runCenterpieceCountdown(onComplete) {
    const interlude = document.querySelector(".walk-countdown-interlude");
    const numEl = document.querySelector(".countdown-num");
    const phraseEl = document.querySelector(".countdown-phrase");
    const subPhraseEl = document.querySelector(".countdown-sub-phrase");

    if (!interlude || !numEl || !phraseEl) {
        onComplete();
        return;
    }

    interlude.classList.remove("fading");
    interlude.classList.add("active");

    // Calm, slow, suspenseful steps (NO name or birthday revealed here - pure anticipation!)
    const steps = [
        {
            num: "3",
            phrase: "Every journey has a reason...",
            sub: "A quiet pause before the destination.",
            haptic: "light"
        },
        {
            num: "2",
            phrase: "Every memory leads somewhere...",
            sub: "Through every laugh and shared silence.",
            haptic: "medium"
        },
        {
            num: "1",
            phrase: "And today belongs to you.",
            sub: "The heart of this entire adventure.",
            haptic: "heavy"
        },
        {
            num: "✦",
            phrase: "Look closely at what awaits in the light...",
            sub: "Open your eyes.",
            haptic: "success"
        }
    ];

    let currentBeat = 0;
    const BEAT_DURATION = 2400; // Serene 2.4s per count - gives her comfortable breath to read every phrase

    function playBeat() {
        if (currentBeat >= steps.length) {
            // Countdown complete! Launch celebratory firecrackers & unveil centerpiece
            interlude.classList.add("fading");
            const rect = interlude.getBoundingClientRect();
            const cx = (rect && rect.width > 0) ? (rect.left + rect.width / 2) : (window.innerWidth / 2);
            const cy = (rect && rect.height > 0) ? (rect.top + rect.height * 0.44) : (window.innerHeight * 0.42);
            launchPortalFireworks(cx, cy);

            // Centerpiece card emerges majestically amidst the firecracker sparkles
            setTimeout(() => {
                interlude.classList.remove("active", "fading");
                onComplete();
            }, 850);
            return;
        }

        const step = steps[currentBeat];
        numEl.textContent = step.num;
        phraseEl.textContent = step.phrase;
        if (subPhraseEl) subPhraseEl.textContent = step.sub;

        // Restart CSS animation for slow, elegant heartbeat pulse (2.4s)
        numEl.style.animation = "none";
        void numEl.offsetWidth;
        numEl.style.animation = "numHeartbeat 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards";

        triggerHaptic(step.haptic);

        currentBeat++;
        setTimeout(playBeat, BEAT_DURATION);
    }

    playBeat();
}

function launchWalkingStepEmbers() {
    const lantern = document.querySelector(".walk-lantern");
    const rect = lantern ? lantern.getBoundingClientRect() : { left: window.innerWidth / 2, top: 60, width: 36, height: 50 };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.6;

    const count = 8; // Lightweight, zero lag on phone
    for (let i = 0; i < count; i++) {
        const ember = document.createElement("span");
        ember.className = "transition-ember";
        ember.style.left = `${centerX}px`;
        ember.style.top = `${centerY}px`;

        const dx = (Math.random() * 120 - 60);
        const dy = (20 + Math.random() * 90);
        const size = (2.5 + Math.random() * 2.5);
        const dur = (0.75 + Math.random() * 0.45);

        ember.style.setProperty("--dx", `${dx}px`);
        ember.style.setProperty("--dy", `${dy}px`);
        ember.style.setProperty("--size", `${size}px`);
        ember.style.setProperty("--dur", `${dur}s`);
        ember.style.animationDelay = `${Math.random() * 0.12}s`;

        document.body.appendChild(ember);

        ember.addEventListener("animationend", () => {
            try { ember.remove(); } catch (e) {}
        });
        setTimeout(() => {
            try { ember.remove(); } catch (e) {}
        }, 1300);
    }
}

let isStepTransitioning = false;

function goToStep(nextStep) {
    if (nextStep < 0 || nextStep >= totalVignettes) return;
    if (isStepTransitioning) return;
    isStepTransitioning = true;

    const currentCard = vignetteCards[currentLanternStep];
    const nextCard = vignetteCards[nextStep];

    // Subtle button tactile feedback during transition
    if (walkStepBtn) {
        walkStepBtn.style.pointerEvents = "none";
        walkStepBtn.style.opacity = "0.75";
    }

    // Step the floating lantern forward with warm physical sway & stardust embers
    if (walkLantern && !walkLantern.classList.contains("fade-out")) {
        walkLantern.classList.remove("lantern-stepping");
        void walkLantern.offsetWidth;
        walkLantern.classList.add("lantern-stepping");
    }
    launchWalkingStepEmbers();

    // If transitioning to the centerpiece card (step 4), run the suspense countdown!
    if (nextStep === 4) {
        if (streamerBlast) {
            streamerBlast.active = false;
            if (streamerBlast.safetyTimer) clearTimeout(streamerBlast.safetyTimer);
            if (streamerBlast.ctx) streamerBlast.ctx.clearRect(0, 0, streamerBlast.w, streamerBlast.h);
            streamerBlast.running = false;
        }

        // 1. Hide navigation controls
        if (walkControls) walkControls.classList.add("hidden");

        // 2. Transition out Chapter 4 card smoothly
        currentCard.classList.remove("active");
        currentCard.classList.add("exiting");
        setTimeout(() => {
            currentCard.classList.remove("exiting");
            currentCard.style.display = "none";
        }, 320);

        // 3. Smoothly dissolve the floating lantern away
        if (walkLantern) {
            walkLantern.classList.add("fade-out");
        }

        // Crossfade to Soulmate track from Chapter 4 complete button through the Centerpiece card
        crossfadeTo("soulmate");

        // 4. Run the slow, heartfelt suspense countdown
        runCenterpieceCountdown(() => {
            nextCard.style.display = "";
            nextCard.classList.add("entering");
            void nextCard.offsetWidth; // Force layout so 3D unfold animates smoothly
            requestAnimationFrame(() => {
                nextCard.classList.remove("entering");
                nextCard.classList.add("active");
                currentLanternStep = 4;
                typeVignetteCard(nextCard);
                isStepTransitioning = false;
            });
        });
        return;
    }

    // Chapters 1, 2, 3: Celebratory Golden Streamer & Ribbon Blast!
    if (nextStep >= 1 && nextStep <= 3) {
        if (streamerBlast) {
            streamerBlast.fire();
        }
        try {
            foleyAudio.playStreamerBlast();
        } catch (e) {}
    }

    // Phase 1: Gracefully glide out current card
    currentCard.classList.remove("active");
    currentCard.classList.add("exiting");

    // Phase 2: After current card clears (280ms), unfold next card with 3D animation
    setTimeout(() => {
        currentCard.classList.remove("exiting");
        currentCard.style.display = "none";

        // Commit initial transform state before activating transition
        nextCard.style.display = "";
        nextCard.classList.add("entering");
        void nextCard.offsetWidth; // Force layout

        requestAnimationFrame(() => {
            nextCard.classList.remove("entering");
            nextCard.classList.add("active");
            currentLanternStep = nextStep;

            // Subtle gentle movement of the lantern
            if (walkLantern) {
                walkLantern.style.transform = `translateY(${Math.sin(nextStep) * 6}px)`;
            }

            // Update step dots (active for chapters 0 to 3)
            stepDots.forEach((dot, index) => {
                if (index === currentLanternStep) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });

            // Update navigation button text
            if (currentLanternStep === 3) {
                walkStepBtn.innerHTML = 'Complete the walk <span>✦</span>';
            } else if (currentLanternStep >= 4) {
                if (walkControls) walkControls.classList.add("hidden");
            }

            // Restore walkStepBtn
            if (walkStepBtn) {
                walkStepBtn.style.pointerEvents = "auto";
                walkStepBtn.style.opacity = "1";
            }

            // Start typewriter once card settles into place
            setTimeout(() => {
                typeVignetteCard(nextCard);
                isStepTransitioning = false;
            }, 180);
        });
    }, 280);
}

if (walkStepBtn) {
    walkStepBtn.addEventListener("click", () => {
        triggerHaptic("light");
        if (fastForwardVignette()) {
            return;
        }
        goToStep(currentLanternStep + 1);
    });
}

// Tap card directly to reveal typing early
vignetteCards.forEach((card) => {
    card.addEventListener("click", () => {
        fastForwardVignette();
    });
});

if (wishScene && wishScene.classList.contains("visible") && !wishScene.classList.contains("lit")) {
    startWishGuideTimer();
}

// Prepare words on initial load in case page starts on memory scene
prepareVignetteWords();
if (vignetteCards.length > 0 && vignetteCards[0].classList.contains("active")) {
    typeVignetteCard(vignetteCards[0]);
}

function launchTransitionEmbers() {
    const lantern = document.querySelector(".walk-lantern");
    const rect = lantern ? lantern.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
        const ember = document.createElement("span");
        ember.className = "transition-ember";
        ember.style.left = `${centerX}px`;
        ember.style.top = `${centerY}px`;

        const dx = (Math.random() * 160 - 80);
        const dy = (-120 - Math.random() * 180);
        const size = (3 + Math.random() * 4);
        const dur = (1.4 + Math.random() * 1.0);

        ember.style.setProperty("--dx", `${dx}px`);
        ember.style.setProperty("--dy", `${dy}px`);
        ember.style.setProperty("--size", `${size}px`);
        ember.style.setProperty("--dur", `${dur}s`);
        ember.style.animationDelay = `${Math.random() * 0.4}s`;

        document.body.appendChild(ember);

        ember.addEventListener("animationend", () => {
            ember.remove();
        });
    }
}

if (walkFinishBtn) {
    walkFinishBtn.addEventListener("click", () => {
        triggerHaptic("medium");
        walkFinishBtn.textContent = "Unlocking surprise...";
        walkFinishBtn.style.opacity = "0.7";
        walkFinishBtn.style.pointerEvents = "none";
        crossfadeTo("track3");

        // Phase 1: Dissolve the Lantern Walk & launch ascending stardust embers
        memoryScene.classList.add("dissolving");
        launchTransitionEmbers();

        // Phase 2: Fade to quiet stillness after embers ascend
        setTimeout(() => {
            memoryScene.classList.remove("visible");
            memoryScene.classList.remove("dissolving");

            // Phase 3: The Celestial Bloom & Grand Envelope Emergence
            setTimeout(() => {
                const envelopeScene = document.querySelector(".envelope-scene");
                if (envelopeScene) {
                    envelopeScene.classList.add("visible");
                }
            }, 1200);
        }, 1100);
    });
}

// --- Stage 7: The Cinematic Envelope & Letter Controller ---
const envelopeWrapper = document.querySelector(".envelope-wrapper");
const envelopeCard = document.querySelector(".envelope-card");
const letterPaper = document.querySelector(".letter-paper");
const letterCloseBtn = document.querySelector(".letter-close-btn");


function launchSealBreakShards() {
    const seal = document.querySelector(".envelope-seal");
    if (!seal) return;
    const rect = seal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const waxColors = ["#ffd97a", "#f2be63", "#d4973b", "#9e2a2b", "#b23a48", "#fff2b2", "#ff2a8d"];

    for (let i = 0; i < 18; i++) {
        const shard = document.createElement("span");
        shard.className = "seal-shard";
        const angle = (Math.PI * 2 * i) / 18 + (Math.random() * 0.4 - 0.2);
        const distance = 45 + Math.random() * 85;
        const color = waxColors[Math.floor(Math.random() * waxColors.length)];
        const size = 3 + Math.random() * 5;
        const dur = 0.6 + Math.random() * 0.45;

        shard.style.setProperty("--shard-x", `${centerX}px`);
        shard.style.setProperty("--shard-y", `${centerY}px`);
        shard.style.setProperty("--shard-dx", `${Math.cos(angle) * distance}px`);
        shard.style.setProperty("--shard-dy", `${Math.sin(angle) * distance}px`);
        shard.style.setProperty("--shard-color", color);
        shard.style.setProperty("--shard-size", `${size}px`);
        shard.style.setProperty("--shard-dur", `${dur}s`);

        document.body.appendChild(shard);

        shard.addEventListener("animationend", () => {
            shard.remove();
        });
    }
}

function openEnvelope() {
    triggerHaptic("heavy");
    launchSealBreakShards();
    if (!envelopeWrapper || envelopeWrapper.classList.contains("opened")) return;
    envelopeWrapper.classList.add("opened");
    if (letterPaper) {
        letterPaper.setAttribute("aria-hidden", "false");
    }
    setTimeout(() => {
        resetLetterScrollTimer();
    }, 1000);
}

if (envelopeCard) {
    envelopeCard.addEventListener("click", openEnvelope);
    envelopeCard.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openEnvelope();
        }
    });
}

// --- Stage 7: 10-Second Idle Scroll Guide for Birthday Letter ---
const letterScrollCue = document.getElementById("letter-scroll-cue");
let letterScrollTimer = null;

function positionLetterScrollCue() {
    if (!letterPaper || !letterScrollCue) return;
    const rect = letterPaper.getBoundingClientRect();
    const cueTop = rect.bottom + 10;
    const maxTop = window.innerHeight - 44;
    letterScrollCue.style.top = `${Math.min(cueTop, maxTop)}px`;
    letterScrollCue.style.left = `${rect.left + rect.width / 2}px`;
}

function isLetterScrolledToBottom() {
    if (!letterPaper) return true;
    return letterPaper.scrollTop + letterPaper.clientHeight >= letterPaper.scrollHeight - 50;
}

function showLetterScrollCue() {
    if (!letterScrollCue || !letterPaper) return;
    if (isLetterScrolledToBottom()) {
        hideLetterScrollCue();
        return;
    }
    positionLetterScrollCue();
    letterScrollCue.classList.add("visible");
}

function hideLetterScrollCue() {
    if (letterScrollCue) {
        letterScrollCue.classList.remove("visible");
    }
}

function resetLetterScrollTimer() {
    clearTimeout(letterScrollTimer);
    hideLetterScrollCue();
    if (!envelopeWrapper || !envelopeWrapper.classList.contains("opened")) return;
    if (isLetterScrolledToBottom()) return;

    letterScrollTimer = setTimeout(() => {
        if (envelopeWrapper && envelopeWrapper.classList.contains("opened") && !isLetterScrolledToBottom()) {
            showLetterScrollCue();
        }
    }, 10000); // Exact 10 seconds idle delay
}

if (letterPaper) {
    letterPaper.addEventListener("scroll", () => {
        resetLetterScrollTimer();
    }, { passive: true });
}

if (letterScrollCue) {
    letterScrollCue.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic("light");
        if (letterPaper) {
            letterPaper.scrollBy({ top: 180, behavior: "smooth" });
        }
        resetLetterScrollTimer();
    });
}

window.addEventListener("resize", () => {
    if (letterScrollCue && letterScrollCue.classList.contains("visible")) {
        positionLetterScrollCue();
    }
});

// --- Stage 8 & 9: Cinematic Movie Ending Credits & Final Note Controller ---
const creditsScene = document.querySelector(".credits-scene");
const creditSlides = document.querySelectorAll(".credit-slide");
const finalBloom = document.querySelector(".credits-final-bloom");

// Clean 6s Next Slide Timer Elements
const timelineBar = document.querySelector(".credits-timeline-bar");
const progressFill = document.querySelector(".credits-progress-fill");
const countdownEl = document.querySelector(".credits-time-countdown");

let currentSlideIndex = 0;
let slideTimeout = null;
let typingInterval = null;
let timelineInterval = null;
let isSlideTyping = false;
let currentSlideWords = [];
let creditsStarted = false;
let slideStartTime = 0;
const HOLD_DURATION = 6000; // Exact 6 seconds countdown

// Convert typewriter-text elements into individual word spans
function prepareTypewriterWords() {
    const typewriterElements = document.querySelectorAll(".typewriter-text");
    typewriterElements.forEach((el) => {
        if (el.dataset.prepared) return;
        el.dataset.prepared = "true";
        const text = el.textContent.trim();
        el.textContent = "";
        const words = text.split(/\s+/).filter(Boolean);
        words.forEach((word) => {
            const span = document.createElement("span");
            span.className = "type-word";
            span.textContent = word;
            el.appendChild(span);
        });
    });
}

let confettiCascadeActive = false;
function launchFinaleConfetti() {
    if (confettiCascadeActive) return;
    confettiCascadeActive = true;
    const container = document.querySelector(".credits-scene");
    if (!container) return;

    const colors = [
        "#ffd770", // Warm Gold
        "#ffeaa7", // Soft Champagne
        "#ff2a8d", // Starcourt Pink
        "#00d4ff", // Starcourt Cyan
        "#ffffff", // Diamond White
        "#e056fd"  // Violet Shimmer
    ];

    const shapes = ["star", "ribbon", "circle"];

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        piece.classList.add(`confetti-${shape}`);

        if (shape === "star") {
            piece.textContent = Math.random() > 0.5 ? "✦" : "★";
        }

        const startX = Math.random() * 100;
        const startY = -20 - Math.random() * 80;
        const driftX = (Math.random() - 0.5) * 220;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const scale = 0.6 + Math.random() * 0.85;
        const duration = 3.6 + Math.random() * 3.5;
        const delay = Math.random() * 4.2;
        const rotateStart = Math.random() * 360;
        const rotateEnd = rotateStart + (Math.random() > 0.5 ? 540 : -540);

        piece.style.setProperty("--start-x", `${startX}vw`);
        piece.style.setProperty("--start-y", `${startY}px`);
        piece.style.setProperty("--drift-x", `${driftX}px`);
        piece.style.setProperty("--color", color);
        piece.style.setProperty("--scale", scale);
        piece.style.setProperty("--duration", `${duration}s`);
        piece.style.setProperty("--delay", `${delay}s`);
        piece.style.setProperty("--rot-start", `${rotateStart}deg`);
        piece.style.setProperty("--rot-end", `${rotateEnd}deg`);

        container.appendChild(piece);
    }
}

// Clean 6-second countdown timer function
function startCountdownTimer() {
    clearInterval(timelineInterval);
    clearTimeout(slideTimeout);

    if (!timelineBar || !progressFill || !countdownEl) return;

    progressFill.style.width = "0%";
    countdownEl.textContent = "6s";
    timelineBar.classList.remove("hidden");

    slideStartTime = Date.now();

    timelineInterval = setInterval(() => {
        const elapsed = Date.now() - slideStartTime;
        const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
        progressFill.style.width = `${progress}%`;

        const remainingSec = Math.max(0, Math.ceil((HOLD_DURATION - elapsed) / 1000));
        countdownEl.textContent = `${remainingSec}s`;

        if (elapsed >= HOLD_DURATION) {
            clearInterval(timelineInterval);
            timelineInterval = null;
            nextSlide();
        }
    }, 50);
}


let finaleBlackoutTimeout = null;
let finaleReplayTimeout = null;

function scheduleFinaleSequence() {
    clearTimeout(finaleReplayTimeout);
    clearTimeout(finaleBlackoutTimeout);
    clearTimeout(finaleReplayTimeout);

    const finalSlideEl = document.querySelector(".credit-slide.final-slide");
    if (!finalSlideEl) return;

    const replayBtn = finalSlideEl.querySelector(".replay-btn");
    if (replayBtn) {
        replayBtn.classList.remove("visible");
    }

    // 1. Give her breath for reading: Relive the journey button appears below after 45 seconds (45,000 ms)
    finaleReplayTimeout = setTimeout(() => {
        const slide = document.querySelector(".credit-slide.final-slide");
        if (slide && slide.classList.contains("active")) {
            const btn = slide.querySelector(".replay-btn");
            if (btn) {
                btn.classList.add("visible");
            }
        }
    }, 45000);

    // 2. Final closing scene smoothly fades out in black after 1 minute (60,000 ms)
    finaleBlackoutTimeout = setTimeout(() => {
        const slide = document.querySelector(".credit-slide.final-slide");
        if (creditsScene && slide && slide.classList.contains("active")) {
            creditsScene.classList.add("peaceful-blackout");
            slide.classList.add("faded-to-black");
            // Ensure button is visible for reliving journey in blackout
            const btn = slide.querySelector(".replay-btn");
            if (btn) {
                btn.classList.add("visible");
            }
        }
    }, 60000);
}
function showSlide(index) {
    if (index >= creditSlides.length) return;
    currentSlideIndex = index;

    // Clear any active timers
    clearTimeout(slideTimeout);
    clearTimeout(finaleBlackoutTimeout);
    clearInterval(typingInterval);
    clearInterval(timelineInterval);

    // Remove active, fading-out, and blackout classes from all slides
    creditSlides.forEach((slide) => {
        slide.classList.remove("active", "fading-out", "faded-to-black");
    });
    if (creditsScene) creditsScene.classList.remove("peaceful-blackout");
    document.querySelectorAll(".replay-btn").forEach((btn) => btn.classList.remove("visible"));

    const activeSlide = creditSlides[index];
    if (!activeSlide) return;

    activeSlide.classList.add("active");
    const isFinalSlide = activeSlide.classList.contains("final-slide");

    // Collect all word spans in this slide
    currentSlideWords = Array.from(activeSlide.querySelectorAll(".type-word"));
    currentSlideWords.forEach((span) => span.classList.remove("revealed"));

    isSlideTyping = true;
    let wordIndex = 0;
    const speed = isFinalSlide ? 180 : 220;

    if (isFinalSlide) {
        // Final Slide: Permanently hide timer bar, bloom celestial light, launch stardust confetti
        if (timelineBar) timelineBar.classList.add("hidden");
        if (finalBloom) finalBloom.classList.add("active");
        launchFinaleConfetti();
        scheduleFinaleSequence();
    } else {
        // Slide 0, 1, 2, 3: Prepare clean 6s timer bar
        if (timelineBar) {
            timelineBar.classList.remove("hidden");
            if (progressFill) progressFill.style.width = "0%";
            if (countdownEl) countdownEl.textContent = "6s";
        }
    }

    typingInterval = setInterval(() => {
        if (wordIndex < currentSlideWords.length) {
            currentSlideWords[wordIndex].classList.add("revealed");
            wordIndex++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            isSlideTyping = false;

            if (!isFinalSlide) {
                // Words finished! Start the exact 6-second countdown to next slide
                startCountdownTimer();
            } else {
                // Final slide words completed: trigger gentle haptic
                triggerHaptic("success");
                // Relive button (45s) and blackout (60s) are already scheduled by scheduleFinaleSequence()
            }
        }
    }, speed);
}

function fastForwardSlide() {
    const activeSlide = creditSlides[currentSlideIndex];
    const isFinalSlide = activeSlide && activeSlide.classList.contains("final-slide");

    if (isSlideTyping) {
        // Instantly reveal all remaining words in current slide
        clearInterval(typingInterval);
        typingInterval = null;
        currentSlideWords.forEach((w) => w.classList.add("revealed"));
        isSlideTyping = false;

        if (isFinalSlide) {
            // Words revealed; Relive button (45s) and blackout (60s) remain peacefully on schedule
        } else {
            // Words revealed: run 6s countdown
            startCountdownTimer();
        }
    } else {
        // If already typed and not on final slide, immediately advance to next!
        if (!isFinalSlide) {
            clearInterval(timelineInterval);
            clearTimeout(slideTimeout);
            nextSlide();
        }
    }
}

function nextSlide() {
    clearTimeout(slideTimeout);
    clearInterval(typingInterval);
    clearInterval(timelineInterval);

    const activeSlide = creditSlides[currentSlideIndex];
    if (activeSlide) {
        activeSlide.classList.add("fading-out");
    }

    // If advancing from Slide 4 (index 3) to Slide 5 (final climax), hide the timer bar immediately!
    if (currentSlideIndex === 3) {
        if (timelineBar) {
            timelineBar.classList.add("hidden");
        }
    }

    setTimeout(() => {
        showSlide(currentSlideIndex + 1);
    }, 1000);
}

if (creditsScene) {
    creditsScene.addEventListener("click", (e) => {
        if (e.target.closest(".replay-btn")) return;
        triggerHaptic("light");
        fastForwardSlide();
    });
}

function startMovieCredits() {
    if (creditsStarted) return;
    creditsStarted = true;
    prepareTypewriterWords();
    showSlide(0);
}

if (letterCloseBtn) {
    letterCloseBtn.addEventListener("click", () => {
        clearTimeout(letterScrollTimer);
        hideLetterScrollCue();
        triggerHaptic("medium");
        letterCloseBtn.textContent = "Continuing journey...";
        letterCloseBtn.style.opacity = "0.7";
        letterCloseBtn.style.pointerEvents = "none";

        // Transition to Track 4 - Enchanting
        crossfadeTo("track4");

        const envelopeScene = document.querySelector(".envelope-scene");
        if (envelopeScene) {
            envelopeScene.classList.add("dissolving");
        }

        setTimeout(() => {
            if (envelopeScene) {
                envelopeScene.classList.remove("visible");
                envelopeScene.classList.remove("dissolving");
            }
            if (creditsScene) {
                creditsScene.classList.add("visible");
                startMovieCredits();
            }
        }, 1200);
    });
}
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".replay-btn");
    if (btn) {
        btn.textContent = "Restarting...";
        btn.style.opacity = "0.7";
        btn.style.pointerEvents = "none";
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
});
