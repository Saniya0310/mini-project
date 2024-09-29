document.getElementById('smsForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const file = document.getElementById('fileInput').files[0];
    const index = document.getElementById('indexInput').value;

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            const phoneNumber = excelData[index - 1][0];  // Adjust based on the column

            if (phoneNumber) {
                sendSMS(phoneNumber);
            } else {
                alert('Invalid index or phone number not found.');
            }
        };
        reader.readAsArrayBuffer(file);
    }
});

function sendSMS(phoneNumber) {
    const message = "Your custom message here";  // Customize the message

    fetch('/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, message: message })
    })
    .then(response => response.json())
    .then(data => alert('Message sent successfully!'))
    .catch(error => console.error('Error:', error));
}
