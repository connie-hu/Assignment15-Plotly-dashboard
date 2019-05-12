function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  var url = "/metadata/<sample>";
  var metadatatag = d3.select('#sample-metadata')
  metadatatag.html('');
  d3.json(url).then(function(data) {
    // console.log(data);
    Object.entries(data).forEach(([key, value]) => {
      metadatatag.append("h6").text(`${key}: ${value}`)

    });
  });
};


function buildCharts(sample) {

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  var sampleurl = '/samples/<sample>'

  var samplepie = d3.select('#pie')
  samplepie.html('');

  d3.json(sampleurl).then((sampledata) =>{
    // console.log(sampledata);
    var otu_ids_sliced = sampledata.otu_ids.slice(0,10);
    var sample_values_sliced = sampledata.sample_values.slice(0,10);
    var otu_labels_sliced = sampledata.otu_labels.slice(0,10);

    var trace1 = {
      labels: otu_ids_sliced,
      values: sample_values_sliced,
      hoverinfo: 'otu_labels_sliced',
      type: 'pie'
    };

    var data1 = [trace1];
    
    Plotly.newPlot('pie', data1);
  });


  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data
  // https://plot.ly/javascript/bubble-charts/
 
  var sampletag = d3.select('#bubble')
  sampletag.html('');

  d3.json(sampleurl).then((sampledata) => {
    console.log(sampledata);
    var otu_ids = sampledata.otu_ids;
    var sample_values = sampledata.sample_values;
    var otu_labels = sampledata.otu_labels;

    var trace2 = {
      x: otu_ids,
      y:sample_values,
      text:otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };
  
    var data2 = [trace2];
    var layout = {
      title: '',
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', data2, layout);
  });
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
