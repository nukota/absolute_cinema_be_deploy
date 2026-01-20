import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
      },
    });
  }

  /**
   * Send notification to users who saved a movie about a new showtime
   */
  async sendNewShowtimeNotification(
    email: string,
    data: {
      movie_title: string;
      showtime: string;
      cinema_name?: string;
    },
  ): Promise<void> {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 20px;">Lịch chiếu mới: ${data.movie_title}</h2>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #eee;">
          <p>Xin chào bạn,</p>
          <p>Phim <strong>${data.movie_title}</strong> vừa có lịch chiếu mới:</p>
          <ul>
            <li><strong>Thời gian:</strong> ${new Date(data.showtime).toLocaleString('vi-VN')}</li>
            ${data.cinema_name ? `<li><strong>Rạp:</strong> ${data.cinema_name}</li>` : ''}
          </ul>
          <p>Hãy kiểm tra và đặt vé nếu bạn quan tâm.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; margin-top: 12px;">© Cinema Booking System</div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@cinema.com',
        to: email,
        subject: `Lịch chiếu mới: ${data.movie_title}`,
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Failed to send new showtime notification:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(
    email: string,
    bookingData: {
      invoice_code: string;
      movie_title: string;
      cinema_name: string;
      cinema_address: string;
      showtime: string;
      ticket_price: number;
      seats: string[];
      products?: Array<{ name: string; quantity: number; price: number }>;
      total_amount: number;
      customer_name: string;
    },
  ): Promise<void> {
    const seatsStr = bookingData.seats.join(', ');

    // Build products HTML if any
    let productsHtml = '';
    if (bookingData.products && bookingData.products.length > 0) {
      const productRows = bookingData.products
        .map(
          (p) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; text-align: left;">${p.name}</td>
            <td style="padding: 8px; text-align: center;">${p.quantity}</td>
            <td style="padding: 8px; text-align: right;">${p.price.toLocaleString('vi-VN')} ₫</td>
            <td style="padding: 8px; text-align: right;">${(p.quantity * p.price).toLocaleString('vi-VN')} ₫</td>
          </tr>
        `,
        )
        .join('');

      const productTotal = bookingData.products.reduce(
        (sum, p) => sum + p.quantity * p.price,
        0,
      );

      productsHtml = `
        <div style="margin: 20px 0;">
          <h3 style="color: #333; margin: 10px 0;">Sản Phẩm Đã Đặt:</h3>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 5px; overflow: hidden;">
            <thead style="background: #f5f5f5;">
              <tr>
                <th style="padding: 10px; text-align: left; color: #333; font-weight: bold;">Sản Phẩm</th>
                <th style="padding: 10px; text-align: center; color: #333; font-weight: bold;">Số Lượng</th>
                <th style="padding: 10px; text-align: right; color: #333; font-weight: bold;">Giá</th>
                <th style="padding: 10px; text-align: right; color: #333; font-weight: bold;">Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; color: #333;">
              <strong>Tổng Sản Phẩm:</strong> <span style="color: #667eea; font-size: 16px; font-weight: bold;">${productTotal.toLocaleString('vi-VN')} ₫</span>
            </p>
          </div>
        </div>
      `;
    }

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Xác Nhận Đặt Vé Thành Công</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="margin-top: 0; color: #333;">Xin chào <strong>${bookingData.customer_name}</strong>,</p>
          <p style="color: #666;">Đơn đặt vé của bạn đã được xác nhận. Dưới đây là thông tin chi tiết:</p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 10px 0; color: #333;">
              <strong>Mã Đặt Vé:</strong> <span style="color: #667eea; font-weight: bold;">${bookingData.invoice_code}</span>
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Phim:</strong> ${bookingData.movie_title}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Rạp Chiếu:</strong> ${bookingData.cinema_name}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Địa Chỉ:</strong> ${bookingData.cinema_address}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Thời Gian:</strong> ${new Date(bookingData.showtime).toLocaleString('vi-VN')}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Giá Vé:</strong> <span style="color: #667eea; font-weight: bold;">${bookingData.ticket_price.toLocaleString('vi-VN')} ₫</span>
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Ghế:</strong> ${seatsStr}
            </p>
          </div>

          ${productsHtml}
          
          <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #333; font-size: 16px;">
              <strong>Tổng Tiền:</strong> <span style="color: #e74c3c; font-size: 20px; font-weight: bold;">${bookingData.total_amount.toLocaleString('vi-VN')} ₫</span>
            </p>
          </div>
          
          <div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #333; font-size: 13px;">
              <strong>⏰ Lưu Ý:</strong> Vui lòng đến rạp trước 15 phút để kiểm tra vé. Mang theo mã đặt vé này.
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2025 Cinema Booking System. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@cinema.com',
        to: email,
        subject: `Xác Nhận Đặt Vé - Mã: ${bookingData.invoice_code}`,
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellation(
    email: string,
    cancellationData: {
      invoice_code: string;
      movie_title: string;
      cinema_name: string;
      cinema_address: string;
      customer_name: string;
      refund_amount: number;
    },
  ): Promise<void> {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Hủy Đặt Vé</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Yêu cầu hủy của bạn đã được xử lý</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="margin-top: 0; color: #333;">Xin chào <strong>${cancellationData.customer_name}</strong>,</p>
          <p style="color: #666;">Đơn đặt vé của bạn đã được hủy thành công.</p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #f5576c; margin: 20px 0;">
            <p style="margin: 10px 0; color: #333;">
              <strong>Mã Đặt Vé:</strong> ${cancellationData.invoice_code}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Phim:</strong> ${cancellationData.movie_title}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Rạp Chiếu:</strong> ${cancellationData.cinema_name}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Địa Chỉ:</strong> ${cancellationData.cinema_address}
            </p>
            <p style="margin: 10px 0; color: #333; border-top: 1px solid #eee; padding-top: 10px;">
              <strong>Số Tiền Hoàn:</strong> <span style="color: #27ae60; font-size: 18px; font-weight: bold;">${cancellationData.refund_amount.toLocaleString('vi-VN')} ₫</span>
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 13px;">
              <strong>ℹ️ Thông Tin:</strong> Số tiền hoàn sẽ được chuyển vào tài khoản của bạn trong vòng 3-5 ngày làm việc.
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2025 Cinema Booking System. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@cinema.com',
        to: email,
        subject: `Hủy Đặt Vé - Mã: ${cancellationData.invoice_code}`,
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Send payment reminder email
   */
  async sendPaymentReminder(
    email: string,
    reminderData: {
      invoice_code: string;
      customer_name: string;
      cinema_name: string;
      cinema_address: string;
      ticket_price: number;
      total_amount: number;
      showtime: string;
    },
  ): Promise<void> {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Nhắc Nhở Thanh Toán</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Vé của bạn sắp hết hạn</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="margin-top: 0; color: #333;">Xin chào <strong>${reminderData.customer_name}</strong>,</p>
          <p style="color: #666;">Vé của bạn cần được thanh toán trước khi chiếu phim bắt đầu.</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 10px 0; color: #333;">
              <strong>Mã Đặt Vé:</strong> ${reminderData.invoice_code}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Rạp Chiếu:</strong> ${reminderData.cinema_name}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Địa Chỉ:</strong> ${reminderData.cinema_address}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Thời Gian Chiếu:</strong> ${new Date(reminderData.showtime).toLocaleString('vi-VN')}
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Giá Vé:</strong> <span style="color: #e74c3c; font-weight: bold;">${reminderData.ticket_price.toLocaleString('vi-VN')} ₫</span>
            </p>
            <p style="margin: 10px 0; color: #333;">
              <strong>Số Tiền Cần Thanh Toán:</strong> <span style="color: #e74c3c; font-weight: bold;">${reminderData.total_amount.toLocaleString('vi-VN')} ₫</span>
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2025 Cinema Booking System. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@cinema.com',
        to: email,
        subject: `Nhắc Nhở Thanh Toán - Mã: ${reminderData.invoice_code}`,
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Failed to send payment reminder email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}
