// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import knexConn from "../../../database/knex";
import rp from "request-promise";
import $ from "cheerio";
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query;
  const user = await knexConn("users")
    .where("riskId", id)
    .orWhere("username", id)
    .select("*");
  const riskId = user[0].riskId;
  const response = await rp(`https://www.hasbrorisk.com/en/player/${riskId}`);
  const rows = $("#season-2 > table > tbody > tr", response);
  const ffaPoints = rows[0];
  const ffaSkillPoints = (ffaPoints.children[3] as any).children[0].data;
  const ffaPosition = (ffaPoints.children[5] as any).children[0].data;
  const OnevOnePoints = rows[1];
  const OnevOneSkillPoints = (OnevOnePoints.children[3] as any).children[0]
    .data;
  const OnevOnePosition = (OnevOnePoints.children[5] as any).children[0].data;
  const username = user[0].username;
  res.status(200).json({
    username,
    ffaSkillPoints,
    ffaPosition,
    OnevOneSkillPoints,
    OnevOnePosition,
  });
}
