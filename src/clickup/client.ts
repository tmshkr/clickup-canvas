import axios from "axios";

const { CLICKUP_API_KEY } = process.env;

export const clickupClient = axios.create({
  baseURL: "https://api.clickup.com/api/v2",
  headers: {
    Authorization: CLICKUP_API_KEY,
  },
});

clickupClient.interceptors.request.use((config) => {
  if (config.params) {
    console.log(
      `Making request to ${config.url} params: ${JSON.stringify(config.params)}`
    );
  } else {
    console.log(`Making request to ${config.url}`);
  }

  return config;
});

clickupClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.status === 429) {
      console.error("Rate limited, waiting...");
      await new Promise((resolve) => {
        setTimeout(resolve, 10000);
      });
      return clickupClient(error.config);
    }
    return Promise.reject(error);
  }
);
