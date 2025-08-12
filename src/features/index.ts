import { Router } from "express";
const router = Router();

// Features
import user from "./user/route";
import auth from "./auth/route";
import products from "./products/route";
import category from "./category/route";
import brands from "./brands/route";
import blogs from "./blogs/route";
import wishlist from "./wishlist/route";
import coupon from "./coupons/route";
import cart from "./carts/route";
import contact from "./contact/route";
import colors from "./colors/route";
import orders from "./orders/route";
import blogCategory from "./blog-category/route";
import reviews from "./reviews/route";

router.use("/users", user);
router.use("/auth", auth);
router.use("/brands", brands);
router.use("/category", category);
router.use("/colors", colors);
router.use("/products", products);
router.use("/blogs", blogs);
router.use("/wishlist", wishlist);
router.use("/coupons", coupon);
router.use("/cart", cart);
router.use("/orders", orders);
router.use("/contact", contact);
router.use("/blog-category", blogCategory)
router.use("/", reviews)

export default router;
