// webhooks/github.js
import crypto from 'crypto';
import { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { createCardFromIssue, createCardFromPR, moveCardToDone } from './cards';


function verifyGithubSignature(req:Request) {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET as string);
  const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex");
  return signature === digest;
}

export default (app: any) => {
  app.post("/webhooks/github", async (req:Request, res:Response) => {

    // Security check
    if (!verifyGithubSignature(req)) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.headers["x-github-event"];
    const payload = req.body;

    // ✅ New GitHub Issue → Create a card in your board
    if (event === "issues" && payload.action === "opened") {
      await createCardFromIssue(payload.issue);
    }

    // ✅ Issue Closed → Move card to Done
    if (event === "issues" && payload.action === "closed") {
      await moveCardToDone(payload.issue.title);
    }

    // ✅ New Pull Request → Create a card
    if (event === "pull_request" && payload.action === "opened") {
      await createCardFromPR(payload.pull_request);
    }

    res.sendStatus(200);
  });
};