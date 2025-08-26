import { ref, computed } from 'vue'

export const useCharts = () => {
  // Revenue Chart Options
  const getRevenueChartOptions = (data: { label: string, value: number }[]) => {
    return {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 2,
          columnWidth: '60%',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 0
      },
      xaxis: {
        categories: data.map(item => item.label),
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#9ca3af'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            return `$${value.toLocaleString()}`
          },
          style: {
            colors: '#9ca3af'
          }
        }
      },
      fill: {
        colors: ['#111827']
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return `$${value.toLocaleString()}`
          }
        }
      },
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        },
        xaxis: {
          lines: {
            show: false
          }
        }
      }
    }
  }

  // Occupancy Chart Options
  const getOccupancyChartOptions = (data: { label: string, value: number }[]) => {
    return {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#111827']
      },
      markers: {
        size: 5,
        colors: ['#111827'],
        strokeColors: '#ffffff',
        strokeWidth: 2
      },
      xaxis: {
        categories: data.map(item => item.label),
        labels: {
          style: {
            colors: '#9ca3af'
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: (value: number) => {
            return `${value}%`
          },
          style: {
            colors: '#9ca3af'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return `${value}%`
          }
        }
      },
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        },
        xaxis: {
          lines: {
            show: false
          }
        }
      }
    }
  }

  // Room Distribution Chart Options
  const getRoomDistributionChartOptions = (data: { label: string, value: number }[]) => {
    return {
      chart: {
        type: 'pie',
        height: 350,
        toolbar: {
          show: false
        }
      },
      labels: data.map(item => item.label),
      colors: ['#374151', '#4B5563', '#6B7280', '#9CA3AF'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 12,
          height: 12,
          radius: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 8
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '0%'
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return `${value}%`
          }
        }
      }
    }
  }

  return {
    getRevenueChartOptions,
    getOccupancyChartOptions,
    getRoomDistributionChartOptions
  }
}

