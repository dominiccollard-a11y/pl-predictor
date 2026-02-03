// netlify/functions/pl-matches.js
exports.handler = async (event) => {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing FOOTBALL_DATA_TOKEN environment variable" }),
    };
  }

  // Season 2025 = 2025/26 in football-data.org
  const season = "2025";

 


  // status is OPTIONAL. If not provided, we DO NOT include it.
const qs = event.queryStringParameters || {};
const status = qs.status; // e.g. "FINISHED" or "SCHEDULED"

let url =
  "https://api.football-data.org/v4/competitions/PL/matches" +
  "?season=" + encodeURIComponent(season);

if (status) {
  url += "&status=" + encodeURIComponent(status);
}


  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": token },
    });

    const text = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          error: "football-data.org error",
          status: response.status,
          body: text.slice(0, 600),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Function failed", message: String(e.message || e) }),
    };
  }
};
