var margin = { top: 20, right: 10, bottom: 175, left: 75 },
	width = 1500 - margin.right - margin.left,
	height = 650 - margin.top - margin.bottom;

// On créé le SVG dans lequel on va tout inclure
var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.right + ")");

// Definition du scale de x
var xScale = d3.scale.ordinal()
	.rangeRoundBands([0,width], 0.2, 0.2);

// Définition du scale de y
var yScale = d3.scale.linear()
	.range([height, 0]);

// Définition de l'axe x
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom");

// Définition de l'axe y
var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left");

// Définition de la bulle tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// On charge le JSON, et on le traite
d3.json("api/tvshows", function(error, data) {
	if (error) throw error;
	
	// On range les résultats par ordre décroissant
	data.sort(function(a,b) {
		return a.Ranking - b.Ranking;
	});

	// Sur l'axe des abcisses, on souhaite afficher les titres
	xScale.domain(data.map(function(d) { return d.Title; }) );
	// Sur l'axe des ordonnées on affiche des entiers de 0 à 10 correspondant aux notes
	yScale.domain([0, 1100000]);

	// Affichange des barres, des "rectangles"
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
        .on("click", function(d) {
			var win = window.open(d.PageUrl, '_blank');
		})
		.on("mouseover", function(d) {
            var details = "<h2>#" + d.Ranking + " " + d.Title + " (" + d.ReleaseDate + ")</h2>";
            details += "<p>By : " + d.Creators + "</p>";
            details += "<p>Genres : " + d.Genres + "</p>";
            details += "<p>" + d.Synopsis.substring(0,150) + "...</p>";
            tooltip.transition()
                .duration(500)
                .style("opacity", .8);
            tooltip.html(details)
                .style("left", (d3.event.pageX + -100) + "px")
                .style("top", (d3.event.pageY + 30) + "px");
		})
		.on("mouseout", function(d) {
			d3.selectAll(".details").remove();
            tooltip.transition()
                .duration(300)
                .style("opacity", 0);
		})
		.attr("class", "bar")
		.attr("height", 0)
		.attr("y", height)
		.transition().duration(2000)
		.delay(function(d, i) { return i * 100; })
		.attr({
			"x": function(d) { return xScale(d.Title); },
			"y": function(d) { return yScale(nbWithoutCommas(d.NbVotes)); },
			"width": xScale.rangeBand(),
			"height": function(d) { return height - yScale(nbWithoutCommas(d.NbVotes)); }
		})
		// Pour le dégradé des couleurs
		.style("fill", function(d, i) { return "rgb(120, 20, " + (( i * 4) + 15) + ")" })
		.style("cursor", "pointer");

	svg.selectAll("text")
		.data(data)
		.enter()
		.append("text")
        .transition().duration(0)
		.delay(function(d, i) { return 2000 + (i * 100); })
		.text(function(d) { return d.Rating + "★"; })
			// Affichage & positionnement du titre du film en dessous de la barre correspondante
			.attr("x", function(d) { return xScale(d.Title) + xScale.rangeBand()/2; })
			// Affichage & positionnement de la note sur sa barre
			.attr("y", function(d) { return yScale(nbWithoutCommas(d.NbVotes)) - 10; })
				.style("fill", "#000")
				.style("font-weight", "bold")
				.style("text-anchor", "middle")
                .style("font-size", "10px");

	// On fait le xAxis
	// On fait le transform pour que les noms soient bien en bas
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
            .transition().duration(500)
                // .delay(function(d, i) { return i * 100; })
			// Attributs et style pour le positionemnt correct du titre en bas
			.attr("transform", "rotate(-50)")
			.attr("dx", "-.8em")
			.attr("dy", ".25em")
			.style("text-anchor", "end")

	// On fait le yAxis
	svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
        .append("text")
            .attr("y", 12)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .text("Nombre de votes");
});

function nbWithoutCommas(x) {
    let parts = x.toString().split(",");
    let newNb = "";
    for (i = 0; i < parts.length; i++) {
        newNb += parts[i];
    }
    return parseInt(newNb);
}
