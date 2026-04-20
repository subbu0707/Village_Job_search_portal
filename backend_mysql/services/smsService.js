// SMS Service for SMS notifications (Twilio integration)
const config = require('../config/config');

class SMSService {
  constructor() {
    // Initialize Twilio or other SMS provider
    // For now, this is a template
    this.provider = 'twilio'; // or 'aws-sns', 'nexmo', etc.
  }

  async sendSMS(phoneNumber, message) {
    try {
      // Validate phone number
      if (!this.isValidPhoneNumber(phoneNumber)) {
        return { success: false, message: 'Invalid phone number' };
      }

      // In production, integrate with Twilio or other SMS service
      console.log(`📱 SMS sent to ${phoneNumber}: ${message}`);

      return {
        success: true,
        message: 'SMS sent successfully',
        phoneNumber: phoneNumber,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ SMS error:', error);
      return { success: false, message: 'Failed to send SMS' };
    }
  }

  async sendOTPSMS(phoneNumber, otp) {
    const message = `Your Village Jobs Hub OTP is: ${otp}. Valid for 5 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  async sendApplicationNotificationSMS(phoneNumber, jobTitle) {
    const message = `You have a new application for: ${jobTitle}. Log in to view details.`;
    return this.sendSMS(phoneNumber, message);
  }

  async sendJobPostedSMS(phoneNumber, jobTitle) {
    const message = `Your job "${jobTitle}" has been posted on Village Jobs Hub!`;
    return this.sendSMS(phoneNumber, message);
  }

  isValidPhoneNumber(phoneNumber) {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\D/g, ''));
  }

  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    return phoneNumber.replace(/\D/g, '');
  }
}

module.exports = new SMSService();
