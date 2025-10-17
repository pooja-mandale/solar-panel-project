const asyncHandler = require("express-async-handler");
// const Contact = require("../models/contact.model");
const { checkEmpty } = require("../utils/checkEmpty"); // (if you have this util)
const Contact = require("../models/Contact");

exports.createContact = asyncHandler(async (req, res) => {
  try {
   
    const { firstName, lastName, email, adress, phone, message } = req.body;

    const { isError, error } = checkEmpty({
      firstName,
      lastName,
      email,
      adress,
      phone,
      message,
    })

    if (isError) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required", error });
    }

    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      adress,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
})
