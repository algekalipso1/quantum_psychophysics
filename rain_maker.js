// //Center canvas
// var canvas = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");

// var particles = d3.range(experiment.num).map(function(i) {
//   return [Math.round(experiment.width*Math.random()), 0];
// });

// var particle_colors = d3.range(experiment.num).map(function(i) {
//   return [chooseColor()];
// });

// //Left canvas
// var canvas_l = document.getElementById("canvas_left");
// var ctx_l = canvas_l.getContext("2d");

// var particles_l = d3.range(experiment.num).map(function(i) {
//   return [Math.round(experiment.width*Math.random()), 0];
// });

// var particle_colors_l = d3.range(experiment.num).map(function(i) {
//   return [chooseColor()];
// });

// //Right canvas
// var canvas_r = document.getElementById("canvas_right");
// var ctx_r = canvas_r.getContext("2d");

// var particles_r = d3.range(experiment.num).map(function(i) {
//   return [Math.round(experiment.width*Math.random()), 0];
// });

// var particle_colors_r = d3.range(experiment.num).map(function(i) {
//   return [chooseColor()];
// });

// var httpRequest; // Global variable to share with request_anu_random and alert_with_contents
// var qrand_data;
// var stored_rdata_index; // Index for the step in classy_steps and quantum_steps
// var left_index = 0;
// var center_index = 0;
// var right_index = 0;
// var first_request;
// var quantum_steps; // The quantum random n_particle*number_of_steps movement prescriptions.
// var classy_steps; // The classically determined n_particle*number_of_steps movement prescriptions.
// var request_number = -1;

// function refresh_qrand_data() {
//   if (httpRequest.readyState === XMLHttpRequest.DONE) {
//     if (httpRequest.status === 200) {
//       response = JSON.parse(httpRequest.responseText);
//       qrand_data = response.data;
//       quantum_steps = create_paths_based_on_sequence(experiment.num, experiment.planned_steps, qrand_data, true);
//       classy_steps = create_paths_based_on_sequence(experiment.num, experiment.planned_steps, classica_presequences[request_number], false);
//       //quantum_steps = create_random_paths(experiment.num, experiment.planned_steps);
//       //classy_steps = create_random_paths(experiment.num, experiment.planned_steps);
//       stored_rdata_index = 0;
//       left_index = 0;
//       center_index = 0;
//       right_index = 0;
//       if (first_request) {
//         first_request = false;
//         setInterval(request_anu_random, experiment.seconds_between_requests * 1000); // Every 5 seconds
//         d3.timer(step_right);
//         d3.timer(step_center);
//         d3.timer(step_left);
//       }
//     } else {
//       // Might be useful, but don't want to alert.
//       // alert('There was a problem with the request.');
//     }
//   }
// }

// function request_anu_random() {
//   if (request_number < experiment.number_of_requests_per_trial) {
//     request_number++;
//     httpRequest = new XMLHttpRequest();
//     if (!httpRequest) {
//       alert('Giving up :( Cannot create an XMLHTTP instance');
//       return false;
//     }

//     //url = "https://qrng.anu.edu.au/API/jsonI.php?length=169&type=uint16"
//     url = "https://qrng.anu.edu.au/API/jsonI.php?length=" + String(experiment.size_of_request) + "&type=uint16";

//     httpRequest.onreadystatechange = refresh_qrand_data;
//     httpRequest.open('GET', url);
//     httpRequest.send();
//   }
// }


// classica_presequences = pre_compute_random_steps(experiment.size_of_classically_random_presequence, experiment.number_of_requests_per_trial);
// first_request = true;
// request_anu_random(); // Request the first set of random data before the animation begins.


// // Classic random numbers on the fly
// function step_left() {
//   ctx_l.fillStyle = "rgba(255,255,255,0.05)";
//   ctx_l.fillRect(0,0,experiment.width,experiment.height);
//   for (var i = 0; i < experiment.num; i++) {
//     ctx_l.fillStyle = "rgba(255,0,0,.9)";//particle_colors_l[i]
//     p = particles_l[i];
//     //p[0] += x_change(getRandomIntInclusive(0, 3)); //Math.round(4*Math.random()-2);
//     if (left_index < experiment.planned_steps) {
//       p[0] += x_change(getRandomIntInclusive(0, 3));
//       p[1] += 1; //Math.round(2*Math.random()-1);
//     } else {
//       p[0] += 0; //x_change(getRandomIntInclusive(0, 3));
//       p[1] += 0; //Math.round(2*Math.random()-1);
//     }
//     if (p[0] < 0) p[0] = p[0] + experiment.width;
//     if (p[0] > experiment.width) p[0] = p[0] % experiment.width;
//     if (p[1] < 0) p[1] = p[1] + experiment.height;
//     if (p[1] > experiment.height) p[1] = p[1] % experiment.height;
//     ctx_l.fillRect(p[0],p[1],experiment.ps,experiment.ps);
//   }
//   left_index++;
// }

// // Classic random numbers every cylce.
// function step_center() {
//   ctx.fillStyle = "rgba(255,255,255,0.05)";
//   ctx.fillRect(0,0,experiment.width,experiment.height);
//   for (var i = 0; i < experiment.num; i++) {
//     ctx.fillStyle = "rgba(0,255,0,.9)";//particle_colors[i]
//     p = particles[i];
//     //p[0] += classy_steps[i][center_index % experiment.planned_steps]; // Math.round(4*Math.random()-2);
//     if (center_index < experiment.planned_steps) {
//       p[0] += classy_steps[i][center_index];
//       p[1] += 1; //Math.round(2*Math.random()-1);
//     } else {
//       p[0] += 0; //x_change(getRandomIntInclusive(0, 3));
//       p[1] += 0; //Math.round(2*Math.random()-1);
//     }
//     if (p[0] < 0) p[0] = p[0] + experiment.width;
//     if (p[0] > experiment.width) p[0] = p[0] % experiment.width;
//     if (p[1] < 0) p[1] = p[1] + experiment.height;
//     if (p[1] > experiment.height) p[1] = p[1] % experiment.height;
//     ctx.fillRect(p[0],p[1],experiment.ps,experiment.ps);
//   }
//   center_index++;
// }

// // Quantum Random numbers every cycle.
// function step_right() {
//   ctx_r.fillStyle = "rgba(255,255,255,0.05)";
//   ctx_r.fillRect(0,0,experiment.width,experiment.height);
//   for (var i = 0; i < experiment.num; i++) {
//     ctx_r.fillStyle = "rgba(0,0,255,.9)";////particle_colors_r[i]
//     p = particles_r[i];
//     //p[0] += quantum_steps[i][right_index % experiment.planned_steps]; // Math.round(4*Math.random()-2);
//     if (right_index < experiment.planned_steps) {
//       p[0] += quantum_steps[i][right_index];
//       p[1] += 1; //Math.round(2*Math.random()-1);
//     } else {
//       p[0] += 0; //x_change(getRandomIntInclusive(0, 3));
//       p[1] += 0; //Math.round(2*Math.random()-1);
//     }
//     if (p[0] < 0) p[0] = p[0] + experiment.width;
//     if (p[0] > experiment.width) p[0] = p[0] % experiment.width;
//     if (p[1] < 0) p[1] = p[1] + experiment.height;
//     if (p[1] > experiment.height) p[1] = p[1] % experiment.height;
//     ctx_r.fillRect(p[0],p[1],experiment.ps,experiment.ps);
//   }
//   right_index++;
//   if (right_index > experiment.planned_steps && request_number < experiment.number_of_requests_per_trial) {
//     experiment.count_wrong++;
//   }
// }


