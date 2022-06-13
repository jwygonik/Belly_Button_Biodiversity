function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Deliverable 1: Bar Chart 

//Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/samples.json").then((data) => {
    // Variable to hold sample array 
    var samples = data.samples;
    // Variable filtering the samples for the object with the desired sample number
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  Variable to contain first sample
    var result = resultArray[0];

    // Initialize otu_ids, otu_labels, and sample_values variables 
    var  otu_ids = result.otu_ids;
    var labels = result.otu_labels.slice(0, 10).reverse();
    var values = result.sample_values.slice(0,10).reverse();
    var sampleLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // Create the yticks for the bar chart, isolate top 10 otu_ids, map in descending order
    var yticks = otu_ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    console.log(yticks)

    // Bar Chart Trace
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels,
      marker: {
        color: 'aquamarine'
      }
    }];
    // Bar Chart Layout
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    };
    // Deploy plotly w/ bar chart
    Plotly.newPlot("bar", barData, barLayout);


// Deliverable 2: Bubble Chart

// bubbleData
    var bubbleData = [{
      x: otu_ids,
      y: sampleValues,
      text: sampleLabels,
      mode: "markers",
       marker: {
         size: sampleValues,
         color: otu_ids,
         colorscale: 'Greens'
       }
    }];
  
    // Bubble Chart Layout
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        automargin: true,
    };
  
    // Deploy Plotly w/ new bubble layout
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

// Deliverable 3: Gauge Chart

    // Filtering metadata for desired sample
    var metadata = data.metadata;
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);  

    // Variable holding the first sample in the metadata array
        var gaugeResult = gaugeArray[0];

    // Variable holding belly button washing frequency  
    var wfreqs = gaugeResult.wfreq;
    console.log(wfreqs)

    //Gauge Data to pull / formatting
    var gaugeData = [{
      value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: "<b>Belly Button Washing Frequency</b> <br> <b>Scrubs/Week</b>",

      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps:[
          {range: [2, 4], color: "aquamarine"},
          {range: [4, 6], color: "turquoise"},
          {range: [6, 8], color: "mediumturquoise"},
          {range: [8, 10], color: "lightseagreen"}
        ],
        dtick: 2
      }
    }];
    
    // Gauge Chart Layout
    var gaugeLayout = { 
     automargin: true
    };

    // Deploy Plotly w/ new gauge layout
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}