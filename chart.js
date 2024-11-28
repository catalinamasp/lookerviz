const dscc = require('@google/dscc');
const d3 = require('d3');

// Render the visualization
const drawViz = (data) => {
  const svg = d3.select("svg");
  svg.selectAll("*").remove(); // Clear previous chart
  
  const width = 800;
  const height = 400;
  
  svg.attr("width", width).attr("height", height);
  
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const chart = svg.append("g")
                   .attr("transform", `translate(${margin.left},${margin.top})`);
  
  const x = d3.scalePoint()
              .domain(data.labels)
              .range([0, chartWidth]);
  
  const y = d3.scaleLinear()
              .domain([0, d3.max(data.datasets.flat())])
              .range([chartHeight, 0]);

  // Area chart (Actual Sales)
  const area = d3.area()
                 .x((d, i) => x(data.labels[i]))
                 .y0(chartHeight)
                 .y1(d => y(d));
  
  chart.append("path")
       .datum(data.datasets[0])
       .attr("fill", "lightblue")
       .attr("d", area);
  
  // Line charts (Profit and Expected Sales)
  const line = d3.line()
                 .x((d, i) => x(data.labels[i]))
                 .y(d => y(d));

  chart.append("path")
       .datum(data.datasets[1])
       .attr("fill", "none")
       .attr("stroke", "blue")
       .attr("d", line);

  chart.append("path")
       .datum(data.datasets[2])
       .attr("fill", "none")
       .attr("stroke", "orange")
       .attr("d", line);

  // Axes
  chart.append("g")
       .attr("transform", `translate(0,${chartHeight})`)
       .call(d3.axisBottom(x));

  chart.append("g")
       .call(d3.axisLeft(y));
};

// Parse data and render
dscc.subscribeToData((data) => {
  const parsedData = {
    labels: data.fields.dimensions[0].values,
    datasets: data.fields.metrics.map(metric => metric.values),
  };
  drawViz(parsedData);
});
