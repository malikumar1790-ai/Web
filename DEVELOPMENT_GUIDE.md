# 🛠️ Development & Testing Guide

## 🚀 Contact Form Testing

### Development Mode (Local Testing)
When running `npm run dev`, the contact form works in **development mode**:

1. **Fill out the form** with your test data
2. **Click "Send Message"** 
3. **Alert popup appears** confirming submission
4. **Check browser console** for detailed logging
5. **Form clears automatically** after success

### Development Mode Features:
- ✅ **No actual emails sent** (to prevent spam during testing)
- ✅ **Console logging** shows what would be sent
- ✅ **Alert notification** explains development mode
- ✅ **Form validation** works exactly like production
- ✅ **Success animation** and form clearing

### Console Output Example:
```
📧 DEVELOPMENT MODE - Form submitted: 
   → Name: Ahmad Yasin
   → Email: mianahmadyasin786@gmail.com
   → Company: QAS Computer Trade
   → Service: Neural Networks & LLMs
   → Message: jkdl

✅ In production, emails will be sent to:
   → Admin notification: contact@nexariza.com
   → User confirmation: mianahmadyasin786@gmail.com
```

## 🌐 Production Mode (Live Website)

When deployed to production (Vercel, Netlify, etc.):
- ✅ **Real emails sent** to both admin and user
- ✅ **SMTP server used** (smtpout.secureserver.net)
- ✅ **Professional templates** delivered
- ✅ **No alert popups** (seamless experience)

## 🧪 Testing Commands

### Start Development Server:
```bash
npm run dev
```
Visit: http://localhost:5174/contact

### Test Email System (Production Mode):
```bash
node test-dual-email.js
```

### Build for Production:
```bash
npm run build
npm run preview
```

## 🔧 Troubleshooting

### Form Button Not Working:
1. **Check browser console** for error messages
2. **Verify development server is running** (npm run dev)
3. **Try refreshing the page**
4. **Fill all required fields** (Name, Email, Message)

### Common Issues:
- **Button doesn't respond**: Check if JavaScript errors in console
- **Form doesn't clear**: Check network tab for failed requests
- **No success message**: Verify handleSubmit function is working

### Development vs Production:
- **Development**: Shows alerts and console logs
- **Production**: Sends real emails silently

## 📱 Testing Checklist

### Before Deployment:
- [ ] Form submits successfully in development
- [ ] All required fields validate properly
- [ ] Success message appears after submission
- [ ] Form clears after successful submission
- [ ] Console shows correct form data
- [ ] Service dropdown works properly
- [ ] Email validation works

### After Deployment:
- [ ] Submit real test form
- [ ] Check contact@nexariza.com for admin email
- [ ] Check user email for confirmation
- [ ] Verify both emails have correct formatting
- [ ] Test from different devices/browsers

## 🎯 Current Status

✅ **Development Mode**: Working perfectly  
✅ **Email System**: Tested and confirmed  
✅ **Form Validation**: Active  
✅ **Success Handling**: Implemented  
✅ **Error Handling**: Comprehensive  

**Your contact form is ready for testing and deployment! 🚀**
