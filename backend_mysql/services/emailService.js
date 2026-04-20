// Email service for sending emails
const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
      }
    });
  }

  async sendWelcomeEmail(email, name) {
    try {
      await this.transporter.sendMail({
        from: config.SMTP_USER,
        to: email,
        subject: 'Welcome to Village Jobs Hub',
        html: `
          <h1>Welcome to Village Jobs Hub!</h1>
          <p>Dear ${name},</p>
          <p>Thank you for registering with us. You can now:</p>
          <ul>
            <li>Browse job opportunities in your area</li>
            <li>Post new jobs (if you are an employer)</li>
            <li>Connect with employers and job seekers</li>
          </ul>
          <p>Happy job hunting!</p>
          <p>Best regards,<br>Village Jobs Hub Team</p>
        `
      });
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }

  async sendJobPostedEmail(email, jobTitle, jobId) {
    try {
      await this.transporter.sendMail({
        from: config.SMTP_USER,
        to: email,
        subject: `Job Posted: ${jobTitle}`,
        html: `
          <h2>Your job has been posted successfully!</h2>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Job ID:</strong> ${jobId}</p>
          <p>Your job is now visible to all job seekers in the platform.</p>
          <p>Best regards,<br>Village Jobs Hub Team</p>
        `
      });
      console.log(`✅ Job posted email sent to ${email}`);
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }

  async sendApplicationConfirmationEmail(email, jobTitle) {
    try {
      await this.transporter.sendMail({
        from: config.SMTP_USER,
        to: email,
        subject: `Application Submitted: ${jobTitle}`,
        html: `
          <h2>Your application has been submitted!</h2>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p>Thank you for applying! The employer will review your application shortly.</p>
          <p>You will be notified once the employer responds.</p>
          <p>Best regards,<br>Village Jobs Hub Team</p>
        `
      });
      console.log(`✅ Application confirmation email sent to ${email}`);
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }

  async sendNotificationEmail(email, message, type) {
    try {
      await this.transporter.sendMail({
        from: config.SMTP_USER,
        to: email,
        subject: `Notification: ${type}`,
        html: `
          <h2>${type}</h2>
          <p>${message}</p>
          <p>Log in to your account to view more details.</p>
          <p>Best regards,<br>Village Jobs Hub Team</p>
        `
      });
      console.log(`✅ Notification email sent to ${email}`);
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }

  async sendPasswordResetEmail(email, resetLink) {
    try {
      await this.transporter.sendMail({
        from: config.SMTP_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset</h2>
          <p>You requested to reset your password.</p>
          <p><a href="${resetLink}">Click here to reset your password</a></p>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Village Jobs Hub Team</p>
        `
      });
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }
}

module.exports = new EmailService();
