import smtplib

from email.mime.text import MIMEText
import ssl

msg = MIMEText("WARNING, FILE DOES NOT EXISTS, THAT MEANS UPDATES MAY DID NOT HAVE BEEN RUN")

msg['To'] = 'dltmdgh0611@gmail.com'
msg['From'] = 'forseminar1324@naver.com'
msg['Subject'] = "WARNING WARNING ON FIRE FIRE FIRE!"

print(msg.as_string())
# put your host and port here
s = smtplib.SMTP_SSL('smtp.naver.com:465')
s.login('forseminar1324', 'tiuygjhbnm,!')
s.sendmail('forseminar1324@naver.com', ['dltmdgh0611@gmail.com'], msg.as_string())
s.quit()
