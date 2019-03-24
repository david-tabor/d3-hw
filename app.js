// Set up our chart
// =================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 100,
  right: 100,
  bottom: 60,
  left: 200
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data from the data.csv file
// =================================
d3.csv("data.csv", function (data) {

    // Cast numeric fields
  data.forEach(el => {
    el.poverty = +el.poverty;
    el.smokes = +el.smokes;
  });


  // Create LinearScales for for x and y data,
  // including padding
  // =============================================
  var scalePad = 0.1

  var xPaddedExtent = [
      (1-scalePad) * d3.min(data, d=>d.poverty), 
      (1+scalePad) * d3.max(data, d=>d.poverty)
    ]

  var yPaddedExtent = [
    (1-scalePad) * d3.min(data, d=>d.smokes), 
    (1+scalePad) * d3.max(data, d=>d.smokes)
  ]

  var xLinearScale = d3.scaleLinear()
    .domain(xPaddedExtent)
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain(yPaddedExtent)
    .range([height, 0]);



  // Plot data points.  Each data point is comprised of a marker 
  // (circle element) along with a text label (text element)
  // =============================================

  // Define marker attributes
  var circleRadius = 12;
  var circleColor = 'lightblue'
  var markerTextColor = 'white'

  // Plot circles
  chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", d => circleRadius)
    .style("fill", d => circleColor);

  // Plot text labels
  chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.smokes) + 0.4*circleRadius)
    .text(d => d.abbr)
    .style("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", circleRadius)
    .attr("fill", markerTextColor);



  // Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // Append the axes to the chartGroup
  // ==============================================
  // Add bottomAxis
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

  // text label for the bottom axis
  svg.append("text")             
  .attr("x", margin.left + (width / 2) + 15)
  .attr("y", margin.top + height + 35)    
  .style("text-anchor", "middle")
  .text("Smoker Rate (%)");

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);

  // text label for the left axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 35)
      .attr("x", 0 - (height / 2) - margin.top + 20)
      .style("text-anchor", "middle")
      .text("Poverty Rate (%)");  
      
});
