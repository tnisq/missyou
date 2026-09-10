const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");
const experience = document.getElementById("experience");
const scenes = document.querySelectorAll(".scene");
const counter = document.getElementById("counter");
const againBtn = document.getElementById("againBtn");

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let currentScene = 1;
let stars = [];
let particleInterval = null;

/* =========================================================
   CANVAS STAR FIELD
========================================================= */

function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function generateStars() {

    stars = [];

    const count =
        Math.min(
            180,
            Math.floor(
                (window.innerWidth * window.innerHeight) / 8000
            )
        );

    for (let i = 0; i < count; i++) {

        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,

            size: Math.random() * 1.25 + .2,

            baseOpacity:
                Math.random() * .5 + .08,

            speed:
                Math.random() * .0008 + .0003,

            phase:
                Math.random() * Math.PI * 2
        });
    }
}

generateStars();

function animateStars(time) {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    stars.forEach(star => {

        const opacity =
            star.baseOpacity +
            Math.sin(
                time * star.speed * 1000 +
                star.phase
            ) * .12;

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,150,180,${Math.max(.03, opacity)})`;

        ctx.fill();
    });

    requestAnimationFrame(animateStars);
}

requestAnimationFrame(animateStars);


/* =========================================================
   INTRO
========================================================= */

enterBtn.addEventListener("click", () => {

    createTouchEffect(
        window.innerWidth / 2,
        window.innerHeight / 2
    );

    intro.classList.add("hide");

    setTimeout(() => {

        experience.classList.add("show");

        startFloatingParticles();

    }, 650);

    setTimeout(() => {
        intro.style.display = "none";
    }, 1300);
});


/* =========================================================
   SCENE TRANSITIONS
========================================================= */

document.querySelectorAll(".next-btn").forEach(button => {

    button.addEventListener("click", event => {

        const rect =
            event.currentTarget.getBoundingClientRect();

        createTouchEffect(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );

        const next =
            Number(button.dataset.next);

        changeScene(next);
    });

});


function changeScene(number) {

    if (
        number < 1 ||
        number > scenes.length
    ) {
        return;
    }

    scenes.forEach(scene => {
        scene.classList.remove("active");
    });

    const nextScene =
        document.getElementById(`scene${number}`);

    currentScene = number;

    nextScene.classList.add("active");

    counter.textContent =
        `0${number} / 04`;

    createFloatingWords(10);

    if (number === 4) {
        setTimeout(() => {
            finalBurst();
        }, 350);
    }
}


/* =========================================================
   FLOATING TEXT
========================================================= */

function createFloatingWords(amount = 10) {

    const words = [
        "i miss you",
        "i love you",
        "always",
        "thinking of you",
        "♡",
        "you & me",
        "stay close",
        "wish you were here",
        "my favorite person",
        "∞"
    ];

    for (let i = 0; i < amount; i++) {

        setTimeout(() => {

            const el =
                document.createElement("div");

            el.className = "love-particle";

            el.textContent =
                words[
                Math.floor(
                    Math.random() * words.length
                )
                ];

            const startX =
                3 + Math.random() * 94;

            const startY =
                72 + Math.random() * 25;

            const duration =
                4 + Math.random() * 4;

            el.style.left = `${startX}vw`;
            el.style.top = `${startY}vh`;

            el.style.setProperty(
                "--drift-x",
                `${-70 + Math.random() * 140}px`
            );

            el.style.animationDuration =
                `${duration}s`;

            el.style.fontSize =
                `${10 + Math.random() * 8}px`;

            el.style.opacity =
                `${.4 + Math.random() * .4}`;

            document.body.appendChild(el);

            setTimeout(() => {
                el.remove();
            }, duration * 1000);

        }, i * 140);
    }
}


/* =========================================================
   CONTINUOUS FLOATING PARTICLES
========================================================= */

function startFloatingParticles() {

    if (particleInterval) {
        clearInterval(particleInterval);
    }

    particleInterval =
        setInterval(() => {

            if (
                document.visibilityState === "hidden"
            ) {
                return;
            }

            const randomAmount =
                Math.random() > .6 ? 2 : 1;

            createFloatingWords(randomAmount);

        }, 1100);
}


/* =========================================================
   TOUCH / TAP EFFECT
========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        createTouchEffect(
            event.clientX,
            event.clientY
        );

    },
    { passive: true }
);


function createTouchEffect(x, y) {

    const ripple =
        document.createElement("div");

    ripple.className = "touch-ripple";

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    const ring =
        document.createElement("div");

    ring.className = "touch-ring";

    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;

    document.body.appendChild(ring);

    createTapHearts(x, y);

    setTimeout(() => {
        ripple.remove();
        ring.remove();
    }, 1100);
}


function createTapHearts(x, y) {

    const count =
        window.innerWidth < 700 ? 5 : 8;

    for (let i = 0; i < count; i++) {

        const heart =
            document.createElement("div");

        heart.className = "tap-heart";

        heart.textContent =
            Math.random() > .35
                ? "♥"
                : "♡";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            35 + Math.random() * 80;

        const dx =
            Math.cos(angle) * distance;

        const dy =
            Math.sin(angle) * distance - 35;

        const rotation =
            -30 + Math.random() * 60;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        heart.style.setProperty(
            "--dx",
            `${dx}px`
        );

        heart.style.setProperty(
            "--dy",
            `${dy}px`
        );

        heart.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );

        heart.style.animationDelay =
            `${i * 45}ms`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
}


/* =========================================================
   FINAL HEART BURST
========================================================= */

function finalBurst() {

    const symbols = [
        "♥",
        "♡",
        "i love you",
        "miss you",
        "always",
        "∞",
        "you & me"
    ];

    const total =
        window.innerWidth < 700 ? 28 : 55;

    for (let i = 0; i < total; i++) {

        setTimeout(() => {

            const el =
                document.createElement("div");

            el.className = "love-particle";

            el.textContent =
                symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
                ];

            el.style.left = "50vw";
            el.style.top = "50vh";

            el.style.fontSize =
                `${9 + Math.random() * 11}px`;

            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                80 + Math.random() * 350;

            const x =
                Math.cos(angle) * distance;

            const y =
                Math.sin(angle) * distance;

            const rotate =
                -90 + Math.random() * 180;

            const animation =
                el.animate(
                    [
                        {
                            transform:
                                "translate(-50%, -50%) scale(.15) rotate(0deg)",
                            opacity: 0
                        },

                        {
                            transform:
                                `translate(
                  calc(-50% + ${x * .55}px),
                  calc(-50% + ${y * .55}px)
                )
                scale(1.15)
                rotate(${rotate / 2}deg)`,
                            opacity: 1
                        },

                        {
                            transform:
                                `translate(
                  calc(-50% + ${x}px),
                  calc(-50% + ${y}px)
                )
                scale(.5)
                rotate(${rotate}deg)`,
                            opacity: 0
                        }
                    ],
                    {
                        duration:
                            1500 + Math.random() * 1200,

                        easing:
                            "cubic-bezier(.16,.72,.25,1)"
                    }
                );

            document.body.appendChild(el);

            animation.onfinish = () => {
                el.remove();
            };

        }, i * 28);
    }
}


/* =========================================================
   MOUSE PARALLAX
========================================================= */

let mouseX = 0;
let mouseY = 0;

document.addEventListener(
    "pointermove",
    event => {

        mouseX =
            (event.clientX / window.innerWidth - .5) * 2;

        mouseY =
            (event.clientY / window.innerHeight - .5) * 2;

    },
    { passive: true }
);

function animateParallax() {

    const activeScene =
        document.querySelector(".scene.active");

    if (activeScene) {

        const giant =
            activeScene.querySelector(".giant-word");

        if (giant) {

            giant.style.setProperty(
                "--parallax-x",
                `${mouseX * 20}px`
            );
        }

        const ring =
            activeScene.querySelector(".memory-ring");

        if (ring) {

            ring.style.marginTop =
                `${mouseY * 10}px`;

            ring.style.marginLeft =
                `${mouseX * 10}px`;
        }

        const heartbeat =
            activeScene.querySelector(".heartbeat");

        if (heartbeat) {

            heartbeat.style.marginTop =
                `${mouseY * 10}px`;

            heartbeat.style.marginRight =
                `${mouseX * 10}px`;
        }
    }

    requestAnimationFrame(animateParallax);
}

requestAnimationFrame(animateParallax);


/* =========================================================
   BUTTON MAGNETIC EFFECT
========================================================= */

const magneticButtons =
    document.querySelectorAll(
        "#enterBtn, #againBtn, .next-btn"
    );

magneticButtons.forEach(button => {

    button.addEventListener(
        "pointermove",
        event => {

            const rect =
                button.getBoundingClientRect();

            const x =
                event.clientX -
                (rect.left + rect.width / 2);

            const y =
                event.clientY -
                (rect.top + rect.height / 2);

            button.style.transform =
                `translate(${x * .10}px, ${y * .10}px)`;
        }
    );

    button.addEventListener(
        "pointerleave",
        () => {

            button.style.transform = "";
        }
    );

});


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowRight" &&
            currentScene < 4
        ) {
            changeScene(currentScene + 1);
        }

        if (
            event.key === "ArrowLeft" &&
            currentScene > 1
        ) {
            changeScene(currentScene - 1);
        }

        if (event.key === "Escape") {
            changeScene(1);
        }
    }
);


/* =========================================================
   MOBILE SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.screenX;

        touchStartY =
            touch.screenY;
    },
    { passive: true }
);

document.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];

        const dx =
            touchStartX -
            touch.screenX;

        const dy =
            touchStartY -
            touch.screenY;

        if (Math.abs(dx) < 60) {
            return;
        }

        if (Math.abs(dx) < Math.abs(dy)) {
            return;
        }

        if (
            dx > 0 &&
            currentScene < 4
        ) {
            changeScene(currentScene + 1);
        }

        if (
            dx < 0 &&
            currentScene > 1
        ) {
            changeScene(currentScene - 1);
        }

    },
    { passive: true }
);


/* =========================================================
   AGAIN BUTTON
========================================================= */

againBtn.addEventListener(
    "click",
    event => {

        createTouchEffect(
            event.clientX,
            event.clientY
        );

        setTimeout(() => {

            changeScene(1);

        }, 180);
    }
);


/* =========================================================
   INITIAL EXTRA PARTICLES
========================================================= */

setTimeout(() => {

    for (let i = 0; i < 8; i++) {
        createFloatingWords(1);
    }

}, 1200);