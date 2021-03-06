var experiment = {
    num: 1, // Number of points per canvas
    ps: 3, // Point size in pixels
    width: 300, // width of canvas
    height: 500, // height of canvas
    steps_per_second: 60, // measured steps per second using the d3.timer function (could also use setInterval)
    seconds_between_requests: 1.6, // The number of seconds that pass between requests.
    trial_length: 10, // In seconds
    quantum_locations: [],
    selected_locations: [],
    count_correct_selections: 0,
    completed_trials: 0,
    wrong_steps_per_trial: [], // This keeps track of the number of times that each trials went wrong (network didn't respond in time.)
    total_number_of_trials: 30, // This is the variable that determines how many times the canvas is randomized. (number of datapoints).
    time_for_each_trial: [],
    // Below: Variables for each trial. Reset any time you start a new trial.
    request_number: 0,
    count_wrong: 0, // Number of times that a step was taken without fresh data.
    current_trial: 0,
};

experiment.steps_between_requests = experiment.steps_per_second*experiment.seconds_between_requests;
experiment.planned_steps = Math.ceil(3*experiment.steps_between_requests); // err on the side of more
experiment.size_of_request = Math.ceil(experiment.num*experiment.planned_steps/8); // err on the side of more
experiment.size_of_classically_random_presequence = Math.ceil(experiment.num*experiment.planned_steps); // does not divide by 8 because we are getting already-x_changed step instructions. (e.g. -4, -1, 1, 4)
experiment.number_of_requests_per_trial =  Math.ceil(1 + experiment.trial_length / experiment.seconds_between_requests); // err on the side of more

// Set all quantum locations in advance. (Maybe make this optional, in case information is thought to leak this way.).
for (var i = 0; i < experiment.total_number_of_trials; i++) {
    experiment.quantum_locations.push(getRandomIntInclusive(0, 2));
}

last_timer_id = '';
id_1 = '';
id_2 = '';
id_q = '';

// to track times.
var start = new Date().getTime();

// To keep track of whether trials are in progress.
trial_in_progress = 0; // 0 if not, 1 if yes.