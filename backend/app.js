require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.listen(process.env.PORT, () =>
  console.log("Backend running on port", process.env.PORT)
);
