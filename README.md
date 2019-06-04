# forum

## Getting Started

### Prerequisites

* node
* npm or yarn
* mysql database

### Installation


```
$ git clone ...
$ cd ...
$ npm install
```

### Setup database

For Mac user with homebrew:

```sh
# 安裝並啟動 mysql
$ brew install mysql
$ brew services start mysql

$ mysqladmin -u root password 'root'  # 設定 mysql 密碼
$ mysql -u root -p              # 進入 mysql shell
mysql> CREATE DATABASE forum;   # 建立資料庫（database）
```

Database Migration with sequelize-cli

```sh
$ npm install --save sequelize-cli
$ npx sequelize-cli db:drop  # drop 掉需要重新 create db
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all
```

### Start the app

```
$ npm start
```

Your app should now be running on http://localhost:3000.
