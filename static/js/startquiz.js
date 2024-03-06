function calculateScore() {
    let score = 0;

    for (let i = 1; i <= 9; i++) {
        const selectedValue = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedValue) {
            score += parseInt(selectedValue.value);
        }
    }

    // Calculate score for hyperactive symptoms (questions 10-18) Repeat the above loop for questions 10-18
    for (let i = 10; i <= 18; i++) {
        const selectedValue = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedValue) {
            score += parseInt(selectedValue.value);
        }
    }

    let result = "";
    if (score < 14) {
        result = "You are not likely to have ADHD.";
    } else if (score >= 14 && score <= 28) {
        result = "You are likely to have ADHD.";
    } else {
        result = "You are very likely to have ADHD.";
    }

    // document.getElementById("result").innerText = result;
    alert(result);

    // Redirect after 5 seconds
    setTimeout(function() {
        window.location.href = "http://127.0.0.1:5000/student";
    }, 10);
}

