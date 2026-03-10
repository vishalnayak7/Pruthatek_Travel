import ContactService from "./contact.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class ContactController {

  constructor() {
    this.contactService = ContactService;
  }

  saveContactInfo = async (req, res, next) => {
    try {

      const data = await this.contactService.saveContactInfo(req.body);
      res.success("Contact info saved successfully", data, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

  getContactInfo = async (req, res, next) => {
    try {

      const data = await this.contactService.getContactInfo();
      res.success("Contact info fetched", data, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

  createMessage = async (req, res, next) => {
    try {

      const data = await this.contactService.createMessage(req.body);
      res.success("Message sent successfully", data, statusCode.CREATED);

    } catch (err) {
      next(err);
    }
  };

  getMessages = async (req, res, next) => {
    try {

      const data = await this.contactService.getAllMessages();
      res.success("Messages fetched", data, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };
}