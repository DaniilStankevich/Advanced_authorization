const nodemailer = require("nodemailer")

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,  // от кого исходит письмо
      to,                           // кому отправлем письмо
      subject: "Активация аккаунта на" + process.env.API_URL,
      text: "Здравствуйте",
      html: `
            <div/>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
            </div>
            `,
    })
  }
}

module.exports = new MailService()
