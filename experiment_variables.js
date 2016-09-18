var experiment = {
    num: 1, // Number of points per canvas
    ps: 10, // Point size in pixels
    width: 300, // width of canvas
    height: 500, // height of canvas
    steps_per_second: 60, // measured steps per second using the d3.timer function (could also use setInterval)
    seconds_between_requests: 2, // The number of seconds that pass between requests.
    count_wrong: 0, // Number of times that a step was taken without fresh data.
    trial_length: 10, // In seconds
    quantum_locations: [],
    selected_locations: [],
    count_correct: 0,
    completed_trials: 0,
    wrong_steps_per_trial: [], // This keeps track of the number of times that each trials went wrong (network didn't respond in time.)
};

experiment.steps_between_requests = experiment.steps_per_second*experiment.seconds_between_requests;
experiment.planned_steps = Math.ceil(2.5*experiment.steps_between_requests); // err on the side of more
experiment.size_of_request = Math.ceil(experiment.num*experiment.planned_steps/8); // err on the side of more
experiment.size_of_classically_random_presequence = Math.ceil(experiment.num*experiment.planned_steps); // does not divide by 8 because we are getting already-x_changed step instructions. (e.g. -4, -1, 1, 4)
experiment.number_of_requests_per_trial =  Math.ceil(1.5*experiment.trial_length / experiment.seconds_between_requests); // err on the side of more