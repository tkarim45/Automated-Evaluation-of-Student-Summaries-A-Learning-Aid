function submitSummary() {
    var summary = document.getElementById("summary").value;

    // Using AJAX to send the summary to the server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/adhd/submit_summary", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                // Access the values from the JSON response
                var markdownContent = response.markdown_content;
                var contentScore = response.content_score;
                var wordingScore = response.wording_score;

                // Redirect to the results page with the markdown_content as a query parameter
                window.location.href = "/resultsadhd?markdown_content=" + encodeURIComponent(markdownContent) + "&content_score=" + contentScore + "&wording_score=" + wordingScore;
            } else {
                console.error("Failed to submit summary");
            }
        }
    };



    var data = JSON.stringify({ summary: summary });
    xhr.send(data);

    // print the summary to the console
    console.log(summary);
}

