// services/githubSync.js
import prisma from "../prisma/prisma";
async function createCardFromIssue(issue:any) {
  await prisma.githubIssue.create({
    data: {
      title: issue.title,
      body: issue.body,
      url: issue.html_url,
      issueId: issue.id,
        source: "github",
        sourceId: issue.id,
        status: "to-do",     // adds to your "To Do" column
        label: "issue",
    }
  });
}

async function createCardFromPR(pr:any) {
  await prisma.githubIssue.create({
    data: {
      title: `PR: ${pr.title} ` ,
      body: pr.body,
      url: pr.html_url,
      issueId: pr.id,
      source: "github",
    
      sourceId: pr.id,
      status: "in-progress",     // adds to your "In Progress" column
      label: "pull-request",
    }
  });
}

async function moveCardToDone(issueTitle:string) {
  await prisma.githubIssue.updateMany({
    where: { title: issueTitle, source: "github" },
    data: { status: "done" }
  });
}

export { createCardFromIssue, createCardFromPR, moveCardToDone };