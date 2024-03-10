# lambda-crawlee-screenshot

> Easy way to screenshot webpage without any problem using puppeteer + chromium + lambda api gateway

# How To Use?

1. First run command, `zip -r dependencies.zip ./node_modules` to zip node_modules because we will  upload the dependencies.zip as a Lambda Layer to AWS. Unfortunately, we cannot do this directly - there is a 50MB limit on direct uploads (and the compressed Chromium build is around that size itself). Instead, we'll upload it as an object into an S3 storage and provide the link to that object during the layer creation. [credit](https://crawlee.dev/docs/deployment/aws-browsers#managing-browser-binaries)

2. Once you have uploaded dependencies.zip into s3, then you can add it into the lambda layer.

3. Next, you will basically need to zip this repo without the node_modules, basically just the lambda handler function with the package*.json, then upload to AWS Lambda.

4. Lastly, you can choose which trigger you want to use for your lambda, personally API Gateway is the most used trigger. Follow the step below to succesfully create your API gateway.

    - Create new resource /api/screenshot
    - Enable CORS
    - Create new method "GET"
        - Enable lambda proxy integration
        - Add query string: url and make it required
    - Deploy your API, set to whatever stage name you want.
    - You can now test our your API, using your API link that was successfully generated and add the querystring `https://<your-api>?url=<someurl>`

## License

[MIT](./LICENSE) License © 2024 [Eric Zhang](https://github.com/ericz99)

