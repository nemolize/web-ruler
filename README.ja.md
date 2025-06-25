![](https://github.com/nemolize/next-todo/workflows/production/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/nemolize/next-todo/branch/master/graph/badge.svg)](https://codecov.io/gh/nemolize/next-todo)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

# next-todo

[Next.js](https://nextjs.org/)を用いた Todo リスト管理のサンプルアプリケーション
[nuxt-todo](https://github.com/nemolize/nuxt-todo)の`Nuxt.js` での実装

Demo:
https://next-todo.netlify.com

##### 特徴
- 機能は Todo アイテムの `追加` と `削除` 及び `完了トグル`
- コンポーネント間通信方法の実装例として、削除時の確認用 `モーダルダイアログ` の実装を行った。
- 全て`Function Component`として実装しステート管理は `React Hooks` を利用して行っている。
- `LocalStorage`にデータを永続化している 

##### その他

- `Nuxt.js`のサンプルとしての立ち位置を重視し[TypeScript](https://www.typescriptlang.org/)は導入せず、Vanilla Next.jsでの実装とした。
- スタイル定義に[Bulma](http://bulma.io)を利用している
- デモサイトのデプロイに[Netlify](https://www.netlify.com/)を利用している
- CI/CD に[GitHub Actions](https://github.co.jp/features/actions)を利用している

## クローン

```bash
git clone git@github.com:nemolize/next-todo.git && cd next-todo
```

## ビルド

```bash
# 依存関係のインストール
$ pnpm install

# localhost:3000 で起動
$ pnpm dev

# ビルドして静的ファイルにエクスポート
$ pnpm build
```

## デプロイ

```bash
npx now out
```
