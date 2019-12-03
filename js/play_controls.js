document.getElementById("play-button").addEventListener("click", play);
document.getElementById("pause-button").addEventListener("click", pause);
document.getElementById("prev-button").addEventListener("click", prev_frame);
document.getElementById("next-button").addEventListener("click", next_frame);

// When reset button is clicked, pause world and launch modal to confirm
document.getElementById("reset-check-button").addEventListener("click", pause);
// If confirmed, reset the world
document.getElementById("reset-confirm-button").addEventListener("click", reset);
// If cancelled, start playback again
document.getElementById("reset-cancel-button").addEventListener("click", play);

document.getElementById("ignite-button").addEventListener("click", toggle_ignition);