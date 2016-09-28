var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 9600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var formatDate = d3.timeFormat("%d-%b-%y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var line = function(key) {
  return d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[key]); });
}

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data.csv", function(error, data) {
  if (error) throw error;

  var sanitizedData = data.map(function(d) {
    var abcParsed = parseInt(d["ABC News"]);
    var bbcParsed = parseInt(d["BBC World Service"]);
    var cbsParsed = parseInt(d["CBS News"]);
    var cnnParsed = parseInt(d["CNN"]);
    var foxParsed = parseInt(d["Fox News"]);
    var nbcParsed = parseInt(d["NBC News"]);
    var nprParsed = parseInt(d["NPR"]);
    var nytParsed = parseInt(d["The New York Times"]);
    var wsjParsed = parseInt(d["The Wall St Journal"]);
    var usaParsed = parseInt(d["USA Today"]);

    return {
      date: new Date(d.Date).getTime(),
      abc: isNaN(abcParsed) ? 0 : abcParsed,
      bbc: isNaN(bbcParsed) ? 0 : bbcParsed,
      cbs: isNaN(cbsParsed) ? 0 : cbsParsed,
      cnn: isNaN(cnnParsed) ? 0 : cnnParsed,
      fox: isNaN(foxParsed) ? 0 : foxParsed,
      nbc: isNaN(nbcParsed) ? 0 : nbcParsed,
      npr: isNaN(nprParsed) ? 0 : nprParsed,
      nyt: isNaN(nytParsed) ? 0 : nytParsed,
      wsj: isNaN(wsjParsed) ? 0 : wsjParsed,
      usa: isNaN(usaParsed) ? 0 : usaParsed
    }
  });

  x.domain(d3.extent(sanitizedData, function(d) { return d.date }));
  y.domain(d3.extent(sanitizedData, function(d) {
    return d3.max([d.abc, d.bbc, d.cbs, d.cnn, d.fox, d.nbc, d.npr, d.nyt, d.wsj, d.usa]);
  }));

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(20));

  svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Price ($)");

  appendSVGLine(svg, 'abc', sanitizedData);
  appendSVGLine(svg, 'bbc', sanitizedData);
  appendSVGLine(svg, 'cbs', sanitizedData);
  appendSVGLine(svg, 'cnn', sanitizedData);
  appendSVGLine(svg, 'fox', sanitizedData);
  appendSVGLine(svg, 'nbc', sanitizedData);
  appendSVGLine(svg, 'npr', sanitizedData);
  appendSVGLine(svg, 'nyt', sanitizedData);
  appendSVGLine(svg, 'wsj', sanitizedData);
  appendSVGLine(svg, 'usa', sanitizedData);
});

function appendSVGLine(svg, key, data) {
  svg.append("path")
      .datum(data)
      .attr("class", "line " + key)
      .attr("d", line(key));
}

function type(d) {
  d.date = formatDate.parse(d.date);
  d.close = +d.close;
  return d;
}

var checkboxes = document.querySelectorAll('[type="checkbox"]');

checkboxes.forEach(function(el) {
  el.addEventListener("click", function(event) {
    checkboxes.forEach(function(el) {
      var targetClass = el.parentElement.classList[0];
      console.log(targetClass);

      if(el.checked) {
        document.querySelectorAll('.line.' + targetClass)[0].style.display = "inline";
      } else {
        document.querySelectorAll('.line.' + targetClass)[0].style.display = "none";
      }
    })
  })
});
