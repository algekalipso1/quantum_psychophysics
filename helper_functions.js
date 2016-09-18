// Generic Functions
// Verify that this is indeed random and unbiased.
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showSlide(id) {
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#"+id).show(); //jquery - element with given id - show
}

// Functions specific for the trials.
function create_paths_based_on_sequence(n_particles, number_of_steps, sequence, sixteen_bit) {
  var new_sequence;
  if (sixteen_bit) {
    new_sequence = unravel_sixteen_bit_sequence(sequence);
  } else {
    new_sequence = sequence;
  }
  number_of_entries = new_sequence.length;
  index_of_sequence = 0;
  processed_steps = [];
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
    processed_steps.push(sequence_for_ith_particle);
  }
  return processed_steps;
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

// This function pre-builds classically random data ready to consume by the classical canvases.
function pre_compute_random_steps(size_of_presequence, number_of_requests) {
  array_of_sequences = [];
  for (var i = 0; i < number_of_requests; i++) {
    ith_sequence = [];
    for (var j = 0; j < size_of_presequence; j++) {
      ith_sequence.push(x_change(getRandomIntInclusive(0, 3)));
    }
    array_of_sequences.push(ith_sequence);
  }
  return array_of_sequences;
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