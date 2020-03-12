let width = d3.select("svg").attr("width");
let height = d3.select("svg").attr("height");
d3.select("#everything").attr("align", "center");

let tick = [
  "36:30",
  "36:50",
  "37:10",
  "37:30",
  "37:50",
  "38:10",
  "38:30",
  "38:50",
  "39:10",
  "39:30",
  "39:50"
];

var butMyFormat = d3.timeFormat("%M:%S");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then(function(data) {
  let years = [];
  let years2 = [];

  for (var i = 0; i < data.length; i++) {
    years.push(data[i].Year);
  }

  for (var j = 0; j < years.length; j++) {
    years2.push(new Date(years[j]));
  }

  var xScale = d3
    .scaleLinear()
    .domain([d3.min(years) - 1, d3.max(years) + 1])
    .range([0, width - 65]);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(33, 500)")
    .attr("id", "x-axis")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  let times = [];
  let tickParsed = [];

  for (var a = 0; a < data.length; a++) {
    var timeString = data[a].Time;
    var butMyParse = d3.timeParse("%M:%S");
    times.push(butMyParse(timeString));
  }

  for (var b = 0; b < tick.length; b++) {
    var tickString = tick[b];
    tickParsed.push(butMyParse(tickString));
  }

  var yScale = d3
    .scaleTime()
    .domain([d3.min(times), d3.max(times)])
    .range([0, height - 120]);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(33, 20)")
    .attr("id", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .tickValues(tickParsed)
        .tickFormat(d3.timeFormat("%M:%S"))
    );

  let pushedData = [];

  for (var c = 0; c < data.length; c++) {
    let tempHold = [];
    tempHold.push(data[c].Year);
    tempHold.push(data[c].Time);
    pushedData.push(tempHold);
  }

  d3.select("svg")
    .selectAll("circle")
    .data(pushedData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d, i) {
      return xScale(d[0]);
    })
    .attr("cy", function(d, i) {
      return yScale(times[i]);
    })
    .attr("transform", "translate(32,20)")
    .attr("r", 5)
    .attr("data-xvalue", function(d, i) {
      return data[i].Year;
    })
    .attr("data-yvalue", function(d, i) {
      return times[i];
    })
    .style("fill", function(d, i) {
      if (data[i].Doping) {
        return "red";
      } else {
        return "blue";
      }
    })
    .on("mouseover", function(d, i) {
      d3.select("#tooltip")
        .style("opacity", 0.8)
        .attr("data-year", data[i].Year)
        .html(
          "Time: " +
            pushedData[i][1] +
            "<br>" +
            "Year: " +
            pushedData[i][0] +
            "<br>" +
            "Name: " +
            data[i].Name
        );
    })
    .on("mouseout", function(d, i) {
      d3.select("#tooltip").style("opacity", 0);
    });
});
