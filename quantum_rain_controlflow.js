
document.addEventListener('keydown', function(event) {
    if (String.fromCharCode(event.keyCode) == "1") {
        // Used for the "Left" button.
        if (trial_in_progress == 1) {
            $('#left_b').click();
        }
    }
    if (String.fromCharCode(event.keyCode) == "2") {
        // Used for the "Left" button.
        if (trial_in_progress == 1) {
            $('#center_b').click();
        }
    }
    if (String.fromCharCode(event.keyCode) == "3") {
        // Used for the "Left" button.
        if (trial_in_progress == 1) {
            $('#right_b').click();
        }
    }
    if (String.fromCharCode(event.keyCode) == " ") {
        // Used for the "Left" button.
        if (trial_in_progress == 0) {
            $('#begin_b').click();
        }
    }
}, true);



instruction_html = 'Instructions: Find the odd one out. Use the keys 1, 2, 3 to select left, center and right, respectively. Use space bar to move to next slide.';
instruction_html += '<br><br><center><button type="button" id="begin_b" onClick="build_canvas()">Start</button></center>';


$("#instructions").html(instruction_html);
showSlide('instructions');

build_canvas = function(){
    place_of_quantum_canvas = experiment.quantum_locations[experiment.current_trial]; //getRandomIntInclusive(0, 2);
    trial_in_progress = 1;
    order_of_canvas = '<center>';
    if (place_of_quantum_canvas == 0) {
        order_of_canvas += '<canvas id="canvas_quantum" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_1" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_2" width="300" height="500"></canvas>';
    }
    if (place_of_quantum_canvas == 1) {
        order_of_canvas += '<canvas id="canvas_2" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_quantum" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_1" width="300" height="500"></canvas>';
    }
    if (place_of_quantum_canvas == 2) {
        order_of_canvas += '<canvas id="canvas_1" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_2" width="300" height="500"></canvas>';
        order_of_canvas += '<canvas id="canvas_quantum" width="300" height="500"></canvas>';
    }
    order_of_canvas += '</center>';
    order_of_canvas += '<br><center><button type="button" id="left_b" onClick="store_response_and_move_on(0)">Left</button>';
    order_of_canvas += '<button type="button" id="center_b" onClick="store_response_and_move_on(1)">Center</button>';
    order_of_canvas += '<button type="button" id="right_b" onClick="store_response_and_move_on(2)">Right</button></center>';
    order_of_canvas += '<br><br><br><center><button type="button" onClick="show_results(); trial_in_progress = 0;">Finish</button></center>';
    $("#canvas_order").html(order_of_canvas);
    showSlide('canvas_order');

    //Left canvas
    var canvas_l = document.getElementById("canvas_1");
    var ctx_l = canvas_l.getContext("2d");

    var particles_l = d3.range(experiment.num).map(function(i) {
      return [Math.round(experiment.width*Math.random()), 0];
    });

    var particle_colors_l = d3.range(experiment.num).map(function(i) {
      return [chooseColor()];
    });

    //Center canvas
    var canvas = document.getElementById("canvas_2");
    var ctx = canvas.getContext("2d");

    var particles = d3.range(experiment.num).map(function(i) {
      return [Math.round(experiment.width*Math.random()), 0];
    });

    var particle_colors = d3.range(experiment.num).map(function(i) {
      return [chooseColor()];
    });

    //Right canvas
    var canvas_r = document.getElementById("canvas_quantum");
    var ctx_r = canvas_r.getContext("2d");

    var particles_r = d3.range(experiment.num).map(function(i) {
      return [Math.round(experiment.width*Math.random()), 0];
    });

    var particle_colors_r = d3.range(experiment.num).map(function(i) {
      return [chooseColor()];
    });

    var httpRequest; // Global variable to share with request_anu_random and alert_with_contents
    var qrand_data;
    var stored_rdata_index; // Index for the step in classy_steps and quantum_steps
    var left_index = 0;
    var center_index = 0;
    var right_index = 0;
    var first_request;
    var quantum_steps; // The quantum random n_particle*number_of_steps movement prescriptions.
    var classy_steps; // The classically determined n_particle*number_of_steps movement prescriptions.

    classical_presequences_1 = pre_compute_random_steps(experiment.size_of_classically_random_presequence, experiment.number_of_requests_per_trial);
    classical_presequences_2 = pre_compute_random_steps(experiment.size_of_classically_random_presequence, experiment.number_of_requests_per_trial);
    first_request = true;
    request_anu_random(); // Request the first set of random data before the animation begins.

    function refresh_qrand_data() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          response = JSON.parse(httpRequest.responseText);
          qrand_data = response.data;
          quantum_steps = create_paths_based_on_sequence(experiment.num, experiment.planned_steps, qrand_data, true);
          classy_steps_1 = create_paths_based_on_sequence(experiment.num, experiment.planned_steps, classical_presequences_1[experiment.request_number], false);
          classy_steps_2 = create_paths_based_on_sequence(experiment.num, experiment.planned_steps, classical_presequences_2[experiment.request_number], false);
          stored_rdata_index = 0;
          left_index = 0;
          center_index = 0;
          right_index = 0;
          if (first_request) {
            first_request = false;
            last_timer_id = setInterval(request_anu_random, experiment.seconds_between_requests * 1000); // Every 5 seconds
            id_1 = setInterval(step_1, 16);
            id_2 = setInterval(step_2, 16);
            id_q = setInterval(step_quantum, 16);
            // d3.timer(step_quantum);
            // d3.timer(step_2);
            // d3.timer(step_1);
          }
        } else {
          // Might be useful, but don't want to alert.
          // alert('There was a problem with the request.');
        }
      }
    }

    function request_anu_random() {
      if (experiment.request_number + 1 < experiment.number_of_requests_per_trial) {
        experiment.request_number++;
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return false;
        }

        //url = "https://qrng.anu.edu.au/API/jsonI.php?length=169&type=uint16"
        url = "https://qrng.anu.edu.au/API/jsonI.php?length=" + String(experiment.size_of_request) + "&type=uint16";

        httpRequest.onreadystatechange = refresh_qrand_data;
        httpRequest.open('GET', url);
        httpRequest.send();
      }
    }

    // Classic random numbers on the fly
    function step_1() {
      ctx_l.fillStyle = "rgba(0,0,0,0.2)";
      ctx_l.fillRect(0,0,experiment.width,experiment.height);
      for (var i = 0; i < experiment.num; i++) {
        ctx_l.fillStyle = "rgba(255,255,255,.9)";//particle_colors_l[i]
        p = particles_l[i];
        //p[0] += x_change(getRandomIntInclusive(0, 3)); //Math.round(4*Math.random()-2);
        if (left_index < experiment.planned_steps) {
          p[0] += classy_steps_1[i][left_index];//x_change(getRandomIntInclusive(0, 3));
          p[1] += 1; //Math.round(2*Math.random()-1);
        } else {
          p[0] += 0; //x_change(getRandomIntInclusive(0, 3));
          p[1] += 0; //Math.round(2*Math.random()-1);
        }
        if (p[0] < 0) p[0] = p[0] + experiment.width;
        if (p[0] > experiment.width) p[0] = p[0] % experiment.width;
        if (p[1] < 0) p[1] = p[1] + experiment.height;
        if (p[1] > experiment.height) p[1] = p[1] % experiment.height;
        ctx_l.fillRect(p[0],p[1],experiment.ps,experiment.ps);
      }
      left_index++;
    }

    // Classic random numbers every cylce.
    function step_2() {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0,0,experiment.width,experiment.height);
      for (var i = 0; i < experiment.num; i++) {
        ctx.fillStyle = "rgba(255,255,255,.9)";//particle_colors[i]
        p = particles[i];
        //p[0] += classy_steps[i][center_index % experiment.planned_steps]; // Math.round(4*Math.random()-2);
        if (center_index < experiment.planned_steps) {
          p[0] += classy_steps_2[i][center_index];
          p[1] += 1; //Math.round(2*Math.random()-1);
        } else {
          p[0] += 0; //x_change(getRandomIntInclusive(0, 3));
          p[1] += 0; //Math.round(2*Math.random()-1);
        }
        if (p[0] < 0) p[0] = p[0] + experiment.width;
        if (p[0] > experiment.width) p[0] = p[0] % experiment.width;
        if (p[1] < 0) p[1] = p[1] + experiment.height;
        if (p[1] > experiment.height) p[1] = p[1] % experiment.height;
        ctx.fillRect(p[0],p[1],experiment.ps,experiment.ps);
      }
      center_index++;
    }

    // Quantum Random numbers every cycle.
    function step_quantum() {
      ctx_r.fillStyle = "rgba(0,0,0,0.2)";
      ctx_r.fillRect(0,0,experiment.width,experiment.height);
      for (var i = 0; i < experiment.num; i++) {
        ctx_r.fillStyle = "rgba(255,0,0,.9)";////particle_colors_r[i]
        p = particles_r[i];
        //p[0] += quantum_steps[i][right_index % experiment.planned_steps]; // Math.round(4*Math.random()-2);
        if (right_index < experiment.planned_steps) {
          p[0] += quantum_steps[i][right_index];
          p[1] += 1; //Math.round(2*Math.random()-1);
        } else {
          p[0] += 0; //x_change(getRandomIntInclusive(0, 3));
          p[1] += 0; //Math.round(2*Math.random()-1);
        }
        if (p[0] < 0) p[0] = p[0] + experiment.width;
        if (p[0] > experiment.width) p[0] = p[0] % experiment.width;
        if (p[1] < 0) p[1] = p[1] + experiment.height;
        if (p[1] > experiment.height) p[1] = p[1] % experiment.height;
        ctx_r.fillRect(p[0],p[1],experiment.ps,experiment.ps);
      }
      right_index++;
      if (right_index > experiment.planned_steps && experiment.request_number + 1 < experiment.number_of_requests_per_trial) {
        experiment.count_wrong++;
      }
    }
};

store_response_and_move_on = function(x){
    experiment.selected_locations.push(x);
    if (x == experiment.quantum_locations[experiment.current_trial]) {
        experiment.count_correct_selections += 1;
    }
    // Now update the variables in "experiment"
    experiment.wrong_steps_per_trial.push(experiment.count_wrong);
    experiment.current_trial += 1;
    experiment.completed_trials += 1;
    experiment.count_wrong = 0;
    experiment.request_number = 0;
    clearInterval(last_timer_id);
    clearInterval(id_1);
    clearInterval(id_2);
    clearInterval(id_q);
    if (experiment.completed_trials >= experiment.total_number_of_trials) {
        trial_in_progress = 0;
        show_results();
    } else {
        build_canvas();
    }
};


show_results = function(){
    results_html = "Here are the results <br>";
    results_html += "Corrects " + String(experiment.count_correct_selections) + "<br>";
    results_html += "Quantum placement sequence " + String(experiment.quantum_locations) + "<br>";
    results_html += "Selected locations " + String(experiment.selected_locations) + "<br>";
    results_html += "Stopped steps per trial (due to Network) " + String(experiment.wrong_steps_per_trial) + "<br>";
    $("#results").html(results_html);
    showSlide('results');
};




