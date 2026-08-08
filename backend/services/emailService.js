import nodemailer from 'nodemailer';

// Helper to construct SMTP transporter if credentials present
const createTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return null;
};

// Generic email sender with graceful console logger fallback
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();
        if (transporter) {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"StyleNest Orders" <orders@stylenest.com>',
                to,
                subject,
                text,
                html,
            });
            console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
        } else {
            console.log(`\n========================================`);
            console.log(`[EMAIL NOTIFICATION LOG]`);
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${text || subject}`);
            console.log(`========================================\n`);
        }
        return true;
    } catch (err) {
        console.error('[EMAIL ERROR]', err.message);
        return false;
    }
};

export const sendOrderPlacedEmail = async (order, userEmail) => {
    const email = userEmail || order.shippingAddress?.email || (order.user && order.user.email);
    if (!email) return;

    const subject = `Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()}`;
    const text = `Thank you for shopping at StyleNest! Your order #${order._id} has been placed successfully. Payment Method: ${order.paymentMethod}. Total: ₹${order.totalPrice}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1a202c; text-align: center;">StyleNest Order Confirmation</h2>
            <p>Hi <strong>${order.shippingAddress?.fullName || 'Valued Customer'}</strong>,</p>
            <p>Thank you for shopping with us! We have received your order and are processing it now.</p>
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id}</p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                <p style="margin: 5px 0;"><strong>Grand Total:</strong> ₹${order.totalPrice.toFixed(2)}</p>
            </div>
            <p>We will notify you once your package ships!</p>
        </div>
    `;

    return sendEmail({ to: email, subject, text, html });
};

export const sendOrderStatusEmail = async (order, newStatus) => {
    const email = order.shippingAddress?.email || (order.user && order.user.email);
    if (!email) return;

    const orderRef = `#${order._id.toString().slice(-8).toUpperCase()}`;
    const subject = `Order Status Update: ${newStatus} (${orderRef})`;
    const text = `Your order ${orderRef} status has been updated to: ${newStatus}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1a202c; text-align: center;">StyleNest Order Update</h2>
            <p>Hi <strong>${order.shippingAddress?.fullName || 'Valued Customer'}</strong>,</p>
            <p>Your order status has been updated to: <strong style="color: #d69e2e;">${newStatus}</strong></p>
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id}</p>
                <p style="margin: 5px 0;"><strong>Current Status:</strong> ${newStatus}</p>
                <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            </div>
            <p>Thank you for choosing StyleNest!</p>
        </div>
    `;

    return sendEmail({ to: email, subject, text, html });
};
