<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smog Quality Indicator</title>
  <link rel="stylesheet" href="Style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- CDN for Chart.js -->
</head>
<body>
  <!-- Display Date and Time -->
  <div id="dateTime"></div>
  <h1>Smog Quality Indicator</h1>
  
  <!-- Table for displaying the latest smog parameter values -->
  <table id="chemicalTable">
    <tr>
      <th>Chemical Parameter</th>
      <th>Value (μg/m³)</th>
      <th>Status</th>
    </tr>
    <!-- Dynamic rows for each chemical parameter will be populated here -->
  </table>

  <!-- Chart for displaying chemical levels -->
  <div id="chartsContainer">
    <div class="chart-container">
      <canvas id="myChart"></canvas>
    </div>
  </div>

  <!-- JavaScript for updating the chart and table -->
  <script>
    // Fetch data from ThingSpeak channel
    const channelID = 2780006; // Replace with your channel ID
    const apiKey = 'FZU7D6A7884LXLPN'; // Replace with your Read API Key

    // Function to update the chemical parameters table with latest data
    const updateChemicalTable = (no2, vocs, nh3, co2, co) => {
      const table = document.getElementById('chemicalTable');
      // Clear the table (except for the header row)
      table.innerHTML = `
        <tr>
          <th>Chemical Parameter</th>
          <th>Value (μg/m³)</th>
          <th>Status</th>
        </tr>`;

      // Update the table with the latest values for each chemical
      const chemicals = [
        { name: 'NO₂', value: no2, status: no2 > 1000 ? 'High' : 'Normal' },
        { name: 'VOCs', value: vocs, status: vocs > 1000 ? 'High' : 'Normal' },
        { name: 'NH₃', value: nh3, status: nh3 > 1000 ? 'High' : 'Normal' },
        { name: 'CO₂', value: co2, status: co2 > 1000 ? 'High' : 'Normal' },
        { name: 'CO', value: co, status: co > 1000 ? 'High' : 'Normal' },
      ];

      // Add rows to the table dynamically for each chemical
      chemicals.forEach(chemical => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${chemical.name}</td>
          <td>${chemical.value}</td>
          <td>${chemical.status}</td>
        `;
        table.appendChild(row);
      });
    };

    // Function to fetch and update chart data
    const updateChart = () => {
      fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=1`)
        .then(response => response.json())
        .then(data => {
          // Get the latest data from the fields (Field 1, Field 2, Field 3, etc.)
          const no2Level = data.feeds[0].field1 || 0;
          const vocsLevel = data.feeds[0].field2 || 0;
          const nh3Level = data.feeds[0].field3 || 0;
          const co2Level = data.feeds[0].field4 || 0;
          const coLevel = data.feeds[0].field5 || 0;

          // Update the table with the latest data
          updateChemicalTable(no2Level, vocsLevel, nh3Level, co2Level, coLevel);

          // Update the chart
          chart.data.datasets[0].data.push(no2Level); // Update NO₂ data
          chart.data.datasets[1].data.push(vocsLevel); // Update VOCs data
          chart.data.datasets[2].data.push(nh3Level); // Update NH₃ data
          chart.data.datasets[3].data.push(co2Level); // Update CO₂ data
          chart.data.datasets[4].data.push(coLevel); // Update CO data

          // Remove the oldest data to keep the chart size constant (optional)
          if (chart.data.datasets[0].data.length > 7) {
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
            chart.data.datasets[2].data.shift();
            chart.data.datasets[3].data.shift();
            chart.data.datasets[4].data.shift();
          }

          chart.update(); // Refresh the chart
        })
        .catch(error => console.error("Error fetching data: ", error));
    };

    // Initialize the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6'], // These labels can represent days, hours, etc.
        datasets: [{
          label: 'NO₂ Level',
          data: [0, 0, 0, 0, 0, 0], // Initial data for NO₂
          borderColor: 'rgba(255, 0, 0, 0.7)',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          fill: false
        }, {
          label: 'VOCs Level',
          data: [0, 0, 0, 0, 0, 0], // Initial data for VOCs
          borderColor: 'rgba(0, 128, 255, 0.7)',
          backgroundColor: 'rgba(0, 128, 255, 0.3)',
          fill: false
        }, {
          label: 'NH₃ Level',
          data: [0, 0, 0, 0, 0, 0], // Initial data for NH₃
          borderColor: 'rgba(0, 255, 0, 0.7)',
          backgroundColor: 'rgba(0, 255, 0, 0.3)',
          fill: false
        }, {
          label: 'CO₂ Level',
          data: [0, 0, 0, 0, 0, 0], // Initial data for CO₂
          borderColor: 'rgba(255, 165, 0, 0.7)',
          backgroundColor: 'rgba(255, 165, 0, 0.3)',
          fill: false
        }, {
          label: 'CO Level',
          data: [0, 0, 0, 0, 0, 0], // Initial data for CO
          borderColor: 'rgba(0, 0, 0, 0.7)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Update chart and table data every 10 seconds
    setInterval(updateChart, 10000);
  </script>
</body>
</html>
