

document.addEventListener('DOMContentLoaded', function () {

    // Access the markdown content from the script block
    var markdownContent = window.markdownContent;
    var contentScore = window.contentScore;
    var wordingScore = window.wordingScore;

    // muliply the content score by 100 and round it to 2 decimal places 
    contentScore = (contentScore * 100).toFixed(2);
    wordingScore = (wordingScore * 100).toFixed(2);

    // add percentage sign to the content score and wording score
    contentScore += " %";
    wordingScore += " %";

    // remove ** from the markdown content
    markdownContent = markdownContent.replace(/\*\*/g, "");

    // add a line break after every : and period
    markdownContent = markdownContent.replace(/:/g, ":<br>");

    // add a line break after > and > > 
    markdownContent = markdownContent.replace(/>/g, ">:<br>");
    markdownContent = markdownContent.replace(/>>/g, ">>:<br>");

    //remove >: from the markdown content
    markdownContent = markdownContent.replace(/>:/g, "");

    //remove " *  from the markdown content
    markdownContent = markdownContent.replace(/ \* /g, "");
    markdownContent = markdownContent.replace(/\*/g, "");

    // remove inverted commas from the markdown content
    markdownContent = markdownContent.replace(/"/g, "");

    // Modify the content as needed
    var modifiedContent = markdownContent.replace(/Incomplete sentence/g, "Improved sentence");

    // Display the modified content in the HTML
    document.getElementById('markdownContent').innerHTML = modifiedContent;
    document.getElementById('contentScore').innerHTML = contentScore;
    document.getElementById('wordingScore').innerHTML = wordingScore;
});



