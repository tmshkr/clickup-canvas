import axios from "axios";

const { CANVAS_API_TOKEN } = process.env;

export const canvasClient = axios.create({
  baseURL: "https://canvas.instructure.com/api/v1",
  headers: {
    Authorization: `Bearer ${CANVAS_API_TOKEN}`,
  },
});

canvasClient.interceptors.request.use((config) => {
  if (config.params) {
    console.log(
      `Making request to ${config.url} params: ${JSON.stringify(config.params)}`
    );
  } else {
    console.log(`Making request to ${config.url}`);
  }

  return config;
});

canvasClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.status === 429) {
      console.error("Rate limited, waiting...");
      await new Promise((resolve) => {
        setTimeout(resolve, 10000);
      });
      return canvasClient(error.config);
    }
    return Promise.reject(error);
  }
);
