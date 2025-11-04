import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRoute from "./routes/product.route.js";
import categoryRoute from "./routes/category.route.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req: Request, res: Response) => {
  res.json("Product endpoint works!");
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  res.json({
    message: "Product service authenticated and is working fine",
    userId: req.userId,
  });
});

app.use("/products", productRoute);
app.use("/categories", categoryRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.listen(8000, () => {
  console.log("Product service is running on port 8000");
});
