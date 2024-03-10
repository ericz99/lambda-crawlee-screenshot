import { Configuration, PuppeteerCrawler } from "crawlee";
import aws_chromium from "@sparticuz/chromium";

export const handler = async (event, context) => {
  console.log("event", event);
  console.log("context", context);

  const { queryStringParameters } = event;
  let urls = [];
  let result = null;

  if (!queryStringParameters) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      body: JSON.stringify({
        error: "Url is required in the query parameter!",
      }),
    };
  }

  // # add url
  urls.push(queryStringParameters["url"]);

  // TODO: add rate limit to api request

  const crawler = new PuppeteerCrawler(
    {
      requestHandler: async ({ page, request }) => {
        console.log("request", request);

        // # turns request interceptor on
        await page.setRequestInterception(true);

        // # if the page makes a  request to a resource type of image or stylesheet then abort that            request
        page.on("request", (request) => {
          if (request.resourceType() === "image") request.abort();
          else request.continue();
        });

        // # take screenshot
        const screenshot = await page.screenshot({
          fullPage: true,
          captureBeyondViewport: false,
        });

        // # convert into data:image base64
        const b64Data = screenshot.toString('base64');
        const dataURI = `data:image/jpeg;base64,${b64Data}`;

        // # update result 
        result = dataURI;
      },
      launchContext: {
        launchOptions: {
          executablePath: await aws_chromium.executablePath(),
          args: aws_chromium.args,
          headless: true,
        },
      },
    },
    new Configuration({
      persistStorage: false,
    })
  );

  await crawler.run(urls);

  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({
      data: result,
    }),
  };
};
