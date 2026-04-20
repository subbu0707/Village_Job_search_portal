// OTP Service for email/SMS verification
const crypto = require('crypto');

class OTPService {
  constructor() {
    this.otpStore = new Map();
    this.OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
  }

  generateOTP(length = 6) {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  }

  async sendOTP(email) {
    try {
      const otp = this.generateOTP();
      this.otpStore.set(email, {
        code: otp,
        expiresAt: Date.now() + this.OTP_EXPIRY
      });

      console.log(`✅ OTP Generated for ${email}: ${otp}`);
      // In production, send via email service
      return { success: true, message: 'OTP sent to your email' };
    } catch (error) {
      console.error('❌ OTP error:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  async verifyOTP(email, otp) {
    try {
      const stored = this.otpStore.get(email);

      if (!stored) {
        return { success: false, message: 'OTP not found' };
      }

      if (Date.now() > stored.expiresAt) {
        this.otpStore.delete(email);
        return { success: false, message: 'OTP expired' };
      }

      if (stored.code !== otp) {
        return { success: false, message: 'Invalid OTP' };
      }

      this.otpStore.delete(email);
      return { success: true, message: 'OTP verified' };
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      return { success: false, message: 'Verification failed' };
    }
  }

  async resendOTP(email) {
    this.otpStore.delete(email);
    return this.sendOTP(email);
  }

  async clearExpiredOTPs() {
    for (const [email, data] of this.otpStore) {
      if (Date.now() > data.expiresAt) {
        this.otpStore.delete(email);
      }
    }
  }
}

module.exports = new OTPService();
