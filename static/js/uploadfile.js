function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');

    const file = fileInput.files[0];
    if (file) {
        const fileName = file.name;
        const fileType = file.type;

        const reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target.result;
            outputDiv.innerHTML = `<p>File Name: ${fileName}</p>`;
            outputDiv.innerHTML += `<p>File Type: ${fileType}</p>`;
            outputDiv.innerHTML += '<hr>';
            
            // Display file contents (you may want to handle different file types differently)
            if (fileType === 'application/pdf') {
                // Handle PDF content
                // Example: outputDiv.innerHTML += `<p>${contents}</p>`;
            } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // Handle Word document content
                // Example: outputDiv.innerHTML += `<p>${contents}</p>`;
            } else {
                outputDiv.innerHTML += `<p>Unsupported file type: ${fileType}</p>`;
            }
        };

        reader.readAsText(file);
    } else {
        outputDiv.innerHTML = "<p>No file selected</p>";
    }
}