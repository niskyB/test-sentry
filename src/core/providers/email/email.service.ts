import { Injectable } from '@nestjs/common';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import { monoEnum, monoLogger } from 'mono-utils-core';
import { config } from '../../config';
import { constant } from '../../constant';

@Injectable()
export class EmailService {
    constructor(private readonly mailService: MailService) {}

    private sendMail(receiver: string, subject: string, content: string) {
        const mail: MailDataRequired = {
            to: receiver,
            from: config.SENDGRID_SENDER,
            subject: subject,
            html: `<div>${content}</div>`,
            mailSettings: {
                sandboxMode: {
                    enable: config.NODE_ENV !== monoEnum.NODE_ENV_MODE.PRODUCTION,
                },
            },
        };

        return this.mailService
            .send(mail)
            .then(() => true)
            .catch((error) => {
                monoLogger.log(constant.NS.APP_ERROR, error.response.body);
                return false;
            });
    }

    async sendEmailForVerify(receiver: string, otp: string, name: string) {
        return await this.sendMail(
            receiver,
            'VERIFY EMAIL',
            `
            <html>
                <head>
                    <title></title>
                </head>
                <body>
                    <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center; border:1px solid; width:70%; margin:auto" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                        <div class="Unsubscribe--addressLine">
                            <p class="Unsubscribe--senderName" style="font-size:50px;line-height:32px">Verify Your Email</p>
                        </div>
                        <img src="https://fuquiz.s3.ap-southeast-1.amazonaws.com/logo-cutted.png" style="width:150px"/>
                        <p style="font-size:12px; line-height:20px;">
                        <p style="font-size:28px">Hello ${name}</p>
                        <p style="font-size:22px">We are from Tetcha Team</p>
                        <p style="font-size:18px; margin: 16px 0">Please click this button to verify your email</p>
                            <div style="margin: 50px 0">
                                <a class="Unsubscribe--unsubscribeLink" href="${config.CLIENT_URL}/auth/verify-email/${otp}" target="_blank" style="font-family:sans-serif;text-decoration:none; background-color:#2155CD; padding:12px 22px; font-size:18px; color: white; border-radius: 8px;">
                                Verify
                                </a>
                            </div>
                        </p>
                    </div>
                </body>
            </html>
        `,
        );
    }

    async sendResetPassword(receiver: string, otp: string, name: string) {
        return await this.sendMail(
            receiver,
            'RESET PASSWORD',
            `
            <html>
                <head>
                    <title></title>
                </head>
                <body>
                    <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center; border:1px solid; width:70%; margin:auto" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                        <div class="Unsubscribe--addressLine">
                            <p class="Unsubscribe--senderName" style="font-size:50px;line-height:32px">Reset Your Password</p>
                        </div>
                        <img src="https://fuquiz.s3.ap-southeast-1.amazonaws.com/logo-cutted.png" style="width:150px"/>
                        <p style="font-size:12px; line-height:20px;">
                        <p style="font-size:28px">Hello ${name}</p>
                        <p style="font-size:22px">We are from Tetcha Team</p>
                        <p style="font-size:18px; margin: 16px 0">Please click this button to reset your password</p>
                            <div style="margin: 50px 0">
                                <a class="Unsubscribe--unsubscribeLink" href="${config.CLIENT_URL}/auth/reset-password/${otp}" target="_blank" style="font-family:sans-serif;text-decoration:none; background-color:#2155CD; padding:12px 22px; font-size:18px; color: white; border-radius: 8px;">
                                Reset
                                </a>
                            </div>
                        </p>
                    </div>
                </body>
            </html>
        `,
        );
    }

    async sendPasswordForUser(receiver: string, name: string, password: string, email: string) {
        return await this.sendMail(
            receiver,
            'WELCOME TO FUQUIZ',
            `
            <html>
                <head>
                    <title></title>
                </head>
                <body>
                    <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center; border:1px solid; width:70%; margin:auto" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                        <div class="Unsubscribe--addressLine">
                            <p class="Unsubscribe--senderName" style="font-size:50px;line-height:32px">Your Account Information</p>
                        </div>
                        <img src="https://fuquiz.s3.ap-southeast-1.amazonaws.com/logo-cutted.png" style="width:150px"/>
                        <p style="font-size:12px; line-height:20px;">
                            <p style="font-size:28px">Hello ${name}</p>
                            <p style="font-size:22px">We are from Tetcha Team</p>
                            <p style="font-size:18px; margin: 16px 0">Your login email: ${email}</p>
                            <p style="font-size:18px; margin: 16px 0">Your password: ${password}</p>
                        </p>
                    </div>
                </body>
            </html>
        `,
        );
    }
}
