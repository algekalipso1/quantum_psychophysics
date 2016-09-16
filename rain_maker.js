// number of points (per canvas) and point sizes.
var num = 3;
var ps = 10;

var width = 300;
var height = 500;

// Time and Steps
var steps_per_second = 60;
var seconds_between_requests = 1;
var steps_between_requests = steps_per_second*seconds_between_requests;
var planned_steps = Math.ceil(1.5*steps_between_requests);
var size_of_request = Math.ceil(num*planned_steps/8); // times 1.5 just to be safe with request times

var count_wrong = 0;

//Center canvas
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

var particles = d3.range(num).map(function(i) {
  return [Math.round(width*Math.random()), Math.round(height*Math.random())];
});

var particle_colors = d3.range(num).map(function(i) {
  return [chooseColor()];
});

//Left canvas
var canvas_l = document.getElementById("canvas_left");
var ctx_l = canvas_l.getContext("2d");

var particles_l = d3.range(num).map(function(i) {
  return [Math.round(width*Math.random()), Math.round(height*Math.random())];
});

var particle_colors_l = d3.range(num).map(function(i) {
  return [chooseColor()];
});

//Right canvas
var canvas_r = document.getElementById("canvas_right");
var ctx_r = canvas_r.getContext("2d");

var particles_r = d3.range(num).map(function(i) {
  return [Math.round(width*Math.random()), Math.round(height*Math.random())];
});

var particle_colors_r = d3.range(num).map(function(i) {
  return [chooseColor()];
});



// Classically random



var httpRequest; // Global variable to share with request_anu_random and alert_with_contents
var qrand_data;
var stored_rdata_index; // Index for the step in classy_steps and quantum_steps
var left_index = 0;
var center_index = 0;
var right_index = 0;
var first_request;
var quantum_steps; // The quantum random n_particle*number_of_steps movement prescriptions.
var classy_steps; // The classically determined n_particle*number_of_steps movement prescriptions.

function refresh_qrand_data() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      response = JSON.parse(httpRequest.responseText);
      qrand_data = response.data;
      quantum_steps = create_quantum_paths(num, planned_steps, qrand_data);
      classy_steps = create_random_paths(num, planned_steps);
      stored_rdata_index = 0;
      left_index = 0;
      center_index = 0;
      right_index = 0;
      if (first_request) {
        first_request = false;
        //setInterval(request_anu_random, seconds_between_requests * 1000); // Every 5 seconds
        d3.timer(step_right);
        d3.timer(step_center);
        d3.timer(step_left);
        //setInterval("alert(String(stored_rdata_index))", 5*1000)
      }
    } else {
      // Might be useful, but don't want to alert.
      // alert('There was a problem with the request.');
    }
  }
}

function request_anu_random() {
  httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }

  //url = "https://qrng.anu.edu.au/API/jsonI.php?length=169&type=uint16"
  url = "https://qrng.anu.edu.au/API/jsonI.php?length=" + String(size_of_request) + "&type=uint16";

  httpRequest.onreadystatechange = refresh_qrand_data;
  httpRequest.open('GET', url);
  httpRequest.send();
}

first_request = true;
request_anu_random(); // Request the first set of random data before the animation begins.


// Classic random numbers on the fly
function step_left() {
  ctx_l.fillStyle = "rgba(255,255,255,0.05)";
  ctx_l.fillRect(0,0,width,height);
  for (var i = 0; i < num; i++) {
    ctx_l.fillStyle = "rgba(255,0,0,.9)";//particle_colors_l[i]
    p = particles_l[i];
    p[0] += x_change(getRandomIntInclusive(0, 3)); //Math.round(4*Math.random()-2);
    p[1] += 1; //Math.round(2*Math.random()-1);
    if (p[0] < 0) p[0] = p[0] + width;
    if (p[0] > width) p[0] = p[0] % width;
    if (p[1] < 0) p[1] = p[1] + height;
    if (p[1] > height) p[1] = p[1] % height;
    ctx_l.fillRect(p[0],p[1],ps,ps);
  }
  left_index++;
}

// Classic random numbers every cylce.
function step_center() {
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0,0,width,height);
  for (var i = 0; i < num; i++) {
    ctx.fillStyle = "rgba(0,255,0,.9)";//particle_colors[i]
    p = particles[i];
    p[0] += classy_steps[i][center_index % planned_steps]; // Math.round(4*Math.random()-2);
    p[1] += 1; //Math.round(2*Math.random()-1);
    if (p[0] < 0) p[0] = p[0] + width;
    if (p[0] > width) p[0] = p[0] % width;
    if (p[1] < 0) p[1] = p[1] + height;
    if (p[1] > height) p[1] = p[1] % height;
    ctx.fillRect(p[0],p[1],ps,ps);
  }
  center_index++;
}

// Quantum Random numbers every cycle.
function step_right() {
  ctx_r.fillStyle = "rgba(255,255,255,0.05)";
  ctx_r.fillRect(0,0,width,height);
  for (var i = 0; i < num; i++) {
    ctx_r.fillStyle = "rgba(0,0,255,.9)";////particle_colors_r[i]
    p = particles_r[i];
    p[0] += quantum_steps[i][right_index % planned_steps]; // Math.round(4*Math.random()-2);
    p[1] += 1; //Math.round(2*Math.random()-1);
    if (p[0] < 0) p[0] = p[0] + width;
    if (p[0] > width) p[0] = p[0] % width;
    if (p[1] < 0) p[1] = p[1] + height;
    if (p[1] > height) p[1] = p[1] % height;
    ctx_r.fillRect(p[0],p[1],ps,ps);
  }
  right_index++;
  if (right_index > planned_steps) {
    count_wrong++;
  }
}




function create_quantum_paths(n_particles, number_of_steps, sequence) {
  new_sequence = unravel_sixteen_bit_sequence(sequence);
  number_of_entries = new_sequence.length;
  index_of_sequence = 0;
  quantum_steps = [];
  for (var i = 0; i < n_particles; i++) {
    sequence_for_ith_particle = [];
    for (var j = 0; j < number_of_steps; j++) {
      if (index_of_sequence < number_of_entries) {
        sequence_for_ith_particle.push(new_sequence[index_of_sequence]);
      } else {
        sequence_for_ith_particle.push(x_change(getRandomIntInclusive(0, 3)));
      }
      index_of_sequence += 1;
    }
    quantum_steps.push(sequence_for_ith_particle);
  }
  return quantum_steps;
}

// This transforms the qrand_data sequence into a set of usable random numbers in the set {-2, -1, 1, 2}
function unravel_sixteen_bit_sequence(sequence){
  number_of_entries = sequence.length;
  new_sequence = [];
  for (var i = 0; i < number_of_entries; i++) {
    bit_breakdown = sequence[i];
    for (var j = 0; j < 8; j++) {
      new_sequence.push(x_change(bit_breakdown % 4));
      bit_breakdown = Math.floor(bit_breakdown/4);
    }
  }
  return new_sequence;
}

// This function creates a double array n_particlesXnumber_of_steps of integers in the set {-2, -1, 1, 2}
function create_random_paths(n_particles, number_of_steps) {
  classy_steps = [];
  for (var i = 0; i < n_particles; i++) {
    var sequence_for_ith_particle = [];
    for (var j = 0; j < number_of_steps; j++) {
      sequence_for_ith_particle.push(x_change(getRandomIntInclusive(0, 3)));
    }
    classy_steps.push(sequence_for_ith_particle);
  }
  return classy_steps;
}

function x_change(d){
  mapping_function = [-4, -1, 1, 4];
  return mapping_function[d];
}

function chooseColor(){
  if (Math.random() < .33) {
    return "rgba(200,0,0,.9)";
  } else {
    return "rgba(0,0,0,0.3)";
  }
}
