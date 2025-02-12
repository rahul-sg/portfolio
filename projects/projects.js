import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let query = '';
let projects = [];

document.addEventListener("DOMContentLoaded", async () => {
    projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    const projectCountElement = document.getElementById("project-count");

    if (!projectCountElement) {
        console.error("Error: Could not find #project-count. Check if it's in the HTML.");
        return;
    }

    if (projects && Array.isArray(projects)) {
        renderProjects(projects, projectsContainer, 'h2');
        projectCountElement.textContent = projects.length;
        renderPieChart(projects);
    } else {
        console.error("Error: projects is not an array", projects);
        return;
    }

    const searchInput = document.querySelector('.searchBar');
    searchInput.addEventListener('input', (event) => {
        query = event.target.value.toLowerCase();
        
        let filteredProjects = projects.filter((project) => {
            let values = Object.values(project).join('\n').toLowerCase();
            return values.includes(query);
        });

        renderProjects(filteredProjects, projectsContainer, 'h2');
        projectCountElement.textContent = filteredProjects.length;
        renderPieChart(filteredProjects);
    });
});


function renderPieChart(projectsGiven) {
    let newSVG = d3.select("#projects-plot");
    newSVG.selectAll('path').remove();

    let legend = d3.select('.legend');
    legend.selectAll('*').remove();

    if (projectsGiven.length === 0) {
        return;
    }

    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let newData = newRolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(newData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let selectedIndex = -1;

    arcData.forEach((d, idx) => {
        let path = newSVG.append("path")
            .attr("d", arcGenerator(d))
            .attr("fill", colors(idx))
            .attr("data-index", idx)
            .attr("data-original-color", colors(idx))
            .style("cursor", "pointer")
            .on("click", function () {
                if (selectedIndex === idx) {

                    selectedIndex = -1;
                    newSVG.selectAll("path").each(function () {
                        let originalColor = d3.select(this).attr("data-original-color");
                        d3.select(this)
                            .attr("fill", originalColor)
                            .classed("selected", false);
                    });
                    legend.selectAll("li").classed("selected", false);
                    renderProjects(projectsGiven, document.querySelector('.projects'), 'h2');
                } else {

                    selectedIndex = idx;

                    newSVG.selectAll("path").each(function () {
                        let originalColor = d3.select(this).attr("data-original-color");
                        d3.select(this)
                            .attr("fill", originalColor)
                            .classed("selected", false);
                    });

                    d3.select(this).classed("selected", true);
                    legend.selectAll("li").classed("selected", false);
                    legend.select(`[data-index="${selectedIndex}"]`).classed("selected", true);

                    filterProjects(d.data.label);
                }
            });
    });

    newData.forEach((d, idx) => {
        legend.append('li')
            .attr("data-index", idx)
            .html(`<span class="swatch" style="background-color: ${colors(idx)}"></span> ${d.label} <em>(${d.value})</em>`)
            .style("cursor", "pointer")
            .on("click", function () {
                if (selectedIndex === idx) {
                    selectedIndex = -1;
                    newSVG.selectAll("path").each(function () {
                        let originalColor = d3.select(this).attr("data-original-color");
                        d3.select(this)
                            .attr("fill", originalColor)
                            .classed("selected", false);
                    });
                    legend.selectAll("li").classed("selected", false);
                    renderProjects(projectsGiven, document.querySelector('.projects'), 'h2');
                } else {
                    selectedIndex = idx;

                    newSVG.selectAll("path").each(function () {
                        let originalColor = d3.select(this).attr("data-original-color");
                        d3.select(this)
                            .attr("fill", originalColor)
                            .classed("selected", false);
                    });

                    newSVG.select(`[data-index="${selectedIndex}"]`).classed("selected", true);
                    legend.selectAll("li").classed("selected", false);
                    d3.select(this).classed("selected", true);

                    filterProjects(d.label);
                }
            });
    });
}

function filterProjects(selectedYear) {
    let filteredProjects = projects.filter(project => project.year === selectedYear);
    renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
}
