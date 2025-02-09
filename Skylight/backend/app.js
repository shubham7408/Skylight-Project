let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");
let indexRouter = require("./routes/index");
let config = require("./config/connection");
let axios = require("axios");
let app = express();
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");

require("dotenv").config();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

async function sendInteraction() {
  try {
    console.log("Sending POST request to set interaction");
    const response = await axios.post("http://localhost:3000/api/interaction", {
      duration: "SECOND",
      sdate: "2023-06-01T00:00:00Z",
      edate: "2023-06-02T23:59:59Z",
    });
    console.log("Response received:", response.data);
  } catch (e) {
    console.error(e);
  }
}

sendInteraction();

app.post("/generate-report", async (req, res) => {
  const { email, dateTimeRange } = req.body;
  const { sdate, edate } = dateTimeRange;
  const startDate = new Date(sdate);
  const endDate = new Date(edate);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedStartDate = new Intl.DateTimeFormat("en-US", options).format(
    startDate
  );
  const formattedEndDate = new Intl.DateTimeFormat("en-US", options).format(
    endDate
  );

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://localhost:5173/report", {
      waitUntil: "networkidle2",
    });
    const pdfBuffer = await page.pdf({ format: "A1" });
    await browser.close();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nisoojadhav@gmail.com",
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: "nisoojadhav@gmail.com",
      to: email,
      subject: `Network Analysis Report for Date: ${formattedStartDate} to ${formattedEndDate}`,
      text: "Please find attached your report.",
      attachments: [
        {
          filename: "report.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Report sent successfully.");
  } catch (error) {
    console.error("Error generating report or sending email:", error);
    res.status(500).send("An error occurred: " + error.message);
  }
});

module.exports = app;
