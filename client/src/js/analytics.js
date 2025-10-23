// Dữ liệu mẫu (có thể thay bằng API)
const monthlyData = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10'],
  costs: [450000, 680000, 520000, 720000, 590000, 810000, 650000, 780000, 710000, 850000]
};

const hourlyData = {
  labels: Array.from({length: 24}, (_, i) => `${i}:00`),
  counts: [2, 1, 0, 0, 0, 1, 3, 5, 8, 7, 6, 5, 4, 4, 3, 5, 6, 8, 7, 6, 5, 4, 3, 2]
};

const topStations = {
  labels: ['Vincom Landmark 81', 'Ecopark', 'AEON Mall Tân Phú', 'Vincom Mega Mall', 'Trạm Lê Duẩn'],
  data: [35, 25, 20, 12, 8]
};

const powerData = {
  labels: ['Dưới 50kW', '50-100kW', 'Trên 100kW'],
  values: [30, 45, 25]
};

// Biểu đồ chi phí tháng
new Chart(document.getElementById('monthlyCostChart'), {
  type: 'bar',
  data: {
    labels: monthlyData.labels,
    datasets: [{
      label: 'Chi phí (đ)',
      data: monthlyData.costs,
      backgroundColor: 'rgba(76, 175, 80, 0.7)',
      borderColor: 'var(--accent)',
      borderWidth: 1,
      borderRadius: 8,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `${ctx.raw.toLocaleString()}đ` } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: value => `${value / 1000}k` } }
    }
  }
});

// Biểu đồ giờ sạc
new Chart(document.getElementById('hourlyChart'), {
  type: 'line',
  data: {
    labels: hourlyData.labels,
    datasets: [{
      label: 'Số lần sạc',
      data: hourlyData.counts,
      fill: true,
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderColor: 'var(--accent)',
      tension: 0.4,
      pointBackgroundColor: 'var(--accent)',
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

// Top trạm
new Chart(document.getElementById('topStationsChart'), {
  type: 'pie',
  data: {
    labels: topStations.labels,
    datasets: [{
      data: topStations.data,
      backgroundColor: [
        '#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'
      ],
      borderWidth: 0,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, font: { size: 14 } } }
    }
  }
});

// Công suất
new Chart(document.getElementById('powerChart'), {
  type: 'doughnut',
  data: {
    labels: powerData.labels,
    datasets: [{
      data: powerData.values,
      backgroundColor: ['#ff5252', '#4caf50', '#2196f3'],
      borderWidth: 0,
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }
});