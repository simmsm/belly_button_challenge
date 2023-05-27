
//Read in samples.json from the url
const url ='https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// buildMetaData function appends key value pair to make sure metadata id == dataset id. 
function buildMetaData(id) {
    d3.json(url).then(function(data) {
            let metaData= data.metadata;
            panel= d3.select('#sample-metadata')
            // empty the demographic panel before reinserting metadata back into the optionChanged function
            panel.html('');

            let array= metaData.filter(i => i.id==id);
            result=array[0];

            for (key in result) {
                panel.append('h6').text(`${key.toUpperCase()}: ${result[key]}`)
            } 
            
        builtBarChart(data,id);
        buildBubbleChart(data,id);          
})};

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.
function builtBarChart(data,id) {
    // filter the sample list of dict's to make sure that the sample 'ID' is the same as the names "ID"
    let samples= data.samples;
    let filteredSamples= samples.filter(i=> i.id==id);
    result=filteredSamples[0];

    // Assign the filteres samples to variables 
    let otuIds= result.otu_ids;
    // make the otu id's a string so that they are not sorted as numbers
    let stringOtu= otuIds.map(i =>`OTU ${i}`)
    let otuLabels= result.otu_labels;
    let sampleValues= result.sample_values;

    let trace1 = {x:sampleValues.slice(0,10).reverse() ,y: stringOtu.slice(0,10).reverse(), type: 'bar', orientation: 'h',
                    text: otuLabels.slice(0,10).reverse()};
    let layout1= {title: 'OTU Bar Chart of Sample Values' }
    Plotly.newPlot('bar',[trace1], layout1,{responsive:true})
}

// Create a bubble chart that displays each sample.
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.
function buildBubbleChart (data,id) {

    let samples= data.samples;
    let filteredSamples= samples.filter(i=> i.id==id);
    result=filteredSamples[0];

    let otuIds= result.otu_ids;
    let sampleValues= result.sample_values; 
    let otuLabels= result.otu_labels;
    
    // create a color scale based on the otu id values. 
    let colorScale = d3.scaleLinear().domain(otuIds);
    let otuColors= otuIds.map(otuIds => colorScale(otuIds))
    
    let trace2 = {
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {size: sampleValues, color: otuColors},
        text: otuLabels}

    Plotly.newPlot('bubble',[trace2],{responsive:true})   
}

function optionChanged(id) {
    buildMetaData(id)
    console.log(id);
}


function init() {
    let dropdown =d3.select('#selDataset')
    d3.json(url).then(function(data) {
        let names= data.names;
        // Append each test subject ID number to the selDataset in html file as a dropdown option with a value that matches its text 
        for (let i=0; i< names.length; i++){
            dropdown.append('option').text(names[i]).property('value',names[i])
        }
        let firstName= names[0];
        // firstName stores the same value as id. They are the same parameter that the function calls
        buildMetaData(firstName)            
    })}


init()





