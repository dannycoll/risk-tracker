// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import rp from "request-promise";
import $ from "cheerio";
import knex from "../../database/knex";
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  for (let page = 1; page <= 100; page++) {
    const response = await rp(
      `https://www.hasbrorisk.com/en/leaderboard/2/1/rankPoints/${page}`
    );
    console.log(page);
    //get stats table
    const rows = $(".risk-stats > tbody > tr", response);
    //parse each row
    for (let i = 0; i < rows.length; i++) {
      let name = (rows[i].children[3] as any).children[3].children[0].data;
      //replace spaces with underscores
      name = name.replace(/ /g, "_");
      const link = (rows[i].children[3] as any).children[3].attribs.href;
      const userId = link.split("/")[link.split("/").length - 1];
      //check if user exists
      let action = await knex("users").where("riskId", userId).select("*");
      if (action) action = action.length;
      if (action === 0) {
        try {
          await knex("users").insert({ username: name, riskId: userId });
          console.log("inserted", userId);
        } catch (e) {
          console.log(e);
        }
      } else if (action === 1) {
        try {
          await knex("users")
            .where({ riskId: userId })
            .update({ username: name, riskId: userId });
          console.log("updated", userId);
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log("error", userId);
      }
    }
  }
  res.status(200).json("All done");
}
