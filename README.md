# frontity-lambda

This project was bootstrapped with [Frontity](https://frontity.org/).

## Deploy to AWS lambda

### Create lambda function 

- Go to AWS console > lambda > Create Function
- Build your site locally with `npx frontity build`
- Create a new npm project with the [code](https://community.frontity.org/t/deploy-to-aws-lambda/814/8) for your lambda in `index.js`
- Copy the `build` from your frontity project to your lambda project
- Zip your lambda project code
- Update the lambda function code in aws with the zip (Function code > Action > Upload a .zip file)

Instead of building/copying/zipping/uploading you can also setup CI/CD with the [configuration from this repo](#CI/CD)

### Expose lambda function with API Gateway

**Create API**

- Go to AWS console > API Gateway > Create API
- Select the public REST API type
- Set the name
- In Endpoint Type select `Regional`

**Create Proxy method**

- In your API, select Actions > Create Method
- Set Method to `ANY`
- Select `Lambda Function` as integration type
- Mark `Use Lambda Proxy integration`
- And select the lambda function you previously created

This proxy will redirect all traffic from `/`, but your lambda should also process all possible routes, that is why we now need a proxy resource

**Create Proxy Resource**

- In your API, select Actions > Create Resource
- Mark `Configure as proxy resource`, this will autocomplete Name and Path inputs with necessary values.

**Deploy API**

- Don't forget to deploy the API with Actions > Deploy API
- Select or create a stage

So far the site is exposed but the url needs the stage name at the end, this will break the routing on the site, we can fix this by mapping a cloudfront distribution to the corresponding URL/stage.

### Map cloudfront to API/stage

- Go to AWS console > CloudFront > Create Distribution
- Web > Get started
- In `Origin Domain Name` enter the url provided by your API Gateway
- `Origin Path` will be the stage name
- Tweaks configs according your needs
- With custom domains you'll have to:
    * Add your domain to `Alternate Domain Names (CNAMEs)`
    * [Request](https://www.youtube.com/watch?v=Ge-dkZgqLKg) a certificate in AWS ACM
    * Set your SSL certificate in `SSL Certificate` field
- Once created you'll need to wait until it gets deployed

With this your site will be available in the cloudfront domain name.

**If you're using a custom domain you'll need to add an ALIAS record in your domain manager pointing to the cloudfront url.**

### CI/CD

This repo contains a circleci configuration and the code for the lambda function, to use this config you need to setup a context in circleci named `frontity` and add the variables below:

  - AWS Credentials of an IAM user with `AWSLambda_FullAccess` permissions
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
  - AWS region
      - `AWS_DEFAULT_REGION`
  - The name of your lambda function
      - `AWS_LAMBDA_NAME`