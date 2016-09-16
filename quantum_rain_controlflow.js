


build_canvas = function(){
    place_of_quantum_canvas = getRandomIntInclusive(0, 2);
    order_of_canvas = '<center>';
    if (place_of_quantum_canvas == 0) {
        order_of_canvas += '<canvas id="canvas_right" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_left" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas" width="300" height="500"></canvas>';
    }
    if (place_of_quantum_canvas == 1) {
        order_of_canvas += '<canvas id="canvas" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_right" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_left" width="300" height="500"></canvas>';
    }
    if (place_of_quantum_canvas == 2) {
        order_of_canvas += '<canvas id="canvas_left" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_right" width="300" height="500"></canvas>';
    }
    order_of_canvas += '</center>';
    $("#canvas_order").html(order_of_canvas);
    showSlide('canvas_order');
};

build_canvas();

// instruction_html = 'Instructions: Find the odd one out. Use the keys 1, 2, 3 to select left, center and right, respectively. Use space bar to move to next slide.';
// instruction_html += '<button type="button" onClick="build_canvas()">Start</button>';


// $("#instructions").html(instruction_html);
// showSlide('instructions');



