import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch latest projects
        const isGithubPages = window.location.hostname.includes("github.io");
        const basePath = isGithubPages ? "/portfolio" : "";
        const projects = await fetchJSON(`${basePath}/lib/projects.json`);
        const latestProjects = projects.slice(0, 3);
        const projectsContainer = document.querySelector('.projects');

        if (projectsContainer) {
            renderProjects(latestProjects, projectsContainer, 'h2');
        }

        // ✅ Fetch GitHub Data (correctly waiting for it)
        const githubData = await fetchGithubData('rahul-sg');

        if (githubData) {
            console.log("GitHub Data Fetched:", githubData); // Debugging output

            const profileStats = document.querySelector('#profile-stats');

            if (profileStats) {
                profileStats.innerHTML = `
                    <h2>My GitHub Stats</h2>
                    <dl>
                        <div>
                            <dt>FOLLOWERS</dt>
                            <dd id="followers">${githubData.followers}</dd>
                        </div>
                        <div>
                            <dt>FOLLOWING</dt>
                            <dd id="following">${githubData.following}</dd>
                        </div>
                        <div>
                            <dt>PUBLIC REPOS</dt>
                            <dd id="public-repos">${githubData.public_repos}</dd>
                        </div>
                        <div>
                            <dt>PUBLIC GISTS</dt>
                            <dd id="public-gists">${githubData.public_gists}</dd>
                        </div>
                    </dl>
                `;
            } else {
                console.error("Error: #profile-stats div not found in index.html");
            }
        } else {
            console.error("Error: GitHub data not fetched correctly.");
        }
    } catch (error) {
        console.error("Error in index.js:", error);
    }
});
