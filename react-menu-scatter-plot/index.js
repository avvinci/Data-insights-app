var outerWidth = 800;
var outerHeight = 600;
var margin = { left: 70, top: 60, right: 40, bottom: 60 };

var innerWidth = outerWidth - margin.left - margin.right;
var innerHeight = outerHeight - margin.top - margin.bottom;

var rMin = 5;
var rMax = 17;
var xColumn = "Date";
var yColumn = "Dev";
var rColumn = "Stats";
var colorColumn = "Dev";
let xAxisLabelOffset = 50;
let xAxisLabelText = "Date";
let yAxisLabelOffset = 50;
let yAxisLabelText = "Development time (hr)";
let title = "A Year of development";

console.log("ds");
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight);

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.append("text")
  .attr("class", "title")
  .attr("y", -20)
  .text(title);

var xAxisG = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + innerHeight + ")");

var xAxisLabel = xAxisG
  .append("text")
  .style("text-anchor", "middle")
  .attr("x", innerWidth / 2)
  .attr("y", xAxisLabelOffset)
  .attr("class", "label")
  .text(xAxisLabelText);

var yAxisG = g.append("g").attr("class", "y axis");

var yAxisLabel = yAxisG
  .append("text")
  .style("text-anchor", "middle")
  .attr(
    "transform",
    "translate(-" + yAxisLabelOffset + "," + innerHeight / 2 + ") rotate(-90)"
  )
  .attr("class", "label")
  .text(yAxisLabelText);

function render(data) {
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d[xColumn]))
    .range([0, innerWidth])
    .nice();

  const yScale = d3.scaleLinear();
  yScale.domain(d3.extent(data, d => d[yColumn]));
  yScale.range([innerHeight, 0]);
  yScale.nice();
  var rScale = d3.scaleLinear().range([rMin, rMax]);

  //   console.log("renderdata", data);
  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  xScale.domain(
    d3.extent(data, function(d) {
      return d[xColumn];
    })
  );
  yScale.domain(
    d3.extent(data, function(d) {
      return d[yColumn];
    })
  );
  rScale.domain([
    0,
    d3.max(data, function(d) {
      return d[rColumn];
    })
  ]);

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  // console.log(data);

  var circles = g.selectAll("circle").data(data);
  circles.enter().append("circle");
  circles
    .attr("cx", function(d) {
      return xScale(d[xColumn]);
    })
    .attr("cy", function(d) {
      return yScale(d[yColumn]);
    })
    .attr("r", function(d) {
      return rScale(d[rColumn]);
    })
    .on("mouseenter", function() {
      d3.select(this).attr("opacity", 0.5);
    })
    .on("mouseleave", function(actual, i) {
      d3.select(this).attr("opacity", 1);
    });

  circles.exit().remove();
}

d3.csv("data.csv").then(csv_data => {
  console.log(csv_data);
  var data = d3
    .nest()
    .key(function(d) {
      // console.log(new Date(d.Date).getMonth());
      return new Date(d.Date).getMonth();
    })
    .rollup(function(d) {
      console.log(
        d3.sum(d, function(g) {
          return g.Dev;
        })
      );
      return {
        dev: d3.sum(d, function(g) {
          return g.Dev;
        }),
        book: d3.sum(d, function(g) {
          return g.Book;
        }),
        stats: d3.sum(d, function(g) {
          return g.Stats;
        })
      };
    })
    .entries(csv_data);

  console.log(data);
  data.forEach(function(d) {
    d.Date = 1 + +d.key;
    d.Book = d.value.book;
    d.Dev = d.value.dev;
    d.Stats = d.value.stats;
  });
  console.log(data);

  render(data);
});
