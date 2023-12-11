async function calculate() {
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);

    const result = num1 + num2;

    document.getElementById("result").innerText = `Result: ${result}`;

    // Save data to server
    const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num1, num2, result }),
    });

    const data = await response.json();
    console.log(data);
}

async function printToPDF() {
    // Send request to server to print Excel sheet as PDF
    try {
        const response = await fetch('/print');
        const blob = await response.blob();

        // Create a link element and trigger a download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error fetching or handling PDF:', error);
    }
}
