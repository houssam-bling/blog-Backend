import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from './app.js'; 

let authToken; // 👈 هنا غادي نخزنو الـ Token
let userId;    // 👈 هنا غادي نخزنو الـ ID ديال المستخدم

// 1. الاتصال بالداتابيز
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_URI);
});

// 2. قطع الاتصال
afterAll(async () => {
  await mongoose.disconnect();
});

// 3. قبل كل اختبار: نمسحو الداتا، ونخلقو مستخدم جديد وناخدو Token
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany(); 
  }

  // Fake SignUp
  const signUpResponse = await request(app)
    .post('/auth/SignUp')
    .set('Origin', 'http://localhost:5173')
    .send({
      fullname: "Test User",
      email: `test_${Date.now()}@example.com`, // إيميل فريد باش مايتعارضش
      password: "password123",
      gender: "male"
    });

  authToken = signUpResponse.body.token;
  userId = signUpResponse.body.User._id;
});

describe('Posts API', () => {
  
  it('GET /posts - كيرجع لائحة المنشورات وكود 200', async () => {
    const response = await request(app)
      .get('/posts')
      .set('Origin', 'http://localhost:5173');
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Posts'); 
  });
  it('POST /posts - كيرفض خلق منشور إلا مكنش مسجل الدخول (401)', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Origin', 'http://localhost:5173')
      .send({ postTitle: 'عنوان تجريبي طويل', postBody: 'محتوى تجريبي طويل بزاف' });

    expect(response.status).toBe(401); 
  });
  it('POST /posts - كيخلق منشور جديد ملي كيكون المستخدم مسجل الدخول (201)', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Origin', 'http://localhost:5173')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        postTitle: 'عنوان تجريبي طويل كفاية', 
        postBody: 'محتوى المنشور التجريبي اللي خاصو يكون طويل شوية' 
      });

    expect(response.status).toBe(201);
    expect(response.body.postTitle).toBe('عنوان تجريبي طويل كفاية');
   
    expect(response.body.author).toBe(userId); 
  });

  
  it('POST /posts - كيرفض المنشور إلا كان العنوان قصير بزاف (400)', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Origin', 'http://localhost:5173')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        postTitle: 'قصير',
        postBody: 'محتوى تجريبي طويل بزاف' 
      });
    expect(response.status).toBe(400);
  });

});