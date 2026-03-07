const Event = require("../models/Event");
const Temple = require("../models/Temple");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { templeId, eventName, description, date, startTime, endTime, location, capacity } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found"
      });
    }

    const event = await Event.create({
      templeId,
      eventName,
      description,
      date,
      startTime,
      endTime,
      location,
      capacity,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("templeId", "templeName location")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Events by Temple
exports.getEventsByTemple = async (req, res) => {
  try {
    const { templeId } = req.params;

    const events = await Event.find({ templeId })
      .populate("templeId", "templeName location")
      .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, description, date, startTime, endTime, location, capacity } = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { eventName, description, date, startTime, endTime, location, capacity },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
