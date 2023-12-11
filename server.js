
const express = require('express');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint for calculating and saving to Excel
app.post('/calculate', (req, res) => {
    const { num1, num2, result } = req.body;

    // Save the result to Excel
    saveToExcel(num1, num2, result);

    res.json({ message: 'Calculation saved to Excel.' });
});

// Endpoint for generating PDF from Excel
app.get('/print', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('public/result.xlsx');
        const pdfBuffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error serving PDF directly:', error);
        res.status(500).json({ message: 'Error serving PDF directly.' });
    }
});

// Function to save data to Excel
function saveToExcel(num1, num2, result) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.addRow(['Number 1', 'Number 2', 'Result']);
    worksheet.addRow([num1, num2, result]);

    workbook.xlsx.writeFile('public/result.xlsx')
        .then(() => {
            console.log('Excel file saved.');
        })
        .catch((err) => {
            console.error('Error saving Excel file:', err);
        });
}

// Function to generate PDF from Excel file
async function generatePDF(res) {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('public/result.xlsx');

        // Generate PDF from Excel
        const pdfBuffer = await workbook.xlsx.writeBuffer();

        console.log('PDF generated successfully');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="result.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF.' });
    }
}
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});