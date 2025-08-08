from django.core.mail import EmailMessage
from django.template.loader import render_to_string

def send_otp_email(email, code):
    subject = "Your Password Reset OTP"
    html_message = render_to_string("otp_email.html", {"email": email, "code": code})
    email_msg = EmailMessage(subject, html_message, to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()
