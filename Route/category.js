const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const category=require("../Controller/category");

const isAuth=require('../Middlware/is-Auth');

router.get("/category",isAuth,category.getAllCategory);

router.get("/category/:categoryId",isAuth,category.getCategory);

router.post("/category",
body('title')
.trim()
.isLength({ min: 5 }),isAuth,category.createCategory);

router.put("/category/:categoryId",
body('title')
.trim()
.isLength({ min: 5 }),isAuth,category.updateCateg);

router.delete("/category/:categoryId",isAuth,category.deleteCateg);

module.exports = router;