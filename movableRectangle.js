//Size of the canvas
var canvasWidth = 1400,
    canvasHeight = 300;

var visibleChrWidth = 1000;

var defaultGeneColor = "gray"

var leftMarginOffset = 200;

//quadrant line height and y positions
var lineHeight = 10;

//need to rename quad 1 to Nn and quad 3 to EC
var quad1YPos = 105,
    quad3YPos = 60,
    chrYPos = 150,
    dragRectYPos = (chrYPos+quad3YPos) / 6;

//Initial size of the draggable rectangle
var draggableRectWidth = 300,
    draggableRectHeight = 200;

//Width of the resizing handles
var resizeHandleWidth = 20;


//Length of the chromosome
var chrLength = (250 * 1000000)
let allChrLengths = [249000000,243000000,199000000,191000000,182000000,171000000,160000000,146000000,139000000,134000000,136000000,134000000,115000000,108000000,
102000000,9100000,8400000,8100000,5900000,6500000,4700000,5100000,157000000,5800000]

var userSelectedChr = window.location.href.slice(-1);
if (window.location.href.length == 44){
    userSelectedChr = window.location.href.slice(-2);
}
if(userSelectedChr == "X"){
    chrLength = allChrLengths[22];
} else if (userSelectedChr == "Y"){
    chrLength = allChrLengths[23];
}else{
    chrLength = allChrLengths[userSelectedChr-1]
}

//Default size of the individual genes on the rectangle. 
//If both the start and end position of a gene map to roughly the same location on the svg,
//then gene will be represented with a width of 1.
var defaultGeneWidth = 1,
    geneHeight = 60,
    geneHeight2 = lineHeight;

//Array to hold all of the randomly generate genes to allow replacement of the same genes.
var allGenes = [];

//Used to make the overlaid rectangle draggable over the chromosome.
var drag = d3.drag()
    .subject(Object)
    .on("drag", dragMove);

//Used to resize the window rectangle to the right using blue rectangle resizing handle.
var dragright = d3.drag()
    .subject(Object)
    .on("drag", rdragresize);

//Used to resize the window rectangle to the left using blue rectangle resizing handle.
var dragleft = d3.drag()
    .subject(Object)
    .on("drag", leftDragResize);

//SVG container of the chromosome (and overlaid chromosome), draggable rectangle, resizing handles, 
//x-axis, and gene groups. 
var svg = d3.select("body").append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);


//group to hold quadrant1 data 
var quad1 = svg.append("g")
var quad3 = svg.append("g")

//quadrant lines
var quad1_line = quad1.append("rect")
    .attr("height", lineHeight)
    .attr("width", visibleChrWidth )
    .attr("fill", "gainsboro")
    .attr("fill-opacity", 0.5)
    .attr("x", leftMarginOffset)
    .attr("y",quad1YPos);

var quad3_line = quad3.append("rect")
    .attr("height", lineHeight)
    .attr("width", visibleChrWidth )
    .attr("fill", "gainsboro")
    .attr("fill-opacity", 0.5)
    .attr("x", leftMarginOffset)
    .attr("y",quad3YPos);

//SVG container for the mini-map of the chromosome
var miniMapSVG = d3.select("body").append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight-200);

//Group to hold the static chromosome (in the back).
var staticChrGroup = svg.append("g");

//Group to hold each of the rectangles representing individual genes.
var allGeneGroup = svg.append("g")
    .attr("id", "allGenes");

//quad data
var allGeneGroup2 = svg.append("g")
    .attr("id", "allGenesQuad");

//Group to hold the dynamic overlaid chromosome that moves with the draggable rectangle.
var overlaidChrGroup = svg.append("g")
    .data([{x: draggableRectWidth / 2, y: draggableRectHeight / 2}]);

var overlaidQuadGroup = svg.append("g")
    .data([{x: draggableRectWidth / 2, y: draggableRectHeight / 2}]);

//Group to hold the draggable rectangle and its resizing handles.
var draggableRectGroup = svg.append("g")
    .data([{x: draggableRectWidth / 2, y: draggableRectHeight / 2}]);

//Group to hold all of the signaling genes, which will be overlaid when the signaling radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var signalingGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "signalingGenes");

var signalingGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "signalingGenesQuad");

//Group to hold all of the transcription genes, which will be overlaid when the transcription radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var transcriptionGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id","transcriptionGenes");

var transcriptionGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id","transcriptionGenesQuad");

//Group to hold all of the metabolism genes, which will be overlaid when the metabolism radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var metabolismGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "metabolismGenes");

var metabolismGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "metabolismGenesQuad");

//Group to hold all of the epigenetics genes, which will be overlaid when the epigenetics radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var epigeneticsGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "epigeneticsGenes");

var epigeneticsGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "epigeneticsGenesQuad");

//Group to hold all of the adhesion genes, which will be overlaid when the adhesion radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var adhesionGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "adhesionGenes");

var adhesionGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "adhesionGenesQuad")

//Group to hold all of the extracellular genes, which will be overlaid when the extracellular radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var extracellularGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "extracellularGenes");

var extracellularGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "extracellularGenesQuad");

//Group to hold all of the extracellular genes, which will be overlaid when the extracellular radio button is selected.
//Initially opacity is set to 0. This is set to 1 when its radio button is checked.
var ucrGeneGroup = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "ucrGenes");

var ucrGeneGroup2 = svg.append("g")
    .attr("opacity", 0.0)
    .attr("id", "ucrGenesQuad");


//Group to hold the mini-map of the chromosome
var miniMapGroup = miniMapSVG.append("g");

//Rectangle representing the chromosome. Currently, spans the entire SVG container.
var staticChrRect = staticChrGroup.append("rect")
    .attr("x", function(d) { return leftMarginOffset; })
    .attr("y", chrYPos)
    .attr("height", geneHeight)//)
    .attr("width", visibleChrWidth )
    //changed the default fill to white
    .attr("fill", "white")
    .attr("fill-opacity", 1)
    //.attr("cursor", "move")

//Overlaid chromosome that moves with the draggable rectangle. Initially the opacity is set to 0.
//When one of the gene subset radio buttons is selected,the opacity of the overlaid chromosome will 
//be set to 1 to block out all other genes behind it. The genes of the category selected are overlaid, 
//showing only that subset. This will be resized/moved whenever the draggable rectangle is resized/moved.
var overlaidChrRect = overlaidChrGroup.append("rect")
        .attr("x", function(d) { return d.x + leftMarginOffset - 150; })
        .attr("y", chrYPos-5)
        .attr("height", geneHeight+10)
        .attr("width", draggableRectWidth)
        .attr("fill", "white")
        .attr("fill-opacity", 0.0)
        //.attr("cursor", "move");

var overlaidQuad1 = overlaidQuadGroup.append("rect")
    .attr("x", function(d) {return d.x + leftMarginOffset - 150;})
    .attr("y", quad1YPos-.4)
    .attr("width", draggableRectWidth)
    .attr("height", lineHeight+.8)
    .attr("fill", "gainsboro")
    .attr("fill-opacity", 0.0);

var overlaidQuad3 = overlaidQuadGroup.append("rect")
    .attr("x", function(d) {return d.x + leftMarginOffset - 150;})
    .attr("y", quad3YPos-.4)
    .attr("width", draggableRectWidth)
    .attr("height", lineHeight+.8)
    .attr("fill", "gainsboro")
    .attr("fill-opacity", 0.0);

//Draggable rectangle.
var dragRect = draggableRectGroup.append("rect")
    .attr("id", "active")
    .attr("x", function(d) { return d.x + leftMarginOffset - 150;})
    .attr("y", dragRectYPos)
    .attr("height", draggableRectHeight)
    .attr("width", draggableRectWidth)
    .attr("fill-opacity", 0.0)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.0)
    //changed the default fill to white
    .attr("fill", "white")
    //.attr("cursor", "move")
    .call(drag);

//Left resizing handle on the left of the draggable rectangle. This is shown as a thin blue rectangle.
var dragHandleLeft = draggableRectGroup.append("rect")
      .attr("x", function(d) { return d.x - (resizeHandleWidth/2) + leftMarginOffset - 150; })
      .attr("y", dragRectYPos + (resizeHandleWidth/2))
      .attr("height", draggableRectHeight - resizeHandleWidth)
      .attr("id", "dragleft")
      .attr("width", resizeHandleWidth)
      .attr("fill", "lightblue")
      //make drag handle invisible at first
      .attr("fill-opacity", 0)
      //.attr("cursor", "ew-resize")
      .call(dragleft);

//Right resizing handle on the right of the draggable rectangle. This is shown as a thin blue rectangle.
var dragHandleRight = draggableRectGroup.append("rect")
      .attr("x", function(d) { return d.x + draggableRectWidth - (resizeHandleWidth/2) + leftMarginOffset - 150; })
      .attr("y", dragRectYPos + (resizeHandleWidth/2))
      .attr("id", "dragright")
      .attr("height", draggableRectHeight - resizeHandleWidth)
      .attr("width", resizeHandleWidth)
      .attr("fill", "lightblue")
      //make drag handle invisible at first
      .attr("fill-opacity", 0)
      //.attr("cursor", "ew-resize")
      .call(dragright);
    
//Static chromosome for mini-map
var miniMapChr = miniMapGroup.append("rect")
    .attr("x", 300 + leftMarginOffset)
    .attr("y", 50)
    .attr("id", "miniMapChr")
    .attr("height", (geneHeight) / 2)
    .attr("width", 400)
    .attr("fill", "black")
    .attr("fill-opacity", 1.0);

var miniMapWindow = miniMapGroup.append("rect")
    .attr("x", 300 + leftMarginOffset)
    .attr("y", 50 - (50 / 4))
    .attr("id", "miniMapChr")
    .attr("height", geneHeight)
    .attr("width", 400)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1.0)
    .attr("fill", "gray")
    .attr("fill-opacity", 0.5);

var leftLine = miniMapGroup.append("line")
    .attr("x1", 0 + leftMarginOffset)
    .attr("y1", 5)
    .attr("x2", 300 + leftMarginOffset)
    .attr("y2", 50 - (50 / 4))
    .attr("stroke-width", 1)
    .attr("stroke", "black");

var leftLineTop = miniMapGroup.append("line")
    .attr("x1", 1 + leftMarginOffset)
    .attr("y1", 0)
    .attr("x2", 1 + leftMarginOffset)
    .attr("y2", 5)
    .attr("stroke-width", 1)
    .attr("stroke", "black");

var rightLine = miniMapGroup.append("line")
    .attr("x1", 1000 + leftMarginOffset)
    .attr("y1", 5)
    .attr("x2", 700 + leftMarginOffset)
    .attr("y2", 50 - (50 / 4))
    .attr("stroke-width", 1)
    .attr("stroke", "black");

var rightLineTop = miniMapGroup.append("line")
    .attr("x1", 999 + leftMarginOffset)
    .attr("y1", 0)
    .attr("x2", 999 + leftMarginOffset)
    .attr("y2", 5)
    .attr("stroke-width", 1)
    .attr("stroke", "black");

//Add x-axis for zooming reference
//Create the scale
var xAxisScale = d3.scaleLinear()
    .domain([0, chrLength])    // This is what is written on the Axis: from 0 to 2000000
    .range([200, 1200]);       // This is where the axis is placed: from 0x to 1000px

//Create the Axis
var xAxis = d3.axisBottom().scale(xAxisScale);

//Add the axis to the svg container.
var xAxisGroup = svg.append("g")
    .attr("id", "xAxis")
    //.attr("y", chrYPos + geneHeight)
    .attr("transform", "translate(0, 235)")
    .call(xAxis);

//Expression color legend
svg.append("rect").attr("x", 1230).attr("y", 50).attr("width", 20).attr("height",20).attr("fill", "red")
svg.append("rect").attr("x", 1230).attr("y", 80).attr("width", 20).attr("height",20).attr("fill", "blue")
svg.append("rect").attr("x", 1230).attr("y", 110).attr("width", 20).attr("height",20).attr("fill", "black")
//legend text
svg.append("text").attr("x", 1260).attr("y", 65).text("Upregulated").style("font-size", "15px")
svg.append("text").attr("x", 1260).attr("y", 95).text("Downregulated").style("font-size", "15px")
svg.append("text").attr("x", 1260).attr("y", 125).text("Unchanged").style("font-size", "15px")
//legend Title
svg.append("text").attr("x", 1222).attr("y", 35).text("Gene Expression").style("font-size", "18px").attr("font-weight", "bold")

//bar and chromosome labels 
svg.append("text").attr("x", 10).attr("y", 70).text("Endothelial Cells (EC)").style("font-size", "18px").attr("font-weight", "bold")
svg.append("text").attr("x", 28).attr("y", 115).text("Neuronal Cells (Nn)").style("font-size", "18px").attr("font-weight", "bold")
svg.append("text").attr("x", 135).attr("y", 188).text("Genes").style("font-size", "18px").attr("font-weight", "bold")//
svg.append("text").attr("x", 660).attr("y", 275).text("Base Pairs").style("font-size", "16px")//

//here are the gene ontologies by subset, for future work we could add more descendants of theis epigenetic term
//epigenetic is already the smallest subset and in the actual analysis I grab all descendants
var signalGO = ["0007165","0023033"];
var transcriptionGO = ["0003700", "0000130", "0001071", "0001130", "0001131", "0001151", "0001199", "0001204"];
var epigeneticGO = ["0040029"];
var adhesionGO = ["0007155","0098602"];
var metabolismGO = ["0008152","0044236","0044710"];
var extracellularGO = ["0031012"];

//this function takes in a row from the csv, one of the subsets above, and potential result to output(0,1,2,3,4,5)
function checkMembership(data, ontology,result){
    //parse each of the three gene ontology categories
    var GOBP = data["GO Biological Process"];
    GOBP = GOBP.replace(/\/\/\//g, "\/\/");
    GOBP = GOBP.split(' // ');
    var GOCC = data["GO Cellular Component"];
    GOCC = GOCC.replace(/\/\/\//g, "\/\/");
    GOCC = GOCC.split(' // ');
    var GOMF = data["GO Molecular Function"];
    GOMF = GOMF.replace(/\/\/\//g, "\/\/");
    GOMF = GOMF.split(' // ');
    //if there is a match return the result
    for (j = 0; j < GOBP.length; j+=3) {
        if(ontology.includes(GOBP[j])){
            return(result);
        }
    }
    for (j = 0; j < GOCC.length; j+=3) {
        if(ontology.includes(GOCC[j])){
            return(result);
        }
    }
    for (j = 0; j < GOMF.length; j+=3) {
        if(ontology.includes(GOMF[j])){
            return(result);
        }
    }
}

function drawInitialChromosomeLayout() {
    //read in the csv
    d3.csv("/data/master.csv", function(data) {
    // d3.csv("https://studentweb.uvic.ca/~ltrinity/data/master.csv", function(data) {
        //here is the original variable used to categorize subset
        var i;
        //which chromosome
        var chr = data["alignment"].split(" ")[0].split(":")[0].slice(3);
        //could potentially load in different chromosomes here
        if(chr ==userSelectedChr){
            //get the relevant info for up/down regulation
            var meanEC = data["mean(EC-iPS)"];
            var meanNn = data["mean(Nn-iPS)"];
            var minFcrosEC = data["min fcross significance (EC)"];
            var maxFcrosEC = data["max fcross significance (EC)"];
            var minFcrosNn = data["min fcross significance (Nn)"];
            var maxFcrosNn = data["max fcross significance (Nn)"];
            var ECFold = data["Fold Change (EC-iPs) [min:max]"].replace(","," -")
            var NnFold = data["Fold Change (Nn-iPs) [min:max]"].replace(","," -")
            var cEC = "black"
            var cNn = "black"
            //haley you can use this for your mapping function
            if (meanEC >= 1.5 && maxFcrosEC>=0.95){
                cEC="red"
            }
            if (meanEC <= -1.5 && minFcrosEC<=0.05){
                cEC="blue"
            }
            if (meanNn >= 1.5 && maxFcrosNn>=0.95){
                cNn="red"
            }
            if (meanNn <= -1.5 && minFcrosNn<=0.05){
                cNn="blue"
            }
            if (cEC=="black" && cNn=="black"){
                return;
            }
            //determine subset membership
            if(checkMembership(data,signalGO,0)==0){
                i = 0;
            }
            if(checkMembership(data,transcriptionGO,1)==1){
                i = 1;
            }
            if(checkMembership(data,metabolismGO,2)==2){
                i = 2;
            }
            if(checkMembership(data,epigeneticGO,3)==3){
                i = 3;
            }
            if(checkMembership(data,adhesionGO,4)==4){
                i = 4;
            }
            if(checkMembership(data,extracellularGO,5)==5){
                i = 5;
            }
            //get the start and stop of the genese
            var symbol = data["Gene Symbol"];
            if(symbol.slice(4,5)==":" || symbol.slice(5,6)==":"){
                i = 6
            }

            var start = parseInt(data["alignment"].split(" ")[0].split(":")[1].split("-")[0]);
            var stop = parseInt(data["alignment"].split(" ")[0].split(":")[1].split("-")[1]);

            //here is the start of the original random init, yes the indentation is off
            //the chromosome we were using is way too short, I take a modulus to handle that
            var chrStartPos = start //%2000000;//getRandomIntBetween(1,2000000);
            //once we increase chromosome length we can use actual value here
            var geneLength = stop - start //10;//getRandomIntBetween(100,1000);
            //var expColors = getExpressionColor(i);
            var chrEndPos = chrStartPos + geneLength;

            var svgStartPos = getXPosFromChrToSVG(chrStartPos, 1, chrLength) + leftMarginOffset;
            var svgEndPos = getXPosFromChrToSVG(chrEndPos, 1, chrLength) + leftMarginOffset;

            var viewGeneWidth = svgEndPos - svgStartPos;

            if (viewGeneWidth < 1) {
                viewGeneWidth = 1;
            }
            if (i == 0) { //signaling gene
                addToAllGeneQuad(svgStartPos , cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "yellow",viewGeneWidth);

                //add to Nn and EC bars
                signalingGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)

                signalingGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)

                    //.attr("cursor", "move");

                signalingGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", chrYPos)
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", defaultGeneColor)
                    .attr("fill-opacity", 1.0)

                    //.attr("cursor", "move");

                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"signaling", color:"yellow",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            } else if (i == 1) { //transcription gene
                addToAllGeneQuad(svgStartPos, cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "blue",viewGeneWidth)

                transcriptionGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)

                transcriptionGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");

                transcriptionGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", chrYPos)
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", defaultGeneColor)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"transcription", color:"blue",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            } else if (i == 2) { //metabolism gene
                addToAllGeneQuad(svgStartPos, cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "pink",viewGeneWidth)

                metabolismGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                metabolismGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)

                metabolismGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y",  chrYPos)
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", defaultGeneColor)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"metabolism", color:"pink",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            } else if (i == 3) { //epigenetics gene
                addToAllGeneQuad(svgStartPos, cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "black",viewGeneWidth)

                epigeneticsGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                epigeneticsGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)

                epigeneticsGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", chrYPos) 
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", "black")
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"epigenetics", color:"black",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            } else if (i == 4) { //adhesion gene
                addToAllGeneQuad(svgStartPos, cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "purple",viewGeneWidth)

                adhesionGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                adhesionGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)

                adhesionGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", chrYPos)  
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", defaultGeneColor)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"adhesion", color:"purple",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            } else if (i == 5) { //extracellular gene
                addToAllGeneQuad(svgStartPos, cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "orange",viewGeneWidth)

                extracellularGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");

                extracellularGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)

                extracellularGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", chrYPos)
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", defaultGeneColor)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"extracellular", color:"orange",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            } else if (i == 6) { //unidentified chromosomal region
                addToAllGeneQuad(svgStartPos, cEC, cNn,viewGeneWidth)
                addToAllGene(svgStartPos, "grey",viewGeneWidth)

                ucrGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad1YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cNn)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");

                ucrGeneGroup2.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", quad3YPos)
                    .attr("height", geneHeight2)
                    .attr("width", viewGeneWidth)
                    .attr("fill", cEC)
                    .attr("fill-opacity", 1.0)

                ucrGeneGroup.append("rect")
                    .attr("x", svgStartPos)
                    .attr("y", chrYPos)
                    .attr("height", geneHeight)
                    .attr("width", viewGeneWidth)
                    .attr("fill", defaultGeneColor)
                    .attr("fill-opacity", 1.0)
                    //.attr("cursor", "move");
                allGenes.push({colorEC: cEC, colorNn: cNn, startPos: chrStartPos, endPos: chrEndPos, group:"ucr", color:"grey",localsymbol:symbol,localECFold:ECFold,localNnFold:NnFold});
            }
        }
    });
}



//Add a gene to the all genes group given its position(number) and color(string)
function addToAllGene(pos, color,actualWidth) {
    allGeneGroup.append("rect")
    .attr("x", pos)
    .attr("y", chrYPos)
    .attr("height", geneHeight)
    .attr("width", actualWidth)
    .attr("fill", defaultGeneColor)
    .attr("fill-opacity", 1.0)
    //.attr("cursor", "move");
}

function addToAllGeneQuad(pos, color1, color2,actualWidth){
    allGeneGroup2.append("rect")
    .attr("x",pos)
    .attr("y", quad1YPos)
    .attr("height", geneHeight2)
    .attr("width", actualWidth)
    .attr("fill", color2)
    .attr("fill-opacity", 1.0)
    //.attr("cursor", "move");

    allGeneGroup2.append("rect")
    .attr("x",pos)
    .attr("y", quad3YPos)
    .attr("height", geneHeight2)
    .attr("width", actualWidth)
    .attr("fill", color1)
    .attr("fill-opacity", 1.0)
}


//Helper function to make each gene group invisible (or visible) based on boolean inputs by setting the opacity to
//0 or 1. These gene groups are overlaid (opacity = 1) when their category's radio button is selected.
function changeGeneGroupOpacities(sig, trans, met, epi, ad, ext, ucr) {
    if (sig) {
        signalingGeneGroup.attr("opacity", 0.0);
        signalingGeneGroup2.attr("opacity", 0.0);
    }
    else {
        signalingGeneGroup.attr("opacity", 1.0);
        signalingGeneGroup2.attr("opacity", 1.0);
    }
    if (trans) {
        transcriptionGeneGroup.attr("opacity", 0.0);
        transcriptionGeneGroup2.attr("opacity", 0.0);
    }
    else {
        transcriptionGeneGroup.attr("opacity", 1.0);
        transcriptionGeneGroup2.attr("opacity", 1.0);
    }
    if (met) {
        metabolismGeneGroup.attr("opacity", 0.0);
        metabolismGeneGroup2.attr("opacity", 0.0);
    }
    else {
        metabolismGeneGroup.attr("opacity", 1.0);
        metabolismGeneGroup2.attr("opacity", 1.0);
    }
    if (epi) {
        epigeneticsGeneGroup.attr("opacity", 0.0);
        epigeneticsGeneGroup2.attr("opacity", 0.0);
    }
    else {
        epigeneticsGeneGroup.attr("opacity", 1.0);
        epigeneticsGeneGroup2.attr("opacity", 1.0);
    }
    if (ad) {
        adhesionGeneGroup.attr("opacity", 0.0);
        adhesionGeneGroup2.attr("opacity", 0.0);
    }
    else {
        adhesionGeneGroup.attr("opacity", 1.0);
        adhesionGeneGroup2.attr("opacity", 1.0);
    }
    if (ext) {
        extracellularGeneGroup.attr("opacity", 0.0);
        extracellularGeneGroup2.attr("opacity", 0.0);
    }
    else {
        extracellularGeneGroup.attr("opacity", 1.0);
        extracellularGeneGroup2.attr("opacity", 1.0);
    }
    if (ucr) {
        ucrGeneGroup.attr("opacity", 0.0);
        ucrGeneGroup2.attr("opacity", 0.0);
    }
    else {
        ucrGeneGroup.attr("opacity", 1.0);
        ucrGeneGroup2.attr("opacity", 1.0);
    }
}

//Overlays the gene category of interest by set their group's opacity to 1, 
//while setting all other gene groups' opacities to 0. This function calls changeGeneGroupOpacities according to
//the input string.
function overlayGeneGroup(group) {
    if (group == "none") {
        changeGeneGroupOpacities(true, true, true, true, true, true,true);
    } else if (group == "signaling") {
        changeGeneGroupOpacities(false, true, true, true, true, true,true);
    } else if (group == "transcription") {
        changeGeneGroupOpacities(true, false, true, true, true, true,true);
    } else if (group == "metabolism") {
        changeGeneGroupOpacities(true, true, false, true, true, true,true);
    } else if (group == "epigenetics") {
        changeGeneGroupOpacities(true, true, true, false, true, true,true);
    } else if (group == "adhesion") {
        changeGeneGroupOpacities(true, true, true, true, false, true,true);
    } else if (group == "extracellular") {
        changeGeneGroupOpacities(true, true, true, true, true, false,true);
    } else if (group == "ucr") {
        changeGeneGroupOpacities(true, true, true, true, true, true,false);
    }
}

//Function that changes the overlaid group of genes. This function changes the color of the draggable rectangle. 
//The opacity of the overlaid chromosome is set to 1 (unless the None radio button is selected) to block out all genes
//behind the draggable rectangle. Finally, this function calls overlayGeneGroup to overlay the genes of the selected 
//radio button's category on top of the overlaid chromosome.
function changeOverlaidGroup() {
    //The None radio button is selected.
    if(document.getElementById('none').checked) {
        //make the handles invisible
        dragHandleLeft.attr("fill-opacity", 0);
        dragHandleRight.attr("fill-opacity", 0);
        //dragRect.style("fill", "white");
        dragRect.style("stroke-opacity", 0.0);
        overlaidChrRect.attr("fill-opacity", 0.0);
        overlaidQuad1.attr("fill-opacity",0.0);
        overlaidQuad3.attr("fill-opacity",0.0);
        overlayGeneGroup("none");
        dragRect.attr("cursor", "auto")
        dragHandleRight.attr("cursor", "auto")
        dragHandleLeft.attr("cursor", "auto")
    } 
    //The Signaling radio button is selected
    else if (document.getElementById('signaling').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
        //dragRect.style("fill", "red");
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("signaling");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }        
    } 
    //The Transcription radio button is selected
    else if (document.getElementById('transcription').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
       // dragRect2.style("stroke-opacity", 1.0);
        //dragRect.style("fill", "green");
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("transcription");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }
    } 
    //The Metabolism radio button is selected
    else if (document.getElementById('metabolism').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
        //dragRect.style("fill", "blue");
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("metabolism");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }
    } 
    //The Epigenetics radio button is selected
    else if (document.getElementById('epigenetics').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
       // //dragRect.style("fill", "purple");
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("epigenetics");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }
    } 
    //The Adhesion radio button is selected
    else if (document.getElementById('adhesion').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
        //dragRect.style("fill", "yellow");
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("adhesion");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }
    } 
    //The Extracellular radio button is selected
    else if (document.getElementById('extracellular').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("extracellular");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }
    }
    //The unidentified chromosomal region radio button is selected
    else if (document.getElementById('ucr').checked) {
        //make the handles visible
        dragHandleLeft.attr("fill-opacity", 0.5);
        dragHandleRight.attr("fill-opacity", 0.5);
        dragRect.style("stroke-opacity", 1.0);
        overlaidChrRect.attr("fill-opacity", 1.0);
        overlaidQuad1.attr("fill-opacity",1.0);
        overlaidQuad3.attr("fill-opacity",1.0);
        overlayGeneGroup("ucr");
        if(!zoomedIn){
            dragRect.attr("cursor", "move");
            dragHandleRight.attr("cursor", "ew-resize");
            dragHandleLeft.attr("cursor", "ew-resize");
        }
    }
}

//Function that returns a random integer between the input min and max values. The maximum is exclusive 
//and the minimum is inclusive. This is used to generate a random starting position of a gene.
function getRandomIntBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//Function that takes a chromosomal position and translate it to the SVG position representing that chromosomal
//position. Maps range [low, high] to [0, 1000] using the formula below: 
//[A, B] --> [a, b]
//use this formula
//(val - A)*(b-a)/(B-A) + a
function getXPosFromChrToSVG(num, low, high) {
    var val = num;
    var A = low;
    var B = high;
    var b = 1000;
    var a = 0;

    return (val - A)*(b-a)/(B-A) + a;
}

//Function that takes a chromosomal position and translate it to the Mini-map SVG position representing that chromosomal
//position. Maps range [low, high] to [300, 700] using the formula below: 
//[A, B] --> [a, b]
//use this formula
//(val - A)*(b-a)/(B-A) + a
function getXPosFromChrToSVGMiniMap(num) {
    var val = num;
    var A = 1;
    var B = chrLength;
    var b = 700;
    var a = 300;

    return (val - A)*(b-a)/(B-A) + a;
}


//Function that takes an svg position and translate it to the chromosomal position. 
//Maps range [0, 1000] to [low, high] using the formula below: 
//[A, B] --> [a, b]
//use this formula
//(val - A)*(b-a)/(B-A) + a
function getXPosFromSVGToChr(d, low, high) {
    var val = d;
    var A = 0;
    var B = 1000;
    var b = high;
    var a = low;

    return parseInt((val - A)*(b-a)/(B-A) + a);
}

//Function to move the draggable rectangle when clicked on and dragged. This updates the x positions within the
//svg container of the draggable rectangle, both resizing handles, and the overlaid chromosome.
function dragMove(d) {
    dragRect
        .attr("x", d.x = Math.max(leftMarginOffset, Math.min(canvasWidth - draggableRectWidth - leftMarginOffset, d3.event.x)));
    dragHandleLeft 
        .attr("x", function(d) { return d.x - (resizeHandleWidth/2); });
    dragHandleRight 
        .attr("x", function(d) { return d.x + draggableRectWidth - (resizeHandleWidth/2); });
    overlaidChrRect
        .attr("x", d.x = Math.max(leftMarginOffset, Math.min(canvasWidth - draggableRectWidth - leftMarginOffset, d3.event.x)));
    overlaidQuad1
        .attr("x", d.x = Math.max(leftMarginOffset, Math.min(canvasWidth - draggableRectWidth - leftMarginOffset, d3.event.x)));
    overlaidQuad3
        .attr("x", d.x = Math.max(leftMarginOffset, Math.min(canvasWidth - draggableRectWidth - leftMarginOffset, d3.event.x)));
}

//Function to resize the draggable rectangle when the left resize handle (left blue rectangle) is clicked on
//and dragged. This function additionally updates the width of the overlaid chromosome. The x positions within the
//svg container of the left resizing handle, the draggable rectangle, and the overlaid chromosome are updated. 
function leftDragResize(d) {
    var oldx = parseInt(dragRect.attr("x"));
    var newx = d3.mouse(this)[0]; 

    d.x = Math.max(leftMarginOffset, Math.min(oldx + draggableRectWidth - (resizeHandleWidth / 2), newx)); 
    draggableRectWidth = draggableRectWidth + (oldx - d.x);
    
    dragHandleLeft
    .attr("x", function(d) { return d.x - (resizeHandleWidth / 2); });
    
    dragRect
    .attr("x", function(d) { return d.x; })
    .attr("width", draggableRectWidth);

    overlaidChrRect
    .attr("x", d.x)
    .attr("width", draggableRectWidth);

    overlaidQuad1
    .attr("x", d.x)
    .attr("width", draggableRectWidth);

    overlaidQuad3
    .attr("x", d.x)
    .attr("width", draggableRectWidth);
   
    if (zoomedIn) {
        if (draggableRectWidth < 995) {
            dragRect.attr("cursor", "move");
        }
        else {
            dragRect.attr("cursor", "auto");
        }
    }

    // if (dragRect.attr("width") > 100) {
    //     dragRect.attr("cursor", "move");
    //     dragHandleRight.attr("cursor", "ew-resize");
    //     dragHandleLeft.attr("cursor", "ew-resize");
    // }
}

//Function to resize the draggable rectangle when the right resize handle (right blue rectangle) is clicked on
//and dragged. This function additionally updates the width of the overlaid chromosome. The x position within the
//svg container of the right resizing handle is updated. 
function rdragresize(d) {
    var dx = parseInt(dragRect.attr("x"));
    //Max x on the left is x - width 
    //Max x on the right is width of screen + (dragbarw/2)
    var dragx = Math.max(dx + (resizeHandleWidth/2), Math.min(canvasWidth - leftMarginOffset, dx + draggableRectWidth + d3.event.dx));

    //recalculate width
    draggableRectWidth = dragx - dx;
    //move the right drag handle
    dragHandleRight
        .attr("x", function(d) { return dragx - (resizeHandleWidth/2) });

    //resize the drag rectangle and overlaid chromosome
    //as we are only resizing from the right, the x coordinate does not need to change
    dragRect
        .attr("width", draggableRectWidth);

    overlaidChrRect
        .attr("width", draggableRectWidth);

    overlaidQuad1
        .attr("width", draggableRectWidth);

    overlaidQuad3
        .attr("width", draggableRectWidth);

    if (zoomedIn) {
        if (draggableRectWidth < 995) {
            dragRect.attr("cursor", "move");
        }
        else {
            dragRect.attr("cursor", "auto");
        }
    }
}
function hoverToggle(inputColor){
    document.getElementById("nonelabel").style.background = inputColor;
    if(!document.getElementById("signaling").checked){
        document.getElementById("signalinglabel").style.background = inputColor;
    }
    if(!document.getElementById("transcription").checked){
        document.getElementById("transcriptionlabel").style.background = inputColor;
    }
    if(!document.getElementById("epigenetics").checked){
        document.getElementById("epigeneticslabel").style.background = inputColor;
    }
    if(!document.getElementById("metabolism").checked){
        document.getElementById("metabolismlabel").style.background = inputColor;
    }
    if(!document.getElementById("extracellular").checked){
        document.getElementById("extracellularlabel").style.background = inputColor;
    }
    if(!document.getElementById("adhesion").checked){
        document.getElementById("adhesionlabel").style.background = inputColor;
    }
    if(!document.getElementById("ucr").checked){
        document.getElementById("ucrlabel").style.background = inputColor;
    }
}
//Zooming Stuff
//Used to keep track of the current minimum and maximum chromosomal positions visible in the visualization.
//Initially set to 1 and 2000000 (for development purposes). Eventually will be set to the actual length of the 
//chromosome. These are updated as you zoom in/out. 
var visibleChrLowPos = 1;
var visibleChrHighPos = chrLength;

var zoomedIn = false;
//Create keypress event listeners to perform zoom in on enter keypress and zoom out on escape keypress.
d3.select("body")
    .on("keydown", function() {
        //Enter key pressed, zoom to selection
        if (d3.event.keyCode == 13) {
            if(!document.getElementById('none').checked) {
                document.getElementById("none").disabled = true;
                document.getElementById("signaling").disabled = true;
                document.getElementById("transcription").disabled = true;
                document.getElementById("epigenetics").disabled = true;
                document.getElementById("metabolism").disabled = true;
                document.getElementById("extracellular").disabled = true;
                document.getElementById("adhesion").disabled = true;
                document.getElementById("ucr").disabled = true;
                hoverToggle("lightgray");
                var x = document.getElementById("dragwindow");
                x.style.display = "none"
                var y = document.getElementById("hoverexplain");
                y.style.display = "block"
                zoomedIn = true;
                getNewChrBoundaries();
                redrawDragRect(0 + leftMarginOffset, visibleChrWidth);
                redrawOverlaidChr(0 + leftMarginOffset, visibleChrWidth);
                redrawResizeHandles((-resizeHandleWidth/2) + leftMarginOffset, function() {return canvasWidth - leftMarginOffset - (resizeHandleWidth/2);});
                redrawGenes(true);
                redrawMiniMap();
                dragRect.attr("cursor", "auto")
                //dragHandleRight.attr("cursor", "auto")
                //dragHandleLeft.attr("cursor", "auto")
            }
        }
        //Escape key pressed, reset to initial view;
        if (d3.event.keyCode == 27) {
            if(!document.getElementById('none').checked) {
                dragRect.attr("cursor", "move");
                dragHandleRight.attr("cursor", "ew-resize");
                dragHandleLeft.attr("cursor", "ew-resize");
            }
            //Only reset chromosome if not zoomed all the way out already
            if (visibleChrLowPos == 1) {
                if (visibleChrHighPos != chrLength){
                    resetChromosome();
                    redrawGenes(false);
                    redrawMiniMap();
                    hideTooltip()
                    zoomedIn = false
                    document.getElementById("none").disabled = false;
                    document.getElementById("signaling").disabled = false;
                    document.getElementById("transcription").disabled = false;
                    document.getElementById("epigenetics").disabled = false;
                    document.getElementById("metabolism").disabled = false;
                    document.getElementById("extracellular").disabled = false;
                    document.getElementById("adhesion").disabled = false;
                    document.getElementById("ucr").disabled = false;
                    hoverToggle("");
                    var x = document.getElementById("dragwindow");
                    x.style.display = "block"
                    var y = document.getElementById("hoverexplain");
                    y.style.display = "none"
                }
            }
            else if (visibleChrHighPos == chrLength) {
                if (visibleChrLowPos != 1) {
                    resetChromosome();
                    redrawGenes(false);
                    redrawMiniMap();
                    hideTooltip()
                    zoomedIn = false
                    document.getElementById("none").disabled = false;
                    document.getElementById("signaling").disabled = false;
                    document.getElementById("transcription").disabled = false;
                    document.getElementById("epigenetics").disabled = false;
                    document.getElementById("metabolism").disabled = false;
                    document.getElementById("extracellular").disabled = false;
                    document.getElementById("adhesion").disabled = false;
                    document.getElementById("ucr").disabled = false;
                    hoverToggle("");
                    var x = document.getElementById("dragwindow");
                    x.style.display = "block"
                    var y = document.getElementById("hoverexplain");
                    y.style.display = "none"
                }
            }
            else {
                resetChromosome();
                redrawGenes(false);
                redrawMiniMap();
                hideTooltip()
                zoomedIn = false
                document.getElementById("none").disabled = false;
                document.getElementById("signaling").disabled = false;
                document.getElementById("transcription").disabled = false;
                document.getElementById("epigenetics").disabled = false;
                document.getElementById("metabolism").disabled = false;
                document.getElementById("extracellular").disabled = false;
                document.getElementById("adhesion").disabled = false;
                document.getElementById("ucr").disabled = false;
                hoverToggle("");
                var x = document.getElementById("dragwindow");
                x.style.display = "block"
                var y = document.getElementById("hoverexplain");
                y.style.display = "none"
            }
        }
    });

//Redraw the minimap window and guide-lines on zoom in/out
function redrawMiniMap() {
    newX = getXPosFromChrToSVGMiniMap(visibleChrLowPos) + leftMarginOffset;
    newWidth = getXPosFromChrToSVGMiniMap(visibleChrHighPos) + leftMarginOffset - newX;
    miniMapWindow.transition()
        .duration(500)
        .attr("x", newX)
        .attr("width", newWidth);

    leftLine.transition()
        .duration(500)
        .attr("x2", newX);

    rightLine.transition()
        .duration(500)
        .attr("x2", newX + newWidth);
}

//Redraw the resizings handles to stay with the draggable rectangle on zoom in/out. 
//Animated using the d3.transition function
function redrawResizeHandles(left, right) {
    dragHandleLeft.transition()
        .duration(500)
        .attr("x", left);

    dragHandleRight.transition()
        .duration(500)
        .attr("x", right);
}

//Redraw the draggable rectangle on zoom in/out
//Animated using the d3.transition function
function redrawDragRect(xPos, w) {
    draggableRectWidth = w;
    dragRect.transition()
        .duration(500)
        .attr("x", xPos)
        .attr("width", w);

}

//Redraw the overlaid chromosome on zoom in/out
//Animated using the d3.transition function
function redrawOverlaidChr(xPos, w) {
    overlaidChrRect.transition()
        .duration(500)
        .attr("x", xPos)
        .attr("width", w);

    overlaidQuad1.transition()
        .duration(500)
        .attr("x", xPos)
        .attr("width", w);
        
    overlaidQuad3.transition()
        .duration(500)
        .attr("x", xPos)
        .attr("width", w);
  
}

//Get new chromosome boundaries on zoom in/out. This will update the visible chromosome low/high positions and
//update the axes by calling redrawAxes.
function getNewChrBoundaries() {
    var newLowPos = getXPosFromSVGToChr(parseInt(dragRect.attr("x") - leftMarginOffset), visibleChrLowPos, visibleChrHighPos);
    var newHighPos = getXPosFromSVGToChr(parseInt(dragRect.attr("x") - leftMarginOffset) + parseInt(dragRect.attr("width")), visibleChrLowPos, visibleChrHighPos);
    visibleChrLowPos = newLowPos;
    visibleChrHighPos = newHighPos;

    redrawAxes(newLowPos, newHighPos);
    return newLowPos, newHighPos;
}

//Redraw the axes to reflect the zoom in/out.
//Animated using the d3.transition function
function redrawAxes(low, high) {
    // Update scale domain
    xAxisScale.domain([low, high]);
    
    // Update the axis
    xAxisGroup.transition()
        .duration(500)
        .call(xAxis);
}

//Redraw genes in the updated view (on zoom in/out).
function redrawGenes(hover) {
    //Remove all genes from previous view
    d3.select("#allGenes").selectAll("rect").remove();
    d3.select("#signalingGenes").selectAll("rect").remove();
    d3.select("#transcriptionGenes").selectAll("rect").remove();
    d3.select("#metabolismGenes").selectAll("rect").remove();
    d3.select("#epigeneticsGenes").selectAll("rect").remove();
    d3.select("#adhesionGenes").selectAll("rect").remove();
    d3.select("#extracellularGenes").selectAll("rect").remove();
    d3.select("#ucrGenes").selectAll("rect").remove();

    //Remove all genes from the quadrant lines
    d3.select("#allGenesQuad").selectAll("rect").remove();
    d3.select("#signalingGenesQuad").selectAll("rect").remove();
    d3.select("#transcriptionGenesQuad").selectAll("rect").remove();
    d3.select("#metabolismGenesQuad").selectAll("rect").remove();
    d3.select("#epigeneticsGenesQuad").selectAll("rect").remove();
    d3.select("#adhesionGenesQuad").selectAll("rect").remove();
    d3.select("#extracellularGenesQuad").selectAll("rect").remove();
    d3.select("#ucrGenesQuad").selectAll("rect").remove();


    //If the genes are included in new view (i.e chromosome start pos is visible), add them to the screen.
    for (var i = 0; i < allGenes.length; i++) {
        var currentGene = allGenes[i];
        if ((currentGene.startPos > visibleChrLowPos) & (currentGene.endPos < visibleChrHighPos)) {
            var viewStartPos = getXPosFromChrToSVG(currentGene.startPos, visibleChrLowPos, visibleChrHighPos) + leftMarginOffset;
            var viewEndPos = getXPosFromChrToSVG(currentGene.endPos, visibleChrLowPos, visibleChrHighPos) + leftMarginOffset;
            var geneWidthView = viewEndPos - viewStartPos;
            if (geneWidthView < 1){
                geneWidthView = 1;
            } 

            allGeneGroup.append("rect")
            .attr("x", viewStartPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneWidthView)
            .attr("fill", defaultGeneColor)
            .attr("fill-opacity", 1.0)
            //.attr("cursor", "move");

            allGeneGroup2.append("rect")
            .attr("x", viewStartPos)
            .attr("y", quad1YPos)
            .attr("height", geneHeight2)
            .attr("width", geneWidthView)
            .attr("fill", currentGene.colorEC)
            .attr("fill-opacity", 1.0)
            //.attr("cursor", "move");
            allGeneGroup2.append("rect")
            .attr("x", viewStartPos)
            .attr("y", quad3YPos)
            .attr("height", geneHeight2)
            .attr("width", geneWidthView)
            .attr("fill", currentGene.colorNn)
            .attr("fill-opacity", 1.0)

            addGeneByGroup(currentGene, viewStartPos, geneWidthView, hover);
        }
    }
}

//Add overlaid genes to their group with updated view.
function addGeneByGroup(curr, startPos, geneW, hover) {
    if(curr.color == "yellow") {
        signalingGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        signalingGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('signaling').checked){
            signalingGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("fill-opacity", 1.0)
            .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
             curr.colorEC + ',' + curr.colorNn + "')")
            .attr("onmouseout","hideTooltip()");
        } else {
            signalingGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("fill-opacity", 1.0);
        }
    }
    else if (curr.color == "blue") {
        transcriptionGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        transcriptionGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('transcription').checked){
            transcriptionGeneGroup.append("rect")
                .attr("x", startPos)
                .attr("y", chrYPos)
                .attr("height", geneHeight)
                .attr("width", geneW)
                .attr("fill", defaultGeneColor)
                .attr("fill-opacity", 1.0)
                .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
                curr.colorEC + ',' + curr.colorNn + "')")
            .attr("onmouseout","hideTooltip()");
        }else{
            transcriptionGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("fill-opacity", 1.0);
        }

    }
    else if (curr.color == "pink") {
        metabolismGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        metabolismGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('metabolism').checked){
            metabolismGeneGroup.append("rect")
                .attr("x", startPos)
                .attr("y", chrYPos)
                .attr("height", geneHeight)
                .attr("width", geneW)
                .attr("fill", defaultGeneColor)
                .attr("title",curr.localsymbol)
                .attr("fill-opacity", 1.0)
                .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
                curr.colorEC + ',' + curr.colorNn + "')")
                .attr("onmouseout","hideTooltip()");
        } else {
            metabolismGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0);
        }
    }
    else if (curr.color == "black") {
        epigeneticsGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        epigeneticsGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('epigenetics').checked){
        epigeneticsGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0)
            .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
            curr.colorEC + ',' + curr.colorNn + "')")
            .attr("onmouseout","hideTooltip()");
        }else{
            epigeneticsGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0);
        }
    }
    else if (curr.color == "purple") {
        adhesionGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        adhesionGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('adhesion').checked){
        adhesionGeneGroup.append("rect")
        .attr("x", startPos)
        .attr("y", chrYPos)
        .attr("height", geneHeight)
        .attr("width", geneW)
        .attr("fill", defaultGeneColor)
        .attr("title",curr.localsymbol)
        .attr("fill-opacity", 1.0)
        .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
        curr.colorEC + ',' + curr.colorNn + "')")
        .attr("onmouseout","hideTooltip()");
        }else {
            adhesionGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0);
        }
    }
    else if (curr.color == "orange") {
        extracellularGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        extracellularGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('extracellular').checked){
        extracellularGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0)
            .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
            curr.colorEC + ',' + curr.colorNn + "')")
            .attr("onmouseout","hideTooltip()");
        }else{
            extracellularGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0);
        }
    }     else if (curr.color == "grey") {
        ucrGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad1YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorNn)
        .attr("fill-opacity", 1.0);
        ucrGeneGroup2.append("rect")
        .attr("x", startPos)
        .attr("y", quad3YPos)
        .attr("height", geneHeight2)
        .attr("width", geneW)
        .attr("fill", curr.colorEC)
        .attr("fill-opacity", 1.0);
        if(hover && document.getElementById('ucr').checked){
        ucrGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0)
            .attr("onmousemove","showTooltip(evt, '" + curr.localsymbol+ ','+ curr.localECFold+','+ curr.localNnFold + ',' + 
            curr.colorEC + ',' + curr.colorNn + "')")
            .attr("onmouseout","hideTooltip()");
        }else{
            ucrGeneGroup.append("rect")
            .attr("x", startPos)
            .attr("y", chrYPos)
            .attr("height", geneHeight)
            .attr("width", geneW)
            .attr("fill", defaultGeneColor)
            .attr("title",curr.localsymbol)
            .attr("fill-opacity", 1.0);
        }
    }
}

//Function to handle resetting the chromosome to the initial view when the user hits the escape key.
//The axes are updated. The draggable rectangle is resized to only cover the chromosome locations that were covered
//on the zoomed in view. The resizing handles are also redrawn to stay with the draggable rectangle. 
function resetChromosome() {
    var rectLeftPos = getXPosFromChrToSVG(visibleChrLowPos, 1, chrLength) + leftMarginOffset;
    var rectRightPos = getXPosFromChrToSVG(visibleChrHighPos, 1, chrLength) + leftMarginOffset;
    visibleChrLowPos = 1;
    visibleChrHighPos = chrLength;
    redrawAxes(visibleChrLowPos, visibleChrHighPos);
    redrawDragRect(rectLeftPos, (rectRightPos - rectLeftPos));
    redrawOverlaidChr(rectLeftPos, (rectRightPos - rectLeftPos));
    redrawResizeHandles((rectLeftPos - (resizeHandleWidth / 2)), (rectRightPos - (resizeHandleWidth / 2)));
}


//Draw the initial chromosomes to the svg container.
drawInitialChromosomeLayout()

