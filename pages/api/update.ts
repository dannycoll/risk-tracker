import { NextApiRequest, NextApiResponse } from "next";
import knexConn from "../../database/knex";
import rp from "request-promise";
import $ from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const users = await knexConn("users").select("riskId");
  const usersArray = users.map((user: any) => user.riskId);
  users.forEach(async (user: any) => {
    const response = await rp(`https://www.hasbrorisk.com/en/player/${user}`);
    const rows = $("#season-2 > table > tbody > tr", response);
    const ffaPoints = rows[0];
    const ffaSkillPoints = (ffaPoints.children[3] as any).children[0].data;
    const ffaPosition = (ffaPoints.children[5] as any).children[0].data;
    const OnevOnePoints = rows[1];
    const OnevOneSkillPoints = (OnevOnePoints.children[3] as any).children[0]
      .data;
    const OnevOnePosition = (OnevOnePoints.children[5] as any).children[0].data;
    const time = new Date();
    await knexConn("stats").insert({
      riskId: user,
      ffaSkillPoints,
      ffaPosition,
      OnevOneSkillPoints,
      OnevOnePosition,
      time,
    });
    res.status(200).json({ message: "All done" });
  });
}
