import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { repoUrl } = await request.json();

        if (!repoUrl) {
            return NextResponse.json(
                { error: "Repository URL is required" },
                { status: 400 }
            );
        }

        // Parse GitHub URL to extract owner and repo
        const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/\?#]+)/;
        const match = repoUrl.match(githubUrlPattern);

        if (!match) {
            return NextResponse.json(
                { error: "Invalid GitHub repository URL" },
                { status: 400 }
            );
        }

        const [, owner, repo] = match;
        const repoName = repo.replace(/\.git$/, ""); // Remove .git if present

        // Fetch repository data from GitHub API
        const repoResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    ...(process.env.GITHUB_TOKEN && {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    }),
                },
            }
        );

        if (!repoResponse.ok) {
            return NextResponse.json(
                { error: "Failed to fetch repository data" },
                { status: repoResponse.status }
            );
        }

        const repoData = await repoResponse.json();

        // Fetch README content
        let readmeContent = null;
        try {
            const readmeResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repoName}/readme`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        ...(process.env.GITHUB_TOKEN && {
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                        }),
                    },
                }
            );

            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                // Decode base64 content
                readmeContent = Buffer.from(
                    readmeData.content,
                    "base64"
                ).toString("utf-8");
            }
        } catch (error) {
            console.log("No README found");
        }

        // Fetch languages
        const languagesResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/languages`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    ...(process.env.GITHUB_TOKEN && {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    }),
                },
            }
        );

        const languages = languagesResponse.ok
            ? await languagesResponse.json()
            : {};

        // Extract relevant information
        const projectInfo = {
            name: repoData.name,
            fullName: repoData.full_name,
            description: repoData.description || "No description available",
            owner: {
                login: repoData.owner.login,
                avatarUrl: repoData.owner.avatar_url,
            },
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            watchers: repoData.watchers_count,
            openIssues: repoData.open_issues_count,
            language: repoData.language,
            languages: Object.keys(languages),
            topics: repoData.topics || [],
            homepage: repoData.homepage,
            createdAt: repoData.created_at,
            updatedAt: repoData.updated_at,
            pushedAt: repoData.pushed_at,
            defaultBranch: repoData.default_branch,
            license: repoData.license?.name,
            htmlUrl: repoData.html_url,
            readme: readmeContent
                ? readmeContent.substring(0, 500) // First 500 chars
                : null,
            size: repoData.size,
            isPrivate: repoData.private,
        };

        return NextResponse.json(projectInfo);
    } catch (error) {
        console.error("Error fetching GitHub repository:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
