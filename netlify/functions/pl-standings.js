exports.handler = async () => {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing FOOTBALL_DATA_TOKEN environment variable" }),
    };
  }

  try {
    const url = "https://api.football-data.org/v4/competitions/PL/standings";
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
