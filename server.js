const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51QT3ejL1tCSuZkMjWQ7Jfl7vdqS9II5DxWzv7xseIQWdz9JLii3qW6xeRcCvOvnj7WXmQO5q70elqvGAgm5cj27q00yiQryB6g"
);
const parser = require("body-parser");
const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("foodapp");
});
app.use(parser.json());
const port = 8080;
app.post("/create-payment-session", async (req, res) => {
    try{
        const { orderItems,orderId } = req.body;
        const params = {
          mode: "payment",
          submit_type: "pay",
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          shipping_options: [{ shipping_rate: "shr_1QU93SL1tCSuZkMjehKr4L3i" }],
          customer_email: "harika@gmail.com",
          line_items: orderItems.map((item) => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.name,
                  images: [item.image],
                  metadata: { productId: item.name },
                },
                unit_amount: item.price*100,
              },
              quantity: item.quantity,
            };
          }),
          success_url: `https://hmfoods.netlify.app/paymentSuccess/${orderId}`,
          cancel_url: "https://hmfoods.netlify.app/paymentFail",
        };
        const session = await stripe.checkout.sessions.create(params);
        console.log(orderItems, session);
        res.json(session);
    }catch(error){
        console.log(error);
    }
  
});
app.listen(port, () => {
  console.log("server running successfully");
});
