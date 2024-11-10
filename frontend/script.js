// Add an event listener to the 'fetchDataBtn' button for the 'click' event
document.getElementById('fetchDataBtn').addEventListener('click', async () => {
    
    // Get the URL entered by the user from the input field with id 'urlInput'
    const url = document.getElementById('urlInput').value;
    
    // Get the number of top words to display from the input field with id 'topNInput' and convert it to an integer
    const topN = parseInt(document.getElementById('topNInput').value);

    // Check if the URL field is empty
    if (!url) {
        // If the URL is not entered, display an alert to the user
        alert('Please enter a URL');
        return;  // Stop further execution of the function if URL is empty
    }
    
    // Check if the 'topN' value is invalid (not a number or less than 1)
    if (!topN || topN < 1) {
        // If 'topN' is invalid, display an alert to the user
        alert('Please enter a valid number for top N words');
        return;  // Stop further execution of the function if 'topN' is invalid
    }

    // Make a POST request to the backend server at 'http://localhost:5000/api/frequency'
    // The request body contains the URL and topN values as JSON
    const response = await fetch('http://localhost:5000/api/frequency', {
        method: 'POST',  // Using POST method to send data
        headers: {
            'Content-Type': 'application/json',  // The content type of the request is JSON
        },
        body: JSON.stringify({ url, topN }),  // Send the URL and topN as the body in JSON format
    });

    // Parse the JSON response from the backend
    const data = await response.json();

    // Check if there is any error in the response
    if (data.error) {
        // If there is an error, display an alert to the user
        alert(data.error);
    } else {
        // If the response is valid (no error), get the tbody element inside the table with id 'wordTable'
        const tbody = document.querySelector('#wordTable tbody');
        
        // Clear any existing rows in the table before populating new data
        tbody.innerHTML = ''; 

        // Loop through each word-frequency pair in the response (which is an array of arrays)
        data.words.forEach(([word, freq]) => {
            // Create a new table row (tr) element
            const row = document.createElement('tr');
            
            // Add the word and its frequency to the row as table data (td)
            row.innerHTML = `<td>${word}</td><td>${freq}</td>`;
            
            // Append the new row to the tbody of the table
            tbody.appendChild(row);
        });
    }
});
