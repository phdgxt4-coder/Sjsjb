# خطوات التشغيل (مرة واحدة، حوالي 10 دقايق)

1. ادخل console.firebase.google.com وأنشئ مشروع جديد، ثم أضف Web App وانسخ القيم الأربعة في `public/firebase-config.js`.
2. **Authentication** > Sign-in method > فعّل **Email/Password** فقط.
3. **Firestore Database** > Create database (Production mode).
4. **Rules**: انسخ محتوى `firestore.rules` والصقه واضغط Publish. (أو `firebase deploy --only firestore:rules`)
5. اعمل حساب عادي من الموقع، ثم من Firestore > users > مستند حسابك غيّر `role` إلى `admin` يدويًا. (ده الأدمن الوحيد، ومستحيل أي حد يعمل نفسه أدمن من الموقع.)
6. **Authentication > Settings > Authorized domains**: سيب دومين موقعك بس.
7. (مهم) **App Check** (reCAPTCHA v3) لمنع أي سكريبت خارجي من استخدام مشروعك.
8. للنشر: `firebase deploy` (بيطبّق الـ Headers الأمنية من firebase.json).

## ما يجب ألا يوجد في الموقع أبدًا
- Service Account / Admin SDK key، أو أي كلمات سر، أو مفاتيح API خاصة (مثل مفتاح Claude لاحقًا: يتحط في Cloud Functions مش في الواجهة).

## تحديث المرحلة 2
- انسخ `firestore.rules` الجديد وانشره (Publish) من جديد، وإلا النشر والعرض هيترفضوا.
- الحسابات التجريبية القديمة للطلاب مفيهاش صف: احذفها من Authentication وFirestore وسجّل من جديد.

## تحديث المرحلة 3
- انشر `firestore.rules` الجديد مرة تانية (Publish). مفيش Indexes مطلوبة.

## تحديث المرحلة 4
- انشر `firestore.rules` الجديد. جرّب القواعد في Rules Playground قبل التسليم (خصوصًا قراءة ولي الأمر لحضور ابنه).

## تحديث المرحلة 5
- **PWA:** من الموبايل (Chrome) افتح الموقع > "إضافة إلى الشاشة الرئيسية". الموقع لازم يكون على HTTPS (Firebase Hosting بيوفره).
- **الوضع الليلي:** الزر العائم 🌓 تحت الشمال.
- **المساعد الذكي (اختياري، يحتاج خطة Blaze):**
  1. فعّل Blaze (فيه حد مجاني، وحط تنبيه ميزانية في Google Cloud).
  2. `cd functions && npm install && cd ..`
  3. `firebase functions:secrets:set ANTHROPIC_API_KEY` (الصق مفتاح Claude API لما يسألك).
  4. `firebase deploy --only functions,hosting`
  - الحد 30 سؤال/يوم لكل طالب، والتحقق من الحساب على السيرفر. من غير الخطوات دي بيظهر "المساعد غير متاح الآن" وباقي المنصة شغالة عادي.
