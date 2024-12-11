// Function to create the chart
function createChart(ctx, label, data, color) {
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: getWeekLabels(), // Days of the week
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: color,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Concentration (µg/m³)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Days of the Week'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('table tbody'); // Get the table body

    // Fetch the latest data from the PHP file
    fetch('http://192.168.100.96/Smog_Dashboard/fetch_data.php')
        .then(response => response.json())
        .then(data => {
            // Update the table with new data
            tableBody.innerHTML = ''; // Clear the table first
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${row.chemical_name}</td><td>${row.level}</td><td class="${row.status.toLowerCase()}">${row.status}</td>`;
                tableBody.appendChild(tr);
            });

            // Update the chart with new data
            updateCharts(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to update charts
    const updateCharts = (data) => {
        // Assuming you already have chart instances set up for each chemical
        chartData = {
            nitrogenDioxide: data.find(item => item.chemical_name === 'Nitrogen Dioxide (NO₂)').level,
            ozone: data.find(item => item.chemical_name === 'Ozone (O₃)').level,
            pm25: data.find(item => item.chemical_name === 'PM2.5').level,
            pm10: data.find(item => item.chemical_name === 'PM10').level,
            vocs: data.find(item => item.chemical_name === 'VOCs').level
        };

        // Update the charts (assuming the charts are already defined)
        nitrogenDioxideChart.data.datasets[0].data = [chartData.nitrogenDioxide];
        ozoneChart.data.datasets[0].data = [chartData.ozone];
        pm25Chart.data.datasets[0].data = [chartData.pm25];
        pm10Chart.data.datasets[0].data = [chartData.pm10];
        vocsChart.data.datasets[0].data = [chartData.vocs];

        // Update the chart
        nitrogenDioxideChart.update();
        ozoneChart.update();
        pm25Chart.update();
        pm10Chart.update();
        vocsChart.update();
    };
});

// Function to fetch data from the server
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('table tbody'); // Get the table body

  // Fetch the latest data from the PHP file
  fetch('http://192.168.100.96/Smog_Dashboard/fetch_data.php')
      .then(response => response.json())
      .then(data => {
          // Update the table with new data
          tableBody.innerHTML = ''; // Clear the table first
          data.forEach(row => {
              const tr = document.createElement('tr');
              tr.innerHTML = `<td>${row.chemical_name}</td><td>${row.level}</td><td class="${row.status.toLowerCase()}">${row.status}</td>`;
              tableBody.appendChild(tr);
          });

          // Update the chart with new data
          updateCharts(data);
      })
      .catch(error => console.error('Error fetching data:', error));

  // Function to update charts
  const updateCharts = (data) => {
      // Assuming you already have chart instances set up for each chemical
      chartData = {
          nitrogenDioxide: data.find(item => item.chemical_name === 'Nitrogen Dioxide (NO₂)').level,
          ozone: data.find(item => item.chemical_name === 'Ozone (O₃)').level,
          pm25: data.find(item => item.chemical_name === 'PM2.5').level,
          pm10: data.find(item => item.chemical_name === 'PM10').level,
          vocs: data.find(item => item.chemical_name === 'VOCs').level
      };

      // Update the charts (assuming the charts are already defined)
      nitrogenDioxideChart.data.datasets[0].data = [chartData.nitrogenDioxide];
      ozoneChart.data.datasets[0].data = [chartData.ozone];
      pm25Chart.data.datasets[0].data = [chartData.pm25];
      pm10Chart.data.datasets[0].data = [chartData.pm10];
      vocsChart.data.datasets[0].data = [chartData.vocs];

      // Update the chart
      nitrogenDioxideChart.update();
      ozoneChart.update();
      pm25Chart.update();
      pm10Chart.update();
      vocsChart.update();
  };
});

// Function to update the chart with new data
function updateChart(data) {
  // Assuming you have an array of data like:
  // data = [{chemical_name: 'Nitrogen Dioxide', level: 120, status: 'Unhealthy'}, ...]
  
  const chartData = data.map(item => item.level); // Get all levels from the data

  const chart = new Chart(document.getElementById('yourChartId').getContext('2d'), {
    type: 'line',
    data: {
      labels: data.map(item => item.chemical_name),  // Set chemical names as labels
      datasets: [{
        label: 'Gas Levels',
        data: chartData,
        borderColor: 'rgba(255, 0, 0, 0.7)',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        fill: false,
      }]
    }
  });
}

// Call the fetchData function every 10 seconds to update the data
setInterval(fetchData, 10000);

  // Store chart instance for later updates
  charts[label] = chart;
}

// Function to get labels (Days of the Week)
function getWeekLabels() {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
}

// Initialize charts on page load
document.addEventListener('DOMContentLoaded', () => {
  // Create charts for each chemical, including Nitrogen Dioxide (NO₂)
  createChart(document.getElementById('nitrogenDioxideChart').getContext('2d'), 'Nitrogen Dioxide (NO₂)', chartData["Nitrogen Dioxide (NO₂)"].data, chartData["Nitrogen Dioxide (NO₂)"].color);
  createChart(document.getElementById('ozoneChart').getContext('2d'), 'Ozone (O₃)', chartData["Ozone (O₃)"].data, chartData["Ozone (O₃)"].color);
  createChart(document.getElementById('pm25Chart').getContext('2d'), 'PM2.5', chartData["PM2.5"].data, chartData["PM2.5"].color);
  createChart(document.getElementById('pm10Chart').getContext('2d'), 'PM10', chartData["PM10"].data, chartData["PM10"].color);
  createChart(document.getElementById('vocsChart').getContext('2d'), 'VOCs', chartData["VOCs"].data, chartData["VOCs"].color);
});

