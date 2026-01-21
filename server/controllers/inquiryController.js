const Inquiry = require('../models/Inquiry'); // Assuming model exists in models/Inquiry.js
const { generateInquiryPDF } = require('../utils/pdfGenerator');
const nodemailer = require('nodemailer');

// Configure Request Transport (SMTP)
// In production, use environment variables!
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465, // 465 for SSL, 587 for TLS
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.createInquiry = async (req, res) => {
    try {
        const { name, email, note, arrivalDate, isDateNotConfirmed, travelers, connectOnWhatsapp, whatsappNumber } = req.body;

        // 1. Save to Database
        const newInquiry = new Inquiry({
            name,
            email,
            note,
            arrivalDate,
            isDateNotConfirmed,
            travelers,
            connectOnWhatsapp,
            whatsappNumber,
            status: 'new'
        });

        const savedInquiry = await newInquiry.save();

        console.log('Inquiry saved to DB:', savedInquiry._id);

        // 2. Generate PDF
        let pdfBuffer;
        try {
            pdfBuffer = await generateInquiryPDF(savedInquiry);
            console.log('PDF Generated Successfully');
        } catch (pdfErr) {
            console.error('PDF Generation Failed:', pdfErr);
            // Continue without PDF if fails, or handle error?
            // We'll continue but log it.
        }

        // 3. Send Email Notification (Automated)
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {

            const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

            // Construct WhatApp Click-to-Chat Link for Admin to use
            let whatsappLink = "";
            let adminMessageBody = "";

            if (connectOnWhatsapp && whatsappNumber) {
                // Clean number (remove spaces, etc)
                const cleanNumber = whatsappNumber.replace(/\D/g, '');


                // User Request: Bold "Destination/note:", New Line, Elephants/Trees/Waves. Hand wave fixed.
                // WhatsApp Bold is *text*. New line is \n.
                const rawMessage = `Hello ${name || 'Traveler'}! 👋\n\nWe have received your inquiry.\n\n*Note:* "${note || 'your holiday'}" 🌴\n\nOur team will connect with you shortly to plan your perfect Sri Lankan getaway! 🌊✨\n\nBest Regards,\nASK Travels🇱🇰`;
                const encodedMessage = encodeURIComponent(rawMessage);
                const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

                adminMessageBody = `
                    <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 10px 0;">
                        <p style="margin: 0 0 10px 0; color: #166534; font-weight: bold;">💎 VIP Guest prefers WhatsApp contact.</p>
                        <p style="margin: 0;">Name: <strong>${name}</strong></p>
                        <p style="margin: 0;">Number: <strong>${whatsappNumber}</strong></p>
                        <br>
                        <a href="${whatsappLink}" style="background-color:#25D366; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block;">Click to Chat on WhatsApp 💬</a>
                        <p style="font-size: 12px; color: #666; margin-top: 10px;"><em>Tip: Click the link to open chat, then drag & drop the PDF PDF into the WhatsApp window.</em></p>
                    </div>
                `;
            } else {
                adminMessageBody = `<p>User prefers Email contact: <a href="mailto:${email}">${email}</a></p>`;
            }

            // --- Send to Admin ---
            const mailOptionsAdmin = {
                from: `"ASK Travels System" <${process.env.SMTP_USER}>`,
                to: adminEmail,
                subject: `New Inquiry: ${note ? note.substring(0, 30) + '...' : 'Holiday Request'}`,
                html: `
                    <h2>✨ New Inquiry Received!</h2>
                    <p>You have a new lead from the website.</p>
                    <ul>
                        <li><strong>Guest Name:</strong> ${name}</li>
                        <li><strong>Note:</strong> ${note}</li>
                        <li><strong>Date:</strong> ${isDateNotConfirmed ? 'Not Confirmed' : new Date(arrivalDate).toLocaleDateString()}</li>
                        <li><strong>Travelers:</strong> ${travelers.adults} Ad, ${travelers.children} Ch</li>
                    </ul>
                    ${adminMessageBody}
            <p>See attached PDF for full details.</p>
            `,
                attachments: pdfBuffer ? [
                    {
                        filename: `Inquiry_${savedInquiry._id}.pdf`,
                        content: pdfBuffer
                    }
                ] : []
            };

            await transporter.sendMail(mailOptionsAdmin);
            console.log('Admin notification sent.');

            // --- Send to Customer (Confirmation) ---
            // Only send if we have a valid email AND they didn't strictly prefer WhatsApp (or if you want to send both, remove the check)
            // User requested: "if user select whatsapp ... don't try to send an email to customer"
            if (email && email.includes('@') && !connectOnWhatsapp) {
                const mailOptionsCustomer = {
                    from: `"ASK Travels" < ${process.env.SMTP_USER}> `,
                    to: email,
                    subject: `We received your inquiry! - ASK Travels`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2 style="color: #0e3a6c;">Thank you for contacting ASK Travels! 🌴</h2>
                            <p>Dear <strong>${name}</strong>,</p>
                            <p>We receive your inquiry regarding: </p>
                            <p><strong>${note}</strong> 🐘</p>
                            <p>One of our travel experts will review your details and contact you shortly to plan your perfect Sri Lankan getaway. ✨</p>
                            <p>A copy of your inquiry details is attached for your reference.</p>
                            <br>
                            <hr style="border: 0; border-top: 1px solid #eee;" />
                            <br>
                            <p style="margin-bottom: 5px;">Warm Regards,</p>
                            <p style="font-weight: bold; color: #0e3a6c; margin-top: 0;">ASK Travels Team</p>
                            <p style="font-size: 12px; color: #666;">Sri Lanka 🇱🇰</p>
                            <p style="font-size: 10px; color: #aaa; margin-top: 20px;">Ref: ${savedInquiry._id}</p>
                        </div>
                    `,
                    attachments: pdfBuffer ? [
                        {
                            filename: 'Your_Inquiry_Details.pdf',
                            content: pdfBuffer
                        }
                    ] : []
                };

                await transporter.sendMail(mailOptionsCustomer);
                console.log('Customer confirmation sent.');
            } else {
                console.log('Skipping customer email (WhatsApp preferred or no email provided).');
            }

        } else {
            console.log('SMTP Credentials missing. Skipping Email sending.');
        }

        res.status(201).json({ success: true, data: savedInquiry, message: 'Inquiry received and processed.' });

    } catch (error) {
        console.error('Inquiry Controller Error:', error);
        res.status(500).json({ success: false, error: 'Server Error processing inquiry' });
    }
};
