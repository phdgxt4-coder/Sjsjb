const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {defineSecret}=require('firebase-functions/params');
const admin=require('firebase-admin');admin.initializeApp();
const KEY=defineSecret('ANTHROPIC_API_KEY'); // يتخزن في Secret Manager، مش في الكود ولا في الموقع
const SYSTEM='أنت مساعد تعليمي لطلاب المرحلة الثانوية في مصر. اشرح بالعربية المبسطة خطوة بخطوة وشجّع الطالب على الفهم. لا تساعد في الغش في الامتحانات، ولا تطلب أي بيانات شخصية، وارفض أي موضوع بعيد عن الدراسة بلطف.';
const DAILY=30;
exports.askAI=onCall({region:'europe-west1',secrets:[KEY],maxInstances:5,timeoutSeconds:60},async req=>{
  if(!req.auth)throw new HttpsError('unauthenticated','login');
  const db=admin.firestore(),u=(await db.doc('users/'+req.auth.uid).get()).data();
  if(!u||u.status!=='active'||u.role!=='student')throw new HttpsError('permission-denied','students only');
  const q=String((req.data&&req.data.q)||'').trim().slice(0,1000);
  if(!q)throw new HttpsError('invalid-argument','empty');
  const ref=db.doc(`aiUsage/${req.auth.uid}_${new Date().toISOString().slice(0,10)}`);
  await db.runTransaction(async t=>{const n=((await t.get(ref)).data()||{}).n||0;if(n>=DAILY)throw new HttpsError('resource-exhausted','limit');t.set(ref,{n:n+1})});
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':KEY.value(),'anthropic-version':'2023-06-01'},
    body:JSON.stringify({model:'claude-haiku-5-5',max_tokens:700,system:SYSTEM,messages:[{role:'user',content:q}]})});
  if(!r.ok)throw new HttpsError('internal','upstream');
  const j=await r.json();
  return {a:(j.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n')};
});
