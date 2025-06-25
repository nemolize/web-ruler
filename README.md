![](https://github.com/nemolize/next-todo/workflows/production/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/nemolize/next-todo/branch/master/graph/badge.svg)](https://codecov.io/gh/nemolize/next-todo)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

# next-todo

A todo list manager example made with [Next.js](https://nextjs.org/).
`Next.js` version of [nuxt-todo](https://github.com/nemolize/nuxt-todo) implementatoin.

Demo:
https://next-todo.netlify.com

##### Features

- You can `add` or `delete` todo items, and `toggle` by clicking checkbox.
- `Modal dialog` for item delete confirm.
- `React Hooks` is used for state control.
- Persisting data to `LocalStorage`

##### Others

- While this application is intended to be an example of Nuxt.js, [TypeScript](https://www.typescriptlang.org/) is not used.
- [Bulma](http://bulma.io) for styling
  - `TodoList` component uses variable of `bulma` with `@import`
- [Netlify](https://www.netlify.com/) for demo site deploy
- [GitHub Actions](https://github.com/features/actions) for CI/CD

## Clone

```bash
git clone git@github.com:nemolize/next-todo.git && cd next-todo
```

## Build

```bash
# install dependencies
$ pnpm install

# serve with hot reload at localhost:3000
$ pnpm dev

# generate static project
$ pnpm build
```
