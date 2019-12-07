// World parameters
const ignition_rate = { min: 0, max: 0.7, default: 0.5, step: 0.01, element: document.getElementById("ignition_slider"), reset: document.getElementById("ignition_reset") };
const sprout_rate = { min: 0, max: 0.1, default: 0.001, step: 0.001, element: document.getElementById("sprout_slider"), reset: document.getElementById("sprout_reset") };
const initial_density = { min: 0, max: 1, default: 0.1, step: 0.01, element: document.getElementById("density_slider"), reset: document.getElementById("density_reset") };

// Tree parameters
const growth_rate = { min: 0, default: 0.5, max: 2, step: 0.01, element: document.getElementById("growth_slider"), reset: document.getElementById("growth_reset") };
const reproductive_maturity = { min: 0, default: 10, max: 100, step: 1, element: document.getElementById("maturity_slider"), reset: document.getElementById("maturity_reset") };
const seed_viability_rate = { min: 0, default: 0.01, max: 1, step: 0.01, element: document.getElementById("viability_slider"), reset: document.getElementById("viability_reset") };
const max_fire_resistance = { min: 0, default: 0.8, max: 1, step: 0.01, element: document.getElementById("resistance_slider"), reset: document.getElementById("resistance_reset") };

const sliders = [ignition_rate, sprout_rate, initial_density, growth_rate, reproductive_maturity, seed_viability_rate, max_fire_resistance]

// Set parameters for all sliders
for (slider of sliders) {
    slider.element.step = slider.step;
    slider.element.min = slider.min;
    slider.element.max = slider.max;
    slider.element.value = slider.default;
    // Store the default in the slider so that it can be accessed for resetting
    slider.element.setAttribute("default", slider.default);

    // Add reset button functionality
    slider.reset.addEventListener("click", function (e) {
        // Find the closest slider input in the same slider group
        let slider_element = $(this).closest("div.slider-group").find("input")[0];
        // Reset the slider to the stored default value
        slider_element.value = slider_element.getAttribute("default");
    });
}
