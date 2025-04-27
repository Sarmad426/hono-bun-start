# **Hono** API with **Bun**

## Bun

Bun is a fast JavaScript runtime like Node or Deno. It uses the V8 engine and is powered by the JavaScriptCore engine from WebKit.

<https://bun.sh/>

## Hono

**Hono** is a small, fast, and modern web framework for building web applications in JavaScript and TypeScript.Hono is designed to be lightweight and efficient, making it ideal for building high-performance web applications. It is an alternative to other popular web frameworks like **Express**, **Koa**, and **Fastify**. Hono is built on top of the Fetch API and is designed to be compatible with the Web Platform. It is also designed to be extensible, allowing developers to create custom middleware and plugins to extend its functionality.

<https://hono.dev/>

## Getting Started

Ensure `bun` is installed on your system.

```bash
bun --version
```

Install the dependencies:

```bash
bun install
```
Run the application:

```bash
bun start
```

We are using vercel in this case. You can also use `bun dev` to run the application in development mode. This will automatically restart the server when you make changes to the code.

```bash
bun dev
```

This will run the `/api/basic-api.ts` file on port 3000. <http://localhost:3000>

This project is using typescript. But there is no compilation step. Bun runs typescript files directly.