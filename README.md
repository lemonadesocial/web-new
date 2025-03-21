<a href="https://lemonade.social">
  <!-- <img alt="Event Platforms" src="/public/thumbnail.png"> -->
  <h1 align="center">Event Platforms</h1>
</a>

<p align="center">
  The <em>all-in-one</em> starter kit <br/>
  for building whitelabel event platform applications.
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
</p>
<br/>

## Introduction

This repository structure is based on Next.js. We have two frontends, the main and whitelabel app. We have a switching mechanism in place that decides whether to render the main or whitelabel app. You can enforce a specific app by running the appropriate build commands.

## Getting Started

Copy env.example to .env
```sh
cp .env.example .env
```
We have a standalone identiy management https://github.com/lemonadesocial/lemonade-identity. Follow its readme to run it locally, or remove the IDENTIY_URL in .env.local to use the staging identity app.
Authentication session is stored in cookie and local hostname must be `localhost.staging.lemonade.social`. Set this in your host file:


```
127.0.0.1	localhost.staging.lemonade.social
```

Start web:
```sh
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Tailwindcss](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/docs/home.html)
- [React](https://reactjs.org/docs)
- [Framer Motion](https://framermotion.framer.website/)

