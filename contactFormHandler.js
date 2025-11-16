export const handler = async (event) => {
  const data = JSON.parse(event.body || "{}");

  return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",   
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          success: true,
          name: data.name,
          email: data.email,
          message: data.message
      })
  };
};