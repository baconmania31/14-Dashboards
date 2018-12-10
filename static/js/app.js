function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    var url = '/metadata/' + sample;
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadat = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    // Use `Object.entries` to add each key and value pair to the panel
    d3.json(url).then(function(data) {
    
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

      
      Object.entries(data).forEach(function([key, value]) {
        var row = metadat.append("tr");
        console.log(key);
        console.log(value);
        // Append a cell to the row for each value
        // in the weather report object
        var cell = row.append("td");
        var cell2 = row.append("td");
        cell.text(key+":  ");
        cell2.text(value);
      });
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = '/samples/' + sample;
  d3.json(url).then(function(data) {
    var otus = data.otu_ids;
    var labels = data.otu_labels;
    var sampvals = data.sample_values;
    var tracebub = {
      x: otus,
      y: sampvals,
      text: labels,

      mode: 'markers',
      marker: {
        size: sampvals,
        color: otus
      }
    };
    var bubdata = [tracebub];
    Plotly.newPlot('bubble', bubdata);
    var pieData = []
    for (i = 0; i < sampvals.length; i++) { 
      pieData[i] = {"otus": otus[i], "labels": labels[i],"sampvals": sampvals[i]}
    };
    pieData = pieData.sort((first, second) => second.sampvals - first.sampvals);
    for (i = 0; i < pieData.length; i++) { 
      otus[i] = pieData[i].otus;
      labels[i] = pieData[i].labels;
      sampvals[i] = pieData[i].sampvals
    };
    //var pie_otus = pieData['otus'].slice(0,10);
    //var pie_labels = labels.map(labels => sampvals.sort((first, second) => second - first)).slice(0,10);
   // var pie_sampvals = sampvals.sort((first, second) => second - first).slice(0,10);
    otus = otus.slice(0,10);
    labels = labels.slice(0,10);
    sampvals = sampvals.slice(0,10);



    var tracepie = {
      values: sampvals,
      labels: otus,
      text: labels,
      textinfo: 'percent',
      type: 'pie'
  
    };
    var piedata = [tracepie];
    Plotly.newPlot('pie', piedata);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
