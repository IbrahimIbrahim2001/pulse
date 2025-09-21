import nodemailer from "nodemailer"

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
})


type User = {
    name: string,
    email: string
}

export async function sendVerificationEmail({
    user,
    url,
}: {
    user: User
    url: string
}) {
    const emailHtml = `
    <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Verify Your Email Address</h1>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 15px 0; color: #555;">
                Hi ${user.name || user.email},
              </p>
              <p style="margin: 0 0 15px 0; color: #555;">
                Thank you for signing up! Please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${url}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="margin: 15px 0 0 0; color: #777; font-size: 14px;">
                If the button doesn't work, you can copy and paste this link into your browser:
              </p>
              <p style="margin: 5px 0 0 0; color: #007bff; font-size: 14px; word-break: break-all;">
                ${url}
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
          </body>
        </html>`

    try {
        const info = await transporter.sendMail({
            from: `"Pulse"<${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify Your Email Address",
            html: emailHtml,
        })

        console.log("Email sent successfully:", info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("Error sending email:", error)
        return { success: false, error }
    }
}

// Alternative transporter for other email services (if you prefer)
export const createCustomTransporter = (config: {
    host: string
    port: number
    secure: boolean
    user: string
    pass: string
}) => {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass,
        },
    })
}
