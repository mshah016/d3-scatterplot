// define svg area dimensions
var svgWidth = 900;
var svgHeight = 550;

// define margins
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 100
};

// define dimensions of chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// select body, append svg area
var svg = d3.select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

// append group to svg area and shift to the right and down
// this is to match the dimentions you set 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// load csv data
d3.csv("data.csv").then(function(demoData){
    // print data on console
    console.log(demoData)
    // separate data into lists that you need
    // healthcare vs povery & smokers vs age

    // convert all number strings into ints using '+'
    demoData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.healthcare = +data.healthcareLow;
        data.smokes = +data.smokes;
    });


    // create scales
    var x = d3.scaleLinear()
            .domain([0, d3.max(demoData, d => d.healthcare)])
            .range([0, chartWidth]);

    var y = d3.scaleLinear()
            .domain([0, d3.max(demoData, d => d.poverty)])
            .range([chartHeight, 0])

    // create axes
    var xaxis = d3.axisBottom(x);

    var yaxis = d3.axisLeft(y);

    // set x to bottom of chart(x-axis)
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xaxis);

    // set y to left of chart (y-axis)
    chartGroup.append("g")
        .call(yaxis)
    
    // Append data to chart group
    chartGroup.selectAll(".scatter")
        .data(demoData)
        .enter()
        .append('circle')
        .attr("cx", d => x(d.healthcare))
        .attr("cy", d => y(d.poverty))
        .attr("r", "10")
        .attr("fill", "purple")
        .attr("opacity", "0.5");

    // add text to circles
    chartGroup.selectAll('.scatter')
        .data(demoData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('x', d => x(d.healthcare))
        .attr('y', d => y(d.poverty));


    // x-axis label
    svg.append("text")
        .attr("x", 450)
        .attr("y", 500)
        .style("text-anchor", "middle")
        .text("Poverty");

    // y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 45)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Healthcare");

});


