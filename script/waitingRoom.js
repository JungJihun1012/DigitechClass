const text = document.querySelector(".btn-glitch-active");
const filter = document.querySelector(".svg-sprite");
const turb = filter.querySelector('#filter feTurbulence');
let turbVal = {val: 0.000001};
let turbValX = {val: 0.000001};


const glitchTimeLine = function(){
    const timeline = new TimelineMax({
        repeat: -1,
        repeatDelay: 2,
        paused: true,
        onUpdate: function() {
            turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
        }
    });

    timeline
        .to(turbValX, 0.1, { val: 0.5 })
        .to(turbVal, 0.1, { val: 0.02 });
    timeline
        .set(turbValX, { val: 0.000001 })
        .set(turbVal, { val: 0.000001 });
    timeline
        .to(turbValX, 0.2, { val: 0.4 }, 0.4)
        .to(turbVal, 0.2, { val: 0.002 }, 0.4);
    timeline
        .set(turbValX, { val: 0.000001 })
        .set(turbVal, { val: 0.000001 });

    return {
        start: function() {
            timeline.play(0);
        },
        stop: function() {
            timeline.pause();
        }
    };
};

const btnGlitch = new glitchTimeLine();

const btns = document.querySelectorAll('.btn-glitch');

btns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
        btn.classList.add(".btn-glitch-active");
        btnGlitch.start();
    });
    btn.addEventListener("mouseleave", () => {
        if (btn.classList.contains('btn-glitch-active')) {
            btn.classList.remove('btn-glitch-active');
            btnGlitch.stop();
        }
    });
});